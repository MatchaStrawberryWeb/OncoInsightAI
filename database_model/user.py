from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import TIMESTAMP, Column, DateTime, Integer, String, func
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .database import Base, get_db
from pydantic import BaseModel
from sqlalchemy.orm import relationship


app = FastAPI()

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
    activity_logs = relationship("UserActivityLog", back_populates="user")


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

# FastAPI route to get user profile
@app.get("/api/profile", response_model=UserProfile)
def get_user_profile(username: str, db: Session = Depends(get_db)):
    # Query the database for the user
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# FastAPI route to create a new user
@app.post("/api/register")
def create_user(username: str, password: str, department: str, full_name: str, db: Session = Depends(get_db)):
    # Check if user already exists
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create a new user
    hashed_password = hash_password(password)
    new_user = User(
        username=username,
        password_hash=hashed_password,
        department=department,
        full_name=full_name,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"detail": "User created successfully"}
