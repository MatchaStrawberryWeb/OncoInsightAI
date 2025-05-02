from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from model.breast_model import predict  # Ensure your import path is correct

router = APIRouter()

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

@router.post("/predict")  # Define a valid path for the route
def predict_breast_cancer(input_data: BreastCancerInput):
    try:
        # Call the predict function and pass the input data
        cancer_type, stage = predict(input_data.dict())
        return {"cancerType": cancer_type, "cancerLevel": stage}
    except Exception as e:
        # Handle any exceptions and return a 400 error if needed
        raise HTTPException(status_code=400, detail=f"Error: {str(e)}")
