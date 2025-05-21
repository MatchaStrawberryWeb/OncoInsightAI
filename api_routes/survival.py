from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from model.survival_model import predict_survival
from pydantic import BaseModel

router = APIRouter()

class SurvivalInput(BaseModel):
    age: float
    cancer_stage: float
    cancer_type: str

@router.post("/")
async def predict_survival_endpoint(request: Request):
    try:
        data = await request.json()
        result = predict_survival(data)

        return JSONResponse(content={
            "Survival_Years": result["Survival_Years"],
            "Target_Severity_Score": result["Target_Severity_Score"]
        })

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
