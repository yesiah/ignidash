import { describe, it, expect } from 'vitest';

import { getHistoricalYear } from './get-historical-year';

describe('getHistoricalYear', () => {
  it('should return null when historicalRanges is null or empty', () => {
    expect(getHistoricalYear(null, 0)).toBeNull();
    expect(getHistoricalYear([], 0)).toBeNull();
  });

  it('should map indices correctly within a single range', () => {
    const ranges = [{ startYear: 2000, endYear: 2010 }]; // 11 years

    expect(getHistoricalYear(ranges, 0)).toBe(2000);
    expect(getHistoricalYear(ranges, 5)).toBe(2005);
    expect(getHistoricalYear(ranges, 10)).toBe(2010);
  });

  it('should map indices correctly across multiple ranges', () => {
    // Range 1: 1990-1994 (5 years, indices 0-4)
    // Range 2: 2000-2004 (5 years, indices 5-9)
    const ranges = [
      { startYear: 1990, endYear: 1994 },
      { startYear: 2000, endYear: 2004 },
    ];

    expect(getHistoricalYear(ranges, 4)).toBe(1994); // last of first range
    expect(getHistoricalYear(ranges, 5)).toBe(2000); // first of second range
    expect(getHistoricalYear(ranges, 9)).toBe(2004); // last of second range
  });

  it('should return last endYear when index exceeds all ranges', () => {
    const ranges = [{ startYear: 2000, endYear: 2010 }];
    expect(getHistoricalYear(ranges, 100)).toBe(2010);
  });

  it('should handle historical backtest wraparound (starting at 2024)', () => {
    // Real scenario: start at end of data, wrap to beginning
    const ranges = [
      { startYear: 2024, endYear: 2024 }, // 1 year (index 0)
      { startYear: 1928, endYear: 2024 }, // 97 years (indices 1-97)
    ];

    expect(getHistoricalYear(ranges, 0)).toBe(2024);
    expect(getHistoricalYear(ranges, 1)).toBe(1928);
    expect(getHistoricalYear(ranges, 97)).toBe(2024);
  });
});
