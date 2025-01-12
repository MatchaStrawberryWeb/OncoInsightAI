import os
from fastapi import UploadFile
import cv2
import numpy as np


# Define base upload directory
UPLOAD_DIRECTORY = "./uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Save patient files
async def save_patient_file(file: UploadFile, directory: str = os.path.join(UPLOAD_DIRECTORY, "patients")):
    os.makedirs(directory, exist_ok=True)
    file_location = os.path.join(directory, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return file_location

# Save diagnosis files
async def save_diagnosis_file(file: UploadFile, directory: str = os.path.join(UPLOAD_DIRECTORY, "diagnoses")):
    os.makedirs(directory, exist_ok=True)
    file_location = os.path.join(directory, file.filename)
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return file_location

def extract_color_histogram(image_path):
    """
    Extracts a color histogram from the image.

    Args:
        image_path (str): Path to the image file.

    Returns:
        np.ndarray: Flattened color histogram (1D feature vector).
    """
    # Read the image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image at path {image_path} could not be read.")

    # Resize the image to ensure consistency
    image = cv2.resize(image, (224, 224))

    # Compute the color histogram for the image
    hist = cv2.calcHist([image], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])

    # Normalize and flatten the histogram
    hist = cv2.normalize(hist, hist).flatten()

    return hist