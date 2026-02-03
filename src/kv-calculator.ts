/**
 * Kv Comprehensive Calculator
 * Integrates Kv calculation for liquids, gases, and steam
 */

import { CONSTANTS, PIPE_SPECS } from './constants/index.js';
import type {
  KvInput,
  KvResult,
  IntermediateValues,
  FlowState,
  TurbulenceState,
  FluidState
} from './types/index.js';
import {
  convertPressureToKPaAbs,
  convertTemperatureToK,
  convertTemperatureToCelsius,
  convertDensityToKgM3,
  convertLiquidFlowToM3h,
  convertGasFlowToNm3h,
  convertSteamFlowToKgh,
  convertViscosityToM2S,
  convertGasDensityToActual,
  getPipeInnerDiameter,
  calcRelativeDensity,
  calcSaturationPressure,
  calcSaturationTemperature,
  calcVelocity,
  kvToCv
} from './utils/unit-converter.js';
import { calculateLiquidKv, calcFF, calcSumK, calcFP, calcFLP, calcXF, calcXFz, determineFluidState } from './calculators/liquid.js';
import { calculateGasKv, calcFgamma, calcX } from './calculators/gas.js';
import { calculateSteamKv } from './calculators/steam.js';
import { calculateReynolds } from './calculators/reynolds.js';
import { calcValveOpening, validateOpening } from './calculators/valve-opening.js';
import { calculateGasNoise } from './calculators/gas-noise.js';
import { calculateLiquidNoise } from './calculators/liquid-noise.js';
import type { NoiseInput, NoiseResult } from './calculators/noise/types.js';

/**
 * Kv Calculator Class
 */
export class KvCalculator {
  /**
   * Comprehensive Kv calculation
   */
  calculate(input: KvInput): KvResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Unit conversion
    const P1Abs = convertPressureToKPaAbs(input.P1, input.pressureUnit);
    const P2Abs = convertPressureToKPaAbs(input.P2, input.pressureUnit);
    const deltaP = P1Abs - P2Abs;
    const T1 = convertTemperatureToK(input.temperature, input.tempUnit);
    const tempCelsius = convertTemperatureToCelsius(input.temperature, input.tempUnit);

    // Pressure validation
    if (P1Abs <= 0) errors.push('Inlet pressure must be greater than 0');
    if (P2Abs < 0) errors.push('Outlet pressure cannot be negative');
    if (deltaP <= 0) errors.push('Inlet pressure must be greater than outlet pressure');

    // Density conversion
    const densityKgM3 = convertDensityToKgM3(input.density, input.densityUnit);

    // Valve diameter
    const d = input.seatSize || input.DN;

    // Pipe inner diameter
    // When seatSize equals DN, Excel uses DN as D1/D2 (assuming no reducers)
    const seatEqualsNominal = !input.seatSize || input.seatSize === input.DN;
    const D1 = seatEqualsNominal ? d : getPipeInnerDiameter(input.DN, input.D1w, input.D1T);
    const D2 = seatEqualsNominal ? d : getPipeInnerDiameter(input.DN, input.D2w, input.D2T);

    // Determine if there are fittings
    const hasFittings = d !== D1 || d !== D2;

    // Viscosity conversion
    const kinematicViscosity = input.viscosity
      ? convertViscosityToM2S(
          input.viscosity,
          input.viscosityUnit || 'cP',
          input.viscosityType || 'Viscosity',
          densityKgM3
        )
      : CONSTANTS.DEFAULT.VISCOSITY / 1000 / densityKgM3; // Default 1cP

    // Default values
    const Fd = input.Fd ?? CONSTANTS.DEFAULT.FD;
    const Z = input.Z ?? CONSTANTS.DEFAULT.Z;
    const gamma = input.gamma ?? CONSTANTS.DEFAULT.GAMMA;
    const Pc = input.Pc ?? CONSTANTS.WATER_CRITICAL_PRESSURE;

    // 2. Calculate based on fluid type
    let calculatedKv: number;
    let flowState: FlowState = 'Non-choked';
    let turbulenceState: TurbulenceState = 'Turbulent';
    let fluidState: FluidState | undefined;
    let usedFormula: string = '';

    // Intermediate values
    const sumK = calcSumK(d, D1, D2);
    const Ci = input.ratedKv * 1.3;
    let FP = calcFP(sumK, Ci, d);
    let FLP = calcFLP(input.FL, sumK, Ci, d);
    let Rev = 0;
    let FR = 1;
    let lambda = 0;
    let relativeDensity: number | undefined;
    let FF: number | undefined;
    let Pv: number | undefined;
    let xF: number | undefined;
    let x: number | undefined;
    let Fgamma: number | undefined;
    let Y: number | undefined;
    let saturationTemp: number | undefined;
    let volumeFlowM3h: number | undefined;
    let massFlowKgh: number | undefined;
    let normalFlowNm3h: number | undefined;

    switch (input.fluidType) {
      case 'Liquid': {
        // Liquid calculation
        relativeDensity = calcRelativeDensity(densityKgM3);
        Pv = calcSaturationPressure(tempCelsius);
        FF = calcFF(Pv, Pc);
        saturationTemp = calcSaturationTemperature(P1Abs);

        // Temperature validation
        if (tempCelsius > saturationTemp) {
          errors.push('Medium temperature is above saturation temperature');
        }

        // Pressure validation
        if (P1Abs <= Pv) {
          errors.push('Inlet pressure is below vapor pressure');
        }

        // Flow conversion
        volumeFlowM3h = convertLiquidFlowToM3h(input.flowRate, input.flowUnit, densityKgM3);
        massFlowKgh = volumeFlowM3h * densityKgM3;

        // Use simplified calculation for initial Kv for Reynolds number calculation
        const C_initial = volumeFlowM3h / CONSTANTS.N1 * Math.sqrt(relativeDensity / deltaP);

        // Calculate Reynolds number
        const reynoldsResult = calculateReynolds({
          Q: volumeFlowM3h,
          nu: kinematicViscosity,
          C: C_initial,
          FL: input.FL,
          Fd,
          d,
          D: D1,
          sumK
        });
        Rev = reynoldsResult.Rev;
        FR = reynoldsResult.FR;
        lambda = reynoldsResult.lambda;
        turbulenceState = reynoldsResult.turbulenceState;

        // Liquid Kv calculation
        const liquidResult = calculateLiquidKv({
          Q: volumeFlowM3h,
          P1: P1Abs,
          P2: P2Abs,
          density: densityKgM3,
          Pv,
          Pc,
          FL: input.FL,
          d,
          D1,
          D2,
          Fd,
          ratedKv: input.ratedKv,
          FR
        });

        calculatedKv = liquidResult.kv;
        flowState = liquidResult.flowState;
        fluidState = liquidResult.fluidState;
        usedFormula = liquidResult.usedFormula;
        xF = liquidResult.intermediate.xF;

        // Update FP/FLP
        FP = liquidResult.intermediate.FP;
        FLP = liquidResult.intermediate.FLP;
        break;
      }

      case 'Gas': {
        // Gas standard density calculation
        const rhoN = input.densityUnit === 'Kg/Nm3'
          ? input.density
          : convertGasDensityToActual(input.density, CONSTANTS.STD_PRESSURE, CONSTANTS.STD_TEMP);

        // Flow conversion
        normalFlowNm3h = convertGasFlowToNm3h(
          input.flowRate,
          input.flowUnit,
          rhoN,
          P1Abs,
          T1
        );

        // Molecular weight
        const M = input.molecularWeight || (rhoN * 22.4);

        // Gas Kv calculation
        const gasResult = calculateGasKv({
          Qn: normalFlowNm3h,
          P1: P1Abs,
          P2: P2Abs,
          T1,
          M,
          Z,
          gamma,
          xT: input.XT || 0.72,
          d,
          D1,
          D2,
          ratedKv: input.ratedKv
        });

        calculatedKv = gasResult.kv;
        flowState = gasResult.flowState;
        usedFormula = gasResult.usedFormula;
        x = gasResult.intermediate.x;
        Fgamma = gasResult.intermediate.Fgamma;
        Y = gasResult.intermediate.Y;
        FP = gasResult.intermediate.FP;
        break;
      }

      case 'Steam': {
        // Flow conversion
        massFlowKgh = convertSteamFlowToKgh(input.flowRate, input.flowUnit, densityKgM3);

        // Steam Kv calculation
        const steamResult = calculateSteamKv({
          W: massFlowKgh,
          P1: P1Abs,
          P2: P2Abs,
          T1,
          rho1: densityKgM3,
          gamma,
          xT: input.XT || 0.72,
          d,
          D1,
          D2,
          ratedKv: input.ratedKv
        });

        calculatedKv = steamResult.kv;
        flowState = steamResult.flowState;
        usedFormula = steamResult.usedFormula;
        x = steamResult.intermediate.x;
        Fgamma = steamResult.intermediate.Fgamma;
        Y = steamResult.intermediate.Y;
        FP = steamResult.intermediate.FP;
        break;
      }

      default:
        throw new Error(`Unsupported fluid type: ${input.fluidType}`);
    }

    // 3. Calculate valve opening
    const valveOpening = calcValveOpening(
      calculatedKv,
      input.ratedKv,
      input.rangeability,
      input.flowChar
    );

    const openingValidation = validateOpening(valveOpening);
    if (openingValidation.warning) {
      warnings.push(openingValidation.warning);
    }

    // 4. Calculate outlet velocity
    let outletVelocity = 0;
    if (input.fluidType === 'Liquid' && volumeFlowM3h) {
      outletVelocity = calcVelocity(volumeFlowM3h, d);
    } else if (input.fluidType === 'Gas' && normalFlowNm3h) {
      // Gas actual volume flow rate
      const actualFlowM3h = normalFlowNm3h * CONSTANTS.STD_PRESSURE * T1 / (P2Abs * CONSTANTS.STD_TEMP);
      outletVelocity = calcVelocity(actualFlowM3h, d);
    } else if (input.fluidType === 'Steam' && massFlowKgh) {
      const volumeFlow = massFlowKgh / densityKgM3;
      outletVelocity = calcVelocity(volumeFlow, d);
    }

    // 5. Assemble result
    const intermediate: IntermediateValues = {
      P1Abs,
      P2Abs,
      deltaP,
      T1,
      saturationTemp,
      densityKgM3,
      relativeDensity,
      volumeFlowM3h,
      massFlowKgh,
      normalFlowNm3h,
      kinematicViscosity,
      Pv,
      FF,
      xF,
      x,
      Fgamma,
      Y,
      D1,
      D2,
      FP,
      FLP,
      sumK,
      Rev,
      FR,
      lambda
    };

    return {
      calculatedKv,
      calculatedCv: kvToCv(calculatedKv),
      valveOpening,
      flowState,
      turbulenceState,
      fluidState,
      outletVelocity,
      intermediate,
      usedFormula,
      hasFittings,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Calculate noise
   * @param input Original input parameters
   * @param result Calculated Kv result
   * @returns Noise level dBA
   */
  calculateNoise(input: KvInput, result: KvResult): NoiseResult | null {
    try {
      // Get pipe specification
      const pipeSpec = PIPE_SPECS[input.DN];
      if (!pipeSpec) {
        return null;
      }

      const [outerDiameter, wallThickness] = pipeSpec;
      const Di = outerDiameter - 2 * wallThickness;  // Pipe inner diameter mm
      const tp = wallThickness;  // Wall thickness mm
      const d = input.seatSize || input.DN;  // Seat diameter mm

      // Calculate mass flow
      let massFlow = result.intermediate.massFlowKgh || 0;

      // For gas, calculate mass flow from standard volume flow
      if (input.fluidType === 'Gas' && result.intermediate.normalFlowNm3h) {
        // At standard density: massFlow = Qn * rhoN
        const rhoN = input.densityUnit === 'Kg/Nm3'
          ? input.density
          : input.density * CONSTANTS.STD_TEMP / result.intermediate.T1 * result.intermediate.P1Abs / CONSTANTS.STD_PRESSURE;
        massFlow = result.intermediate.normalFlowNm3h * rhoN;
      }

      // For liquid, calculate from volume flow
      if (input.fluidType === 'Liquid' && result.intermediate.volumeFlowM3h && massFlow === 0) {
        massFlow = result.intermediate.volumeFlowM3h * result.intermediate.densityKgM3;
      }

      // Build noise calculation input
      const noiseInput: NoiseInput = {
        fluidType: input.fluidType === 'Steam' ? 'Steam' : (input.fluidType === 'Gas' ? 'Gas' : 'Liquid'),
        P1: result.intermediate.P1Abs,
        P2: result.intermediate.P2Abs,
        deltaP: result.intermediate.deltaP,
        T1: result.intermediate.T1,
        massFlow,
        volumeFlow: result.intermediate.volumeFlowM3h,
        density: result.intermediate.densityKgM3,
        density2: input.fluidType === 'Gas'
          ? result.intermediate.densityKgM3 * Math.pow(result.intermediate.P2Abs / result.intermediate.P1Abs, 1 / (input.gamma || 1.4))
          : undefined,
        gamma: input.gamma || CONSTANTS.DEFAULT.GAMMA,
        molecularWeight: input.molecularWeight,
        Pv: result.intermediate.Pv,
        Kv: result.calculatedKv,
        Cv: result.calculatedCv,
        FL: input.FL,
        xT: input.XT,
        Fd: input.Fd || CONSTANTS.DEFAULT.FD,
        xFz: undefined,  // Will be calculated automatically
        xF: result.intermediate.xF,
        Di,
        tp,
        d,
        pipeMaterial: 'steel'
      };

      // Select noise calculation method based on fluid type
      if (input.fluidType === 'Liquid') {
        return calculateLiquidNoise(noiseInput);
      } else if (input.fluidType === 'Gas' || input.fluidType === 'Steam') {
        return calculateGasNoise(noiseInput);
      }

      return null;
    } catch (error) {
      // Noise calculation failure should not affect main calculation result
      console.error('Noise calculation failed:', error);
      return null;
    }
  }

  /**
   * Comprehensive calculation (including noise)
   * @param input Input parameters
   * @param includeNoise Whether to calculate noise (default true)
   */
  calculateWithNoise(input: KvInput, includeNoise: boolean = true): KvResult & { noiseResult?: NoiseResult } {
    const result = this.calculate(input);

    if (includeNoise) {
      const noiseResult = this.calculateNoise(input, result);
      if (noiseResult) {
        result.noise = noiseResult.noiseLevel;
        return { ...result, noiseResult };
      }
    }

    return result;
  }
}

// Export default calculator instance
export const kvCalculator = new KvCalculator();
