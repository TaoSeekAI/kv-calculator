/**
 * Reynolds Number Calculation Module
 */
import type { TurbulenceState } from '../types/index.js';
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
export declare function calcReynoldsNumber(Fd: number, Q: number, nu: number, C: number, FL: number, D: number): number;
/**
 * Calculate λ coefficient
 * λ = N2 / (C/d²)²
 *
 * @param C Flow coefficient Kv
 * @param d Valve nominal diameter mm
 */
export declare function calcLambda(C: number, d: number): number;
/**
 * Calculate λ2 coefficient (with fittings)
 * λ2 = 1 + ΣK×(C/d²)^(2/3)
 *
 * @param sumK Sum of fitting resistance coefficients
 * @param C Flow coefficient Kv
 * @param d Valve nominal diameter mm
 */
export declare function calcLambda2(sumK: number, C: number, d: number): number;
/**
 * Calculate Reynolds number correction factor FR1
 * FR1 = 1 + (0.33×FL^0.5 / λ^0.25) × LOG10(Rev/10000)
 *
 * @param FL Pressure recovery factor
 * @param lambda λ coefficient
 * @param Rev Reynolds number
 */
export declare function calcFR1(FL: number, lambda: number, Rev: number): number;
/**
 * Calculate Reynolds number correction factor FR2
 * FR2 = 0.026/FL × √(λ×Rev)
 *
 * @param FL Pressure recovery factor
 * @param lambda λ coefficient
 * @param Rev Reynolds number
 */
export declare function calcFR2(FL: number, lambda: number, Rev: number): number;
/**
 * Calculate Reynolds number correction factor FR
 * Turbulent (Rev ≥ 10000): FR = MIN(FR1, FR2, 1)
 * Laminar (Rev < 10000): FR = FR2
 *
 * @param Rev Reynolds number
 * @param FL Pressure recovery factor
 * @param lambda λ coefficient
 */
export declare function calcFR(Rev: number, FL: number, lambda: number): number;
/**
 * Determine turbulence state
 * Rev ≥ 10000: Turbulent
 * Rev < 10000: Laminar (laminar or transitional flow)
 */
export declare function determineTurbulenceState(Rev: number): TurbulenceState;
/**
 * Reynolds number calculation parameters
 */
export interface ReynoldsParams {
    Q: number;
    nu: number;
    C: number;
    FL: number;
    Fd: number;
    d: number;
    D: number;
    sumK?: number;
}
/**
 * Reynolds number calculation result
 */
export interface ReynoldsResult {
    Rev: number;
    FR: number;
    turbulenceState: TurbulenceState;
    lambda: number;
    lambda2?: number;
    FR1?: number;
    FR2: number;
}
/**
 * Reynolds number comprehensive calculation
 */
export declare function calculateReynolds(params: ReynoldsParams): ReynoldsResult;
