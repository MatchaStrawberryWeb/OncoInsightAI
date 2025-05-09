import joblib
import pandas as pd

# Load both models
diagnosis_model = joblib.load("trained_models/prostate_cancer_model.pkl")


def predict(data: dict):
    df = pd.DataFrame([data])
    
    # Diagnosis
    prediction = diagnosis_model.predict(df)[0]
    prob = None
    if hasattr(diagnosis_model, "predict_proba"):
        prob = float(diagnosis_model.predict_proba(df)[0][1])

        if prob > 0.5:
            cancer_type = "Malignant"
            if prob > 0.90:
                stage = "Stage 4"
            elif prob > 0.75:
                stage = "Stage 3"
            elif prob > 0.60:
                stage = "Stage 2"
            else:
                stage = "Stage 1"
        else:
            cancer_type = "Benign"
            stage = "None"
    else:
        if prediction == 1:
            cancer_type = "Malignant"
            stage = "Stage 1"
        else:
            cancer_type = "Benign"
            stage = "None"

    return {
        "cancerType": cancer_type,
        "cancerStage": stage,
        "probability": prob
    }
