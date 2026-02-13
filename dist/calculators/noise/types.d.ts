/**
 * Noise Calculation Type Definitions
 * Based on IEC 60534-8-3 (Gas) and IEC 60534-8-4 (Liquid)
 */
export type GasFlowState = 'State I' | 'State II' | 'State III' | 'State IV' | 'State V';
export type CavitationState = 'No Cavitation' | 'Incipient Cavitation' | 'Constant Cavitation' | 'Flashing';
export type PipeMaterial = 'steel' | 'stainless';
/**
 * Noise Calculation Input Parameters
 */
export interface NoiseInput {
    fluidType: 'Liquid' | 'Gas' | 'Steam';
    P1: number;
    P2: number;
    deltaP: number;
    T1: number;
    massFlow: number;
    volumeFlow?: number;
    density: number;
    density2?: number;
    gamma?: number;
    molecularWeight?: number;
    Pv?: number;
    soundSpeed?: number;
    Kv: number;
    Cv: number;
    FL: number;
    xT?: number;
    Fd?: number;
    xFz?: number;
    xF?: number;
    Di: number;
    tp: number;
    pipeMaterial?: PipeMaterial;
    d: number;
}
/**
 * Gas Noise Intermediate Calculation Values
 */
export interface GasNoiseIntermediate {
    P2C: number;
    Pvc: number;
    Pvcc: number;
    c1: number;
    c2: number;
    Uvc: number;
    U2: number;
    Mvc: number;
    Mj?: number;
    eta: number;
    Wm: number;
    Wa: number;
    Lpi: number;
    TL: number;
    Lpae: number;
    Lpe: number;
    fp: number;
    deltaLA: number;
    rho2: number;
    Fgamma: number;
    Dj?: number;
    M0?: number;
    Lg?: number;
}
/**
 * Liquid Noise Intermediate Calculation Values
 */
export interface LiquidNoiseIntermediate {
    deltaPc: number;
    Uvc: number;
    cL: number;
    etaTurb: number;
    etaCav: number;
    eta: number;
    Wm: number;
    Wa: number;
    rw: number;
    Lpi: number;
    TL: number;
    Lpae: number;
    Lpe: number;
    fp: number;
    xF: number;
    xFz: number;
}
/**
 * Noise Calculation Result
 */
export interface NoiseResult {
    noiseLevel: number;
    flowState: string;
    cavitationState?: CavitationState;
    intermediate: GasNoiseIntermediate | LiquidNoiseIntermediate;
    peakFrequency: number;
    warnings?: string[];
}
