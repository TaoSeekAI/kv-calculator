/**
 * 蒸汽Kv计算模块
 * 基于 IEC 60534-2-1 标准
 */
import type { FlowState } from '../types/index.js';
/**
 * 蒸汽Kv计算 - 非阻塞流，无接管
 * C = W / (N6×Y×√(x×P1×ρ1))
 *
 * @param W 质量流量 Kg/h
 * @param Y 膨胀系数
 * @param x 压差比
 * @param P1 入口绝对压力 KPa
 * @param rho1 入口密度 Kg/m³
 */
export declare function calcSteamKv(W: number, Y: number, x: number, P1: number, rho1: number): number;
/**
 * 蒸汽Kv计算 - 非阻塞流，带接管
 * C = W / (N6×FP×Y×√(x×P1×ρ1))
 */
export declare function calcSteamKvWithFitting(W: number, FP: number, Y: number, x: number, P1: number, rho1: number): number;
/**
 * 蒸汽Kv计算 - 阻塞流，无接管
 * C = W / (0.667×N6×√(Fγ×xT×P1×ρ1))
 */
export declare function calcSteamKvChoked(W: number, Fgamma: number, xT: number, P1: number, rho1: number): number;
/**
 * 蒸汽Kv计算 - 阻塞流，带接管
 * C = W / (0.667×FP×N6×√(Fγ×xTP×P1×ρ1))
 */
export declare function calcSteamKvChokedWithFitting(W: number, FP: number, Fgamma: number, xTP: number, P1: number, rho1: number): number;
/**
 * 蒸汽Kv计算 - 非紊流
 * C = W / (N18×FR) × √(T1/(ΔP×(P1+P2)×M))
 * 蒸汽分子量 M = 18.0152
 */
export declare function calcSteamKvLaminar(W: number, FR: number, T1: number, deltaP: number, P1: number, P2: number): number;
/**
 * 蒸汽Kv综合计算参数
 */
export interface SteamKvParams {
    W: number;
    P1: number;
    P2: number;
    T1: number;
    rho1: number;
    gamma: number;
    xT: number;
    d: number;
    D1: number;
    D2: number;
    ratedKv: number;
    FR?: number;
}
/**
 * 蒸汽Kv计算结果
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
 * 蒸汽Kv综合计算
 */
export declare function calculateSteamKv(params: SteamKvParams): SteamKvResult;
