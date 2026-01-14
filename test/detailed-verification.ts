#!/usr/bin/env bun
/**
 * 详细计算过程验证脚本
 * 显示每一步计算公式和结果，便于手动验证
 *
 * 运行: bun test/detailed-verification.ts
 */

import { CONSTANTS } from '../src/constants/index.js';

// ==================== 输入参数 ====================
// 您可以修改这里的参数进行测试
const INPUT = {
  // 流体类型: 'liquid' | 'gas' | 'steam'
  fluidType: 'liquid' as 'liquid' | 'gas' | 'steam',

  // 基本参数
  Q: 80,              // 体积流量 m³/h (液体)
  P1_gauge: 1.5,      // 入口表压 MPa(G)
  P2_gauge: 0.2,      // 出口表压 MPa(G)
  temperature: 40,    // 温度 ℃
  density: 995,       // 密度 Kg/m³
  viscosity: 0.8,     // 动力粘度 cP

  // 阀门参数
  DN: 100,            // 公称通径 mm
  seatSize: 100,      // 阀座尺寸 mm
  FL: 0.85,           // 压力恢复系数
  XT: 0.70,           // 压差比系数
  Fd: 0.46,           // 阀门类型修正系数
  Pc: 22.12,          // 临界压力 MPa (水)

  // 额定参数
  ratedKv: 250,       // 额定Kv
  rangeability: 50,   // 可调比 R
  flowChar: 'equal' as 'equal' | 'linear',  // 流量特性

  // 管道参数 (如果等于DN则无异径管)
  D1: 100,            // 上游管道内径 mm
  D2: 100,            // 下游管道内径 mm

  // 气体专用参数
  M: 29,              // 分子量 (气体用)
  Z: 1,               // 压缩系数
  gamma: 1.4,         // 比热比
  Qn: 3000,           // 标准体积流量 Nm³/h (气体)

  // 蒸汽专用参数
  W: 1500,            // 质量流量 Kg/h (蒸汽)
};

// ==================== 计算过程 ====================

function printHeader(title: string) {
  console.log('\n' + '═'.repeat(60));
  console.log(`  ${title}`);
  console.log('═'.repeat(60));
}

function printStep(step: number, description: string, formula: string, calculation: string, result: number | string, unit: string = '') {
  console.log(`\n【步骤 ${step}】${description}`);
  console.log(`  公式: ${formula}`);
  console.log(`  计算: ${calculation}`);
  console.log(`  结果: ${typeof result === 'number' ? result.toFixed(6) : result} ${unit}`);
}

function runLiquidCalculation() {
  printHeader('液体 Kv 详细计算过程');

  const { Q, P1_gauge, P2_gauge, temperature, density, viscosity, DN, seatSize, FL, Fd, Pc, ratedKv, rangeability, D1, D2 } = INPUT;
  const d = seatSize;

  let step = 0;

  // ===== 第一部分: 单位转换 =====
  console.log('\n' + '-'.repeat(40));
  console.log('  第一部分: 单位转换');
  console.log('-'.repeat(40));

  step++;
  const P_atm = 0.1; // 大气压 MPa
  const P1 = (P1_gauge + P_atm) * 1000; // KPa
  printStep(step, 'P1 绝对压力转换',
    'P1(KPa) = (P1_gauge + 0.1) × 1000',
    `(${P1_gauge} + 0.1) × 1000`,
    P1, 'KPa');

  step++;
  const P2 = (P2_gauge + P_atm) * 1000; // KPa
  printStep(step, 'P2 绝对压力转换',
    'P2(KPa) = (P2_gauge + 0.1) × 1000',
    `(${P2_gauge} + 0.1) × 1000`,
    P2, 'KPa');

  step++;
  const deltaP = P1 - P2;
  printStep(step, '压差计算',
    'ΔP = P1 - P2',
    `${P1} - ${P2}`,
    deltaP, 'KPa');

  step++;
  const T1 = temperature + 273.15;
  printStep(step, '绝对温度转换',
    'T1(K) = T(℃) + 273.15',
    `${temperature} + 273.15`,
    T1, 'K');

  step++;
  const relativeDensity = density / CONSTANTS.WATER_DENSITY;
  printStep(step, '相对密度计算',
    'ρ/ρ0 = ρ / 1000',
    `${density} / 1000`,
    relativeDensity, '');

  step++;
  const nu = (viscosity / 1000) / density; // m²/s
  printStep(step, '运动粘度计算',
    'ν(m²/s) = μ(Pa·s) / ρ = (cP/1000) / ρ',
    `(${viscosity}/1000) / ${density}`,
    nu, 'm²/s');

  // ===== 第二部分: 饱和蒸汽压计算 =====
  console.log('\n' + '-'.repeat(40));
  console.log('  第二部分: 饱和蒸汽压计算 (安托因方程)');
  console.log('-'.repeat(40));

  step++;
  const { A, B, C } = CONSTANTS.ANTOINE;
  const logPv = A - B / (C + temperature);
  printStep(step, '安托因方程计算 log10(Pv)',
    'log10(Pv) = A - B/(C + T)',
    `${A} - ${B}/(${C} + ${temperature}) = ${A} - ${B}/${C + temperature}`,
    logPv, '');

  step++;
  const Pv = Math.pow(10, logPv);
  printStep(step, '饱和蒸汽压 Pv',
    'Pv = 10^(log10Pv)',
    `10^${logPv.toFixed(6)}`,
    Pv, 'KPa');

  // ===== 第三部分: 临界压力比系数 FF =====
  console.log('\n' + '-'.repeat(40));
  console.log('  第三部分: 临界压力比系数 FF');
  console.log('-'.repeat(40));

  step++;
  const Pc_KPa = Pc * 1000;
  const FF = 0.96 - 0.28 * Math.sqrt(Pv / Pc_KPa);
  printStep(step, 'FF 系数计算',
    'FF = 0.96 - 0.28 × √(Pv/Pc)',
    `0.96 - 0.28 × √(${Pv.toFixed(4)}/${Pc_KPa}) = 0.96 - 0.28 × ${Math.sqrt(Pv/Pc_KPa).toFixed(6)}`,
    FF, '');

  // ===== 第四部分: 管件阻力系数 =====
  console.log('\n' + '-'.repeat(40));
  console.log('  第四部分: 管件阻力系数');
  console.log('-'.repeat(40));

  let sumK = 0;
  let FP = 1;
  let FLP = FL;

  if (Math.abs(d - D1) < 0.1 && Math.abs(d - D2) < 0.1) {
    step++;
    console.log(`\n【步骤 ${step}】管件阻力系数判断`);
    console.log(`  d=${d}mm, D1=${D1}mm, D2=${D2}mm`);
    console.log(`  d = D1 = D2，无异径管，ΣK = 0`);
    console.log(`  FP = 1, FLP = FL = ${FL}`);
  } else {
    step++;
    const K1 = 0.5 * Math.pow(1 - Math.pow(d/D1, 2), 2);
    printStep(step, 'K1 入口收缩系数',
      'K1 = 0.5 × (1 - (d/D1)²)²',
      `0.5 × (1 - (${d}/${D1})²)² = 0.5 × (1 - ${Math.pow(d/D1,2).toFixed(6)})²`,
      K1, '');

    step++;
    const K2 = 1.0 * Math.pow(1 - Math.pow(d/D2, 2), 2);
    printStep(step, 'K2 出口扩大系数',
      'K2 = 1.0 × (1 - (d/D2)²)²',
      `1.0 × (1 - (${d}/${D2})²)²`,
      K2, '');

    step++;
    const KB1 = 1 - Math.pow(d/D1, 4);
    printStep(step, 'KB1 伯努利系数',
      'KB1 = 1 - (d/D1)⁴',
      `1 - (${d}/${D1})⁴`,
      KB1, '');

    step++;
    const KB2 = 1 - Math.pow(d/D2, 4);
    printStep(step, 'KB2 伯努利系数',
      'KB2 = 1 - (d/D2)⁴',
      `1 - (${d}/${D2})⁴`,
      KB2, '');

    step++;
    sumK = K1 + K2 + KB1 - KB2;
    printStep(step, '管件阻力系数之和 ΣK',
      'ΣK = K1 + K2 + KB1 - KB2',
      `${K1.toFixed(6)} + ${K2.toFixed(6)} + ${KB1.toFixed(6)} - ${KB2.toFixed(6)}`,
      sumK, '');

    step++;
    const Ci = ratedKv * 1.3;
    const N2 = CONSTANTS.N2;
    const fpTerm = sumK / N2 * Math.pow(Ci / (d * d), 2);
    FP = 1 / Math.sqrt(1 + fpTerm);
    printStep(step, 'FP 管道几何形状系数',
      'FP = 1 / √(1 + ΣK/N2 × (Ci/d²)²)',
      `1 / √(1 + ${sumK.toFixed(6)}/${N2} × (${Ci}/${d*d})²)`,
      FP, '');

    step++;
    const flpTerm = FL * FL / N2 * sumK * Math.pow(Ci / (d * d), 2);
    FLP = FL / Math.sqrt(1 + flpTerm);
    printStep(step, 'FLP 复合系数',
      'FLP = FL / √(1 + FL²/N2 × ΣK × (Ci/d²)²)',
      `${FL} / √(1 + ${FL}²/${N2} × ${sumK.toFixed(6)} × (${Ci}/${d*d})²)`,
      FLP, '');
  }

  // ===== 第五部分: 流动状态判定 =====
  console.log('\n' + '-'.repeat(40));
  console.log('  第五部分: 流动状态判定');
  console.log('-'.repeat(40));

  step++;
  const criticalDeltaP_noFitting = FL * FL * (P1 - FF * Pv);
  printStep(step, '临界压差 (无接管)',
    'ΔPcrit = FL² × (P1 - FF×Pv)',
    `${FL}² × (${P1} - ${FF.toFixed(6)}×${Pv.toFixed(4)}) = ${FL*FL} × ${(P1 - FF*Pv).toFixed(4)}`,
    criticalDeltaP_noFitting, 'KPa');

  step++;
  const flowState = deltaP < criticalDeltaP_noFitting ? '非阻塞流' : '阻塞流';
  console.log(`\n【步骤 ${step}】流动状态判定`);
  console.log(`  判定条件: ΔP < ΔPcrit ?`);
  console.log(`  ${deltaP} < ${criticalDeltaP_noFitting.toFixed(4)} ?`);
  console.log(`  结果: ${deltaP < criticalDeltaP_noFitting ? '是' : '否'} → ${flowState}`);

  // ===== 第六部分: Kv 计算 =====
  console.log('\n' + '-'.repeat(40));
  console.log('  第六部分: Kv 计算');
  console.log('-'.repeat(40));

  const N1 = CONSTANTS.N1;
  let Kv: number;
  let formula: string;

  if (flowState === '非阻塞流') {
    step++;
    Kv = Q / N1 * Math.sqrt(relativeDensity / deltaP);
    formula = 'C1';
    printStep(step, 'Kv 计算 (C1: 非阻塞流，无接管)',
      'Kv = Q/N1 × √(ρ/ρ0 / ΔP)',
      `${Q}/${N1} × √(${relativeDensity.toFixed(6)} / ${deltaP})`,
      Kv, '');

    console.log(`\n  详细展开:`);
    console.log(`    Q/N1 = ${Q}/${N1} = ${(Q/N1).toFixed(6)}`);
    console.log(`    ρ/ρ0 / ΔP = ${relativeDensity.toFixed(6)} / ${deltaP} = ${(relativeDensity/deltaP).toFixed(10)}`);
    console.log(`    √(...) = ${Math.sqrt(relativeDensity/deltaP).toFixed(6)}`);
    console.log(`    Kv = ${(Q/N1).toFixed(6)} × ${Math.sqrt(relativeDensity/deltaP).toFixed(6)} = ${Kv.toFixed(6)}`);
  } else {
    step++;
    Kv = Q / (N1 * FL) * Math.sqrt(relativeDensity / (P1 - FF * Pv));
    formula = 'C3';
    printStep(step, 'Kv 计算 (C3: 阻塞流，无接管)',
      'Kv = Q/(N1×FL) × √(ρ/ρ0 / (P1 - FF×Pv))',
      `${Q}/(${N1}×${FL}) × √(${relativeDensity.toFixed(6)} / (${P1} - ${FF.toFixed(6)}×${Pv.toFixed(4)}))`,
      Kv, '');

    console.log(`\n  详细展开:`);
    console.log(`    Q/(N1×FL) = ${Q}/(${N1}×${FL}) = ${(Q/(N1*FL)).toFixed(6)}`);
    console.log(`    P1 - FF×Pv = ${P1} - ${(FF*Pv).toFixed(4)} = ${(P1-FF*Pv).toFixed(4)}`);
    console.log(`    ρ/ρ0 / (...) = ${relativeDensity.toFixed(6)} / ${(P1-FF*Pv).toFixed(4)} = ${(relativeDensity/(P1-FF*Pv)).toFixed(10)}`);
    console.log(`    √(...) = ${Math.sqrt(relativeDensity/(P1-FF*Pv)).toFixed(6)}`);
    console.log(`    Kv = ${(Q/(N1*FL)).toFixed(6)} × ${Math.sqrt(relativeDensity/(P1-FF*Pv)).toFixed(6)} = ${Kv.toFixed(6)}`);
  }

  // ===== 第七部分: 阀门开度计算 =====
  console.log('\n' + '-'.repeat(40));
  console.log('  第七部分: 阀门开度计算');
  console.log('-'.repeat(40));

  step++;
  const m = ratedKv / Kv;
  printStep(step, '比值 m 计算',
    'm = Kv额定 / Kv计算',
    `${ratedKv} / ${Kv.toFixed(6)}`,
    m, '');

  step++;
  const R = rangeability;
  let opening: number;
  if (INPUT.flowChar === 'equal') {
    opening = (1 - Math.log10(m) / Math.log10(R)) * 100;
    printStep(step, '等百分比开度计算',
      '开度% = (1 - log10(m)/log10(R)) × 100',
      `(1 - log10(${m.toFixed(6)})/log10(${R})) × 100 = (1 - ${Math.log10(m).toFixed(6)}/${Math.log10(R).toFixed(6)}) × 100`,
      opening, '%');
  } else {
    opening = (R - m) / ((R - 1) * m) * 100;
    printStep(step, '线性开度计算',
      '开度% = (R - m) / ((R-1)×m) × 100',
      `(${R} - ${m.toFixed(6)}) / ((${R}-1)×${m.toFixed(6)}) × 100`,
      opening, '%');
  }

  // ===== 第八部分: 液体状态判定 =====
  console.log('\n' + '-'.repeat(40));
  console.log('  第八部分: 液体状态判定 (气蚀/空化/闪蒸)');
  console.log('-'.repeat(40));

  step++;
  const xF = (P1 - P2) / (P1 - Pv);
  printStep(step, '压差比 xF',
    'xF = (P1 - P2) / (P1 - Pv)',
    `(${P1} - ${P2}) / (${P1} - ${Pv.toFixed(4)})`,
    xF, '');

  step++;
  const FL2 = FL * FL;
  printStep(step, 'FL²',
    'FL² = FL × FL',
    `${FL} × ${FL}`,
    FL2, '');

  step++;
  let fluidState: string;
  if (xF <= 0.5 * FL2) {
    fluidState = '无气蚀';
  } else if (xF <= FL2) {
    fluidState = '初始气蚀';
  } else if (xF <= 1) {
    fluidState = '空化';
  } else {
    fluidState = '闪蒸';
  }
  console.log(`\n【步骤 ${step}】液体状态判定`);
  console.log(`  xF = ${xF.toFixed(6)}`);
  console.log(`  FL² = ${FL2.toFixed(6)}`);
  console.log(`  判定: xF ≤ 0.5×FL² → 无气蚀`);
  console.log(`         0.5×FL² < xF ≤ FL² → 初始气蚀`);
  console.log(`         FL² < xF ≤ 1 → 空化`);
  console.log(`         xF > 1 → 闪蒸`);
  console.log(`  结果: ${fluidState}`);

  // ===== 最终结果汇总 =====
  printHeader('计算结果汇总');

  console.log('\n【输入参数】');
  console.log(`  流量 Q = ${Q} m³/h`);
  console.log(`  入口压力 P1 = ${P1_gauge} MPa(G) = ${P1} KPa(A)`);
  console.log(`  出口压力 P2 = ${P2_gauge} MPa(G) = ${P2} KPa(A)`);
  console.log(`  温度 T = ${temperature} ℃ = ${T1} K`);
  console.log(`  密度 ρ = ${density} Kg/m³`);
  console.log(`  粘度 μ = ${viscosity} cP`);
  console.log(`  阀门口径 d = ${d} mm`);
  console.log(`  FL = ${FL}, Fd = ${Fd}`);
  console.log(`  额定Kv = ${ratedKv}`);

  console.log('\n【关键中间值】');
  console.log(`  压差 ΔP = ${deltaP} KPa`);
  console.log(`  相对密度 ρ/ρ0 = ${relativeDensity.toFixed(6)}`);
  console.log(`  饱和蒸汽压 Pv = ${Pv.toFixed(4)} KPa`);
  console.log(`  临界压力比系数 FF = ${FF.toFixed(6)}`);
  console.log(`  管件阻力系数 ΣK = ${sumK.toFixed(6)}`);
  console.log(`  FP = ${FP.toFixed(6)}`);
  console.log(`  FLP = ${FLP.toFixed(6)}`);
  console.log(`  临界压差 ΔPcrit = ${criticalDeltaP_noFitting.toFixed(4)} KPa`);

  console.log('\n【最终结果】');
  console.log(`  ★ 计算Kv = ${Kv.toFixed(4)}`);
  console.log(`  ★ 阀门开度 = ${opening.toFixed(2)}%`);
  console.log(`  ★ 流动状态: ${flowState}`);
  console.log(`  ★ 液体状态: ${fluidState}`);
  console.log(`  ★ 使用公式: ${formula}`);

  // 验证提示
  console.log('\n' + '─'.repeat(60));
  console.log('【手动验证提示】');
  console.log('─'.repeat(60));
  console.log(`\n您可以用计算器验证以下关键步骤:`);
  console.log(`\n1. Kv计算 (${formula}公式):`);
  if (flowState === '非阻塞流') {
    console.log(`   Kv = ${Q} / ${N1} × √(${relativeDensity.toFixed(6)} / ${deltaP})`);
    console.log(`      = ${(Q/N1).toFixed(4)} × √${(relativeDensity/deltaP).toFixed(10)}`);
    console.log(`      = ${(Q/N1).toFixed(4)} × ${Math.sqrt(relativeDensity/deltaP).toFixed(6)}`);
    console.log(`      = ${Kv.toFixed(4)}`);
  } else {
    console.log(`   Kv = ${Q} / (${N1} × ${FL}) × √(${relativeDensity.toFixed(6)} / ${(P1-FF*Pv).toFixed(4)})`);
    console.log(`      = ${(Q/(N1*FL)).toFixed(4)} × √${(relativeDensity/(P1-FF*Pv)).toFixed(10)}`);
    console.log(`      = ${(Q/(N1*FL)).toFixed(4)} × ${Math.sqrt(relativeDensity/(P1-FF*Pv)).toFixed(6)}`);
    console.log(`      = ${Kv.toFixed(4)}`);
  }

  console.log(`\n2. 开度计算:`);
  console.log(`   m = ${ratedKv} / ${Kv.toFixed(4)} = ${m.toFixed(4)}`);
  console.log(`   开度 = (1 - log10(${m.toFixed(4)}) / log10(${R})) × 100`);
  console.log(`        = (1 - ${Math.log10(m).toFixed(6)} / ${Math.log10(R).toFixed(6)}) × 100`);
  console.log(`        = ${opening.toFixed(2)}%`);
}

function runGasCalculation() {
  printHeader('气体 Kv 详细计算过程');

  const { Qn, P1_gauge, P2_gauge, temperature, M, Z, gamma, DN, seatSize, XT, ratedKv, rangeability, D1, D2 } = INPUT;
  const d = seatSize;

  let step = 0;

  // 压力转换
  console.log('\n' + '-'.repeat(40));
  console.log('  第一部分: 单位转换');
  console.log('-'.repeat(40));

  step++;
  const P1 = (P1_gauge + 0.1) * 1000;
  printStep(step, 'P1 绝对压力', 'P1 = (P1_gauge + 0.1) × 1000', `(${P1_gauge} + 0.1) × 1000`, P1, 'KPa');

  step++;
  const P2 = (P2_gauge + 0.1) * 1000;
  printStep(step, 'P2 绝对压力', 'P2 = (P2_gauge + 0.1) × 1000', `(${P2_gauge} + 0.1) × 1000`, P2, 'KPa');

  step++;
  const deltaP = P1 - P2;
  printStep(step, '压差', 'ΔP = P1 - P2', `${P1} - ${P2}`, deltaP, 'KPa');

  step++;
  const T1 = temperature + 273.15;
  printStep(step, '绝对温度', 'T1 = T + 273.15', `${temperature} + 273.15`, T1, 'K');

  // 气体特性参数
  console.log('\n' + '-'.repeat(40));
  console.log('  第二部分: 气体特性参数');
  console.log('-'.repeat(40));

  step++;
  const x = deltaP / P1;
  printStep(step, '压差比 x', 'x = ΔP / P1', `${deltaP} / ${P1}`, x, '');

  step++;
  const Fgamma = gamma / 1.4;
  printStep(step, '比热比系数 Fγ', 'Fγ = γ / 1.4', `${gamma} / 1.4`, Fgamma, '');

  step++;
  const xT_Fgamma = Fgamma * XT;
  printStep(step, '临界压差比', 'Fγ × xT', `${Fgamma.toFixed(6)} × ${XT}`, xT_Fgamma, '');

  step++;
  const flowState = x < xT_Fgamma ? '非阻塞流' : '阻塞流';
  console.log(`\n【步骤 ${step}】流动状态判定`);
  console.log(`  x < Fγ×xT ?`);
  console.log(`  ${x.toFixed(6)} < ${xT_Fgamma.toFixed(6)} ?`);
  console.log(`  结果: ${x < xT_Fgamma ? '是' : '否'} → ${flowState}`);

  step++;
  let Y = 1 - x / (3 * Fgamma * XT);
  Y = Math.max(Y, 0.667);
  printStep(step, '膨胀系数 Y', 'Y = 1 - x/(3×Fγ×xT), 最小0.667',
    `1 - ${x.toFixed(6)}/(3×${Fgamma.toFixed(6)}×${XT})`, Y, '');

  // Kv计算
  console.log('\n' + '-'.repeat(40));
  console.log('  第三部分: Kv 计算');
  console.log('-'.repeat(40));

  const N9 = CONSTANTS.N9;
  let Kv: number;

  if (flowState === '非阻塞流') {
    step++;
    Kv = Qn / (N9 * P1 * Y) * Math.sqrt(22.4 * M * Z * T1 / x);
    printStep(step, 'Kv (非阻塞流)',
      'Kv = Qn/(N9×P1×Y) × √(22.4×M×Z×T1/x)',
      `${Qn}/(${N9}×${P1}×${Y.toFixed(6)}) × √(22.4×${M}×${Z}×${T1}/${x.toFixed(6)})`,
      Kv, '');
  } else {
    step++;
    Kv = Qn / (0.667 * N9 * P1) * Math.sqrt(22.4 * M * Z * T1 / (XT * Fgamma));
    printStep(step, 'Kv (阻塞流)',
      'Kv = Qn/(0.667×N9×P1) × √(22.4×M×Z×T1/(xT×Fγ))',
      `${Qn}/(0.667×${N9}×${P1}) × √(22.4×${M}×${Z}×${T1}/(${XT}×${Fgamma.toFixed(6)}))`,
      Kv, '');
  }

  // 开度计算
  step++;
  const m = ratedKv / Kv;
  const opening = (1 - Math.log10(m) / Math.log10(rangeability)) * 100;
  printStep(step, '阀门开度', '开度 = (1 - log10(m)/log10(R)) × 100',
    `(1 - log10(${m.toFixed(4)})/log10(${rangeability})) × 100`, opening, '%');

  // 汇总
  printHeader('计算结果汇总');
  console.log(`  ★ 计算Kv = ${Kv.toFixed(4)}`);
  console.log(`  ★ 阀门开度 = ${opening.toFixed(2)}%`);
  console.log(`  ★ 流动状态: ${flowState}`);
  console.log(`  ★ 膨胀系数Y = ${Y.toFixed(6)}`);
  console.log(`  ★ 压差比x = ${x.toFixed(6)}`);
}

// 主程序
console.log('\n');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║       Kv计算详细过程验证 - 可用于手动核对                ║');
console.log('╚══════════════════════════════════════════════════════════╝');

console.log('\n常数定义:');
console.log(`  N1 = ${CONSTANTS.N1} (液体Kv常数)`);
console.log(`  N2 = ${CONSTANTS.N2} (管道几何系数)`);
console.log(`  N9 = ${CONSTANTS.N9} (气体Kv常数)`);
console.log(`  安托因常数: A=${CONSTANTS.ANTOINE.A}, B=${CONSTANTS.ANTOINE.B}, C=${CONSTANTS.ANTOINE.C}`);

if (INPUT.fluidType === 'liquid') {
  runLiquidCalculation();
} else if (INPUT.fluidType === 'gas') {
  runGasCalculation();
}

console.log('\n');
