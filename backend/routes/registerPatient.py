from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from database_model import get_db
# from database_model.patient import Patient  # Comment out for mock-up if no DB interaction

router = APIRouter()

# Request body schema
class PatientCreate(BaseModel):
    ic_number: str = Field(..., min_length=8, max_length=12, example="1234567890")
    full_name: str = Field(..., max_length=100, example="John Doe")
    age: int = Field(..., ge=0, le=120, example=30)
    gender: str = Field(..., pattern="^(Male|Female)$", example="Male")

# Response schema
class PatientResponse(BaseModel):
    message: str
    patient_id: str

@router.post("/register-patient", response_model=PatientResponse)
def register_patient(patient: PatientCreate):
    # Mock the patient registration logic (without database interaction)
    mock_patient_id = patient.ic_number  # Just return the IC number as the mock patient ID
    
    return {"message": "Patient data received (mock-up)", "patient_id": mock_patient_id}
