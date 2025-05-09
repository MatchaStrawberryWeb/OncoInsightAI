from pydantic import BaseModel

# Pydantic model for creating a new emergency contact
class EmergencyContactBase(BaseModel):
    ic: str
    contact_name: str
    contact_number: str
    relation_to_patient: str

    class Config:
        from_attributes = True

# ✅ Add this to fix the import error
class EmergencyContactResponse(BaseModel):
    id: int
    ic: str
    contact_name: str
    contact_number: str
    relation_to_patient: str

    class Config:
        from_attributes = True
