import joblib
from PIL import Image
import numpy as np

model = joblib.load("trained_models/skin_cancer_model.pkl")

def preprocess_image(image_url: str):
    # Here, you would load and preprocess the image
    img = Image.open(image_url)
    img = img.resize((224, 224))  # Example resize for input model size
    img_array = np.array(img) / 255.0  # Normalize the image
    return np.expand_dims(img_array, axis=0)  # Expand dims for batch size of 1

def predict(data: dict):
    image_data = preprocess_image(data["image_url"])
    prediction = model.predict(image_data)[0]
    cancer_type = "Malignant" if prediction == 1 else "Benign"
    stage = "Stage 1"  # Assume logic for staging
    return cancer_type, stage
