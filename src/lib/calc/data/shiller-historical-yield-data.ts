/**
 * Historical stock dividend yield and bond yield data (1928-present)
 *
 * Source: Robert Shiller's publicly available dataset
 * (http://www.econ.yale.edu/~shiller/data.htm)
 *
 * - stockYield: Annualized dividend yield of the S&P Composite index.
 *   Calculated as (12 x monthly dividend) ÷ stock price, using December values.
 *
 * - bondYield: Yield of 10-year U.S. Treasury bonds (GS10), taken directly from Shiller.
 *   Values are given as fractions (e.g., 0.045 = 4.5%).
 *
 * Only December observations are included (one value per year).
 *
 * Generated automatically - do not edit manually.
 */

export interface ShillerHistoricalYearData {
  year: number;
  stockYield: number;
  bondYield: number;
}

export const shillerHistoricalData: ShillerHistoricalYearData[] = [
  { year: 1928, stockYield: 0.4406, bondYield: 0.0358 },
  { year: 1929, stockYield: 0.5439, bondYield: 0.0332 },
  { year: 1930, stockYield: 0.7582, bondYield: 0.0334 },
  { year: 1931, stockYield: 1.1659, bondYield: 0.0365 },
  { year: 1932, stockYield: 0.8798, bondYield: 0.0334 },
  { year: 1933, stockYield: 0.5296, bondYield: 0.0314 },
  { year: 1934, stockYield: 0.5832, bondYield: 0.0282 },
  { year: 1935, stockYield: 0.4325, bondYield: 0.0266 },
  { year: 1936, stockYield: 0.5064, bondYield: 0.0268 },
  { year: 1937, stockYield: 0.8711, bondYield: 0.0257 },
  { year: 1938, stockYield: 0.4823, bondYield: 0.0238 },
  { year: 1939, stockYield: 0.6015, bondYield: 0.0222 },
  { year: 1940, stockYield: 0.7635, bondYield: 0.0197 },
  { year: 1941, stockYield: 0.9726, bondYield: 0.0242 },
  { year: 1942, stockYield: 0.7437, bondYield: 0.0247 },
  { year: 1943, stockYield: 0.6376, bondYield: 0.0248 },
  { year: 1944, stockYield: 0.5863, bondYield: 0.0238 },
  { year: 1945, stockYield: 0.457, bondYield: 0.0221 },
  { year: 1946, stockYield: 0.5631, bondYield: 0.0225 },
  { year: 1947, stockYield: 0.6707, bondYield: 0.0242 },
  { year: 1948, stockYield: 0.7347, bondYield: 0.0232 },
  { year: 1949, stockYield: 0.8271, bondYield: 0.0232 },
  { year: 1950, stockYield: 0.8932, bondYield: 0.0255 },
  { year: 1951, stockYield: 0.7228, bondYield: 0.0267 },
  { year: 1952, stockYield: 0.6498, bondYield: 0.0282 },
  { year: 1953, stockYield: 0.7008, bondYield: 0.0259 },
  { year: 1954, stockYield: 0.5285, bondYield: 0.0251 },
  { year: 1955, stockYield: 0.4338, bondYield: 0.0296 },
  { year: 1956, stockYield: 0.4496, bondYield: 0.0359 },
  { year: 1957, stockYield: 0.5326, bondYield: 0.0321 },
  { year: 1958, stockYield: 0.3926, bondYield: 0.0386 },
  { year: 1959, stockYield: 0.3718, bondYield: 0.0469 },
  { year: 1960, stockYield: 0.412, bondYield: 0.0384 },
  { year: 1961, stockYield: 0.3379, bondYield: 0.0406 },
  { year: 1962, stockYield: 0.408, bondYield: 0.0386 },
  { year: 1963, stockYield: 0.3689, bondYield: 0.0413 },
  { year: 1964, stockYield: 0.3573, bondYield: 0.0418 },
  { year: 1965, stockYield: 0.3558, bondYield: 0.0462 },
  { year: 1966, stockYield: 0.4235, bondYield: 0.0484 },
  { year: 1967, stockYield: 0.3677, bondYield: 0.057 },
  { year: 1968, stockYield: 0.3459, bondYield: 0.0603 },
  { year: 1969, stockYield: 0.4162, bondYield: 0.0765 },
  { year: 1970, stockYield: 0.4184, bondYield: 0.0639 },
  { year: 1971, stockYield: 0.3715, bondYield: 0.0593 },
  { year: 1972, stockYield: 0.3217, bondYield: 0.0636 },
  { year: 1973, stockYield: 0.4279, bondYield: 0.0674 },
  { year: 1974, stockYield: 0.6441, bondYield: 0.0743 },
  { year: 1975, stockYield: 0.4979, bondYield: 0.08 },
  { year: 1976, stockYield: 0.4642, bondYield: 0.0687 },
  { year: 1977, stockYield: 0.5973, bondYield: 0.0769 },
  { year: 1978, stockYield: 0.633, bondYield: 0.0901 },
  { year: 1979, stockYield: 0.6289, bondYield: 0.1039 },
  { year: 1980, stockYield: 0.5537, bondYield: 0.1284 },
  { year: 1981, stockYield: 0.6426, bondYield: 0.1372 },
  { year: 1982, stockYield: 0.5914, bondYield: 0.1054 },
  { year: 1983, stockYield: 0.5175, bondYield: 0.1183 },
  { year: 1984, stockYield: 0.5493, bondYield: 0.115 },
  { year: 1985, stockYield: 0.4573, bondYield: 0.0926 },
  { year: 1986, stockYield: 0.3997, bondYield: 0.0711 },
  { year: 1987, stockYield: 0.4387, bondYield: 0.0899 },
  { year: 1988, stockYield: 0.4231, bondYield: 0.0911 },
  { year: 1989, stockYield: 0.3807, bondYield: 0.0784 },
  { year: 1990, stockYield: 0.4413, bondYield: 0.0808 },
  { year: 1991, stockYield: 0.3768, bondYield: 0.0709 },
  { year: 1992, stockYield: 0.3413, bondYield: 0.0677 },
  { year: 1993, stockYield: 0.324, bondYield: 0.0577 },
  { year: 1994, stockYield: 0.3472, bondYield: 0.0781 },
  { year: 1995, stockYield: 0.2693, bondYield: 0.0571 },
  { year: 1996, stockYield: 0.2406, bondYield: 0.063 },
  { year: 1997, stockYield: 0.1933, bondYield: 0.0581 },
  { year: 1998, stockYield: 0.1634, bondYield: 0.0465 },
  { year: 1999, stockYield: 0.1402, bondYield: 0.0628 },
  { year: 2000, stockYield: 0.1467, bondYield: 0.0524 },
  { year: 2001, stockYield: 0.165, bondYield: 0.0509 },
  { year: 2002, stockYield: 0.2145, bondYield: 0.0403 },
  { year: 2003, stockYield: 0.1931, bondYield: 0.0427 },
  { year: 2004, stockYield: 0.1945, bondYield: 0.0423 },
  { year: 2005, stockYield: 0.2113, bondYield: 0.0447 },
  { year: 2006, stockYield: 0.2108, bondYield: 0.0456 },
  { year: 2007, stockYield: 0.225, bondYield: 0.041 },
  { year: 2008, stockYield: 0.3882, bondYield: 0.0242 },
  { year: 2009, stockYield: 0.2422, bondYield: 0.0359 },
  { year: 2010, stockYield: 0.2197, bondYield: 0.0329 },
  { year: 2011, stockYield: 0.2551, bondYield: 0.0198 },
  { year: 2012, stockYield: 0.2637, bondYield: 0.0172 },
  { year: 2013, stockYield: 0.2323, bondYield: 0.029 },
  { year: 2014, stockYield: 0.2304, bondYield: 0.0221 },
  { year: 2015, stockYield: 0.2535, bondYield: 0.0224 },
  { year: 2016, stockYield: 0.2441, bondYield: 0.0249 },
  { year: 2017, stockYield: 0.2204, bondYield: 0.024 },
  { year: 2018, stockYield: 0.2512, bondYield: 0.0283 },
  { year: 2019, stockYield: 0.22, bondYield: 0.0186 },
  { year: 2020, stockYield: 0.1893, bondYield: 0.0093 },
  { year: 2021, stockYield: 0.155, bondYield: 0.0147 },
  { year: 2022, stockYield: 0.2053, bondYield: 0.0362 },
  { year: 2023, stockYield: 0.1801, bondYield: 0.0402 },
  { year: 2024, stockYield: 0.1494, bondYield: 0.0439 },
];
