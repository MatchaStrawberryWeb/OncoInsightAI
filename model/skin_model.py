import tensorflow as tf
import numpy as np
from tensorflow.keras.utils import load_img, img_to_array

# Load the trained skin cancer model once
model = tf.keras.models.load_model("trained_models/skin_cancer_model.h5")

def predict_skin_cancer(image_path: str):
    # Load and preprocess image
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Model prediction (probability for Malignant class)
    prob = float(model.predict(img_array)[0][0])

    # Determine cancer type and stage
    if prob >= 0.5:
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

    return {
        "cancerType": cancer_type,
        "cancerStage": stage,
        "probability": prob
    }
