/**
 * 雷诺数计算模块
 */
import type { TurbulenceState } from '../types/index.js';
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
export declare function calcReynoldsNumber(Fd: number, Q: number, nu: number, C: number, FL: number, D: number): number;
/**
 * 计算λ系数
 * λ = N2 / (C/d²)²
 *
 * @param C 流量系数 Kv
 * @param d 阀门公称通径 mm
 */
export declare function calcLambda(C: number, d: number): number;
/**
 * 计算λ2系数 (带管件)
 * λ2 = 1 + ΣK×(C/d²)^(2/3)
 *
 * @param sumK 管件阻力系数之和
 * @param C 流量系数 Kv
 * @param d 阀门公称通径 mm
 */
export declare function calcLambda2(sumK: number, C: number, d: number): number;
/**
 * 计算雷诺数修正系数 FR1
 * FR1 = 1 + (0.33×FL^0.5 / λ^0.25) × LOG10(Rev/10000)
 *
 * @param FL 压力恢复系数
 * @param lambda λ系数
 * @param Rev 雷诺数
 */
export declare function calcFR1(FL: number, lambda: number, Rev: number): number;
/**
 * 计算雷诺数修正系数 FR2
 * FR2 = 0.026/FL × √(λ×Rev)
 *
 * @param FL 压力恢复系数
 * @param lambda λ系数
 * @param Rev 雷诺数
 */
export declare function calcFR2(FL: number, lambda: number, Rev: number): number;
/**
 * 计算雷诺数修正系数 FR
 * 紊流 (Rev ≥ 10000): FR = MIN(FR1, FR2, 1)
 * 非紊流 (Rev < 10000): FR = FR2
 *
 * @param Rev 雷诺数
 * @param FL 压力恢复系数
 * @param lambda λ系数
 */
export declare function calcFR(Rev: number, FL: number, lambda: number): number;
/**
 * 判断紊流状态
 * Rev ≥ 10000: 紊流
 * Rev < 10000: 非紊流 (层流或过渡流)
 */
export declare function determineTurbulenceState(Rev: number): TurbulenceState;
/**
 * 雷诺数计算参数
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
 * 雷诺数计算结果
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
 * 雷诺数综合计算
 */
export declare function calculateReynolds(params: ReynoldsParams): ReynoldsResult;
