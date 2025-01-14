from models import UserActivityLog
from sqlalchemy.orm import Session

def log_activity(db: Session, user_id: int, activity_type: str, details: str):
    new_log = UserActivityLog(user_id=user_id, activity_type=activity_type, details=details)
    db.add(new_log)
    db.commit()
