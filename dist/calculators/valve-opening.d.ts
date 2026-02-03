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
export declare function calcEqualPercentageOpening(m: number, R: number): number;
/**
 * Calculate linear opening
 * Opening% = (R - m) / ((R - 1) × m) × 100
 *
 * @param m Ratio = Rated Kv / Calculated Kv
 * @param R Inherent rangeability
 */
export declare function calcLinearOpening(m: number, R: number): number;
/**
 * Calculate quick opening percentage
 * Opening% = (1 - √(R×(m-1) / ((R-1)×m))) × 100
 *
 * @param m Ratio = Rated Kv / Calculated Kv
 * @param R Inherent rangeability
 */
export declare function calcQuickOpeningOpening(m: number, R: number): number;
/**
 * Calculate valve opening
 *
 * @param calculatedKv Calculated Kv
 * @param ratedKv Rated Kv
 * @param rangeability Inherent rangeability R
 * @param flowChar Flow characteristic
 */
export declare function calcValveOpening(calculatedKv: number, ratedKv: number, rangeability: number, flowChar: FlowCharacteristic): number;
/**
 * Validate if opening is within reasonable range
 * Typically opening should be between 10% - 90%
 */
export declare function validateOpening(opening: number): {
    valid: boolean;
    warning?: string;
};
