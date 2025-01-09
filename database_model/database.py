# database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database configuration
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root@localhost/oncoinsight"

# Create the engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Function to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db  # Return the session to be used in routes
    finally:
        db.close()  # Close the session after use

# Initialize the database (create tables)
def init_db():
    from . import user  # Ensure models are loaded
    Base.metadata.create_all(bind=engine)
