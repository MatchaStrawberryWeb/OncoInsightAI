from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database_model.database import Base 

class Forum(Base):
    __tablename__ = "forums"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    replies = relationship("ForumReply", back_populates="forum", cascade="all, delete")

class ForumReply(Base):
    __tablename__ = "forum_replies"
    id = Column(Integer, primary_key=True, index=True)
    forum_id = Column(Integer, ForeignKey("forums.id"), nullable=False)
    reply_text = Column(Text, nullable=False)
    author = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    forum = relationship("Forum", back_populates="replies")

class BreastCancerDocument(Base):
    __tablename__ = "breast_cancer_documents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    file_path = Column(String(255), nullable=False)
    uploaded_by = Column(String(100), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
