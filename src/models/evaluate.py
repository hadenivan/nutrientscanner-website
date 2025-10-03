#!/usr/bin/env python3
"""
Evaluate trained models and generate reports.

This script loads a trained model and evaluates it on held-out data,
generating detailed performance reports and visualizations.
"""

import argparse
import json
import sys
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error


def main():
    """Evaluate model and generate report."""
    parser = argparse.ArgumentParser(description="Evaluate trained model")
    parser.add_argument("--model_path", required=True, help="Path to trained model")
    parser.add_argument("--fold", type=int, default=0, help="Fold to evaluate")
    
    args = parser.parse_args()
    
    print(f"📊 Evaluating model: {args.model_path}")
    
    # Load model
    if not Path(args.model_path).exists():
        print(f"❌ Model file not found: {args.model_path}")
        return 1
    
    model = joblib.load(args.model_path)
    print("✅ Model loaded")
    
    # Load data
    clean_dir = Path("data/clean")
    splits_path = clean_dir / "splits.csv"
    
    if not splits_path.exists():
        print(f"❌ Splits file not found: {splits_path}")
        return 1
    
    splits_df = pd.read_csv(splits_path)
    
    if args.fold >= len(splits_df):
        print(f"❌ Invalid fold {args.fold}. Available folds: 0-{len(splits_df)-1}")
        return 1
    
    # Get fold data
    fold_data = splits_df.iloc[args.fold]
    val_idx = fold_data['val_idx']
    
    # Load features and target
    # Extract crop and target from model path
    model_name = Path(args.model_path).stem
    parts = model_name.split('__')
    if len(parts) >= 3:
        crop = parts[0]
        target = parts[1]
    else:
        print("❌ Could not extract crop and target from model path")
        return 1
    
    X_path = clean_dir / f"{crop}__X.parquet"
    y_path = clean_dir / f"{crop}__y__{target}.parquet"
    
    if not X_path.exists() or not y_path.exists():
        print(f"❌ Data files not found: {X_path} or {y_path}")
        return 1
    
    X = pd.read_parquet(X_path)
    y = pd.read_parquet(y_path).iloc[:, 0]
    
    # Get validation data
    X_val = X.iloc[val_idx]
    y_val = y.iloc[val_idx]
    
    print(f"📊 Evaluating on fold {args.fold}: {len(X_val)} samples")
    
    # Make predictions
    y_pred = model.predict(X_val)
    
    # Calculate metrics
    r2 = r2_score(y_val, y_pred)
    rmse = np.sqrt(mean_squared_error(y_val, y_pred))
    mae = mean_absolute_error(y_val, y_pred)
    
    print(f"\n📈 Evaluation Results:")
    print(f"   R²: {r2:.4f}")
    print(f"   RMSE: {rmse:.4f}")
    print(f"   MAE: {mae:.4f}")
    
    # Create evaluation report
    report = {
        'model_path': str(args.model_path),
        'fold': args.fold,
        'n_samples': len(X_val),
        'metrics': {
            'r2': float(r2),
            'rmse': float(rmse),
            'mae': float(mae)
        },
        'target_stats': {
            'mean': float(y_val.mean()),
            'std': float(y_val.std()),
            'min': float(y_val.min()),
            'max': float(y_val.max())
        },
        'prediction_stats': {
            'mean': float(y_pred.mean()),
            'std': float(y_pred.std()),
            'min': float(y_pred.min()),
            'max': float(y_pred.max())
        }
    }
    
    # Save report
    report_path = Path(args.model_path).parent / f"evaluation_fold_{args.fold}.json"
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"💾 Saved evaluation report to {report_path}")
    
    # Create visualization
    plt.figure(figsize=(10, 6))
    
    # Truth vs prediction scatter
    plt.subplot(1, 2, 1)
    plt.scatter(y_val, y_pred, alpha=0.6)
    plt.plot([y_val.min(), y_val.max()], [y_val.min(), y_val.max()], 'r--', lw=2)
    plt.xlabel(f'True {target}')
    plt.ylabel(f'Predicted {target}')
    plt.title(f'Truth vs Prediction (Fold {args.fold})')
    plt.text(0.05, 0.95, f'R² = {r2:.3f}', transform=plt.gca().transAxes,
             bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
    
    # Residuals plot
    plt.subplot(1, 2, 2)
    residuals = y_val - y_pred
    plt.scatter(y_pred, residuals, alpha=0.6)
    plt.axhline(y=0, color='r', linestyle='--')
    plt.xlabel(f'Predicted {target}')
    plt.ylabel('Residuals')
    plt.title(f'Residuals Plot (Fold {args.fold})')
    
    plt.tight_layout()
    
    plot_path = Path(args.model_path).parent / f"evaluation_fold_{args.fold}.png"
    plt.savefig(plot_path, dpi=150, bbox_inches='tight')
    plt.close()
    
    print(f"📊 Saved evaluation plot to {plot_path}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())


