/**
 * 单位转换工具
 */

import { CONSTANTS, getPipeSpec } from '../constants/index.js';
import type {
  PressureUnit,
  TemperatureUnit,
  FlowUnit,
  DensityUnit,
  ViscosityUnit,
  ViscosityType,
  FluidType
} from '../types/index.js';

/**
 * 压力转换 - 转为绝对压力 KPa
 */
export function convertPressureToKPaAbs(value: number, unit: PressureUnit): number {
  switch (unit) {
    case 'MPa(G)':
      return value * 1000 + 100;  // 表压转绝对压力
    case 'MPa(A)':
      return value * 1000;
    case 'KPa(G)':
      return value + 100;
    case 'KPa(A)':
      return value;
    case 'bar(G)':
      return value * 100 + 100;
    case 'bar(A)':
      return value * 100;
    default:
      throw new Error(`不支持的压力单位: ${unit}`);
  }
}

/**
 * 温度转换 - 转为开尔文 K
 */
export function convertTemperatureToK(value: number, unit: TemperatureUnit): number {
  switch (unit) {
    case '℃':
      return value + CONSTANTS.STD_TEMP;
    case 'K':
      return value;
    case 'F':
      return (value - 32) / 1.8 + CONSTANTS.STD_TEMP;
    default:
      throw new Error(`不支持的温度单位: ${unit}`);
  }
}

/**
 * 温度转换 - 转为摄氏度 ℃
 */
export function convertTemperatureToCelsius(value: number, unit: TemperatureUnit): number {
  switch (unit) {
    case '℃':
      return value;
    case 'K':
      return value - CONSTANTS.STD_TEMP;
    case 'F':
      return (value - 32) / 1.8;
    default:
      throw new Error(`不支持的温度单位: ${unit}`);
  }
}

/**
 * 密度转换 - 转为 Kg/m³
 */
export function convertDensityToKgM3(value: number, unit: DensityUnit): number {
  switch (unit) {
    case 'Kg/m3':
      return value;
    case 'g/cm3':
      return value * 1000;
    case 'Kg/Nm3':
      return value; // 标准状态密度，需要进一步处理
    default:
      throw new Error(`不支持的密度单位: ${unit}`);
  }
}

/**
 * 气体密度转换 - 标准状态到实际状态
 * @param rhoN 标准状态密度 Kg/Nm³
 * @param P1 绝对压力 KPa
 * @param T1 绝对温度 K
 * @returns 实际密度 Kg/m³
 */
export function convertGasDensityToActual(rhoN: number, P1: number, T1: number): number {
  return rhoN * P1 * CONSTANTS.STD_TEMP / (CONSTANTS.STD_PRESSURE * T1);
}

/**
 * 粘度转换 - 转为运动粘度 m²/s
 * @param value 粘度值
 * @param unit 粘度单位
 * @param type 粘度类型
 * @param density 密度 kg/m³ (动力粘度转换需要)
 */
export function convertViscosityToM2S(
  value: number,
  unit: ViscosityUnit,
  type: ViscosityType,
  density: number
): number {
  // 运动粘度
  if (type === '运动粘度 v') {
    switch (unit) {
      case 'm2/s':
        return value;
      case 'mm2/s':
      case 'cSt':
        return value * 1e-6;
      case 'St':
        return value * 1e-4;
      default:
        throw new Error(`运动粘度不支持单位: ${unit}`);
    }
  }

  // 动力粘度 -> 运动粘度
  if (type === '动力粘度 u' || type === '粘度') {
    let dynamicViscosityPaS: number;
    switch (unit) {
      case 'Pa.S':
        dynamicViscosityPaS = value;
        break;
      case 'mPa.S':
      case 'cP':
        dynamicViscosityPaS = value / 1000;
        break;
      default:
        throw new Error(`动力粘度不支持单位: ${unit}`);
    }
    // ν = μ / ρ
    return dynamicViscosityPaS / density;
  }

  throw new Error(`不支持的粘度类型: ${type}`);
}

/**
 * 液体体积流量转换 - 转为 m³/h
 */
export function convertLiquidFlowToM3h(
  value: number,
  unit: FlowUnit,
  density: number
): number {
  switch (unit) {
    case 'm3/h':
      return value;
    case 'Kg/h':
      return value / density;
    case 'Kg/s':
      return value / density * 3600;
    case 't/h':
      return value * 1000 / density;
    case 't/s':
      return value * 1000 / density * 3600;
    default:
      throw new Error(`液体流量不支持单位: ${unit}`);
  }
}

/**
 * 气体标准体积流量转换 - 转为 Nm³/h
 */
export function convertGasFlowToNm3h(
  value: number,
  unit: FlowUnit,
  rhoN: number,  // 标准状态密度 Kg/Nm³
  P1: number,    // 绝对压力 KPa
  T1: number     // 绝对温度 K
): number {
  switch (unit) {
    case 'Nm3/h':
      return value;
    case 'Kg/h':
      return value / rhoN;
    case 'Kg/s':
      return value / rhoN * 3600;
    case 't/h':
      return value * 1000 / rhoN;
    case 't/s':
      return value * 1000 / rhoN * 3600;
    case 'm3/h':
      // 工况体积 -> 标准体积
      return value * P1 * CONSTANTS.STD_TEMP / (CONSTANTS.STD_PRESSURE * T1);
    default:
      throw new Error(`气体流量不支持单位: ${unit}`);
  }
}

/**
 * 蒸汽质量流量转换 - 转为 Kg/h
 */
export function convertSteamFlowToKgh(
  value: number,
  unit: FlowUnit,
  density: number  // 蒸汽密度 Kg/m³
): number {
  switch (unit) {
    case 'Kg/h':
      return value;
    case 'Kg/s':
      return value * 3600;
    case 't/h':
      return value * 1000;
    case 't/s':
      return value * 1000 * 3600;
    case 'm3/h':
      return value * density;
    default:
      throw new Error(`蒸汽流量不支持单位: ${unit}`);
  }
}

/**
 * 计算管道内径
 * @param outerDiameter 外径 mm
 * @param wallThickness 壁厚 mm
 */
export function calcInnerDiameter(outerDiameter: number, wallThickness: number): number {
  return outerDiameter - wallThickness * 2;
}

/**
 * 获取管道内径（自动查表或计算）
 */
export function getPipeInnerDiameter(
  dn: number,
  outerDiameter?: number,
  wallThickness?: number
): number {
  if (outerDiameter && wallThickness) {
    return calcInnerDiameter(outerDiameter, wallThickness);
  }

  const spec = getPipeSpec(dn);
  if (spec) {
    return calcInnerDiameter(spec.outerDiameter, spec.wallThickness);
  }

  // 如果没有规格数据，假设内径等于DN
  return dn;
}

/**
 * Kv 转 Cv
 */
export function kvToCv(kv: number): number {
  return kv * CONSTANTS.KV_TO_CV;
}

/**
 * Cv 转 Kv
 */
export function cvToKv(cv: number): number {
  return cv / CONSTANTS.KV_TO_CV;
}

/**
 * 计算相对密度（比重）
 */
export function calcRelativeDensity(density: number): number {
  return density / CONSTANTS.WATER_DENSITY;
}

/**
 * 计算饱和蒸汽压（安托因方程，水）
 * @param tempCelsius 温度 ℃
 * @returns 饱和蒸汽压 KPa
 */
export function calcSaturationPressure(tempCelsius: number): number {
  const { A, B, C } = CONSTANTS.ANTOINE;
  // log10(Pv) = A - B/(C + T)
  const logPv = A - B / (C + tempCelsius);
  return Math.pow(10, logPv);
}

/**
 * 计算饱和温度（安托因方程反算，水）
 * @param pressureKPa 绝对压力 KPa
 * @returns 饱和温度 ℃
 */
export function calcSaturationTemperature(pressureKPa: number): number {
  if (pressureKPa <= 0) return NaN;
  const { A, B, C } = CONSTANTS.ANTOINE;
  // T = B/(A - log10(Pv)) - C
  return B / (A - Math.log10(pressureKPa)) - C;
}

/**
 * 出口流速计算
 * @param flowM3h 体积流量 m³/h
 * @param diameterMm 管道内径 mm
 * @returns 流速 m/s
 */
export function calcVelocity(flowM3h: number, diameterMm: number): number {
  const areaM2 = Math.PI * Math.pow(diameterMm / 1000, 2) / 4;
  return flowM3h / 3600 / areaM2;
}
