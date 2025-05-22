from typing import Optional, Union
from pydantic import BaseModel
from datetime import datetime

class DetailedReportResponse(BaseModel):
    id: int
    ic: str
    age: int
    cancer_type: str
    cancer_stage: Union[int, str]  # accept int or str
    diagnosis: str
    survival: str
    treatment: str
    created_at: datetime
    doctor_note: Optional[str] = None
    doctor_signature: Optional[str] = None

    class Config:
        orm_mode = True
