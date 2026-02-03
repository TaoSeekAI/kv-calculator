/**
 * Gas Kv Calculation Module
 * Based on IEC 60534-2-1 Standard
 */
import { CONSTANTS } from '../constants/index.js';
import { calcFP, calcSumK } from './liquid.js';
/**
 * Calculate specific heat ratio factor Fγ
 * Fγ = γ / 1.4
 *
 * @param gamma Specific heat ratio
 */
export function calcFgamma(gamma) {
    return gamma / 1.4;
}
/**
 * Calculate pressure differential ratio x
 * x = ΔP / P1
 *
 * @param deltaP Pressure differential KPa
 * @param P1 Inlet absolute pressure KPa
 */
export function calcX(deltaP, P1) {
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
export function calcXTP(xT, FP, K1_KB1, C, d) {
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
export function calcY(x, Fgamma, xT) {
    const Y = 1 - x / (3 * Fgamma * xT);
    return Math.max(Y, 0.667);
}
/**
 * Determine gas flow state
 * Non-choked: x < Fγ × xT
 * Choked: x ≥ Fγ × xT
 */
export function determineGasFlowState(x, Fgamma, xT) {
    return x < Fgamma * xT ? 'Non-choked' : 'Choked';
}
/**
 * Determine gas flow state (with fittings)
 * Non-choked: x < Fγ × xTP
 * Choked: x ≥ Fγ × xTP
 */
export function determineGasFlowStateWithFitting(x, Fgamma, xTP) {
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
export function calcGasKv(Qn, P1, Y, M, Z, T1, x) {
    return Qn / (CONSTANTS.N9 * P1 * Y) * Math.sqrt(M * Z * T1 / x);
}
/**
 * Gas Kv calculation - Non-choked flow, with fittings
 * C = Qn / (N9×FP×P1×Y) × √(M×Z×T1/x)
 */
export function calcGasKvWithFitting(Qn, P1, Y, FP, M, Z, T1, x) {
    return Qn / (CONSTANTS.N9 * FP * P1 * Y) * Math.sqrt(M * Z * T1 / x);
}
/**
 * Gas Kv calculation - Choked flow, without fittings
 * C = Qn / (0.667×N9×P1) × √(M×Z×T1/(xT×Fγ))
 */
export function calcGasKvChoked(Qn, P1, M, Z, T1, xT, Fgamma) {
    return Qn / (0.667 * CONSTANTS.N9 * P1) * Math.sqrt(M * Z * T1 / (xT * Fgamma));
}
/**
 * Gas Kv calculation - Choked flow, with fittings
 * C = Qn / (0.667×N9×FP×P1) × √(M×Z×T1/(xTP×Fγ))
 */
export function calcGasKvChokedWithFitting(Qn, P1, FP, M, Z, T1, xTP, Fgamma) {
    return Qn / (0.667 * CONSTANTS.N9 * FP * P1) * Math.sqrt(M * Z * T1 / (xTP * Fgamma));
}
/**
 * Gas Kv calculation - Laminar flow
 * C = Qn / (N18×FR) × √(M×T1/(ΔP×(P1+P2)))
 */
export function calcGasKvLaminar(Qn, FR, M, T1, deltaP, P1, P2) {
    return Qn / (CONSTANTS.N18 * FR) * Math.sqrt(M * T1 / (deltaP * (P1 + P2)));
}
/**
 * Gas Kv comprehensive calculation
 */
export function calculateGasKv(params) {
    const { Qn, P1, P2, T1, M, Z, gamma, xT, d, D1, D2, ratedKv, FR = 1 } = params;
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
    const kvNoFitting = calcGasKv(Qn, P1, Y, M, Z, T1, x);
    const kvWithFitting = calcGasKvWithFitting(Qn, P1, Y, FP, M, Z, T1, x);
    const kvChokedNoFitting = calcGasKvChoked(Qn, P1, M, Z, T1, xT, Fgamma);
    const kvChokedWithFitting = calcGasKvChokedWithFitting(Qn, P1, FP, M, Z, T1, xTP, Fgamma);
    const kvLaminar = FR < 1 ? calcGasKvLaminar(Qn, FR, M, T1, deltaP, P1, P2) : undefined;
    // Select final Kv value
    let kv;
    let usedFormula;
    let flowState;
    if (FR < 1 && kvLaminar) {
        kv = kvLaminar;
        usedFormula = 'Gas laminar flow';
        flowState = flowStateNoFitting;
    }
    else if (!hasFittings) {
        if (flowStateNoFitting === 'Non-choked') {
            kv = kvNoFitting;
            usedFormula = 'Gas non-choked flow without fittings';
        }
        else {
            kv = kvChokedNoFitting;
            usedFormula = 'Gas choked flow without fittings';
        }
        flowState = flowStateNoFitting;
    }
    else {
        if (flowStateWithFitting === 'Non-choked') {
            kv = kvWithFitting;
            usedFormula = 'Gas non-choked flow with fittings';
        }
        else {
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
