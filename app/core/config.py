import os
import json

class Settings:
    PROJECT_NAME: str = "Prosights OS"
    EXTERNAL_API_URL: str = "http://example.com/process-file"
    ZEROX_MODEL: str = "gpt-4o"  # Update this based on your desired model
    ZEROX_PROVIDER: str = "openai"  # Update this to match the model's provider

    OPENAI_API_KEY="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"
    # Credentials (set these as environment variables or override here)
    ANTHROPIC_API_KEY = "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"

settings = Settings()
