from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patient"

    ic_number = Column(String(12), primary_key=True, index=True)
    full_name = Column(String(255))
    age = Column(Integer)
    gender = Column(Enum('Male', 'Female'))
    file = Column(String(255))  # This column stores the file path or filename
