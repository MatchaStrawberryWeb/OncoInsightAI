# backend/routes/init_db.py
from fastapi import APIRouter
from database_model.database import init_db  # Import the init_db function

router = APIRouter()

@router.get("/init-db")
async def init_database():
    try:
        init_db()  # Initialize the database by creating tables
        return {"message": "Database initialized successfully."}
    except Exception as e:
        return {"message": "Error initializing the database", "error": str(e)}
