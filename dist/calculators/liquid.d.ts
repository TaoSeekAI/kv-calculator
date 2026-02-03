/**
 * Liquid Kv Calculation Module
 * Based on IEC 60534-2-1 Standard
 */
import type { FlowState, FluidState } from '../types/index.js';
/**
 * Calculate critical pressure ratio factor FF
 * FF = 0.96 - 0.28 × √(Pv / Pc)
 *
 * @param Pv Vapor pressure KPa
 * @param Pc Critical pressure MPa
 */
export declare function calcFF(Pv: number, Pc: number): number;
/**
 * Calculate fitting resistance coefficient K1 (inlet sudden contraction)
 * K1 = 0.5 × (1 - (d/D1)²)²
 *
 * @param d Valve nominal diameter mm
 * @param D1 Upstream pipe inner diameter mm
 */
export declare function calcK1(d: number, D1: number): number;
/**
 * Calculate fitting resistance coefficient K2 (outlet sudden expansion)
 * K2 = 1.0 × (1 - (d/D2)²)²
 *
 * @param d Valve nominal diameter mm
 * @param D2 Downstream pipe inner diameter mm
 */
export declare function calcK2(d: number, D2: number): number;
/**
 * Calculate Bernoulli coefficient KB1
 * KB1 = 1 - (d/D1)⁴
 */
export declare function calcKB1(d: number, D1: number): number;
/**
 * Calculate Bernoulli coefficient KB2
 * KB2 = 1 - (d/D2)⁴
 */
export declare function calcKB2(d: number, D2: number): number;
/**
 * Calculate sum of fitting resistance coefficients ΣK
 * ΣK = K1 + K2 + KB1 - KB2
 * When valve diameter equals pipe inner diameter, ΣK = 0
 */
export declare function calcSumK(d: number, D1: number, D2: number): number;
/**
 * Calculate piping geometry factor FP
 * FP = 1 / √(1 + ΣK/N2 × (Ci/d²)²)
 *
 * @param sumK Sum of fitting resistance coefficients
 * @param Ci Assumed flow coefficient
 * @param d Valve nominal diameter mm
 */
export declare function calcFP(sumK: number, Ci: number, d: number): number;
/**
 * Calculate combined liquid pressure recovery factor FLP
 * FLP = FL / √(1 + FL²/N2 × ΣK × (Ci/d²)²)
 *
 * @param FL Pressure recovery factor
 * @param sumK Sum of fitting resistance coefficients
 * @param Ci Assumed flow coefficient
 * @param d Valve nominal diameter mm
 */
export declare function calcFLP(FL: number, sumK: number, Ci: number, d: number): number;
/**
 * Determine flow state (without fittings)
 * Non-choked: ΔP < FL² × (P1 - FF×Pv)
 * Choked: ΔP ≥ FL² × (P1 - FF×Pv)
 */
export declare function determineFlowStateNoFitting(deltaP: number, FL: number, P1: number, FF: number, Pv: number): FlowState;
/**
 * Determine flow state (with fittings)
 * Non-choked: ΔP < (FLP/FP)² × (P1 - FF×Pv)
 * Choked: ΔP ≥ (FLP/FP)² × (P1 - FF×Pv)
 */
export declare function determineFlowStateWithFitting(deltaP: number, FLP: number, FP: number, P1: number, FF: number, Pv: number): FlowState;
/**
 * Determine fluid state (cavitation/flashing)
 * xF = (P1 - P2) / (P1 - Pv)
 *
 * @param xF Pressure differential ratio
 * @param xFz Incipient cavitation pressure ratio
 * @param FL2 FL²
 */
export declare function determineFluidState(xF: number, xFz: number, FL2: number): FluidState;
/**
 * Calculate pressure differential ratio xF
 * xF = (P1 - P2) / (P1 - Pv)
 */
export declare function calcXF(P1: number, P2: number, Pv: number): number;
/**
 * Calculate incipient cavitation pressure ratio xFz (standard valve)
 * xFz = 0.9 / √(1 + 3×Fd×√(C/(N34×FL)))
 *
 * @param Fd Valve style modifier
 * @param C Flow coefficient
 * @param FL Pressure recovery factor
 */
export declare function calcXFz(Fd: number, C: number, FL: number): number;
/**
 * C1: Non-choked flow, without fittings
 * C1 = Q / N1 × √(ρ/ρ0 / ΔP)
 *
 * @param Q Volume flow rate m³/h
 * @param relativeDensity Relative density
 * @param deltaP Pressure differential KPa
 */
export declare function calcC1(Q: number, relativeDensity: number, deltaP: number): number;
/**
 * C2: Non-choked flow, with fittings
 * C2 = Q / (N1 × FP) × √(ρ/ρ0 / ΔP)
 *
 * @param Q Volume flow rate m³/h
 * @param FP Piping geometry factor
 * @param relativeDensity Relative density
 * @param deltaP Pressure differential KPa
 */
export declare function calcC2(Q: number, FP: number, relativeDensity: number, deltaP: number): number;
/**
 * C3: Choked flow, without fittings
 * C3 = Q / (N1 × FL) × √(ρ/ρ0 / (P1 - FF×Pv))
 *
 * @param Q Volume flow rate m³/h
 * @param FL Pressure recovery factor
 * @param relativeDensity Relative density
 * @param P1 Inlet absolute pressure KPa
 * @param FF Critical pressure ratio factor
 * @param Pv Vapor pressure KPa
 */
export declare function calcC3(Q: number, FL: number, relativeDensity: number, P1: number, FF: number, Pv: number): number;
/**
 * C4: Choked flow, with fittings
 * C4 = Q / (N1 × FLP) × √(ρ/ρ0 / (P1 - FF×Pv))
 *
 * @param Q Volume flow rate m³/h
 * @param FLP Combined liquid pressure recovery factor
 * @param relativeDensity Relative density
 * @param P1 Inlet absolute pressure KPa
 * @param FF Critical pressure ratio factor
 * @param Pv Vapor pressure KPa
 */
export declare function calcC4(Q: number, FLP: number, relativeDensity: number, P1: number, FF: number, Pv: number): number;
/**
 * C5: Non-turbulent (laminar or transitional flow)
 * C5 = Q / (N1 × FR) × √(ρ/ρ0 / ΔP)
 *
 * @param Q Volume flow rate m³/h
 * @param FR Reynolds number factor
 * @param relativeDensity Relative density
 * @param deltaP Pressure differential KPa
 */
export declare function calcC5(Q: number, FR: number, relativeDensity: number, deltaP: number): number;
/**
 * Liquid Kv Calculation Parameters
 */
export interface LiquidKvParams {
    Q: number;
    P1: number;
    P2: number;
    density: number;
    Pv: number;
    Pc: number;
    FL: number;
    d: number;
    D1: number;
    D2: number;
    Fd: number;
    ratedKv: number;
    FR?: number;
}
/**
 * Liquid Kv Calculation Result
 */
export interface LiquidKvResult {
    kv: number;
    flowState: FlowState;
    fluidState: FluidState;
    hasFittings: boolean;
    usedFormula: 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
    intermediate: {
        deltaP: number;
        relativeDensity: number;
        FF: number;
        xF: number;
        xFz: number;
        sumK: number;
        FP: number;
        FLP: number;
        C1: number;
        C2: number;
        C3: number;
        C4: number;
        C5?: number;
    };
}
/**
 * Liquid Kv Comprehensive Calculation
 */
export declare function calculateLiquidKv(params: LiquidKvParams): LiquidKvResult;
