/**
 * Reynolds Number Calculation Module
 */
import { CONSTANTS } from '../constants/index.js';
/**
 * Calculate valve Reynolds number Rev
 * Rev = N4×Fd×Q / (ν×√(C×FL)) × (FL²×C²/(N2×D⁴) + 1)^0.25
 *
 * @param N4 Constant
 * @param Fd Valve style modifier
 * @param Q Volume flow rate m³/h
 * @param nu Kinematic viscosity m²/s
 * @param C Flow coefficient Kv
 * @param FL Pressure recovery factor
 * @param N2 Constant
 * @param D Upstream pipe inner diameter mm
 */
export function calcReynoldsNumber(Fd, Q, nu, C, FL, D) {
    const term = Math.pow(FL * FL * C * C / (CONSTANTS.N2 * Math.pow(D, 4)) + 1, 0.25);
    return CONSTANTS.N4 * Fd * Q / (nu * Math.sqrt(C * FL)) * term;
}
/**
 * Calculate λ coefficient
 * λ = N2 / (C/d²)²
 *
 * @param C Flow coefficient Kv
 * @param d Valve nominal diameter mm
 */
export function calcLambda(C, d) {
    return CONSTANTS.N2 / Math.pow(C / (d * d), 2);
}
/**
 * Calculate λ2 coefficient (with fittings)
 * λ2 = 1 + ΣK×(C/d²)^(2/3)
 *
 * @param sumK Sum of fitting resistance coefficients
 * @param C Flow coefficient Kv
 * @param d Valve nominal diameter mm
 */
export function calcLambda2(sumK, C, d) {
    return 1 + sumK * Math.pow(C / (d * d), 2 / 3);
}
/**
 * Calculate Reynolds number correction factor FR1
 * FR1 = 1 + (0.33×FL^0.5 / λ^0.25) × LOG10(Rev/10000)
 *
 * @param FL Pressure recovery factor
 * @param lambda λ coefficient
 * @param Rev Reynolds number
 */
export function calcFR1(FL, lambda, Rev) {
    return 1 + (0.33 * Math.pow(FL, 0.5) / Math.pow(lambda, 0.25)) * Math.log10(Rev / 10000);
}
/**
 * Calculate Reynolds number correction factor FR2
 * FR2 = 0.026/FL × √(λ×Rev)
 *
 * @param FL Pressure recovery factor
 * @param lambda λ coefficient
 * @param Rev Reynolds number
 */
export function calcFR2(FL, lambda, Rev) {
    return 0.026 / FL * Math.sqrt(lambda * Rev);
}
/**
 * Calculate Reynolds number correction factor FR
 * Turbulent (Rev ≥ 10000): FR = MIN(FR1, FR2, 1)
 * Laminar (Rev < 10000): FR = FR2
 *
 * @param Rev Reynolds number
 * @param FL Pressure recovery factor
 * @param lambda λ coefficient
 */
export function calcFR(Rev, FL, lambda) {
    if (Rev >= CONSTANTS.THRESHOLD.TURBULENT_RE) {
        const FR1 = calcFR1(FL, lambda, Rev);
        const FR2 = calcFR2(FL, lambda, Rev);
        return Math.min(FR1, FR2, 1);
    }
    else {
        return calcFR2(FL, lambda, Rev);
    }
}
/**
 * Determine turbulence state
 * Rev ≥ 10000: Turbulent
 * Rev < 10000: Laminar (laminar or transitional flow)
 */
export function determineTurbulenceState(Rev) {
    return Rev >= CONSTANTS.THRESHOLD.TURBULENT_RE ? 'Turbulent' : 'Laminar';
}
/**
 * Reynolds number comprehensive calculation
 */
export function calculateReynolds(params) {
    const { Q, nu, C, FL, Fd, d, D, sumK } = params;
    // Calculate Reynolds number
    const Rev = calcReynoldsNumber(Fd, Q, nu, C, FL, D);
    // Calculate λ coefficient
    const lambda = calcLambda(C, d);
    const lambda2 = sumK !== undefined ? calcLambda2(sumK, C, d) : undefined;
    // Use appropriate λ for FR calculation
    const effectiveLambda = sumK !== undefined && sumK > 0 ? lambda2 : lambda;
    // Calculate FR2 (always needed)
    const FR2 = calcFR2(FL, effectiveLambda, Rev);
    // Determine turbulence state
    const turbulenceState = determineTurbulenceState(Rev);
    // Calculate FR
    let FR;
    let FR1;
    if (Rev >= CONSTANTS.THRESHOLD.TURBULENT_RE) {
        FR1 = calcFR1(FL, effectiveLambda, Rev);
        FR = Math.min(FR1, FR2, 1);
    }
    else {
        FR = FR2;
    }
    return {
        Rev,
        FR,
        turbulenceState,
        lambda,
        lambda2,
        FR1,
        FR2
    };
}
