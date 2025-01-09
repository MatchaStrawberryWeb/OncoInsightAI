from pydantic import BaseModel

class Patient(BaseModel):
    ic_number: str
    full_name: str
    age: int
    gender: str