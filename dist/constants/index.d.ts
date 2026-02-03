/**
 * Kv Calculation System Numerical Constants
 * Based on IEC 60534-2-1 Standard
 */
export declare const CONSTANTS: {
    /**
     * N1: Liquid Kv calculation constant
     * Used in: C = Q/N1 * sqrt(ρ/ρ0 / ΔP)
     * Units: m³/h, KPa
     */
    N1: number;
    /**
     * N2: Piping geometry factor calculation constant
     * Used in: FP calculation
     */
    N2: number;
    /**
     * N4: Reynolds number calculation constant
     * Used in: Rev calculation
     */
    N4: number;
    /**
     * N5: xTP calculation constant
     */
    N5: number;
    /**
     * N6: Steam Kv calculation constant
     * Used in: C = W/(N6*Y*sqrt(x*P1*ρ1))
     */
    N6: number;
    /**
     * N9: Gas Kv calculation constant
     * Used in: C = Qn/(N9*P1*Y) * sqrt(22.4*M*Z*T1/x)
     */
    N9: number;
    /**
     * N14: Noise calculation constant
     */
    N14: number;
    /**
     * N16: Noise calculation constant
     */
    N16: number;
    /**
     * N18: Fd calculation constant
     */
    N18: number;
    ANTOINE: {
        A: number;
        B: number;
        C: number;
    };
    /** Water standard density kg/m³ */
    WATER_DENSITY: number;
    /** Standard atmospheric pressure KPa */
    STD_PRESSURE: number;
    /** Absolute zero offset K */
    STD_TEMP: number;
    /** Water critical pressure MPa */
    WATER_CRITICAL_PRESSURE: number;
    /** Kv to Cv conversion factor */
    KV_TO_CV: number;
    DEFAULT: {
        /** Default compressibility factor */
        Z: number;
        /** Default specific heat ratio (air) */
        GAMMA: number;
        /** Default rangeability */
        RANGEABILITY: number;
        /** Default viscosity cP */
        VISCOSITY: number;
        /** Default Fd value */
        FD: number;
    };
    THRESHOLD: {
        /** Turbulent flow threshold */
        TURBULENT_RE: number;
        /** Error tolerance (0.1%) */
        TOLERANCE: number;
    };
};
/**
 * Pipe Specification Table - SCH40 Standard Wall Thickness
 * Format: { DN: [outer diameter mm, wall thickness mm] }
 */
export declare const PIPE_SPECS: Record<number, [number, number]>;
/**
 * Get pipe specification by DN
 */
export declare function getPipeSpec(dn: number): {
    outerDiameter: number;
    wallThickness: number;
} | null;
