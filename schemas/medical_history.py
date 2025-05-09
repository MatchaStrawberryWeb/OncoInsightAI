from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MedicalHistoryResponse(BaseModel):
    id: int
    ic: str
    date_recorded: datetime
    diabetes: Optional[str] = None
    high_blood_pressure: Optional[str] = None
    heart_disease: Optional[str] = None
    asthma: Optional[str] = None
    medications: Optional[str] = None
    allergies: Optional[str] = None
    surgeries: Optional[str] = None
    family_history: Optional[str] = None
    eyesight_right: Optional[str] = None
    eyesight_left: Optional[str] = None
    visual_aid_right: Optional[str] = None
    visual_aid_left: Optional[str] = None
    hearing_right: Optional[str] = None
    hearing_left: Optional[str] = None
    color_vision: Optional[str] = None
    urinalysis: Optional[str] = None
    ecg: Optional[str] = None
    xray: Optional[str] = None

    class Config:
       from_attributes = True
