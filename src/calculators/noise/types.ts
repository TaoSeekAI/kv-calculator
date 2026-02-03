/**
 * Noise Calculation Type Definitions
 * Based on IEC 60534-8-3 (Gas) and IEC 60534-8-4 (Liquid)
 */

// Gas Flow State (IEC 60534-8-3)
export type GasFlowState =
  | 'State I'    // Subsonic flow
  | 'State II'   // Transitional flow
  | 'State III'  // Critical flow
  | 'State IV'   // Constant acoustic efficiency
  | 'State V';   // Fully choked flow

// Liquid Cavitation State
export type CavitationState =
  | 'No Cavitation'
  | 'Incipient Cavitation'
  | 'Constant Cavitation'
  | 'Flashing';

// Pipe Material
export type PipeMaterial = 'steel' | 'stainless';

/**
 * Noise Calculation Input Parameters
 */
export interface NoiseInput {
  // Fluid type
  fluidType: 'Liquid' | 'Gas' | 'Steam';

  // Pressure parameters (KPa absolute)
  P1: number;              // Inlet pressure KPa(A)
  P2: number;              // Outlet pressure KPa(A)
  deltaP: number;          // Pressure differential KPa

  // Temperature parameters
  T1: number;              // Inlet temperature K

  // Flow parameters
  massFlow: number;        // Mass flow rate kg/h
  volumeFlow?: number;     // Volume flow rate m³/h (liquid)

  // Fluid properties
  density: number;         // Inlet density kg/m³
  density2?: number;       // Outlet density kg/m³ (gas)
  gamma?: number;          // Specific heat ratio (gas/steam)
  molecularWeight?: number;// Molecular weight kg/kmol (gas)
  Pv?: number;             // Vapor pressure KPa (liquid)
  soundSpeed?: number;     // Liquid sound speed m/s

  // Valve parameters
  Kv: number;              // Calculated Kv
  Cv: number;              // Calculated Cv
  FL: number;              // Pressure recovery factor
  xT?: number;             // Pressure differential ratio factor
  Fd?: number;             // Valve type modifier
  xFz?: number;            // Cavitation inception pressure ratio (liquid)
  xF?: number;             // Pressure differential ratio (liquid)

  // Pipe parameters
  Di: number;              // Downstream pipe inner diameter mm
  tp: number;              // Pipe wall thickness mm
  pipeMaterial?: PipeMaterial;

  // Valve diameter
  d: number;               // Seat diameter mm
}

/**
 * Gas Noise Intermediate Calculation Values
 */
export interface GasNoiseIntermediate {
  // Critical pressures
  P2C: number;             // Critical flow inception pressure KPa
  Pvc: number;             // Vena contracta pressure KPa
  Pvcc: number;            // Critical vena contracta pressure KPa

  // Velocities
  c1: number;              // Inlet sound speed m/s
  c2: number;              // Outlet sound speed m/s
  Uvc: number;             // Vena contracta velocity m/s
  U2: number;              // Outlet velocity m/s
  Mvc: number;             // Vena contracta Mach number
  Mj?: number;             // Free expansion jet Mach number (State II-V)

  // Acoustic efficiency
  eta: number;             // Acoustic efficiency coefficient

  // Power
  Wm: number;              // Mechanical power W
  Wa: number;              // Acoustic power W

  // Noise levels
  Lpi: number;             // Internal sound power level dB
  TL: number;              // Transmission loss dB
  Lpe: number;             // External noise level dB

  // Frequency
  fp: number;              // Peak frequency Hz
  deltaLA: number;         // A-weighting correction dB

  // Other
  rho2: number;            // Outlet density kg/m³
  Fgamma: number;          // Specific heat ratio factor
  Dj?: number;             // Jet diameter m
  M0?: number;             // Outlet Mach number
  Lg?: number;             // Mach number correction dB
}

/**
 * Liquid Noise Intermediate Calculation Values
 */
export interface LiquidNoiseIntermediate {
  // Pressure parameters
  deltaPc: number;         // Effective pressure differential KPa

  // Velocities
  Uvc: number;             // Vena contracta velocity m/s
  cL: number;              // Liquid sound speed m/s

  // Acoustic efficiency
  etaTurb: number;         // Turbulent acoustic efficiency
  etaCav: number;          // Cavitation acoustic efficiency
  eta: number;             // Total acoustic efficiency

  // Power
  Wm: number;              // Mechanical power W
  Wa: number;              // Acoustic power W
  rw: number;              // Acoustic power ratio

  // Noise levels
  Lpi: number;             // Internal sound power level dB
  TL: number;              // Transmission loss dB
  Lpe: number;             // External noise level dB

  // Frequency
  fp: number;              // Peak frequency Hz

  // Other
  xF: number;              // Pressure differential ratio
  xFz: number;             // Cavitation inception pressure ratio
}

/**
 * Noise Calculation Result
 */
export interface NoiseResult {
  // Main result
  noiseLevel: number;      // Noise level dBA (at 1m distance)

  // Flow state
  flowState: string;       // Flow state description
  cavitationState?: CavitationState; // Cavitation state (liquid)

  // Intermediate calculation values
  intermediate: GasNoiseIntermediate | LiquidNoiseIntermediate;

  // Peak frequency
  peakFrequency: number;   // Hz

  // Warning messages
  warnings?: string[];
}
