#!/usr/bin/env python3
"""
Download Bionutrient Institute dataset files.

This script guides you through downloading the required dataset files
from the BI GitLab repository and placing them in the correct location.
"""

import os
import sys
from pathlib import Path


def main():
    """Check for existing files or guide user through download process."""
    print("🔍 Checking for BI dataset files...")
    
    # Define required files
    data_dir = Path("data/raw")
    required_files = [
        "averaged_dataset.xlsx",
        "averaged_dataset.Rds",  # Alternative format
    ]
    optional_files = [
        "siware_scans.Rds",
    ]
    
    # Check if any required files exist
    found_files = []
    for file in required_files:
        file_path = data_dir / file
        if file_path.exists():
            found_files.append(file)
            print(f"✅ Found: {file}")
    
    # Check optional files
    for file in optional_files:
        file_path = data_dir / file
        if file_path.exists():
            found_files.append(file)
            print(f"✅ Found (optional): {file}")
    
    if found_files:
        print(f"\n🎉 Found {len(found_files)} dataset file(s). Ready to proceed!")
        return 0
    
    # Guide user through manual download
    print("\n📥 Dataset files not found. Please download them manually:")
    print("\n1️⃣  Open the BI dataset repository in your browser:")
    print("   https://gitlab.com/our-sci/bionutrient-institute/dataset")
    print("\n2️⃣  Download these files to data/raw/:")
    print("   • datasets/averaged_dataset.xlsx (or .Rds)")
    print("   • datasets/siware_scans.Rds (optional)")
    print("\n3️⃣  Place the files in:")
    print(f"   {data_dir.absolute()}")
    print("\n4️⃣  Then run this script again to verify")
    
    # Create data/raw directory if it doesn't exist
    data_dir.mkdir(parents=True, exist_ok=True)
    print(f"\n📁 Created directory: {data_dir.absolute()}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())


