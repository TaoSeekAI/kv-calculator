/**
 * 蒸汽Kv计算模块
 * 基于 IEC 60534-2-1 标准
 */

import { CONSTANTS } from '../constants/index.js';
import type { FlowState } from '../types/index.js';
import { calcFP, calcSumK } from './liquid.js';
import { calcFgamma, calcX, calcXTP, calcY, determineGasFlowState, determineGasFlowStateWithFitting } from './gas.js';

/**
 * 蒸汽Kv计算 - 非阻塞流，无接管
 * C = W / (N6×Y×√(x×P1×ρ1))
 *
 * @param W 质量流量 Kg/h
 * @param Y 膨胀系数
 * @param x 压差比
 * @param P1 入口绝对压力 KPa
 * @param rho1 入口密度 Kg/m³
 */
export function calcSteamKv(
  W: number,
  Y: number,
  x: number,
  P1: number,
  rho1: number
): number {
  return W / (CONSTANTS.N6 * Y * Math.sqrt(x * P1 * rho1));
}

/**
 * 蒸汽Kv计算 - 非阻塞流，带接管
 * C = W / (N6×FP×Y×√(x×P1×ρ1))
 */
export function calcSteamKvWithFitting(
  W: number,
  FP: number,
  Y: number,
  x: number,
  P1: number,
  rho1: number
): number {
  return W / (CONSTANTS.N6 * FP * Y * Math.sqrt(x * P1 * rho1));
}

/**
 * 蒸汽Kv计算 - 阻塞流，无接管
 * C = W / (0.667×N6×√(Fγ×xT×P1×ρ1))
 */
export function calcSteamKvChoked(
  W: number,
  Fgamma: number,
  xT: number,
  P1: number,
  rho1: number
): number {
  return W / (0.667 * CONSTANTS.N6 * Math.sqrt(Fgamma * xT * P1 * rho1));
}

/**
 * 蒸汽Kv计算 - 阻塞流，带接管
 * C = W / (0.667×FP×N6×√(Fγ×xTP×P1×ρ1))
 */
export function calcSteamKvChokedWithFitting(
  W: number,
  FP: number,
  Fgamma: number,
  xTP: number,
  P1: number,
  rho1: number
): number {
  return W / (0.667 * FP * CONSTANTS.N6 * Math.sqrt(Fgamma * xTP * P1 * rho1));
}

/**
 * 蒸汽Kv计算 - 非紊流
 * C = W / (N18×FR) × √(T1/(ΔP×(P1+P2)×M))
 * 蒸汽分子量 M = 18.0152
 */
export function calcSteamKvLaminar(
  W: number,
  FR: number,
  T1: number,
  deltaP: number,
  P1: number,
  P2: number
): number {
  const M = 18.0152; // 水蒸汽分子量
  return W / (CONSTANTS.N18 * FR) * Math.sqrt(T1 / (deltaP * (P1 + P2) * M));
}

/**
 * 蒸汽Kv综合计算参数
 */
export interface SteamKvParams {
  W: number;              // 质量流量 Kg/h
  P1: number;             // 入口绝对压力 KPa
  P2: number;             // 出口绝对压力 KPa
  T1: number;             // 入口绝对温度 K
  rho1: number;           // 入口密度 Kg/m³
  gamma: number;          // 比热比
  xT: number;             // 压差比系数
  d: number;              // 阀门公称通径 mm
  D1: number;             // 上游管道内径 mm
  D2: number;             // 下游管道内径 mm
  ratedKv: number;        // 额定Kv
  FR?: number;            // 雷诺数修正系数
}

/**
 * 蒸汽Kv计算结果
 */
export interface SteamKvResult {
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
 * 蒸汽Kv综合计算
 */
export function calculateSteamKv(params: SteamKvParams): SteamKvResult {
  const { W, P1, P2, T1, rho1, gamma, xT, d, D1, D2, ratedKv, FR = 1 } = params;

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
  const kvNoFitting = calcSteamKv(W, Y, x, P1, rho1);
  const kvWithFitting = calcSteamKvWithFitting(W, FP, Y, x, P1, rho1);
  const kvChokedNoFitting = calcSteamKvChoked(W, Fgamma, xT, P1, rho1);
  const kvChokedWithFitting = calcSteamKvChokedWithFitting(W, FP, Fgamma, xTP, P1, rho1);
  const kvLaminar = FR < 1 ? calcSteamKvLaminar(W, FR, T1, deltaP, P1, P2) : undefined;

  // 选择最终Kv值
  let kv: number;
  let usedFormula: string;
  let flowState: FlowState;

  if (FR < 1 && kvLaminar) {
    kv = kvLaminar;
    usedFormula = '蒸汽非紊流';
    flowState = flowStateNoFitting;
  } else if (!hasFittings) {
    if (flowStateNoFitting === '非阻塞流') {
      kv = kvNoFitting;
      usedFormula = '蒸汽非阻塞流无接管';
    } else {
      kv = kvChokedNoFitting;
      usedFormula = '蒸汽阻塞流无接管';
    }
    flowState = flowStateNoFitting;
  } else {
    if (flowStateWithFitting === '非阻塞流') {
      kv = kvWithFitting;
      usedFormula = '蒸汽非阻塞流带接管';
    } else {
      kv = kvChokedWithFitting;
      usedFormula = '蒸汽阻塞流带接管';
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
