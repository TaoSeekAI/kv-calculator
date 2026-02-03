/**
 * Kv Comprehensive Calculator
 * Integrates Kv calculation for liquids, gases, and steam
 */
import type { KvInput, KvResult } from './types/index.js';
import type { NoiseResult } from './calculators/noise/types.js';
/**
 * Kv Calculator Class
 */
export declare class KvCalculator {
    /**
     * Comprehensive Kv calculation
     */
    calculate(input: KvInput): KvResult;
    /**
     * Calculate noise
     * @param input Original input parameters
     * @param result Calculated Kv result
     * @returns Noise level dBA
     */
    calculateNoise(input: KvInput, result: KvResult): NoiseResult | null;
    /**
     * Comprehensive calculation (including noise)
     * @param input Input parameters
     * @param includeNoise Whether to calculate noise (default true)
     */
    calculateWithNoise(input: KvInput, includeNoise?: boolean): KvResult & {
        noiseResult?: NoiseResult;
    };
}
export declare const kvCalculator: KvCalculator;
