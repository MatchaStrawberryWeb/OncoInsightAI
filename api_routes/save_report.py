from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database_model.database import get_db
from database_model.save_report import PatientReport
import json

router = APIRouter()

@router.post("/")
async def save_report(request: Request, db: Session = Depends(get_db)):
    try:
        data = await request.json()

        report = PatientReport(
            ic=data.get("ic"),
            age=data.get("age"),
            cancer_type=data.get("cancerType"),
            cancer_stage=data.get("cancerStage"),
            diagnosis=json.dumps(data.get("diagnosis")),
            survival=json.dumps(data.get("survival")),
            treatment=json.dumps(data.get("treatment")),
        )

        db.add(report)
        db.commit()

        return {"message": "Report saved successfully"}

    except Exception as e:
        import traceback
        print("Database insert error:", e)
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": "Failed to save report"})
