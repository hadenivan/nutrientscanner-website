#!/bin/bash
set -euo pipefail

echo "🌱 Starting training pipeline..."

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Step 1: Download BI dataset
echo "📥 Step 1/4: Downloading BI dataset..."
python -m src.data.download_bi

# Step 2: Convert RDS files if they exist
echo "🔄 Step 2/4: Converting RDS files..."
if [ -f "data/raw/siware_scans.Rds" ]; then
    echo "   Converting siware_scans.Rds..."
    python -m src.data.convert_rds --in data/raw/siware_scans.Rds --out data/interim/siware_scans.parquet
else
    echo "   No siware_scans.Rds found, skipping conversion"
fi

# Step 3: Clean and prepare data
echo "🧹 Step 3/4: Cleaning and preparing data..."
python -m src.data.clean_bi --crop carrots --target antioxidants

# Step 4: Train PLS model
echo "🤖 Step 4/4: Training PLS model..."
python -m src.models.train_pls --crop carrots --target antioxidants

echo ""
echo "🎉 Training complete! Model saved to models/"
echo "   Next: make api"


