from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PatientRecordResponse(BaseModel):
    ic: str
    fullName: str
    age: int
    gender: str
    height: Optional[float]
    weight: Optional[float]
    bloodType: Optional[str]
    smoking: Optional[str]
    alcohol: Optional[str]

    class Config:
        from_attributes = True


class MedicalHistoryResponse(BaseModel):
    id: int
    ic: str
    date_recorded: datetime
    diabetes: Optional[str]
    systolic: Optional[int]
    diastolic: Optional[int]
    heart_disease: Optional[str]
    asthma: Optional[str]
    medications: Optional[str]
    allergies: Optional[str]
    surgeries: Optional[str]
    family_history: Optional[str]
    eyesight_right: Optional[str]
    eyesight_left: Optional[str]
    visual_aid_right: Optional[str]
    visual_aid_left: Optional[str]
    hearing_right: Optional[str]
    hearing_left: Optional[str]
    color_vision: Optional[str]
    urinalysis: Optional[str]
    ecg: Optional[str]
    xray: Optional[str]

    class Config:
        from_attributes = True


class EmergencyContactResponse(BaseModel):
    id: int
    ic: str
    contact_name: str
    contact_number: str
    relation_to_patient: str

    class Config:
        from_attributes = True


class FullPatientDetailsResponse(BaseModel):
    patient_records: PatientRecordResponse
    medical_history: List[MedicalHistoryResponse]


class EditFullPatientDetailsResponse(BaseModel):
    patient_records: PatientRecordResponse
    medical_history: List[MedicalHistoryResponse] = []
    emergency_contacts: List[EmergencyContactResponse] = []

class UpdatePatientRequest(BaseModel):
    fullName: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    height: Optional[float]
    weight: Optional[float]
    bloodType: Optional[str]
    smoking: Optional[str]
    alcohol: Optional[str]

    # medical history
    diabetes: Optional[str]
    systolic: Optional[str]
    diastolic: Optional[str]
    heart_disease: Optional[str]
    asthma: Optional[str]
    medications: Optional[str]
    allergies: Optional[str]
    surgeries: Optional[str]
    family_history: Optional[str]
    eyesight_right: Optional[str]
    eyesight_left: Optional[str]
    visual_aid_right: Optional[str]
    visual_aid_left: Optional[str]
    hearing_right: Optional[str]
    hearing_left: Optional[str]
    color_vision: Optional[str]
    urinalysis: Optional[str]
    ecg: Optional[str]
    xray: Optional[str]

    # emergency contact
    contact_name: Optional[str]
    contact_number: Optional[str]
    relation_to_patient: Optional[str]

    class Config:
        from_attributes = True
