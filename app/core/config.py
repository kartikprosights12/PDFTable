import os
from dotenv import load_dotenv

load_dotenv() 

class Settings:
    PROJECT_NAME: str = "Prosights OS"
    ZEROX_MODEL: str = "gpt-4o"  # Update this based on your desired model
    ZEROX_PROVIDER: str = "openai"  # Update this to match the model's provider

    OPENAI_API_KEY=os.environ["OPENAI_API_KEY"]
    # Credentials (set these as environment variables or override here)
    ANTHROPIC_API_KEY =os.environ["ANTHROPIC_API_KEY"]

settings = Settings()
