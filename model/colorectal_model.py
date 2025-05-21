import joblib
import numpy as np

model = joblib.load('trained_models/colorectal_cancer_model.pkl')
selected_genes = joblib.load('trained_models/colorectal_selected_genes.pkl')

def predict_colorectal_cancer(features: list):
    if len(features) != len(selected_genes):
        raise ValueError(f"Expected {len(selected_genes)} gene features, got {len(features)}")

    input_data = np.array(features).reshape(1, -1)
    prediction = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)[0]

    malignant_prob = probabilities[1]

    if prediction == 1:
        label = "Recurrence"
        cancer_type = "Colorectal Cancer"
        if malignant_prob > 0.85:
            cancer_stage = "Stage 4"
        elif malignant_prob > 0.70:
            cancer_stage = "Stage 3"
        elif malignant_prob > 0.55:
            cancer_stage = "Stage 2"
        else:
            cancer_stage = "Stage 1"
    else:
        label = "No Recurrence"
        cancer_type = "No Colorectal Cancer"
        cancer_stage = "None"

    return {
        "prediction": label,
        "probability": round(probabilities[prediction], 4),
        "probability_of_recurrence": round(malignant_prob, 4),
        "cancer_type": cancer_type,
        "cancer_stage": cancer_stage
    }
