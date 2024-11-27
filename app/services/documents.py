from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import uuid4
from datetime import datetime
from app.models.documents import Document as DocumentModel
from app.models.user import User as UserModel  # Assuming the user model is named User

async def create_document_record(
    document_name: str,
    date: datetime,
    properties: dict,
    structure: str,
    user: str,
    db: AsyncSession
):
    """
    Create a document record in the database.

    Args:
        document_name (str): The name of the document.
        date (datetime): The date of the document.
        properties (dict): Additional properties as JSON.
        structure (str): Extracted structure of the document.
        user (str): The user who uploaded the document.
        db (AsyncSession): Database session.

    Returns:
        str: The ID of the created document.
    """
    try:
        # Generate a unique ID for the document
        document_id = str(uuid4())
        find_user_query = await db.execute(select(UserModel).where(UserModel.email == user))
        user_record = find_user_query.scalars().first()

        if not user_record:
            raise ValueError(f"User with email {user} not found")
        # Create a new document record
        new_document = DocumentModel(
            id=document_id,
            document_name=document_name,
            date=date,
            properties=properties,
            structure=structure,
            updated_at=datetime.utcnow(),
            user=user,
        )

        # Add to the database
        db.add(new_document)
        await db.commit()

        return document_id

    except Exception as e:
        await db.rollback()
        raise RuntimeError(f"Failed to create document record: {str(e)}")
