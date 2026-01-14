/**
 * 液体Kv计算模块
 * 基于 IEC 60534-2-1 标准
 */
import type { FlowState, FluidState } from '../types/index.js';
/**
 * 计算临界压力比系数 FF
 * FF = 0.96 - 0.28 × √(Pv / Pc)
 *
 * @param Pv 饱和蒸汽压 KPa
 * @param Pc 临界压力 MPa
 */
export declare function calcFF(Pv: number, Pc: number): number;
/**
 * 计算管件阻力系数 K1 (入口突然收缩)
 * K1 = 0.5 × (1 - (d/D1)²)²
 *
 * @param d 阀门公称通径 mm
 * @param D1 上游管道内径 mm
 */
export declare function calcK1(d: number, D1: number): number;
/**
 * 计算管件阻力系数 K2 (出口突然扩大)
 * K2 = 1.0 × (1 - (d/D2)²)²
 *
 * @param d 阀门公称通径 mm
 * @param D2 下游管道内径 mm
 */
export declare function calcK2(d: number, D2: number): number;
/**
 * 计算伯努利系数 KB1
 * KB1 = 1 - (d/D1)⁴
 */
export declare function calcKB1(d: number, D1: number): number;
/**
 * 计算伯努利系数 KB2
 * KB2 = 1 - (d/D2)⁴
 */
export declare function calcKB2(d: number, D2: number): number;
/**
 * 计算管件阻力系数之和 ΣK
 * ΣK = K1 + K2 + KB1 - KB2
 * 当阀门口径等于管道内径时，ΣK = 0
 */
export declare function calcSumK(d: number, D1: number, D2: number): number;
/**
 * 计算管道几何形状系数 FP
 * FP = 1 / √(1 + ΣK/N2 × (Ci/d²)²)
 *
 * @param sumK 管件阻力系数之和
 * @param Ci 假定流量系数
 * @param d 阀门公称通径 mm
 */
export declare function calcFP(sumK: number, Ci: number, d: number): number;
/**
 * 计算复合系数 FLP
 * FLP = FL / √(1 + FL²/N2 × ΣK × (Ci/d²)²)
 *
 * @param FL 压力恢复系数
 * @param sumK 管件阻力系数之和
 * @param Ci 假定流量系数
 * @param d 阀门公称通径 mm
 */
export declare function calcFLP(FL: number, sumK: number, Ci: number, d: number): number;
/**
 * 判断流动状态（无附接管件）
 * 非阻塞流: ΔP < FL² × (P1 - FF×Pv)
 * 阻塞流: ΔP ≥ FL² × (P1 - FF×Pv)
 */
export declare function determineFlowStateNoFitting(deltaP: number, FL: number, P1: number, FF: number, Pv: number): FlowState;
/**
 * 判断流动状态（带附接管件）
 * 非阻塞流: ΔP < (FLP/FP)² × (P1 - FF×Pv)
 * 阻塞流: ΔP ≥ (FLP/FP)² × (P1 - FF×Pv)
 */
export declare function determineFlowStateWithFitting(deltaP: number, FLP: number, FP: number, P1: number, FF: number, Pv: number): FlowState;
/**
 * 判断液体状态（气蚀/空化/闪蒸）
 * xF = (P1 - P2) / (P1 - Pv)
 *
 * @param xF 压差比
 * @param xFz 初生空化压差比
 * @param FL2 FL²
 */
export declare function determineFluidState(xF: number, xFz: number, FL2: number): FluidState;
/**
 * 计算压差比 xF
 * xF = (P1 - P2) / (P1 - Pv)
 */
export declare function calcXF(P1: number, P2: number, Pv: number): number;
/**
 * 计算初生空化压差比 xFz (标准型阀门)
 * xFz = 0.9 / √(1 + 3×Fd×√(C/(N34×FL)))
 *
 * @param Fd 控制阀类型修正系数
 * @param C 流量系数
 * @param FL 压力恢复系数
 */
export declare function calcXFz(Fd: number, C: number, FL: number): number;
/**
 * C1: 非阻塞流，无接管
 * C1 = Q / N1 × √(ρ/ρ0 / ΔP)
 *
 * @param Q 体积流量 m³/h
 * @param relativeDensity 相对密度
 * @param deltaP 压差 KPa
 */
export declare function calcC1(Q: number, relativeDensity: number, deltaP: number): number;
/**
 * C2: 非阻塞流，带接管
 * C2 = Q / (N1 × FP) × √(ρ/ρ0 / ΔP)
 *
 * @param Q 体积流量 m³/h
 * @param FP 管道几何形状系数
 * @param relativeDensity 相对密度
 * @param deltaP 压差 KPa
 */
export declare function calcC2(Q: number, FP: number, relativeDensity: number, deltaP: number): number;
/**
 * C3: 阻塞流，无接管
 * C3 = Q / (N1 × FL) × √(ρ/ρ0 / (P1 - FF×Pv))
 *
 * @param Q 体积流量 m³/h
 * @param FL 压力恢复系数
 * @param relativeDensity 相对密度
 * @param P1 入口绝对压力 KPa
 * @param FF 临界压力比系数
 * @param Pv 饱和蒸汽压 KPa
 */
export declare function calcC3(Q: number, FL: number, relativeDensity: number, P1: number, FF: number, Pv: number): number;
/**
 * C4: 阻塞流，带接管
 * C4 = Q / (N1 × FLP) × √(ρ/ρ0 / (P1 - FF×Pv))
 *
 * @param Q 体积流量 m³/h
 * @param FLP 复合系数
 * @param relativeDensity 相对密度
 * @param P1 入口绝对压力 KPa
 * @param FF 临界压力比系数
 * @param Pv 饱和蒸汽压 KPa
 */
export declare function calcC4(Q: number, FLP: number, relativeDensity: number, P1: number, FF: number, Pv: number): number;
/**
 * C5: 非紊流（层流或过渡流）
 * C5 = Q / (N1 × FR) × √(ρ/ρ0 / ΔP)
 *
 * @param Q 体积流量 m³/h
 * @param FR 雷诺数修正系数
 * @param relativeDensity 相对密度
 * @param deltaP 压差 KPa
 */
export declare function calcC5(Q: number, FR: number, relativeDensity: number, deltaP: number): number;
/**
 * 液体Kv综合计算参数
 */
export interface LiquidKvParams {
    Q: number;
    P1: number;
    P2: number;
    density: number;
    Pv: number;
    Pc: number;
    FL: number;
    d: number;
    D1: number;
    D2: number;
    Fd: number;
    ratedKv: number;
    FR?: number;
}
/**
 * 液体Kv计算结果
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
 * 液体Kv综合计算
 */
export declare function calculateLiquidKv(params: LiquidKvParams): LiquidKvResult;
