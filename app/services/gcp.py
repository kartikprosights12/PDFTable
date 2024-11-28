from google.cloud import storage
from datetime import timedelta

def upload_to_gcp(bucket_name: str, file_path: str, folder: str, destination_blob_name: str) -> str:
    try:
        # Initialize the GCP client
        storage_client = storage.Client()

        # Get the bucket
        bucket = storage_client.bucket(bucket_name)

        # Create a full path with the folder
        blob_path = f"{folder}/{destination_blob_name}" if folder else destination_blob_name

        # Create a blob (object in the bucket)
        blob = bucket.blob(blob_path)

        # Upload the file
        blob.upload_from_filename(file_path)

        # Generate a signed URL valid for 1 hour
        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(hours=1),
            method="GET",
        )

        # Return the signed URL
        return url
    except Exception as e:
        raise RuntimeError(f"Failed to upload file to GCP: {str(e)}")
