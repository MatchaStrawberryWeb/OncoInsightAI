# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from api_routes import auth_routes, detailed_report, survival, treatment, save_report, users_routes, patient_routes, diagnosis, breast, lung, skin, colorectal, prostate, admin, forum
from database_model import init_db
import os
import joblib
import tensorflow as tf

# Initialize FastAPI app
app = FastAPI()

# Include routers
app.include_router(auth_routes.router, prefix="/api", tags=["auth"])
app.include_router(users_routes.router, prefix="/api", tags=["users"])
app.include_router(patient_routes.router, prefix="/api", tags=["patients"])
app.include_router(diagnosis.router, prefix="/api", tags=["diagnosis"])
app.include_router(breast.router, prefix="/predict_breast")
app.include_router(lung.router, prefix="/predict_lung")
app.include_router(skin.router, prefix="/predict_skin")
app.include_router(colorectal.router, prefix="/predict_colorectal")
app.include_router(prostate.router, prefix="/predict_prostate")
app.include_router(survival.router, prefix="/predict_survival")
app.include_router(treatment.router, prefix="/treatment")
app.include_router(save_report.router, prefix="/save_report")
app.include_router(detailed_report.router, prefix="/detailed_report")
app.include_router(admin.router)
app.include_router(forum.router, prefix="/api/forum")


# Session middleware
app.add_middleware(
    SessionMiddleware,
    secret_key="your_secret_key_here",
    session_cookie="onco_session",
    https_only=False,  # Allow cookie over HTTP (localhost)
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
models = {
    "breast_cancer": joblib.load("trained_models/breast_cancer_model.pkl"),
    "colorectal_cancer": joblib.load("trained_models/colorectal_cancer_model.pkl"),
    "skin_cancer": tf.keras.models.load_model("trained_models/skin_cancer_model.h5"),
    "lung_cancer": joblib.load("trained_models/lung_cancer_model.pkl"),
    "prostate_cancer": joblib.load("trained_models/prostate_cancer_model.pkl"),
}

# Make sure the uploads directory exists
UPLOAD_DIRECTORY = "./uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Initialize the database
init_db()
