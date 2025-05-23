from sqlalchemy import Column, Integer, String, Float, TIMESTAMP
from sqlalchemy.orm import relationship
from database_model.database import Base

class PatientRecord(Base):
    __tablename__ = "patient_records"

    id = Column(Integer, primary_key=True, index=True)  # Primary Key
    ic = Column(String(20), unique=True, nullable=False)  # Unique IC
    fullName = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    height = Column(String, nullable=False)
    weight = Column(String, nullable=False)
    bloodType = Column(String, nullable=False)
    smoking = Column(String, nullable=False)
    alcohol = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

    # Relationships
    medical_history = relationship("MedicalHistory", back_populates="patient", uselist=False, cascade="all, delete-orphan")
    emergency_contacts = relationship("EmergencyContact", back_populates="patient", cascade="all, delete-orphan")
