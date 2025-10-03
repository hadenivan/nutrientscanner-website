.PHONY: setup train api clean help

# Default target
help:
	@echo "Available targets:"
	@echo "  setup  - Set up virtual environment and install dependencies"
	@echo "  train  - Run end-to-end training pipeline"
	@echo "  api    - Start FastAPI server"
	@echo "  clean  - Remove virtual environment and cached files"

# Set up virtual environment and install dependencies
setup:
	@echo "Setting up NutrientScanner environment..."
	bash scripts/setup_mac.sh

# Run training pipeline
train:
	@echo "Running training pipeline..."
	bash scripts/run_train.sh

# Start API server
api:
	@echo "Starting FastAPI server..."
	bash scripts/run_api.sh

# Clean up
clean:
	@echo "Cleaning up..."
	rm -rf .venv
	rm -rf __pycache__
	rm -rf src/__pycache__
	rm -rf src/*/__pycache__
	rm -rf notebooks/.ipynb_checkpoints
	find . -name "*.pyc" -delete


