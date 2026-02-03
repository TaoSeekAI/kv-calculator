/**
 * Liquid Kv Calculation Module
 * Based on IEC 60534-2-1 Standard
 */

import { CONSTANTS } from '../constants/index.js';
import type { FlowState, FluidState } from '../types/index.js';

/**
 * Calculate critical pressure ratio factor FF
 * FF = 0.96 - 0.28 × √(Pv / Pc)
 *
 * @param Pv Vapor pressure KPa
 * @param Pc Critical pressure MPa
 */
export function calcFF(Pv: number, Pc: number): number {
  return 0.96 - 0.28 * Math.sqrt(Pv / (Pc * 1000));
}

/**
 * Calculate fitting resistance coefficient K1 (inlet sudden contraction)
 * K1 = 0.5 × (1 - (d/D1)²)²
 *
 * @param d Valve nominal diameter mm
 * @param D1 Upstream pipe inner diameter mm
 */
export function calcK1(d: number, D1: number): number {
  return 0.5 * Math.pow(1 - Math.pow(d / D1, 2), 2);
}

/**
 * Calculate fitting resistance coefficient K2 (outlet sudden expansion)
 * K2 = 1.0 × (1 - (d/D2)²)²
 *
 * @param d Valve nominal diameter mm
 * @param D2 Downstream pipe inner diameter mm
 */
export function calcK2(d: number, D2: number): number {
  return 1.0 * Math.pow(1 - Math.pow(d / D2, 2), 2);
}

/**
 * Calculate Bernoulli coefficient KB1
 * KB1 = 1 - (d/D1)⁴
 */
export function calcKB1(d: number, D1: number): number {
  return 1 - Math.pow(d / D1, 4);
}

/**
 * Calculate Bernoulli coefficient KB2
 * KB2 = 1 - (d/D2)⁴
 */
export function calcKB2(d: number, D2: number): number {
  return 1 - Math.pow(d / D2, 4);
}

/**
 * Calculate sum of fitting resistance coefficients ΣK
 * ΣK = K1 + K2 + KB1 - KB2
 * When valve diameter equals pipe inner diameter, ΣK = 0
 */
export function calcSumK(d: number, D1: number, D2: number): number {
  // When valve diameter equals pipe inner diameter, no fitting resistance
  if (Math.abs(d - D1) < 0.1 && Math.abs(d - D2) < 0.1) {
    return 0;
  }
  const K1 = calcK1(d, D1);
  const K2 = calcK2(d, D2);
  const KB1 = calcKB1(d, D1);
  const KB2 = calcKB2(d, D2);
  return K1 + K2 + KB1 - KB2;
}

/**
 * Calculate piping geometry factor FP
 * FP = 1 / √(1 + ΣK/N2 × (Ci/d²)²)
 *
 * @param sumK Sum of fitting resistance coefficients
 * @param Ci Assumed flow coefficient
 * @param d Valve nominal diameter mm
 */
export function calcFP(sumK: number, Ci: number, d: number): number {
  const term = sumK / CONSTANTS.N2 * Math.pow(Ci / (d * d), 2);
  return 1 / Math.sqrt(1 + term);
}

/**
 * Calculate combined liquid pressure recovery factor FLP
 * FLP = FL / √(1 + FL²/N2 × ΣK × (Ci/d²)²)
 *
 * @param FL Pressure recovery factor
 * @param sumK Sum of fitting resistance coefficients
 * @param Ci Assumed flow coefficient
 * @param d Valve nominal diameter mm
 */
export function calcFLP(FL: number, sumK: number, Ci: number, d: number): number {
  const term = FL * FL / CONSTANTS.N2 * sumK * Math.pow(Ci / (d * d), 2);
  return FL / Math.sqrt(1 + term);
}

/**
 * Determine flow state (without fittings)
 * Non-choked: ΔP < FL² × (P1 - FF×Pv)
 * Choked: ΔP ≥ FL² × (P1 - FF×Pv)
 */
export function determineFlowStateNoFitting(
  deltaP: number,
  FL: number,
  P1: number,
  FF: number,
  Pv: number
): FlowState {
  const criticalDeltaP = FL * FL * (P1 - FF * Pv);
  return deltaP < criticalDeltaP ? 'Non-choked' : 'Choked';
}

/**
 * Determine flow state (with fittings)
 * Non-choked: ΔP < (FLP/FP)² × (P1 - FF×Pv)
 * Choked: ΔP ≥ (FLP/FP)² × (P1 - FF×Pv)
 */
export function determineFlowStateWithFitting(
  deltaP: number,
  FLP: number,
  FP: number,
  P1: number,
  FF: number,
  Pv: number
): FlowState {
  const ratio = FLP / FP;
  const criticalDeltaP = ratio * ratio * (P1 - FF * Pv);
  return deltaP < criticalDeltaP ? 'Non-choked' : 'Choked';
}

/**
 * Determine fluid state (cavitation/flashing)
 * xF = (P1 - P2) / (P1 - Pv)
 *
 * @param xF Pressure differential ratio
 * @param xFz Incipient cavitation pressure ratio
 * @param FL2 FL²
 */
export function determineFluidState(xF: number, xFz: number, FL2: number): FluidState {
  if (xF <= xFz) {
    return 'No Cavitation';
  } else if (xF > xFz && xF <= FL2) {
    return 'Incipient Cavitation';
  } else if (xF > FL2 && xF <= 1) {
    return 'Cavitation';
  } else {
    return 'Flashing';
  }
}

/**
 * Calculate pressure differential ratio xF
 * xF = (P1 - P2) / (P1 - Pv)
 */
export function calcXF(P1: number, P2: number, Pv: number): number {
  return (P1 - P2) / (P1 - Pv);
}

/**
 * Calculate incipient cavitation pressure ratio xFz (standard valve)
 * xFz = 0.9 / √(1 + 3×Fd×√(C/(N34×FL)))
 *
 * @param Fd Valve style modifier
 * @param C Flow coefficient
 * @param FL Pressure recovery factor
 */
export function calcXFz(Fd: number, C: number, FL: number): number {
  const N34 = 1; // Simplified constant
  return 0.9 / Math.sqrt(1 + 3 * Fd * Math.sqrt(C / (N34 * FL)));
}

/**
 * C1: Non-choked flow, without fittings
 * C1 = Q / N1 × √(ρ/ρ0 / ΔP)
 *
 * @param Q Volume flow rate m³/h
 * @param relativeDensity Relative density
 * @param deltaP Pressure differential KPa
 */
export function calcC1(Q: number, relativeDensity: number, deltaP: number): number {
  return Q / CONSTANTS.N1 * Math.sqrt(relativeDensity / deltaP);
}

/**
 * C2: Non-choked flow, with fittings
 * C2 = Q / (N1 × FP) × √(ρ/ρ0 / ΔP)
 *
 * @param Q Volume flow rate m³/h
 * @param FP Piping geometry factor
 * @param relativeDensity Relative density
 * @param deltaP Pressure differential KPa
 */
export function calcC2(Q: number, FP: number, relativeDensity: number, deltaP: number): number {
  return Q / (CONSTANTS.N1 * FP) * Math.sqrt(relativeDensity / deltaP);
}

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
export function calcC3(
  Q: number,
  FL: number,
  relativeDensity: number,
  P1: number,
  FF: number,
  Pv: number
): number {
  return Q / (CONSTANTS.N1 * FL) * Math.sqrt(relativeDensity / (P1 - FF * Pv));
}

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
export function calcC4(
  Q: number,
  FLP: number,
  relativeDensity: number,
  P1: number,
  FF: number,
  Pv: number
): number {
  return Q / (CONSTANTS.N1 * FLP) * Math.sqrt(relativeDensity / (P1 - FF * Pv));
}

/**
 * C5: Non-turbulent (laminar or transitional flow)
 * C5 = Q / (N1 × FR) × √(ρ/ρ0 / ΔP)
 *
 * @param Q Volume flow rate m³/h
 * @param FR Reynolds number factor
 * @param relativeDensity Relative density
 * @param deltaP Pressure differential KPa
 */
export function calcC5(Q: number, FR: number, relativeDensity: number, deltaP: number): number {
  return Q / (CONSTANTS.N1 * FR) * Math.sqrt(relativeDensity / deltaP);
}

/**
 * Liquid Kv Calculation Parameters
 */
export interface LiquidKvParams {
  Q: number;              // Volume flow rate m³/h
  P1: number;             // Inlet absolute pressure KPa
  P2: number;             // Outlet absolute pressure KPa
  density: number;        // Density Kg/m³
  Pv: number;             // Vapor pressure KPa
  Pc: number;             // Critical pressure MPa
  FL: number;             // Pressure recovery factor
  d: number;              // Valve nominal diameter mm
  D1: number;             // Upstream pipe inner diameter mm
  D2: number;             // Downstream pipe inner diameter mm
  Fd: number;             // Valve style modifier
  ratedKv: number;        // Rated Kv (for iteration)
  FR?: number;            // Reynolds number factor (if already calculated)
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
export function calculateLiquidKv(params: LiquidKvParams): LiquidKvResult {
  const { Q, P1, P2, density, Pv, Pc, FL, d, D1, D2, Fd, ratedKv, FR = 1 } = params;

  // Basic calculations
  const deltaP = P1 - P2;
  const relativeDensity = density / CONSTANTS.WATER_DENSITY;
  const FF = calcFF(Pv, Pc);

  // Fitting coefficient calculations
  const sumK = calcSumK(d, D1, D2);
  const Ci = ratedKv * 1.3; // Assumed flow coefficient
  const FP = calcFP(sumK, Ci, d);
  const FLP = calcFLP(FL, sumK, Ci, d);

  // Flow state determination
  const flowStateNoFitting = determineFlowStateNoFitting(deltaP, FL, P1, FF, Pv);
  const flowStateWithFitting = determineFlowStateWithFitting(deltaP, FLP, FP, P1, FF, Pv);

  // Determine if there are fittings
  const hasFittings = d !== D1 || d !== D2;

  // Calculate Kv using each formula
  const C1 = calcC1(Q, relativeDensity, deltaP);
  const C2 = calcC2(Q, FP, relativeDensity, deltaP);
  const C3 = calcC3(Q, FL, relativeDensity, P1, FF, Pv);
  const C4 = calcC4(Q, FLP, relativeDensity, P1, FF, Pv);
  const C5 = FR < 1 ? calcC5(Q, FR, relativeDensity, deltaP) : undefined;

  // Fluid state determination
  const xF = calcXF(P1, P2, Pv);
  const xFz = calcXFz(Fd, C1, FL);
  const FL2 = FL * FL;
  const fluidState = determineFluidState(xF, xFz, FL2);

  // Select final Kv value and formula
  let kv: number;
  let usedFormula: 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
  let flowState: FlowState;

  // FR < 1 indicates non-turbulent flow
  if (FR < 1 && C5) {
    kv = C5;
    usedFormula = 'C5';
    flowState = flowStateNoFitting;
  } else if (!hasFittings) {
    // Without fittings
    if (flowStateNoFitting === 'Non-choked') {
      kv = C1;
      usedFormula = 'C1';
    } else {
      kv = C3;
      usedFormula = 'C3';
    }
    flowState = flowStateNoFitting;
  } else {
    // With fittings
    if (flowStateWithFitting === 'Non-choked') {
      kv = C2;
      usedFormula = 'C2';
    } else {
      kv = C4;
      usedFormula = 'C4';
    }
    flowState = flowStateWithFitting;
  }

  return {
    kv,
    flowState,
    fluidState,
    hasFittings,
    usedFormula,
    intermediate: {
      deltaP,
      relativeDensity,
      FF,
      xF,
      xFz,
      sumK,
      FP,
      FLP,
      C1,
      C2,
      C3,
      C4,
      C5
    }
  };
}
