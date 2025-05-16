from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from model.lung_model import predict  # ✅ Import your model logic
import traceback

router = APIRouter()

class LungCancerInput(BaseModel):
    GENDER: int
    AGE: int
    SMOKING: int
    ALCOHOL_CONSUMING: int
    YELLOW_FINGERS: int
    ANXIETY: int
    PEER_PRESSURE: int
    CHRONIC_DISEASE: int
    FATIGUE: int
    ALLERGY: int
    WHEEZING: int
    COUGHING: int
    SHORTNESS_OF_BREATH: int
    SWALLOWING_DIFFICULTY: int
    CHEST_PAIN: int

@router.post("/")
def predict_lung_cancer(input_data: LungCancerInput):
    try:
        data_dict = input_data.dict()

        # Call the actual prediction logic from lung_model.py
        result = predict(data_dict)

        return result

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
