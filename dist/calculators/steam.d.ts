/**
 * Steam Kv Calculation Module
 * Based on IEC 60534-2-1 Standard
 */
import type { FlowState } from '../types/index.js';
/**
 * Steam Kv calculation - Non-choked flow, without fittings
 * C = W / (N6×Y×√(x×P1×ρ1))
 *
 * @param W Mass flow rate Kg/h
 * @param Y Expansion factor
 * @param x Pressure differential ratio
 * @param P1 Inlet absolute pressure KPa
 * @param rho1 Inlet density Kg/m³
 */
export declare function calcSteamKv(W: number, Y: number, x: number, P1: number, rho1: number): number;
/**
 * Steam Kv calculation - Non-choked flow, with fittings
 * C = W / (N6×FP×Y×√(x×P1×ρ1))
 */
export declare function calcSteamKvWithFitting(W: number, FP: number, Y: number, x: number, P1: number, rho1: number): number;
/**
 * Steam Kv calculation - Choked flow, without fittings
 * C = W / (0.667×N6×√(Fγ×xT×P1×ρ1))
 */
export declare function calcSteamKvChoked(W: number, Fgamma: number, xT: number, P1: number, rho1: number): number;
/**
 * Steam Kv calculation - Choked flow, with fittings
 * C = W / (0.667×FP×N6×√(Fγ×xTP×P1×ρ1))
 */
export declare function calcSteamKvChokedWithFitting(W: number, FP: number, Fgamma: number, xTP: number, P1: number, rho1: number): number;
/**
 * Steam Kv calculation - Laminar flow
 * C = W / (N18×FR) × √(T1/(ΔP×(P1+P2)×M))
 * Steam molecular weight M = 18.0152
 */
export declare function calcSteamKvLaminar(W: number, FR: number, T1: number, deltaP: number, P1: number, P2: number): number;
/**
 * Steam Kv comprehensive calculation parameters
 */
export interface SteamKvParams {
    W: number;
    P1: number;
    P2: number;
    T1: number;
    rho1: number;
    gamma: number;
    xT: number;
    d: number;
    D1: number;
    D2: number;
    ratedKv: number;
    FR?: number;
}
/**
 * Steam Kv calculation result
 */
export interface SteamKvResult {
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
 * Steam Kv comprehensive calculation
 */
export declare function calculateSteamKv(params: SteamKvParams): SteamKvResult;
