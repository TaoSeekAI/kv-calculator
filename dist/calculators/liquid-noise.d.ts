/**
 * 液体噪音计算模块
 * 基于 IEC 60534-8-4 标准
 */
import { NoiseInput, NoiseResult, CavitationState } from './noise/types.js';
/**
 * 判定空化状态
 * @param xF 压差比 (P1-P2)/(P1-Pv)
 * @param xFz 空化起始压差比
 * @param FL 压力恢复系数
 * @returns 空化状态
 */
export declare function determineCavitationState(xF: number, xFz: number, FL: number): CavitationState;
/**
 * 液体噪音计算主函数
 * 基于Excel公式精确实现
 * @param input 噪音计算输入参数
 * @returns 噪音计算结果
 */
export declare function calculateLiquidNoise(input: NoiseInput): NoiseResult;
/**
 * 获取空化状态描述
 */
export declare function getCavitationStateDescription(state: CavitationState): string;
