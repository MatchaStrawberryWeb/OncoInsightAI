from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database_model import init_db, get_db
from database_model.activity_log import UserActivityLog
from database_model.user import User, hash_password
from database_model.patient import Patient
from passlib.context import CryptContext
from utils.predictor import preprocess_image, predict_with_models 
from utils.file_utils import save_diagnosis_file
import joblib
import shutil
import os
import logging
from backend import crud
from werkzeug.security import generate_password_hash
from database_model.activity_log import UserActivityLog



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

class UserCreate(BaseModel):
    username: str
    password: str

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Routes
@app.post("/login")
async def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == login_request.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not verify_password(login_request.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"message": "Login successful", "username": user.username}

@app.post("/admin/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user.
    """
    # Check if the username already exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create the new user
    hashed_password = hash_password(user.password)  # Ensure password is hashed
    new_user = User(username=user.username, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "username": new_user.username}

# Route to read users (for the admin dashboard)
@app.get("/admin/users")
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.put("/admin/users/{user_id}")
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    """
    Update an existing user's information.
    """
    existing_user = db.query(User).filter(User.id == user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update username and password if provided
    if user.username:
        existing_user.username = user.username
    if user.password:
        existing_user.password_hash = hash_password(user.password)  # Re-hash password

    db.commit()
    db.refresh(existing_user)

    return {"id": existing_user.id, "username": existing_user.username}

# Route to delete a user
@app.delete("/admin/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete a user by ID.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

# Route to get activity logs
@app.get("/admin/activity_logs")
def get_activity_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(UserActivityLog).offset(skip).limit(limit).all()
    return logs


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

@app.get("/api/patients")
async def get_all_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()
    return patients

# Endpoint to update the patient's medical report (file)
@app.put("/update-patient-records/{ic_number}")
async def update_patient_records(
    ic_number: str,
    file: UploadFile = File(None),  # Optional file upload
    medical_record: str = Form(...),  # Updated medical record
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.ic_number == ic_number).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if file:
        file_path = f"uploaded_files/{file.filename}"  # Adjust as necessary
        with open(file_path, "wb") as f:
            f.write(await file.read())
        patient.file = file_path  # Save file path to the database

    patient.medical_record = medical_record  # Update medical record
    db.commit()
    return {"message": "Patient record updated successfully"}



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
