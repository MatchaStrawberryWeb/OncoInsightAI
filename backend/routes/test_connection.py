# backend/routes/test_connection.py
from fastapi import APIRouter, HTTPException
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from database_model.database import engine  # Import the engine from database.py

router = APIRouter()

@router.get("/test-db-connection")
async def test_db_connection():
    try:
        # Try to connect and execute a simple query to test the database connection
        with engine.connect() as connection:
            result = connection.execute("SELECT 1")
            return {"message": "Database connection successful", "result": result.fetchone()}
    except OperationalError as e:
        # If the connection fails, return an error message
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")
