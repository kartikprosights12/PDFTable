from fastapi import APIRouter, File, Query, UploadFile, HTTPException
import os
from app.services.file_service import save_file, list_files_metadata
from app.services.litellm import find_columns_from_prompt

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    """Endpoint to upload a file."""
    try:
        file_path = save_file(file, UPLOAD_DIR)
        return {"message": "File uploaded successfully", "path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def list_files():
    """Endpoint to list all uploaded files."""
    return list_files_metadata(UPLOAD_DIR)

@router.get("/columns")
async def find_columns(query: str = Query(None, description="Search query for columns")):
    """Endpoint to list column names based on the query."""
    return await find_columns_from_prompt(query)  # Use `await` to resolve the coroutine
