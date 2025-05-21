from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from model.colorectal_model import predict_colorectal_cancer

router = APIRouter()

class ColorectalCancerInput(BaseModel):
    gene_features: List[float]

@router.post("/")
def predict_colorectal(input_data: ColorectalCancerInput):
    try:
        result = predict_colorectal_cancer(input_data.gene_features)

        malignant_prob = result["probability_of_recurrence"]
        benign_prob = round(1 - malignant_prob, 4)

        chart_data = [
            {"label": "Malignant", "value": malignant_prob},
            {"label": "Benign", "value": benign_prob}
        ]

        return {
            "prediction": result["prediction"],
            "probability": malignant_prob,  # use malignant prob as the main probability
            "cancerType": result["cancer_type"],
            "cancerStage": result["cancer_stage"],
            "chart": chart_data
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
