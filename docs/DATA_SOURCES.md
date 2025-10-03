# Data Sources

This document describes the data sources used in the NutrientScanner project.

## Bionutrient Institute Dataset

The primary data source is the Bionutrient Institute dataset, available from their GitLab repository.

### Repository Information

- **Repository**: [our-sci/bionutrient-institute/dataset](https://gitlab.com/our-sci/bionutrient-institute/dataset)
- **Access**: Public repository
- **Format**: Multiple formats available (Excel, RDS, CSV)

### Required Files

Download these files to `data/raw/`:

#### 1. Averaged Dataset (Primary)
- **File**: `datasets/averaged_dataset.xlsx` (or `averaged_dataset.Rds`)
- **Description**: One row per sample with averaged NIR measurements
- **Usage**: Primary dataset for training
- **Recommended**: Start with this file

#### 2. Siware Scans (Optional)
- **File**: `datasets/siware_scans.Rds`
- **Description**: Detailed NIR scans table
- **Usage**: Additional spectral information
- **Note**: Requires conversion from RDS to Parquet format

#### 3. Non-Averaged Dataset (Advanced)
- **File**: `datasets/non_averaged_with_nir_scans_dataset.csv`
- **Description**: Multiple sub-samples per sample
- **Usage**: Requires GroupKFold by sample_id to prevent leakage
- **Note**: More complex but potentially more data

### Download Instructions

1. **Visit the repository**: https://gitlab.com/our-sci/bionutrient-institute/dataset
2. **Navigate to datasets folder**
3. **Download the required files**:
   ```bash
   # Create data directory
   mkdir -p ~/Desktop/NutrientScanner/data/raw
   
   # Download files (replace with actual download URLs)
   # You'll need to download manually from the GitLab interface
   ```
4. **Place files in `data/raw/` directory**

### File Structure After Download

```
data/raw/
├── averaged_dataset.xlsx          # Primary dataset
├── siware_scans.Rds              # Optional detailed scans
└── non_averaged_with_nir_scans_dataset.csv  # Optional sub-samples
```

## Data Processing Pipeline

### 1. Download Phase
- **Script**: `src/data/download_bi.py`
- **Purpose**: Guides user through manual download
- **Output**: Files placed in `data/raw/`

### 2. Conversion Phase
- **Script**: `src/data/convert_rds.py`
- **Purpose**: Convert RDS files to Parquet format
- **Input**: `data/raw/siware_scans.Rds`
- **Output**: `data/interim/siware_scans.parquet`

### 3. Cleaning Phase
- **Script**: `src/data/clean_bi.py`
- **Purpose**: Clean and prepare data for modeling
- **Input**: `data/raw/averaged_dataset.xlsx`
- **Output**: 
  - `data/clean/{crop}__X.parquet` (features)
  - `data/clean/{crop}__y__{target}.parquet` (labels)
  - `data/clean/{crop}__wavelengths.json` (wavelength list)
  - `data/clean/splits.csv` (cross-validation splits)

## Data Quality Considerations

### Missing Values
- **Target variables**: Rows with missing targets are dropped
- **NIR features**: Median imputation for <10% missing, drop columns with >10% missing
- **Other features**: Forward fill or drop based on importance

### Data Leakage Prevention
- **GroupKFold**: Use `sample_id` as groups to prevent sub-sample leakage
- **Cross-validation**: 5-fold CV with proper group splitting
- **Feature selection**: Only use NIR wavelengths as features

### Wavelength Alignment
- **Sorting**: Wavelengths are sorted in ascending order
- **Consistency**: Same wavelength order used for training and inference
- **Validation**: Spectrum length must match expected wavelength count

## Dataset Statistics

### Typical Dataset Sizes
- **Averaged dataset**: ~1000-5000 samples
- **Features**: 200-500 NIR wavelengths
- **Crops**: 10-20 different crop types
- **Targets**: 3-5 nutrient measurements per sample

### Target Variables
- **Antioxidants**: Primary target (mg/g)
- **Protein**: Secondary target (%)
- **Minerals**: Additional targets (various units)

## Troubleshooting

### Common Issues

1. **"File not found"**
   - Check file paths and names
   - Ensure files are in `data/raw/` directory
   - Verify file permissions

2. **"Invalid file format"**
   - Check file extensions
   - Ensure files are not corrupted
   - Try re-downloading

3. **"No samples found for crop"**
   - Check crop name spelling
   - Verify crop exists in dataset
   - Check case sensitivity

### Data Validation

Before training, verify:
- [ ] All required files are present
- [ ] File formats are correct
- [ ] Data contains expected columns
- [ ] Target variable has reasonable values
- [ ] NIR features are numeric

## Future Data Sources

### Potential Additions
- **Additional crops**: Expand beyond current dataset
- **New instruments**: Support different NIR devices
- **Temporal data**: Include seasonal variations
- **Geographic data**: Add location-based features

### Data Integration
- **Multiple sources**: Combine different datasets
- **Standardization**: Align measurement protocols
- **Quality control**: Implement data validation rules


