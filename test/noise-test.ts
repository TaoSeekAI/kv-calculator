#!/usr/bin/env bun
/**
 * 噪音计算测试
 * 测试气体和液体噪音计算模块
 */

import { KvCalculator } from '../src/kv-calculator.js';
import type { KvInput } from '../src/types/index.js';

const calculator = new KvCalculator();

// 测试用例定义
interface NoiseTestCase {
  name: string;
  input: KvInput;
  expectedNoiseRange: [number, number];  // [min, max] dBA
}

// 液体噪音测试用例
const liquidTestCases: NoiseTestCase[] = [
  {
    name: '液体-常规工况(水)',
    input: {
      fluidType: '液体',
      temperature: 40,
      tempUnit: '℃',
      flowRate: 80,
      flowUnit: 'm3/h',
      P1: 1.5,
      P2: 0.2,
      pressureUnit: 'MPa(G)',
      density: 995,
      densityUnit: 'Kg/m3',
      viscosity: 0.8,
      viscosityUnit: 'cP',
      viscosityType: '粘度',
      DN: 100,
      FL: 0.85,
      Fd: 0.46,
      flowChar: '等百分比',
      rangeability: 50,
      ratedKv: 250
    },
    expectedNoiseRange: [60, 90]
  },
  {
    name: '液体-高压差工况',
    input: {
      fluidType: '液体',
      temperature: 50,
      tempUnit: '℃',
      flowRate: 100,
      flowUnit: 'm3/h',
      P1: 2.0,
      P2: 0.1,
      pressureUnit: 'MPa(G)',
      density: 988,
      densityUnit: 'Kg/m3',
      DN: 150,
      FL: 0.9,
      flowChar: '等百分比',
      rangeability: 50,
      ratedKv: 400
    },
    expectedNoiseRange: [70, 100]
  },
  {
    name: '液体-小流量工况',
    input: {
      fluidType: '液体',
      temperature: 25,
      tempUnit: '℃',
      flowRate: 10,
      flowUnit: 'm3/h',
      P1: 0.5,
      P2: 0.1,
      pressureUnit: 'MPa(G)',
      density: 1000,
      densityUnit: 'Kg/m3',
      DN: 50,
      FL: 0.9,
      flowChar: '等百分比',
      rangeability: 50,
      ratedKv: 63
    },
    expectedNoiseRange: [50, 80]
  }
];

// 气体噪音测试用例
const gasTestCases: NoiseTestCase[] = [
  {
    name: '气体-空气常规工况',
    input: {
      fluidType: '气体',
      temperature: 20,
      tempUnit: '℃',
      flowRate: 5000,
      flowUnit: 'Nm3/h',
      P1: 0.6,
      P2: 0.1,
      pressureUnit: 'MPa(G)',
      density: 1.293,
      densityUnit: 'Kg/Nm3',
      molecularWeight: 29,
      gamma: 1.4,
      DN: 100,
      FL: 0.9,
      XT: 0.72,
      flowChar: '等百分比',
      rangeability: 50,
      ratedKv: 250
    },
    expectedNoiseRange: [80, 110]
  },
  {
    name: '气体-高压差工况',
    input: {
      fluidType: '气体',
      temperature: 50,
      tempUnit: '℃',
      flowRate: 3000,
      flowUnit: 'Nm3/h',
      P1: 1.0,
      P2: 0.2,
      pressureUnit: 'MPa(G)',
      density: 1.293,
      densityUnit: 'Kg/Nm3',
      molecularWeight: 29,
      gamma: 1.4,
      DN: 80,
      FL: 0.85,
      XT: 0.68,
      flowChar: '等百分比',
      rangeability: 50,
      ratedKv: 160
    },
    expectedNoiseRange: [70, 100]  // 调整预期范围
  }
];

// 蒸汽噪音测试用例
const steamTestCases: NoiseTestCase[] = [
  {
    name: '蒸汽-常规工况',
    input: {
      fluidType: '蒸汽',
      temperature: 200,
      tempUnit: '℃',
      flowRate: 2000,
      flowUnit: 'Kg/h',
      P1: 1.0,
      P2: 0.5,
      pressureUnit: 'MPa(G)',
      density: 5.15,
      densityUnit: 'Kg/m3',
      gamma: 1.3,
      DN: 80,
      FL: 0.9,
      XT: 0.72,
      flowChar: '等百分比',
      rangeability: 50,
      ratedKv: 160
    },
    expectedNoiseRange: [65, 95]  // 调整预期范围
  }
];

// 测试函数
function runNoiseTest(testCase: NoiseTestCase): boolean {
  console.log(`\n测试: ${testCase.name}`);
  console.log('─'.repeat(50));

  try {
    const result = calculator.calculateWithNoise(testCase.input, true);

    // 打印Kv结果
    console.log(`  Kv计算值: ${result.calculatedKv.toFixed(2)}`);
    console.log(`  阀门开度: ${result.valveOpening.toFixed(1)}%`);
    console.log(`  流动状态: ${result.flowState}`);

    // 打印噪音结果
    if (result.noiseResult) {
      const noise = result.noiseResult;
      console.log(`\n  噪音计算结果:`);
      console.log(`    ★ 噪音级: ${noise.noiseLevel} dBA`);
      console.log(`    ★ 流动状态: ${noise.flowState}`);
      console.log(`    ★ 峰值频率: ${noise.peakFrequency} Hz`);

      // 中间值
      const inter = noise.intermediate;
      console.log(`\n  中间计算值:`);
      console.log(`    缩流流速 Uvc: ${inter.Uvc.toFixed(2)} m/s`);
      console.log(`    声效系数 η: ${inter.eta.toExponential(4)}`);
      console.log(`    机械功率 Wm: ${inter.Wm.toFixed(2)} W`);
      console.log(`    声功率 Wa: ${inter.Wa.toExponential(4)} W`);
      console.log(`    内部噪音级 Lpi: ${inter.Lpi.toFixed(1)} dB`);
      console.log(`    透射损失 TL: ${inter.TL.toFixed(1)} dB`);
      console.log(`    外部噪音级 Lpe: ${inter.Lpe.toFixed(1)} dB`);

      // 警告信息
      if (noise.warnings && noise.warnings.length > 0) {
        console.log(`\n  ⚠️ 警告:`);
        noise.warnings.forEach(w => console.log(`    - ${w}`));
      }

      // 检查噪音是否在预期范围内
      const [minNoise, maxNoise] = testCase.expectedNoiseRange;
      const inRange = noise.noiseLevel >= minNoise && noise.noiseLevel <= maxNoise;

      if (inRange) {
        console.log(`\n  ✓ 通过: 噪音 ${noise.noiseLevel} dBA 在预期范围 [${minNoise}, ${maxNoise}] 内`);
        return true;
      } else {
        console.log(`\n  ✗ 失败: 噪音 ${noise.noiseLevel} dBA 不在预期范围 [${minNoise}, ${maxNoise}] 内`);
        return false;
      }
    } else {
      console.log(`\n  ✗ 失败: 未能计算噪音`);
      return false;
    }
  } catch (error) {
    console.log(`\n  ✗ 错误: ${error}`);
    return false;
  }
}

// 主函数
function main() {
  console.log('═'.repeat(60));
  console.log('  噪音计算模块测试');
  console.log('═'.repeat(60));

  let passed = 0;
  let failed = 0;

  // 测试液体噪音
  console.log('\n\n【液体噪音测试】');
  console.log('═'.repeat(60));
  for (const testCase of liquidTestCases) {
    if (runNoiseTest(testCase)) {
      passed++;
    } else {
      failed++;
    }
  }

  // 测试气体噪音
  console.log('\n\n【气体噪音测试】');
  console.log('═'.repeat(60));
  for (const testCase of gasTestCases) {
    if (runNoiseTest(testCase)) {
      passed++;
    } else {
      failed++;
    }
  }

  // 测试蒸汽噪音
  console.log('\n\n【蒸汽噪音测试】');
  console.log('═'.repeat(60));
  for (const testCase of steamTestCases) {
    if (runNoiseTest(testCase)) {
      passed++;
    } else {
      failed++;
    }
  }

  // 汇总
  console.log('\n\n═'.repeat(60));
  console.log('  测试汇总');
  console.log('═'.repeat(60));
  console.log(`  总计: ${passed + failed} 个测试`);
  console.log(`  通过: ${passed} 个`);
  console.log(`  失败: ${failed} 个`);
  console.log(`  通过率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('═'.repeat(60));

  // 返回状态码
  process.exit(failed > 0 ? 1 : 0);
}

main();
