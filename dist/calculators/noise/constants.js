/**
 * 噪音计算常数
 * 基于 IEC 60534-8-3 和 IEC 60534-8-4
 */
export const NOISE_CONSTANTS = {
    // ===== 声学参考值 =====
    /** 参考声功率 W */
    W0: 1e-12,
    /** 参考声压 Pa */
    P0: 2e-5,
    /** 参考空气密度 kg/m³ */
    RHO_0: 1.293,
    /** 参考声速 m/s (空气, 20℃) */
    C0: 343,
    // ===== 材料常数 =====
    /** 碳钢密度 kg/m³ */
    STEEL_DENSITY: 7800,
    /** 不锈钢密度 kg/m³ */
    STAINLESS_DENSITY: 8000,
    // ===== 流体声速 =====
    /** 水声速 m/s (20℃) */
    WATER_SOUND_SPEED: 1480,
    /** 空气声速基准 m/s */
    AIR_SOUND_SPEED: 343,
    // ===== 气体常数 =====
    /** 通用气体常数 J/(kmol·K) — 匹配Excel E28 */
    R: 8314,
    // ===== 声效系数 =====
    /** 参考声效系数 (气体) */
    ETA_REF_GAS: 1e-4,
    /** 参考声效系数 (液体紊流) */
    ETA_REF_LIQUID: 1e-4,
    /** 紊流声效指数 Aη (Excel中为-4.6) */
    A_ETA_TURB: -4.6,
    // ===== A加权校正系数 =====
    A_WEIGHTING: {
        A1: -145.528,
        A2: 98.262,
        A3: -19.509,
        A4: 0.975
    },
    // ===== 声功率比 (液体) =====
    /** 标准阀门 */
    RW_STANDARD: 0.25,
    /** 笼式阀 */
    RW_CAGE: 0.20,
    /** 多级降压 */
    RW_MULTISTAGE: 0.15,
    // ===== 计算常数 =====
    /** xFz计算常数 (液体) - Excel中为1 */
    N34: 1,
    /** 内部噪音级计算系数 */
    INTERNAL_NOISE_COEF: 3.2e9,
    /** 透射损失系数 (气体) */
    TL_COEF_GAS: 7.6e-7,
    /** N14 设计常数 */
    N14: 0.0049,
    /** 管壁纵波速度 m/s */
    CP_PIPE: 5000,
    // ===== 频率计算 =====
    /** 气体峰值频率系数 */
    FP_GAS_COEF: 0.2,
    /** 液体峰值频率系数 */
    FP_LIQUID_COEF: 1500,
    // ===== 限制值 =====
    /** 最大声效系数 */
    ETA_MAX: 0.01,
    /** 最小马赫数 */
    MVC_MIN: 0.01,
    /** 最大噪音级 dBA */
    MAX_NOISE: 150,
    /** 最小噪音级 dBA */
    MIN_NOISE: 30,
};
/**
 * 获取管道材料密度
 */
export function getPipeMaterialDensity(material = 'steel') {
    return material === 'stainless' ? NOISE_CONSTANTS.STAINLESS_DENSITY : NOISE_CONSTANTS.STEEL_DENSITY;
}
/**
 * 计算A加权校正值
 * @param fp 峰值频率 Hz
 * @returns A加权校正值 dB
 */
export function calculateAWeighting(fp) {
    if (fp <= 0)
        return 0;
    const logF = Math.log10(fp);
    const { A1, A2, A3, A4 } = NOISE_CONSTANTS.A_WEIGHTING;
    return A1 + A2 * logF + A3 * Math.pow(logF, 2) + A4 * Math.pow(logF, 3);
}
