import os
import uuid
from fastapi import APIRouter, HTTPException, Body, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.subscription import Subscription
from app.models.user import User as UserModel
from app.core.database import get_db
from datetime import datetime
from stripe import stripe
from sqlalchemy.sql import text

from app.services.subscription_validation import check_user_subscription_requirement

router = APIRouter()
stripe.api_key =  os.environ["STRIPE_KEY"]
PRICE_ID = os.environ["STRIPE_PRICE_ID"]
FRONTEND_URL = os.environ["FRONTEND_URL"]

class User(BaseModel):
    app_metadata: dict
    given_name: str
    family_name: str
    name: str
    updated_at: datetime = Field(..., description="Timestamp with timezone")
    email: str
    email_verified: bool
    sub: str

class CreateCheckoutLinkRequest(BaseModel):
    user_id: str

@router.post("")
async def create_user(
    user: User = Body(..., description="User object from the frontend"),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a user after verifying with Auth0 and store it in PostgreSQL.

    Args:
        user (User): User object from the frontend.
        db (AsyncSession): Database session.

    Returns:
        dict: Success or error response.
    """
    # Step 1: Insert user into the PostgreSQL database
    try:
        find_user = await db.execute(select(UserModel).where(UserModel.email == user.email))
        print('user.email', user.email)

        existing_user = find_user.scalars().first()

        if existing_user:
            return {"message": "User already exists", "user_id": existing_user.id}

        new_user = UserModel(
            sub=user.sub,
            email=user.email,
            given_name=user.given_name,
            family_name=user.family_name,
            name=user.name,
            updated_at=user.updated_at,
            email_verified=user.email_verified,
        )

        db.add(new_user)
        await db.commit()
        return {"message": "User created successfully", "user_id": new_user.id}

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/subscriptions/status")
async def check_subscription_status(user_id: str, db: AsyncSession = Depends(get_db)):
    """
    Check the subscription status of a user.

    Args:
        user_id (str): The user ID to check subscription for.
        db (AsyncSession): The database session.

    Returns:
        dict: Subscription status including expiry and requirement for subscription.
    """
    try:
        # SQL Query to fetch subscription details and evaluate expiry
        query = text("""
            SELECT
                subscriptions.user_id,
                subscriptions.status AS subscription_status,
                subscriptions.stripe_subscription_id,
                subscriptions.details,
                CASE
                    WHEN details->>'expires_at' IS NULL THEN 'no_expiry'
                    WHEN (details->>'expires_at') ~ '^[0-9]+$'
                         AND NOW() >= TO_TIMESTAMP((details->>'expires_at')::BIGINT) THEN 'expired'
                    WHEN (details->>'expires_at') ~ '^[0-9]+$'
                         AND NOW() < TO_TIMESTAMP((details->>'expires_at')::BIGINT) THEN 'active'
                    WHEN NOT ((details->>'expires_at') ~ '^[0-9]+$')
                         AND NOW() >= (details->>'expires_at')::timestamp THEN 'expired'
                    WHEN NOT ((details->>'expires_at') ~ '^[0-9]+$')
                         AND NOW() < (details->>'expires_at')::timestamp THEN 'active'
                    ELSE 'unknown'
                END AS status,
                CASE
                    WHEN (details->>'expires_at') ~ '^[0-9]+$'
                    THEN TO_CHAR(TO_TIMESTAMP((details->>'expires_at')::BIGINT), 'YYYY-MM-DD"T"HH24:MI:SSZ')
                    ELSE details->>'expires_at'
                END AS expires_at
            FROM
                subscriptions
            WHERE
                subscriptions.user_id = :user_id
            LIMIT 1;
        """)

        # Execute the query with SQLAlchemy
        result = await db.execute(query, {"user_id": user_id})
        subscription = result.mappings().first()

        # Check if the user needs a subscription based on document upload count
        subscription_required = await check_user_subscription_requirement(user_id, db)

        if not subscription:
            return {
                "user_id": user_id,
                "subscription_status": "none",
                "subscription_required": subscription_required,
                "is_expired": None,
                "expires_at": None
            }

        return {
            "user_id": subscription["user_id"],
            "subscription_status": subscription["subscription_status"],
            "subscription_id": subscription["stripe_subscription_id"],
            "details": subscription["details"],
            "status": subscription["status"],
            "expires_at": subscription["expires_at"],
            "subscription_required": subscription_required
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching subscription status: {str(e)}")

@router.post("/subscriptions/initiate")
async def create_checkout_link(
    request: CreateCheckoutLinkRequest, 
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a Stripe embeddable subscription link.

    Args:
        price_id (str): The Stripe price ID for the subscription.
        success_url (str): The URL to redirect to after successful checkout.
        cancel_url (str): The URL to redirect to if the user cancels checkout.

    Returns:
        dict: A Stripe checkout session URL.
    """
    try:
        find_user = await db.execute(select(UserModel).where(UserModel.id == request.user_id))
        existing_user = find_user.scalars().first()
        get_user_email = existing_user.email

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": PRICE_ID, "quantity": 1}],
            success_url=FRONTEND_URL + "/subscription/validate?session_id={CHECKOUT_SESSION_ID}",
            customer_email=get_user_email
        )
        return {"checkout_url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=500, detail=f"Stripe API error: {e.user_message}")
    
@router.post("/subscriptions/validate")
async def validate_subscription_session(
    session_id: str = Body(..., description="Stripe checkout session ID"),
    user_id: str = Body(..., description="Stripe checkout session ID"),
    db: AsyncSession = Depends(get_db)
):
    """
    Validate a Stripe session ID and create a subscription record.

    Args:
        session_id (str): The Stripe checkout session ID.
        db (AsyncSession): The database session.

    Returns:
        dict: Subscription details or an error if validation fails.
    """
    try:
        # Step 1: Retrieve the Stripe session details
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            print(session)
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Stripe API error: {e.user_message}")

        # Step 2: Extract relevant subscription and user details
        if not session.subscription or not session.customer:
            raise HTTPException(status_code=400, detail="Invalid session: Missing subscription or customer details.")

        stripe_subscription_id = session.subscription
        stripe_customer_id = session.customer
        user_email = session.customer_email  # Ensure customer_email is available in the session
        if not user_email:
            raise HTTPException(status_code=400, detail="Stripe session does not include user email.")

        # Step 3: Fetch user ID based on email
        user_query = await db.execute(select(UserModel).where(UserModel.id == user_id))
        user = user_query.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found for the given email.")

        user_id = user.id

        # Step 4: Check if the subscription already exists
        existing_subscription_query = await db.execute(
            select(Subscription).where(Subscription.stripe_subscription_id == stripe_subscription_id)
        )
        existing_subscription = existing_subscription_query.scalars().first()
        if existing_subscription:
            return {"message": "Subscription already exists", "subscription_id": existing_subscription.id, "status": existing_subscription.status}

        # Step 5: Create a new subscription record
        new_subscription = Subscription(
            id=str(uuid.uuid4()),
            user_id=user_id,
            stripe_subscription_id=stripe_subscription_id,
            stripe_customer_id=stripe_customer_id,
            status="active",  # Assuming active status for newly created subscriptions
            details=session,  # Storing the full session details as JSON
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        db.add(new_subscription)
        await db.commit()

        return {
            "message": "Subscription created successfully",
            "subscription_id": new_subscription.id,
            "user_id": user_id,
            "status": new_subscription.status,
        }

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to validate subscription session: {str(e)}")