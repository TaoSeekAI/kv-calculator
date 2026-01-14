#!/usr/bin/env bun
/**
 * Kv批量计算命令行工具
 *
 * 用法:
 *   bun cli/batch-calculate.ts <json文件路径> [选项]
 *
 * 示例:
 *   bun cli/batch-calculate.ts input.json
 *   bun cli/batch-calculate.ts input.json --output results.json
 *   bun cli/batch-calculate.ts input.json --detail
 */

import * as fs from 'fs';
import * as path from 'path';
import { KvCalculator } from '../src/kv-calculator.js';
import type { KvInput, KvResult } from '../src/types/index.js';

// 简化的输入格式（用户友好）
interface SimpleInput {
  // 基本信息
  name?: string;           // 测试用例名称
  fluidType: 'liquid' | 'gas' | 'steam' | '液体' | '气体' | '蒸汽';

  // 流量参数
  Q?: number;              // 体积流量 m³/h (液体/气体)
  Qn?: number;             // 标准体积流量 Nm³/h (气体)
  W?: number;              // 质量流量 Kg/h (蒸汽)
  flowUnit?: string;       // 流量单位，默认根据类型自动选择

  // 压力参数
  P1: number;              // 入口压力
  P2: number;              // 出口压力
  pressureUnit?: string;   // 压力单位，默认 'MPa(G)'

  // 温度参数
  temperature: number;     // 温度
  tempUnit?: string;       // 温度单位，默认 '℃'

  // 流体属性
  density: number;         // 密度 Kg/m³ 或 Kg/Nm³
  densityUnit?: string;    // 密度单位
  viscosity?: number;      // 粘度 cP (液体)
  M?: number;              // 分子量 (气体)
  Z?: number;              // 压缩系数 (气体)
  gamma?: number;          // 比热比
  Pc?: number;             // 临界压力 MPa (液体)

  // 阀门参数
  DN: number;              // 公称通径 mm
  seatSize?: number;       // 阀座尺寸 mm
  FL: number;              // 压力恢复系数
  XT?: number;             // 压差比系数
  Fd?: number;             // 阀门类型修正系数
  ratedKv: number;         // 额定Kv

  // 流量特性
  flowChar?: 'equal' | 'linear' | '等百分比' | '线性';
  rangeability?: number;   // 可调比

  // 管道参数
  D1?: number;             // 上游管道内径 mm
  D2?: number;             // 下游管道内径 mm
}

interface BatchInput {
  cases: SimpleInput[];
}

interface BatchResult {
  timestamp: string;
  totalCases: number;
  results: {
    name: string;
    input: SimpleInput;
    output: {
      calculatedKv: number;
      calculatedCv: number;
      valveOpening: number;
      flowState: string;
      turbulenceState: string;
      fluidState?: string;
      outletVelocity: number;
      usedFormula: string;
      noiseLevel?: number;        // 噪音级 dBA
      noiseFlowState?: string;    // 噪音流动状态
    };
    warnings?: string[];
    errors?: string[];
  }[];
}

// 智能判断温度单位
function detectTemperatureUnit(temp: number, specifiedUnit?: string): string {
  // 如果用户明确指定了单位，使用用户指定的
  if (specifiedUnit) {
    return specifiedUnit;
  }

  // 智能判断：
  // - 如果温度 > 200，很可能是开尔文 (K)
  // - 常见工业温度范围：摄氏 -50 ~ 500，开尔文 223 ~ 773
  // - 如果温度在 250-350 之间，需要根据上下文判断
  if (temp > 200) {
    // 可能是开尔文，给出提示
    console.log(`  ⚠️ 温度值 ${temp} 较大，自动识别为开尔文(K)`);
    return 'K';
  }

  return '℃';
}

// 转换简化输入为标准输入
function convertToStandardInput(simple: SimpleInput): KvInput {
  // 流体类型映射
  const fluidTypeMap: Record<string, any> = {
    'liquid': '液体',
    'gas': '气体',
    'steam': '蒸汽',
    '液体': '液体',
    '气体': '气体',
    '蒸汽': '蒸汽'
  };

  // 流量特性映射
  const flowCharMap: Record<string, any> = {
    'equal': '等百分比',
    'linear': '线性',
    '等百分比': '等百分比',
    '线性': '线性'
  };

  const fluidType = fluidTypeMap[simple.fluidType] || '液体';

  // 智能判断温度单位
  const tempUnit = detectTemperatureUnit(simple.temperature, simple.tempUnit);

  // 根据流体类型确定流量和单位
  let flowRate: number;
  let flowUnit: string;

  if (fluidType === '液体') {
    flowRate = simple.Q || 0;
    flowUnit = simple.flowUnit || 'm3/h';
  } else if (fluidType === '气体') {
    flowRate = simple.Qn || simple.Q || 0;
    flowUnit = simple.flowUnit || 'Nm3/h';
  } else {
    flowRate = simple.W || 0;
    flowUnit = simple.flowUnit || 'Kg/h';
  }

  return {
    fluidType,
    temperature: simple.temperature,
    tempUnit: tempUnit as any,
    flowRate,
    flowUnit: flowUnit as any,
    P1: simple.P1,
    P2: simple.P2,
    pressureUnit: (simple.pressureUnit || 'MPa(G)') as any,
    density: simple.density,
    densityUnit: (simple.densityUnit || (fluidType === '气体' ? 'Kg/Nm3' : 'Kg/m3')) as any,
    viscosity: simple.viscosity || 1,
    viscosityUnit: 'cP',
    viscosityType: '粘度',
    molecularWeight: simple.M,
    Z: simple.Z || 1,
    gamma: simple.gamma || 1.4,
    Pc: simple.Pc || 22.12,
    DN: simple.DN,
    seatSize: simple.seatSize || simple.DN,
    FL: simple.FL,
    XT: simple.XT || 0.72,
    Fd: simple.Fd || 0.42,
    flowChar: flowCharMap[simple.flowChar || 'equal'] || '等百分比',
    rangeability: simple.rangeability || 50,
    ratedKv: simple.ratedKv,
    D1w: simple.D1 ? undefined : undefined,
    D1T: simple.D1 ? undefined : undefined,
    D2w: simple.D2 ? undefined : undefined,
    D2T: simple.D2 ? undefined : undefined
  };
}

// 打印详细计算过程
function printDetailedResult(name: string, input: SimpleInput, result: KvResult) {
  console.log('\n' + '═'.repeat(60));
  console.log(`  ${name}`);
  console.log('═'.repeat(60));

  console.log('\n【输入参数】');
  console.log(`  流体类型: ${input.fluidType}`);
  if (input.Q) console.log(`  流量Q: ${input.Q} m³/h`);
  if (input.Qn) console.log(`  标准流量Qn: ${input.Qn} Nm³/h`);
  if (input.W) console.log(`  质量流量W: ${input.W} Kg/h`);
  console.log(`  入口压力P1: ${input.P1} ${input.pressureUnit || 'MPa(G)'}`);
  console.log(`  出口压力P2: ${input.P2} ${input.pressureUnit || 'MPa(G)'}`);
  console.log(`  温度: ${input.temperature} ${input.tempUnit || '℃'}`);
  console.log(`  密度: ${input.density} ${input.densityUnit || 'Kg/m³'}`);
  console.log(`  DN: ${input.DN}mm, FL: ${input.FL}, 额定Kv: ${input.ratedKv}`);

  console.log('\n【中间计算值】');
  console.log(`  P1绝对压力: ${result.intermediate.P1Abs.toFixed(2)} KPa`);
  console.log(`  P2绝对压力: ${result.intermediate.P2Abs.toFixed(2)} KPa`);
  console.log(`  压差ΔP: ${result.intermediate.deltaP.toFixed(2)} KPa`);
  console.log(`  绝对温度T1: ${result.intermediate.T1.toFixed(2)} K`);
  if (result.intermediate.relativeDensity !== undefined) {
    console.log(`  相对密度: ${result.intermediate.relativeDensity.toFixed(6)}`);
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
  if (result.intermediate.Y !== undefined) {
    console.log(`  膨胀系数Y: ${result.intermediate.Y.toFixed(6)}`);
  }
  console.log(`  FP: ${result.intermediate.FP.toFixed(6)}`);
  console.log(`  FLP: ${result.intermediate.FLP.toFixed(6)}`);
  console.log(`  ΣK: ${result.intermediate.sumK.toFixed(6)}`);

  console.log('\n【计算结果】');
  console.log(`  ★ 计算Kv: ${result.calculatedKv.toFixed(4)}`);
  console.log(`  ★ 计算Cv: ${result.calculatedCv.toFixed(4)}`);
  console.log(`  ★ 阀门开度: ${result.valveOpening.toFixed(2)}%`);
  console.log(`  ★ 流动状态: ${result.flowState}`);
  console.log(`  ★ 紊流状态: ${result.turbulenceState}`);
  if (result.fluidState) {
    console.log(`  ★ 流体状态: ${result.fluidState}`);
  }
  console.log(`  ★ 出口流速: ${result.outletVelocity.toFixed(2)} m/s`);
  console.log(`  ★ 使用公式: ${result.usedFormula}`);
  if (result.noise !== undefined) {
    console.log(`  ★ 噪音级: ${result.noise.toFixed(1)} dBA`);
  }

  if (result.warnings?.length) {
    console.log('\n【警告】');
    result.warnings.forEach(w => console.log(`  ⚠️ ${w}`));
  }
  if (result.errors?.length) {
    console.log('\n【错误】');
    result.errors.forEach(e => console.log(`  ❌ ${e}`));
  }
}

// 打印简洁表格
function printSummaryTable(results: BatchResult) {
  console.log('\n' + '═'.repeat(115));
  console.log('  批量计算结果汇总');
  console.log('═'.repeat(115));

  console.log('\n| 序号 | 名称                 | 流体   | Kv计算    | Cv计算    | 开度%   | 流动状态   | 噪音dBA | 公式  |');
  console.log('|------|----------------------|--------|-----------|-----------|---------|------------|---------|-------|');

  results.results.forEach((r, i) => {
    const name = (r.name || `Case${i+1}`).substring(0, 20).padEnd(20);
    const fluid = r.input.fluidType.toString().substring(0, 6).padEnd(6);
    const kv = r.output.calculatedKv.toFixed(2).padStart(9);
    const cv = r.output.calculatedCv.toFixed(2).padStart(9);
    const opening = r.output.valveOpening.toFixed(1).padStart(7);
    const state = r.output.flowState.padEnd(10);
    const noise = r.output.noiseLevel !== undefined ? r.output.noiseLevel.toFixed(1).padStart(7) : '    N/A';
    const formula = r.output.usedFormula.substring(0, 5).padEnd(5);

    console.log(`| ${String(i+1).padStart(4)} | ${name} | ${fluid} | ${kv} | ${cv} | ${opening} | ${state} | ${noise} | ${formula} |`);
  });

  console.log('\n总计: ' + results.totalCases + ' 个测试用例');
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Kv批量计算命令行工具

用法:
  npx tsx cli/batch-calculate.ts <json文件> [选项]

选项:
  --output, -o <文件>   输出结果到JSON文件
  --detail, -d          显示详细计算过程
  --noise, -n           计算噪音级(dBA)
  --help, -h            显示帮助信息

JSON文件格式:
{
  "cases": [
    {
      "name": "测试用例1",
      "fluidType": "liquid",    // liquid | gas | steam
      "Q": 80,                  // 液体体积流量 m³/h
      "P1": 1.5,                // 入口压力 MPa(G)
      "P2": 0.2,                // 出口压力 MPa(G)
      "temperature": 40,        // 温度 ℃
      "density": 995,           // 密度 Kg/m³
      "DN": 100,                // 公称通径 mm
      "FL": 0.85,               // 压力恢复系数
      "ratedKv": 250            // 额定Kv
    }
  ]
}

示例:
  npx tsx cli/batch-calculate.ts test-cases.json
  npx tsx cli/batch-calculate.ts test-cases.json -o results.json -d
`);
    process.exit(0);
  }

  const jsonFile = args[0];
  const showDetail = args.includes('--detail') || args.includes('-d');
  const outputIndex = args.findIndex(a => a === '--output' || a === '-o');
  const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : null;

  // 读取JSON文件
  if (!fs.existsSync(jsonFile)) {
    console.error(`错误: 文件不存在 - ${jsonFile}`);
    process.exit(1);
  }

  let batchInput: BatchInput;
  try {
    const content = fs.readFileSync(jsonFile, 'utf-8');
    batchInput = JSON.parse(content);
  } catch (e) {
    console.error(`错误: JSON解析失败 - ${e}`);
    process.exit(1);
  }

  if (!batchInput.cases || !Array.isArray(batchInput.cases)) {
    console.error('错误: JSON文件必须包含 "cases" 数组');
    process.exit(1);
  }

  console.log(`\n读取 ${batchInput.cases.length} 个测试用例...`);

  // 批量计算
  const calculator = new KvCalculator();
  const batchResult: BatchResult = {
    timestamp: new Date().toISOString(),
    totalCases: batchInput.cases.length,
    results: []
  };

  // 检查是否计算噪音
  const calcNoise = args.includes('--noise') || args.includes('-n');

  batchInput.cases.forEach((simpleInput, index) => {
    const name = simpleInput.name || `Case ${index + 1}`;
    console.log(`计算中: ${name}...`);

    try {
      const standardInput = convertToStandardInput(simpleInput);
      const result = calculator.calculateWithNoise(standardInput, calcNoise);

      batchResult.results.push({
        name,
        input: simpleInput,
        output: {
          calculatedKv: result.calculatedKv,
          calculatedCv: result.calculatedCv,
          valveOpening: result.valveOpening,
          flowState: result.flowState,
          turbulenceState: result.turbulenceState,
          fluidState: result.fluidState,
          outletVelocity: result.outletVelocity,
          usedFormula: result.usedFormula,
          noiseLevel: result.noise,
          noiseFlowState: result.noiseResult?.flowState
        },
        warnings: result.warnings,
        errors: result.errors
      });

      if (showDetail) {
        printDetailedResult(name, simpleInput, result);
      }
    } catch (e: any) {
      batchResult.results.push({
        name,
        input: simpleInput,
        output: {
          calculatedKv: 0,
          calculatedCv: 0,
          valveOpening: 0,
          flowState: '错误',
          turbulenceState: '错误',
          outletVelocity: 0,
          usedFormula: '错误'
        },
        errors: [e.message || String(e)]
      });
      console.error(`  错误: ${e.message}`);
    }
  });

  // 打印汇总表格
  printSummaryTable(batchResult);

  // 输出到文件
  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(batchResult, null, 2));
    console.log(`\n结果已保存到: ${outputFile}`);
  }

  console.log('\n计算完成！');
}

main();
