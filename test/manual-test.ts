#!/usr/bin/env bun
/**
 * 手动测试脚本 - 支持液体、气体、蒸汽
 * 运行: bun test/manual-test.ts
 */

import { KvCalculator } from '../src/kv-calculator.js';

const calculator = new KvCalculator();

// ========== 测试用例1: 液体 ==========
const liquidInput = {
  fluidType: '液体' as const,
  temperature: 50,
  tempUnit: '℃' as const,
  flowRate: 100,        // m³/h
  flowUnit: 'm3/h' as const,
  P1: 2,                // MPa(G)
  P2: 0.1,              // MPa(G)
  pressureUnit: 'MPa(G)' as const,
  density: 988,         // Kg/m³
  densityUnit: 'Kg/m3' as const,
  viscosity: 1,         // cP
  viscosityUnit: 'cP' as const,
  viscosityType: '粘度' as const,
  Pc: 22.12,            // 临界压力 MPa
  DN: 150,
  seatSize: 150,
  FL: 0.9,
  XT: 0.72,
  Fd: 0.42,
  flowChar: '等百分比' as const,
  rangeability: 50,
  ratedKv: 400
};

// ========== 测试用例2: 气体 (空气) ==========
const gasInput = {
  fluidType: '气体' as const,
  temperature: 20,
  tempUnit: '℃' as const,
  flowRate: 5000,       // Nm³/h 标准体积流量
  flowUnit: 'Nm3/h' as const,
  P1: 0.6,              // MPa(G)
  P2: 0.1,              // MPa(G)
  pressureUnit: 'MPa(G)' as const,
  density: 1.293,       // Kg/Nm³ (空气标准密度)
  densityUnit: 'Kg/Nm3' as const,
  molecularWeight: 29,  // 空气分子量
  Z: 1,                 // 压缩系数
  gamma: 1.4,           // 比热比
  DN: 100,
  seatSize: 100,
  FL: 0.9,
  XT: 0.72,
  Fd: 0.42,
  flowChar: '等百分比' as const,
  rangeability: 50,
  ratedKv: 250
};

// ========== 测试用例3: 蒸汽 ==========
const steamInput = {
  fluidType: '蒸汽' as const,
  temperature: 200,     // ℃
  tempUnit: '℃' as const,
  flowRate: 2000,       // Kg/h 质量流量
  flowUnit: 'Kg/h' as const,
  P1: 1,                // MPa(G) 约10bar(G)
  P2: 0.5,              // MPa(G)
  pressureUnit: 'MPa(G)' as const,
  density: 5.15,        // Kg/m³ (蒸汽密度，需根据压力温度查表)
  densityUnit: 'Kg/m3' as const,
  gamma: 1.3,           // 蒸汽比热比
  DN: 80,
  seatSize: 80,
  FL: 0.9,
  XT: 0.72,
  Fd: 0.42,
  flowChar: '等百分比' as const,
  rangeability: 50,
  ratedKv: 160
};

function printResult(name: string, input: any, result: any) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  ${name} Kv计算测试`);
  console.log('='.repeat(50));

  console.log('\n【输入参数】');
  console.log(`  流体类型: ${input.fluidType}`);
  console.log(`  流量: ${input.flowRate} ${input.flowUnit}`);
  console.log(`  入口压力P1: ${input.P1} ${input.pressureUnit}`);
  console.log(`  出口压力P2: ${input.P2} ${input.pressureUnit}`);
  console.log(`  温度: ${input.temperature} ${input.tempUnit}`);
  console.log(`  密度: ${input.density} ${input.densityUnit}`);
  if (input.molecularWeight) console.log(`  分子量: ${input.molecularWeight}`);
  if (input.gamma) console.log(`  比热比γ: ${input.gamma}`);
  console.log(`  阀门口径DN: ${input.DN} mm`);
  console.log(`  额定Kv: ${input.ratedKv}`);

  console.log('\n【计算结果】');
  console.log(`  ✓ 计算Kv: ${result.calculatedKv.toFixed(4)}`);
  console.log(`  ✓ 计算Cv: ${result.calculatedCv.toFixed(4)}`);
  console.log(`  ✓ 阀门开度: ${result.valveOpening.toFixed(2)}%`);
  console.log(`  ✓ 流动状态: ${result.flowState}`);
  console.log(`  ✓ 紊流状态: ${result.turbulenceState}`);
  if (result.fluidState) console.log(`  ✓ 流体状态: ${result.fluidState}`);
  console.log(`  ✓ 出口流速: ${result.outletVelocity.toFixed(2)} m/s`);
  console.log(`  ✓ 使用公式: ${result.usedFormula}`);

  console.log('\n【中间计算值】');
  console.log(`  P1绝对压力: ${result.intermediate.P1Abs.toFixed(2)} KPa`);
  console.log(`  P2绝对压力: ${result.intermediate.P2Abs.toFixed(2)} KPa`);
  console.log(`  压差ΔP: ${result.intermediate.deltaP.toFixed(2)} KPa`);
  console.log(`  绝对温度T1: ${result.intermediate.T1.toFixed(2)} K`);

  if (result.intermediate.relativeDensity !== undefined) {
    console.log(`  相对密度: ${result.intermediate.relativeDensity.toFixed(4)}`);
  }
  if (result.intermediate.Pv !== undefined) {
    console.log(`  饱和蒸汽压Pv: ${result.intermediate.Pv.toFixed(4)} KPa`);
  }
  if (result.intermediate.FF !== undefined) {
    console.log(`  FF系数: ${result.intermediate.FF.toFixed(6)}`);
  }
  if (result.intermediate.x !== undefined) {
    console.log(`  压差比x: ${result.intermediate.x.toFixed(6)}`);
  }
  if (result.intermediate.Fgamma !== undefined) {
    console.log(`  比热比系数Fγ: ${result.intermediate.Fgamma.toFixed(6)}`);
  }
  if (result.intermediate.Y !== undefined) {
    console.log(`  膨胀系数Y: ${result.intermediate.Y.toFixed(6)}`);
  }

  console.log(`  FP: ${result.intermediate.FP.toFixed(6)}`);
  console.log(`  FLP: ${result.intermediate.FLP.toFixed(6)}`);
  console.log(`  ΣK: ${result.intermediate.sumK.toFixed(6)}`);

  if (result.warnings?.length) {
    console.log('\n【警告】');
    result.warnings.forEach((w: string) => console.log(`  ⚠️ ${w}`));
  }

  if (result.errors?.length) {
    console.log('\n【错误】');
    result.errors.forEach((e: string) => console.log(`  ❌ ${e}`));
  }
}

// 运行测试
console.log('\n');
console.log('╔════════════════════════════════════════════════════╗');
console.log('║          Kv计算系统 - 手动测试                     ║');
console.log('╚════════════════════════════════════════════════════╝');

// 液体测试
const liquidResult = calculator.calculate(liquidInput);
printResult('液体', liquidInput, liquidResult);

// 气体测试
const gasResult = calculator.calculate(gasInput);
printResult('气体', gasInput, gasResult);

// 蒸汽测试
const steamResult = calculator.calculate(steamInput);
printResult('蒸汽', steamInput, steamResult);

console.log('\n');
console.log('='.repeat(50));
console.log('  测试完成！');
console.log('='.repeat(50));
console.log('\n提示: 修改本文件中的 liquidInput/gasInput/steamInput 参数可测试不同工况\n');
