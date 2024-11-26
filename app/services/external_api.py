import requests
from app.core.config import settings
import os

def process_file_with_api(filename: str):
    """Send the file to an external API for processing."""
    url = settings.EXTERNAL_API_URL
    with open(os.path.join("uploads", filename), "rb") as f:
        response = requests.post(url, files={"file": (filename, f)})
    if response.status_code != 200:
        raise Exception(f"External API error: {response.text}")
    return response.json()
