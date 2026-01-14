/**
 * 液体Kv计算模块
 * 基于 IEC 60534-2-1 标准
 */
import { CONSTANTS } from '../constants/index.js';
/**
 * 计算临界压力比系数 FF
 * FF = 0.96 - 0.28 × √(Pv / Pc)
 *
 * @param Pv 饱和蒸汽压 KPa
 * @param Pc 临界压力 MPa
 */
export function calcFF(Pv, Pc) {
    return 0.96 - 0.28 * Math.sqrt(Pv / (Pc * 1000));
}
/**
 * 计算管件阻力系数 K1 (入口突然收缩)
 * K1 = 0.5 × (1 - (d/D1)²)²
 *
 * @param d 阀门公称通径 mm
 * @param D1 上游管道内径 mm
 */
export function calcK1(d, D1) {
    return 0.5 * Math.pow(1 - Math.pow(d / D1, 2), 2);
}
/**
 * 计算管件阻力系数 K2 (出口突然扩大)
 * K2 = 1.0 × (1 - (d/D2)²)²
 *
 * @param d 阀门公称通径 mm
 * @param D2 下游管道内径 mm
 */
export function calcK2(d, D2) {
    return 1.0 * Math.pow(1 - Math.pow(d / D2, 2), 2);
}
/**
 * 计算伯努利系数 KB1
 * KB1 = 1 - (d/D1)⁴
 */
export function calcKB1(d, D1) {
    return 1 - Math.pow(d / D1, 4);
}
/**
 * 计算伯努利系数 KB2
 * KB2 = 1 - (d/D2)⁴
 */
export function calcKB2(d, D2) {
    return 1 - Math.pow(d / D2, 4);
}
/**
 * 计算管件阻力系数之和 ΣK
 * ΣK = K1 + K2 + KB1 - KB2
 * 当阀门口径等于管道内径时，ΣK = 0
 */
export function calcSumK(d, D1, D2) {
    // 当阀门口径等于管道内径时，没有管件阻力
    if (Math.abs(d - D1) < 0.1 && Math.abs(d - D2) < 0.1) {
        return 0;
    }
    const K1 = calcK1(d, D1);
    const K2 = calcK2(d, D2);
    const KB1 = calcKB1(d, D1);
    const KB2 = calcKB2(d, D2);
    return K1 + K2 + KB1 - KB2;
}
/**
 * 计算管道几何形状系数 FP
 * FP = 1 / √(1 + ΣK/N2 × (Ci/d²)²)
 *
 * @param sumK 管件阻力系数之和
 * @param Ci 假定流量系数
 * @param d 阀门公称通径 mm
 */
export function calcFP(sumK, Ci, d) {
    const term = sumK / CONSTANTS.N2 * Math.pow(Ci / (d * d), 2);
    return 1 / Math.sqrt(1 + term);
}
/**
 * 计算复合系数 FLP
 * FLP = FL / √(1 + FL²/N2 × ΣK × (Ci/d²)²)
 *
 * @param FL 压力恢复系数
 * @param sumK 管件阻力系数之和
 * @param Ci 假定流量系数
 * @param d 阀门公称通径 mm
 */
export function calcFLP(FL, sumK, Ci, d) {
    const term = FL * FL / CONSTANTS.N2 * sumK * Math.pow(Ci / (d * d), 2);
    return FL / Math.sqrt(1 + term);
}
/**
 * 判断流动状态（无附接管件）
 * 非阻塞流: ΔP < FL² × (P1 - FF×Pv)
 * 阻塞流: ΔP ≥ FL² × (P1 - FF×Pv)
 */
export function determineFlowStateNoFitting(deltaP, FL, P1, FF, Pv) {
    const criticalDeltaP = FL * FL * (P1 - FF * Pv);
    return deltaP < criticalDeltaP ? '非阻塞流' : '阻塞流';
}
/**
 * 判断流动状态（带附接管件）
 * 非阻塞流: ΔP < (FLP/FP)² × (P1 - FF×Pv)
 * 阻塞流: ΔP ≥ (FLP/FP)² × (P1 - FF×Pv)
 */
export function determineFlowStateWithFitting(deltaP, FLP, FP, P1, FF, Pv) {
    const ratio = FLP / FP;
    const criticalDeltaP = ratio * ratio * (P1 - FF * Pv);
    return deltaP < criticalDeltaP ? '非阻塞流' : '阻塞流';
}
/**
 * 判断液体状态（气蚀/空化/闪蒸）
 * xF = (P1 - P2) / (P1 - Pv)
 *
 * @param xF 压差比
 * @param xFz 初生空化压差比
 * @param FL2 FL²
 */
export function determineFluidState(xF, xFz, FL2) {
    if (xF <= xFz) {
        return '无气蚀';
    }
    else if (xF > xFz && xF <= FL2) {
        return '初始气蚀';
    }
    else if (xF > FL2 && xF <= 1) {
        return '空化';
    }
    else {
        return '闪蒸';
    }
}
/**
 * 计算压差比 xF
 * xF = (P1 - P2) / (P1 - Pv)
 */
export function calcXF(P1, P2, Pv) {
    return (P1 - P2) / (P1 - Pv);
}
/**
 * 计算初生空化压差比 xFz (标准型阀门)
 * xFz = 0.9 / √(1 + 3×Fd×√(C/(N34×FL)))
 *
 * @param Fd 控制阀类型修正系数
 * @param C 流量系数
 * @param FL 压力恢复系数
 */
export function calcXFz(Fd, C, FL) {
    const N34 = 1; // 简化常数
    return 0.9 / Math.sqrt(1 + 3 * Fd * Math.sqrt(C / (N34 * FL)));
}
/**
 * C1: 非阻塞流，无接管
 * C1 = Q / N1 × √(ρ/ρ0 / ΔP)
 *
 * @param Q 体积流量 m³/h
 * @param relativeDensity 相对密度
 * @param deltaP 压差 KPa
 */
export function calcC1(Q, relativeDensity, deltaP) {
    return Q / CONSTANTS.N1 * Math.sqrt(relativeDensity / deltaP);
}
/**
 * C2: 非阻塞流，带接管
 * C2 = Q / (N1 × FP) × √(ρ/ρ0 / ΔP)
 *
 * @param Q 体积流量 m³/h
 * @param FP 管道几何形状系数
 * @param relativeDensity 相对密度
 * @param deltaP 压差 KPa
 */
export function calcC2(Q, FP, relativeDensity, deltaP) {
    return Q / (CONSTANTS.N1 * FP) * Math.sqrt(relativeDensity / deltaP);
}
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
export function calcC3(Q, FL, relativeDensity, P1, FF, Pv) {
    return Q / (CONSTANTS.N1 * FL) * Math.sqrt(relativeDensity / (P1 - FF * Pv));
}
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
export function calcC4(Q, FLP, relativeDensity, P1, FF, Pv) {
    return Q / (CONSTANTS.N1 * FLP) * Math.sqrt(relativeDensity / (P1 - FF * Pv));
}
/**
 * C5: 非紊流（层流或过渡流）
 * C5 = Q / (N1 × FR) × √(ρ/ρ0 / ΔP)
 *
 * @param Q 体积流量 m³/h
 * @param FR 雷诺数修正系数
 * @param relativeDensity 相对密度
 * @param deltaP 压差 KPa
 */
export function calcC5(Q, FR, relativeDensity, deltaP) {
    return Q / (CONSTANTS.N1 * FR) * Math.sqrt(relativeDensity / deltaP);
}
/**
 * 液体Kv综合计算
 */
export function calculateLiquidKv(params) {
    const { Q, P1, P2, density, Pv, Pc, FL, d, D1, D2, Fd, ratedKv, FR = 1 } = params;
    // 基础计算
    const deltaP = P1 - P2;
    const relativeDensity = density / CONSTANTS.WATER_DENSITY;
    const FF = calcFF(Pv, Pc);
    // 管件系数计算
    const sumK = calcSumK(d, D1, D2);
    const Ci = ratedKv * 1.3; // 假定流量系数
    const FP = calcFP(sumK, Ci, d);
    const FLP = calcFLP(FL, sumK, Ci, d);
    // 流动状态判定
    const flowStateNoFitting = determineFlowStateNoFitting(deltaP, FL, P1, FF, Pv);
    const flowStateWithFitting = determineFlowStateWithFitting(deltaP, FLP, FP, P1, FF, Pv);
    // 判断是否有管件影响
    const hasFittings = d !== D1 || d !== D2;
    // 计算各公式Kv
    const C1 = calcC1(Q, relativeDensity, deltaP);
    const C2 = calcC2(Q, FP, relativeDensity, deltaP);
    const C3 = calcC3(Q, FL, relativeDensity, P1, FF, Pv);
    const C4 = calcC4(Q, FLP, relativeDensity, P1, FF, Pv);
    const C5 = FR < 1 ? calcC5(Q, FR, relativeDensity, deltaP) : undefined;
    // 液体状态判定
    const xF = calcXF(P1, P2, Pv);
    const xFz = calcXFz(Fd, C1, FL);
    const FL2 = FL * FL;
    const fluidState = determineFluidState(xF, xFz, FL2);
    // 选择最终Kv值和公式
    let kv;
    let usedFormula;
    let flowState;
    // FR < 1 表示非紊流
    if (FR < 1 && C5) {
        kv = C5;
        usedFormula = 'C5';
        flowState = flowStateNoFitting;
    }
    else if (!hasFittings) {
        // 无管件
        if (flowStateNoFitting === '非阻塞流') {
            kv = C1;
            usedFormula = 'C1';
        }
        else {
            kv = C3;
            usedFormula = 'C3';
        }
        flowState = flowStateNoFitting;
    }
    else {
        // 有管件
        if (flowStateWithFitting === '非阻塞流') {
            kv = C2;
            usedFormula = 'C2';
        }
        else {
            kv = C4;
            usedFormula = 'C4';
        }
        flowState = flowStateWithFitting;
    }
    return {
        kv,
        flowState,
        fluidState,
        hasFittings,
        usedFormula,
        intermediate: {
            deltaP,
            relativeDensity,
            FF,
            xF,
            xFz,
            sumK,
            FP,
            FLP,
            C1,
            C2,
            C3,
            C4,
            C5
        }
    };
}
