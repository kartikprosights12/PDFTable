from jsonschema import validate, ValidationError

# Define the schema
response_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "page": {"type": ["integer", "null"]}  # Page must be integer or null
        },
        "patternProperties": {
            "^(?!page$).*": {  # Matches any key except "page"
                "type": "string"  # Dynamic field values must be strings
            }
        },
        "required": ["page"],  # "page" is mandatory
        "minProperties": 2,  # Enforce at least "page" + one other field
        "additionalProperties": False  # Disallow unexpected keys
    }
}

# Validate the JSON response
def validate_response(response_json):
    try:
        validate(instance=response_json, schema=response_schema)
        return True
    except ValidationError as e:
        raise RuntimeError(f"Invalid JSON response: {e.message}")