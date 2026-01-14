/**
 * 气体Kv计算模块
 * 基于 IEC 60534-2-1 标准
 */

import { CONSTANTS } from '../constants/index.js';
import type { FlowState } from '../types/index.js';
import { calcFP, calcSumK } from './liquid.js';

/**
 * 计算比热比系数 Fγ
 * Fγ = γ / 1.4
 *
 * @param gamma 比热比
 */
export function calcFgamma(gamma: number): number {
  return gamma / 1.4;
}

/**
 * 计算压差比 x
 * x = ΔP / P1
 *
 * @param deltaP 压差 KPa
 * @param P1 入口绝对压力 KPa
 */
export function calcX(deltaP: number, P1: number): number {
  return deltaP / P1;
}

/**
 * 计算临界压差比 xT (带管件修正) xTP
 * xTP = xT / FP² / (1 + xT×(K1+KB1)/N5 × (C/d²)²)
 *
 * @param xT 压差比系数
 * @param FP 管道几何形状系数
 * @param K1_KB1 K1 + KB1
 * @param C 流量系数
 * @param d 阀门公称通径 mm
 */
export function calcXTP(
  xT: number,
  FP: number,
  K1_KB1: number,
  C: number,
  d: number
): number {
  const term = xT * K1_KB1 / CONSTANTS.N5 * Math.pow(C / (d * d), 2);
  return xT / (FP * FP) / (1 + term);
}

/**
 * 计算膨胀系数 Y
 * Y = 1 - x/(3×Fγ×xT)
 * 注：Y 最小值为 0.667
 *
 * @param x 压差比
 * @param Fgamma 比热比系数
 * @param xT 压差比系数
 */
export function calcY(x: number, Fgamma: number, xT: number): number {
  const Y = 1 - x / (3 * Fgamma * xT);
  return Math.max(Y, 0.667);
}

/**
 * 判断气体流动状态
 * 非阻塞流: x < Fγ × xT
 * 阻塞流: x ≥ Fγ × xT
 */
export function determineGasFlowState(x: number, Fgamma: number, xT: number): FlowState {
  return x < Fgamma * xT ? '非阻塞流' : '阻塞流';
}

/**
 * 判断气体流动状态（带管件）
 * 非阻塞流: x < Fγ × xTP
 * 阻塞流: x ≥ Fγ × xTP
 */
export function determineGasFlowStateWithFitting(
  x: number,
  Fgamma: number,
  xTP: number
): FlowState {
  return x < Fgamma * xTP ? '非阻塞流' : '阻塞流';
}

/**
 * 气体Kv计算 - 非阻塞流，无接管
 * C = Qn / (N9×P1×Y) × √(22.4×M×Z×T1/x)
 *
 * @param Qn 标准体积流量 Nm³/h
 * @param P1 入口绝对压力 KPa
 * @param Y 膨胀系数
 * @param M 分子量 Kg/Kmol
 * @param Z 压缩系数
 * @param T1 入口绝对温度 K
 * @param x 压差比
 */
export function calcGasKv(
  Qn: number,
  P1: number,
  Y: number,
  M: number,
  Z: number,
  T1: number,
  x: number
): number {
  return Qn / (CONSTANTS.N9 * P1 * Y) * Math.sqrt(22.4 * M * Z * T1 / x);
}

/**
 * 气体Kv计算 - 非阻塞流，带接管
 * C = Qn / (N9×FP×P1×Y) × √(22.4×M×Z×T1/x)
 */
export function calcGasKvWithFitting(
  Qn: number,
  P1: number,
  Y: number,
  FP: number,
  M: number,
  Z: number,
  T1: number,
  x: number
): number {
  return Qn / (CONSTANTS.N9 * FP * P1 * Y) * Math.sqrt(22.4 * M * Z * T1 / x);
}

/**
 * 气体Kv计算 - 阻塞流，无接管
 * C = Qn / (0.667×N9×P1) × √(22.4×M×Z×T1/(xT×Fγ))
 */
export function calcGasKvChoked(
  Qn: number,
  P1: number,
  M: number,
  Z: number,
  T1: number,
  xT: number,
  Fgamma: number
): number {
  return Qn / (0.667 * CONSTANTS.N9 * P1) * Math.sqrt(22.4 * M * Z * T1 / (xT * Fgamma));
}

/**
 * 气体Kv计算 - 阻塞流，带接管
 * C = Qn / (0.667×N9×FP×P1) × √(22.4×M×Z×T1/(xTP×Fγ))
 */
export function calcGasKvChokedWithFitting(
  Qn: number,
  P1: number,
  FP: number,
  M: number,
  Z: number,
  T1: number,
  xTP: number,
  Fgamma: number
): number {
  return Qn / (0.667 * CONSTANTS.N9 * FP * P1) * Math.sqrt(22.4 * M * Z * T1 / (xTP * Fgamma));
}

/**
 * 气体Kv计算 - 非紊流
 * C = Qn / (N18×FR) × √(22.4×M×T1/(ΔP×(P1+P2)))
 */
export function calcGasKvLaminar(
  Qn: number,
  FR: number,
  M: number,
  T1: number,
  deltaP: number,
  P1: number,
  P2: number
): number {
  return Qn / (CONSTANTS.N18 * FR) * Math.sqrt(22.4 * M * T1 / (deltaP * (P1 + P2)));
}

/**
 * 气体Kv综合计算参数
 */
export interface GasKvParams {
  Qn: number;             // 标准体积流量 Nm³/h
  P1: number;             // 入口绝对压力 KPa
  P2: number;             // 出口绝对压力 KPa
  T1: number;             // 入口绝对温度 K
  M: number;              // 分子量 Kg/Kmol
  Z: number;              // 压缩系数
  gamma: number;          // 比热比
  xT: number;             // 压差比系数
  d: number;              // 阀门公称通径 mm
  D1: number;             // 上游管道内径 mm
  D2: number;             // 下游管道内径 mm
  ratedKv: number;        // 额定Kv
  FR?: number;            // 雷诺数修正系数
}

/**
 * 气体Kv计算结果
 */
export interface GasKvResult {
  kv: number;
  flowState: FlowState;
  hasFittings: boolean;
  usedFormula: string;
  intermediate: {
    deltaP: number;
    x: number;
    Fgamma: number;
    Y: number;
    xTP: number;
    sumK: number;
    FP: number;
    kvNoFitting: number;
    kvWithFitting: number;
    kvChokedNoFitting: number;
    kvChokedWithFitting: number;
    kvLaminar?: number;
  };
}

/**
 * 气体Kv综合计算
 */
export function calculateGasKv(params: GasKvParams): GasKvResult {
  const { Qn, P1, P2, T1, M, Z, gamma, xT, d, D1, D2, ratedKv, FR = 1 } = params;

  // 基础计算
  const deltaP = P1 - P2;
  const x = calcX(deltaP, P1);
  const Fgamma = calcFgamma(gamma);
  const Y = calcY(x, Fgamma, xT);

  // 管件系数计算
  const sumK = calcSumK(d, D1, D2);
  const Ci = ratedKv * 1.3;
  const FP = calcFP(sumK, Ci, d);

  // 计算 K1 + KB1
  const K1 = 0.5 * Math.pow(1 - Math.pow(d / D1, 2), 2);
  const KB1 = 1 - Math.pow(d / D1, 4);
  const K1_KB1 = K1 + KB1;

  // xTP 计算
  const xTP = calcXTP(xT, FP, K1_KB1, Ci, d);

  // 判断是否有管件影响
  const hasFittings = d !== D1 || d !== D2;

  // 流动状态判定
  const flowStateNoFitting = determineGasFlowState(x, Fgamma, xT);
  const flowStateWithFitting = determineGasFlowStateWithFitting(x, Fgamma, xTP);

  // 计算各公式Kv
  const kvNoFitting = calcGasKv(Qn, P1, Y, M, Z, T1, x);
  const kvWithFitting = calcGasKvWithFitting(Qn, P1, Y, FP, M, Z, T1, x);
  const kvChokedNoFitting = calcGasKvChoked(Qn, P1, M, Z, T1, xT, Fgamma);
  const kvChokedWithFitting = calcGasKvChokedWithFitting(Qn, P1, FP, M, Z, T1, xTP, Fgamma);
  const kvLaminar = FR < 1 ? calcGasKvLaminar(Qn, FR, M, T1, deltaP, P1, P2) : undefined;

  // 选择最终Kv值
  let kv: number;
  let usedFormula: string;
  let flowState: FlowState;

  if (FR < 1 && kvLaminar) {
    kv = kvLaminar;
    usedFormula = '非紊流';
    flowState = flowStateNoFitting;
  } else if (!hasFittings) {
    if (flowStateNoFitting === '非阻塞流') {
      kv = kvNoFitting;
      usedFormula = '气体非阻塞流无接管';
    } else {
      kv = kvChokedNoFitting;
      usedFormula = '气体阻塞流无接管';
    }
    flowState = flowStateNoFitting;
  } else {
    if (flowStateWithFitting === '非阻塞流') {
      kv = kvWithFitting;
      usedFormula = '气体非阻塞流带接管';
    } else {
      kv = kvChokedWithFitting;
      usedFormula = '气体阻塞流带接管';
    }
    flowState = flowStateWithFitting;
  }

  return {
    kv,
    flowState,
    hasFittings,
    usedFormula,
    intermediate: {
      deltaP,
      x,
      Fgamma,
      Y,
      xTP,
      sumK,
      FP,
      kvNoFitting,
      kvWithFitting,
      kvChokedNoFitting,
      kvChokedWithFitting,
      kvLaminar
    }
  };
}
