/**
 * Valve Opening Calculation Module
 */

import type { FlowCharacteristic } from '../types/index.js';

/**
 * Calculate equal percentage opening
 * Opening% = (1 - LOG10(m) / LOG10(R)) × 100
 *
 * @param m Ratio = Rated Kv / Calculated Kv
 * @param R Inherent rangeability
 */
export function calcEqualPercentageOpening(m: number, R: number): number {
  if (m <= 0 || R <= 1) return NaN;
  return (1 - Math.log10(m) / Math.log10(R)) * 100;
}

/**
 * Calculate linear opening
 * Opening% = (R - m) / ((R - 1) × m) × 100
 *
 * @param m Ratio = Rated Kv / Calculated Kv
 * @param R Inherent rangeability
 */
export function calcLinearOpening(m: number, R: number): number {
  if (m <= 0 || R <= 1) return NaN;
  return (R - m) / ((R - 1) * m) * 100;
}

/**
 * Calculate quick opening percentage
 * Opening% = (1 - √(R×(m-1) / ((R-1)×m))) × 100
 *
 * @param m Ratio = Rated Kv / Calculated Kv
 * @param R Inherent rangeability
 */
export function calcQuickOpeningOpening(m: number, R: number): number {
  if (m <= 1 || R <= 1) return NaN;
  const innerTerm = R * (m - 1) / ((R - 1) * m);
  if (innerTerm < 0) return NaN;
  return (1 - Math.sqrt(innerTerm)) * 100;
}

/**
 * Calculate valve opening
 *
 * @param calculatedKv Calculated Kv
 * @param ratedKv Rated Kv
 * @param rangeability Inherent rangeability R
 * @param flowChar Flow characteristic
 */
export function calcValveOpening(
  calculatedKv: number,
  ratedKv: number,
  rangeability: number,
  flowChar: FlowCharacteristic
): number {
  const m = ratedKv / calculatedKv;

  switch (flowChar) {
    case 'Equal Percentage':
      return calcEqualPercentageOpening(m, rangeability);
    case 'Linear':
      return calcLinearOpening(m, rangeability);
    case 'Quick Opening':
      return calcQuickOpeningOpening(m, rangeability);
    default:
      throw new Error(`Unsupported flow characteristic: ${flowChar}`);
  }
}

/**
 * Validate if opening is within reasonable range
 * Typically opening should be between 10% - 90%
 */
export function validateOpening(opening: number): {
  valid: boolean;
  warning?: string;
} {
  if (isNaN(opening)) {
    return { valid: false, warning: 'Invalid opening calculation result' };
  }

  if (opening < 0) {
    return { valid: false, warning: 'Opening less than 0%, valve oversized' };
  }

  if (opening > 100) {
    return { valid: false, warning: 'Opening exceeds 100%, valve undersized' };
  }

  if (opening < 10) {
    return { valid: true, warning: 'Opening less than 10%, consider selecting a smaller valve' };
  }

  if (opening > 90) {
    return { valid: true, warning: 'Opening greater than 90%, consider selecting a larger valve' };
  }

  return { valid: true };
}
