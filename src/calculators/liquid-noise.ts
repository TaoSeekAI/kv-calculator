/**
 * 液体噪音计算模块
 * 基于 IEC 60534-8-4 标准
 */

import {
  NoiseInput,
  NoiseResult,
  LiquidNoiseIntermediate,
  CavitationState
} from './noise/types.js';
import {
  NOISE_CONSTANTS,
  getPipeMaterialDensity
} from './noise/constants.js';

/**
 * 判定空化状态
 * @param xF 压差比 (P1-P2)/(P1-Pv)
 * @param xFz 空化起始压差比
 * @param FL 压力恢复系数
 * @returns 空化状态
 */
export function determineCavitationState(
  xF: number,
  xFz: number,
  FL: number
): CavitationState {
  const FL2 = FL * FL;

  if (xF <= xFz) {
    return 'No Cavitation';
  } else if (xF <= FL2) {
    return 'Incipient Cavitation';
  } else if (xF <= 1) {
    return 'Constant Cavitation';
  } else {
    return 'Flashing';
  }
}

/**
 * 计算空化起始压差比 xFz (标准阀门)
 * xFz = 0.9 / sqrt(1 + 3*Fd*sqrt(C / (N34*FL)))
 * @param Cv 计算Cv
 * @param Fd 阀门类型修正系数
 * @param FL 压力恢复系数
 * @returns 空化起始压差比
 */
function calculateXFz(Cv: number, Fd: number, FL: number): number {
  const term = 1 + 3 * Fd * Math.sqrt(Cv / (NOISE_CONSTANTS.N34 * FL));
  return 0.9 / Math.sqrt(term);
}

/**
 * 计算有效压差
 * deltaPc = min(deltaP, FL² * (P1 - Pv))
 * @param deltaP 实际压差 KPa
 * @param FL 压力恢复系数
 * @param P1 入口压力 KPa
 * @param Pv 饱和蒸汽压 KPa
 * @returns 有效压差 KPa
 */
function calculateEffectiveDeltaP(
  deltaP: number,
  FL: number,
  P1: number,
  Pv: number
): number {
  const maxDeltaP = FL * FL * (P1 - Pv);
  return Math.min(deltaP, maxDeltaP);
}

/**
 * 计算缩流断面流速
 * Uvc = (1/FL) * sqrt(2 * deltaPc / rhoL)
 * @param FL 压力恢复系数
 * @param deltaPc 有效压差 KPa
 * @param rhoL 液体密度 kg/m³
 * @returns 缩流断面流速 m/s
 */
function calculateVenaContractaVelocity(
  FL: number,
  deltaPc: number,
  rhoL: number
): number {
  // deltaPc从KPa转换为Pa
  const deltaPc_Pa = deltaPc * 1000;
  return (1 / FL) * Math.sqrt(2 * deltaPc_Pa / rhoL);
}

/**
 * 计算紊流声效系数
 * 基于Excel公式 E44: etaTurb = 10^Aη * (Uvc/cL)
 * 其中 Aη = -4.6 (Excel中的值)
 * @param Uvc 缩流断面流速 m/s
 * @param cL 液体声速 m/s
 * @returns 紊流声效系数
 */
function calculateTurbulentEfficiency(Uvc: number, cL: number): number {
  const velocityRatio = Uvc / cL;
  // Excel公式: etaTurb = 10^(-4.6) * (Uvc/cL)
  // A_ETA_TURB = -4.6
  return Math.pow(10, NOISE_CONSTANTS.A_ETA_TURB) * velocityRatio;
}

/**
 * 计算空化声效系数
 * 基于Excel公式 E45:
 * etaCav = 0.32 * etaTurb * SQRT((P1-P2)/deltaPc) * EXP(5*xFzp) *
 *          ((1-xFzp)/(1-xF))^0.5 * (xF/xFzp)^5 * (xF-xFzp)^1.5
 * @param etaTurb 紊流声效系数
 * @param xF 压差比
 * @param xFzp 有效空化起始点
 * @param P1 入口压力 KPa
 * @param P2 出口压力 KPa
 * @param deltaPc 有效压差 KPa
 * @returns 空化声效系数
 */
function calculateCavitationEfficiency(
  etaTurb: number,
  xF: number,
  xFzp: number,
  P1: number,
  P2: number,
  deltaPc: number
): number {
  // 确保参数有效
  if (xF <= xFzp || xFzp >= 1 || xFzp <= 0) {
    return 0;
  }

  // 防止除零和无效计算
  if (deltaPc <= 0 || xF >= 1) {
    return 0;
  }

  // Excel公式 E45:
  // etaCav = 0.32 * etaTurb * SQRT((P1-P2)/deltaPc) * EXP(5*xFzp) *
  //          ((1-xFzp)/(1-xF))^0.5 * (xF/xFzp)^5 * (xF-xFzp)^1.5
  const deltaP = P1 - P2;
  const term1 = 0.32 * etaTurb;
  const term2 = Math.sqrt(deltaP / deltaPc);
  const term3 = Math.exp(5 * xFzp);
  const term4 = Math.pow((1 - xFzp) / (1 - xF), 0.5);
  const term5 = Math.pow(xF / xFzp, 5);
  const term6 = Math.pow(xF - xFzp, 1.5);

  return term1 * term2 * term3 * term4 * term5 * term6;
}

/**
 * 计算机械功率
 * Wm = m * Uvc² * FL² / 2
 * @param massFlow 质量流量 kg/h
 * @param Uvc 缩流断面流速 m/s
 * @param FL 压力恢复系数
 * @returns 机械功率 W
 */
function calculateMechanicalPower(
  massFlow: number,
  Uvc: number,
  FL: number
): number {
  const m_s = massFlow / 3600;  // kg/h -> kg/s
  return m_s * Uvc * Uvc * FL * FL / 2;
}

/**
 * 获取声功率比
 * @param valveType 阀门类型
 * @returns 声功率比
 */
function getSoundPowerRatio(valveType: 'standard' | 'cage' | 'multistage' = 'standard'): number {
  switch (valveType) {
    case 'cage':
      return NOISE_CONSTANTS.RW_CAGE;
    case 'multistage':
      return NOISE_CONSTANTS.RW_MULTISTAGE;
    default:
      return NOISE_CONSTANTS.RW_STANDARD;
  }
}

/**
 * 计算声功率
 * @param etaTurb 紊流声效系数
 * @param etaCav 空化声效系数
 * @param Wm 机械功率 W
 * @param rw 声功率比
 * @param cavitationState 空化状态
 * @returns 声功率 W
 */
function calculateSoundPower(
  etaTurb: number,
  etaCav: number,
  Wm: number,
  rw: number,
  cavitationState: CavitationState
): number {
  if (cavitationState === 'No Cavitation') {
    // Pure turbulent flow
    return etaTurb * Wm;
  } else {
    // Cavitating flow
    return (etaTurb + etaCav) * Wm * rw;
  }
}

/**
 * 计算Strouhal数
 * 基于Excel公式 E51:
 * Nstr = 0.036*FL²*Kv*Fd^0.75 / (N34*xFzp^1.5*d*d0*(P1-Pv)^0.57)
 * @param FL 压力恢复系数
 * @param Kv 流量系数
 * @param Fd 阀门类型修正系数
 * @param xFzp 有效空化起始点
 * @param d 阀门入口内径 m
 * @param d0 阀座直径 m
 * @param P1 入口压力 Pa
 * @param Pv 饱和蒸汽压 Pa
 * @returns Strouhal数
 */
function calculateStrouhalNumber(
  FL: number,
  Kv: number,
  Fd: number,
  xFzp: number,
  d: number,
  d0: number,
  P1: number,
  Pv: number
): number {
  // Excel公式 E51: Nstr = 0.036*FL²*Kv*Fd^0.75 / (N34*xFzp^1.5*d*d0*(P1-Pv)^0.57)
  const FL2 = FL * FL;
  const numerator = 0.036 * FL2 * Kv * Math.pow(Fd, 0.75);
  const deltaPv = Math.max(1, P1 - Pv);  // 防止负值
  const denominator = NOISE_CONSTANTS.N34 * Math.pow(xFzp, 1.5) * d * d0 * Math.pow(deltaPv, 0.57);

  if (denominator <= 0) return 0.1;  // 默认值
  return numerator / denominator;
}

/**
 * 计算峰值频率 (紊流)
 * 基于Excel公式 E52: fp_turb = Nstr * Uvc / Dj
 * @param Nstr Strouhal数
 * @param Uvc 缩流断面流速 m/s
 * @param Dj 射流直径 m
 * @returns 峰值频率 Hz
 */
function calculatePeakFrequencyTurbulent(Nstr: number, Uvc: number, Dj: number): number {
  if (Dj <= 0) return 1000;  // 默认值
  return Nstr * Uvc / Dj;
}

/**
 * 计算峰值频率 (空化)
 * 基于Excel公式 E53: fp_cav = 6*fp_turb * ((1-xF)/(1-xFzp))² * (xFzp/xF)^2.5
 * @param fpTurb 紊流峰值频率 Hz
 * @param xF 压差比
 * @param xFzp 有效空化起始点
 * @returns 峰值频率 Hz
 */
function calculatePeakFrequencyCavitation(fpTurb: number, xF: number, xFzp: number): number {
  if (xF <= 0 || xFzp <= 0 || xF >= 1) return fpTurb;

  const term1 = Math.pow((1 - xF) / (1 - xFzp), 2);
  const term2 = Math.pow(xFzp / xF, 2.5);
  return 6 * fpTurb * term1 * term2;
}

/**
 * 计算内部声压级
 * 基于Excel公式 E50: Lpi = 10*LOG10(3.2*10^9 * Wa * rhoL * cL / Di²)
 * @param Wa 声功率 W
 * @param rhoL 液体密度 kg/m³
 * @param cL 液体声速 m/s
 * @param Di 管道内径 m
 * @returns 内部声压级 dB
 */
function calculateInternalNoiseLevel(
  Wa: number,
  rhoL: number,
  cL: number,
  Di: number
): number {
  if (Wa <= 0) return NOISE_CONSTANTS.MIN_NOISE;

  // Excel公式: Lpi = 10*LOG10(3.2*10^9 * Wa * rhoL * cL / Di²)
  const Lpi = 10 * Math.log10(NOISE_CONSTANTS.INTERNAL_NOISE_COEF * Wa * rhoL * cL / (Di * Di));
  return Lpi;
}

/**
 * 计算透射损失
 * 基于Excel公式:
 * E55 = -10 - 10*LOG10(cp*rhoP*tp/(rho0*c0*Di))  // 环频率处最小透射损失
 * E56 = -20*LOG10(fr/fp + (fp/fr)^1.5)           // 频率修正
 * E57 = E55 + E56                                 // 总透射损失(紊流)
 * @param tp 管道壁厚 mm
 * @param fp 峰值频率 Hz
 * @param Di 管道内径 mm
 * @param pipeMaterial 管道材料
 * @returns 透射损失 dB
 */
function calculateTransmissionLoss(
  tp: number,
  fp: number,
  Di: number,
  pipeMaterial: 'steel' | 'stainless' = 'steel'
): number {
  const rhoP = getPipeMaterialDensity(pipeMaterial);
  const tp_m = tp / 1000;  // mm -> m
  const Di_m = Di / 1000;  // mm -> m

  // 空气参考值
  const rho0 = NOISE_CONSTANTS.RHO_0;  // 1.293 kg/m³
  const c0 = NOISE_CONSTANTS.C0;        // 343 m/s
  const cp = NOISE_CONSTANTS.CP_PIPE;   // 5000 m/s 管壁纵波速度

  // 环频率 fr (E54)
  const fr = cp / (Math.PI * Di_m);

  // 环频率处最小透射损失 TLfr (E55)
  // TLfr = -10 - 10*LOG10(cp*rhoP*tp/(rho0*c0*Di))
  const TLfr = -10 - 10 * Math.log10((cp * rhoP * tp_m) / (rho0 * c0 * Di_m));

  // 频率修正 deltaTL (E56)
  // deltaTL = -20*LOG10(fr/fp + (fp/fr)^1.5)
  const deltaTL = -20 * Math.log10(fr / fp + Math.pow(fp / fr, 1.5));

  // 总透射损失 (E57)
  const TL = TLfr + deltaTL;

  return TL;
}

/**
 * 计算空化透射损失修正
 * 基于Excel公式 E59:
 * TLcav = TL_turb + 10*LOG10(250*(fp_cav^1.5/fp_turb²)*(etaCav/(etaTurb+etaCav)))
 * @param TL_turb 紊流透射损失 dB
 * @param fpTurb 紊流峰值频率 Hz
 * @param fpCav 空化峰值频率 Hz
 * @param etaTurb 紊流声效系数
 * @param etaCav 空化声效系数
 * @returns 空化透射损失 dB
 */
function calculateCavitationTransmissionLoss(
  TL_turb: number,
  fpTurb: number,
  fpCav: number,
  etaTurb: number,
  etaCav: number
): number {
  if (fpTurb <= 0 || etaTurb + etaCav <= 0) return TL_turb;

  // E59: TLcav = TL_turb + 10*LOG10(250*(fp_cav^1.5/fp_turb²)*(etaCav/(etaTurb+etaCav)))
  const term1 = 250 * Math.pow(fpCav, 1.5) / (fpTurb * fpTurb);
  const term2 = etaCav / (etaTurb + etaCav);
  const correction = 10 * Math.log10(term1 * term2);

  return TL_turb + correction;
}

/**
 * 计算外部噪音级
 * Lpe = Lpi - TL + 3 (距阀门1m处)
 * @param Lpi 内部声功率级 dB
 * @param TL 透射损失 dB
 * @returns 外部噪音级 dB
 */
function calculateExternalNoiseLevel(Lpi: number, TL: number): number {
  // +3 dB 为距离修正 (距阀门1m处)
  return Lpi - TL + 3;
}

/**
 * 液体噪音计算主函数
 * 基于Excel公式精确实现
 * @param input 噪音计算输入参数
 * @returns 噪音计算结果
 */
export function calculateLiquidNoise(input: NoiseInput): NoiseResult {
  const warnings: string[] = [];

  // 提取参数
  const {
    P1, P2, deltaP,
    massFlow, volumeFlow,
    density: rhoL,
    Pv = 2.34,  // 默认20℃水的饱和蒸汽压 KPa
    soundSpeed: cL = NOISE_CONSTANTS.WATER_SOUND_SPEED,
    Kv, Cv, FL,
    Fd = 0.42,
    Di, tp, d,
    pipeMaterial = 'steel'
  } = input;

  // 计算质量流量 (如果只提供体积流量)
  const mFlow = massFlow || (volumeFlow ? volumeFlow * rhoL : 0);
  if (mFlow === 0) {
    throw new Error('必须提供质量流量或体积流量');
  }

  // 计算压差比 xF (E28)
  const xF = (P1 - P2) / (P1 - Pv);

  // 计算空化起始压差比 xFz (E35)
  const xFz = input.xFz || calculateXFz(Cv || Kv, Fd, FL);

  // 入口压力修正的xFzp (E38)
  // xFzp = xFz * (6×10⁵/P1)^0.125
  const P1_Pa = P1 * 1000;  // KPa -> Pa
  const xFzp = xFz * Math.pow(6e5 / P1_Pa, 0.125);

  // 判定空化状态 (E3, E42)
  const cavitationState = determineCavitationState(xF, xFzp, FL);
  const isCavitation = cavitationState !== 'No Cavitation' && cavitationState !== 'Flashing';

  // Flashing state - cannot calculate noise
  if (cavitationState === 'Flashing') {
    warnings.push('Medium is flashing, noise calculation not accurate');
    return {
      noiseLevel: 0,
      flowState: 'Flashing',
      cavitationState,
      intermediate: {
        deltaPc: 0, Uvc: 0, cL, etaTurb: 0, etaCav: 0, eta: 0,
        Wm: 0, Wa: 0, rw: 0.25, Lpi: 0, TL: 0, Lpe: 0, fp: 0, xF, xFz
      },
      peakFrequency: 0,
      warnings
    };
  }

  // 计算有效压差 (E32)
  const deltaPc = calculateEffectiveDeltaP(deltaP, FL, P1, Pv);

  // 计算缩流断面流速 (E40)
  const Uvc = calculateVenaContractaVelocity(FL, deltaPc, rhoL);

  // 计算紊流声效系数 (E44)
  const etaTurb = calculateTurbulentEfficiency(Uvc, cL);

  // 计算空化声效系数 (E45)
  let etaCav = 0;
  if (isCavitation) {
    etaCav = calculateCavitationEfficiency(etaTurb, xF, xFzp, P1, P2, deltaPc);
  }

  // 总声效系数
  const eta = etaTurb + etaCav;

  // 计算机械功率 (E41)
  const Wm = calculateMechanicalPower(mFlow, Uvc, FL);

  // 获取声功率比 (E46)
  const rw = getSoundPowerRatio('standard');

  // 计算声功率 (E47/E48/E49)
  const Wa = calculateSoundPower(etaTurb, etaCav, Wm, rw, cavitationState);

  // 计算射流直径 Dj (E39)
  const N14 = NOISE_CONSTANTS.N14 || 0.0049;
  const d_m = d / 1000;  // mm -> m
  const d0 = input.d / 1000;  // 阀座直径 m
  const Dj = N14 * Fd * Math.sqrt((Cv || Kv) * FL);

  // 计算Strouhal数 (E51)
  const Nstr = calculateStrouhalNumber(FL, Cv || Kv, Fd, xFzp, d_m, d0, P1_Pa, Pv * 1000);

  // 计算峰值频率 (E52/E53)
  const fpTurb = calculatePeakFrequencyTurbulent(Nstr, Uvc, Dj);
  const fpCav = isCavitation ? calculatePeakFrequencyCavitation(fpTurb, xF, xFzp) : fpTurb;
  const fp = isCavitation ? fpCav : fpTurb;

  // 确保频率有效
  const fpValid = Math.max(100, Math.min(20000, fp));

  // 管道内径转为m
  const Di_m = Di / 1000;

  // 计算内部声压级 (E50)
  const Lpi = calculateInternalNoiseLevel(Wa, rhoL, cL, Di_m);

  // 计算透射损失 (E57/E59)
  const TL_turb = calculateTransmissionLoss(tp, fpValid, Di, pipeMaterial);
  const TL = isCavitation
    ? calculateCavitationTransmissionLoss(TL_turb, fpTurb, fpCav, etaTurb, etaCav)
    : TL_turb;

  // 距离修正 (E58/E60/E69)
  // Lpe,1m = Lpi + TL - 10*LOG10((Di+2*tp+2)/(Di+2*tp))
  const tp_m = tp / 1000;
  const distanceCorrection = 10 * Math.log10((Di_m + 2 * tp_m + 0.002) / (Di_m + 2 * tp_m));
  const Lpe = Lpi + TL - distanceCorrection;

  // 最终噪音级
  let noiseLevel = Lpe;

  // 限制范围
  noiseLevel = Math.max(NOISE_CONSTANTS.MIN_NOISE, Math.min(NOISE_CONSTANTS.MAX_NOISE, noiseLevel));

  // Add warnings
  if (cavitationState === 'Constant Cavitation') {
    warnings.push('Valve is in constant cavitation state, may cause valve damage');
  }
  if (noiseLevel > 85) {
    warnings.push(`Noise level ${noiseLevel.toFixed(1)} dBA exceeds 85dBA, noise reduction measures needed`);
  }
  if (Uvc > 30) {
    warnings.push(`Vena contracta velocity ${Uvc.toFixed(1)} m/s is high, may cause severe erosion`);
  }

  // 构建中间计算值
  const intermediate: LiquidNoiseIntermediate = {
    deltaPc,
    Uvc,
    cL,
    etaTurb,
    etaCav,
    eta,
    Wm,
    Wa,
    rw,
    Lpi,
    TL,
    Lpe,
    fp: fpValid,
    xF,
    xFz
  };

  return {
    noiseLevel: Math.round(noiseLevel * 10) / 10,
    flowState: cavitationState === 'No Cavitation' ? 'Turbulent' : cavitationState,
    cavitationState,
    intermediate,
    peakFrequency: Math.round(fpValid),
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Get cavitation state description
 */
export function getCavitationStateDescription(state: CavitationState): string {
  const descriptions: Record<CavitationState, string> = {
    'No Cavitation': 'Pressure ratio below cavitation inception, flow is stable',
    'Incipient Cavitation': 'Cavitation bubbles starting to form, noise increasing',
    'Constant Cavitation': 'Stable cavitation state, significant noise and vibration',
    'Flashing': 'Medium vaporizing, severe noise and vibration'
  };
  return descriptions[state];
}
