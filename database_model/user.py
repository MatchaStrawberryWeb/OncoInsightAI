from sqlalchemy import TIMESTAMP, Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship
from passlib.context import CryptContext
from .database import Base
from pydantic import BaseModel

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User model definition
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    department = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=True)

    # Establish relationship with UserActivityLog
    #activity_logs = relationship("UserActivityLog", back_populates="user")

# Pydantic model for responses
class UserProfile(BaseModel):
    username: str
    full_name: str | None
    department: str | None

    class Config:
        orm_mode = True

# Hash a password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verify a password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
