import os
import json
import re
from litellm import completion
from app.core.config import settings

async def call_model_with_prompt(content: str, columnDefs: str, max_tokens: int = 4096):
    
    try:
        if not columnDefs:
            columnDefs = """{ headerName: "Document Name", field: "documentName" },
    { headerName: "Date", field: "Date" },
    { headerName: "Document Type", field: "documentType", desc: "Type of this document is like product, financial report, hr report" },
    { headerName: "Company Name", field: "companyName" },
    { headerName: "Company Description", field: "companyDescription" },
    { headerName: "Company Business Model", field: "companyBusinessModel" },
    { headerName: "Company Industry", field: "companyIndustry" },
    { headerName: "List of Management Team", field: "listOfManagementTeam" },
    { headerName: "Revenue", field: "revenue" },
    { headerName: "Revenue Growth", field: "revenueGrowth" },
    { headerName: "Gross Profit", field: "grossProfit" },
    { headerName: "EBITDA", field: "ebitda" },
    { headerName: "Capex", field: "capex" }"""
        # Example format to guide the model
        format = """[
          { "name": "John Doe", "education": "MIT", "experience": "Google", ... }
        ]"""        
        prompt = (
            f"You are a software developer who processes JSON data. Here is the text from the document:\n\n"
            f"{content}\n\n"
            f"Output the JSON from the document text in the format example below. "
            f"Do not use the example format as it is, just use it as a reference to structure your response:\n{format}\n\n"
            f"Only include the fields that are in the keys prompt and nothing else and the response should be in the same JSON format with same keys:\n{columnDefs}\n"
            f"Additionally:\n"
            f"- Render data into an API key-value structure for example {{ 'name': 'John Doe', 'education': 'MIT', 'experience': 'Google' }}.\n"
            f"- If the value is an array, split it into multiple rows, one per array item.\n"
            f"- There cannot be more than 1 level of nesting so if there is a nested array, just make it a string with comma separated values and don't create a new row for it.\n"
            f"- even if you have multiple data aginst the same key combine them into a string with comma separated values and don't create a new row for it.\n"
            f"- if you have a list of objects, make it a string with comma separated values and don't create a new row for it.\n"
            f"- when generating the json the key of the value has to be the field name from the columnDefs \n"
            f"- the field/key name in json should small case with spaces changed with _ \n"
            f"- no comments to be added in the json or code that you send, it needs to be just in pure json structure \n"
        )        
        messages = [{"role": "user", "content": prompt}]
        print("messages: \n\n  ", messages)
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
        # Extract JSON portion from the response
        json_match = re.search(r"```json\n(.*?)\n```", raw_content, re.DOTALL)
        if not json_match:
            raise RuntimeError(f"Failed to find JSON in response. Full response:\n{raw_content}")
        
        json_content = json_match.group(1)
        
        # Parse JSON data
        try:
            parsed_data = json.loads(json_content)
        except json.JSONDecodeError as e:
            raise RuntimeError(f"Failed to decode JSON: {e}\nExtracted Content: {json_content}")
        
        # Return the parsed JSON data
        return {"message": "Successfully parsed JSON", "data": parsed_data}
    except Exception as e:
        raise RuntimeError(f"Failed to call Anthropic: {e}")


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
        print("messages: \n\n  ", messages)
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
