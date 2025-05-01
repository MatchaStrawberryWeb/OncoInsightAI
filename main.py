# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from api_routes import auth_routes, users_routes, patient_routes, diagnosis
from database_model import init_db
import os
import joblib

# Initialize FastAPI app
app = FastAPI()

# Include routers
app.include_router(auth_routes.router, prefix="/api", tags=["auth"])
app.include_router(users_routes.router, prefix="/api", tags=["users"])
app.include_router(patient_routes.router, prefix="/api", tags=["patients"])
app.include_router(diagnosis.router, prefix="/api", tags=["diagnosis"])

# Session middleware
app.add_middleware(
    SessionMiddleware,
    secret_key="e314e9499c99afce6a8b858a197e10f736722ddcd9ed577e9442bf2a35d3158b",
    session_cookie="onco_session",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
models = {
    "breast_cancer": joblib.load("trained_models/breast_cancer_model.pkl"),
    "colorectal_cancer": joblib.load("trained_models/colorectal_cancer_model.pkl"),
    "dermatology": joblib.load("trained_models/dermatology_model.pkl"),
    "lung_cancer": joblib.load("trained_models/lung_cancer_model.pkl"),
    "prostate_cancer": joblib.load("trained_models/prostate_cancer_model.pkl"),
}

# Make sure the uploads directory exists
UPLOAD_DIRECTORY = "./uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Initialize the database
init_db()
