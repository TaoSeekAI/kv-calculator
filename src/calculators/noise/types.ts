/**
 * 噪音计算类型定义
 * 基于 IEC 60534-8-3 (气体) 和 IEC 60534-8-4 (液体)
 */

// 气体流动状态 (IEC 60534-8-3)
export type GasFlowState =
  | 'State I'    // 亚音速流
  | 'State II'   // 过渡流
  | 'State III'  // 临界流
  | 'State IV'   // 常数声效系数
  | 'State V';   // 完全阻塞流

// 液体空化状态
export type CavitationState =
  | '无空化'
  | '初生空化'
  | '恒定空化'
  | '闪蒸';

// 管道材料
export type PipeMaterial = 'steel' | 'stainless';

/**
 * 噪音计算输入参数
 */
export interface NoiseInput {
  // 流体类型
  fluidType: '液体' | '气体' | '蒸汽';

  // 压力参数 (KPa绝对压力)
  P1: number;              // 入口压力 KPa(A)
  P2: number;              // 出口压力 KPa(A)
  deltaP: number;          // 压差 KPa

  // 温度参数
  T1: number;              // 入口温度 K

  // 流量参数
  massFlow: number;        // 质量流量 kg/h
  volumeFlow?: number;     // 体积流量 m³/h (液体)

  // 流体属性
  density: number;         // 入口密度 kg/m³
  density2?: number;       // 出口密度 kg/m³ (气体)
  gamma?: number;          // 比热比 (气体/蒸汽)
  molecularWeight?: number;// 分子量 kg/kmol (气体)
  Pv?: number;             // 饱和蒸汽压 KPa (液体)
  soundSpeed?: number;     // 液体声速 m/s

  // 阀门参数
  Kv: number;              // 计算Kv
  Cv: number;              // 计算Cv
  FL: number;              // 压力恢复系数
  xT?: number;             // 压差比系数
  Fd?: number;             // 阀门类型修正系数
  xFz?: number;            // 空化起始压差比 (液体)
  xF?: number;             // 压差比 (液体)

  // 管道参数
  Di: number;              // 下游管道内径 mm
  tp: number;              // 管道壁厚 mm
  pipeMaterial?: PipeMaterial;

  // 阀门口径
  d: number;               // 阀座直径 mm
}

/**
 * 气体噪音中间计算值
 */
export interface GasNoiseIntermediate {
  // 临界压力
  P2C: number;             // 临界流起始压力 KPa
  Pvc: number;             // 缩流断面压力 KPa
  Pvcc: number;            // 临界缩流断面压力 KPa

  // 流速
  c1: number;              // 入口声速 m/s
  c2: number;              // 出口声速 m/s
  Uvc: number;             // 缩流断面流速 m/s
  U2: number;              // 出口流速 m/s
  Mvc: number;             // 缩流断面马赫数
  Mj?: number;             // 自由膨胀射流马赫数 (State II-V)

  // 声效系数
  eta: number;             // 声效系数

  // 功率
  Wm: number;              // 机械功率 W
  Wa: number;              // 声功率 W

  // 噪音级
  Lpi: number;             // 内部声功率级 dB
  TL: number;              // 透射损失 dB
  Lpe: number;             // 外部噪音级 dB

  // 频率
  fp: number;              // 峰值频率 Hz
  deltaLA: number;         // A加权校正 dB

  // 其他
  rho2: number;            // 出口密度 kg/m³
  Fgamma: number;          // 比热比系数
  Dj?: number;             // 射流直径 m
  M0?: number;             // 出口马赫数
  Lg?: number;             // 马赫数修正 dB
}

/**
 * 液体噪音中间计算值
 */
export interface LiquidNoiseIntermediate {
  // 压力参数
  deltaPc: number;         // 有效压差 KPa

  // 流速
  Uvc: number;             // 缩流断面流速 m/s
  cL: number;              // 液体声速 m/s

  // 声效系数
  etaTurb: number;         // 紊流声效系数
  etaCav: number;          // 空化声效系数
  eta: number;             // 总声效系数

  // 功率
  Wm: number;              // 机械功率 W
  Wa: number;              // 声功率 W
  rw: number;              // 声功率比

  // 噪音级
  Lpi: number;             // 内部声功率级 dB
  TL: number;              // 透射损失 dB
  Lpe: number;             // 外部噪音级 dB

  // 频率
  fp: number;              // 峰值频率 Hz

  // 其他
  xF: number;              // 压差比
  xFz: number;             // 空化起始压差比
}

/**
 * 噪音计算结果
 */
export interface NoiseResult {
  // 主要结果
  noiseLevel: number;      // 噪音级 dBA (距1m处)

  // 流动状态
  flowState: string;       // 流动状态描述
  cavitationState?: CavitationState; // 空化状态 (液体)

  // 中间计算值
  intermediate: GasNoiseIntermediate | LiquidNoiseIntermediate;

  // 峰值频率
  peakFrequency: number;   // Hz

  // 警告信息
  warnings?: string[];
}
