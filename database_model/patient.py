from sqlalchemy import Column, String, Integer
from database_model import Base  # Ensure Base is imported from the right module

class Patient(Base):
    __tablename__ = 'patient'  # Table name in the database

    ic_number = Column(String, primary_key=True, index=True)  # Primary key
    full_name = Column(String, index=True)  # Full name of the patient
    age = Column(Integer)  # Age of the patient
    gender = Column(String)  # Gender of the patient