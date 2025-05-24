# api_routes/admin.py
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database_model.database import get_db
from database_model.crud import get_users, get_user_by_username, create_user, update_user, delete_user
from database_model.user import UserCreate, UserRead, UserUpdate
from database_model.activity_log import UserActivityLog 
from database_model.crud import get_activity_logs
from schemas.activity_log import UserActivityLogRead, UserActivityLogCreate

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@router.get("/users", response_model=List[UserRead])
def read_users(db: Session = Depends(get_db)):
    return get_users(db)

@router.post("/users", response_model=UserRead, status_code=201)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return create_user(db, user)

@router.put("/users/{user_id}", response_model=UserRead)
def update_existing_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    updated_user = update_user(db, user_id, user)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/users/{user_id}", status_code=200)
def delete_existing_user(user_id: int, db: Session = Depends(get_db)):
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.get("/activity_logs", response_model=List[UserActivityLogRead])
def read_activity_logs(db: Session = Depends(get_db)):
    return get_activity_logs(db)

@router.post("/activity-log", status_code=201)
def create_activity_log(payload: UserActivityLogCreate, db: Session = Depends(get_db)):
    
    from database_model.user import User 
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    log = UserActivityLog(
    user_id=payload.user_id,
    activity_type=payload.activity_type,
    details=payload.details,
    timestamp=datetime.utcnow()
    
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {"message": "Activity logged successfully", "log_id": log.id}