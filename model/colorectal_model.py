import pandas as pd
import joblib

model = joblib.load("trained_models/colorectal_cancer_model.pkl")

expected_features = [
    "age", "family_history", "diet", "physical_activity"
]

def predict(data: dict):
    df = pd.DataFrame([data])[expected_features]
    prediction = model.predict(df)[0]
    cancer_type = "Malignant" if prediction == 1 else "Benign"
    stage = "Stage 1" if df["age"].values[0] < 50 else "Stage 2"
    return cancer_type, stage
