from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import shutil
import os

from database_model.database import get_db
from database_model.forum import Forum as ForumModel, ForumReply as ForumReplyModel, BreastCancerDocument as BreastCancerDocumentModel
from schemas.forum import ForumCreate, Forum as ForumSchema, ForumReplyCreate, ForumReply as ForumReplySchema, BreastCancerDocumentCreate, BreastCancerDocument as BreastCancerDocumentSchema


router = APIRouter()

# Get all forums with replies
@router.get("/", response_model=List[ForumSchema])
def get_forums(db: Session = Depends(get_db)):
    forums = db.query(ForumModel).all()
    return forums


# Create new forum
@router.post("/", response_model=ForumSchema)
def create_forum(forum: ForumCreate, db: Session = Depends(get_db)):
    db_forum = ForumModel(title=forum.title)
    db.add(db_forum)
    db.commit()
    db.refresh(db_forum)
    return db_forum

# Create new reply for forum
@router.post("/{forum_id}/replies", response_model=ForumReplySchema)
def create_reply(forum_id: int, reply: ForumReplyCreate, db: Session = Depends(get_db)):
    db_forum = db.query(ForumModel).filter(ForumModel.id == forum_id).first()
    if not db_forum:
        raise HTTPException(status_code=404, detail="Forum not found")

    db_reply = ForumReplyModel(forum_id=forum_id, reply_text=reply.reply_text, author=reply.author)
    db.add(db_reply)
    db.commit()
    db.refresh(db_reply)
    return db_reply

@router.post("/documents", response_model=BreastCancerDocumentSchema)
def upload_document(
    title: str = Form(...),
    uploaded_by: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    upload_dir = "uploaded_files"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    doc = BreastCancerDocumentModel(title=title, file_path=file_path, uploaded_by=uploaded_by)
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

# Get all uploaded documents
@router.get("/documents", response_model=List[BreastCancerDocumentSchema])
def get_documents(db: Session = Depends(get_db)):
    return db.query(BreastCancerDocumentModel).all()

