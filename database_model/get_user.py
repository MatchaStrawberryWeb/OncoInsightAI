from fastapi import APIRouter, Depends
from pydantic import BaseModel
from database_model.database import get_current_user_token
from database_model.user import get_user_by_token  # Assuming this function queries the user table

router = APIRouter()

class UserResponse(BaseModel):
    username: str

@router.get("/api/get-user")
async def get_user(token: str = Depends(get_current_user_token)):
    user = await get_user_by_token(token)  # Query the user based on the token
    if not user:
        return {"error": "User not found"}
    return {"username": user.username}
