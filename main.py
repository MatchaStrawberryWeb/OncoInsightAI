from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database_model import init_db, get_db
from database_model.user import User
from database_model.patient import Patient
from passlib.context import CryptContext
from utils.predictor import preprocess_image, predict_with_models 
from utils.file_utils import save_diagnosis_file
import joblib
import shutil
import os
import logging


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create bcrypt context for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create FastAPI app instance
app = FastAPI()

UPLOAD_DIRECTORY = "./uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Enable CORS for all origins (update with frontend URL for security)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with the actual URL for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load all trained models
models = {
    "breast_cancer": joblib.load("models/breast_cancer_model.pkl"),
    "colorectal_cancer": joblib.load("models/colorectal_cancer_model.pkl"),
    "dermatology": joblib.load("models/dermatology_model.pkl"),
    "lung_cancer": joblib.load("models/lung_cancer_model.pkl"),
    "prostate_cancer": joblib.load("models/prostate_cancer_model.pkl"),
}


# Pydantic models
class LoginRequest(BaseModel):
    username: str
    password: str

class PatientDetails(BaseModel):
    ic_number: str
    full_name: str
    age: int
    gender: str


# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# Routes
@app.post("/login")
async def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_request.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not verify_password(login_request.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"message": "Login successful", "username": user.username}


@app.get("/patient/{ic_number}")
async def get_patient_details(ic_number: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.ic_number == ic_number).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {
        "ic_number": patient.ic_number,
        "full_name": patient.full_name,
        "age": patient.age,
        "gender": patient.gender,
    }


@app.post("/diagnose")
async def diagnose(ic_number: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Fetch patient from database
    patient = db.query(Patient).filter(Patient.ic_number == ic_number).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Save uploaded file securely
    file_path = await save_diagnosis_file(file)

    # Preprocess image and make predictions
    image_array = preprocess_image(file_path)
    results = predict_with_models(models, image_array)

    # Delete temporary file after processing
    os.remove(file_path)

    return JSONResponse(content={"patient": patient, "results": results})

@app.post("/register-patient")
async def register_patient(
    ic_number: str = Form(...),
    full_name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    file: UploadFile = File(...),
):
    # Mock response for demo
    return {
        "message": "Patient data and file uploaded successfully!",
        "patient": {
            "ic_number": ic_number,
            "full_name": full_name,
            "age": age,
            "gender": gender,
        },
    }

@app.exception_handler(FileNotFoundError)
async def file_not_found_exception_handler(request, exc):
    logger.error(f"FileNotFoundError: {exc}")
    return JSONResponse(content={"error": str(exc)}, status_code=404)


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(content={"error": str(exc)}, status_code=500)


# Initialize the database
init_db()
