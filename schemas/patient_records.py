from pydantic import BaseModel
from typing import Optional

# Pydantic model for creating a new patient record (input validation)
class PatientRecordBase(BaseModel):
    ic: str
    fullName: str
    age: int
    gender: str
    height: Optional[int] = None
    weight: Optional[int] = None
    bloodType: Optional[str] = None
    smoking: Optional[str] = None
    alcohol: Optional[str] = None

    class Config:
        orm_mode = True  # This tells Pydantic to treat the SQLAlchemy model as a dict

# Pydantic model for returning patient details (response model)
class PatientRecordResponse(BaseModel):
    ic: str
    fullName: str
    age: int
    gender: str
    height: Optional[int] = None
    weight: Optional[int] = None
    bloodType: Optional[str] = None
    smoking: Optional[str] = None
    alcohol: Optional[str] = None

    class Config:
        orm_mode = True  # This tells Pydantic to treat the SQLAlchemy model as a dict
