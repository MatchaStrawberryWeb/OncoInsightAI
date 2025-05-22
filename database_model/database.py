# database_model/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define database URL (update with correct credentials if needed)
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root@localhost/oncoinsight"


# Create the engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine,  expire_on_commit=False)

# Base class for models
Base = declarative_base()

# Dependency to get the database session
def get_db():
    db = SessionLocal()  # Create a new database session
    try:
        yield db  # Return the session to be used in routes
    finally:
        db.close()  # Close the session after use

# Function to initialize the database
def init_db():
    # Local import to avoid circular import issues
    from .user import User
    from .save_report import PatientDetailedReport
    Base.metadata.create_all(bind=engine)  # Create all tables, including User

# database_model/database.py
def get_current_user_token():
    # Example placeholder function
    return "mock-token"
