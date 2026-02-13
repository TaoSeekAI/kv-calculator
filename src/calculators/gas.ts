/**
 * Gas Kv Calculation Module
 * Based on IEC 60534-2-1 Standard
 */

import { CONSTANTS } from '../constants/index.js';
import type { FlowState } from '../types/index.js';
import { calcFP, calcSumK } from './liquid.js';

/**
 * Calculate specific heat ratio factor Fγ
 * Fγ = γ / 1.4
 *
 * @param gamma Specific heat ratio
 */
export function calcFgamma(gamma: number): number {
  return gamma / 1.4;
}

/**
 * Calculate pressure differential ratio x
 * x = ΔP / P1
 *
 * @param deltaP Pressure differential KPa
 * @param P1 Inlet absolute pressure KPa
 */
export function calcX(deltaP: number, P1: number): number {
  return deltaP / P1;
}

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
export function calcXTP(
  xT: number,
  FP: number,
  K1_KB1: number,
  C: number,
  d: number
): number {
  const term = xT * K1_KB1 / CONSTANTS.N5 * Math.pow(C / (d * d), 2);
  return xT / (FP * FP) / (1 + term);
}

/**
 * Calculate expansion factor Y
 * Y = 1 - x/(3×Fγ×xT)
 * Note: Y minimum value is 0.667
 *
 * @param x Pressure differential ratio
 * @param Fgamma Specific heat ratio factor
 * @param xT Pressure differential ratio factor
 */
export function calcY(x: number, Fgamma: number, xT: number): number {
  const Y = 1 - x / (3 * Fgamma * xT);
  return Math.max(Y, 0.667);
}

/**
 * Determine gas flow state
 * Non-choked: x < Fγ × xT
 * Choked: x ≥ Fγ × xT
 */
export function determineGasFlowState(x: number, Fgamma: number, xT: number): FlowState {
  return x < Fgamma * xT ? 'Non-choked' : 'Choked';
}

/**
 * Determine gas flow state (with fittings)
 * Non-choked: x < Fγ × xTP
 * Choked: x ≥ Fγ × xTP
 */
export function determineGasFlowStateWithFitting(
  x: number,
  Fgamma: number,
  xTP: number
): FlowState {
  return x < Fgamma * xTP ? 'Non-choked' : 'Choked';
}

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
export function calcGasKv(
  Qn: number,
  P1: number,
  Y: number,
  M: number,
  Z: number,
  T1: number,
  x: number
): number {
  return Qn / (CONSTANTS.N9 * P1 * Y) * Math.sqrt(M * Z * T1 / x);
}

/**
 * Gas Kv calculation - Non-choked flow, with fittings
 * C = Qn / (N9×FP×P1×Y) × √(M×Z×T1/x)
 */
export function calcGasKvWithFitting(
  Qn: number,
  P1: number,
  Y: number,
  FP: number,
  M: number,
  Z: number,
  T1: number,
  x: number
): number {
  return Qn / (CONSTANTS.N9 * FP * P1 * Y) * Math.sqrt(M * Z * T1 / x);
}

/**
 * Gas Kv calculation - Choked flow, without fittings
 * C = Qn / (0.667×N9×P1) × √(M×Z×T1/(xT×Fγ))
 */
export function calcGasKvChoked(
  Qn: number,
  P1: number,
  M: number,
  Z: number,
  T1: number,
  xT: number,
  Fgamma: number
): number {
  return Qn / (0.667 * CONSTANTS.N9 * P1) * Math.sqrt(M * Z * T1 / (xT * Fgamma));
}

/**
 * Gas Kv calculation - Choked flow, with fittings
 * C = Qn / (0.667×N9×FP×P1) × √(M×Z×T1/(xTP×Fγ))
 */
export function calcGasKvChokedWithFitting(
  Qn: number,
  P1: number,
  FP: number,
  M: number,
  Z: number,
  T1: number,
  xTP: number,
  Fgamma: number
): number {
  return Qn / (0.667 * CONSTANTS.N9 * FP * P1) * Math.sqrt(M * Z * T1 / (xTP * Fgamma));
}

/**
 * Gas Kv calculation - Laminar flow
 * C = Qn / (N18×FR) × √(M×T1/(ΔP×(P1+P2)))
 */
export function calcGasKvLaminar(
  Qn: number,
  FR: number,
  M: number,
  T1: number,
  deltaP: number,
  P1: number,
  P2: number
): number {
  return Qn / (CONSTANTS.N18 * FR) * Math.sqrt(M * T1 / (deltaP * (P1 + P2)));
}

/**
 * Gas Kv comprehensive calculation parameters
 */
export interface GasKvParams {
  Qn: number;             // Standard volume flow rate Nm³/h
  P1: number;             // Inlet absolute pressure KPa
  P2: number;             // Outlet absolute pressure KPa
  T1: number;             // Inlet absolute temperature K
  M: number;              // Molecular weight Kg/Kmol
  Z: number;              // Compressibility factor
  gamma: number;          // Specific heat ratio
  xT: number;             // Pressure differential ratio factor
  d: number;              // Valve nominal diameter mm
  D1: number;             // Upstream pipe inner diameter mm
  D2: number;             // Downstream pipe inner diameter mm
  ratedKv: number;        // Rated Kv
  FR?: number;            // Reynolds number correction factor
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
export function calculateGasKv(params: GasKvParams): GasKvResult {
  const { Qn, P1, P2, T1, M, Z, gamma, xT, d, D1, D2, ratedKv, FR = 1 } = params;

  // Basic calculations
  const deltaP = P1 - P2;
  const x = calcX(deltaP, P1);
  const Fgamma = calcFgamma(gamma);

  // Determine if fittings affect flow
  const hasFittings = d !== D1 || d !== D2;

  // Piping coefficient calculations
  const sumK = calcSumK(d, D1, D2);

  // Y for no-fitting case (uses xT)
  const Y = calcY(x, Fgamma, xT);

  // Flow state without fittings
  const flowStateNoFitting = determineGasFlowState(x, Fgamma, xT);

  // Step 1: Calculate Kv without fittings first (no FP needed)
  const kvNoFitting = calcGasKv(Qn, P1, Y, M, Z, T1, x);
  const kvChokedNoFitting = calcGasKvChoked(Qn, P1, M, Z, T1, xT, Fgamma);

  // Step 2: Use no-fitting Kv as C for FP/xTP (IEC iteration approach)
  const CforFP = flowStateNoFitting === 'Choked' ? kvChokedNoFitting : kvNoFitting;
  const FP = calcFP(sumK, CforFP, d);

  // Calculate K1 + KB1
  const K1 = 0.5 * Math.pow(1 - Math.pow(d / D1, 2), 2);
  const KB1 = 1 - Math.pow(d / D1, 4);
  const K1_KB1 = K1 + KB1;

  // xTP calculation using CforFP
  const xTP = calcXTP(xT, FP, K1_KB1, CforFP, d);

  // Y for with-fitting case (uses xTP)
  const Y_fitting = calcY(x, Fgamma, xTP);

  // Flow state with fittings
  const flowStateWithFitting = determineGasFlowStateWithFitting(x, Fgamma, xTP);

  // Step 3: Calculate Kv with fittings using iterated FP and Y_fitting
  const kvWithFitting = calcGasKvWithFitting(Qn, P1, Y_fitting, FP, M, Z, T1, x);
  const kvChokedWithFitting = calcGasKvChokedWithFitting(Qn, P1, FP, M, Z, T1, xTP, Fgamma);
  const kvLaminar = FR < 1 ? calcGasKvLaminar(Qn, FR, M, T1, deltaP, P1, P2) : undefined;

  // Select final Kv value
  let kv: number;
  let usedFormula: string;
  let flowState: FlowState;

  if (FR < 1 && kvLaminar) {
    kv = kvLaminar;
    usedFormula = 'Gas laminar flow';
    flowState = flowStateNoFitting;
  } else if (!hasFittings) {
    if (flowStateNoFitting === 'Non-choked') {
      kv = kvNoFitting;
      usedFormula = 'Gas non-choked flow without fittings';
    } else {
      kv = kvChokedNoFitting;
      usedFormula = 'Gas choked flow without fittings';
    }
    flowState = flowStateNoFitting;
  } else {
    if (flowStateWithFitting === 'Non-choked') {
      kv = kvWithFitting;
      usedFormula = 'Gas non-choked flow with fittings';
    } else {
      kv = kvChokedWithFitting;
      usedFormula = 'Gas choked flow with fittings';
    }
    flowState = flowStateWithFitting;
  }

  return {
    kv,
    flowState,
    hasFittings,
    usedFormula,
    intermediate: {
      deltaP,
      x,
      Fgamma,
      Y: hasFittings ? Y_fitting : Y,
      xTP,
      sumK,
      FP,
      kvNoFitting,
      kvWithFitting,
      kvChokedNoFitting,
      kvChokedWithFitting,
      kvLaminar
    }
  };
}
