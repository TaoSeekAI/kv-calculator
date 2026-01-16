/**
 * 管道规格表 - 完整静态版本
 * 支持两种标准:
 * - 公制 (GB/T) - 默认
 * - 英制 (ASME B36.10M)
 */
export type PipeStandard = 'metric' | 'imperial';
export interface PipeSpec {
    dn: number;
    outerDiameter: number;
    schStandard: string;
    wallThickness: number;
    innerDiameter: number;
}
/**
 * 完整的管道规格数据（270条记录）
 * 格式: 'DN-SCH': PipeSpec
 */
export declare const PIPE_SPECS_DATA: Record<string, PipeSpec>;
/**
 * 公制管道规格数据
 * 使用公制外径 + ASME B36.10M SCH壁厚标准
 * 内径 = 外径 - 2 × 壁厚
 */
export declare const PIPE_SPECS_METRIC: Record<string, PipeSpec>;
/**
 * 根据DN和SCH标准获取管道规格
 * @param dn 管道公称直径
 * @param schStandard SCH标准 (默认: '40')
 * @param pipeStandard 管道标准 (默认: 'metric' 公制)
 * @returns 管道规格，如果未找到返回 null
 */
export declare function getPipeSpec(dn: number, schStandard?: string, pipeStandard?: PipeStandard): PipeSpec | null;
/**
 * 获取指定DN的所有可用SCH标准
 * @param dn 管道公称直径
 * @param pipeStandard 管道标准 (默认: 'metric' 公制)
 * @returns SCH标准列表
 */
export declare function getAvailableSchStandards(dn: number, pipeStandard?: PipeStandard): string[];
/**
 * 获取所有支持的DN列表
 * @param pipeStandard 管道标准 (默认: 'metric' 公制)
 * @returns DN列表
 */
export declare function getAllSupportedDN(pipeStandard?: PipeStandard): number[];
