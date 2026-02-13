/**
 * 噪音计算常数
 * 基于 IEC 60534-8-3 和 IEC 60534-8-4
 */
export declare const NOISE_CONSTANTS: {
    /** 参考声功率 W */
    W0: number;
    /** 参考声压 Pa */
    P0: number;
    /** 参考空气密度 kg/m³ */
    RHO_0: number;
    /** 参考声速 m/s (空气, 20℃) */
    C0: number;
    /** 碳钢密度 kg/m³ */
    STEEL_DENSITY: number;
    /** 不锈钢密度 kg/m³ */
    STAINLESS_DENSITY: number;
    /** 水声速 m/s (20℃) */
    WATER_SOUND_SPEED: number;
    /** 空气声速基准 m/s */
    AIR_SOUND_SPEED: number;
    /** 通用气体常数 J/(kmol·K) — 匹配Excel E28 */
    R: number;
    /** 参考声效系数 (气体) */
    ETA_REF_GAS: number;
    /** 参考声效系数 (液体紊流) */
    ETA_REF_LIQUID: number;
    /** 紊流声效指数 Aη (Excel中为-4.6) */
    A_ETA_TURB: number;
    A_WEIGHTING: {
        A1: number;
        A2: number;
        A3: number;
        A4: number;
    };
    /** 标准阀门 */
    RW_STANDARD: number;
    /** 笼式阀 */
    RW_CAGE: number;
    /** 多级降压 */
    RW_MULTISTAGE: number;
    /** xFz计算常数 (液体) - Excel中为1 */
    N34: number;
    /** 内部噪音级计算系数 */
    INTERNAL_NOISE_COEF: number;
    /** 透射损失系数 (气体) */
    TL_COEF_GAS: number;
    /** N14 设计常数 */
    N14: number;
    /** 管壁纵波速度 m/s */
    CP_PIPE: number;
    /** 气体峰值频率系数 */
    FP_GAS_COEF: number;
    /** 液体峰值频率系数 */
    FP_LIQUID_COEF: number;
    /** 最大声效系数 */
    ETA_MAX: number;
    /** 最小马赫数 */
    MVC_MIN: number;
    /** 最大噪音级 dBA */
    MAX_NOISE: number;
    /** 最小噪音级 dBA */
    MIN_NOISE: number;
};
/**
 * 获取管道材料密度
 */
export declare function getPipeMaterialDensity(material?: 'steel' | 'stainless'): number;
/**
 * 计算A加权校正值
 * @param fp 峰值频率 Hz
 * @returns A加权校正值 dB
 */
export declare function calculateAWeighting(fp: number): number;
