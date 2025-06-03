from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database_model import get_db
from database_model.user import User, UserProfile, hash_password
from pydantic import BaseModel, EmailStr

router = APIRouter()

# Pydantic model for registration request
class UserRegisterRequest(BaseModel):
    username: str
    password: str
    department: str | None = None
    full_name: str | None = None
    email: EmailStr

@router.get("/profile", response_model=UserProfile)
def get_user_profile(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register")
def create_user(user_data: UserRegisterRequest, db: Session = Depends(get_db)):
    # Check if username or email already exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        password_hash=hashed_password,
        department=user_data.department,
        full_name=user_data.full_name,
        email=user_data.email
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"detail": "User created successfully"}
