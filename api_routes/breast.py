from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from model.breast_model import predict  # Import from model folder

router = APIRouter()

# Input schema
class BreastCancerInput(BaseModel):
    radius_mean: float
    texture_mean: float
    perimeter_mean: float
    area_mean: float
    smoothness_mean: float
    compactness_mean: float
    concavity_mean: float
    concave_points_mean: float
    symmetry_mean: float
    fractal_dimension_mean: float

# API endpoint
@router.post("/")
def predict_breast_cancer(input_data: BreastCancerInput):
    try:
        result = predict(input_data.dict())
        print(f"Prediction: {result}")  # Optional logging
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
