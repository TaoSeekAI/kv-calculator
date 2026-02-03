/**
 * Kv Calculation System Type Definitions
 */

// Fluid Type
export type FluidType =
  | 'Liquid'
  | 'Gas'
  | 'Steam'
  | 'Two-phase (Liquid+Gas)'
  | 'Two-phase (Liquid+Steam)';

// Flow Characteristic
export type FlowCharacteristic = 'Equal Percentage' | 'Linear' | 'Quick Opening';

// Pressure Unit
export type PressureUnit =
  | 'MPa(G)'
  | 'MPa(A)'
  | 'KPa(G)'
  | 'KPa(A)'
  | 'bar(G)'
  | 'bar(A)';

// Temperature Unit
export type TemperatureUnit = '℃' | 'K' | 'F';

// Flow Unit
export type FlowUnit =
  | 'm3/h'
  | 'Kg/h'
  | 'Kg/s'
  | 't/h'
  | 't/s'
  | 'Nm3/h';

// Density Unit
export type DensityUnit = 'Kg/m3' | 'g/cm3' | 'Kg/Nm3';

// Viscosity Unit
export type ViscosityUnit = 'm2/s' | 'mm2/s' | 'St' | 'cSt' | 'cP' | 'Pa.S' | 'mPa.S';

// Viscosity Type
export type ViscosityType = 'Kinematic Viscosity' | 'Dynamic Viscosity' | 'Viscosity';

// Flow State
export type FlowState = 'Choked' | 'Non-choked';

// Turbulence State
export type TurbulenceState = 'Turbulent' | 'Laminar';

// Fluid State (for liquids)
export type FluidState = 'No Cavitation' | 'Incipient Cavitation' | 'Cavitation' | 'Flashing';

// Valve Internals Type
export type ValveInternalsType = 'Standard' | 'Multi-stage Pressure Reduction';

/**
 * Kv Calculation Input Parameters
 */
export interface KvInput {
  // Fluid properties
  fluidType: FluidType;

  // Temperature parameters
  temperature: number;
  tempUnit: TemperatureUnit;

  // Flow parameters
  flowRate: number;
  flowUnit: FlowUnit;

  // Two-phase gas/steam flow rate
  gasFlowRate?: number;
  gasFlowUnit?: FlowUnit;

  // Pressure parameters
  P1: number;               // Inlet pressure
  P2: number;               // Outlet pressure
  pressureUnit: PressureUnit;

  // Density parameters
  density: number;          // Primary density (liquid/gas/steam)
  densityUnit: DensityUnit;
  gasDensity?: number;      // Two-phase gas density
  gasDensityUnit?: DensityUnit;

  // Viscosity parameters
  viscosity?: number;
  viscosityUnit?: ViscosityUnit;
  viscosityType?: ViscosityType;

  // Gas-specific parameters
  molecularWeight?: number; // Molecular weight M
  Z?: number;               // Compressibility factor
  gamma?: number;           // Specific heat ratio γ

  // Critical parameters (liquid)
  Pc?: number;              // Critical pressure MPa

  // Valve parameters
  DN: number;               // Valve nominal diameter mm
  seatSize?: number;        // Valve seat size mm
  FL: number;               // Pressure recovery factor
  XT?: number;              // Pressure differential ratio factor
  Fd?: number;              // Valve style modifier

  // Flow characteristic
  flowChar: FlowCharacteristic;
  rangeability: number;     // Inherent rangeability R
  ratedKv: number;          // Rated Kv

  // Piping parameters
  D1w?: number;             // Upstream pipe outer diameter mm
  D1T?: number;             // Upstream pipe wall thickness mm
  D2w?: number;             // Downstream pipe outer diameter mm
  D2T?: number;             // Downstream pipe wall thickness mm

  // Valve internals type
  valveInternalsType?: ValveInternalsType;
}

/**
 * Intermediate Calculation Values
 */
export interface IntermediateValues {
  // Pressure conversion
  P1Abs: number;            // P1 absolute pressure KPa
  P2Abs: number;            // P2 absolute pressure KPa
  deltaP: number;           // Pressure differential KPa

  // Temperature conversion
  T1: number;               // Inlet absolute temperature K
  saturationTemp?: number;  // Saturation temperature ℃

  // Density conversion
  densityKgM3: number;      // Unified density Kg/m3
  relativeDensity?: number; // Relative density

  // Flow conversion
  volumeFlowM3h?: number;   // Volume flow rate m³/h
  massFlowKgh?: number;     // Mass flow rate Kg/h
  normalFlowNm3h?: number;  // Standard flow rate Nm³/h

  // Viscosity conversion
  kinematicViscosity?: number; // Kinematic viscosity m²/s

  // Liquid-specific
  Pv?: number;              // Vapor pressure KPa
  FF?: number;              // Critical pressure ratio factor
  xF?: number;              // Pressure differential ratio

  // Gas-specific
  x?: number;               // Pressure ratio ΔP/P1
  Fgamma?: number;          // Specific heat ratio factor γ/1.4
  Y?: number;               // Expansion factor

  // Piping coefficients
  D1?: number;              // Upstream pipe inner diameter mm
  D2?: number;              // Downstream pipe inner diameter mm
  FP: number;               // Piping geometry factor
  FLP: number;              // Combined liquid pressure recovery factor
  sumK: number;             // Sum of resistance coefficients

  // Reynolds number related
  Rev: number;              // Valve Reynolds number
  FR: number;               // Reynolds number factor
  lambda: number;           // λ coefficient

  // Liquid Kv formula results
  C1?: number;              // Non-choked, without fittings
  C2?: number;              // Non-choked, with fittings
  C3?: number;              // Choked, without fittings
  C4?: number;              // Choked, with fittings
  C5?: number;              // Non-turbulent (laminar)

  // Flow state determination
  flowStateNoFitting?: FlowState;    // Flow state without fittings
  flowStateWithFitting?: FlowState;  // Flow state with fittings
}

/**
 * Kv Calculation Result
 */
export interface KvResult {
  // Main results
  calculatedKv: number;     // Calculated Kv
  calculatedCv: number;     // Calculated Cv
  valveOpening: number;     // Valve opening %

  // Flow state
  flowState: FlowState;           // Flow state
  turbulenceState: TurbulenceState; // Turbulence state
  fluidState?: FluidState;        // Fluid state (liquid)

  // Velocity
  outletVelocity: number;   // Outlet velocity m/s
  machNumber?: number;      // Mach number (gas)

  // Noise
  noise?: number;           // Noise level dBA

  // Intermediate values
  intermediate: IntermediateValues;

  // Formula used
  usedFormula: string;

  // Has fittings
  hasFittings: boolean;

  // Error messages
  errors?: string[];
  warnings?: string[];
}

/**
 * Excel Comparison Result
 */
export interface ComparisonResult {
  field: string;            // Field name
  description: string;      // Field description
  excelValue: number;       // Excel value
  calculatedValue: number;  // Calculated value
  difference: number;       // Difference
  percentError: number;     // Percent error
  passed: boolean;          // Passed or not
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
