from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr  # ✅ EmailStr for email validation
from .database import Base

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---------- SQLAlchemy User model ----------
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)  # ✅ Added email column
    created_at = Column(DateTime, server_default=func.now())

    activity_logs = relationship("UserActivityLog", back_populates="user")

# ---------- Pydantic models ----------
class UserBase(BaseModel):
    username: str
    full_name: str | None = None
    department: str | None = None
    email: EmailStr | None = None  # ✅ Added email

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: str | None = None

class UserRead(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ---------- Utilities ----------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
