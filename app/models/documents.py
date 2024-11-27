from sqlalchemy import Column, String, JSON, Text, Date, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Document(Base):
    __tablename__ = "user_documents"

    id = Column(String, primary_key=True, nullable=False)
    document_name = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    properties = Column(JSON, nullable=True)
    structure = Column(Text, nullable=True)
    updated_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)
    user = Column(String, nullable=False)
