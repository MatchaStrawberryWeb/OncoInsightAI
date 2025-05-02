from pydantic import BaseModel
from typing import Optional

# Pydantic model for creating a new patient record (input validation)
class PatientRecordBase(BaseModel):
    ic: str
    fullName: str
    age: int
    gender: str
    height: Optional[float] = None
    weight: Optional[float] = None
    bloodType: Optional[str] = None
    smoking: Optional[str] = None
    alcohol: Optional[str] = None

    class Config:
        orm_mode = True  # Enables compatibility with SQLAlchemy models

# Pydantic model for returning patient details (response model)
class PatientRecordResponse(PatientRecordBase):
    pass
