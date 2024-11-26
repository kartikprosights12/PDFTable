from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Body
from app.services.zerox_service import process_file_with_zerox
import os
from pathlib import Path
from app.services.litellm import call_model_with_prompt
router = APIRouter()

UPLOAD_DIR = "uploads"  # Directory to store uploaded files
OUTPUT_DIR = "output"   # Directory to save processed markdown
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@router.post("/")
async def process_uploaded_file_via_zerox(
    file: UploadFile = File(..., description="File to upload and process"),
    select_pages: list[int] = Query(None, description="List of pages to process (1-indexed)"),
    keys: str = Body(None, description="Custom system prompt for the model"),
    columnDefs: str = Body(None, description="Column definitions for the table")
):
    """
    Upload a file and process it using Zerox.
    """
    # Save the uploaded file to the upload directory
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    print("columnDefs", columnDefs)
    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {e}")

    try:
        # Process the file with Zerox
        print(keys)
        result = await process_file_with_zerox(
            file_path=file_path,
            output_dir=OUTPUT_DIR,
            select_pages=select_pages
        )
        result = await call_model_with_prompt(result.pages,columnDefs)
        return {"message": "File processed successfully", "result": result}
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)
