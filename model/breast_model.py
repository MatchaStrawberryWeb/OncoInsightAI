import pandas as pd
import joblib

# Load the trained model
model = joblib.load("trained_models/breast_cancer_model.pkl")

# List of expected features based on the model
expected_features = [
    "radius_mean", "texture_mean", "perimeter_mean", "area_mean",
    "smoothness_mean", "compactness_mean", "concavity_mean",
    "concave points_mean", "symmetry_mean", "fractal_dimension_mean"
]

def predict(data: dict):
    # Ensure all required features are present
    missing_features = [feature for feature in expected_features if feature not in data]
    if missing_features:
        raise ValueError(f"Missing features: {', '.join(missing_features)}")
    
    # Create a DataFrame with the input data
    df = pd.DataFrame([data])[expected_features]
    
    # Make a prediction using the model
    prediction = model.predict(df)[0]
    cancer_type = "Malignant" if prediction == 1 else "Benign"
    
    # More complex stage classification based on multiple features
    if df["area_mean"].values[0] < 400:
        stage = "Stage 1"
    elif df["area_mean"].values[0] < 800:
        stage = "Stage 2"
    elif df["radius_mean"].values[0] > 20:
        stage = "Stage 3"
    else:
        stage = "Stage 4"
    
    return cancer_type, stage
