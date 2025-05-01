from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database_model.database import Base

class MedicalHistory(Base):
    __tablename__ = "medical_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ic = Column(String(20), ForeignKey("patient_records.ic"), nullable=False)
    date_recorded = Column(DateTime, nullable=True, default="CURRENT_TIMESTAMP")
    diabetes = Column(Float, nullable=True)
    high_blood_pressure = Column(Float, nullable=True)
    heart_disease = Column(Text, nullable=True)
    asthma = Column(Text, nullable=True)
    medications = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    surgeries = Column(Text, nullable=True)
    family_history = Column(Text, nullable=True)
    eyesight_right = Column(String(50), nullable=True)
    eyesight_left = Column(String(50), nullable=True)
    visual_aid_right = Column(String(50), nullable=True)
    visual_aid_left = Column(String(50), nullable=True)
    hearing_right = Column(String(50), nullable=True)
    hearing_left = Column(String(50), nullable=True)
    color_vision = Column(String(100), nullable=True)
    urinalysis = Column(String(100), nullable=True)
    ecg = Column(String(50), nullable=True)
    xray = Column(String(50), nullable=True)

    # Relationship to PatientRecord
    patient = relationship("PatientRecord", back_populates="medical_histories")
