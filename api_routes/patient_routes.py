from sqlite3 import IntegrityError
from typing import Optional
from fastapi import APIRouter, File, HTTPException, Depends, Form, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from database_model import database
from database_model.patient_records import PatientRecord
from database_model.medical_history import MedicalHistory
from database_model.emergency_contact import EmergencyContact

from schemas.emergency_contact import EmergencyContactBase
from schemas.medical_history import MedicalHistoryResponse
from schemas.patient_records import (
    EditFullPatientDetailsResponse,
    EmergencyContactResponse,
    FullPatientDetailsResponse,
    PatientRecordResponse,
    UpdatePatientRequest,
)

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Route to create a patient record
@router.post("/patients/")
async def create_patient_and_all_data(
    ic: str = Form(...),
    fullName: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    height: str = Form(...),
    weight: str = Form(...),
    bloodType: str = Form(...),
    smoking: str = Form(...),
    alcohol: str = Form(...),

    diabetes: str = Form(...),
    high_blood_pressure: str = Form(...),
    heart_disease: str = Form(""),
    asthma: str = Form(""),
    medications: str = Form(""),
    allergies: str = Form(""),
    surgeries: str = Form(""),
    family_history: str = Form(""),
    eyesight_right: str = Form(""),
    eyesight_left: str = Form(""),
    visual_aid_right: str = Form(""),
    visual_aid_left: str = Form(""),
    hearing_right: str = Form(""),
    hearing_left: str = Form(""),
    color_vision: str = Form(""),

    urinalysis: str = Form(""),
    ecg: str = Form(""),
    xray: str = Form(""),

    uploaded_file: UploadFile = File(...),

    contact_name: str = Form(...),
    contact_number: str = Form(...),
    relation_to_patient: str = Form(...),

    db: Session = Depends(get_db)
):
    try:
        # Read file first
        file_bytes = await uploaded_file.read()

        # Prepare objects
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
        
        # Corrected field names for MedicalHistory
        history = MedicalHistory(
            ic=ic,
            diabetes=diabetes,
            high_blood_pressure=high_blood_pressure,
            heart_disease=heart_disease,  
            asthma=asthma,
            medications=medications,
            allergies=allergies,
            surgeries=surgeries,
            family_history=family_history,  
            eyesight_right=eyesight_right,  
            eyesight_left=eyesight_left,  
            visual_aid_right=visual_aid_right,  
            visual_aid_left=visual_aid_left,  
            hearing_right=hearing_right,  
            hearing_left=hearing_left,  
            color_vision=color_vision,  
            urinalysis=urinalysis,
            ecg=ecg,
            xray=xray,
            medical_file=file_bytes
        )
        
        contact = EmergencyContact(
            ic=ic,
            contact_name=contact_name,
            contact_number=contact_number,
            relation_to_patient=relation_to_patient
        )

        db.add_all([patient_db, history, contact])
        db.commit()

        return {"message": "Patient record added successfully."}

    except IntegrityError as e:
        db.rollback()
    if "Duplicate entry" in str(e.orig):
        raise HTTPException(status_code=409, detail="Patient data already registered.")
    raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")



@router.get("/patients/{ic}/full_details/", response_model=FullPatientDetailsResponse)
async def get_full_patient_details(ic: str, db: Session = Depends(get_db)):
    # Fetch patient record
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Fetch medical history entries
    medical_history_entries = db.query(MedicalHistory).filter(MedicalHistory.ic == ic).all()

    # ✅ Convert to Pydantic models
    patient_data = PatientRecordResponse.from_orm(patient)
    medical_history_data = [MedicalHistoryResponse.from_orm(mh) for mh in medical_history_entries]

    # ✅ Return correctly formatted Pydantic model
    return FullPatientDetailsResponse(
        patient_records=patient_data,
        medical_history=medical_history_data
    )

# ✅ Route to create a medical history record for a patient
@router.post("/patients/{ic}/medical_history/", response_model=MedicalHistoryResponse)
async def create_medical_history(
    ic: str,
    medical_history: MedicalHistoryResponse = Depends(),
    uploaded_file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        file_name = None
        if uploaded_file:
            file_location = f"uploaded_medical_files/{uploaded_file.filename}"
            with open(file_location, "wb+") as file_object:
                file_object.write(await uploaded_file.read())
            file_name = uploaded_file.filename

        new_history = MedicalHistory(**medical_history.dict(), ic=ic, medical_file=file_name)
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
@router.post("/patients/{ic}/emergency_contacts/", response_model=EmergencyContactResponse)
async def create_emergency_contact(ic: str, emergency_contacts: EmergencyContactBase, db: Session = Depends(get_db)):
    try:
        patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
        if patient is None:
            raise HTTPException(status_code=404, detail="Patient not found")

        new_contact = EmergencyContact(**emergency_contacts.dict(), ic=ic)
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



#✅ Route to get all patients for editing and deleting
@router.get("/patients/")
def get_all_patients(db: Session = Depends(get_db)):
    patients = db.query(PatientRecord).all()
    return patients

from sqlalchemy.orm import joinedload

@router.get("/patients/{ic}/edit", response_model=EditFullPatientDetailsResponse)
def get_full_patient_data_for_edit(ic: str, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    medical_history = db.query(MedicalHistory).filter(MedicalHistory.ic == ic).all()
    emergency_contacts = db.query(EmergencyContact).filter(EmergencyContact.ic == ic).all()

    return {
        "patient_records": patient,
        "medical_history": medical_history,
        "emergency_contacts": emergency_contacts
    }


@router.put("/patients/{ic}")
async def update_patient(
    ic: str,
    fullName: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    height: float = Form(...),
    weight: float = Form(...),
    bloodType: str = Form(...),
    smoking: str = Form(...),
    alcohol: str = Form(...),

    # Medical history
    diabetes: Optional[str] = Form(None),
    high_blood_pressure: Optional[str] = Form(None),
    heart_disease: Optional[str] = Form(None),
    asthma: Optional[str] = Form(None),
    medications: Optional[str] = Form(None),
    allergies: Optional[str] = Form(None),
    surgeries: Optional[str] = Form(None),
    family_history: Optional[str] = Form(None),
    eyesight_right: Optional[str] = Form(None),
    eyesight_left: Optional[str] = Form(None),
    visual_aid_right: Optional[str] = Form(None),
    visual_aid_left: Optional[str] = Form(None),
    hearing_right: Optional[str] = Form(None),
    hearing_left: Optional[str] = Form(None),
    color_vision: Optional[str] = Form(None),
    urinalysis: Optional[str] = Form(None),
    ecg: Optional[str] = Form(None),
    xray: Optional[str] = Form(None),

    # Emergency contact
    contact_name: Optional[str] = Form(None),
    contact_number: Optional[str] = Form(None),
    relation_to_patient: Optional[str] = Form(None),

    # File upload
    medical_file: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db)
):
    # Fetch main patient record
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Update PatientRecord fields
    patient.fullName = fullName
    patient.age = age
    patient.gender = gender
    patient.height = height
    patient.weight = weight
    patient.bloodType = bloodType
    patient.smoking = smoking
    patient.alcohol = alcohol

    # Handle medical_file upload
    if medical_file:
        contents = await medical_file.read()
        filename = f"uploads/{medical_file.filename}"
        with open(filename, "wb") as f:
            f.write(contents)
        patient.medical_file = filename  # Save file path in DB

    # Medical history (update or create)
    history = db.query(MedicalHistory).filter(MedicalHistory.ic == ic).first()
    if not history:
        history = MedicalHistory(ic=ic)
        db.add(history)

    history.diabetes = diabetes
    history.high_blood_pressure = high_blood_pressure
    history.heart_disease = heart_disease
    history.asthma = asthma
    history.medications = medications
    history.allergies = allergies
    history.surgeries = surgeries
    history.family_history = family_history
    history.eyesight_right = eyesight_right
    history.eyesight_left = eyesight_left
    history.visual_aid_right = visual_aid_right
    history.visual_aid_left = visual_aid_left
    history.hearing_right = hearing_right
    history.hearing_left = hearing_left
    history.color_vision = color_vision
    history.urinalysis = urinalysis
    history.ecg = ecg
    history.xray = xray

    # Emergency contact (update or create)
    contact = db.query(EmergencyContact).filter(EmergencyContact.ic == ic).first()
    if not contact:
        contact = EmergencyContact(ic=ic)
        db.add(contact)

    contact.contact_name = contact_name
    contact.contact_number = contact_number
    contact.relation_to_patient = relation_to_patient

    # Commit all updates
    db.commit()

    return {"message": "Patient and related records updated"}


@router.delete("/patients/{ic}")
def delete_patient(ic: str, db: Session = Depends(get_db)):
    patient = db.query(PatientRecord).filter(PatientRecord.ic == ic).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"message": "Patient deleted"}