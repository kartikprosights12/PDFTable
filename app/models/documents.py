from sqlalchemy import Column, String, JSON, Text, Date, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class Document(Base):
    __tablename__ = "user_documents"

    id = Column(String, primary_key=True, nullable=False)
    document_name = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    properties = Column(JSON, nullable=True)
    structure = Column(Text, nullable=True)
    updated_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    user = Column(UUID(as_uuid=True), nullable=False)
    file_url = Column(String, nullable=True)
    file_hash = Column(Text, unique=True, nullable=False)  # Add this column
