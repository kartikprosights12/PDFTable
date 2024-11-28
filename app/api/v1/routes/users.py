from fastapi import APIRouter, HTTPException, Body, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User as UserModel
from app.core.database import get_db
from datetime import datetime

router = APIRouter()

class User(BaseModel):
    app_metadata: dict
    given_name: str
    family_name: str
    name: str
    updated_at: datetime = Field(..., description="Timestamp with timezone")
    email: str
    email_verified: bool
    sub: str


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
