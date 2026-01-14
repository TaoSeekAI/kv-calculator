/**
 * 单位转换工具
 */
import type { PressureUnit, TemperatureUnit, FlowUnit, DensityUnit, ViscosityUnit, ViscosityType } from '../types/index.js';
/**
 * 压力转换 - 转为绝对压力 KPa
 */
export declare function convertPressureToKPaAbs(value: number, unit: PressureUnit): number;
/**
 * 温度转换 - 转为开尔文 K
 */
export declare function convertTemperatureToK(value: number, unit: TemperatureUnit): number;
/**
 * 温度转换 - 转为摄氏度 ℃
 */
export declare function convertTemperatureToCelsius(value: number, unit: TemperatureUnit): number;
/**
 * 密度转换 - 转为 Kg/m³
 */
export declare function convertDensityToKgM3(value: number, unit: DensityUnit): number;
/**
 * 气体密度转换 - 标准状态到实际状态
 * @param rhoN 标准状态密度 Kg/Nm³
 * @param P1 绝对压力 KPa
 * @param T1 绝对温度 K
 * @returns 实际密度 Kg/m³
 */
export declare function convertGasDensityToActual(rhoN: number, P1: number, T1: number): number;
/**
 * 粘度转换 - 转为运动粘度 m²/s
 * @param value 粘度值
 * @param unit 粘度单位
 * @param type 粘度类型
 * @param density 密度 kg/m³ (动力粘度转换需要)
 */
export declare function convertViscosityToM2S(value: number, unit: ViscosityUnit, type: ViscosityType, density: number): number;
/**
 * 液体体积流量转换 - 转为 m³/h
 */
export declare function convertLiquidFlowToM3h(value: number, unit: FlowUnit, density: number): number;
/**
 * 气体标准体积流量转换 - 转为 Nm³/h
 */
export declare function convertGasFlowToNm3h(value: number, unit: FlowUnit, rhoN: number, // 标准状态密度 Kg/Nm³
P1: number, // 绝对压力 KPa
T1: number): number;
/**
 * 蒸汽质量流量转换 - 转为 Kg/h
 */
export declare function convertSteamFlowToKgh(value: number, unit: FlowUnit, density: number): number;
/**
 * 计算管道内径
 * @param outerDiameter 外径 mm
 * @param wallThickness 壁厚 mm
 */
export declare function calcInnerDiameter(outerDiameter: number, wallThickness: number): number;
/**
 * 获取管道内径（自动查表或计算）
 */
export declare function getPipeInnerDiameter(dn: number, outerDiameter?: number, wallThickness?: number): number;
/**
 * Kv 转 Cv
 */
export declare function kvToCv(kv: number): number;
/**
 * Cv 转 Kv
 */
export declare function cvToKv(cv: number): number;
/**
 * 计算相对密度（比重）
 */
export declare function calcRelativeDensity(density: number): number;
/**
 * 计算饱和蒸汽压（安托因方程，水）
 * @param tempCelsius 温度 ℃
 * @returns 饱和蒸汽压 KPa
 */
export declare function calcSaturationPressure(tempCelsius: number): number;
/**
 * 计算饱和温度（安托因方程反算，水）
 * @param pressureKPa 绝对压力 KPa
 * @returns 饱和温度 ℃
 */
export declare function calcSaturationTemperature(pressureKPa: number): number;
/**
 * 出口流速计算
 * @param flowM3h 体积流量 m³/h
 * @param diameterMm 管道内径 mm
 * @returns 流速 m/s
 */
export declare function calcVelocity(flowM3h: number, diameterMm: number): number;
