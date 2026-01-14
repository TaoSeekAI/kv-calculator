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
export function calcEqualPercentageOpening(m: number, R: number): number {
  if (m <= 0 || R <= 1) return NaN;
  return (1 - Math.log10(m) / Math.log10(R)) * 100;
}

/**
 * 计算线性开度
 * 开度% = (R - m) / ((R - 1) × m) × 100
 *
 * @param m 比值 = 额定Kv / 计算Kv
 * @param R 固有可调比
 */
export function calcLinearOpening(m: number, R: number): number {
  if (m <= 0 || R <= 1) return NaN;
  return (R - m) / ((R - 1) * m) * 100;
}

/**
 * 计算快开开度
 * 开度% = (1 - √(R×(m-1) / ((R-1)×m))) × 100
 *
 * @param m 比值 = 额定Kv / 计算Kv
 * @param R 固有可调比
 */
export function calcQuickOpeningOpening(m: number, R: number): number {
  if (m <= 1 || R <= 1) return NaN;
  const innerTerm = R * (m - 1) / ((R - 1) * m);
  if (innerTerm < 0) return NaN;
  return (1 - Math.sqrt(innerTerm)) * 100;
}

/**
 * 计算阀门开度
 *
 * @param calculatedKv 计算Kv
 * @param ratedKv 额定Kv
 * @param rangeability 固有可调比 R
 * @param flowChar 流量特性
 */
export function calcValveOpening(
  calculatedKv: number,
  ratedKv: number,
  rangeability: number,
  flowChar: FlowCharacteristic
): number {
  const m = ratedKv / calculatedKv;

  switch (flowChar) {
    case '等百分比':
      return calcEqualPercentageOpening(m, rangeability);
    case '线性':
      return calcLinearOpening(m, rangeability);
    case '快开':
      return calcQuickOpeningOpening(m, rangeability);
    default:
      throw new Error(`不支持的流量特性: ${flowChar}`);
  }
}

/**
 * 验证开度是否在合理范围
 * 通常开度应在 10% - 90% 之间
 */
export function validateOpening(opening: number): {
  valid: boolean;
  warning?: string;
} {
  if (isNaN(opening)) {
    return { valid: false, warning: '开度计算结果无效' };
  }

  if (opening < 0) {
    return { valid: false, warning: '开度小于0%，阀门选型过大' };
  }

  if (opening > 100) {
    return { valid: false, warning: '开度超过100%，阀门选型过小' };
  }

  if (opening < 10) {
    return { valid: true, warning: '开度小于10%，建议选择更小口径阀门' };
  }

  if (opening > 90) {
    return { valid: true, warning: '开度大于90%，建议选择更大口径阀门' };
  }

  return { valid: true };
}
