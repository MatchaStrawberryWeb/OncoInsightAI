from fastapi import APIRouter, HTTPException, Depends, Form
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from database_model import database
from database_model.patient_records import PatientRecord
from database_model.medical_history import MedicalHistory
from database_model.emergency_contact import EmergencyContact
from schemas.patient_records import PatientRecordBase, PatientRecordResponse
from schemas.medical_history import MedicalHistoryBase
from schemas.emergency_contact import EmergencyContactBase

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter()

# Route to create a patient record
@router.post("/patients/")
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
        return {"message": "Patient record created successfully", "id": patient_db.id}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Route to get a patient by IC number with the correct response model
@router.get("/patients/{ic_number}", response_model=PatientRecordResponse)
async def get_patient(ic: str, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

# Route to create a medical history record for a patient
@router.post("/patients/{ic_number}/medical_history/")
async def create_medical_history(ic: str, medical_history: MedicalHistoryBase, db: Session = Depends(get_db)):
    try:
        patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
        if patient is None:
            raise HTTPException(status_code=404, detail="Patient not found")

        medical_history.ic = ic
        db.add(medical_history)
        db.commit()
        db.refresh(medical_history)
        return medical_history
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Route to get all medical history for a patient by IC number
@router.get("/patients/{ic_number}/medical_history/")
async def get_medical_history(ic: str, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    medical_histories = db.query(MedicalHistory).filter(MedicalHistory.ic == ic).all()
    return medical_histories

# Route to create an emergency contact for a patient
@router.post("/patients/{ic_number}/emergency_contact/")
async def create_emergency_contact(ic: str, emergency_contact: EmergencyContactBase, db: Session = Depends(get_db)):
    try:
        patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
        if patient is None:
            raise HTTPException(status_code=404, detail="Patient not found")

        emergency_contact.ic = ic
        db.add(emergency_contact)
        db.commit()
        db.refresh(emergency_contact)
        return emergency_contact
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# Route to get all emergency contacts for a patient by IC number
@router.get("/patients/{ic_number}/emergency_contacts/")
async def get_emergency_contacts(ic: str, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    emergency_contacts = db.query(EmergencyContact).filter(EmergencyContact.ic == ic).all()
    return emergency_contacts
