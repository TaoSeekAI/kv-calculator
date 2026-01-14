/**
 * 噪音计算类型定义
 * 基于 IEC 60534-8-3 (气体) 和 IEC 60534-8-4 (液体)
 */
export type GasFlowState = 'State I' | 'State II' | 'State III' | 'State IV' | 'State V';
export type CavitationState = '无空化' | '初生空化' | '恒定空化' | '闪蒸';
export type PipeMaterial = 'steel' | 'stainless';
/**
 * 噪音计算输入参数
 */
export interface NoiseInput {
    fluidType: '液体' | '气体' | '蒸汽';
    P1: number;
    P2: number;
    deltaP: number;
    T1: number;
    massFlow: number;
    volumeFlow?: number;
    density: number;
    density2?: number;
    gamma?: number;
    molecularWeight?: number;
    Pv?: number;
    soundSpeed?: number;
    Kv: number;
    Cv: number;
    FL: number;
    xT?: number;
    Fd?: number;
    xFz?: number;
    xF?: number;
    Di: number;
    tp: number;
    pipeMaterial?: PipeMaterial;
    d: number;
}
/**
 * 气体噪音中间计算值
 */
export interface GasNoiseIntermediate {
    P2C: number;
    Pvc: number;
    Pvcc: number;
    c1: number;
    c2: number;
    Uvc: number;
    U2: number;
    Mvc: number;
    Mj?: number;
    eta: number;
    Wm: number;
    Wa: number;
    Lpi: number;
    TL: number;
    Lpe: number;
    fp: number;
    deltaLA: number;
    rho2: number;
    Fgamma: number;
    Dj?: number;
    M0?: number;
    Lg?: number;
}
/**
 * 液体噪音中间计算值
 */
export interface LiquidNoiseIntermediate {
    deltaPc: number;
    Uvc: number;
    cL: number;
    etaTurb: number;
    etaCav: number;
    eta: number;
    Wm: number;
    Wa: number;
    rw: number;
    Lpi: number;
    TL: number;
    Lpe: number;
    fp: number;
    xF: number;
    xFz: number;
}
/**
 * 噪音计算结果
 */
export interface NoiseResult {
    noiseLevel: number;
    flowState: string;
    cavitationState?: CavitationState;
    intermediate: GasNoiseIntermediate | LiquidNoiseIntermediate;
    peakFrequency: number;
    warnings?: string[];
}
