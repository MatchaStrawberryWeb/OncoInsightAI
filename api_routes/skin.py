import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from model.skin_model import predict_skin_cancer
import shutil

router = APIRouter()

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("")
async def predict_skin_cancer_api(file: UploadFile = File(...)):
    # Generate a unique filename to avoid clashes
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run prediction
        result = predict_skin_cancer(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    finally:
        # Clean up the saved file
        if os.path.exists(file_path):
            os.remove(file_path)

    return result
