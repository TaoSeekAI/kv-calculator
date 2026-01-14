/**
 * 气体Kv计算模块
 * 基于 IEC 60534-2-1 标准
 */
import type { FlowState } from '../types/index.js';
/**
 * 计算比热比系数 Fγ
 * Fγ = γ / 1.4
 *
 * @param gamma 比热比
 */
export declare function calcFgamma(gamma: number): number;
/**
 * 计算压差比 x
 * x = ΔP / P1
 *
 * @param deltaP 压差 KPa
 * @param P1 入口绝对压力 KPa
 */
export declare function calcX(deltaP: number, P1: number): number;
/**
 * 计算临界压差比 xT (带管件修正) xTP
 * xTP = xT / FP² / (1 + xT×(K1+KB1)/N5 × (C/d²)²)
 *
 * @param xT 压差比系数
 * @param FP 管道几何形状系数
 * @param K1_KB1 K1 + KB1
 * @param C 流量系数
 * @param d 阀门公称通径 mm
 */
export declare function calcXTP(xT: number, FP: number, K1_KB1: number, C: number, d: number): number;
/**
 * 计算膨胀系数 Y
 * Y = 1 - x/(3×Fγ×xT)
 * 注：Y 最小值为 0.667
 *
 * @param x 压差比
 * @param Fgamma 比热比系数
 * @param xT 压差比系数
 */
export declare function calcY(x: number, Fgamma: number, xT: number): number;
/**
 * 判断气体流动状态
 * 非阻塞流: x < Fγ × xT
 * 阻塞流: x ≥ Fγ × xT
 */
export declare function determineGasFlowState(x: number, Fgamma: number, xT: number): FlowState;
/**
 * 判断气体流动状态（带管件）
 * 非阻塞流: x < Fγ × xTP
 * 阻塞流: x ≥ Fγ × xTP
 */
export declare function determineGasFlowStateWithFitting(x: number, Fgamma: number, xTP: number): FlowState;
/**
 * 气体Kv计算 - 非阻塞流，无接管
 * C = Qn / (N9×P1×Y) × √(22.4×M×Z×T1/x)
 *
 * @param Qn 标准体积流量 Nm³/h
 * @param P1 入口绝对压力 KPa
 * @param Y 膨胀系数
 * @param M 分子量 Kg/Kmol
 * @param Z 压缩系数
 * @param T1 入口绝对温度 K
 * @param x 压差比
 */
export declare function calcGasKv(Qn: number, P1: number, Y: number, M: number, Z: number, T1: number, x: number): number;
/**
 * 气体Kv计算 - 非阻塞流，带接管
 * C = Qn / (N9×FP×P1×Y) × √(22.4×M×Z×T1/x)
 */
export declare function calcGasKvWithFitting(Qn: number, P1: number, Y: number, FP: number, M: number, Z: number, T1: number, x: number): number;
/**
 * 气体Kv计算 - 阻塞流，无接管
 * C = Qn / (0.667×N9×P1) × √(22.4×M×Z×T1/(xT×Fγ))
 */
export declare function calcGasKvChoked(Qn: number, P1: number, M: number, Z: number, T1: number, xT: number, Fgamma: number): number;
/**
 * 气体Kv计算 - 阻塞流，带接管
 * C = Qn / (0.667×N9×FP×P1) × √(22.4×M×Z×T1/(xTP×Fγ))
 */
export declare function calcGasKvChokedWithFitting(Qn: number, P1: number, FP: number, M: number, Z: number, T1: number, xTP: number, Fgamma: number): number;
/**
 * 气体Kv计算 - 非紊流
 * C = Qn / (N18×FR) × √(22.4×M×T1/(ΔP×(P1+P2)))
 */
export declare function calcGasKvLaminar(Qn: number, FR: number, M: number, T1: number, deltaP: number, P1: number, P2: number): number;
/**
 * 气体Kv综合计算参数
 */
export interface GasKvParams {
    Qn: number;
    P1: number;
    P2: number;
    T1: number;
    M: number;
    Z: number;
    gamma: number;
    xT: number;
    d: number;
    D1: number;
    D2: number;
    ratedKv: number;
    FR?: number;
}
/**
 * 气体Kv计算结果
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
 * 气体Kv综合计算
 */
export declare function calculateGasKv(params: GasKvParams): GasKvResult;
