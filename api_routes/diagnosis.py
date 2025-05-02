from pyexpat import model
from fastapi import APIRouter, Form, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from utils.predictor import preprocess_image, predict_with_models
from utils.file_utils import save_diagnosis_file
from database_model import get_db, PatientRecord
import os

router = APIRouter()

@router.post("/diagnose")
async def diagnose(ic: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    file_path = await save_diagnosis_file(file)

    image_array = preprocess_image(file_path)
    results = predict_with_models(model, image_array)

    os.remove(file_path)  # Clean up the uploaded file

    return JSONResponse(content={"patient": patient, "results": results})

