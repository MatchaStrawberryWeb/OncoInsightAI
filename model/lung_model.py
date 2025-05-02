import pandas as pd
import joblib

model = joblib.load("trained_models/lung_cancer_model.pkl")

expected_features = [
    "smoking", "yellow_fingers", "anxiety",
    "peer_pressure", "chronic_disease", "fatigue", "allergy", "wheezing",
    "alcohol", "cough", "shortness_of_breath", "swallowing_difficulty", "chest_pain"
]

def predict(data: dict):
    df = pd.DataFrame([data])[expected_features]
    prediction = model.predict(df)[0]
    cancer_type = "Malignant" if prediction == 1 else "Benign"
    stage = "Stage 1" if df["age"].values[0] < 50 else "Stage 2"
    return cancer_type, stage
