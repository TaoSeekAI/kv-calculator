/**
 * 雷诺数计算模块
 */
import { CONSTANTS } from '../constants/index.js';
/**
 * 计算阀门雷诺数 Rev
 * Rev = N4×Fd×Q / (ν×√(C×FL)) × (FL²×C²/(N2×D⁴) + 1)^0.25
 *
 * @param N4 常数
 * @param Fd 控制阀类型修正系数
 * @param Q 体积流量 m³/h
 * @param nu 运动粘度 m²/s
 * @param C 流量系数 Kv
 * @param FL 压力恢复系数
 * @param N2 常数
 * @param D 上游管道内径 mm
 */
export function calcReynoldsNumber(Fd, Q, nu, C, FL, D) {
    const term = Math.pow(FL * FL * C * C / (CONSTANTS.N2 * Math.pow(D, 4)) + 1, 0.25);
    return CONSTANTS.N4 * Fd * Q / (nu * Math.sqrt(C * FL)) * term;
}
/**
 * 计算λ系数
 * λ = N2 / (C/d²)²
 *
 * @param C 流量系数 Kv
 * @param d 阀门公称通径 mm
 */
export function calcLambda(C, d) {
    return CONSTANTS.N2 / Math.pow(C / (d * d), 2);
}
/**
 * 计算λ2系数 (带管件)
 * λ2 = 1 + ΣK×(C/d²)^(2/3)
 *
 * @param sumK 管件阻力系数之和
 * @param C 流量系数 Kv
 * @param d 阀门公称通径 mm
 */
export function calcLambda2(sumK, C, d) {
    return 1 + sumK * Math.pow(C / (d * d), 2 / 3);
}
/**
 * 计算雷诺数修正系数 FR1
 * FR1 = 1 + (0.33×FL^0.5 / λ^0.25) × LOG10(Rev/10000)
 *
 * @param FL 压力恢复系数
 * @param lambda λ系数
 * @param Rev 雷诺数
 */
export function calcFR1(FL, lambda, Rev) {
    return 1 + (0.33 * Math.pow(FL, 0.5) / Math.pow(lambda, 0.25)) * Math.log10(Rev / 10000);
}
/**
 * 计算雷诺数修正系数 FR2
 * FR2 = 0.026/FL × √(λ×Rev)
 *
 * @param FL 压力恢复系数
 * @param lambda λ系数
 * @param Rev 雷诺数
 */
export function calcFR2(FL, lambda, Rev) {
    return 0.026 / FL * Math.sqrt(lambda * Rev);
}
/**
 * 计算雷诺数修正系数 FR
 * 紊流 (Rev ≥ 10000): FR = MIN(FR1, FR2, 1)
 * 非紊流 (Rev < 10000): FR = FR2
 *
 * @param Rev 雷诺数
 * @param FL 压力恢复系数
 * @param lambda λ系数
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
 * 判断紊流状态
 * Rev ≥ 10000: 紊流
 * Rev < 10000: 非紊流 (层流或过渡流)
 */
export function determineTurbulenceState(Rev) {
    return Rev >= CONSTANTS.THRESHOLD.TURBULENT_RE ? '紊流' : '非紊流';
}
/**
 * 雷诺数综合计算
 */
export function calculateReynolds(params) {
    const { Q, nu, C, FL, Fd, d, D, sumK } = params;
    // 计算雷诺数
    const Rev = calcReynoldsNumber(Fd, Q, nu, C, FL, D);
    // 计算λ系数
    const lambda = calcLambda(C, d);
    const lambda2 = sumK !== undefined ? calcLambda2(sumK, C, d) : undefined;
    // 使用适当的λ计算FR
    const effectiveLambda = sumK !== undefined && sumK > 0 ? lambda2 : lambda;
    // 计算FR2 (始终需要)
    const FR2 = calcFR2(FL, effectiveLambda, Rev);
    // 判断紊流状态
    const turbulenceState = determineTurbulenceState(Rev);
    // 计算FR
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
