import re
import pandas as pd
import os

# --- Helper functions ---

def parse_ts_data(filepath, pattern, columns):
    """
    Parse a TypeScript data file containing an array of objects like:
    { year: 1928, stockReturn: 0.05, ... }
    Returns a pandas DataFrame with the specified columns extracted.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all object-like entries inside [...]
    regex = re.compile(pattern)
    matches = regex.findall(content)

    data = []
    for m in matches:
        row = {}
        for col, val in zip(columns, m):
            if col == "year":
                row[col] = int(val)
            else:
                row[col] = float(val)
        data.append(row)

    return pd.DataFrame(data)

    
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)

# --- Parse NYU historical data (returns + inflation) ---
nyu_pattern = r"\{\s*year:\s*(\d+),\s*stockReturn:\s*([-\d.eE]+),\s*bondReturn:\s*([-\d.eE]+),\s*cashReturn:\s*([-\d.eE]+),\s*inflationRate:\s*([-\d.eE]+)\s*\}"
nyu_columns = ["year", "stockReturn", "bondReturn", "cashReturn", "inflationRate"]
nyu_df = parse_ts_data(os.path.join(project_root, "src/lib/calc/data/nyu-historical-data.ts"), nyu_pattern, nyu_columns)

# --- Parse Shiller yield data (stockYield + bondYield) ---
shiller_pattern = r"\{\s*year:\s*(\d+),\s*stockYield:\s*([-\d.eE]+),\s*bondYield:\s*([-\d.eE]+)\s*\}"
shiller_columns = ["year", "stockYield", "bondYield"]
shiller_df = parse_ts_data(os.path.join(project_root, "src/lib/calc/data/shiller-historical-yield-data.ts"), shiller_pattern, shiller_columns)

# --- Merge datasets by year ---
merged_df = pd.merge(nyu_df, shiller_df, on="year", how="inner")

print("Merged Data Sample:")
print(merged_df.head())
print('\n...')
print(merged_df.tail())
print('\n')

# --- Compute correlation matrix ---
corr_matrix = merged_df[["stockReturn", "bondReturn", "cashReturn", "inflationRate", "bondYield", "stockYield"]].corr()

print("Correlation Matrix (1928-2024):")
print(corr_matrix.round(3))
