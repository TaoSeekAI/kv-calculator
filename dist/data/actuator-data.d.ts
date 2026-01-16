/**
 * 执行机构静态数据表
 * 数据来源: 华尔式_拨叉气缸.xml, 永盛气缸_YSZ.xml
 */
export interface ActuatorSpec {
    model: string;
    airConnection: string;
    torque04: number | null;
    torque05: number | null;
    handwheel?: string;
}
export interface ActuatorType {
    type: string;
    singleAction: ActuatorSpec[];
    doubleAction: ActuatorSpec[];
}
export interface ActuatorBrand {
    brand: string;
    types: ActuatorType[];
}
export declare const actuatorBrandData: ActuatorBrand[];
/**
 * 获取所有品牌列表
 */
export declare function getActuatorBrands(): string[];
/**
 * 根据品牌获取类型列表
 */
export declare function getActuatorTypes(brand: string): string[];
/**
 * 根据品牌和类型获取型号列表
 * @param brand 品牌
 * @param type 类型
 * @param actionMode 作用方式: 'single' | 'double' | 'all'
 */
export declare function getActuatorModels(brand: string, type: string, actionMode?: 'single' | 'double' | 'all'): string[];
/**
 * 根据型号获取执行机构规格
 */
export declare function getActuatorSpec(brand: string, type: string, model: string): ActuatorSpec | null;
/**
 * 判断型号是单作用还是双作用
 */
export declare function getActionMode(model: string): '单作用' | '双作用' | null;
