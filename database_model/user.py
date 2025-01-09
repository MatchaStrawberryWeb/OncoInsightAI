from sqlalchemy import Column, Integer, String, TIMESTAMP
from database_model.database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

   # To hash a password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# To verify a password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def get_user_by_token(token: str):
    # Assuming you're using SQLAlchemy
    user = await session.query(User).filter(User.token == token).first()
    return user
