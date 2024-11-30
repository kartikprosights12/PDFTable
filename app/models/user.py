from sqlalchemy import Column, String, Boolean, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
import uuid
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)  # UUID primary key
    sub = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    given_name = Column(String, nullable=True)
    family_name = Column(String, nullable=True)
    name = Column(String, nullable=True)
    skip_subscription = Column(Boolean, default=True)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow)  # Ensure timezone support
    email_verified = Column(Boolean, default=False)
