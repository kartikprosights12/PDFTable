from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Body, Depends
from app.services.documents import create_document_record
from app.services.zerox_service import process_file_with_zerox
import os
from pathlib import Path
from app.services.litellm import call_model_with_prompt
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
import json
router = APIRouter()

UPLOAD_DIR = "uploads"  # Directory to store uploaded files
OUTPUT_DIR = "output"   # Directory to save processed markdown
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@router.post("/")
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
    print("columnDefs", columnDefs)
    print("user", user)
    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {e}")

    try:
        # Process the file with Zerox
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
        document_id = await create_document_record(file.filename, datetime.now(), final_result, structure_as_json, user, db)
        
        return {"message": "File processed successfully", "result": final_result, "document_id": document_id}
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)
