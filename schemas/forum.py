from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ForumReplyBase(BaseModel):
    reply_text: str
    author: str

class ForumReplyCreate(ForumReplyBase):
    pass

class ForumReply(ForumReplyBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ForumBase(BaseModel):
    title: str

class ForumCreate(ForumBase):
    pass

class Forum(ForumBase):
    id: int
    created_at: datetime
    replies: List[ForumReply] = []

    class Config:
        orm_mode = True

class BreastCancerDocumentBase(BaseModel):
    title: str
    uploaded_by: str

class BreastCancerDocumentCreate(BreastCancerDocumentBase):
    file_path: str

class BreastCancerDocument(BreastCancerDocumentBase):
    id: int
    file_path: str
    uploaded_at: datetime

    class Config:
        orm_mode = True
