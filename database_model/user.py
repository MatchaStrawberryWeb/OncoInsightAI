from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, TIMESTAMP
from database_model.database import Base
from sqlalchemy.sql import func

# User class for defining users table
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Use string reference for ActivityLog
    activity_logs = relationship("UserActivityLog", back_populates="user")

# To hash a password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# To verify a password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Example function to get user by token (if required)
async def get_user_by_token(token: str):
    # Assuming you're using SQLAlchemy
    user = await session.query(User).filter(User.token == token).first()
    return user
