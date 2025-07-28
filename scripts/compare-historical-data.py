#!/usr/bin/env python3
"""
Compare NYU and Shiller historical data for overlapping years.
Analyzes differences in stock returns, bond returns, and inflation rates.
"""

import json
import re
from typing import Dict, List, Tuple
from dataclasses import dataclass
from statistics import mean, stdev

@dataclass
class ComparisonData:
    """Data for comparing two datasets"""
    year: int
    nyu_value: float
    shiller_value: float
    difference: float
    percent_diff: float

def parse_typescript_data(filepath: str, data_var_name: str) -> Dict[int, Dict[str, float]]:
    """Parse TypeScript data file and extract historical data"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find the data array
    pattern = rf'export const {data_var_name}.*?\[(.*?)\];'
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        raise ValueError(f"Could not find {data_var_name} in file")
    
    # Extract the array content
    array_content = match.group(1)
    
    # Parse each data entry
    data = {}
    year_pattern = r'\{\s*year:\s*(\d+),\s*stockReturn:\s*([-\d.]+),\s*bondReturn:\s*([-\d.]+),.*?inflationRate:\s*([-\d.]+)'
    
    for match in re.finditer(year_pattern, array_content):
        year = int(match.group(1))
        data[year] = {
            'stockReturn': float(match.group(2)),
            'bondReturn': float(match.group(3)),
            'inflationRate': float(match.group(4))
        }
    
    return data

def compare_datasets(nyu_data: Dict, shiller_data: Dict, field: str) -> List[ComparisonData]:
    """Compare a specific field between two datasets"""
    comparisons = []
    
    # Find overlapping years
    common_years = sorted(set(nyu_data.keys()) & set(shiller_data.keys()))
    
    for year in common_years:
        nyu_val = nyu_data[year][field]
        shiller_val = shiller_data[year][field]
        diff = nyu_val - shiller_val
        
        # Calculate percentage difference (avoid division by zero)
        if shiller_val != 0:
            pct_diff = (diff / abs(shiller_val)) * 100
        else:
            pct_diff = 0 if nyu_val == 0 else float('inf')
        
        comparisons.append(ComparisonData(
            year=year,
            nyu_value=nyu_val,
            shiller_value=shiller_val,
            difference=diff,
            percent_diff=pct_diff
        ))
    
    return comparisons

def print_comparison_stats(comparisons: List[ComparisonData], field_name: str):
    """Print statistics for a comparison"""
    if not comparisons:
        print(f"No data to compare for {field_name}")
        return
    
    # Calculate statistics
    diffs = [c.difference for c in comparisons]
    abs_diffs = [abs(c.difference) for c in comparisons]
    import math
    pct_diffs = [abs(c.percent_diff) for c in comparisons if not math.isinf(c.percent_diff)]
    
    print(f"\n{field_name.upper()} COMPARISON:")
    print(f"Years compared: {comparisons[0].year} - {comparisons[-1].year} ({len(comparisons)} years)")
    print(f"Average difference: {mean(diffs):7.4f} ({mean(pct_diffs):6.2f}% avg absolute)")
    print(f"Std dev of differences: {stdev(diffs):7.4f}")
    print(f"Max absolute difference: {max(abs_diffs):7.4f}")
    
    # Find years with largest differences
    sorted_by_diff = sorted(comparisons, key=lambda x: abs(x.difference), reverse=True)
    print(f"\nLargest differences:")
    for comp in sorted_by_diff[:5]:
        print(f"  {comp.year}: NYU={comp.nyu_value:7.4f}, Shiller={comp.shiller_value:7.4f}, "
              f"Diff={comp.difference:7.4f} ({comp.percent_diff:6.1f}%)")

def main():
    """Main comparison function"""
    import os
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    nyu_path = os.path.join(project_root, 'src/lib/calc/data/nyu-historical-data.ts')
    shiller_path = os.path.join(project_root, 'src/lib/calc/data/shiller-historical-data.ts')
    
    print("Loading NYU data...")
    nyu_data = parse_typescript_data(nyu_path, 'nyuHistoricalData')
    print(f"Loaded {len(nyu_data)} years of NYU data")
    
    print("Loading Shiller data...")
    shiller_data = parse_typescript_data(shiller_path, 'historicalData')
    print(f"Loaded {len(shiller_data)} years of Shiller data")
    
    # Find overlapping years
    common_years = sorted(set(nyu_data.keys()) & set(shiller_data.keys()))
    print(f"\nOverlapping years: {common_years[0]} - {common_years[-1]} ({len(common_years)} years)")
    
    # Compare each field
    for field in ['stockReturn', 'bondReturn', 'inflationRate']:
        comparisons = compare_datasets(nyu_data, shiller_data, field)
        print_comparison_stats(comparisons, field)
    
    # Print correlation analysis
    print("\n" + "="*60)
    print("CORRELATION ANALYSIS:")
    
    for field in ['stockReturn', 'bondReturn', 'inflationRate']:
        nyu_vals = [nyu_data[year][field] for year in common_years]
        shiller_vals = [shiller_data[year][field] for year in common_years]
        
        # Calculate correlation coefficient
        n = len(nyu_vals)
        sum_x = sum(nyu_vals)
        sum_y = sum(shiller_vals)
        sum_xy = sum(x*y for x, y in zip(nyu_vals, shiller_vals))
        sum_x2 = sum(x*x for x in nyu_vals)
        sum_y2 = sum(y*y for y in shiller_vals)
        
        numerator = n * sum_xy - sum_x * sum_y
        denominator = ((n * sum_x2 - sum_x**2) * (n * sum_y2 - sum_y**2))**0.5
        
        correlation = numerator / denominator if denominator != 0 else 0
        
        print(f"{field}: correlation = {correlation:.4f}")

if __name__ == "__main__":
    main()