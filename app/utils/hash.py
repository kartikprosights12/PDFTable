import hashlib


def compute_file_hash(file_path: str) -> str:
    """
    Compute SHA-256 hash of the file.
    Args:
        file_path (str): Path to the file.
    Returns:
        str: SHA-256 hash of the file.
    """
    hash_sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_sha256.update(chunk)
    return hash_sha256.hexdigest()