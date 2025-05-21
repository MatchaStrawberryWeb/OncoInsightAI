import joblib
import os

# Load both models
model_years = joblib.load(os.path.join("trained_models", "model_survival_years.pkl"))
model_score = joblib.load(os.path.join("trained_models", "model_severity_score.pkl"))

def predict_survival(data):
    if float(data.get("cancer_stage", -1)) == 0:
        # No cancer case
        return {
            "Survival_Years": 30,
            "Target_Severity_Score": 0
        }

    # Map cancer type to numeric value
    cancer_type_map = {
        'Breast': 0,
        'Lung': 1,
        'Prostate': 2,
        'Colorectal': 3,
        'Skin': 4
    }

    # Extract and convert inputs
    age = float(data['age'])
    stage = float(data['cancer_stage'])
    cancer_type = cancer_type_map.get(data['cancer_type'], -1)

    if cancer_type == -1:
        raise ValueError("Invalid cancer type provided.")

    features = [[age, cancer_type, stage]]  # Order: [age, cancer_type, stage]

    predicted_years = model_years.predict(features)[0]
    predicted_score = model_score.predict(features)[0]

    return {
        "Survival_Years": predicted_years,
        "Target_Severity_Score": predicted_score
    }

