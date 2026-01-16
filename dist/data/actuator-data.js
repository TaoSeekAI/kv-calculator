/**
 * 执行机构静态数据表
 * 数据来源: 华尔式_拨叉气缸.xml, 永盛气缸_YSZ.xml
 */
// 华尔式 拨叉气缸数据
const huaerShiBoChaData = {
    type: '拨叉气缸',
    singleAction: [
        { model: 'HG0-P180-SR2', airConnection: '1/4"NPT', torque04: 340, torque05: 340 },
        { model: 'HG0-P180-SR3', airConnection: '1/4"NPT', torque04: null, torque05: 520 },
        { model: 'HG0-P220-SR3', airConnection: '1/2"NPT', torque04: 529, torque05: 529 },
        { model: 'HG1-P250-SR2', airConnection: '1/2"NPT', torque04: 840, torque05: 840 },
        { model: 'HG1-P250-SR3', airConnection: '1/2"NPT', torque04: null, torque05: 1200 },
        { model: 'HG1-P300-SR3', airConnection: '1/2"NPT', torque04: 1230, torque05: 1230 },
        { model: 'HG1-P300-SR4', airConnection: '1/2"NPT', torque04: 1440, torque05: 1440 },
        { model: 'HG2-P300-SR2', airConnection: '1/2"NPT', torque04: 1440, torque05: 1440 },
        { model: 'HG2-P300-SR3', airConnection: '1/2"NPT', torque04: 1700, torque05: 1900 },
        { model: 'HG2-P350-SR3', airConnection: '1/2"NPT', torque04: 1900, torque05: 1900 },
        { model: 'HG2-P350-SR4', airConnection: '1/2"NPT', torque04: 2470, torque05: 2470 },
        { model: 'HG3-P350-SR2', airConnection: '1/2"NPT', torque04: 2300, torque05: 2300 },
        { model: 'HG3-P350-SR3', airConnection: '1/2"NPT', torque04: 3000, torque05: 3000 },
        { model: 'HG3-P400-SR3', airConnection: '3/4"NPT', torque04: 3000, torque05: 3000 },
        { model: 'HG3-P400-SR4', airConnection: '3/4"NPT', torque04: 3580, torque05: 3580 },
        { model: 'HG4-P400-SR2', airConnection: '3/4"NPT', torque04: 3374, torque05: 3374 },
        { model: 'HG4-P400-SR3', airConnection: '3/4"NPT', torque04: 5278, torque05: 5278 },
        { model: 'HG4-P500-SR3', airConnection: '3/4"NPT', torque04: 5278, torque05: 5278 },
        { model: 'HG4-P500-SR4', airConnection: '3/4"NPT', torque04: 6900, torque05: 6900 },
        { model: 'HG5-P500-SR2', airConnection: '3/4"NPT', torque04: 7179, torque05: 7179 },
        { model: 'HG5-P500-SR3', airConnection: '3/4"NPT', torque04: 9000, torque05: 10156 },
        { model: 'HG5-P600-SR3', airConnection: '1"NPT', torque04: 10156, torque05: 10156 },
        { model: 'HG5-P600-SR4', airConnection: '1"NPT', torque04: 12800, torque05: 12800 },
        { model: 'HG7-P600-SR2', airConnection: '1"NPT', torque04: 12123, torque05: 12123 },
        { model: 'HG7-P600-SR3', airConnection: '1"NPT', torque04: 16000, torque05: 17500 },
        { model: 'HG7-P720-SR3', airConnection: '1"NPT', torque04: 17507, torque05: 17507 },
        { model: 'HG7-P720-SR4', airConnection: '1"NPT', torque04: 21700, torque05: 21700 },
        { model: 'HG8-P720-SR2', airConnection: '1"NPT', torque04: 21514, torque05: 21514 },
        { model: 'HG8-P720-SR3', airConnection: '1"NPT', torque04: 28384, torque05: 28384 },
        { model: 'HG8-P780-SR3', airConnection: '1"NPT', torque04: 28384, torque05: 28384 },
        { model: 'HG8-P780-SR4', airConnection: '1"NPT', torque04: 30946, torque05: 30946 },
        { model: 'HG8-P880-SR4', airConnection: '1"NPT', torque04: 30946, torque05: 30946 },
        { model: 'HG8-P880-SR5', airConnection: '1"NPT', torque04: 38000, torque05: 38000 },
        { model: 'HG8-P980-SR5', airConnection: '1"NPT', torque04: 38000, torque05: 38000 },
    ],
    doubleAction: [
        { model: 'HG0-P180-DA', airConnection: '1/4"NPT', torque04: 889, torque05: 1111 },
        { model: 'HG0-P220-DA', airConnection: '1/2"NPT', torque04: 1328, torque05: 1660 },
        { model: 'HG1-P250-DA', airConnection: '1/2"NPT', torque04: 2063, torque05: 2579 },
        { model: 'HG1-P300-DA', airConnection: '1/2"NPT', torque04: 2963, torque05: 3704 },
        { model: 'HG2-P300-DA', airConnection: '1/2"NPT', torque04: 3624, torque05: 4530 },
        { model: 'HG2-P350-DA', airConnection: '1/2"NPT', torque04: 4921, torque05: 6151 },
        { model: 'HG3-P350-DA', airConnection: '1/2"NPT', torque04: 5991, torque05: 7489 },
        { model: 'HG3-P400-DA', airConnection: '3/4"NPT', torque04: 7806, torque05: 9757 },
        { model: 'HG4-P400-DA', airConnection: '3/4"NPT', torque04: 9506, torque05: 11882 },
        { model: 'HG4-P500-DA', airConnection: '3/4"NPT', torque04: 14817, torque05: 18521 },
        { model: 'HG5-P500-DA', airConnection: '3/4"NPT', torque04: 19254, torque05: 24067 },
        { model: 'HG5-P600-DA', airConnection: '1"NPT', torque04: 27658, torque05: 34573 },
        { model: 'HG7-P600-DA', airConnection: '1"NPT', torque04: 34063, torque05: 42579 },
        { model: 'HG7-P720-DA', airConnection: '1"NPT', torque04: 48932, torque05: 61165 },
        { model: 'HG8-P720-DA', airConnection: '1"NPT', torque04: 57808, torque05: 72260 },
        { model: 'HG8-P780-DA', airConnection: '1"NPT', torque04: 67844, torque05: 84805 },
        { model: 'HG8-P880-DA', airConnection: '1"NPT', torque04: 86355, torque05: 107944 },
        { model: 'HG8-P980-DA', airConnection: '1"NPT', torque04: 107096, torque05: 133870 },
    ]
};
// 永盛 齿轮齿条气缸数据
const yongShengChiLunData = {
    type: '齿轮齿条气缸',
    singleAction: [
        { model: 'YSZ-A052SR', airConnection: 'G1/4"', torque04: 6, torque05: 8, handwheel: '26-1' },
        { model: 'YSZ-A063SR', airConnection: 'G1/4"', torque04: 10, torque05: 13, handwheel: '26-1' },
        { model: 'YSZ-A075SR', airConnection: 'G1/4"', torque04: 16, torque05: 20, handwheel: '26-1' },
        { model: 'YSZ-A088SR', airConnection: 'G1/4"', torque04: 25, torque05: 30, handwheel: '38-38' },
        { model: 'YSZ-A092SR', airConnection: 'G1/4"', torque04: 37, torque05: 45, handwheel: '38-38' },
        { model: 'YSZ-A105SR', airConnection: 'G1/4"', torque04: 50, torque05: 60, handwheel: '38-38' },
        { model: 'YSZ-A125SR', airConnection: 'G1/4"', torque04: 80, torque05: 100, handwheel: '38-38' },
        { model: 'YSZ-A145SR', airConnection: 'G1/4"', torque04: 135, torque05: 170, handwheel: '54-38' },
        { model: 'YSZ-A160SR', airConnection: 'G1/4"', torque04: 220, torque05: 270, handwheel: '54-38' },
        { model: 'YSZ-A190SR', airConnection: 'G1/4"', torque04: 300, torque05: 375, handwheel: '80-48' },
        { model: 'YSZ-A210SR', airConnection: 'G1/4"', torque04: 415, torque05: 520, handwheel: '80-48' },
        { model: 'YSZ-A240SR', airConnection: 'G1/4"', torque04: 620, torque05: 770, handwheel: '78-60' },
        { model: 'YSZ-A270SR', airConnection: 'G1/2"', torque04: 845, torque05: 1050, handwheel: '78-80' },
    ],
    doubleAction: [
        { model: 'YSZ-A052DA', airConnection: 'G1/4"', torque04: 16, torque05: 20, handwheel: '26-1' },
        { model: 'YSZ-A063DA', airConnection: 'G1/4"', torque04: 28, torque05: 35, handwheel: '26-1' },
        { model: 'YSZ-A075DA', airConnection: 'G1/4"', torque04: 40, torque05: 50, handwheel: '26-1' },
        { model: 'YSZ-A088DA', airConnection: 'G1/4"', torque04: 60, torque05: 75, handwheel: '38-38' },
        { model: 'YSZ-A092DA', airConnection: 'G1/4"', torque04: 90, torque05: 110, handwheel: '38-38' },
        { model: 'YSZ-A105DA', airConnection: 'G1/4"', torque04: 130, torque05: 160, handwheel: '38-38' },
        { model: 'YSZ-A125DA', airConnection: 'G1/4"', torque04: 205, torque05: 250, handwheel: '38-38' },
        { model: 'YSZ-A145DA', airConnection: 'G1/4"', torque04: 345, torque05: 430, handwheel: '54-38' },
        { model: 'YSZ-A160DA', airConnection: 'G1/4"', torque04: 530, torque05: 660, handwheel: '54-38' },
        { model: 'YSZ-A190DA', airConnection: 'G1/4"', torque04: 860, torque05: 1070, handwheel: '80-48' },
        { model: 'YSZ-A210DA', airConnection: 'G1/4"', torque04: 1050, torque05: 1310, handwheel: '80-48' },
        { model: 'YSZ-A240DA', airConnection: 'G1/4"', torque04: 1540, torque05: 1900, handwheel: '78-60' },
        { model: 'YSZ-A270DA', airConnection: 'G1/2"', torque04: 2340, torque05: 2930, handwheel: '78-80' },
    ]
};
// 执行机构品牌数据
export const actuatorBrandData = [
    {
        brand: '华尔式',
        types: [huaerShiBoChaData]
    },
    {
        brand: '永盛',
        types: [yongShengChiLunData]
    }
];
/**
 * 获取所有品牌列表
 */
export function getActuatorBrands() {
    return actuatorBrandData.map(b => b.brand);
}
/**
 * 根据品牌获取类型列表
 */
export function getActuatorTypes(brand) {
    const brandData = actuatorBrandData.find(b => b.brand === brand);
    return brandData ? brandData.types.map(t => t.type) : [];
}
/**
 * 根据品牌和类型获取型号列表
 * @param brand 品牌
 * @param type 类型
 * @param actionMode 作用方式: 'single' | 'double' | 'all'
 */
export function getActuatorModels(brand, type, actionMode = 'all') {
    const brandData = actuatorBrandData.find(b => b.brand === brand);
    if (!brandData)
        return [];
    const typeData = brandData.types.find(t => t.type === type);
    if (!typeData)
        return [];
    const models = [];
    if (actionMode === 'single' || actionMode === 'all') {
        models.push(...typeData.singleAction.map(s => s.model));
    }
    if (actionMode === 'double' || actionMode === 'all') {
        models.push(...typeData.doubleAction.map(s => s.model));
    }
    return models;
}
/**
 * 根据型号获取执行机构规格
 */
export function getActuatorSpec(brand, type, model) {
    const brandData = actuatorBrandData.find(b => b.brand === brand);
    if (!brandData)
        return null;
    const typeData = brandData.types.find(t => t.type === type);
    if (!typeData)
        return null;
    const spec = typeData.singleAction.find(s => s.model === model)
        || typeData.doubleAction.find(s => s.model === model);
    return spec || null;
}
/**
 * 判断型号是单作用还是双作用
 */
export function getActionMode(model) {
    if (model.includes('SR') || model.includes('sr'))
        return '单作用';
    if (model.includes('DA') || model.includes('da'))
        return '双作用';
    return null;
}
