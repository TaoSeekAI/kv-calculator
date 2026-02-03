/**
 * Kv Calculation System Numerical Constants
 * Based on IEC 60534-2-1 Standard
 */

export const CONSTANTS = {
  // ===== Kv Calculation Constants =====
  // These values are from actual usage in Excel file

  /**
   * N1: Liquid Kv calculation constant
   * Used in: C = Q/N1 * sqrt(ρ/ρ0 / ΔP)
   * Units: m³/h, KPa
   */
  N1: 0.1,

  /**
   * N2: Piping geometry factor calculation constant
   * Used in: FP calculation
   */
  N2: 0.0016,

  /**
   * N4: Reynolds number calculation constant
   * Used in: Rev calculation
   */
  N4: 0.0707,

  /**
   * N5: xTP calculation constant
   */
  N5: 0.0018,

  /**
   * N6: Steam Kv calculation constant
   * Used in: C = W/(N6*Y*sqrt(x*P1*ρ1))
   */
  N6: 3.16,

  /**
   * N9: Gas Kv calculation constant
   * Used in: C = Qn/(N9*P1*Y) * sqrt(22.4*M*Z*T1/x)
   */
  N9: 24.6,

  /**
   * N14: Noise calculation constant
   */
  N14: 0.0049,

  /**
   * N16: Noise calculation constant
   */
  N16: 42300,

  /**
   * N18: Fd calculation constant
   */
  N18: 17.3,

  // ===== Antoine Equation Constants (Water) =====
  // log10(Pv) = A - B/(C + T)
  // Pv: Saturation vapor pressure (KPa)
  // T: Temperature (℃)
  ANTOINE: {
    A: 7.07406,
    B: 1657.46,
    C: 227.02
  },

  // ===== Reference Values =====
  /** Water standard density kg/m³ */
  WATER_DENSITY: 1000,

  /** Standard atmospheric pressure KPa */
  STD_PRESSURE: 101.325,

  /** Absolute zero offset K */
  STD_TEMP: 273.15,

  /** Water critical pressure MPa */
  WATER_CRITICAL_PRESSURE: 22.12,

  /** Kv to Cv conversion factor */
  KV_TO_CV: 1.156,

  // ===== Default Values =====
  DEFAULT: {
    /** Default compressibility factor */
    Z: 1,
    /** Default specific heat ratio (air) */
    GAMMA: 1.4,
    /** Default rangeability */
    RANGEABILITY: 50,
    /** Default viscosity cP */
    VISCOSITY: 1,
    /** Default Fd value */
    FD: 0.42
  },

  // ===== Threshold Values =====
  THRESHOLD: {
    /** Turbulent flow threshold */
    TURBULENT_RE: 10000,
    /** Error tolerance (0.1%) */
    TOLERANCE: 0.001
  }
};

/**
 * Pipe Specification Table - SCH40 Standard Wall Thickness
 * Format: { DN: [outer diameter mm, wall thickness mm] }
 */
export const PIPE_SPECS: Record<number, [number, number]> = {
  6: [10.3, 1.73],
  8: [13.7, 2.24],
  10: [17.2, 2.31],
  15: [21.3, 2.77],
  20: [26.9, 2.87],
  25: [33.7, 3.38],
  32: [42.4, 3.56],
  40: [48.3, 3.68],
  50: [60.3, 3.91],
  65: [76.1, 5.16],
  80: [88.9, 5.49],
  100: [114.3, 6.02],
  125: [139.7, 6.55],
  150: [168.3, 7.11],
  200: [219.1, 8.18],
  250: [273, 9.27],
  300: [323.9, 10.31],
  350: [355.6, 11.13],
  400: [406.4, 12.27],
  450: [457, 14.27],
  500: [508, 15.09],
  600: [610, 17.45]
};

/**
 * Get pipe specification by DN
 */
export function getPipeSpec(dn: number): { outerDiameter: number; wallThickness: number } | null {
  const spec = PIPE_SPECS[dn];
  if (!spec) return null;
  return {
    outerDiameter: spec[0],
    wallThickness: spec[1]
  };
}
