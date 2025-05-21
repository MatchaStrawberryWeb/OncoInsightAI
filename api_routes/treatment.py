from fastapi import APIRouter, HTTPException, Depends
from requests import Session
from database_model.database import get_db
from database_model.treatment import TreatmentPackage

router = APIRouter()

@router.get("/")
def treatment(cancer_type: str, cancer_stage: int, db: Session = Depends(get_db)):
    treatments = db.query(TreatmentPackage).filter(
        TreatmentPackage.cancer_type == cancer_type,
        TreatmentPackage.cancer_stage == cancer_stage
    ).all()

    if not treatments:
        raise HTTPException(status_code=404, detail="No treatment found for this type and stage.")

    result = []
    for t in treatments:
        meds = t.medications.split(",") if t.medications else []
        result.append({
            "treatment_type": t.treatment_type,
            "duration_weeks": t.duration_weeks,
            "medications": meds,
            "follow_up": t.follow_up,
        })

    return result
