/**
 * Unit Conversion Utilities
 */
import { CONSTANTS, getPipeSpec } from '../constants/index.js';
/**
 * Pressure conversion - Convert to absolute pressure KPa
 */
export function convertPressureToKPaAbs(value, unit) {
    switch (unit) {
        case 'MPa(G)':
            return value * 1000 + 100; // Gauge to absolute pressure
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
            throw new Error(`Unsupported pressure unit: ${unit}`);
    }
}
/**
 * Temperature conversion - Convert to Kelvin K
 */
export function convertTemperatureToK(value, unit) {
    switch (unit) {
        case '℃':
            return value + CONSTANTS.STD_TEMP;
        case 'K':
            return value;
        case 'F':
            return (value - 32) / 1.8 + CONSTANTS.STD_TEMP;
        default:
            throw new Error(`Unsupported temperature unit: ${unit}`);
    }
}
/**
 * Temperature conversion - Convert to Celsius ℃
 */
export function convertTemperatureToCelsius(value, unit) {
    switch (unit) {
        case '℃':
            return value;
        case 'K':
            return value - CONSTANTS.STD_TEMP;
        case 'F':
            return (value - 32) / 1.8;
        default:
            throw new Error(`Unsupported temperature unit: ${unit}`);
    }
}
/**
 * Density conversion - Convert to Kg/m³
 */
export function convertDensityToKgM3(value, unit) {
    switch (unit) {
        case 'Kg/m3':
            return value;
        case 'g/cm3':
            return value * 1000;
        case 'Kg/Nm3':
            return value; // Standard state density, requires further processing
        default:
            throw new Error(`Unsupported density unit: ${unit}`);
    }
}
/**
 * Gas density conversion - Standard state to actual state
 * @param rhoN Standard state density Kg/Nm³
 * @param P1 Absolute pressure KPa
 * @param T1 Absolute temperature K
 * @returns Actual density Kg/m³
 */
export function convertGasDensityToActual(rhoN, P1, T1) {
    return rhoN * P1 * CONSTANTS.STD_TEMP / (CONSTANTS.STD_PRESSURE * T1);
}
/**
 * Viscosity conversion - Convert to kinematic viscosity m²/s
 * @param value Viscosity value
 * @param unit Viscosity unit
 * @param type Viscosity type
 * @param density Density kg/m³ (required for dynamic viscosity conversion)
 */
export function convertViscosityToM2S(value, unit, type, density) {
    // Kinematic viscosity
    if (type === 'Kinematic Viscosity') {
        switch (unit) {
            case 'm2/s':
                return value;
            case 'mm2/s':
            case 'cSt':
                return value * 1e-6;
            case 'St':
                return value * 1e-4;
            default:
                throw new Error(`Kinematic viscosity does not support unit: ${unit}`);
        }
    }
    // Dynamic viscosity -> Kinematic viscosity
    if (type === 'Dynamic Viscosity' || type === 'Viscosity') {
        let dynamicViscosityPaS;
        switch (unit) {
            case 'Pa.S':
                dynamicViscosityPaS = value;
                break;
            case 'mPa.S':
            case 'cP':
                dynamicViscosityPaS = value / 1000;
                break;
            default:
                throw new Error(`Dynamic viscosity does not support unit: ${unit}`);
        }
        // ν = μ / ρ
        return dynamicViscosityPaS / density;
    }
    throw new Error(`Unsupported viscosity type: ${type}`);
}
/**
 * Liquid volume flow rate conversion - Convert to m³/h
 */
export function convertLiquidFlowToM3h(value, unit, density) {
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
            throw new Error(`Liquid flow does not support unit: ${unit}`);
    }
}
/**
 * Gas standard volume flow rate conversion - Convert to Nm³/h
 */
export function convertGasFlowToNm3h(value, unit, rhoN, // Standard state density Kg/Nm³
P1, // Absolute pressure KPa
T1 // Absolute temperature K
) {
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
            // Actual volume -> Standard volume
            return value * P1 * CONSTANTS.STD_TEMP / (CONSTANTS.STD_PRESSURE * T1);
        default:
            throw new Error(`Gas flow does not support unit: ${unit}`);
    }
}
/**
 * Steam mass flow rate conversion - Convert to Kg/h
 */
export function convertSteamFlowToKgh(value, unit, density // Steam density Kg/m³
) {
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
            throw new Error(`Steam flow does not support unit: ${unit}`);
    }
}
/**
 * Calculate pipe inner diameter
 * @param outerDiameter Outer diameter mm
 * @param wallThickness Wall thickness mm
 */
export function calcInnerDiameter(outerDiameter, wallThickness) {
    return outerDiameter - wallThickness * 2;
}
/**
 * Get pipe inner diameter (auto lookup or calculate)
 */
export function getPipeInnerDiameter(dn, outerDiameter, wallThickness) {
    if (outerDiameter && wallThickness) {
        return calcInnerDiameter(outerDiameter, wallThickness);
    }
    const spec = getPipeSpec(dn);
    if (spec) {
        return calcInnerDiameter(spec.outerDiameter, spec.wallThickness);
    }
    // If no specification data, assume inner diameter equals DN
    return dn;
}
/**
 * Kv to Cv conversion
 */
export function kvToCv(kv) {
    return kv * CONSTANTS.KV_TO_CV;
}
/**
 * Cv to Kv conversion
 */
export function cvToKv(cv) {
    return cv / CONSTANTS.KV_TO_CV;
}
/**
 * Calculate relative density (specific gravity)
 */
export function calcRelativeDensity(density) {
    return density / CONSTANTS.WATER_DENSITY;
}
/**
 * Calculate saturation vapor pressure (Antoine equation, water)
 * @param tempCelsius Temperature ℃
 * @returns Saturation vapor pressure KPa
 */
export function calcSaturationPressure(tempCelsius) {
    const { A, B, C } = CONSTANTS.ANTOINE;
    // log10(Pv) = A - B/(C + T)
    const logPv = A - B / (C + tempCelsius);
    return Math.pow(10, logPv);
}
/**
 * Calculate saturation temperature (inverse Antoine equation, water)
 * @param pressureKPa Absolute pressure KPa
 * @returns Saturation temperature ℃
 */
export function calcSaturationTemperature(pressureKPa) {
    if (pressureKPa <= 0)
        return NaN;
    const { A, B, C } = CONSTANTS.ANTOINE;
    // T = B/(A - log10(Pv)) - C
    return B / (A - Math.log10(pressureKPa)) - C;
}
/**
 * Outlet velocity calculation
 * @param flowM3h Volume flow rate m³/h
 * @param diameterMm Pipe inner diameter mm
 * @returns Velocity m/s
 */
export function calcVelocity(flowM3h, diameterMm) {
    const areaM2 = Math.PI * Math.pow(diameterMm / 1000, 2) / 4;
    return flowM3h / 3600 / areaM2;
}
