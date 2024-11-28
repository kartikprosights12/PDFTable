from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy import UUID, select, cast
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User  # Ensure no circular dependency here
from app.models.documents import Document

router = APIRouter()

@router.get("/")
async def get_documents(
    user_email: str = Query(None, description="Filter documents by user email"),
    limit: int = Query(10, description="Number of documents to return per page"),
    offset: int = Query(0, description="Offset for pagination"),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve documents with optional filtering by user email and pagination.

    Args:
        user_email (str): Filter documents by user email.
        limit (int): Number of documents to return per page.
        offset (int): Offset for pagination.
        db (AsyncSession): Database session.

    Returns:
        dict: List of documents and total count.
    """

    try:
        # Step 1: Fetch the user ID based on the provided email
        user_id = None
        if user_email:
            user_query = await db.execute(select(User).where(User.email == user_email))
            user_record = user_query.scalars().first()
            if not user_record:
                return {"total_count": 0, "documents": []}
            user_id = user_record.id

        # Step 2: Build the documents query
        query = select(Document)
        if user_id:
            query = query.where(Document.user == cast(user_id, UUID))

        # Apply pagination
        query = query.limit(limit).offset(offset)

        # Execute query
        result = await db.execute(query)
        documents = result.scalars().all()

        # Step 3: Get total count for pagination
        total_query = select(Document)
        if user_id:
            total_query = total_query.where(Document.user == cast(user_id, UUID))
        total_result = await db.execute(total_query)
        total_count = len(total_result.scalars().all())

        # Return the documents
        return {
            "total_count": total_count,
            "documents": [
                {
                    "id": doc.id,
                    "document_name": doc.document_name,
                    "date": doc.date,
                    "properties": doc.properties,
                    "structure": doc.structure,
                    "updated_at": doc.updated_at,
                    "user": doc.user,
                }
                for doc in documents
            ],
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch documents: {str(e)}")