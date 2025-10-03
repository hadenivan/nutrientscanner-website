#!/bin/bash
set -euo pipefail

echo "🚀 Starting FastAPI server..."

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source .venv/bin/activate

# Set environment variables
export CROP=carrots
export TARGET=antioxidants

echo "📊 Configuration:"
echo "   Crop: $CROP"
echo "   Target: $TARGET"
echo ""

# Start FastAPI server
echo "🌐 Starting server on http://127.0.0.1:8000"
echo "   Press Ctrl+C to stop"
echo ""

uvicorn src.api.main:app --reload --port 8000


