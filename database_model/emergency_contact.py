from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database_model.database import Base

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    # Define the columns
    id = Column(Integer, primary_key=True, index=True)  # Add an auto-increment ID as primary key
    ic = Column(String, ForeignKey("patient_records.ic"), nullable=False)  # Foreign key to patient_records

    contact_name = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    relation_to_patient = Column(String, nullable=False)

    # Relationship with the PatientRecord model
    patient = relationship("PatientRecord", back_populates="emergency_contacts")
