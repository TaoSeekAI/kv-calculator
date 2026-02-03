/**
 * Steam Kv Calculation Module
 * Based on IEC 60534-2-1 Standard
 */

import { CONSTANTS } from '../constants/index.js';
import type { FlowState } from '../types/index.js';
import { calcFP, calcSumK } from './liquid.js';
import { calcFgamma, calcX, calcXTP, calcY, determineGasFlowState, determineGasFlowStateWithFitting } from './gas.js';

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
export function calcSteamKv(
  W: number,
  Y: number,
  x: number,
  P1: number,
  rho1: number
): number {
  return W / (CONSTANTS.N6 * Y * Math.sqrt(x * P1 * rho1));
}

/**
 * Steam Kv calculation - Non-choked flow, with fittings
 * C = W / (N6×FP×Y×√(x×P1×ρ1))
 */
export function calcSteamKvWithFitting(
  W: number,
  FP: number,
  Y: number,
  x: number,
  P1: number,
  rho1: number
): number {
  return W / (CONSTANTS.N6 * FP * Y * Math.sqrt(x * P1 * rho1));
}

/**
 * Steam Kv calculation - Choked flow, without fittings
 * C = W / (0.667×N6×√(Fγ×xT×P1×ρ1))
 */
export function calcSteamKvChoked(
  W: number,
  Fgamma: number,
  xT: number,
  P1: number,
  rho1: number
): number {
  return W / (0.667 * CONSTANTS.N6 * Math.sqrt(Fgamma * xT * P1 * rho1));
}

/**
 * Steam Kv calculation - Choked flow, with fittings
 * C = W / (0.667×FP×N6×√(Fγ×xTP×P1×ρ1))
 */
export function calcSteamKvChokedWithFitting(
  W: number,
  FP: number,
  Fgamma: number,
  xTP: number,
  P1: number,
  rho1: number
): number {
  return W / (0.667 * FP * CONSTANTS.N6 * Math.sqrt(Fgamma * xTP * P1 * rho1));
}

/**
 * Steam Kv calculation - Laminar flow
 * C = W / (N18×FR) × √(T1/(ΔP×(P1+P2)×M))
 * Steam molecular weight M = 18.0152
 */
export function calcSteamKvLaminar(
  W: number,
  FR: number,
  T1: number,
  deltaP: number,
  P1: number,
  P2: number
): number {
  const M = 18.0152; // Water vapor molecular weight
  return W / (CONSTANTS.N18 * FR) * Math.sqrt(T1 / (deltaP * (P1 + P2) * M));
}

/**
 * Steam Kv comprehensive calculation parameters
 */
export interface SteamKvParams {
  W: number;              // Mass flow rate Kg/h
  P1: number;             // Inlet absolute pressure KPa
  P2: number;             // Outlet absolute pressure KPa
  T1: number;             // Inlet absolute temperature K
  rho1: number;           // Inlet density Kg/m³
  gamma: number;          // Specific heat ratio
  xT: number;             // Pressure differential ratio factor
  d: number;              // Valve nominal diameter mm
  D1: number;             // Upstream pipe inner diameter mm
  D2: number;             // Downstream pipe inner diameter mm
  ratedKv: number;        // Rated Kv
  FR?: number;            // Reynolds number correction factor
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
export function calculateSteamKv(params: SteamKvParams): SteamKvResult {
  const { W, P1, P2, T1, rho1, gamma, xT, d, D1, D2, ratedKv, FR = 1 } = params;

  // Basic calculations
  const deltaP = P1 - P2;
  const x = calcX(deltaP, P1);
  const Fgamma = calcFgamma(gamma);
  const Y = calcY(x, Fgamma, xT);

  // Piping coefficient calculations
  const sumK = calcSumK(d, D1, D2);
  const Ci = ratedKv * 1.3;
  const FP = calcFP(sumK, Ci, d);

  // Calculate K1 + KB1
  const K1 = 0.5 * Math.pow(1 - Math.pow(d / D1, 2), 2);
  const KB1 = 1 - Math.pow(d / D1, 4);
  const K1_KB1 = K1 + KB1;

  // xTP calculation
  const xTP = calcXTP(xT, FP, K1_KB1, Ci, d);

  // Determine if fittings affect flow
  const hasFittings = d !== D1 || d !== D2;

  // Flow state determination
  const flowStateNoFitting = determineGasFlowState(x, Fgamma, xT);
  const flowStateWithFitting = determineGasFlowStateWithFitting(x, Fgamma, xTP);

  // Calculate Kv using different formulas
  const kvNoFitting = calcSteamKv(W, Y, x, P1, rho1);
  const kvWithFitting = calcSteamKvWithFitting(W, FP, Y, x, P1, rho1);
  const kvChokedNoFitting = calcSteamKvChoked(W, Fgamma, xT, P1, rho1);
  const kvChokedWithFitting = calcSteamKvChokedWithFitting(W, FP, Fgamma, xTP, P1, rho1);
  const kvLaminar = FR < 1 ? calcSteamKvLaminar(W, FR, T1, deltaP, P1, P2) : undefined;

  // Select final Kv value
  let kv: number;
  let usedFormula: string;
  let flowState: FlowState;

  if (FR < 1 && kvLaminar) {
    kv = kvLaminar;
    usedFormula = 'Steam laminar flow';
    flowState = flowStateNoFitting;
  } else if (!hasFittings) {
    if (flowStateNoFitting === 'Non-choked') {
      kv = kvNoFitting;
      usedFormula = 'Steam non-choked flow without fittings';
    } else {
      kv = kvChokedNoFitting;
      usedFormula = 'Steam choked flow without fittings';
    }
    flowState = flowStateNoFitting;
  } else {
    if (flowStateWithFitting === 'Non-choked') {
      kv = kvWithFitting;
      usedFormula = 'Steam non-choked flow with fittings';
    } else {
      kv = kvChokedWithFitting;
      usedFormula = 'Steam choked flow with fittings';
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
      Y,
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
