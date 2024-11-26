import requests
from typing import List, Dict
import os
def insert_records_to_airtable(
    table_name: str,
    records: List[Dict]
) -> Dict:
    """
    Call the Airtable API to insert records into a specific table.

    Args:
        base_id (str): The Airtable Base ID.
        table_name (str): The name or ID of the table.
        api_key (str): Airtable API key for authentication.
        records (List[Dict]): A list of records to insert into the table.

    Returns:
        Dict: The response from the Airtable API.
    """
    base_id = os.environ["AIRTABLE_BASE_ID"]
    api_key = os.environ["AIRTABLE_API_KEY"]
    url = f"https://api.airtable.com/v0/{base_id}/{table_name}"
    print(f"url: \n\n {url}")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {"records": [{"fields": record} for record in records]}
    print(f"payload: \n\n {payload}")
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an error for HTTP status codes 4xx/5xx
        print(f"response: \n\n {response.json()}")  
        return response.json()
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Airtable API request failed: {e}")
