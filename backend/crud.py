from sqlalchemy.orm import Session
from database_model import User
from database_model.activity_log import UserActivityLog
from datetime import datetime


def add_user(db: Session, username: str, password: str, role: str):
    db_user = User(username=username, password=password, role=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    log_activity(db, db_user.id, "User Added")
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, username: str, password: str, role: str):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.username = username
        db_user.password = password
        db_user.role = role
        db.commit()
        db.refresh(db_user)
        log_activity(db, user_id, "User Updated")
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        log_activity(db, user_id, "User Deleted")
    return db_user

def log_activity(db: Session, user_id: int, action: str):
    activity = ActivityLog(user_id=user_id, action=action, timestamp=datetime.utcnow())
    db.add(activity)
    db.commit()
