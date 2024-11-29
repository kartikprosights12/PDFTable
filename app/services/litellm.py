import os
import json
import re
from litellm import completion
from app.core.config import settings
from app.utils.validateResponse import validate_response


def generate_response_schema(columnDefs: str):
    # Parse the columnDefs string into a Python object
    columns = json.loads(columnDefs)  # Assuming columnDefs is a JSON string
    
    # Create schema dynamically
    schema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "page": {
                    "type": "integer",
                    "description": "The page number where the data was extracted."
                }
            },
            "required": ["page"],
            "additionalProperties": False
        }
    }

    # Add fields from columnDefs
    for column in columns:
        field = column["field"]
        schema["items"]["properties"][field] = {
            "type": "string",
            "description": f"The value extracted for {field}. Set to 'N/A' if not found."
        }

    return schema

async def call_model_with_prompt(content: str, columnDefs: str, max_tokens: int = 4096):
    model = settings.ZEROX_MODEL
    provider = settings.ZEROX_PROVIDER
    
    try:
        if not columnDefs:
            columnDefs = """{ headerName: "Document Name", field: "documentName" },
    { headerName: "Date", field: "Date" },
    { headerName: "Company Name", "page":"insert the page number", field: "companyName" },
    { headerName: "Company Description", "page":"insert the page number", field: "companyDescription" },
    { headerName: "Company Business Model", "page":"insert the page number", field: "companyBusinessModel" },
    { headerName: "Company Industry", "page":"insert the page number", field: "companyIndustry" },
    { headerName: "Revenue", "page":"insert the page number", field: "revenue" },
    { headerName: "Gross Profit", "page":"insert the page number", field: "grossProfit" },
    { headerName: "EBITDA", "page":"insert the page number", field: "ebitda" },
    { headerName: "Capex", "page":"insert the page number", field: "capex" }"""
            

        # Example format to guide the model      
        prompt = (
                f"You are a software developer working with JSON data. Extract the relevant information based on the column definitions provided below.\n"
                f"\nDOCUMENT CONTENT:\n{content}\n"
                f"\nCOLUMN DEFINITIONS:\n{columnDefs}\n"
                f"\nGenerate the JSON response strictly adhering to the following format. Only include keys that match the column definitions. Ensure that:\n"
                f"1. The response is in valid JSON format.\n"
                f"2. Keys in the JSON are in lowercase, with spaces replaced by underscores.\n"
                f"3. Include the page number for each data point. The `page` field must be a single integer representing the page number or `0` if the page number is unavailable. \n"
                f"4. If no data matches a column, use 'N/A' but only for the field and not for page.\n"
                f"5. The JSON must not contain extra fields or comments.\n"
                f"6. Combine multiple values for the same field into a single string, separated by commas.\n"
                f"7. Arrays and nested objects should be converted into a comma-separated string.\n"
                f"\nEXAMPLE OUTPUT FORMAT:\n"
                f"[{{\"field\": \"value\", \"page\": 1}}, {{\"field_name\": \"value\", \"page\": 2}}]\n"
            )             
        messages = [{"role": "user", "content": prompt}]
        print("prompt: \n\n  ", prompt)
        

        # Use the Completion class from litellm to call the API
        response = completion(
            model=f"{provider}/{model}",
            messages=messages,
            max_tokens=max_tokens
        )
        print("response from litellm: \n\n  ", response)
        raw_content = response["choices"][0]["message"]["content"]
        # Extract JSON portion from the response
        json_match = re.search(r"```json\n(.*?)\n```", raw_content, re.DOTALL)
        if not json_match:
            raise RuntimeError(f"Failed to find JSON in response. Full response:\n{raw_content}")
        
        json_content = json_match.group(1)
        print("Valid JSON response:", json.loads(json_content))
        # Parse JSON data
        try:
            parsed_data = json.loads(json_content)
            print("Valid JSON response:", parsed_data)
            validate_response(parsed_data)
        except json.JSONDecodeError as e:
            raise RuntimeError(f"Failed to decode JSON: {e}\nExtracted Content: {json_content}")
        
        # Return the parsed JSON data
        return {"message": "Successfully parsed JSON", "data": parsed_data}
    except Exception as e:
        raise RuntimeError(f"Failed to call LLM: {e}")


async def find_columns_from_prompt(query: str, max_tokens: int = 4096):
    
    try:
        prompt = (
            f"Given the user’s input text describing the contents of a document, suggest a list of relevant column names for a table that could be used to extract specific data from the attached document. "
            f"For example, if the document is related to financial data, suggest columns like 'EBITDA,' 'Revenue,' 'Profit,' 'Net Income,' etc. "
            f"The column names should be based on key terms and metrics mentioned in the user's input. "
            f"If the document relates to a different domain, such as marketing or HR, suggest relevant columns like 'Customer Acquisition Cost,' 'Employee Salary,' 'Lead Conversion Rate,' etc. "
            f"Make sure the suggestions are tailored to the specific domain and context provided in the input. "
            f"The response should be a JSON with column names and limit the number of columns to 10 max. "
            f"Here is the user's input: {query}"
        )        
        print("prompt: \n\n  ", prompt)
        messages = [{"role": "user", "content": prompt}]

        model = settings.ZEROX_MODEL
        provider = settings.ZEROX_PROVIDER
        # Use the Completion class from litellm to call the API
        response = completion(
            model=f"{provider}/{model}",
            messages=messages,
            max_tokens=max_tokens
        )
        print("response from litellm: \n\n  ", response)
        raw_content = response["choices"][0]["message"]["content"]
        json_match = re.search(r"```json\n(.*?)\n```", raw_content, re.DOTALL)
        if not json_match:
            raise RuntimeError(f"Failed to find JSON in response. Full response:\n{raw_content}")
        
        json_content = json_match.group(1)
        return {"message": "Successfully parsed JSON", "data": json_content}
    except Exception as e:
        raise RuntimeError(f"Failed to call model: {e}")
