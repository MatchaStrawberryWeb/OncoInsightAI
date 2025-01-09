from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import tensorflow as tf
import numpy as np
from PIL import Image

app = FastAPI()

# Load all trained models
models = {
    "breast_cancer": tf.keras.models.load_model("models/breast_cancer_model.h5"),
    "lung_cancer": tf.keras.models.load_model("models/lung_cancer_model.h5"),
    "skin_cancer": tf.keras.models.load_model("models/skin_cancer_model.h5"),
    "colorectal_cancer": tf.keras.models.load_model("models/colorectal_cancer_model.h5"),
    # Add paths for other models here
}

@app.post("/diagnose")
async def diagnose(file: UploadFile = File(...)):
    # Read and preprocess the uploaded image
    image = Image.open(file.file).resize((224, 224))  # Update size as needed for models
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    # Run predictions on all models
    results = {}
    for cancer_type, model in models.items():
        prediction = model.predict(image_array)
        diagnosis = "Malignant" if prediction[0][0] > 0.5 else "Benign"
        confidence = float(prediction[0][0])
        results[cancer_type] = {"diagnosis": diagnosis, "confidence": confidence}

    return JSONResponse(content=results)
