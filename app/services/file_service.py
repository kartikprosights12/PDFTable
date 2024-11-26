import os
from fastapi import UploadFile

def save_file(file: UploadFile, upload_dir: str) -> str:
    """Save an uploaded file to the server."""
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    return file_path

def list_files_metadata(upload_dir: str):
    """List all files in the upload directory."""
    files = os.listdir(upload_dir)
    return [{"filename": file, "path": os.path.join(upload_dir, file)} for file in files]