/**
 * Kv计算系统数值常数
 * 基于 IEC 60534-2-1 标准
 */
export declare const CONSTANTS: {
    /**
     * N1: 液体Kv计算常数
     * 用于: C = Q/N1 * sqrt(ρ/ρ0 / ΔP)
     * 单位: m³/h, KPa
     */
    N1: number;
    /**
     * N2: 管道几何系数计算常数
     * 用于: FP计算
     */
    N2: number;
    /**
     * N4: 雷诺数计算常数
     * 用于: Rev计算
     */
    N4: number;
    /**
     * N5: xTP计算常数
     */
    N5: number;
    /**
     * N6: 蒸汽Kv计算常数
     * 用于: C = W/(N6*Y*sqrt(x*P1*ρ1))
     */
    N6: number;
    /**
     * N9: 气体Kv计算常数
     * 用于: C = Qn/(N9*P1*Y) * sqrt(22.4*M*Z*T1/x)
     */
    N9: number;
    /**
     * N14: 噪音计算常数
     */
    N14: number;
    /**
     * N16: 噪音计算常数
     */
    N16: number;
    /**
     * N18: Fd计算常数
     */
    N18: number;
    ANTOINE: {
        A: number;
        B: number;
        C: number;
    };
    /** 水的标准密度 kg/m³ */
    WATER_DENSITY: number;
    /** 标准大气压 KPa */
    STD_PRESSURE: number;
    /** 绝对零度偏移 K */
    STD_TEMP: number;
    /** 水的临界压力 MPa */
    WATER_CRITICAL_PRESSURE: number;
    /** Kv转Cv系数 */
    KV_TO_CV: number;
    DEFAULT: {
        /** 默认压缩系数 */
        Z: number;
        /** 默认比热比(空气) */
        GAMMA: number;
        /** 默认可调比 */
        RANGEABILITY: number;
        /** 默认粘度 cP */
        VISCOSITY: number;
        /** 默认Fd值 */
        FD: number;
    };
    THRESHOLD: {
        /** 紊流判定阈值 */
        TURBULENT_RE: number;
        /** 误差容限 (0.1%) */
        TOLERANCE: number;
    };
};
/**
 * 管道规格表 - SCH40 标准壁厚
 * 格式: { DN: [外径mm, 壁厚mm] }
 */
export declare const PIPE_SPECS: Record<number, [number, number]>;
/**
 * 根据DN获取管道规格
 */
export declare function getPipeSpec(dn: number): {
    outerDiameter: number;
    wallThickness: number;
} | null;
