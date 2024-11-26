# app/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app code and .env file
COPY . .

# Ensure the application uses the .env file
ENV ENV_FILE_PATH=/app/.env

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
