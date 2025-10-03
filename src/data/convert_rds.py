#!/usr/bin/env python3
"""
Convert RDS files to Parquet format using pyreadr.

This script converts .Rds files from the BI dataset to more accessible
Parquet format for easier processing in Python.
"""

import argparse
import sys
from pathlib import Path

try:
    import pyreadr
    import pandas as pd
except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    print("   Run: pip install pyreadr pandas")
    sys.exit(1)


def main():
    """Convert RDS file to Parquet format."""
    parser = argparse.ArgumentParser(description="Convert RDS file to Parquet")
    parser.add_argument("--in", dest="input_file", required=True,
                       help="Input RDS file path")
    parser.add_argument("--out", dest="output_file", required=True,
                       help="Output Parquet file path")
    
    args = parser.parse_args()
    
    input_path = Path(args.input_file)
    output_path = Path(args.output_file)
    
    # Check if input file exists
    if not input_path.exists():
        print(f"⚠️  Input file not found: {input_path}")
        print("   This is normal if you haven't downloaded siware_scans.Rds yet")
        return 0
    
    print(f"🔄 Converting {input_path} to {output_path}")
    
    try:
        # Read RDS file
        result = pyreadr.read_r(input_path)
        
        # Get the first (and usually only) dataframe
        df = list(result.values())[0]
        
        # Create output directory if needed
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Save as Parquet
        df.to_parquet(output_path, index=False)
        
        print(f"✅ Successfully converted to {output_path}")
        print(f"   Shape: {df.shape}")
        print(f"   Columns: {list(df.columns)[:5]}...")  # Show first 5 columns
        
    except Exception as e:
        print(f"❌ Error converting file: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())


