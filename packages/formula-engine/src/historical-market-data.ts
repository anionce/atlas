export interface HistoricalMarketYear {
  year: number;
  /** Rentabilidad total anual del S&P 500 (con dividendos reinvertidos), en %. */
  stockReturnPct: number;
  /** Rentabilidad total anual del bono del Tesoro de EE. UU. a 10 años, en %. */
  bondReturnPct: number;
  /** Variación anual del IPC de EE. UU. (CPI-U), en %. */
  inflationPct: number;
}

/**
 * Datos históricos anuales de mercado de EE. UU., 1928-2025 (98 años).
 *
 * No existe un dataset igual de largo y limpio de mercado español o europeo
 * disponible públicamente — por eso, igual que FI Calc, FIRECalc o
 * cFIREsim, usamos datos de EE. UU. Es una limitación real de cualquier
 * backtesting histórico hecho desde fuera de EE. UU., no un descuido: se
 * indica explícitamente en cualquier resultado que use este dataset.
 *
 * Fuentes:
 * - Rentabilidad del S&P 500 y del bono del Tesoro a 10 años: Aswath
 *   Damodaran (NYU Stern), "Historical Returns on Stocks, Bonds and
 *   Bills: 1928-2025" —
 *   https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html
 *   (actualizado enero 2026).
 * - Inflación (variación anual del IPC-U): Federal Reserve Bank of
 *   Minneapolis, "Consumer Price Index, 1913-" —
 *   https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-price-index-1913-
 */
export const US_HISTORICAL_MARKET_RETURNS: HistoricalMarketYear[] = [
  { year: 1928, stockReturnPct: 43.81, bondReturnPct: 0.84, inflationPct: -1.2 },
  { year: 1929, stockReturnPct: -8.3, bondReturnPct: 4.2, inflationPct: 0.0 },
  { year: 1930, stockReturnPct: -25.12, bondReturnPct: 4.54, inflationPct: -2.7 },
  { year: 1931, stockReturnPct: -43.84, bondReturnPct: -2.56, inflationPct: -8.9 },
  { year: 1932, stockReturnPct: -8.64, bondReturnPct: 8.79, inflationPct: -10.3 },
  { year: 1933, stockReturnPct: 49.98, bondReturnPct: 1.86, inflationPct: -5.2 },
  { year: 1934, stockReturnPct: -1.19, bondReturnPct: 7.96, inflationPct: 3.5 },
  { year: 1935, stockReturnPct: 46.74, bondReturnPct: 4.47, inflationPct: 2.6 },
  { year: 1936, stockReturnPct: 31.94, bondReturnPct: 5.02, inflationPct: 1.0 },
  { year: 1937, stockReturnPct: -35.34, bondReturnPct: 1.38, inflationPct: 3.7 },
  { year: 1938, stockReturnPct: 29.28, bondReturnPct: 4.21, inflationPct: -2.0 },
  { year: 1939, stockReturnPct: -1.1, bondReturnPct: 4.41, inflationPct: -1.3 },
  { year: 1940, stockReturnPct: -10.67, bondReturnPct: 5.4, inflationPct: 0.7 },
  { year: 1941, stockReturnPct: -12.77, bondReturnPct: -2.02, inflationPct: 5.1 },
  { year: 1942, stockReturnPct: 19.17, bondReturnPct: 2.29, inflationPct: 10.9 },
  { year: 1943, stockReturnPct: 25.06, bondReturnPct: 2.49, inflationPct: 6.0 },
  { year: 1944, stockReturnPct: 19.03, bondReturnPct: 2.58, inflationPct: 1.6 },
  { year: 1945, stockReturnPct: 35.82, bondReturnPct: 3.8, inflationPct: 2.3 },
  { year: 1946, stockReturnPct: -8.43, bondReturnPct: 3.13, inflationPct: 8.5 },
  { year: 1947, stockReturnPct: 5.2, bondReturnPct: 0.92, inflationPct: 14.4 },
  { year: 1948, stockReturnPct: 5.7, bondReturnPct: 1.95, inflationPct: 7.7 },
  { year: 1949, stockReturnPct: 18.3, bondReturnPct: 4.66, inflationPct: -1.0 },
  { year: 1950, stockReturnPct: 30.81, bondReturnPct: 0.43, inflationPct: 1.1 },
  { year: 1951, stockReturnPct: 23.68, bondReturnPct: -0.3, inflationPct: 7.9 },
  { year: 1952, stockReturnPct: 18.15, bondReturnPct: 2.27, inflationPct: 2.3 },
  { year: 1953, stockReturnPct: -1.21, bondReturnPct: 4.14, inflationPct: 0.8 },
  { year: 1954, stockReturnPct: 52.56, bondReturnPct: 3.29, inflationPct: 0.3 },
  { year: 1955, stockReturnPct: 32.6, bondReturnPct: -1.34, inflationPct: -0.3 },
  { year: 1956, stockReturnPct: 7.44, bondReturnPct: -2.26, inflationPct: 1.5 },
  { year: 1957, stockReturnPct: -10.46, bondReturnPct: 6.8, inflationPct: 3.3 },
  { year: 1958, stockReturnPct: 43.72, bondReturnPct: -2.1, inflationPct: 2.7 },
  { year: 1959, stockReturnPct: 12.06, bondReturnPct: -2.65, inflationPct: 1.08 },
  { year: 1960, stockReturnPct: 0.34, bondReturnPct: 11.64, inflationPct: 1.5 },
  { year: 1961, stockReturnPct: 26.64, bondReturnPct: 2.06, inflationPct: 1.1 },
  { year: 1962, stockReturnPct: -8.81, bondReturnPct: 5.69, inflationPct: 1.2 },
  { year: 1963, stockReturnPct: 22.61, bondReturnPct: 1.68, inflationPct: 1.2 },
  { year: 1964, stockReturnPct: 16.42, bondReturnPct: 3.73, inflationPct: 1.3 },
  { year: 1965, stockReturnPct: 12.4, bondReturnPct: 0.72, inflationPct: 1.6 },
  { year: 1966, stockReturnPct: -9.97, bondReturnPct: 2.91, inflationPct: 3.0 },
  { year: 1967, stockReturnPct: 23.8, bondReturnPct: -1.58, inflationPct: 2.8 },
  { year: 1968, stockReturnPct: 10.81, bondReturnPct: 3.27, inflationPct: 4.3 },
  { year: 1969, stockReturnPct: -8.24, bondReturnPct: -5.01, inflationPct: 5.5 },
  { year: 1970, stockReturnPct: 3.56, bondReturnPct: 16.75, inflationPct: 5.8 },
  { year: 1971, stockReturnPct: 14.22, bondReturnPct: 9.79, inflationPct: 4.3 },
  { year: 1972, stockReturnPct: 18.76, bondReturnPct: 2.82, inflationPct: 3.3 },
  { year: 1973, stockReturnPct: -14.31, bondReturnPct: 3.66, inflationPct: 6.2 },
  { year: 1974, stockReturnPct: -25.9, bondReturnPct: 1.99, inflationPct: 11.1 },
  { year: 1975, stockReturnPct: 37.0, bondReturnPct: 3.61, inflationPct: 9.1 },
  { year: 1976, stockReturnPct: 23.83, bondReturnPct: 15.98, inflationPct: 5.7 },
  { year: 1977, stockReturnPct: -6.98, bondReturnPct: 1.29, inflationPct: 6.5 },
  { year: 1978, stockReturnPct: 6.51, bondReturnPct: -0.78, inflationPct: 7.6 },
  { year: 1979, stockReturnPct: 18.52, bondReturnPct: 0.67, inflationPct: 11.3 },
  { year: 1980, stockReturnPct: 31.74, bondReturnPct: -2.99, inflationPct: 13.5 },
  { year: 1981, stockReturnPct: -4.7, bondReturnPct: 8.2, inflationPct: 10.3 },
  { year: 1982, stockReturnPct: 20.42, bondReturnPct: 32.81, inflationPct: 6.1 },
  { year: 1983, stockReturnPct: 22.34, bondReturnPct: 3.2, inflationPct: 3.2 },
  { year: 1984, stockReturnPct: 6.15, bondReturnPct: 13.73, inflationPct: 4.3 },
  { year: 1985, stockReturnPct: 31.24, bondReturnPct: 25.71, inflationPct: 3.5 },
  { year: 1986, stockReturnPct: 18.49, bondReturnPct: 24.28, inflationPct: 1.9 },
  { year: 1987, stockReturnPct: 5.81, bondReturnPct: -4.96, inflationPct: 3.7 },
  { year: 1988, stockReturnPct: 16.54, bondReturnPct: 8.22, inflationPct: 4.1 },
  { year: 1989, stockReturnPct: 31.48, bondReturnPct: 17.69, inflationPct: 4.8 },
  { year: 1990, stockReturnPct: -3.06, bondReturnPct: 6.24, inflationPct: 5.4 },
  { year: 1991, stockReturnPct: 30.23, bondReturnPct: 15.0, inflationPct: 4.2 },
  { year: 1992, stockReturnPct: 7.49, bondReturnPct: 9.36, inflationPct: 3.0 },
  { year: 1993, stockReturnPct: 9.97, bondReturnPct: 14.21, inflationPct: 3.0 },
  { year: 1994, stockReturnPct: 1.33, bondReturnPct: -8.04, inflationPct: 2.6 },
  { year: 1995, stockReturnPct: 37.2, bondReturnPct: 23.48, inflationPct: 2.8 },
  { year: 1996, stockReturnPct: 22.68, bondReturnPct: 1.43, inflationPct: 2.9 },
  { year: 1997, stockReturnPct: 33.1, bondReturnPct: 9.94, inflationPct: 2.3 },
  { year: 1998, stockReturnPct: 28.34, bondReturnPct: 14.92, inflationPct: 1.6 },
  { year: 1999, stockReturnPct: 20.89, bondReturnPct: -8.25, inflationPct: 2.2 },
  { year: 2000, stockReturnPct: -9.03, bondReturnPct: 16.66, inflationPct: 3.4 },
  { year: 2001, stockReturnPct: -11.85, bondReturnPct: 5.57, inflationPct: 2.8 },
  { year: 2002, stockReturnPct: -21.97, bondReturnPct: 15.12, inflationPct: 1.6 },
  { year: 2003, stockReturnPct: 28.36, bondReturnPct: 0.38, inflationPct: 2.3 },
  { year: 2004, stockReturnPct: 10.74, bondReturnPct: 4.49, inflationPct: 2.7 },
  { year: 2005, stockReturnPct: 4.83, bondReturnPct: 2.87, inflationPct: 3.4 },
  { year: 2006, stockReturnPct: 15.61, bondReturnPct: 1.96, inflationPct: 3.2 },
  { year: 2007, stockReturnPct: 5.48, bondReturnPct: 10.21, inflationPct: 2.9 },
  { year: 2008, stockReturnPct: -36.55, bondReturnPct: 20.1, inflationPct: 3.8 },
  { year: 2009, stockReturnPct: 25.94, bondReturnPct: -11.12, inflationPct: -0.4 },
  { year: 2010, stockReturnPct: 14.82, bondReturnPct: 8.46, inflationPct: 1.6 },
  { year: 2011, stockReturnPct: 2.1, bondReturnPct: 16.04, inflationPct: 3.2 },
  { year: 2012, stockReturnPct: 15.89, bondReturnPct: 2.97, inflationPct: 2.1 },
  { year: 2013, stockReturnPct: 32.15, bondReturnPct: -9.1, inflationPct: 1.5 },
  { year: 2014, stockReturnPct: 13.52, bondReturnPct: 10.75, inflationPct: 1.6 },
  { year: 2015, stockReturnPct: 1.38, bondReturnPct: 1.28, inflationPct: 0.1 },
  { year: 2016, stockReturnPct: 11.77, bondReturnPct: 0.69, inflationPct: 1.3 },
  { year: 2017, stockReturnPct: 21.61, bondReturnPct: 2.8, inflationPct: 2.1 },
  { year: 2018, stockReturnPct: -4.23, bondReturnPct: -0.02, inflationPct: 2.4 },
  { year: 2019, stockReturnPct: 31.21, bondReturnPct: 9.64, inflationPct: 1.8 },
  { year: 2020, stockReturnPct: 18.02, bondReturnPct: 11.33, inflationPct: 1.2 },
  { year: 2021, stockReturnPct: 28.47, bondReturnPct: -4.42, inflationPct: 4.7 },
  { year: 2022, stockReturnPct: -18.04, bondReturnPct: -17.83, inflationPct: 8.0 },
  { year: 2023, stockReturnPct: 26.06, bondReturnPct: 3.88, inflationPct: 4.1 },
  { year: 2024, stockReturnPct: 24.88, bondReturnPct: -1.64, inflationPct: 2.9 },
  { year: 2025, stockReturnPct: 17.78, bondReturnPct: 7.8, inflationPct: 2.6 },
];
