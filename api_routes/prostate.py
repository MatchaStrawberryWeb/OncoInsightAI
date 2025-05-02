from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from model.prostate_model import predict  # Importing predict from the model file

# Create FastAPI router
router = APIRouter()

# Input schema: match frontend 8 fields
class ProstateCancerInput(BaseModel):
    radius: float
    texture: float
    perimeter: float
    area: float
    smoothness: float
    compactness: float
    symmetry: float
    fractal_dimension: float

# API endpoint
@router.post("/predict_prostate")
def predict_prostate_cancer(input_data: ProstateCancerInput):
    try:
        cancer_type, stage = predict(input_data.dict())
        return {
            "cancerType": cancer_type,
            "cancerLevel": stage
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
