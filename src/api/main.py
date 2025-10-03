#!/usr/bin/env python3
"""
FastAPI service for nutrient prediction from NIR spectra.

This service provides endpoints for health checks and making predictions
using trained PLS models.
"""

import json
import os
from pathlib import Path
from typing import List, Dict, Any

import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

# Import our inference module
from src.models.infer import predict_from_spectrum


# Pydantic models for API
class PredictionRequest(BaseModel):
    """Request model for prediction endpoint."""
    spectrum: List[float] = Field(..., description="NIR spectrum as list of float values")


class PredictionResponse(BaseModel):
    """Response model for prediction endpoint."""
    prediction: float = Field(..., description="Predicted nutrient value")
    confidence_interval: Dict[str, float] = Field(..., description="80% confidence interval")
    metadata: Dict[str, Any] = Field(..., description="Additional metadata")


class HealthResponse(BaseModel):
    """Response model for health check."""
    status: str = Field(..., description="Service status")


# Initialize FastAPI app
app = FastAPI(
    title="NutrientScanner API",
    description="API for predicting nutrients from NIR spectra using PLS models",
    version="0.1.0"
)

# Global variables for model and configuration
model_path = None
wavelengths_path = None
crop = None
target = None


@app.on_event("startup")
async def startup_event():
    """Load model and configuration on startup."""
    global model_path, wavelengths_path, crop, target
    
    # Get configuration from environment variables
    crop = os.getenv("CROP", "carrots")
    target = os.getenv("TARGET", "antioxidants")
    
    print(f"🚀 Starting NutrientScanner API")
    print(f"   Crop: {crop}")
    print(f"   Target: {target}")
    
    # Find model file
    models_dir = Path("models")
    model_pattern = f"{crop}__{target}__*.joblib"
    model_files = list(models_dir.glob(model_pattern))
    
    if not model_files:
        print(f"❌ No model found matching pattern: {model_pattern}")
        print(f"   Available models in {models_dir}:")
        for model_file in models_dir.glob("*.joblib"):
            print(f"   - {model_file.name}")
        print("\n   Run: make train")
        raise RuntimeError("No trained model found")
    
    # Use the most recent model
    model_path = max(model_files, key=lambda x: x.stat().st_mtime)
    print(f"✅ Loaded model: {model_path}")
    
    # Find wavelengths file
    wavelengths_pattern = f"{crop}__wavelengths.json"
    wavelengths_files = list(models_dir.glob(wavelengths_pattern))
    
    if not wavelengths_files:
        # Try in data/clean directory
        clean_dir = Path("data/clean")
        wavelengths_files = list(clean_dir.glob(wavelengths_pattern))
    
    if wavelengths_files:
        wavelengths_path = str(wavelengths_files[0])
        print(f"✅ Loaded wavelengths: {wavelengths_path}")
    else:
        print(f"⚠️  No wavelengths file found for {crop}")
        wavelengths_path = None
    
    print("🎉 API ready to serve predictions!")


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(status="ok")


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict nutrient value from NIR spectrum.
    
    Args:
        request: PredictionRequest containing the NIR spectrum
        
    Returns:
        PredictionResponse with prediction and confidence interval
    """
    if model_path is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Make prediction
        result = predict_from_spectrum(
            model_path=str(model_path),
            spectrum=request.spectrum,
            wavelengths_json=wavelengths_path
        )
        
        return PredictionResponse(
            prediction=result['prediction'],
            confidence_interval=result['confidence_interval'],
            metadata=result['metadata']
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.get("/info")
async def get_info():
    """Get information about the loaded model and configuration."""
    if model_path is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    return {
        "crop": crop,
        "target": target,
        "model_path": str(model_path),
        "wavelengths_path": wavelengths_path,
        "model_name": model_path.name
    }


if __name__ == "__main__":
    # This allows running the API directly with: python -m src.api.main
    uvicorn.run(app, host="127.0.0.1", port=8000)


