# api_routes/detailed_report.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database_model.save_report import PatientDetailedReport
from schemas.detailed_report import DetailedReportResponse
from database_model.database import get_db

router = APIRouter()

@router.get("/", response_model=list[DetailedReportResponse])
def get_detailed_reports(db: Session = Depends(get_db)):
    return db.query(PatientDetailedReport).all()
