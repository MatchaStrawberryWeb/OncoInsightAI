from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database_model.database import Base 

class UserActivityLog(Base):
    __tablename__ = "user_activity_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    activity_type = Column(String(255), nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())
    details = Column(Text, nullable=True)

    user = relationship("User", back_populates="activity_logs")

