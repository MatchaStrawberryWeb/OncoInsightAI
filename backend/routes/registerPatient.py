from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database_model import get_db
from database_model.patient import Patient

router = APIRouter()

# Request body schema
class PatientCreate(BaseModel):
    ic_number: str = Field(..., min_length=8, max_length=12, example="1234567890")
    full_name: str = Field(..., max_length=100, example="John Doe")
    age: int = Field(..., ge=0, le=120, example=30)
    gender: str = Field(..., regex="^(Male|Female)$", example="Male")

# Response schema
class PatientResponse(BaseModel):
    message: str
    patient_id: str

@router.post("/register-patient", response_model=PatientResponse)
def register_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    # Check if the patient already exists
    db_patient = db.query(Patient).filter(Patient.ic_number == patient.ic_number).first()
    if db_patient:
        raise HTTPException(status_code=400, detail="Patient already exists")
    
    # Add new patient to the database
    new_patient = Patient(
        ic_number=patient.ic_number,
        full_name=patient.full_name,
        age=patient.age,
        gender=patient.gender
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return {"message": "Patient registered successfully", "patient_id": new_patient.ic_number}
