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
@router.post("/")
def predict_prostate_cancer(input_data: ProstateCancerInput):
    try:
        result = predict(input_data.dict())  
        print(f"Prediction: {result}")  # Optional: log full result
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


