#!/usr/bin/env python3
"""
Clean and prepare Bionutrient Institute dataset for modeling.

This script loads the BI dataset, cleans the data, filters by crop,
and prepares it for PLS modeling with proper train/test splits.
"""

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.model_selection import GroupKFold

try:
    import openpyxl
except ImportError:
    print("❌ Missing dependency: openpyxl")
    print("   Run: pip install openpyxl")
    sys.exit(1)


def normalize_column_names(df):
    """Convert column names to snake_case."""
    df.columns = df.columns.str.lower().str.replace(' ', '_').str.replace('-', '_')
    return df


def identify_nir_columns(df):
    """Identify NIR wavelength columns in the dataframe."""
    # Look for columns that are numeric and could be wavelengths
    nir_cols = []
    for col in df.columns:
        if col in ['sample_id', 'lab_id', 'crop', 'color', 'variety', 'antioxidants', 'protein', 'minerals']:
            continue
        try:
            # Try to convert to float - if successful, likely a wavelength
            pd.to_numeric(df[col], errors='raise')
            nir_cols.append(col)
        except (ValueError, TypeError):
            continue
    
    # Sort by numeric value (wavelength)
    try:
        nir_cols.sort(key=lambda x: float(x))
    except ValueError:
        # If sorting fails, keep original order
        pass
    
    return nir_cols


def main():
    """Clean and prepare BI dataset for modeling."""
    parser = argparse.ArgumentParser(description="Clean BI dataset for modeling")
    parser.add_argument("--crop", default="carrots", help="Crop to filter for")
    parser.add_argument("--target", default="antioxidants", help="Target variable")
    
    args = parser.parse_args()
    
    print(f"🧹 Cleaning BI dataset for {args.crop} - {args.target}")
    
    # Look for dataset file
    data_dir = Path("data/raw")
    dataset_files = [
        "averaged_dataset.xlsx",
        "averaged_dataset.Rds",
        "averaged_dataset.csv",
        "averaged_dataset.parquet"
    ]
    
    dataset_path = None
    for file in dataset_files:
        if (data_dir / file).exists():
            dataset_path = data_dir / file
            break
    
    if dataset_path is None:
        print(f"❌ No dataset file found in {data_dir}")
        print("   Available files:")
        for file in data_dir.glob("*"):
            print(f"   - {file.name}")
        print("\n   Run: python -m src.data.download_bi")
        return 1
    
    print(f"📊 Loading dataset: {dataset_path}")
    
    # Load dataset
    if dataset_path.suffix == '.xlsx':
        df = pd.read_excel(dataset_path)
    elif dataset_path.suffix == '.csv':
        df = pd.read_csv(dataset_path)
    elif dataset_path.suffix == '.parquet':
        df = pd.read_parquet(dataset_path)
    else:
        print(f"❌ Unsupported file format: {dataset_path.suffix}")
        return 1
    
    print(f"   Original shape: {df.shape}")
    
    # Normalize column names
    df = normalize_column_names(df)
    print("✅ Normalized column names")
    
    # Check for required columns
    required_cols = ['sample_id', 'crop']
    missing_cols = [col for col in required_cols if col not in df.columns]
    if missing_cols:
        print(f"❌ Missing required columns: {missing_cols}")
        print(f"   Available columns: {list(df.columns)}")
        return 1
    
    # Check for target column
    if args.target not in df.columns:
        print(f"❌ Target column '{args.target}' not found")
        print(f"   Available columns: {list(df.columns)}")
        return 1
    
    # Identify NIR columns
    nir_cols = identify_nir_columns(df)
    print(f"🔬 Found {len(nir_cols)} NIR wavelength columns")
    
    if len(nir_cols) == 0:
        print("❌ No NIR wavelength columns found")
        return 1
    
    # Filter by crop
    if 'crop' in df.columns:
        original_count = len(df)
        df = df[df['crop'].str.lower() == args.crop.lower()]
        print(f"🌱 Filtered to {args.crop}: {len(df)} samples (from {original_count})")
        
        if len(df) == 0:
            print(f"❌ No samples found for crop '{args.crop}'")
            print(f"   Available crops: {df['crop'].unique()}")
            return 1
    
    # Drop rows with missing target
    original_count = len(df)
    df = df.dropna(subset=[args.target])
    print(f"🎯 Dropped {original_count - len(df)} rows with missing {args.target}")
    
    # Handle missing values in NIR features
    nir_data = df[nir_cols]
    missing_pct = nir_data.isnull().sum() / len(nir_data) * 100
    
    # Drop columns with >10% missing
    high_missing = missing_pct[missing_pct > 10].index
    if len(high_missing) > 0:
        print(f"⚠️  Dropping {len(high_missing)} NIR columns with >10% missing values")
        nir_cols = [col for col in nir_cols if col not in high_missing]
    
    # Median impute remaining missing values
    nir_data = df[nir_cols]
    nir_data = nir_data.fillna(nir_data.median())
    df[nir_cols] = nir_data
    
    print(f"✅ Handled missing values in NIR features")
    
    # Create GroupKFold splits
    print("📊 Creating GroupKFold splits...")
    gkf = GroupKFold(n_splits=5)
    splits = []
    
    for fold, (train_idx, val_idx) in enumerate(gkf.split(df, df[args.target], groups=df['sample_id'])):
        splits.append({
            'fold': fold,
            'train_idx': train_idx.tolist(),
            'val_idx': val_idx.tolist()
        })
    
    # Save splits manifest
    clean_dir = Path("data/clean")
    clean_dir.mkdir(parents=True, exist_ok=True)
    
    splits_df = pd.DataFrame(splits)
    splits_df.to_csv(clean_dir / "splits.csv", index=False)
    print(f"💾 Saved splits to {clean_dir / 'splits.csv'}")
    
    # Prepare features and target
    X = df[nir_cols].copy()
    y = df[args.target].copy()
    
    # Save features and target
    X_path = clean_dir / f"{args.crop}__X.parquet"
    y_path = clean_dir / f"{args.crop}__y__{args.target}.parquet"
    
    X.to_parquet(X_path, index=False)
    y.to_parquet(y_path, index=False)
    
    print(f"💾 Saved features to {X_path}")
    print(f"💾 Saved target to {y_path}")
    
    # Save wavelength list
    wavelengths_path = clean_dir / f"{args.crop}__wavelengths.json"
    with open(wavelengths_path, 'w') as f:
        json.dump(nir_cols, f, indent=2)
    
    print(f"💾 Saved wavelengths to {wavelengths_path}")
    
    # Print summary
    print(f"\n📈 Dataset Summary:")
    print(f"   Crop: {args.crop}")
    print(f"   Target: {args.target}")
    print(f"   Samples: {len(df)}")
    print(f"   Features: {len(nir_cols)}")
    print(f"   Target range: {y.min():.3f} - {y.max():.3f}")
    print(f"   Target mean: {y.mean():.3f} ± {y.std():.3f}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())


