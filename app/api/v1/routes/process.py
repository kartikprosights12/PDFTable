from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Body, Depends
from sqlalchemy import select
from app.services.documents import create_document_record
from app.services.gcp import upload_to_gcp
from app.services.zerox_service import process_file_with_zerox
import os
from app.services.litellm import call_model_with_prompt
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
import json
from app.models.documents import Document
from app.utils.hash import compute_file_hash

router = APIRouter()

UPLOAD_DIR = "uploads"  # Directory to store uploaded files
OUTPUT_DIR = "output"   # Directory to save processed markdown
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
GCP_BUCKET_NAME = os.getenv("GCP_BUCKET_NAME")

@router.post("")
async def process_uploaded_file_via_zerox(
    file: UploadFile = File(..., description="File to upload and process"),
    select_pages: list[int] = Query(None, description="List of pages to process (1-indexed)"),
    user: str = Body(None, description="User ID"),
    columnDefs: str = Body(None, description="Column definitions for the table"),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload a file and process it using Zerox.
    """
    # Save the uploaded file to the upload directory
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {e}")
    
    gcp_file_url = upload_to_gcp(GCP_BUCKET_NAME, file_path, 'prism-documents', file.filename)

    try:

        file_hash = compute_file_hash(file_path)
        # Check if the file already exists in the database
        existing_doc_query = await db.execute(select(Document).where(Document.file_hash == file_hash))
        existing_doc = existing_doc_query.scalars().first()
        print("found an existing document", existing_doc)

        if existing_doc:
            # If the file exists, update the document data
            final_result = await call_model_with_prompt(json.loads(existing_doc.structure), columnDefs)
            document_id = await create_document_record(file.filename, datetime.now(), final_result, existing_doc.structure, user, db, gcp_file_url, file_hash)

            return {
                "message": "File already exists. Updated document data.",
                "document_id": existing_doc.id,
                "result": final_result,
                "document_url": gcp_file_url
            }
        else:
            
            result = await process_file_with_zerox(
            file_path=file_path,
            output_dir=OUTPUT_DIR,
            select_pages=select_pages
        )
        
        structure_as_json = json.dumps([
            {"content": page.content, "content_length": page.content_length, "page": page.page}
            for page in result.pages
        ])
        final_result = await call_model_with_prompt(result.pages,columnDefs)
        document_id = await create_document_record(file.filename, datetime.now(), final_result, structure_as_json, user, db, gcp_file_url, file_hash)
        
        return {"message": "File processed successfully", "result": final_result, "document_id": document_id}
        
        # Process the file with Zerox
       
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)


@router.post("/update")
async def update_document_data(
    payload: dict = Body(..., description="Payload containing document ID and new columns"),
    db: AsyncSession = Depends(get_db)
):
    """
    Update document data with new columns using document structure and AI model.

    Args:
        payload (dict): JSON payload containing `documentId` and `newColumns`.
        db (AsyncSession): Database session.

    Returns:
        dict: Updated document data for new columns.
    """
    try:
        # Extract input values from payload
        document_id = payload.get("documentId")
        new_columns = payload.get("newColumns")

        if not document_id or not new_columns:
            raise HTTPException(status_code=400, detail="Document ID and new columns are required.")

        # Fetch the document from the database
        query = await db.execute(select(Document).where(Document.id == document_id))
        document = query.scalars().first()

        if not document:
            raise HTTPException(status_code=404, detail="Document not found.")

        # Get the document structure from the database
        document_structure = json.loads(document.structure)  # Ensure the structure is deserialized

        # Prepare column definitions for the model
        column_defs = json.dumps(new_columns)

        # Call the model with document structure and new columns
        updated_data = await call_model_with_prompt(document_structure, column_defs)

        # Return the updated data
        return {
            "message": "Document updated successfully",
            "document_id": document_id,
            "result": updated_data,
            "document_url": document.file_url
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update document: {str(e)}")