from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from model.lung_model import predict


import pandas as pd
import joblib

router = APIRouter()

# Load the trained lung cancer model
model = joblib.load("trained_models/lung_cancer_model.pkl")

# Define the input schema
class LungCancerInput(BaseModel):
    SMOKING: int
    YELLOW_FINGERS: int
    ANXIETY: int
    PEER_PRESSURE: int
    CHRONIC_DISEASE: int
    FATIGUE: int
    ALLERGY: int
    WHEEZING: int
    ALCOHOL_CONSUMING: int
    COUGHING: int
    SHORTNESS_OF_BREATH: int
    SWALLOWING_DIFFICULTY: int
    CHEST_PAIN: int

@router.post("/predict_lung")
def predict_lung(data: LungCancerInput):
    df = pd.DataFrame([data.dict()])
    prediction = model.predict(df)[0]
    diagnosis = "Positive" if prediction == 1 else "Negative"
    return {"prediction": diagnosis}

