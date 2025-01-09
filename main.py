from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import joblib
from PIL import Image
import numpy as np
from sqlalchemy.orm import Session
from database_model import init_db, get_db
import logging
from database_model.database import engine, Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app instance
app = FastAPI()

# Enable CORS for all origins (update to restrict to your frontend URL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL to restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model to validate login requests
class LoginRequest(BaseModel):
    username: str
    password: str

# Pydantic model for patient details
class PatientDetails(BaseModel):
    ic_number: str
    full_name: str
    age: int
    gender: str

# Load all trained models
models = {
    "breast_cancer": joblib.load("models/breast_cancer_model.pkl"),
    "colorectal_cancer": joblib.load("models/colorectal_cancer_model.pkl"),
    "dermatology": joblib.load("models/dermatology_model.pkl"),
    "lung_cancer": joblib.load("models/lung_cancer_model.pkl"),
    "prostate_cancer": joblib.load("models/prostate_cancer_model.pkl")
}

@app.post("/diagnose")
async def diagnose(ic_number: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Fetch patient details from the database
    patient = db.execute("SELECT * FROM patient WHERE ic_number = :ic_number", {"ic_number": ic_number}).fetchone()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

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

    return JSONResponse(content={"patient": patient, "results": results})

@app.post("/patient")
async def create_patient(patient: PatientDetails, db: Session = Depends(get_db)):
    db.execute(
        "INSERT INTO patient (ic_number, full_name, age, gender) VALUES (:ic_number, :full_name, :age, :gender)",
        {"ic_number": patient.ic_number, "full_name": patient.full_name, "age": patient.age, "gender": patient.gender}
    )
    db.commit()
    return {"message": "Patient created successfully"}

@app.post("/login")
async def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    # Implement your authentication logic here
    user = db.execute(
        "SELECT * FROM users WHERE username = :username AND password = :password",
        {"username": login_request.username, "password": login_request.password}
    ).fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful"}

@app.exception_handler(FileNotFoundError)
async def file_not_found_exception_handler(request, exc):
    logger.error(f"FileNotFoundError: {exc}")
    return JSONResponse(content={"error": str(exc)}, status_code=404)

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Error: {exc}")
    return JSONResponse(content={"error": str(exc)}, status_code=500)

# Initialize the database
def init_db():
    from database_model import user  # Ensure models are loaded
    Base.metadata.create_all(bind=engine)

init_db()
