from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TreatmentPackage(Base):
    __tablename__ = "treatment_package"

    id = Column(Integer, primary_key=True, index=True)
    cancer_type = Column(String(100))
    cancer_stage = Column(Integer)
    treatment_type = Column(String(200))
    duration_weeks = Column(Integer)
    medications = Column(String(500))  # stored as CSV string
    follow_up = Column(String(500))
