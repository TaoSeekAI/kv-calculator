/**
 * 气体计算调试脚本
 * 用于追踪完整的计算过程
 */

import { KvCalculator } from '../src/kv-calculator.js';
import { CONSTANTS } from '../src/constants/index.js';
import { calcFgamma, calcX, calcY, calcGasKv, determineGasFlowState } from '../src/calculators/gas.js';
import { convertPressureToKPaAbs, convertTemperatureToK } from '../src/utils/unit-converter.js';

// 输入参数
const input = {
  fluidType: '气体' as const,
  flowRate: 100,           // Nm³/h
  flowUnit: 'Nm3/h' as const,
  P1: 0.5,                 // MPa(G)
  P2: 0.2,                 // MPa(G)
  pressureUnit: 'MPa(G)' as const,
  temperature: 20,         // ℃
  tempUnit: '℃' as const,
  density: 1.25,           // Kg/Nm³
  densityUnit: 'Kg/Nm3' as const,
  DN: 50,                  // mm
  ratedKv: 50,
  FL: 0.85,
  XT: 0.72,
  Fd: 0.46,
  Z: 1,                    // 压缩系数
  gamma: 1.4,              // 比热比
  rangeability: 50,
  flowChar: '等百分比' as const,
};

console.log('========== 气体 Kv 计算调试 ==========\n');
console.log('【输入参数】');
console.log(`  流量: ${input.flowRate} Nm³/h`);
console.log(`  进口压力: ${input.P1} MPa(G)`);
console.log(`  出口压力: ${input.P2} MPa(G)`);
console.log(`  温度: ${input.temperature} ℃`);
console.log(`  密度: ${input.density} Kg/Nm³`);
console.log(`  压缩系数 Z: ${input.Z}`);
console.log(`  比热比 γ: ${input.gamma}`);
console.log(`  额定Kv: ${input.ratedKv}`);
console.log(`  XT: ${input.XT}`);
console.log(`  DN: ${input.DN} mm`);
console.log();

// 手动计算过程
console.log('【单位转换】');
const P1Abs = convertPressureToKPaAbs(input.P1, input.pressureUnit);
const P2Abs = convertPressureToKPaAbs(input.P2, input.pressureUnit);
const deltaP = P1Abs - P2Abs;
const T1 = convertTemperatureToK(input.temperature, input.tempUnit);

console.log(`  P1(绝对) = ${input.P1} MPa(G) + 0.101325 = ${(input.P1 + 0.101325).toFixed(6)} MPa(A) = ${P1Abs.toFixed(3)} KPa`);
console.log(`  P2(绝对) = ${input.P2} MPa(G) + 0.101325 = ${(input.P2 + 0.101325).toFixed(6)} MPa(A) = ${P2Abs.toFixed(3)} KPa`);
console.log(`  ΔP = P1 - P2 = ${deltaP.toFixed(3)} KPa`);
console.log(`  T1 = ${input.temperature} + 273.15 = ${T1.toFixed(2)} K`);
console.log();

// 分子量计算
const rhoN = input.density;  // Kg/Nm³
const M = rhoN * 22.4;  // 分子量
console.log('【分子量计算】');
console.log(`  标准密度 ρN = ${rhoN} Kg/Nm³`);
console.log(`  分子量 M = ρN × 22.4 = ${rhoN} × 22.4 = ${M.toFixed(2)} Kg/Kmol`);
console.log();

// 气体计算中间值
console.log('【气体计算中间值】');
const x = calcX(deltaP, P1Abs);
const Fgamma = calcFgamma(input.gamma);
const xT = input.XT;

console.log(`  压差比 x = ΔP / P1 = ${deltaP.toFixed(3)} / ${P1Abs.toFixed(3)} = ${x.toFixed(6)}`);
console.log(`  比热比系数 Fγ = γ / 1.4 = ${input.gamma} / 1.4 = ${Fgamma.toFixed(4)}`);
console.log(`  压差比系数 xT = ${xT}`);
console.log();

// 流动状态判定
console.log('【流动状态判定】');
const xLimit = Fgamma * xT;
console.log(`  临界压差比 Fγ × xT = ${Fgamma.toFixed(4)} × ${xT} = ${xLimit.toFixed(6)}`);
console.log(`  x = ${x.toFixed(6)} ${x < xLimit ? '<' : '>='} ${xLimit.toFixed(6)}`);
const flowState = determineGasFlowState(x, Fgamma, xT);
console.log(`  流动状态: ${flowState}`);
console.log();

// 膨胀系数 Y
console.log('【膨胀系数 Y】');
const Y_raw = 1 - x / (3 * Fgamma * xT);
const Y = calcY(x, Fgamma, xT);
console.log(`  Y = 1 - x / (3 × Fγ × xT)`);
console.log(`    = 1 - ${x.toFixed(6)} / (3 × ${Fgamma.toFixed(4)} × ${xT})`);
console.log(`    = 1 - ${x.toFixed(6)} / ${(3 * Fgamma * xT).toFixed(6)}`);
console.log(`    = 1 - ${(x / (3 * Fgamma * xT)).toFixed(6)}`);
console.log(`    = ${Y_raw.toFixed(6)} (原始值)`);
console.log(`    = ${Y.toFixed(6)} (最终值，最小0.667)`);
console.log();

// Kv 计算
console.log('【Kv 计算 - 非阻塞流公式】');
console.log(`  C = Qn / (N9 × P1 × Y) × √(M × Z × T1 / x)`);
console.log(`  N9 = ${CONSTANTS.N9}`);
console.log();

const term1 = input.flowRate / (CONSTANTS.N9 * P1Abs * Y);
const term2_inside = M * input.Z * T1 / x;
const term2 = Math.sqrt(term2_inside);
const calculatedKv = term1 * term2;

console.log(`  分子部分: Qn = ${input.flowRate}`);
console.log(`  分母部分: N9 × P1 × Y = ${CONSTANTS.N9} × ${P1Abs.toFixed(3)} × ${Y.toFixed(6)} = ${(CONSTANTS.N9 * P1Abs * Y).toFixed(6)}`);
console.log(`  第一项: Qn / (N9 × P1 × Y) = ${term1.toFixed(8)}`);
console.log();
console.log(`  根号内: M × Z × T1 / x`);
console.log(`        = ${M.toFixed(2)} × ${input.Z} × ${T1.toFixed(2)} / ${x.toFixed(6)}`);
console.log(`        = ${(M * input.Z * T1).toFixed(4)} / ${x.toFixed(6)}`);
console.log(`        = ${term2_inside.toFixed(4)}`);
console.log(`  √(...) = ${term2.toFixed(6)}`);
console.log();
console.log(`  计算Kv = ${term1.toFixed(8)} × ${term2.toFixed(6)} = ${calculatedKv.toFixed(4)}`);
console.log();

// 使用计算器验证
console.log('========== 计算器完整输出 ==========\n');
const calculator = new KvCalculator();
const result = calculator.calculateWithNoise(input, true);

console.log('【计算结果】');
console.log(`  计算Kv: ${result.calculatedKv.toFixed(4)}`);
console.log(`  计算Cv: ${result.calculatedCv.toFixed(4)}`);
console.log(`  流动状态: ${result.flowState}`);
console.log(`  使用公式: ${result.usedFormula}`);
console.log(`  阀门开度: ${result.valveOpening?.toFixed(2)}%`);
console.log(`  出口流速: ${result.outletVelocity?.toFixed(2)} m/s`);
console.log(`  噪音: ${result.noise?.toFixed(2)} dBA`);
console.log();

console.log('【中间值】');
console.log(`  P1Abs: ${result.intermediate.P1Abs?.toFixed(3)} KPa`);
console.log(`  P2Abs: ${result.intermediate.P2Abs?.toFixed(3)} KPa`);
console.log(`  deltaP: ${result.intermediate.deltaP?.toFixed(3)} KPa`);
console.log(`  T1: ${result.intermediate.T1?.toFixed(2)} K`);
console.log(`  x: ${result.intermediate.x?.toFixed(6)}`);
console.log(`  Fgamma: ${result.intermediate.Fgamma?.toFixed(4)}`);
console.log(`  Y: ${result.intermediate.Y?.toFixed(6)}`);
console.log(`  FP: ${result.intermediate.FP?.toFixed(6)}`);
console.log(`  normalFlowNm3h: ${result.intermediate.normalFlowNm3h?.toFixed(2)}`);
console.log();

console.log('========== 期望值对比 ==========\n');
console.log('期望结果 (图2):');
console.log('  流体状态: 非阻塞流');
console.log('  计算Kv: 1.13');
console.log('  阀门开度: 44.25%');
console.log('  阀门出口流速: 20.52 m/s');
console.log('  噪音: 61.85 dBA');
console.log('  流阻系数: 6.11');
console.log();
console.log('实际计算:');
console.log(`  流体状态: ${result.flowState}`);
console.log(`  计算Kv: ${result.calculatedKv.toFixed(2)}`);
console.log(`  阀门开度: ${result.valveOpening?.toFixed(2)}%`);
console.log(`  阀门出口流速: ${result.outletVelocity?.toFixed(2)} m/s`);
console.log(`  噪音: ${result.noise?.toFixed(2)} dBA`);
