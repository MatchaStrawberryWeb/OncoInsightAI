from .database import get_db, init_db
from .user import User
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base() 