/**
 * 气体噪音计算模块
 * 基于 IEC 60534-8-3 标准
 */

import {
  NoiseInput,
  NoiseResult,
  GasNoiseIntermediate,
  GasFlowState
} from './noise/types.js';
import {
  NOISE_CONSTANTS,
  getPipeMaterialDensity,
  calculateAWeighting
} from './noise/constants.js';

/**
 * 计算入口声速
 * c1 = sqrt(gamma * R * T1 / M)
 * @param gamma 比热比
 * @param T1 入口温度 K
 * @param M 分子量 kg/kmol
 * @returns 入口声速 m/s
 */
function calculateInletSoundSpeed(gamma: number, T1: number, M: number): number {
  // R = 8314.46 J/(kmol·K)
  return Math.sqrt(gamma * NOISE_CONSTANTS.R * T1 / M);
}

/**
 * 计算出口声速
 * 基于Excel公式 E84: C2 = SQRT(gamma * R * T2 / M)
 * 其中 T2 = T1 (假设等温过程，E31=E30)
 * 所以 C2 = C1
 * @param c1 入口声速 m/s
 * @returns 出口声速 m/s (与入口相同)
 */
function calculateOutletSoundSpeed(c1: number): number {
  // Excel假设等温过程，T2 = T1，所以C2 = C1
  return c1;
}

/**
 * 计算出口密度
 * 基于Excel公式 E83: rho2 = rho1 * P2/P1 (等温过程)
 */
function calculateOutletDensity(rho1: number, P2: number, P1: number): number {
  return rho1 * P2 / P1;
}

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
export function determineGasFlowState(
  P1: number,
  P2: number,
  xT: number,
  gamma: number,
  FL: number = 0.9
): { state: GasFlowState; P2C: number; Pvcc: number; P2B: number; P2CE: number; alpha: number } {
  // 转换为Pa进行计算 (Excel使用Pa)
  const P1_Pa = P1 * 1000;
  const P2_Pa = P2 * 1000;

  // 临界缩流断面压力 Pvcc (E40)
  // Pvcc = P1 * (2/(gamma+1))^(gamma/(gamma-1))
  const Pvcc_Pa = P1_Pa * Math.pow(2 / (gamma + 1), gamma / (gamma - 1));

  // 临界流起始压力 P2C (E41)
  // P2C = P1 - FL² * (P1 - Pvcc)
  const P2C_Pa = P1_Pa - FL * FL * (P1_Pa - Pvcc_Pa);

  // α - 恢复修正系数 (E42)
  // alpha = Pvcc / P2C
  const alpha = Pvcc_Pa / P2C_Pa;

  // P2B - 断点出口压力 (E43)
  // P2B = P1/22/α * (1/γ)^(γ/(γ-1))
  const P2B_Pa = (P1_Pa / 22 / alpha) * Math.pow(1 / gamma, gamma / (gamma - 1));

  // P2CE - 声效系数恒定的出口压力 (E44)
  // P2CE = P1 / 22 / α
  const P2CE_Pa = P1_Pa / 22 / alpha;

  // 转换回KPa
  const Pvcc = Pvcc_Pa / 1000;
  const P2C = P2C_Pa / 1000;
  const P2B = P2B_Pa / 1000;
  const P2CE = P2CE_Pa / 1000;

  let state: GasFlowState;

  // 状态判定 (基于Excel逻辑)
  if (P2 >= P2C) {
    state = 'State I';      // 亚音速流: P2 >= P2C
  } else if (P2 >= Pvcc) {
    state = 'State II';     // 过渡流: P2C > P2 >= Pvcc
  } else if (P2 >= P2B) {
    state = 'State III';    // 临界流: Pvcc > P2 >= P2B
  } else if (P2 >= P2CE) {
    state = 'State IV';     // 常数声效: P2B > P2 >= P2CE
  } else {
    state = 'State V';      // 完全阻塞: P2 < P2CE
  }

  return { state, P2C, Pvcc, P2B, P2CE, alpha };
}

/**
 * 计算缩流断面压力 Pvc
 * @param P1 入口压力 KPa
 * @param P2 出口压力 KPa
 * @param FL 压力恢复系数
 * @param state 流动状态
 * @param Pvcc 临界缩流断面压力
 * @returns 缩流断面压力 KPa
 */
function calculateVenaContractaPressure(
  P1: number,
  P2: number,
  FL: number,
  state: GasFlowState,
  Pvcc: number
): number {
  if (state === 'State I') {
    // 亚音速流: Pvc = P1 - (P1 - P2) / FL²
    return P1 - (P1 - P2) / (FL * FL);
  } else {
    // 临界流及以上: 使用临界缩流压力
    return Pvcc;
  }
}

/**
 * 计算缩流断面马赫数
 * @param P1 入口压力 KPa
 * @param Pvc 缩流断面压力 KPa
 * @param gamma 比热比
 * @param state 流动状态
 * @returns 马赫数
 */
function calculateVenaContractaMach(
  P1: number,
  Pvc: number,
  gamma: number,
  state: GasFlowState
): number {
  if (state === 'State I') {
    // 亚音速: Mvc = sqrt((2/(gamma-1)) * ((P1/Pvc)^((gamma-1)/gamma) - 1))
    const pressureRatio = Math.pow(P1 / Pvc, (gamma - 1) / gamma);
    const machSquared = (2 / (gamma - 1)) * (pressureRatio - 1);
    return Math.sqrt(Math.max(0, machSquared));
  } else {
    // 临界流及以上: 声速流 Mvc = 1
    return 1;
  }
}

/**
 * 计算缩流断面流速
 * Uvc = Mvc * c1 * (Pvc/P1)^((gamma-1)/2gamma)
 */
function calculateVenaContractaVelocity(
  Mvc: number,
  c1: number,
  P1: number,
  Pvc: number,
  gamma: number
): number {
  const factor = Math.pow(Pvc / P1, (gamma - 1) / (2 * gamma));
  return Mvc * c1 * factor;
}

/**
 * 计算自由膨胀射流马赫数 Mj (State II-IV)
 * Mj = sqrt(2/(γ-1) * ((P1/(α*P2))^((γ-1)/γ) - 1)) (E64)
 * @param P1 入口压力
 * @param P2 出口压力
 * @param alpha 恢复修正系数
 * @param gamma 比热比
 */
function calculateJetMachNumber(
  P1: number,
  P2: number,
  alpha: number,
  gamma: number
): number {
  const pressureRatio = Math.pow(P1 / (alpha * P2), (gamma - 1) / gamma);
  const machSquared = (2 / (gamma - 1)) * (pressureRatio - 1);
  return Math.sqrt(Math.max(0, machSquared));
}

/**
 * 计算State V的自由膨胀射流马赫数 Mj5
 * Mj5 = sqrt(2/(γ-1) * (22^((γ-1)/γ) - 1)) (E78)
 * @param gamma 比热比
 */
function calculateJetMachNumberStateV(gamma: number): number {
  const pressureRatio = Math.pow(22, (gamma - 1) / gamma);
  const machSquared = (2 / (gamma - 1)) * (pressureRatio - 1);
  return Math.sqrt(Math.max(0, machSquared));
}

/**
 * 计算声效系数
 * 基于Excel公式精确实现
 * @param state 流动状态
 * @param Mvc 缩流断面马赫数 (State I)
 * @param Mj 自由膨胀射流马赫数 (State II-V)
 * @param FL 压力恢复系数
 * @returns 声效系数
 */
function calculateAcousticEfficiency(
  state: GasFlowState,
  Mvc: number,
  Mj: number,
  FL: number
): number {
  // 确保马赫数有效
  const mach = Math.max(NOISE_CONSTANTS.MVC_MIN, Mvc);
  const machJ = Math.max(NOISE_CONSTANTS.MVC_MIN, Mj);
  const FL2 = FL * FL;

  let eta: number;

  switch (state) {
    case 'State I':
      // 亚音速: η = 10^-4 * Mvc^3.6 (E56)
      eta = 1e-4 * Math.pow(mach, 3.6);
      break;

    case 'State II':
      // 过渡流: η = 10^-4 * Mj^(6.6*FL²) (E66)
      eta = 1e-4 * Math.pow(machJ, 6.6 * FL2);
      break;

    case 'State III':
      // 临界流: η = 10^-4 * Mj^(6.6*FL²) (E70)
      eta = 1e-4 * Math.pow(machJ, 6.6 * FL2);
      break;

    case 'State IV':
      // 常数声效: η = 10^-4 * Mj²/2 * √2^(6.6*FL²) (E74)
      eta = 1e-4 * Math.pow(machJ, 2) / 2 * Math.pow(Math.SQRT2, 6.6 * FL2);
      break;

    case 'State V':
      // 完全阻塞: 使用Mj5计算 (E79)
      // Mj5 = sqrt(2/(γ-1)*(22^((γ-1)/γ)-1)) - 需要gamma，这里使用Mj近似
      eta = 1e-4 * Math.pow(machJ, 2) / 2 * Math.pow(Math.SQRT2, 6.6 * FL2);
      break;

    default:
      eta = NOISE_CONSTANTS.ETA_REF_GAS;
  }

  // 限制最大值
  return Math.min(eta, NOISE_CONSTANTS.ETA_MAX);
}

/**
 * 计算峰值频率
 * fp = 0.2 * Uvc / d
 * @param Uvc 缩流断面流速 m/s
 * @param d 阀座直径 mm
 * @returns 峰值频率 Hz
 */
function calculatePeakFrequency(Uvc: number, d: number): number {
  // 转换mm到m
  const d_m = d / 1000;
  return NOISE_CONSTANTS.FP_GAS_COEF * Uvc / d_m;
}

/**
 * 计算出口流速
 * U2 = W / (rho2 * A2)
 * @param massFlow 质量流量 kg/h
 * @param rho2 出口密度 kg/m³
 * @param Di 管道内径 mm
 * @returns 出口流速 m/s
 */
function calculateOutletVelocity(massFlow: number, rho2: number, Di: number): number {
  // 转换单位
  const m_s = massFlow / 3600;  // kg/h -> kg/s
  const Di_m = Di / 1000;       // mm -> m
  const A2 = Math.PI * Math.pow(Di_m / 2, 2);  // m²

  return m_s / (rho2 * A2);
}

/**
 * 计算机械功率
 * Wm = m * Uvc² / 2
 * @param massFlow 质量流量 kg/h
 * @param Uvc 缩流断面流速 m/s
 * @returns 机械功率 W
 */
function calculateMechanicalPower(massFlow: number, Uvc: number): number {
  const m_s = massFlow / 3600;  // kg/h -> kg/s
  return m_s * Uvc * Uvc / 2;
}

/**
 * 计算声功率
 * Wa = η * Wm
 */
function calculateSoundPower(eta: number, Wm: number): number {
  return eta * Wm;
}

/**
 * 计算内部声压级
 * 基于Excel公式 E88: Lpi = 10*LOG10(3.2*10^9 * Wa * rho2 * C2 / Di²)
 * @param Wa 声功率 W
 * @param rho2 出口密度 kg/m³
 * @param c2 出口声速 m/s
 * @param Di 管道内径 m
 * @returns 内部声压级 dB
 */
function calculateInternalNoiseLevel(
  Wa: number,
  rho2: number,
  c2: number,
  Di: number
): number {
  if (Wa <= 0) return NOISE_CONSTANTS.MIN_NOISE;

  // Excel公式: Lpi = 10*LOG10(3.2*10^9 * Wa * rho2 * C2 / Di²)
  const Lpi = 10 * Math.log10(NOISE_CONSTANTS.INTERNAL_NOISE_COEF * Wa * rho2 * c2 / (Di * Di));
  return Lpi;
}

/**
 * 计算管道透射损失
 * 基于Excel公式 E89: TL = 10*LOG10((7.6*10^-7)*(C2/(tp*fp))² * Gx / ((rho2*C2/(415*Gy))+1) * (Pa/Ps))
 * @param tp 管道壁厚 m
 * @param fp 峰值频率 Hz
 * @param Di 管道内径 m
 * @param rho2 出口密度 kg/m³
 * @param c2 出口声速 m/s
 * @param pipeMaterial 管道材料
 * @returns 透射损失 dB
 */
function calculateTransmissionLoss(
  tp: number,
  fp: number,
  Di: number,
  rho2: number,
  c2: number,
  pipeMaterial: 'steel' | 'stainless' = 'steel'
): number {
  // 转换单位 (输入为mm，需要转为m)
  const tp_m = tp / 1000;
  const Di_m = Di / 1000;

  // 环频率 fr (E90)
  const fr = NOISE_CONSTANTS.CP_PIPE / (Math.PI * Di_m);

  // 内部重合频率 f0 (E91)
  const f0 = (fr / 4) * (c2 / NOISE_CONSTANTS.C0);

  // 外部重合频率 fg (E92)
  const fg = Math.pow(NOISE_CONSTANTS.C0, 2) * Math.sqrt(3) / (NOISE_CONSTANTS.CP_PIPE * Math.PI * tp_m);

  // 频率系数 Gx (E93) - Excel中使用固定值1.9×10^-3
  // 注意: Excel E89公式中使用的是E93(固定值)，不是F93(计算值)
  const Gx = 1.9e-3;

  // 频率系数 Gy (E94)
  let Gy: number;
  if (fp < f0 && f0 < fg) {
    Gy = f0 / fg;
  } else if (fp < f0 && f0 >= fg) {
    Gy = 1;
  } else if (fp >= f0 && fp < fg) {
    Gy = fp / fg;
  } else {
    Gy = 1;
  }

  // 透射损失 TL (E89)
  // TL = 10*LOG10((7.6*10^-7)*(C2/(tp*fp))² * Gx / ((rho2*C2/(415*Gy))+1) * (Pa/Ps))
  const term1 = NOISE_CONSTANTS.TL_COEF_GAS * Math.pow(c2 / (tp_m * fp), 2) * Gx;
  const term2 = (rho2 * c2 / (415 * Gy)) + 1;
  const TL = 10 * Math.log10(term1 / term2);

  return TL;
}

/**
 * 计算外部噪音级
 * Lpe = Lpi - TL + 10 * log10(Di / (Di + 2tp))
 * @param Lpi 内部声功率级 dB
 * @param TL 透射损失 dB
 * @param Di 管道内径 mm
 * @param tp 管道壁厚 mm
 * @returns 外部噪音级 dB
 */
function calculateExternalNoiseLevel(
  Lpi: number,
  TL: number,
  Di: number,
  tp: number
): number {
  const outerDiameter = Di + 2 * tp;
  const geometryTerm = 10 * Math.log10(Di / outerDiameter);

  return Lpi - TL + geometryTerm;
}

/**
 * 气体噪音计算主函数
 * 基于Excel公式精确实现
 * @param input 噪音计算输入参数
 * @returns 噪音计算结果
 */
export function calculateGasNoise(input: NoiseInput): NoiseResult {
  const warnings: string[] = [];

  // 提取参数
  const {
    P1, P2, deltaP, T1,
    massFlow,
    density: rho1,
    gamma = 1.4,
    molecularWeight: M = 29,
    FL = 0.9,
    xT = 0.72,
    Di, tp, d,
    pipeMaterial = 'steel'
  } = input;

  // 计算比热比系数
  const Fgamma = gamma / 1.4;

  // 判定流动状态 (使用精确公式)
  const { state, P2C, Pvcc, P2B, P2CE, alpha } = determineGasFlowState(P1, P2, xT, gamma, FL);

  // 计算入口声速
  const c1 = calculateInletSoundSpeed(gamma, T1, M);

  // 计算缩流断面压力
  const Pvc = calculateVenaContractaPressure(P1, P2, FL, state, Pvcc);

  // 计算缩流断面马赫数 (State I)
  const Mvc = calculateVenaContractaMach(P1, Pvc, gamma, state);

  // 计算自由膨胀射流马赫数 Mj (State II-V)
  let Mj: number;
  if (state === 'State V') {
    Mj = calculateJetMachNumberStateV(gamma);
  } else {
    Mj = calculateJetMachNumber(P1, P2, alpha, gamma);
  }

  // 计算缩流断面流速
  const Uvc = calculateVenaContractaVelocity(Mvc, c1, P1, Pvc, gamma);

  // 计算出口密度 (Excel E83使用等温过程)
  const rho2 = calculateOutletDensity(rho1, P2, P1);

  // 计算出口声速 (Excel假设等温过程，C2=C1)
  const c2 = calculateOutletSoundSpeed(c1);

  // 计算缩流断面温度 (E53/E61)
  const Tvc = state === 'State I'
    ? T1 * Math.pow(Pvc / P1, (gamma - 1) / gamma)  // 亚音速
    : 2 * T1 / (1 + gamma);  // 临界流

  // 计算缩流断面声速 (E54/E62)
  const Cvc = Math.sqrt(gamma * NOISE_CONSTANTS.R * Tvc / M);

  // 计算出口流速
  const U2 = calculateOutletVelocity(massFlow, rho2, Di);

  // 声功率比 rw (E49)
  const rw = 0.25;

  // 计算声效系数 (使用正确的马赫数和FL)
  const eta = calculateAcousticEfficiency(state, Mvc, Mj, FL);

  // 计算机械功率
  // State I: Wm = m * Uvc²/2 (E52)
  // State II-V: Wms = m * Cvcc²/2 (E63)
  let Wm: number;
  if (state === 'State I') {
    Wm = calculateMechanicalPower(massFlow, Uvc);
  } else {
    const Cvcc = Math.sqrt(gamma * NOISE_CONSTANTS.R * (2 * T1 / (1 + gamma)) / M);
    Wm = (massFlow / 3600) * Cvcc * Cvcc / 2;
  }

  // 计算声功率
  // State I: Wa = η * rw * Wm * FL² (E57)
  // State II: Wa = η * rw * Wms * (P1-P2)/(P1-Pvcc) (E67)
  // State III-V: Wa = η * rw * Wms (E71/E75/E80)
  let Wa: number;
  if (state === 'State I') {
    Wa = eta * rw * Wm * FL * FL;
  } else if (state === 'State II') {
    const ratio = (P1 - P2) / (P1 - Pvcc);
    Wa = eta * rw * Wm * ratio;
  } else {
    Wa = eta * rw * Wm;
  }

  // 计算射流直径 Dj (E48)
  const N14 = NOISE_CONSTANTS.N14 || 0.0049;
  const Fd = input.Fd || 0.46;
  const Kv = input.Kv || 100;
  const Dj = N14 * Fd * Math.sqrt(Kv * FL);

  // 计算峰值频率 (E59/E68/E72/E76/E81)
  let fp: number;
  if (state === 'State I') {
    fp = 0.2 * Uvc / Dj;  // E59
  } else if (state === 'State II' || state === 'State III') {
    fp = 0.2 * Mj * Cvc / Dj;  // E68/E72
  } else {
    // State IV/V: fp = 0.35*Cvcc/(1.25*Dj*sqrt(Mj²-1)) (E76/E81)
    const denominator = 1.25 * Dj * Math.sqrt(Math.max(0.01, Mj * Mj - 1));
    fp = 0.35 * Cvc / denominator;
  }

  // 确保频率有效
  fp = Math.max(100, Math.min(10000, fp));

  // 管道内径转为m
  const Di_m = Di / 1000;

  // 计算内部声压级 (E88)
  const Lpi = calculateInternalNoiseLevel(Wa, rho2, c2, Di_m);

  // 计算透射损失 (E89)
  const TL = calculateTransmissionLoss(tp, fp, Di, rho2, c2, pipeMaterial);

  // 计算出口马赫数 M0 (E85)
  const M0 = 4 * (massFlow / 3600) / (Math.PI * Math.pow(d / 1000, 2) * rho2 * c2);

  // 马赫数修正 Lg (E95)
  const M2_calc = 4 * (massFlow / 3600) / (Math.PI * Di_m * Di_m * rho2 * c2);
  const M2 = Math.min(M2_calc, 0.8);
  const Lg = M2 > 0 ? 16 * Math.log10(1 / (1 - M2)) : 0;

  // 计算外部噪音级 (E97)
  // Lpae = 5 + Lpi + TL + Lg
  const Lpae = 5 + Lpi + TL + Lg;

  // 距离修正 (E98)
  // LpAe,1m = Lpae - 10*LOG10((Di+2*tp+2)/(Di+2*tp))
  const tp_m = tp / 1000;
  const distanceCorrection = 10 * Math.log10((Di_m + 2 * tp_m + 0.002) / (Di_m + 2 * tp_m));
  const Lpe = Lpae - distanceCorrection;

  // 计算A加权校正
  const deltaLA = calculateAWeighting(fp);

  // 最终噪音级
  let noiseLevel = Lpe;

  // 限制范围
  noiseLevel = Math.max(NOISE_CONSTANTS.MIN_NOISE, Math.min(NOISE_CONSTANTS.MAX_NOISE, noiseLevel));

  // 添加警告
  if (Mvc >= 1) {
    warnings.push('缩流断面达到声速，噪音较大');
  }
  if (noiseLevel > 85) {
    warnings.push(`噪音级 ${noiseLevel.toFixed(1)} dBA 超过85dBA，需要采取降噪措施`);
  }
  if (noiseLevel > 100) {
    warnings.push('噪音级超过100dBA，建议选用低噪音阀或加装消音器');
  }
  if (M0 > 0.3) {
    warnings.push(`出口马赫数 ${M0.toFixed(2)} 较高，可能需要考虑高马赫数修正`);
  }

  // 构建中间计算值
  const intermediate: GasNoiseIntermediate = {
    P2C,
    Pvc,
    Pvcc,
    c1,
    c2,
    Uvc,
    U2,
    Mvc,
    Mj,
    eta,
    Wm,
    Wa,
    Lpi,
    TL,
    Lpe,
    fp,
    deltaLA,
    rho2,
    Fgamma,
    Dj,
    M0,
    Lg
  };

  // 流动状态描述
  const stateDescription: Record<GasFlowState, string> = {
    'State I': '亚音速流',
    'State II': '过渡流',
    'State III': '临界流',
    'State IV': '常数声效',
    'State V': '完全阻塞'
  };

  return {
    noiseLevel: Math.round(noiseLevel * 10) / 10,
    flowState: `${state} (${stateDescription[state]})`,
    intermediate,
    peakFrequency: Math.round(fp),
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * 气体噪音流动状态描述
 */
export function getGasFlowStateDescription(state: GasFlowState): string {
  const descriptions: Record<GasFlowState, string> = {
    'State I': '亚音速流 - 缩流断面流速低于声速',
    'State II': '过渡流 - 接近临界流状态',
    'State III': '临界流 - 缩流断面达到声速',
    'State IV': '常数声效系数 - 高压差比',
    'State V': '完全阻塞流 - 最大噪音状态'
  };
  return descriptions[state];
}
