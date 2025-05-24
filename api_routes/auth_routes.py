from fastapi import APIRouter, HTTPException, Request, Depends
from sqlalchemy.orm import Session
from api_routes.users_routes import LoginRequest
from database_model import User
from database_model.user import verify_password, hash_password
from database_model import get_db
from database_model.activity_log import UserActivityLog
from datetime import datetime

router = APIRouter()

# Login Route
@router.post("/login")
async def login(login_request: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_request.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not verify_password(login_request.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    # Store username in session
    request.session["user"] = user.username

    # Log login activity
    log = UserActivityLog(
        user_id=user.id,
        activity_type="login",
        details=f"User {user.username} logged in at {datetime.now().isoformat()}"
    )
    db.add(log)
    db.commit()

    return {"access_token": user.username}

@router.post("/logout")
async def logout(request: Request, db: Session = Depends(get_db)):
    username = request.session.get("user")
    if not username:
        raise HTTPException(status_code=401, detail="User not authenticated")

    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ Log logout activity
    log = UserActivityLog(
    user_id=user.id,
    activity_type="logout",
    details=f"User {user.username} logged out at {datetime.now().isoformat()}"
)
    db.add(log)
    db.commit()


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
