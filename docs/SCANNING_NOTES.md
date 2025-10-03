# Scanning Notes

This document provides guidelines for NIR scanning and data collection to ensure compatibility with the NutrientScanner models.

## Device Wavelength Alignment

### Wavelength Requirements

The trained models expect specific wavelength ranges and counts. Before scanning:

1. **Check wavelength compatibility**:
   - Load the `wavelengths.json` file from your trained model
   - Verify your device covers the required wavelength range
   - Ensure you have the correct number of data points

2. **Wavelength interpolation**:
   - If your device has different wavelengths, interpolate to match
   - Use linear interpolation for best results
   - Avoid extrapolation beyond your device's range

### Example Wavelength Alignment

```python
import numpy as np
from scipy.interpolate import interp1d

# Load expected wavelengths
with open('models/carrots__wavelengths.json', 'r') as f:
    expected_wavelengths = json.load(f)

# Your device wavelengths (example)
device_wavelengths = np.linspace(1000, 2500, 200)  # 200 points from 1000-2500nm
device_spectrum = your_scanning_function()

# Interpolate to expected wavelengths
interpolator = interp1d(device_wavelengths, device_spectrum, 
                       kind='linear', fill_value='extrapolate')
aligned_spectrum = interpolator(expected_wavelengths)
```

## Scanning Best Practices

### Sample Preparation

1. **Clean samples**: Remove dirt, debris, and surface moisture
2. **Consistent size**: Use similar sample sizes for comparable results
3. **Fresh samples**: Scan within 24 hours of collection when possible
4. **Temperature**: Allow samples to reach room temperature before scanning

### Scanning Procedure

1. **Multiple spots**: Scan 3-5 different spots per sample
2. **Averaging**: Average multiple scans for better signal-to-noise ratio
3. **Background**: Take background measurements regularly
4. **Calibration**: Follow device manufacturer's calibration schedule

### Data Quality

1. **Signal strength**: Ensure adequate signal intensity
2. **Noise level**: Check for excessive noise or artifacts
3. **Baseline**: Verify proper baseline correction
4. **Outliers**: Identify and handle anomalous readings

## Storing Wavelength Information

### Wavelength List Format

The system expects wavelengths in JSON format:

```json
[
  "1000.0",
  "1002.5",
  "1005.0",
  ...
  "2497.5",
  "2500.0"
]
```

### Saving Wavelengths

```python
import json

# After training a model, save the wavelength list
wavelengths = ["1000.0", "1002.5", "1005.0", ...]  # Your wavelengths
with open('models/carrots__wavelengths.json', 'w') as f:
    json.dump(wavelengths, f, indent=2)
```

## Averaging Multiple Spots

### Why Average?

- **Reduce noise**: Multiple measurements reduce random noise
- **Improve accuracy**: Better representation of sample properties
- **Consistency**: More reliable predictions

### Averaging Methods

1. **Simple average**: Mean of all spot measurements
2. **Weighted average**: Weight by signal quality or confidence
3. **Median**: Use median to reduce outlier impact
4. **Robust average**: Use trimmed mean or other robust methods

### Example Averaging

```python
import numpy as np

# Multiple spot measurements
spot_1 = np.array([...])  # First spot spectrum
spot_2 = np.array([...])  # Second spot spectrum
spot_3 = np.array([...])  # Third spot spectrum

# Simple averaging
averaged_spectrum = np.mean([spot_1, spot_2, spot_3], axis=0)

# Weighted averaging (if you have quality scores)
quality_scores = [0.9, 0.8, 0.95]  # Quality scores for each spot
weights = np.array(quality_scores) / np.sum(quality_scores)
averaged_spectrum = np.average([spot_1, spot_2, spot_3], 
                              axis=0, weights=weights)
```

## Device-Specific Notes

### Common NIR Devices

1. **FOSS NIRSystems**: 1100-2500nm range, ~700 wavelengths
2. **Bruker Matrix-F**: 4000-12000cm⁻¹ range, ~1000 wavelengths
3. **Thermo Scientific**: Various ranges, typically 1000-2500nm
4. **Custom devices**: Check specifications and wavelength range

### Calibration Considerations

1. **Regular calibration**: Follow manufacturer's schedule
2. **Temperature compensation**: Account for temperature variations
3. **Drift correction**: Monitor and correct for instrument drift
4. **Reference standards**: Use appropriate reference materials

## Data Preprocessing

### Before Prediction

1. **Wavelength alignment**: Ensure correct wavelength order and count
2. **Noise reduction**: Apply smoothing if necessary
3. **Baseline correction**: Remove baseline drift
4. **Normalization**: Apply same preprocessing as training data

### Example Preprocessing

```python
def preprocess_spectrum(spectrum, wavelengths):
    """Preprocess spectrum for prediction."""
    # 1. Align wavelengths (if needed)
    aligned_spectrum = align_wavelengths(spectrum, wavelengths)
    
    # 2. Smooth noise (optional)
    from scipy.signal import savgol_filter
    smoothed = savgol_filter(aligned_spectrum, window_length=5, polyorder=2)
    
    # 3. Baseline correction (optional)
    from scipy.signal import detrend
    corrected = detrend(smoothed)
    
    return corrected

def align_wavelengths(spectrum, target_wavelengths):
    """Align spectrum to target wavelengths."""
    # Implementation depends on your specific needs
    # This is a placeholder for the actual alignment logic
    return spectrum
```

## Troubleshooting

### Common Issues

1. **"Spectrum length doesn't match"**
   - Check wavelength count
   - Verify wavelength alignment
   - Ensure proper preprocessing

2. **"Poor prediction accuracy"**
   - Check sample preparation
   - Verify device calibration
   - Ensure proper wavelength alignment

3. **"Noisy predictions"**
   - Increase number of averaged spots
   - Check device stability
   - Verify sample quality

### Quality Control

1. **Reference samples**: Use known samples to verify accuracy
2. **Repeatability**: Check consistency of repeated measurements
3. **Sensitivity**: Monitor signal-to-noise ratio
4. **Drift**: Track instrument performance over time

## Future Improvements

### Planned Enhancements

1. **Auto-alignment**: Automatic wavelength alignment
2. **Quality scoring**: Real-time quality assessment
3. **Multi-device support**: Support for different NIR devices
4. **Real-time processing**: Live prediction during scanning

### Research Areas

1. **Transfer learning**: Adapt models to new devices
2. **Domain adaptation**: Handle different sample types
3. **Uncertainty quantification**: Better confidence intervals
4. **Active learning**: Improve models with new data


