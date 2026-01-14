# Kv计算系统操作手册

## 1. 系统概述

本系统是基于IEC标准的控制阀Kv/Cv计算工具，支持液体、气体、蒸汽三种工况的Kv计算和噪音预测。

### 1.1 功能特性

- **Kv/Cv计算**: 支持液体、气体、蒸汽工况
- **流动状态判定**: 自动判定阻塞流/非阻塞流状态
- **阀门开度计算**: 支持等百分比、线性、快开特性
- **噪音预测**: 基于IEC 60534-8-3/8-4标准
- **批量计算**: 支持JSON批量输入

### 1.2 技术栈

- 运行环境: Node.js 18+
- 开发语言: TypeScript
- 依赖管理: npm

## 2. 安装部署

### 2.1 环境要求

```bash
# 检查Node.js版本
node --version  # 需要 >= 18.0.0
```

### 2.2 安装步骤

```bash
# 克隆项目
git clone <repository-url>
cd kv_system

# 安装依赖
npm install

# 编译TypeScript (可选)
npm run build
```

## 3. 使用方法

### 3.1 命令行批量计算

```bash
# 基本Kv计算
bun cli/batch-calculate.ts <input.json>

# 包含噪音计算
bun cli/batch-calculate.ts <input.json> --noise

# 显示详细计算过程
bun cli/batch-calculate.ts <input.json> --noise --detail

# 输出结果到JSON文件
bun cli/batch-calculate.ts <input.json> --noise -o results.json
```

### 3.2 输入文件格式

创建JSON格式的输入文件，示例如下:

```json
[
  {
    "name": "液体工况示例",
    "fluidType": "液体",
    "temperature": 40,
    "tempUnit": "℃",
    "flowRate": 80,
    "flowUnit": "m3/h",
    "P1": 1.5,
    "P2": 0.2,
    "pressureUnit": "MPa(G)",
    "density": 995,
    "densityUnit": "Kg/m3",
    "viscosity": 0.8,
    "viscosityUnit": "cP",
    "DN": 100,
    "FL": 0.85,
    "flowChar": "等百分比",
    "rangeability": 50,
    "ratedKv": 250
  }
]
```

### 3.3 参数说明

#### 必填参数

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| fluidType | string | 流体类型 | "液体" / "气体" / "蒸汽" |
| temperature | number | 介质温度 | 40 |
| tempUnit | string | 温度单位 | "℃" / "K" / "F" |
| flowRate | number | 流量 | 80 |
| flowUnit | string | 流量单位 | "m3/h" / "Nm3/h" / "Kg/h" |
| P1 | number | 阀前压力 | 1.5 |
| P2 | number | 阀后压力 | 0.2 |
| pressureUnit | string | 压力单位 | "MPa(G)" / "KPa(A)" |
| density | number | 密度 | 995 |
| densityUnit | string | 密度单位 | "Kg/m3" / "Kg/Nm3" |
| DN | number | 公称口径 | 100 |
| FL | number | 压力恢复系数 | 0.85 |
| flowChar | string | 流量特性 | "等百分比" / "线性" |
| rangeability | number | 可调比 | 50 |
| ratedKv | number | 额定Kv | 250 |

#### 可选参数

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| viscosity | number | 粘度 | 1 cP |
| viscosityUnit | string | 粘度单位 | "cP" |
| molecularWeight | number | 分子量(气体) | 29 |
| gamma | number | 比热比(气体) | 1.4 |
| Z | number | 压缩系数 | 1 |
| XT | number | 压差比系数 | 0.72 |
| Fd | number | 阀门类型修正系数 | 0.46 |
| seatSize | number | 阀座尺寸 | 等于DN |

### 3.4 输出结果说明

#### 基本输出

```
┌─────────┬────────┬───────────┬──────────┬───────────┐
│ 名称    │ 类型   │ 计算Kv    │ 开度(%)  │ 流动状态  │
├─────────┼────────┼───────────┼──────────┼───────────┤
│ 示例1   │ 液体   │ 23.52     │ 39.6     │ 阻塞流    │
└─────────┴────────┴───────────┴──────────┴───────────┘
```

#### 含噪音输出 (--noise)

```
┌─────────┬────────┬───────────┬──────────┬───────────┬────────────┐
│ 名称    │ 类型   │ 计算Kv    │ 开度(%)  │ 流动状态  │ 噪音(dBA)  │
├─────────┼────────┼───────────┼──────────┼───────────┼────────────┤
│ 示例1   │ 液体   │ 23.52     │ 39.6     │ 阻塞流    │ 74.1       │
└─────────┴────────┴───────────┴──────────┴───────────┴────────────┘
```

## 4. API调用

### 4.1 程序化调用

```typescript
import { KvCalculator } from './src/kv-calculator.js';

const calculator = new KvCalculator();

// 基本Kv计算
const result = calculator.calculate(input);

// 包含噪音计算
const resultWithNoise = calculator.calculateWithNoise(input, true);
```

### 4.2 返回结果结构

```typescript
interface KvResult {
  calculatedKv: number;      // 计算Kv
  calculatedCv: number;      // 计算Cv
  valveOpening: number;      // 阀门开度 %
  flowState: string;         // 流动状态
  turbulenceState: string;   // 紊流状态
  fluidState?: string;       // 流体状态(液体)
  outletVelocity: number;    // 出口流速 m/s
  noise?: number;            // 噪音 dBA
  intermediate: {            // 中间计算值
    P1Abs: number;           // 入口绝对压力 KPa
    P2Abs: number;           // 出口绝对压力 KPa
    deltaP: number;          // 压差 KPa
    // ... 更多中间值
  };
  errors?: string[];         // 错误信息
  warnings?: string[];       // 警告信息
}
```

## 5. 运行测试

### 5.1 噪音计算测试

```bash
bun test/noise-test.ts
```

### 5.2 Excel对比测试

```bash
bun test/excel-comparator.ts
```

### 5.3 JSON文件批量测试

通过 JSON 文件定义多个测试用例，进行批量计算和验证。

#### 命令格式

```bash
# 基本计算
bun cli/batch-calculate.ts <json文件>

# 包含噪音计算
bun cli/batch-calculate.ts <json文件> --noise

# 显示详细计算过程
bun cli/batch-calculate.ts <json文件> --noise --detail

# 输出结果到JSON文件
bun cli/batch-calculate.ts <json文件> --noise -o results.json
```

#### 使用示例

```bash
# 测试所有预置用例
bun cli/batch-calculate.ts test-cases/all-cases.json --noise

# 仅测试液体工况
bun cli/batch-calculate.ts test-cases/liquid-cases.json --noise --detail

# 测试气体工况并保存结果
bun cli/batch-calculate.ts test-cases/gas-cases.json --noise -o gas-results.json

# 测试蒸汽工况
bun cli/batch-calculate.ts test-cases/steam-cases.json --noise
```

#### 预置测试用例文件

| 文件 | 说明 |
|------|------|
| `test-cases/liquid-cases.json` | 液体工况测试用例 (3个) |
| `test-cases/gas-cases.json` | 气体工况测试用例 (4个) |
| `test-cases/steam-cases.json` | 蒸汽工况测试用例 (3个) |
| `test-cases/all-cases.json` | 综合测试用例 (6个) |
| `test-cases/template.json` | 空白模板 |

#### JSON文件格式

```json
{
  "cases": [
    {
      "name": "测试用例名称",
      "fluidType": "液体",
      "Q": 80,
      "P1": 1.5,
      "P2": 0.2,
      "pressureUnit": "MPa(G)",
      "temperature": 40,
      "density": 995,
      "densityUnit": "Kg/m3",
      "DN": 100,
      "FL": 0.85,
      "ratedKv": 250
    }
  ]
}
```

#### 参数说明

**液体工况必填参数:**

| 参数 | 说明 | 示例 |
|------|------|------|
| name | 用例名称 | "液体-水-常规" |
| fluidType | "液体" | "液体" |
| Q | 体积流量 m³/h | 80 |
| P1 | 入口压力 | 1.5 |
| P2 | 出口压力 | 0.2 |
| temperature | 温度 | 40 |
| density | 密度 Kg/m³ | 995 |
| DN | 公称口径 mm | 100 |
| FL | 压力恢复系数 | 0.85 |
| ratedKv | 额定Kv | 250 |

**气体工况必填参数:**

| 参数 | 说明 | 示例 |
|------|------|------|
| fluidType | "气体" | "气体" |
| Qn | 标准流量 Nm³/h | 5000 |
| M | 分子量 | 29 |
| gamma | 比热比 | 1.4 |
| XT | 压差比系数 | 0.72 |

**蒸汽工况必填参数:**

| 参数 | 说明 | 示例 |
|------|------|------|
| fluidType | "蒸汽" | "蒸汽" |
| W | 质量流量 Kg/h | 2000 |
| gamma | 比热比 | 1.3 |
| XT | 压差比系数 | 0.72 |

#### 创建自定义测试用例

1. 复制模板文件:
```bash
cp test-cases/template.json test-cases/my-cases.json
```

2. 编辑 `my-cases.json`，修改参数

3. 运行测试:
```bash
bun cli/batch-calculate.ts test-cases/my-cases.json --noise --detail
```

### 5.4 随机参数验证

用于随机生成输入参数并验证计算结果：

```bash
# 基本用法 - 随机生成1组测试
bun test/random-verify.ts

# 指定流体类型
bun test/random-verify.ts liquid    # 液体工况
bun test/random-verify.ts gas       # 气体工况
bun test/random-verify.ts steam     # 蒸汽工况

# 生成多组测试
bun test/random-verify.ts -n 5                # 5组随机类型
bun test/random-verify.ts gas -n 3            # 3组气体工况
bun test/random-verify.ts liquid -n 10        # 10组液体工况

# 查看帮助
bun test/random-verify.ts --help
```

#### 输出内容说明

| 输出项 | 说明 |
|-------|------|
| 输入参数 | 随机生成的工况参数 |
| 计算结果 | Kv、Cv、开度、流动状态 |
| 噪音计算结果 | 噪音级(dBA)、流动状态、峰值频率 |
| 噪音计算中间值 | Uvc、η、Wm、Wa、Lpi、TL、Lpe |
| 噪音评估 | 根据噪音级别给出的评估建议 |
| 警告信息 | 空化、高流速、高噪音等警告 |

#### 随机参数范围

| 参数 | 液体 | 气体 | 蒸汽 |
|------|------|------|------|
| 温度 | 10-80℃ | 10-100℃ | 饱和温度+10~100℃ |
| P1 | 0.3-3.0 MPa | 0.3-2.0 MPa | 0.3-2.5 MPa |
| P2 | 0.05-0.6×P1 | 0.05-0.5×P1 | 0.1-0.7×P1 |
| FL | 0.80-0.95 | 0.80-0.95 | 0.85-0.95 |
| xT | - | 0.65-0.80 | 0.68-0.78 |
| DN | 25-300mm | 25-300mm | 25-300mm |

## 6. 噪音计算说明

### 6.1 噪音级参考范围

| 流体类型 | 流动状态 | 典型噪音范围 |
|---------|---------|-------------|
| 液体 | 无空化 | 50-70 dBA |
| 液体 | 初生空化 | 65-80 dBA |
| 液体 | 恒定空化 | 70-90 dBA |
| 气体 | 亚音速 | 70-90 dBA |
| 气体 | 临界流 | 90-120 dBA |
| 蒸汽 | 一般工况 | 70-100 dBA |

### 6.2 噪音警告阈值

- **85 dBA**: 需采取降噪措施
- **100 dBA**: 建议选用低噪音阀或加装消音器

### 6.3 降噪建议

1. **选用低噪音阀内件**: 多级降压、扩散器等
2. **减小压差**: 分级降压
3. **加装消音器**: 管道消音器
4. **隔音罩**: 设备隔音处理

## 7. 常见问题

### 7.1 计算结果与Excel不一致

1. 检查输入参数单位是否正确
2. 确认压力是表压(G)还是绝压(A)
3. 检查FL、XT等阀门参数

### 7.2 噪音值异常高

1. 检查是否处于临界流状态
2. 确认压差比是否过大
3. 验证管道参数(壁厚、内径)

### 7.3 阀门开度超100%

1. 额定Kv选型过小
2. 需要选择更大规格的阀门

## 8. 参考标准

- IEC 60534-2-1: 流量系数计算
- IEC 60534-8-3: 气体噪音预测
- IEC 60534-8-4: 液体噪音预测

## 9. 版本信息

- 版本: 1.0.0
- 更新日期: 2026-01-14
- 维护者: DirectorLi Team
