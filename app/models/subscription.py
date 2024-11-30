from sqlalchemy import Column, String, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

Base = declarative_base()

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)  # UUID primary key
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)  # Foreign key to User
    stripe_subscription_id = Column(String, unique=True, nullable=False)  # Stripe subscription ID
    stripe_customer_id = Column(String, nullable=False)  # Stripe customer ID
    status = Column(String, nullable=False, default="active")  # Subscription status (e.g., active, canceled)
    details = Column(JSON, nullable=True)  # Additional Stripe details as JSON
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)  # Subscription creation timestamp
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)  # Auto-update timestamp