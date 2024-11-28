from fastapi import FastAPI
from app.api.v1.routes import documents, files, process, users
from fastapi.middleware.cors import CORSMiddleware


origins = [
   "*"  # Allow all origins (use with caution in production)
]

app = FastAPI(title="FastAPI Enterprise Application")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies and credentials
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(files.router, prefix="/api/v1/files", tags=["Files"])
app.include_router(process.router, prefix="/api/v1/process", tags=["Processing"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["Documents"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Enterprise Application"}
