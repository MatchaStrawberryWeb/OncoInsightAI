from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class UserActivityLog(Base):
    __tablename__ = 'user_activity_logs'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    activity_type = Column(String(255), nullable=False)  # Changed from 'action' to 'activity_type'
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String(255))  # Added details column
    
    user = relationship("User", back_populates="activity_logs")
