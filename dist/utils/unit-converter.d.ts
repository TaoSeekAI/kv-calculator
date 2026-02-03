/**
 * Unit Conversion Utilities
 */
import type { PressureUnit, TemperatureUnit, FlowUnit, DensityUnit, ViscosityUnit, ViscosityType } from '../types/index.js';
/**
 * Pressure conversion - Convert to absolute pressure KPa
 */
export declare function convertPressureToKPaAbs(value: number, unit: PressureUnit): number;
/**
 * Temperature conversion - Convert to Kelvin K
 */
export declare function convertTemperatureToK(value: number, unit: TemperatureUnit): number;
/**
 * Temperature conversion - Convert to Celsius ℃
 */
export declare function convertTemperatureToCelsius(value: number, unit: TemperatureUnit): number;
/**
 * Density conversion - Convert to Kg/m³
 */
export declare function convertDensityToKgM3(value: number, unit: DensityUnit): number;
/**
 * Gas density conversion - Standard state to actual state
 * @param rhoN Standard state density Kg/Nm³
 * @param P1 Absolute pressure KPa
 * @param T1 Absolute temperature K
 * @returns Actual density Kg/m³
 */
export declare function convertGasDensityToActual(rhoN: number, P1: number, T1: number): number;
/**
 * Viscosity conversion - Convert to kinematic viscosity m²/s
 * @param value Viscosity value
 * @param unit Viscosity unit
 * @param type Viscosity type
 * @param density Density kg/m³ (required for dynamic viscosity conversion)
 */
export declare function convertViscosityToM2S(value: number, unit: ViscosityUnit, type: ViscosityType, density: number): number;
/**
 * Liquid volume flow rate conversion - Convert to m³/h
 */
export declare function convertLiquidFlowToM3h(value: number, unit: FlowUnit, density: number): number;
/**
 * Gas standard volume flow rate conversion - Convert to Nm³/h
 */
export declare function convertGasFlowToNm3h(value: number, unit: FlowUnit, rhoN: number, // Standard state density Kg/Nm³
P1: number, // Absolute pressure KPa
T1: number): number;
/**
 * Steam mass flow rate conversion - Convert to Kg/h
 */
export declare function convertSteamFlowToKgh(value: number, unit: FlowUnit, density: number): number;
/**
 * Calculate pipe inner diameter
 * @param outerDiameter Outer diameter mm
 * @param wallThickness Wall thickness mm
 */
export declare function calcInnerDiameter(outerDiameter: number, wallThickness: number): number;
/**
 * Get pipe inner diameter (auto lookup or calculate)
 */
export declare function getPipeInnerDiameter(dn: number, outerDiameter?: number, wallThickness?: number): number;
/**
 * Kv to Cv conversion
 */
export declare function kvToCv(kv: number): number;
/**
 * Cv to Kv conversion
 */
export declare function cvToKv(cv: number): number;
/**
 * Calculate relative density (specific gravity)
 */
export declare function calcRelativeDensity(density: number): number;
/**
 * Calculate saturation vapor pressure (Antoine equation, water)
 * @param tempCelsius Temperature ℃
 * @returns Saturation vapor pressure KPa
 */
export declare function calcSaturationPressure(tempCelsius: number): number;
/**
 * Calculate saturation temperature (inverse Antoine equation, water)
 * @param pressureKPa Absolute pressure KPa
 * @returns Saturation temperature ℃
 */
export declare function calcSaturationTemperature(pressureKPa: number): number;
/**
 * Outlet velocity calculation
 * @param flowM3h Volume flow rate m³/h
 * @param diameterMm Pipe inner diameter mm
 * @returns Velocity m/s
 */
export declare function calcVelocity(flowM3h: number, diameterMm: number): number;
