# auth.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database_model.user import User  # Import the User model
from pydantic import BaseModel
from database_model.database_model import get_db  # Correct import statement


router = APIRouter()

# Request body model for login
class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Query the database for the user by username
    db_user = db.query(User).filter(User.username == request.username).first()
    
    # Check if the user exists
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username.")
    
    # Check if the password matches
    if db_user.password != request.password:  # Ideally, you'd hash the password
        raise HTTPException(status_code=401, detail="Incorrect password. Username is correct.")
    
    # If login is successful
    return {"message": "Login successful!"}
