/**
 * 气体噪音计算模块
 * 基于 IEC 60534-8-3 标准
 */
import { NoiseInput, NoiseResult, GasFlowState } from './noise/types.js';
/**
 * 判定气体流动状态
 * 基于Excel公式精确实现
 * @param P1 入口压力 KPa (绝对压力)
 * @param P2 出口压力 KPa (绝对压力)
 * @param xT 压差比系数
 * @param gamma 比热比
 * @param FL 压力恢复系数
 * @returns 流动状态和关键压力值
 */
export declare function determineGasFlowState(P1: number, P2: number, xT: number, gamma: number, FL?: number): {
    state: GasFlowState;
    P2C: number;
    Pvcc: number;
    P2B: number;
    P2CE: number;
    alpha: number;
};
/**
 * 气体噪音计算主函数
 * 基于Excel公式精确实现
 * @param input 噪音计算输入参数
 * @returns 噪音计算结果
 */
export declare function calculateGasNoise(input: NoiseInput): NoiseResult;
/**
 * Gas noise flow state description
 */
export declare function getGasFlowStateDescription(state: GasFlowState): string;
