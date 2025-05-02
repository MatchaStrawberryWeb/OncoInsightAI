from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from model.skin_model import predict

router = APIRouter()

class SkinCancerInput(BaseModel):
    image_url: str  # or any other necessary image data format

@router.post("")
def predict_skin_cancer(input_data: SkinCancerInput):
    try:
        cancer_type, stage = predict(input_data.dict())
        return {"cancerType": cancer_type, "cancerLevel": stage}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
