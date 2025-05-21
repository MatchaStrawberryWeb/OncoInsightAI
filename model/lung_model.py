import joblib
import pandas as pd

# Load lung cancer model
diagnosis_model = joblib.load("trained_models/lung_cancer_model.pkl")

# Define the expected features
expected_features = [
    "GENDER", "AGE", "SMOKING", "YELLOW_FINGERS", "ANXIETY", "PEER_PRESSURE",
    "CHRONIC_DISEASE", "FATIGUE", "ALLERGY", "WHEEZING",
    "ALCOHOL_CONSUMING", "COUGHING", "SHORTNESS_OF_BREATH",
    "SWALLOWING_DIFFICULTY", "CHEST_PAIN"
]

# Fields to count "yes" answers from (exclude AGE and GENDER)
symptom_fields = [
    "SMOKING", "YELLOW_FINGERS", "ANXIETY", "PEER_PRESSURE",
    "CHRONIC_DISEASE", "FATIGUE", "ALLERGY", "WHEEZING",
    "ALCOHOL_CONSUMING", "COUGHING", "SHORTNESS_OF_BREATH",
    "SWALLOWING_DIFFICULTY", "CHEST_PAIN"
]

def predict(data: dict):
    # Preprocessing
    if isinstance(data["SMOKING"], str):
        data["SMOKING"] = 1 if data["SMOKING"].lower() == "yes" else 0
    if isinstance(data["ALCOHOL_CONSUMING"], str):
        data["ALCOHOL_CONSUMING"] = 1 if data["ALCOHOL_CONSUMING"].lower() == "yes" else 0
    if isinstance(data["GENDER"], str):
        data["GENDER"] = 1 if data["GENDER"].lower() == "male" else 0

    # Count number of symptoms marked as '1' (yes)
    yes_count = sum(data.get(field, 0) for field in symptom_fields)

    # Create DataFrame
    df = pd.DataFrame([data])[expected_features]

    # Predict with model
    prediction = diagnosis_model.predict(df)[0]
    prob = None

    if hasattr(diagnosis_model, "predict_proba"):
        prob = float(diagnosis_model.predict_proba(df)[0][1])

    # Final decision logic
    if prediction == 1 or (prob is not None and prob > 0.5) or yes_count >= 8:
        cancer_type = "Lung Cancer"
        # Rule-based staging
        if yes_count == 13:
            stage = "Stage 4"
        elif yes_count == 12:
            stage = "Stage 3"
        elif 10 <= yes_count <= 11:
            stage = "Stage 2"
        elif 8 <= yes_count <= 9:
            stage = "Stage 1"
        else:
            stage = "Stage 1"  # fallback
    else:
        cancer_type = "No Lung Cancer"
        stage = "None"

    return {
        "cancerType": cancer_type,
        "cancerStage": stage,
        "probability": prob,
        "yesCount": yes_count
    }
