import joblib
import pandas as pd

# Load the trained model
model = joblib.load("trained_models/prostate_cancer_model.pkl")

# Prediction function with optional staging
def predict(data: dict):
    df = pd.DataFrame([data])
    prediction = model.predict(df)[0]

    # Optional: staging based on class probability
    if hasattr(model, "predict_proba"):
        prob = model.predict_proba(df)[0][1]  # probability of Malignant
        if prob > 0.90:
            stage = "Stage 4"
        elif prob > 0.75:
            stage = "Stage 3"
        elif prob > 0.60:
            stage = "Stage 2"
        else:
            stage = "Stage 1"
    else:
        stage = "Stage 1" if prediction == 1 else "No Stage"

    cancer_type = "Malignant" if prediction == 1 else "Benign"
    return cancer_type, stage
