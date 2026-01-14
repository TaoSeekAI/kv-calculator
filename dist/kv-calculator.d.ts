/**
 * Kv综合计算器
 * 整合液体、气体、蒸汽的Kv计算
 */
import type { KvInput, KvResult } from './types/index.js';
import type { NoiseResult } from './calculators/noise/types.js';
/**
 * Kv计算器类
 */
export declare class KvCalculator {
    /**
     * 综合Kv计算
     */
    calculate(input: KvInput): KvResult;
    /**
     * 计算噪音
     * @param input 原始输入参数
     * @param result 已计算的Kv结果
     * @returns 噪音级 dBA
     */
    calculateNoise(input: KvInput, result: KvResult): NoiseResult | null;
    /**
     * 综合计算 (包含噪音)
     * @param input 输入参数
     * @param includeNoise 是否计算噪音 (默认true)
     */
    calculateWithNoise(input: KvInput, includeNoise?: boolean): KvResult & {
        noiseResult?: NoiseResult;
    };
}
export declare const kvCalculator: KvCalculator;
