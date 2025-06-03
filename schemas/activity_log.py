from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class UserActivityLogCreate(BaseModel):
    user_id: int
    activity_type: str
    details: Optional[str] = None

class UserActivityLogRead(BaseModel):
    user_id: Optional[int]
    activity_type: str
    details: str | None = None
    timestamp: datetime

    class Config:
        orm_mode = True
