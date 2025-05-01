from fastapi import APIRouter, HTTPException, Request, Depends
from sqlalchemy.orm import Session
from database_model import get_db  # Ensure get_db function is implemented in database_model
from database_model.user import User, verify_password  # User model from database_model
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for request validation
class LoginRequest(BaseModel):
    username: str
    password: str

# Login Route
@router.post("/login")
async def login(login_request: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_request.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not verify_password(login_request.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    # Store user in session
    request.session["user"] = user.username
    print("Session after login:", request.session)  # Debugging session content

    return {"message": "Login successful", "username": user.username}


# Profile Route
@router.get("/profile")
async def get_profile(request: Request, db: Session = Depends(get_db)):
    username = request.session.get("user")
    if not username:
        raise HTTPException(status_code=401, detail="User not authenticated")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "fullName": user.full_name or "Not Available",
        "username": user.username,
        "department": user.department or "Not Available",
        "createdAt": user.created_at.strftime("%Y-%m-%d %H:%M:%S")
    }
