/**
 * Kv Calculation System Type Definitions
 */
export type FluidType = 'Liquid' | 'Gas' | 'Steam' | 'Two-phase (Liquid+Gas)' | 'Two-phase (Liquid+Steam)';
export type FlowCharacteristic = 'Equal Percentage' | 'Linear' | 'Quick Opening';
export type PressureUnit = 'MPa(G)' | 'MPa(A)' | 'KPa(G)' | 'KPa(A)' | 'bar(G)' | 'bar(A)';
export type TemperatureUnit = '℃' | 'K' | 'F';
export type FlowUnit = 'm3/h' | 'Kg/h' | 'Kg/s' | 't/h' | 't/s' | 'Nm3/h';
export type DensityUnit = 'Kg/m3' | 'g/cm3' | 'Kg/Nm3';
export type ViscosityUnit = 'm2/s' | 'mm2/s' | 'St' | 'cSt' | 'cP' | 'Pa.S' | 'mPa.S';
export type ViscosityType = 'Kinematic Viscosity' | 'Dynamic Viscosity' | 'Viscosity';
export type FlowState = 'Choked' | 'Non-choked';
export type TurbulenceState = 'Turbulent' | 'Laminar';
export type FluidState = 'No Cavitation' | 'Incipient Cavitation' | 'Cavitation' | 'Flashing';
export type ValveInternalsType = 'Standard' | 'Multi-stage Pressure Reduction';
/**
 * Kv Calculation Input Parameters
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
 * Intermediate Calculation Values
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
 * Kv Calculation Result
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
 * Excel Comparison Result
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
 * Comparison Report
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
