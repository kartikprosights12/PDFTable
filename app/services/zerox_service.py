import os
import json
import asyncio
from pyzerox import zerox
from app.core.config import settings

async def process_file_with_zerox(file_path: str, output_dir: str, select_pages=None):
    """
    Process a file using the pyzerox library.
    :param file_path: Local file path or URL.
    :param output_dir: Directory to save the processed markdown output.
    :param select_pages: Pages to process (int or list of ints).
    :param custom_prompt: Custom system prompt for the model.
    :return: Result of the processing.
    """
    # Set environment variables for pyzerox
    os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY
    # Run the zerox processing
    try:
        print(f"Processing file with Zerox: {settings.ZEROX_PROVIDER}/{settings.ZEROX_MODEL}")
        result = await zerox(
            file_path=file_path,
            model=f"{settings.ZEROX_PROVIDER}/{settings.ZEROX_MODEL}",
            output_dir=output_dir,
            # custom_system_prompt="\n these fields will act as column headers for a table. There will be a row for each field with the answer to the header field. this data needs to be structured in a way that is easy to parse into a table. \n" ,
            select_pages=select_pages
        )
        return result
    except Exception as e:
        raise RuntimeError(f"Error in processing file with Zerox: {e}")
