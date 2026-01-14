/**
 * Kv计算系统类型定义
 */
export type FluidType = '液体' | '气体' | '蒸汽' | '两相流(液体+气体)' | '两相流(液体+蒸汽)';
export type FlowCharacteristic = '等百分比' | '线性' | '快开';
export type PressureUnit = 'MPa(G)' | 'MPa(A)' | 'KPa(G)' | 'KPa(A)' | 'bar(G)' | 'bar(A)';
export type TemperatureUnit = '℃' | 'K' | 'F';
export type FlowUnit = 'm3/h' | 'Kg/h' | 'Kg/s' | 't/h' | 't/s' | 'Nm3/h';
export type DensityUnit = 'Kg/m3' | 'g/cm3' | 'Kg/Nm3';
export type ViscosityUnit = 'm2/s' | 'mm2/s' | 'St' | 'cSt' | 'cP' | 'Pa.S' | 'mPa.S';
export type ViscosityType = '运动粘度 v' | '动力粘度 u' | '粘度';
export type FlowState = '阻塞流' | '非阻塞流';
export type TurbulenceState = '紊流' | '非紊流';
export type FluidState = '无气蚀' | '初始气蚀' | '空化' | '闪蒸';
export type ValveInternalsType = '标准型' | '多级降压';
/**
 * Kv计算输入参数
 */
export interface KvInput {
    fluidType: FluidType;
    temperature: number;
    tempUnit: TemperatureUnit;
    flowRate: number;
    flowUnit: FlowUnit;
    gasFlowRate?: number;
    gasFlowUnit?: FlowUnit;
    P1: number;
    P2: number;
    pressureUnit: PressureUnit;
    density: number;
    densityUnit: DensityUnit;
    gasDensity?: number;
    gasDensityUnit?: DensityUnit;
    viscosity?: number;
    viscosityUnit?: ViscosityUnit;
    viscosityType?: ViscosityType;
    molecularWeight?: number;
    Z?: number;
    gamma?: number;
    Pc?: number;
    DN: number;
    seatSize?: number;
    FL: number;
    XT?: number;
    Fd?: number;
    flowChar: FlowCharacteristic;
    rangeability: number;
    ratedKv: number;
    D1w?: number;
    D1T?: number;
    D2w?: number;
    D2T?: number;
    valveInternalsType?: ValveInternalsType;
}
/**
 * 中间计算值
 */
export interface IntermediateValues {
    P1Abs: number;
    P2Abs: number;
    deltaP: number;
    T1: number;
    saturationTemp?: number;
    densityKgM3: number;
    relativeDensity?: number;
    volumeFlowM3h?: number;
    massFlowKgh?: number;
    normalFlowNm3h?: number;
    kinematicViscosity?: number;
    Pv?: number;
    FF?: number;
    xF?: number;
    x?: number;
    Fgamma?: number;
    Y?: number;
    D1?: number;
    D2?: number;
    FP: number;
    FLP: number;
    sumK: number;
    Rev: number;
    FR: number;
    lambda: number;
    C1?: number;
    C2?: number;
    C3?: number;
    C4?: number;
    C5?: number;
    flowStateNoFitting?: FlowState;
    flowStateWithFitting?: FlowState;
}
/**
 * Kv计算结果
 */
export interface KvResult {
    calculatedKv: number;
    calculatedCv: number;
    valveOpening: number;
    flowState: FlowState;
    turbulenceState: TurbulenceState;
    fluidState?: FluidState;
    outletVelocity: number;
    machNumber?: number;
    noise?: number;
    intermediate: IntermediateValues;
    usedFormula: string;
    hasFittings: boolean;
    errors?: string[];
    warnings?: string[];
}
/**
 * Excel比对结果
 */
export interface ComparisonResult {
    field: string;
    description: string;
    excelValue: number;
    calculatedValue: number;
    difference: number;
    percentError: number;
    passed: boolean;
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
