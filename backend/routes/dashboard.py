# backend/routes/dashboard.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
async def dashboard():
    return {"message": "Welcome to the dashboard!"}
