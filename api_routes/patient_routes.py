from fastapi import APIRouter, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from database_model import database
from database_model.patient_records import PatientRecord
from database_model.medical_history import MedicalHistory
from database_model.emergency_contact import EmergencyContact

from schemas.patient_records import PatientRecordBase, PatientRecordResponse
from schemas.medical_history import MedicalHistoryBase, MedicalHistoryResponse
from schemas.emergency_contact import EmergencyContactBase, EmergencyContactResponse

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Route to create a patient record
@router.post("/patients/", response_model=PatientRecordResponse)
async def create_patient(
    ic: str = Form(...),
    fullName: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    height: float = Form(...),
    weight: float = Form(...),
    bloodType: str = Form(...),
    smoking: str = Form(...),
    alcohol: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        patient_db = PatientRecord(
            ic=ic,
            fullName=fullName,
            age=age,
            gender=gender,
            height=height,
            weight=weight,
            bloodType=bloodType,
            smoking=smoking,
            alcohol=alcohol
        )
        db.add(patient_db)
        db.commit()
        db.refresh(patient_db)
        return patient_db
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# ✅ Route to get patient details by IC
@router.get("/patient/{ic_number}")
async def get_patient(ic_number: str, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic_number).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return {
        "ic": patient.ic,
        "fullName": patient.fullName,
        "age": patient.age,
        "gender": patient.gender,
        "height": patient.height,
        "weight": patient.weight,
        "bloodType": patient.bloodType,
        "smoking": patient.smoking,
        "alcohol": patient.alcohol,
    }
# ✅ Route to create a medical history record for a patient
@router.post("/patients/{ic}/medical_history/", response_model=MedicalHistoryResponse)
async def create_medical_history(ic: str, medical_history: MedicalHistoryBase, db: Session = Depends(get_db)):
    try:
        patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
        if patient is None:
            raise HTTPException(status_code=404, detail="Patient not found")

        new_history = MedicalHistory(**medical_history.dict(), ic=ic)
        db.add(new_history)
        db.commit()
        db.refresh(new_history)
        return new_history
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# ✅ Route to get all medical history entries for a patient
@router.get("/patients/{ic}/medical_history/", response_model=list[MedicalHistoryResponse])
async def get_medical_history(ic: str, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return db.query(MedicalHistory).filter(MedicalHistory.ic == ic).all()

# ✅ Route to create an emergency contact
@router.post("/patients/{ic}/emergency_contact/", response_model=EmergencyContactResponse)
async def create_emergency_contact(ic: str, emergency_contact: EmergencyContactBase, db: Session = Depends(get_db)):
    try:
        patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
        if patient is None:
            raise HTTPException(status_code=404, detail="Patient not found")

        new_contact = EmergencyContact(**emergency_contact.dict(), ic=ic)
        db.add(new_contact)
        db.commit()
        db.refresh(new_contact)
        return new_contact
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# ✅ Route to get all emergency contacts for a patient
@router.get("/patients/{ic}/emergency_contacts/", response_model=list[EmergencyContactResponse])
async def get_emergency_contacts(ic: str, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return db.query(EmergencyContact).filter(EmergencyContact.ic == ic).all()
