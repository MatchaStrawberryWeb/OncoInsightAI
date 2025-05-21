from sqlalchemy import Column, Integer, String, Text
from database_model.database import Base

class PatientReport(Base):
    __tablename__ = "patient_reports"

    id = Column(Integer, primary_key=True, index=True)
    ic = Column(String(20), nullable=False)
    age = Column(Integer, nullable=False)
    cancer_type = Column(String(100), nullable=False)
    cancer_stage = Column(String(50), nullable=False)
    diagnosis = Column(Text, nullable=False)
    survival = Column(Text, nullable=False)
    treatment = Column(Text, nullable=False)
