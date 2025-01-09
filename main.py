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
from database_model.user import User
from passlib.context import CryptContext
from database_model.patient import Patient


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create bcrypt context for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@app.get("/patient/{ic_number}")
async def get_patient_details(ic_number: str, db: Session = Depends(get_db)):
    # Use SQLAlchemy ORM query to retrieve patient by IC number
    patient = db.query(Patient).filter(Patient.ic_number == ic_number).first()
    
    # If no patient is found, raise HTTP 404 error
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Return the patient details as a dictionary
    return {"ic_number": patient.ic_number, "full_name": patient.full_name, "age": patient.age, "gender": patient.gender}


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
    # Fetch the user from the database
    user = db.query(User).filter(User.username == login_request.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    # Verify the password
    if not verify_password(login_request.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    # If login is successful, you can return user details or generate a token
    return {"message": "Login successful", "username": user.username}


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
