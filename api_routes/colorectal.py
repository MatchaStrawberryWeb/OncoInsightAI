from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from model.colorectal_model import predict

router = APIRouter()

class ColorectalCancerInput(BaseModel):
    age: float
    family_history: int
    diet: str  # e.g. "High-fat", "Vegetarian", etc.
    physical_activity: int  # 0 or 1 for sedentary or active

@router.post("")
def predict_colorectal_cancer(input_data: ColorectalCancerInput):
    try:
        cancer_type, stage = predict(input_data.dict())
        return {"cancerType": cancer_type, "cancerLevel": stage}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
