/**
 * Gas Kv Calculation Module
 * Based on IEC 60534-2-1 Standard
 */
import type { FlowState } from '../types/index.js';
/**
 * Calculate specific heat ratio factor Fγ
 * Fγ = γ / 1.4
 *
 * @param gamma Specific heat ratio
 */
export declare function calcFgamma(gamma: number): number;
/**
 * Calculate pressure differential ratio x
 * x = ΔP / P1
 *
 * @param deltaP Pressure differential KPa
 * @param P1 Inlet absolute pressure KPa
 */
export declare function calcX(deltaP: number, P1: number): number;
/**
 * Calculate critical pressure differential ratio xT (with fittings correction) xTP
 * xTP = xT / FP² / (1 + xT×(K1+KB1)/N5 × (C/d²)²)
 *
 * @param xT Pressure differential ratio factor
 * @param FP Piping geometry factor
 * @param K1_KB1 K1 + KB1
 * @param C Flow coefficient
 * @param d Valve nominal diameter mm
 */
export declare function calcXTP(xT: number, FP: number, K1_KB1: number, C: number, d: number): number;
/**
 * Calculate expansion factor Y
 * Y = 1 - x/(3×Fγ×xT)
 * Note: Y minimum value is 0.667
 *
 * @param x Pressure differential ratio
 * @param Fgamma Specific heat ratio factor
 * @param xT Pressure differential ratio factor
 */
export declare function calcY(x: number, Fgamma: number, xT: number): number;
/**
 * Determine gas flow state
 * Non-choked: x < Fγ × xT
 * Choked: x ≥ Fγ × xT
 */
export declare function determineGasFlowState(x: number, Fgamma: number, xT: number): FlowState;
/**
 * Determine gas flow state (with fittings)
 * Non-choked: x < Fγ × xTP
 * Choked: x ≥ Fγ × xTP
 */
export declare function determineGasFlowStateWithFitting(x: number, Fgamma: number, xTP: number): FlowState;
/**
 * Gas Kv calculation - Non-choked flow, without fittings
 * C = Qn / (N9×P1×Y) × √(M×Z×T1/x)
 *
 * Based on IEC 60534-2-1 standard formula
 * N9 = 24.6 (when Qn in Nm³/h, P1 in KPa, T1 in K)
 *
 * @param Qn Standard volume flow rate Nm³/h
 * @param P1 Inlet absolute pressure KPa
 * @param Y Expansion factor
 * @param M Molecular weight Kg/Kmol
 * @param Z Compressibility factor
 * @param T1 Inlet absolute temperature K
 * @param x Pressure differential ratio
 */
export declare function calcGasKv(Qn: number, P1: number, Y: number, M: number, Z: number, T1: number, x: number): number;
/**
 * Gas Kv calculation - Non-choked flow, with fittings
 * C = Qn / (N9×FP×P1×Y) × √(M×Z×T1/x)
 */
export declare function calcGasKvWithFitting(Qn: number, P1: number, Y: number, FP: number, M: number, Z: number, T1: number, x: number): number;
/**
 * Gas Kv calculation - Choked flow, without fittings
 * C = Qn / (0.667×N9×P1) × √(M×Z×T1/(xT×Fγ))
 */
export declare function calcGasKvChoked(Qn: number, P1: number, M: number, Z: number, T1: number, xT: number, Fgamma: number): number;
/**
 * Gas Kv calculation - Choked flow, with fittings
 * C = Qn / (0.667×N9×FP×P1) × √(M×Z×T1/(xTP×Fγ))
 */
export declare function calcGasKvChokedWithFitting(Qn: number, P1: number, FP: number, M: number, Z: number, T1: number, xTP: number, Fgamma: number): number;
/**
 * Gas Kv calculation - Laminar flow
 * C = Qn / (N18×FR) × √(M×T1/(ΔP×(P1+P2)))
 */
export declare function calcGasKvLaminar(Qn: number, FR: number, M: number, T1: number, deltaP: number, P1: number, P2: number): number;
/**
 * Gas Kv comprehensive calculation parameters
 */
export interface GasKvParams {
    Qn: number;
    P1: number;
    P2: number;
    T1: number;
    M: number;
    Z: number;
    gamma: number;
    xT: number;
    d: number;
    D1: number;
    D2: number;
    ratedKv: number;
    FR?: number;
}
/**
 * Gas Kv calculation result
 */
export interface GasKvResult {
    kv: number;
    flowState: FlowState;
    hasFittings: boolean;
    usedFormula: string;
    intermediate: {
        deltaP: number;
        x: number;
        Fgamma: number;
        Y: number;
        xTP: number;
        sumK: number;
        FP: number;
        kvNoFitting: number;
        kvWithFitting: number;
        kvChokedNoFitting: number;
        kvChokedWithFitting: number;
        kvLaminar?: number;
    };
}
/**
 * Gas Kv comprehensive calculation
 */
export declare function calculateGasKv(params: GasKvParams): GasKvResult;
