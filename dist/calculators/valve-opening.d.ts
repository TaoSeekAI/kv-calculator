/**
 * 阀门开度计算模块
 */
import type { FlowCharacteristic } from '../types/index.js';
/**
 * 计算等百分比开度
 * 开度% = (1 - LOG10(m) / LOG10(R)) × 100
 *
 * @param m 比值 = 额定Kv / 计算Kv
 * @param R 固有可调比
 */
export declare function calcEqualPercentageOpening(m: number, R: number): number;
/**
 * 计算线性开度
 * 开度% = (R - m) / ((R - 1) × m) × 100
 *
 * @param m 比值 = 额定Kv / 计算Kv
 * @param R 固有可调比
 */
export declare function calcLinearOpening(m: number, R: number): number;
/**
 * 计算快开开度
 * 开度% = (1 - √(R×(m-1) / ((R-1)×m))) × 100
 *
 * @param m 比值 = 额定Kv / 计算Kv
 * @param R 固有可调比
 */
export declare function calcQuickOpeningOpening(m: number, R: number): number;
/**
 * 计算阀门开度
 *
 * @param calculatedKv 计算Kv
 * @param ratedKv 额定Kv
 * @param rangeability 固有可调比 R
 * @param flowChar 流量特性
 */
export declare function calcValveOpening(calculatedKv: number, ratedKv: number, rangeability: number, flowChar: FlowCharacteristic): number;
/**
 * 验证开度是否在合理范围
 * 通常开度应在 10% - 90% 之间
 */
export declare function validateOpening(opening: number): {
    valid: boolean;
    warning?: string;
};
