from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.documents import Document
from app.models.user import User as UserModel

async def check_user_subscription_requirement(user_id: str, db: AsyncSession) -> bool:
    """
    Check if the user needs a subscription based on the number of documents uploaded
    and the subscription_skip flag in the user model.

    Args:
        user_id (str): The user ID to check.
        db (AsyncSession): Database session.

    Returns:
        bool: True if the user requires a subscription (uploaded more than 100 documents and subscription_skip is False),
              otherwise False.
    """
    try:
        # Fetch the user's subscription_skip status
        user_query = await db.execute(select(UserModel).where(UserModel.id == user_id))
        user_record = user_query.scalars().first()
        
        if not user_record:
            raise ValueError(f"User with ID {user_id} not found")
        print('skip', user_record.skip_subscription)
        # If subscription_skip is True, return False immediately
        if user_record.skip_subscription:
            return False

        # Query the number of documents uploaded by the user
        document_query = select(func.count(Document.id)).where(Document.user == user_id)
        document_result = await db.execute(document_query)
        document_count = document_result.scalar()

        # Return True if the user has uploaded more than 100 documents, else False
        return document_count > 100

    except Exception as e:
        raise RuntimeError(f"Failed to check subscription requirement: {str(e)}")
