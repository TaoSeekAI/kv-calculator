/**
 * Excel比对工具
 * 读取Excel文件中的输入参数，使用Node.js计算后与Excel结果比对
 */

import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { KvCalculator } from '../src/kv-calculator.js';
import type { KvInput, FluidType, PressureUnit, FlowUnit, DensityUnit, FlowCharacteristic, ComparisonResult, ComparisonReport } from '../src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Excel单元格读取器
 */
class ExcelReader {
  private workbook: XLSX.WorkBook;

  constructor(filePath: string) {
    this.workbook = XLSX.readFile(filePath);
  }

  getSheet(name: string): XLSX.WorkSheet {
    return this.workbook.Sheets[name];
  }

  getCellValue(sheet: XLSX.WorkSheet, cell: string): any {
    const cellData = sheet[cell];
    return cellData ? cellData.v : undefined;
  }

  getNumericValue(sheet: XLSX.WorkSheet, cell: string): number {
    const value = this.getCellValue(sheet, cell);
    return typeof value === 'number' ? value : parseFloat(value) || 0;
  }

  getStringValue(sheet: XLSX.WorkSheet, cell: string): string {
    const value = this.getCellValue(sheet, cell);
    return String(value || '');
  }
}

/**
 * 从Kv计算表读取输入参数
 */
function readKvInputFromExcel(reader: ExcelReader): KvInput {
  const sheet = reader.getSheet('Kv计算');

  // 读取流体类型
  const fluidTypeStr = reader.getStringValue(sheet, 'D10');
  let fluidType: FluidType;
  if (fluidTypeStr.includes('液体')) {
    if (fluidTypeStr.includes('气体')) {
      fluidType = '两相流(液体+气体)';
    } else if (fluidTypeStr.includes('蒸汽')) {
      fluidType = '两相流(液体+蒸汽)';
    } else {
      fluidType = '液体';
    }
  } else if (fluidTypeStr === '气体') {
    fluidType = '气体';
  } else if (fluidTypeStr === '蒸汽') {
    fluidType = '蒸汽';
  } else {
    fluidType = '液体';
  }

  // 读取压力单位
  const pressureUnitStr = reader.getStringValue(sheet, 'D18') as PressureUnit;

  // 读取流量单位
  const flowUnitStr = reader.getStringValue(sheet, 'D14') as FlowUnit;

  // 读取密度单位
  const densityUnitStr = reader.getStringValue(sheet, 'D24') as DensityUnit;

  // 读取流量特性
  const flowCharStr = reader.getStringValue(sheet, 'D45');
  let flowChar: FlowCharacteristic = '等百分比';
  if (flowCharStr.includes('线性')) flowChar = '线性';
  else if (flowCharStr.includes('快开')) flowChar = '快开';

  return {
    fluidType,
    temperature: reader.getNumericValue(sheet, 'D11'),
    tempUnit: reader.getStringValue(sheet, 'D12') as any || '℃',
    flowRate: reader.getNumericValue(sheet, 'D13'),
    flowUnit: flowUnitStr || 'm3/h',
    P1: reader.getNumericValue(sheet, 'D17'),
    P2: reader.getNumericValue(sheet, 'D19'),
    pressureUnit: pressureUnitStr || 'MPa(G)',
    density: reader.getNumericValue(sheet, 'D23'),
    densityUnit: densityUnitStr || 'Kg/m3',
    viscosity: reader.getNumericValue(sheet, 'D32') || 1,
    viscosityUnit: reader.getStringValue(sheet, 'D33') as any || 'cP',
    viscosityType: '粘度',
    Z: reader.getNumericValue(sheet, 'D29') || 1,
    gamma: reader.getNumericValue(sheet, 'D30') || 1.4,
    Pc: reader.getNumericValue(sheet, 'D34') || 22.12,
    DN: reader.getNumericValue(sheet, 'D40'),
    seatSize: reader.getNumericValue(sheet, 'D41') || reader.getNumericValue(sheet, 'D40'),
    FL: reader.getNumericValue(sheet, 'D42') || 0.9,
    XT: reader.getNumericValue(sheet, 'D43') || 0.72,
    Fd: reader.getNumericValue(sheet, 'D44') || 0.42,
    flowChar,
    rangeability: reader.getNumericValue(sheet, 'D46') || 50,
    ratedKv: reader.getNumericValue(sheet, 'D49') || reader.getNumericValue(sheet, 'D48'),
    D1w: reader.getNumericValue(sheet, 'D127') || undefined,
    D1T: reader.getNumericValue(sheet, 'D129') || undefined,
    D2w: reader.getNumericValue(sheet, 'D128') || undefined,
    D2T: reader.getNumericValue(sheet, 'D130') || undefined
  };
}

/**
 * 从Excel读取预期结果
 */
function readExpectedResults(reader: ExcelReader): Record<string, number> {
  const sheet = reader.getSheet('Kv计算');

  return {
    'P1绝对压力(KPa)': reader.getNumericValue(sheet, 'D200'),
    'P2绝对压力(KPa)': reader.getNumericValue(sheet, 'D201'),
    '压差ΔP(KPa)': reader.getNumericValue(sheet, 'D202'),
    '入口绝对温度T1(K)': reader.getNumericValue(sheet, 'D37'),
    '相对密度': reader.getNumericValue(sheet, 'D27'),
    '饱和蒸汽压Pv(KPa)': reader.getNumericValue(sheet, 'D209'), // D209是KPa单位
    'FF系数': reader.getNumericValue(sheet, 'D88'),
    'D1内径': reader.getNumericValue(sheet, 'D125'),
    'D2内径': reader.getNumericValue(sheet, 'D126'),
    'FL': reader.getNumericValue(sheet, 'D85'),
    'FP': reader.getNumericValue(sheet, 'D86'),
    'FLP': reader.getNumericValue(sheet, 'D87'),
    'ΣK': reader.getNumericValue(sheet, 'D138'),
    '雷诺数Rev': reader.getNumericValue(sheet, 'D145'),
    'FR': reader.getNumericValue(sheet, 'D143'),
    '计算Kv': reader.getNumericValue(sheet, 'D52'),
    '阀门开度(%)': reader.getNumericValue(sheet, 'D54'),
    '出口流速(m/s)': reader.getNumericValue(sheet, 'D68'),
    '体积流量(m3/h)': reader.getNumericValue(sheet, 'D181'),
    '质量流量(Kg/h)': reader.getNumericValue(sheet, 'D182')
  };
}

/**
 * 比对单个值
 */
function compareValue(
  field: string,
  description: string,
  excelValue: number,
  calculatedValue: number,
  tolerance: number = 0.001
): ComparisonResult {
  const difference = Math.abs(excelValue - calculatedValue);
  const percentError = excelValue !== 0 ? difference / Math.abs(excelValue) * 100 : (calculatedValue === 0 ? 0 : 100);
  const passed = percentError <= tolerance * 100;

  return {
    field,
    description,
    excelValue,
    calculatedValue,
    difference,
    percentError,
    passed
  };
}

/**
 * 执行比对
 */
function runComparison(reader: ExcelReader): ComparisonReport {
  const calculator = new KvCalculator();

  // 读取输入参数
  const input = readKvInputFromExcel(reader);
  console.log('\n输入参数:');
  console.log(JSON.stringify(input, null, 2));

  // 计算
  const result = calculator.calculate(input);
  console.log('\n计算结果:');
  console.log(`计算Kv: ${result.calculatedKv}`);
  console.log(`阀门开度: ${result.valveOpening}%`);
  console.log(`流动状态: ${result.flowState}`);
  console.log(`紊流状态: ${result.turbulenceState}`);
  if (result.fluidState) console.log(`流体状态: ${result.fluidState}`);

  // 读取预期结果
  const expected = readExpectedResults(reader);

  // 比对
  const comparisons: ComparisonResult[] = [];

  // 压力相关
  comparisons.push(compareValue('P1Abs', 'P1绝对压力(KPa)', expected['P1绝对压力(KPa)'], result.intermediate.P1Abs));
  comparisons.push(compareValue('P2Abs', 'P2绝对压力(KPa)', expected['P2绝对压力(KPa)'], result.intermediate.P2Abs));
  comparisons.push(compareValue('deltaP', '压差ΔP(KPa)', expected['压差ΔP(KPa)'], result.intermediate.deltaP));

  // 温度相关
  comparisons.push(compareValue('T1', '入口绝对温度T1(K)', expected['入口绝对温度T1(K)'], result.intermediate.T1));

  // 液体特有参数
  if (input.fluidType === '液体') {
    if (result.intermediate.relativeDensity !== undefined) {
      comparisons.push(compareValue('relativeDensity', '相对密度', expected['相对密度'], result.intermediate.relativeDensity));
    }
    if (result.intermediate.Pv !== undefined && expected['饱和蒸汽压Pv(KPa)']) {
      comparisons.push(compareValue('Pv', '饱和蒸汽压Pv(KPa)', expected['饱和蒸汽压Pv(KPa)'], result.intermediate.Pv, 0.01));
    }
    if (result.intermediate.FF !== undefined && expected['FF系数']) {
      comparisons.push(compareValue('FF', 'FF系数', expected['FF系数'], result.intermediate.FF));
    }
  }

  // 管道内径
  comparisons.push(compareValue('D1', 'D1内径(mm)', expected['D1内径'], result.intermediate.D1));
  comparisons.push(compareValue('D2', 'D2内径(mm)', expected['D2内径'], result.intermediate.D2));

  // 管道系数
  comparisons.push(compareValue('FP', 'FP', expected['FP'], result.intermediate.FP));
  comparisons.push(compareValue('FLP', 'FLP', expected['FLP'], result.intermediate.FLP));
  comparisons.push(compareValue('sumK', 'ΣK', expected['ΣK'], result.intermediate.sumK));

  // 雷诺数
  if (expected['雷诺数Rev'] && result.intermediate.Rev) {
    comparisons.push(compareValue('Rev', '雷诺数Rev', expected['雷诺数Rev'], result.intermediate.Rev, 0.01));
  }
  if (expected['FR'] && result.intermediate.FR) {
    comparisons.push(compareValue('FR', 'FR', expected['FR'], result.intermediate.FR));
  }

  // 最终结果
  comparisons.push(compareValue('calculatedKv', '计算Kv', expected['计算Kv'], result.calculatedKv, 0.01));
  comparisons.push(compareValue('valveOpening', '阀门开度(%)', expected['阀门开度(%)'], result.valveOpening, 0.01));

  // 流量
  if (result.intermediate.volumeFlowM3h !== undefined && expected['体积流量(m3/h)']) {
    comparisons.push(compareValue('volumeFlow', '体积流量(m3/h)', expected['体积流量(m3/h)'], result.intermediate.volumeFlowM3h));
  }
  if (result.intermediate.massFlowKgh !== undefined && expected['质量流量(Kg/h)']) {
    comparisons.push(compareValue('massFlow', '质量流量(Kg/h)', expected['质量流量(Kg/h)'], result.intermediate.massFlowKgh));
  }

  // 汇总
  const passCount = comparisons.filter(c => c.passed).length;

  return {
    timestamp: new Date().toISOString(),
    sheetName: 'Kv计算',
    fluidType: input.fluidType,
    summary: {
      total: comparisons.length,
      passed: passCount,
      failed: comparisons.length - passCount,
      passRate: (passCount / comparisons.length * 100).toFixed(2) + '%'
    },
    details: comparisons
  };
}

/**
 * 生成报告
 */
function generateReport(report: ComparisonReport): void {
  // 1. 命令行表格输出
  console.log('\n========================================');
  console.log('           比对报告');
  console.log('========================================');
  console.log(`时间: ${report.timestamp}`);
  console.log(`流体类型: ${report.fluidType}`);
  console.log(`工作表: ${report.sheetName}`);
  console.log('----------------------------------------');

  const colWidths = { field: 20, desc: 25, excel: 15, calc: 15, err: 10, status: 6 };

  console.log(
    '| ' +
    '字段'.padEnd(colWidths.field) + ' | ' +
    '描述'.padEnd(colWidths.desc) + ' | ' +
    'Excel值'.padEnd(colWidths.excel) + ' | ' +
    '计算值'.padEnd(colWidths.calc) + ' | ' +
    '误差%'.padEnd(colWidths.err) + ' | ' +
    '状态'.padEnd(colWidths.status) + ' |'
  );
  console.log('-'.repeat(100));

  for (const r of report.details) {
    const status = r.passed ? '✓' : '✗';
    const excelStr = r.excelValue.toFixed(6).substring(0, colWidths.excel);
    const calcStr = r.calculatedValue.toFixed(6).substring(0, colWidths.calc);
    const errStr = r.percentError.toFixed(4).substring(0, colWidths.err);

    console.log(
      '| ' +
      r.field.padEnd(colWidths.field) + ' | ' +
      r.description.padEnd(colWidths.desc) + ' | ' +
      excelStr.padEnd(colWidths.excel) + ' | ' +
      calcStr.padEnd(colWidths.calc) + ' | ' +
      errStr.padEnd(colWidths.err) + ' | ' +
      status.padEnd(colWidths.status) + ' |'
    );
  }

  console.log('-'.repeat(100));
  console.log(`\n总计: ${report.summary.total} 项`);
  console.log(`通过: ${report.summary.passed} 项`);
  console.log(`失败: ${report.summary.failed} 项`);
  console.log(`通过率: ${report.summary.passRate}`);

  // 2. JSON文件输出
  const reportPath = path.join(__dirname, '..', 'comparison-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nJSON报告已保存至: ${reportPath}`);
}

/**
 * 主函数
 */
async function main() {
  const excelPath = path.join(__dirname, '..', 'Kv_calculate.xlsx');

  if (!fs.existsSync(excelPath)) {
    console.error(`Excel文件不存在: ${excelPath}`);
    process.exit(1);
  }

  console.log(`读取Excel文件: ${excelPath}`);
  const reader = new ExcelReader(excelPath);

  const report = runComparison(reader);
  generateReport(report);

  // 返回状态码
  if (report.summary.failed > 0) {
    console.log('\n存在比对失败项，请检查计算逻辑！');
    process.exit(1);
  } else {
    console.log('\n所有比对项通过！');
    process.exit(0);
  }
}

main().catch(console.error);
