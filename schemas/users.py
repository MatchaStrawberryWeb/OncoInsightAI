from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database_model import get_db
from database_model.user import User, UserProfile, hash_password

router = APIRouter()

@router.get("/profile", response_model=UserProfile)
def get_user_profile(username: str, db: Session = Depends(get_db)):
    # Query the database for the user
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/register")
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
