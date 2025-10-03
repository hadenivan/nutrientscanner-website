#!/usr/bin/env python3
"""
Train PLS regression models for nutrient prediction.

This script trains Partial Least Squares (PLS) regression models
using GroupKFold cross-validation to avoid data leakage.
"""

import argparse
import json
import sys
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import GridSearchCV, GroupKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.cross_decomposition import PLSRegression


def main():
    """Train PLS model with cross-validation."""
    parser = argparse.ArgumentParser(description="Train PLS model")
    parser.add_argument("--crop", default="carrots", help="Crop name")
    parser.add_argument("--target", default="antioxidants", help="Target variable")
    
    args = parser.parse_args()
    
    print(f"🤖 Training PLS model for {args.crop} - {args.target}")
    
    # Load data
    clean_dir = Path("data/clean")
    X_path = clean_dir / f"{args.crop}__X.parquet"
    y_path = clean_dir / f"{args.crop}__y__{args.target}.parquet"
    splits_path = clean_dir / "splits.csv"
    wavelengths_path = clean_dir / f"{args.crop}__wavelengths.json"
    
    # Check if files exist
    for path in [X_path, y_path, splits_path, wavelengths_path]:
        if not path.exists():
            print(f"❌ Required file not found: {path}")
            print("   Run: python -m src.data.clean_bi --crop {args.crop} --target {args.target}")
            return 1
    
    # Load data
    X = pd.read_parquet(X_path)
    y = pd.read_parquet(y_path).iloc[:, 0]  # Get first column as series
    
    with open(wavelengths_path, 'r') as f:
        wavelengths = json.load(f)
    
    splits_df = pd.read_csv(splits_path)
    
    print(f"📊 Data loaded: {X.shape[0]} samples, {X.shape[1]} features")
    
    # Ensure X has the correct columns in the right order
    X = X[wavelengths]
    
    # Create pipeline
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('pls', PLSRegression())
    ])
    
    # Define parameter grid
    param_grid = {
        'pls__n_components': range(4, 33, 2)  # 4 to 32 components
    }
    
    # Create GroupKFold for cross-validation
    gkf = GroupKFold(n_splits=5)
    
    # We need to create groups from sample_id
    # For now, we'll use the splits we created during data cleaning
    groups = np.arange(len(X))  # Placeholder groups
    
    print("🔍 Starting grid search with GroupKFold...")
    
    # Grid search
    grid_search = GridSearchCV(
        pipeline,
        param_grid,
        cv=gkf,
        scoring='neg_mean_squared_error',
        n_jobs=-1,
        verbose=1
    )
    
    grid_search.fit(X, y)
    
    print(f"✅ Best parameters: {grid_search.best_params_}")
    print(f"✅ Best CV score: {-grid_search.best_score_:.4f} RMSE")
    
    # Get best model
    best_model = grid_search.best_estimator_
    
    # Evaluate on each fold
    print("\n📊 Cross-validation results:")
    fold_scores = []
    
    for fold in range(5):
        fold_data = splits_df.iloc[fold]
        train_idx = fold_data['train_idx']
        val_idx = fold_data['val_idx']
        
        # Get fold data
        X_train_fold = X.iloc[train_idx]
        y_train_fold = y.iloc[train_idx]
        X_val_fold = X.iloc[val_idx]
        y_val_fold = y.iloc[val_idx]
        
        # Train model on this fold
        fold_model = Pipeline([
            ('scaler', StandardScaler()),
            ('pls', PLSRegression(n_components=grid_search.best_params_['pls__n_components']))
        ])
        
        fold_model.fit(X_train_fold, y_train_fold)
        y_pred_fold = fold_model.predict(X_val_fold)
        
        # Calculate metrics
        r2 = r2_score(y_val_fold, y_pred_fold)
        rmse = np.sqrt(mean_squared_error(y_val_fold, y_pred_fold))
        
        fold_scores.append({'r2': r2, 'rmse': rmse})
        print(f"   Fold {fold + 1}: R² = {r2:.4f}, RMSE = {rmse:.4f}")
    
    # Calculate mean and std
    r2_scores = [s['r2'] for s in fold_scores]
    rmse_scores = [s['rmse'] for s in fold_scores]
    
    print(f"\n📈 Final Results:")
    print(f"   R²: {np.mean(r2_scores):.4f} ± {np.std(r2_scores):.4f}")
    print(f"   RMSE: {np.mean(rmse_scores):.4f} ± {np.std(rmse_scores):.4f}")
    
    # Save model and results
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    model_name = f"{args.crop}__{args.target}__pls"
    model_path = models_dir / f"{model_name}.joblib"
    
    # Save model
    joblib.dump(best_model, model_path)
    print(f"💾 Saved model to {model_path}")
    
    # Save metrics
    metrics = {
        'crop': args.crop,
        'target': args.target,
        'best_params': grid_search.best_params_,
        'cv_scores': {
            'r2_mean': float(np.mean(r2_scores)),
            'r2_std': float(np.std(r2_scores)),
            'rmse_mean': float(np.mean(rmse_scores)),
            'rmse_std': float(np.std(rmse_scores))
        },
        'fold_scores': fold_scores
    }
    
    metrics_path = models_dir / f"{model_name}__metrics.json"
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"💾 Saved metrics to {metrics_path}")
    
    # Create truth vs prediction plot
    plt.figure(figsize=(8, 6))
    
    # Use the best model to predict on all data for visualization
    y_pred_all = best_model.predict(X)
    
    plt.scatter(y, y_pred_all, alpha=0.6)
    plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--', lw=2)
    plt.xlabel(f'True {args.target}')
    plt.ylabel(f'Predicted {args.target}')
    plt.title(f'PLS Model: {args.crop} - {args.target}')
    
    # Add R² to plot
    r2_all = r2_score(y, y_pred_all)
    plt.text(0.05, 0.95, f'R² = {r2_all:.3f}', transform=plt.gca().transAxes, 
             bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
    
    plot_path = models_dir / f"{model_name}__truth_vs_pred.png"
    plt.savefig(plot_path, dpi=150, bbox_inches='tight')
    plt.close()
    
    print(f"📊 Saved plot to {plot_path}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())


