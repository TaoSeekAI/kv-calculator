#!/usr/bin/env bun
/**
 * 随机参数手动验证测试
 * 用于验证噪音计算模块的正确性
 *
 * 使用方法:
 *   bun test/random-verify.ts              # 随机生成所有类型
 *   bun test/random-verify.ts liquid       # 随机生成液体工况
 *   bun test/random-verify.ts gas          # 随机生成气体工况
 *   bun test/random-verify.ts steam        # 随机生成蒸汽工况
 *   bun test/random-verify.ts -n 5         # 生成5组随机测试
 */

import { KvCalculator } from '../src/kv-calculator.js';
import type { KvInput } from '../src/types/index.js';

const calculator = new KvCalculator();

// 随机数生成工具
function randomInRange(min: number, max: number, decimals: number = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// DN系列
const DN_SERIES = [25, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300];

// 随机生成液体工况参数
function generateLiquidInput(): KvInput {
  const DN = randomChoice(DN_SERIES);
  const P1 = randomInRange(0.3, 3.0);  // MPa(G)
  const P2 = randomInRange(0.05, P1 * 0.6);  // 确保P2 < P1
  const temperature = randomInRange(10, 80, 0);

  // 根据DN估算合理流量范围
  const maxFlow = Math.pow(DN / 10, 2.5);
  const flowRate = randomInRange(maxFlow * 0.1, maxFlow * 0.8);

  // 根据温度计算水密度(近似)
  const density = 1000 - 0.5 * (temperature - 20);

  return {
    fluidType: '液体',
    temperature,
    tempUnit: '℃',
    flowRate,
    flowUnit: 'm3/h',
    P1,
    P2,
    pressureUnit: 'MPa(G)',
    density: Math.round(density),
    densityUnit: 'Kg/m3',
    viscosity: randomInRange(0.5, 2.0),
    viscosityUnit: 'cP',
    viscosityType: '粘度',
    DN,
    FL: randomInRange(0.8, 0.95),
    Fd: 0.46,
    flowChar: '等百分比',
    rangeability: 50,
    ratedKv: Math.round(Math.pow(DN / 8, 2.2))  // 估算额定Kv
  };
}

// 随机生成气体工况参数
function generateGasInput(): KvInput {
  const DN = randomChoice(DN_SERIES);
  const P1 = randomInRange(0.3, 2.0);  // MPa(G)
  const P2 = randomInRange(0.05, P1 * 0.5);
  const temperature = randomInRange(10, 100, 0);

  // 根据DN估算合理流量范围 (Nm3/h)
  const maxFlow = Math.pow(DN / 5, 2.8) * 100;
  const flowRate = randomInRange(maxFlow * 0.1, maxFlow * 0.7);

  // 随机选择气体类型
  const gasTypes = [
    { name: '空气', M: 29, gamma: 1.4, density: 1.293 },
    { name: '氮气', M: 28, gamma: 1.4, density: 1.251 },
    { name: '天然气', M: 18, gamma: 1.3, density: 0.72 },
    { name: '氢气', M: 2, gamma: 1.41, density: 0.0899 }
  ];
  const gas = randomChoice(gasTypes);

  return {
    fluidType: '气体',
    temperature,
    tempUnit: '℃',
    flowRate,
    flowUnit: 'Nm3/h',
    P1,
    P2,
    pressureUnit: 'MPa(G)',
    density: gas.density,
    densityUnit: 'Kg/Nm3',
    molecularWeight: gas.M,
    gamma: gas.gamma,
    Z: 1,
    DN,
    FL: randomInRange(0.8, 0.95),
    XT: randomInRange(0.65, 0.80),
    Fd: 0.46,
    flowChar: '等百分比',
    rangeability: 50,
    ratedKv: Math.round(Math.pow(DN / 8, 2.2))
  };
}

// 随机生成蒸汽工况参数
function generateSteamInput(): KvInput {
  const DN = randomChoice(DN_SERIES);
  const P1 = randomInRange(0.3, 2.5);  // MPa(G)
  const P2 = randomInRange(0.1, P1 * 0.7);

  // 蒸汽温度需要高于饱和温度
  const satTemp = 100 + 30 * Math.log10(P1 * 10 + 1);  // 近似饱和温度
  const temperature = randomInRange(satTemp + 10, satTemp + 100, 0);

  // 根据DN估算合理流量范围 (Kg/h)
  const maxFlow = Math.pow(DN / 3, 2.5) * 10;
  const flowRate = randomInRange(maxFlow * 0.1, maxFlow * 0.6);

  // 蒸汽密度(近似)
  const density = (P1 * 1000 + 101.325) / (0.461 * (temperature + 273.15));

  return {
    fluidType: '蒸汽',
    temperature,
    tempUnit: '℃',
    flowRate,
    flowUnit: 'Kg/h',
    P1,
    P2,
    pressureUnit: 'MPa(G)',
    density: Number(density.toFixed(2)),
    densityUnit: 'Kg/m3',
    gamma: 1.3,
    DN,
    FL: randomInRange(0.85, 0.95),
    XT: randomInRange(0.68, 0.78),
    Fd: 0.46,
    flowChar: '等百分比',
    rangeability: 50,
    ratedKv: Math.round(Math.pow(DN / 8, 2.2))
  };
}

// 格式化输出输入参数
function printInput(input: KvInput, index: number): void {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  测试 #${index} - ${input.fluidType}工况`);
  console.log(`${'═'.repeat(70)}`);

  console.log('\n【输入参数】');
  console.log('┌────────────────────┬─────────────────────────────────────────┐');
  console.log(`│ 流体类型           │ ${input.fluidType.padEnd(39)} │`);
  console.log(`│ 温度               │ ${(input.temperature + ' ' + input.tempUnit).padEnd(39)} │`);
  console.log(`│ 流量               │ ${(input.flowRate + ' ' + input.flowUnit).padEnd(39)} │`);
  console.log(`│ 入口压力 P1        │ ${(input.P1 + ' ' + input.pressureUnit).padEnd(39)} │`);
  console.log(`│ 出口压力 P2        │ ${(input.P2 + ' ' + input.pressureUnit).padEnd(39)} │`);
  console.log(`│ 密度               │ ${(input.density + ' ' + input.densityUnit).padEnd(39)} │`);
  console.log(`│ 公称口径 DN        │ ${(input.DN + ' mm').padEnd(39)} │`);
  console.log(`│ 压力恢复系数 FL    │ ${String(input.FL).padEnd(39)} │`);

  if (input.fluidType === '气体' || input.fluidType === '蒸汽') {
    console.log(`│ 压差比系数 xT      │ ${String(input.XT).padEnd(39)} │`);
    if (input.molecularWeight) {
      console.log(`│ 分子量 M           │ ${String(input.molecularWeight).padEnd(39)} │`);
    }
    console.log(`│ 比热比 γ           │ ${String(input.gamma).padEnd(39)} │`);
  }

  console.log(`│ 额定Kv             │ ${String(input.ratedKv).padEnd(39)} │`);
  console.log('└────────────────────┴─────────────────────────────────────────┘');
}

// 格式化输出计算结果
function printResult(result: any): void {
  console.log('\n【计算结果】');
  console.log('┌────────────────────┬─────────────────────────────────────────┐');
  console.log(`│ 计算Kv             │ ${result.calculatedKv.toFixed(2).padEnd(39)} │`);
  console.log(`│ 计算Cv             │ ${result.calculatedCv.toFixed(2).padEnd(39)} │`);
  console.log(`│ 阀门开度           │ ${(result.valveOpening.toFixed(1) + ' %').padEnd(39)} │`);
  console.log(`│ 流动状态           │ ${result.flowState.padEnd(39)} │`);
  console.log(`│ 出口流速           │ ${(result.outletVelocity.toFixed(2) + ' m/s').padEnd(39)} │`);
  console.log('└────────────────────┴─────────────────────────────────────────┘');

  if (result.noiseResult) {
    const noise = result.noiseResult;
    console.log('\n【噪音计算结果】');
    console.log('┌────────────────────┬─────────────────────────────────────────┐');
    console.log(`│ ★ 噪音级           │ ${(noise.noiseLevel + ' dBA').padEnd(39)} │`);
    console.log(`│ ★ 流动状态         │ ${noise.flowState.padEnd(39)} │`);
    console.log(`│ 峰值频率           │ ${(noise.peakFrequency + ' Hz').padEnd(39)} │`);
    console.log('└────────────────────┴─────────────────────────────────────────┘');

    const inter = noise.intermediate;
    console.log('\n【噪音计算中间值】');
    console.log('┌────────────────────┬─────────────────────────────────────────┐');
    console.log(`│ 缩流流速 Uvc       │ ${(inter.Uvc.toFixed(2) + ' m/s').padEnd(39)} │`);
    if (inter.Mvc) {
      console.log(`│ 缩流马赫数 Mvc     │ ${inter.Mvc.toFixed(4).padEnd(39)} │`);
    }
    console.log(`│ 声效系数 η         │ ${inter.eta.toExponential(4).padEnd(39)} │`);
    console.log(`│ 机械功率 Wm        │ ${(inter.Wm.toFixed(2) + ' W').padEnd(39)} │`);
    console.log(`│ 声功率 Wa          │ ${(inter.Wa.toExponential(4) + ' W').padEnd(39)} │`);
    console.log(`│ 内部声压级 Lpi     │ ${(inter.Lpi.toFixed(1) + ' dB').padEnd(39)} │`);
    console.log(`│ 透射损失 TL        │ ${(inter.TL.toFixed(1) + ' dB').padEnd(39)} │`);
    console.log(`│ 外部噪音级 Lpe     │ ${(inter.Lpe.toFixed(1) + ' dBA').padEnd(39)} │`);
    console.log('└────────────────────┴─────────────────────────────────────────┘');

    // 噪音等级评估
    const level = noise.noiseLevel;
    let assessment = '';
    if (level < 70) {
      assessment = '✓ 低噪音 - 正常范围';
    } else if (level < 85) {
      assessment = '⚠ 中等噪音 - 需要关注';
    } else if (level < 100) {
      assessment = '⚠⚠ 高噪音 - 建议采取降噪措施';
    } else {
      assessment = '⚠⚠⚠ 极高噪音 - 必须采取降噪措施';
    }
    console.log(`\n【噪音评估】 ${assessment}`);

    // 警告信息
    if (noise.warnings && noise.warnings.length > 0) {
      console.log('\n【警告信息】');
      noise.warnings.forEach((w: string) => console.log(`  ⚠️ ${w}`));
    }
  }
}

// 主函数
function main(): void {
  const args = process.argv.slice(2);

  // 解析参数
  let fluidType: 'liquid' | 'gas' | 'steam' | 'all' = 'all';
  let count = 1;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-n' && args[i + 1]) {
      count = parseInt(args[i + 1], 10);
      i++;
    } else if (['liquid', 'gas', 'steam'].includes(args[i])) {
      fluidType = args[i] as 'liquid' | 'gas' | 'steam';
    } else if (args[i] === '-h' || args[i] === '--help') {
      console.log(`
随机参数手动验证测试

使用方法:
  bun test/random-verify.ts [选项] [流体类型]

选项:
  -n <数量>    生成指定数量的随机测试 (默认: 1)
  -h, --help   显示帮助信息

流体类型:
  liquid       液体工况
  gas          气体工况
  steam        蒸汽工况
  (不指定)     随机选择类型

示例:
  bun test/random-verify.ts              # 随机生成1组测试
  bun test/random-verify.ts liquid       # 随机生成液体工况
  bun test/random-verify.ts gas -n 3     # 生成3组气体工况测试
  bun test/random-verify.ts -n 5         # 生成5组随机类型测试
`);
      return;
    }
  }

  console.log('\n' + '█'.repeat(70));
  console.log('█' + ' '.repeat(20) + '随机参数手动验证测试' + ' '.repeat(27) + '█');
  console.log('█'.repeat(70));
  console.log(`\n生成 ${count} 组${fluidType === 'all' ? '随机' : fluidType}工况测试...\n`);

  const results: Array<{
    index: number;
    type: string;
    kv: number;
    noise: number;
    status: string;
  }> = [];

  for (let i = 1; i <= count; i++) {
    let input: KvInput;
    let selectedType = fluidType;

    if (fluidType === 'all') {
      selectedType = randomChoice(['liquid', 'gas', 'steam']);
    }

    switch (selectedType) {
      case 'liquid':
        input = generateLiquidInput();
        break;
      case 'gas':
        input = generateGasInput();
        break;
      case 'steam':
        input = generateSteamInput();
        break;
      default:
        input = generateLiquidInput();
    }

    printInput(input, i);

    try {
      const result = calculator.calculateWithNoise(input, true);
      printResult(result);

      results.push({
        index: i,
        type: input.fluidType,
        kv: result.calculatedKv,
        noise: result.noiseResult?.noiseLevel || 0,
        status: '✓ 成功'
      });
    } catch (error) {
      console.log(`\n  ✗ 计算错误: ${error}`);
      results.push({
        index: i,
        type: input.fluidType,
        kv: 0,
        noise: 0,
        status: '✗ 失败'
      });
    }
  }

  // 汇总表格
  if (count > 1) {
    console.log('\n' + '═'.repeat(70));
    console.log('  测试汇总');
    console.log('═'.repeat(70));
    console.log('\n┌───────┬──────────┬────────────┬────────────┬──────────┐');
    console.log('│ 序号  │ 类型     │ 计算Kv     │ 噪音(dBA)  │ 状态     │');
    console.log('├───────┼──────────┼────────────┼────────────┼──────────┤');

    for (const r of results) {
      const idx = String(r.index).padStart(3);
      const type = r.type.padEnd(6);
      const kv = r.kv.toFixed(2).padStart(8);
      const noise = r.noise.toFixed(1).padStart(8);
      const status = r.status;
      console.log(`│ ${idx}   │ ${type}   │ ${kv}   │ ${noise}   │ ${status}   │`);
    }

    console.log('└───────┴──────────┴────────────┴────────────┴──────────┘');

    const successCount = results.filter(r => r.status.includes('成功')).length;
    console.log(`\n总计: ${count} 组 | 成功: ${successCount} 组 | 失败: ${count - successCount} 组`);
  }

  console.log('\n' + '█'.repeat(70));
  console.log('█' + ' '.repeat(25) + '测试完成' + ' '.repeat(35) + '█');
  console.log('█'.repeat(70) + '\n');
}

main();
