from fastapi import APIRouter, HTTPException, Request
from database_model.database import get_db

router = APIRouter()

@router.post("/save-report/")
async def save_report(data: dict):
    try:
        conn = get_db()
        cursor = conn.cursor()

        # Example: Insert into a `patient_reports` table (you will need to create it)
        query = """
            INSERT INTO patient_reports (ic_number, age, cancer_type, cancer_stage, diagnosis, survival, treatment)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data['icNumber'],
            data['age'],
            data['cancerType'],
            data['cancerStage'],
            str(data['diagnosis']),
            str(data['survival']),
            str(data['treatment']),
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Report saved successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving report: {str(e)}")
