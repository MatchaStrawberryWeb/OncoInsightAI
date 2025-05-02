from pydantic import BaseModel
from typing import Optional

# Pydantic model for creating a new medical history record
class MedicalHistoryBase(BaseModel):
    ic: str
    history_detail: Optional[str] = None

    class Config:
        orm_mode = True

# ✅ Add this to fix the import error
class MedicalHistoryResponse(BaseModel):
    id: int
    ic: str
    history_detail: Optional[str] = None

    class Config:
        orm_mode = True
