from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database connection string
SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://root:@localhost:3306/oncoinsight"

# Create the engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"host": "localhost", "port": "3306"})

# SessionLocal is a factory for creating new sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()

# Function to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize the database (create tables)
def init_db():
    # Import all models here to ensure they are registered with SQLAlchemy's Base
    from database_model import user  # Import the User model
    Base.metadata.create_all(bind=engine)  # Create all tables (including 'users')
