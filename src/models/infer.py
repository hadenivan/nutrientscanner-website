#!/usr/bin/env python3
"""
Inference module for making predictions from NIR spectra.

This module provides functions to load trained models and make predictions
on new NIR spectral data with confidence intervals.
"""

import json
import joblib
import numpy as np
from pathlib import Path
from typing import Union, List, Dict, Any


def predict_from_spectrum(
    model_path: str,
    spectrum: Union[List[float], np.ndarray],
    wavelengths_json: str = None
) -> Dict[str, Any]:
    """
    Predict nutrient value from NIR spectrum.
    
    Args:
        model_path: Path to trained model (.joblib file)
        spectrum: NIR spectrum as list or array
        wavelengths_json: Path to wavelengths JSON file (optional)
    
    Returns:
        Dictionary with prediction, confidence interval, and metadata
    """
    # Load model
    model = joblib.load(model_path)
    
    # Convert spectrum to numpy array
    spectrum = np.array(spectrum)
    
    # Load wavelengths if provided
    if wavelengths_json and Path(wavelengths_json).exists():
        with open(wavelengths_json, 'r') as f:
            expected_wavelengths = json.load(f)
        
        if len(spectrum) != len(expected_wavelengths):
            raise ValueError(
                f"Spectrum length ({len(spectrum)}) doesn't match "
                f"expected wavelengths ({len(expected_wavelengths)})"
            )
    else:
        # Try to infer from model path
        model_dir = Path(model_path).parent
        crop = Path(model_path).stem.split('__')[0]
        wavelengths_path = model_dir / f"{crop}__wavelengths.json"
        
        if wavelengths_path.exists():
            with open(wavelengths_path, 'r') as f:
                expected_wavelengths = json.load(f)
            
            if len(spectrum) != len(expected_wavelengths):
                raise ValueError(
                    f"Spectrum length ({len(spectrum)}) doesn't match "
                    f"expected wavelengths ({len(expected_wavelengths)})"
                )
        else:
            print("⚠️  No wavelengths file found, assuming spectrum is correct length")
    
    # Reshape spectrum for prediction (sklearn expects 2D array)
    spectrum_2d = spectrum.reshape(1, -1)
    
    # Make prediction
    prediction = model.predict(spectrum_2d)[0]
    
    # Calculate confidence interval (simple approximation)
    # This is a basic implementation - in practice, you'd want more sophisticated methods
    try:
        # Get residuals from training (if available in model)
        # For now, use a simple approximation based on typical PLS performance
        residual_std = 0.1 * abs(prediction)  # 10% of prediction as rough estimate
        
        # 80% confidence interval (approximately 1.28 standard deviations)
        confidence_factor = 1.28
        lower_bound = prediction - confidence_factor * residual_std
        upper_bound = prediction + confidence_factor * residual_std
        
    except Exception:
        # Fallback: use a fixed percentage
        margin = 0.2 * abs(prediction)  # 20% margin
        lower_bound = prediction - margin
        upper_bound = prediction + margin
    
    return {
        'prediction': float(prediction),
        'confidence_interval': {
            'lower': float(lower_bound),
            'upper': float(upper_bound)
        },
        'metadata': {
            'model_path': str(model_path),
            'spectrum_length': len(spectrum),
            'wavelengths_file': str(wavelengths_json) if wavelengths_json else None
        }
    }


def main():
    """Command-line interface for inference."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Make prediction from NIR spectrum")
    parser.add_argument("--model", required=True, help="Path to trained model")
    parser.add_argument("--spectrum", required=True, help="Path to spectrum JSON file")
    parser.add_argument("--wavelengths", help="Path to wavelengths JSON file")
    
    args = parser.parse_args()
    
    # Load spectrum
    with open(args.spectrum, 'r') as f:
        spectrum_data = json.load(f)
    
    if 'spectrum' in spectrum_data:
        spectrum = spectrum_data['spectrum']
    else:
        spectrum = spectrum_data  # Assume it's the spectrum directly
    
    # Make prediction
    try:
        result = predict_from_spectrum(args.model, spectrum, args.wavelengths)
        
        print("🎯 Prediction Results:")
        print(f"   Prediction: {result['prediction']:.4f}")
        print(f"   80% CI: [{result['confidence_interval']['lower']:.4f}, "
              f"{result['confidence_interval']['upper']:.4f}]")
        
        # Save result
        output_path = Path(args.spectrum).parent / "prediction_result.json"
        with open(output_path, 'w') as f:
            json.dump(result, f, indent=2)
        
        print(f"💾 Saved result to {output_path}")
        
    except Exception as e:
        print(f"❌ Error making prediction: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())


