type HistoricalRange = { startYear: number; endYear: number };

export function getHistoricalYear(historicalRanges: HistoricalRange[] | null, yearsSinceStart: number): number | null {
  if (!historicalRanges?.length) return null;

  let offset = 0;

  for (const range of historicalRanges) {
    const rangeLength = range.endYear - range.startYear + 1;

    if (yearsSinceStart < offset + rangeLength) {
      return range.startYear + (yearsSinceStart - offset);
    }

    offset += rangeLength;
  }

  // If yearsSinceStart exceeds all ranges, return the last year
  return historicalRanges[historicalRanges.length - 1].endYear;
}
