from sqlalchemy.orm import Session
from database_model.user import User
from database_model.activity_log import UserActivityLog
from datetime import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session):
    return db.query(User).all()

def create_user(db: Session, user_data):
    hashed_password = pwd_context.hash(user_data.password)
    db_user = User(
        username=user_data.username,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        department=user_data.department
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    log_activity(db, db_user.id, "User Created")
    return db_user

def update_user(db: Session, user_id: int, user_data):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.username = user_data.username
        db_user.full_name = user_data.full_name
        db_user.department = user_data.department
        if user_data.password:
            db_user.password_hash = pwd_context.hash(user_data.password)
        db.commit()
        db.refresh(db_user)
        log_activity(db, db_user.id, "User Updated")
        return db_user
    return None

def delete_user(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        # Log BEFORE deleting the user
        log_activity(db, user_id, "User Deleted")

        db.delete(db_user)
        db.commit()
        return True
    return False


def log_activity(db: Session, user_id: int, action: str, details: str | None = None):
    if not db.query(User).filter(User.id == user_id).first():
        return  # Skip logging if user no longer exists

    activity = UserActivityLog(
        user_id=user_id,
        activity_type=action,
        details=details,
        timestamp=datetime.utcnow()
    )
    db.add(activity)
    db.commit()



def get_activity_logs(db: Session):
    return db.query(UserActivityLog).order_by(UserActivityLog.timestamp.desc()).all()
