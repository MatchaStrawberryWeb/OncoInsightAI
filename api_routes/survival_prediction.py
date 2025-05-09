import joblib
import pandas as pd
from fastapi import APIRouter

router = APIRouter()

# Load your trained survival model
model = joblib.load("trained_models/survival_model.pkl")

@router.post("/")
def predict_life(data: dict):
    # Map input to DataFrame
    input_df = pd.DataFrame([{
        "Age": data.get("age"),
        "Gender": 1 if data.get("gender", "").lower() == "male" else 0,
        "Smoking": data.get("smoking", 0),
        "Alcohol_Use": data.get("alcohol", 0),
        "Cancer_Stage": int(data.get("stage", 1)),
        "Cancer_Type": data.get("cancer_type", "")
    }])

    # Predict survival years
    prediction = model.predict(input_df)[0]
    return {"life_expectancy": round(float(prediction), 2)}
