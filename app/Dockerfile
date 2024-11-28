# app/Dockerfile
FROM python:3.11-slim

WORKDIR /

RUN apt-get update && apt-get install -y --no-install-recommends \
    poppler-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
# Copy requirements file and install dependencies
COPY . ./app
COPY requirements.txt ./app/
RUN ls -lrt
RUN pip install --no-cache-dir -r ./app/requirements.txt
RUN ls -lrta

# Ensure the application uses the .env file
ENV ENV_FILE_PATH=/app/.env
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/prosights-gcp-creds.json

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]