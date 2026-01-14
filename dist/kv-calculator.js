/**
 * Kv综合计算器
 * 整合液体、气体、蒸汽的Kv计算
 */
import { CONSTANTS, PIPE_SPECS } from './constants/index.js';
import { convertPressureToKPaAbs, convertTemperatureToK, convertTemperatureToCelsius, convertDensityToKgM3, convertLiquidFlowToM3h, convertGasFlowToNm3h, convertSteamFlowToKgh, convertViscosityToM2S, convertGasDensityToActual, getPipeInnerDiameter, calcRelativeDensity, calcSaturationPressure, calcSaturationTemperature, calcVelocity, kvToCv } from './utils/unit-converter.js';
import { calculateLiquidKv, calcFF, calcSumK, calcFP, calcFLP } from './calculators/liquid.js';
import { calculateGasKv } from './calculators/gas.js';
import { calculateSteamKv } from './calculators/steam.js';
import { calculateReynolds } from './calculators/reynolds.js';
import { calcValveOpening, validateOpening } from './calculators/valve-opening.js';
import { calculateGasNoise } from './calculators/gas-noise.js';
import { calculateLiquidNoise } from './calculators/liquid-noise.js';
/**
 * Kv计算器类
 */
export class KvCalculator {
    /**
     * 综合Kv计算
     */
    calculate(input) {
        const errors = [];
        const warnings = [];
        // 1. 单位转换
        const P1Abs = convertPressureToKPaAbs(input.P1, input.pressureUnit);
        const P2Abs = convertPressureToKPaAbs(input.P2, input.pressureUnit);
        const deltaP = P1Abs - P2Abs;
        const T1 = convertTemperatureToK(input.temperature, input.tempUnit);
        const tempCelsius = convertTemperatureToCelsius(input.temperature, input.tempUnit);
        // 压力校验
        if (P1Abs <= 0)
            errors.push('入口压力必须大于0');
        if (P2Abs < 0)
            errors.push('出口压力不能为负');
        if (deltaP <= 0)
            errors.push('入口压力必须大于出口压力');
        // 密度转换
        const densityKgM3 = convertDensityToKgM3(input.density, input.densityUnit);
        // 阀门口径
        const d = input.seatSize || input.DN;
        // 管道内径
        // 当seatSize等于DN时，Excel使用DN作为D1/D2（假设无异径管）
        const seatEqualsNominal = !input.seatSize || input.seatSize === input.DN;
        const D1 = seatEqualsNominal ? d : getPipeInnerDiameter(input.DN, input.D1w, input.D1T);
        const D2 = seatEqualsNominal ? d : getPipeInnerDiameter(input.DN, input.D2w, input.D2T);
        // 判断是否有管件
        const hasFittings = d !== D1 || d !== D2;
        // 粘度转换
        const kinematicViscosity = input.viscosity
            ? convertViscosityToM2S(input.viscosity, input.viscosityUnit || 'cP', input.viscosityType || '粘度', densityKgM3)
            : CONSTANTS.DEFAULT.VISCOSITY / 1000 / densityKgM3; // 默认1cP
        // 默认值
        const Fd = input.Fd ?? CONSTANTS.DEFAULT.FD;
        const Z = input.Z ?? CONSTANTS.DEFAULT.Z;
        const gamma = input.gamma ?? CONSTANTS.DEFAULT.GAMMA;
        const Pc = input.Pc ?? CONSTANTS.WATER_CRITICAL_PRESSURE;
        // 2. 根据流体类型进行计算
        let calculatedKv;
        let flowState = '非阻塞流';
        let turbulenceState = '紊流';
        let fluidState;
        let usedFormula = '';
        // 中间值
        const sumK = calcSumK(d, D1, D2);
        const Ci = input.ratedKv * 1.3;
        let FP = calcFP(sumK, Ci, d);
        let FLP = calcFLP(input.FL, sumK, Ci, d);
        let Rev = 0;
        let FR = 1;
        let lambda = 0;
        let relativeDensity;
        let FF;
        let Pv;
        let xF;
        let x;
        let Fgamma;
        let Y;
        let saturationTemp;
        let volumeFlowM3h;
        let massFlowKgh;
        let normalFlowNm3h;
        switch (input.fluidType) {
            case '液体': {
                // 液体计算
                relativeDensity = calcRelativeDensity(densityKgM3);
                Pv = calcSaturationPressure(tempCelsius);
                FF = calcFF(Pv, Pc);
                saturationTemp = calcSaturationTemperature(P1Abs);
                // 温度校验
                if (tempCelsius > saturationTemp) {
                    errors.push('介质温度高于饱和温度');
                }
                // 压力校验
                if (P1Abs <= Pv) {
                    errors.push('入口压力小于饱和蒸汽压');
                }
                // 流量转换
                volumeFlowM3h = convertLiquidFlowToM3h(input.flowRate, input.flowUnit, densityKgM3);
                massFlowKgh = volumeFlowM3h * densityKgM3;
                // 先用简化计算获取初步Kv用于雷诺数计算
                const C_initial = volumeFlowM3h / CONSTANTS.N1 * Math.sqrt(relativeDensity / deltaP);
                // 计算雷诺数
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
                // 液体Kv计算
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
                // 更新FP/FLP
                FP = liquidResult.intermediate.FP;
                FLP = liquidResult.intermediate.FLP;
                break;
            }
            case '气体': {
                // 气体标准密度计算
                const rhoN = input.densityUnit === 'Kg/Nm3'
                    ? input.density
                    : convertGasDensityToActual(input.density, CONSTANTS.STD_PRESSURE, CONSTANTS.STD_TEMP);
                // 流量转换
                normalFlowNm3h = convertGasFlowToNm3h(input.flowRate, input.flowUnit, rhoN, P1Abs, T1);
                // 分子量
                const M = input.molecularWeight || (rhoN * 22.4);
                // 气体Kv计算
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
            case '蒸汽': {
                // 流量转换
                massFlowKgh = convertSteamFlowToKgh(input.flowRate, input.flowUnit, densityKgM3);
                // 蒸汽Kv计算
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
                throw new Error(`不支持的流体类型: ${input.fluidType}`);
        }
        // 3. 计算阀门开度
        const valveOpening = calcValveOpening(calculatedKv, input.ratedKv, input.rangeability, input.flowChar);
        const openingValidation = validateOpening(valveOpening);
        if (openingValidation.warning) {
            warnings.push(openingValidation.warning);
        }
        // 4. 计算出口流速
        let outletVelocity = 0;
        if (input.fluidType === '液体' && volumeFlowM3h) {
            outletVelocity = calcVelocity(volumeFlowM3h, d);
        }
        else if (input.fluidType === '气体' && normalFlowNm3h) {
            // 气体工况体积流量
            const actualFlowM3h = normalFlowNm3h * CONSTANTS.STD_PRESSURE * T1 / (P2Abs * CONSTANTS.STD_TEMP);
            outletVelocity = calcVelocity(actualFlowM3h, d);
        }
        else if (input.fluidType === '蒸汽' && massFlowKgh) {
            const volumeFlow = massFlowKgh / densityKgM3;
            outletVelocity = calcVelocity(volumeFlow, d);
        }
        // 5. 组装结果
        const intermediate = {
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
     * 计算噪音
     * @param input 原始输入参数
     * @param result 已计算的Kv结果
     * @returns 噪音级 dBA
     */
    calculateNoise(input, result) {
        try {
            // 获取管道规格
            const pipeSpec = PIPE_SPECS[input.DN];
            if (!pipeSpec) {
                return null;
            }
            const [outerDiameter, wallThickness] = pipeSpec;
            const Di = outerDiameter - 2 * wallThickness; // 管道内径 mm
            const tp = wallThickness; // 壁厚 mm
            const d = input.seatSize || input.DN; // 阀座直径 mm
            // 计算质量流量
            let massFlow = result.intermediate.massFlowKgh || 0;
            // 对于气体，从标准体积流量计算质量流量
            if (input.fluidType === '气体' && result.intermediate.normalFlowNm3h) {
                // 标准密度下: massFlow = Qn * rhoN
                const rhoN = input.densityUnit === 'Kg/Nm3'
                    ? input.density
                    : input.density * CONSTANTS.STD_TEMP / result.intermediate.T1 * result.intermediate.P1Abs / CONSTANTS.STD_PRESSURE;
                massFlow = result.intermediate.normalFlowNm3h * rhoN;
            }
            // 对于液体，从体积流量计算
            if (input.fluidType === '液体' && result.intermediate.volumeFlowM3h && massFlow === 0) {
                massFlow = result.intermediate.volumeFlowM3h * result.intermediate.densityKgM3;
            }
            // 构建噪音计算输入
            const noiseInput = {
                fluidType: input.fluidType === '蒸汽' ? '蒸汽' : (input.fluidType === '气体' ? '气体' : '液体'),
                P1: result.intermediate.P1Abs,
                P2: result.intermediate.P2Abs,
                deltaP: result.intermediate.deltaP,
                T1: result.intermediate.T1,
                massFlow,
                volumeFlow: result.intermediate.volumeFlowM3h,
                density: result.intermediate.densityKgM3,
                density2: input.fluidType === '气体'
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
                xFz: undefined, // 将自动计算
                xF: result.intermediate.xF,
                Di,
                tp,
                d,
                pipeMaterial: 'steel'
            };
            // 根据流体类型选择噪音计算方法
            if (input.fluidType === '液体') {
                return calculateLiquidNoise(noiseInput);
            }
            else if (input.fluidType === '气体' || input.fluidType === '蒸汽') {
                return calculateGasNoise(noiseInput);
            }
            return null;
        }
        catch (error) {
            // 噪音计算失败不影响主计算结果
            console.error('噪音计算失败:', error);
            return null;
        }
    }
    /**
     * 综合计算 (包含噪音)
     * @param input 输入参数
     * @param includeNoise 是否计算噪音 (默认true)
     */
    calculateWithNoise(input, includeNoise = true) {
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
// 导出默认计算器实例
export const kvCalculator = new KvCalculator();
