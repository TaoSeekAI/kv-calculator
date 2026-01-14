/**
 * Kv计算系统类型定义
 */

// 流体类型
export type FluidType =
  | '液体'
  | '气体'
  | '蒸汽'
  | '两相流(液体+气体)'
  | '两相流(液体+蒸汽)';

// 流量特性
export type FlowCharacteristic = '等百分比' | '线性' | '快开';

// 压力单位
export type PressureUnit =
  | 'MPa(G)'
  | 'MPa(A)'
  | 'KPa(G)'
  | 'KPa(A)'
  | 'bar(G)'
  | 'bar(A)';

// 温度单位
export type TemperatureUnit = '℃' | 'K' | 'F';

// 流量单位
export type FlowUnit =
  | 'm3/h'
  | 'Kg/h'
  | 'Kg/s'
  | 't/h'
  | 't/s'
  | 'Nm3/h';

// 密度单位
export type DensityUnit = 'Kg/m3' | 'g/cm3' | 'Kg/Nm3';

// 粘度单位
export type ViscosityUnit = 'm2/s' | 'mm2/s' | 'St' | 'cSt' | 'cP' | 'Pa.S' | 'mPa.S';

// 粘度类型
export type ViscosityType = '运动粘度 v' | '动力粘度 u' | '粘度';

// 流动状态
export type FlowState = '阻塞流' | '非阻塞流';

// 紊流状态
export type TurbulenceState = '紊流' | '非紊流';

// 液体状态
export type FluidState = '无气蚀' | '初始气蚀' | '空化' | '闪蒸';

// 阀内件形式
export type ValveInternalsType = '标准型' | '多级降压';

/**
 * Kv计算输入参数
 */
export interface KvInput {
  // 流体属性
  fluidType: FluidType;

  // 温度参数
  temperature: number;
  tempUnit: TemperatureUnit;

  // 流量参数
  flowRate: number;
  flowUnit: FlowUnit;

  // 两相流气体/蒸汽流量
  gasFlowRate?: number;
  gasFlowUnit?: FlowUnit;

  // 压力参数
  P1: number;               // 阀前压力
  P2: number;               // 阀后压力
  pressureUnit: PressureUnit;

  // 密度参数
  density: number;          // 主密度(液体/气体/蒸汽)
  densityUnit: DensityUnit;
  gasDensity?: number;      // 两相流气体密度
  gasDensityUnit?: DensityUnit;

  // 粘度参数
  viscosity?: number;
  viscosityUnit?: ViscosityUnit;
  viscosityType?: ViscosityType;

  // 气体特有参数
  molecularWeight?: number; // 分子量 M
  Z?: number;               // 压缩系数
  gamma?: number;           // 比热比 γ

  // 临界参数(液体)
  Pc?: number;              // 临界压力 MPa

  // 阀门参数
  DN: number;               // 阀门口径 mm
  seatSize?: number;        // 阀芯/阀座尺寸 mm
  FL: number;               // 压力恢复系数
  XT?: number;              // 压差比系数
  Fd?: number;              // 控制阀类型修正系数

  // 流量特性
  flowChar: FlowCharacteristic;
  rangeability: number;     // 固有可调比 R
  ratedKv: number;          // 额定Kv

  // 管道参数
  D1w?: number;             // 上游管道外径 mm
  D1T?: number;             // 上游管道壁厚 mm
  D2w?: number;             // 下游管道外径 mm
  D2T?: number;             // 下游管道壁厚 mm

  // 阀内件形式
  valveInternalsType?: ValveInternalsType;
}

/**
 * 中间计算值
 */
export interface IntermediateValues {
  // 压力转换
  P1Abs: number;            // P1绝对压力 KPa
  P2Abs: number;            // P2绝对压力 KPa
  deltaP: number;           // 压差 KPa

  // 温度转换
  T1: number;               // 入口绝对温度 K
  saturationTemp?: number;  // 饱和温度 ℃

  // 密度转换
  densityKgM3: number;      // 统一密度 Kg/m3
  relativeDensity?: number; // 相对密度

  // 流量转换
  volumeFlowM3h?: number;   // 体积流量 m³/h
  massFlowKgh?: number;     // 质量流量 Kg/h
  normalFlowNm3h?: number;  // 标准流量 Nm³/h

  // 粘度转换
  kinematicViscosity?: number; // 运动粘度 m²/s

  // 液体特有
  Pv?: number;              // 饱和蒸汽压 KPa
  FF?: number;              // 临界压力比系数
  xF?: number;              // 压差比

  // 气体特有
  x?: number;               // 压差比 ΔP/P1
  Fgamma?: number;          // 比热比系数 γ/1.4
  Y?: number;               // 膨胀系数

  // 管道系数
  D1?: number;              // 上游管道内径 mm
  D2?: number;              // 下游管道内径 mm
  FP: number;               // 管道几何形状系数
  FLP: number;              // 复合系数
  sumK: number;             // 管件阻力系数和

  // 雷诺数相关
  Rev: number;              // 阀门雷诺数
  FR: number;               // 雷诺数修正系数
  lambda: number;           // λ系数

  // 液体Kv各公式结果
  C1?: number;              // 非阻塞流，无接管
  C2?: number;              // 非阻塞流，带接管
  C3?: number;              // 阻塞流，无接管
  C4?: number;              // 阻塞流，带接管
  C5?: number;              // 非紊流

  // 流动状态判定
  flowStateNoFitting?: FlowState;    // 无接管流动状态
  flowStateWithFitting?: FlowState;  // 带接管流动状态
}

/**
 * Kv计算结果
 */
export interface KvResult {
  // 主要结果
  calculatedKv: number;     // 计算Kv
  calculatedCv: number;     // 计算Cv
  valveOpening: number;     // 阀门开度 %

  // 流动状态
  flowState: FlowState;           // 流动状态
  turbulenceState: TurbulenceState; // 紊流状态
  fluidState?: FluidState;        // 流体状态(液体)

  // 速度
  outletVelocity: number;   // 出口流速 m/s
  machNumber?: number;      // 马赫数(气体)

  // 噪音(后续实现)
  noise?: number;           // 噪音 dBA

  // 中间值
  intermediate: IntermediateValues;

  // 使用的公式
  usedFormula: string;

  // 是否有接管件
  hasFittings: boolean;

  // 错误信息
  errors?: string[];
  warnings?: string[];
}

/**
 * Excel比对结果
 */
export interface ComparisonResult {
  field: string;            // 字段名
  description: string;      // 字段描述
  excelValue: number;       // Excel值
  calculatedValue: number;  // 计算值
  difference: number;       // 差值
  percentError: number;     // 百分比误差
  passed: boolean;          // 是否通过
}

/**
 * 比对报告
 */
export interface ComparisonReport {
  timestamp: string;
  sheetName: string;
  fluidType: FluidType;
  summary: {
    total: number;
    passed: number;
    failed: number;
    passRate: string;
  };
  details: ComparisonResult[];
}
