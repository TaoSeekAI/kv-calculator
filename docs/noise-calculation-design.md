# 噪音计算模块设计文档

## 1. 概述

本文档详细描述Kv计算系统中噪音计算模块的设计与实现方案，基于以下国际标准：
- **IEC 60534-8-3**: 气体噪音预测（空气动力学噪声）
- **IEC 60534-8-4**: 液体噪音预测（液压流体噪声）

## 2. 模块架构

```
src/calculators/
├── gas-noise.ts       # 气体噪音计算模块
├── liquid-noise.ts    # 液体噪音计算模块
└── noise/
    ├── constants.ts   # 噪音计算专用常数
    └── types.ts       # 噪音计算类型定义
```

## 3. 气体噪音计算 (IEC 60534-8-3)

### 3.1 流动状态分类

气体噪音计算根据压力条件分为5种流动状态：

| 状态 | 条件 | 描述 |
|------|------|------|
| State I | P2 ≥ P2C | 亚音速流 (Subsonic) |
| State II | P2C > P2 ≥ Pvc | 过渡流 (Transitional) |
| State III | Pvc > P2 ≥ P2B | 临界流 (Critical) |
| State IV | P2B > P2 ≥ P2CE | 常数声效系数 |
| State V | P2 < P2CE | 完全阻塞流 |

### 3.2 关键参数计算

#### 3.2.1 缩流断面压力 (Pvc)
```
亚音速流: Pvc = P1 - (P1 - P2) / FL²
临界流:   Pvcc = P1 × (2/(γ+1))^(γ/(γ-1))
```

#### 3.2.2 临界压力边界
```
P2C = P1 × (1 - xT × Fγ)           # 临界流起始压力
P2B = P1 × (1 - xT × Fγ × 22/αmax) # State IV 边界
P2CE = Pvcc × (1.5 + 3)            # State V 边界
```

#### 3.2.3 缩流断面马赫数 (Mvc)
```
State I:   Mvc = √((2/(γ-1)) × ((P1/Pvc)^((γ-1)/γ) - 1))
State II+: Mvc = 1 (声速流)
```

#### 3.2.4 缩流断面流速 (Uvc)
```
Uvc = Mvc × c1 × √(Pvc/P1)^((γ-1)/2γ)
```
其中 c1 = √(γ × R × T1 / M) 为入口声速

#### 3.2.5 出口流速 (U2)
```
U2 = W / (ρ2 × A2)
```
其中 A2 = π × (D2/2)² 为出口管道截面积

### 3.3 声功率计算

#### 3.3.1 声效系数 (η)

**State I (亚音速)**:
```
η = 10^(-4) × Mvc^3
```

**State II-V (临界及以上)**:
```
η = ηref × (Mvc)^w
```
其中：
- ηref: 参考声效系数 (典型值 10^-4)
- w: 指数 (State II: 3, State III+: 变化)

#### 3.3.2 流体机械功率 (Wm)
```
Wm = m × Uvc² / 2
```
其中 m = W/3600 为质量流量 (kg/s)

#### 3.3.3 声功率 (Wa)
```
Wa = η × Wm
```

### 3.4 噪音级计算

#### 3.4.1 内部声功率级 (Lpi)
```
Lpi = 10 × log10(3.2×10^9 × Wa × ρ2 × c2 / Di²)
```
其中：
- Di: 下游管道内径 (m)
- c2: 下游声速 (m/s)
- ρ2: 下游密度 (kg/m³)

#### 3.4.2 管道透射损失 (TL)
```
TL = 10 × log10(1 + (ρp × tp × fp) / (485 × ρ2 × c2))
```
其中：
- ρp: 管道材料密度 (钢: 7800 kg/m³)
- tp: 管道壁厚 (m)
- fp: 管道环频率 (Hz)

#### 3.4.3 外部噪音级 (Lpe)
```
Lpe = Lpi - TL + 10 × log10(Di / (Di + 2tp))
```

### 3.5 频率校正

A加权校正值（基于频率）：
```
ΔLA = -145.528 + 98.262×log10(fp) - 19.509×(log10(fp))² + 0.975×(log10(fp))³
```

最终A加权噪音级：
```
LpAe = Lpe + ΔLA
```

---

## 4. 液体噪音计算 (IEC 60534-8-4)

### 4.1 流动状态分类

液体噪音根据空化程度分为：

| 状态 | 条件 | 描述 |
|------|------|------|
| 紊流 | xF ≤ xFz | 无空化紊流 |
| 初生空化 | xFz < xF ≤ FL² | 开始空化 |
| 恒定空化 | FL² < xF ≤ 1 | 稳定空化 |
| 闪蒸 | xF > 1 | 完全汽化 |

### 4.2 关键参数计算

#### 4.2.1 压差比 (xF)
```
xF = (P1 - P2) / (P1 - Pv)
```

#### 4.2.2 空化起始压差比 (xFz)

**标准阀门**:
```
xFz = 0.9 / √(1 + 3×Fd×√(C / (N34×FL)))
```
其中 N34 = 2.12×10^-5 (单位常数)

**多级降压阀**:
```
xFz = 1 / √(4.5 + 1650×No×dH² / FL)
```
其中：
- No: 级数
- dH: 孔径 (m)

### 4.3 声效系数计算

#### 4.3.1 紊流声效系数 (ηturb)
```
ηturb = 10^Aη × (Uvc/cL)
```
其中：
- Aη: 声效指数 (典型值 -4 到 -3.5)
- cL: 液体声速 (水: 1480 m/s)
- Uvc: 缩流断面流速

#### 4.3.2 缩流断面流速 (Uvc)
```
Uvc = (1/FL) × √(2×ΔPc/ρL)
```
其中 ΔPc = min(ΔP, FL²×(P1-Pv)) 为有效压差

#### 4.3.3 空化声效系数 (ηcav)
```
ηcav = 0.32 × ηturb × √((P1-P2)/ΔPc) ×
       exp(5×xFzp) × ((1-xFzp)/(1-xF))^0.5 ×
       (xF/xFzp)^5 × (xF-xFzp)^1.5
```
其中 xFzp = 有效空化起始点

### 4.4 机械功率与声功率

#### 4.4.1 机械功率 (Wm)
```
Wm = m × Uvc² × FL² / 2
```
其中 m = Q × ρL / 3600 为质量流量 (kg/s)

#### 4.4.2 声功率 (Wa)

**纯紊流**:
```
Wa = ηturb × Wm
```

**空化流**:
```
Wa = (ηturb + ηcav) × Wm × rw
```
其中 rw 为声功率比（按阀门类型选择，标准阀: 0.25）

### 4.5 噪音级计算

#### 4.5.1 内部声功率级 (Lpi)
```
Lpi = 10 × log10(Wa / W0) + 10 × log10(ρL × cL / (Di × ρ0 × c0))
```
其中 W0 = 10^-12 W 为参考声功率

#### 4.5.2 透射损失 (TL)
```
TL = 17 × log10(ts × ρp × fp / (ρL × cL)) - 10 × log10(Di)
```

#### 4.5.3 外部噪音级 (Lpe)
```
Lpe = Lpi - TL + 3  (距阀门1m处)
```

---

## 5. 类型定义

### 5.1 噪音计算输入接口

```typescript
interface NoiseInput {
  // 基础参数（从KvInput继承）
  fluidType: '液体' | '气体' | '蒸汽';

  // 压力参数
  P1: number;              // 入口压力 KPa(A)
  P2: number;              // 出口压力 KPa(A)
  deltaP: number;          // 压差 KPa

  // 温度参数
  T1: number;              // 入口温度 K

  // 流量参数
  massFlow: number;        // 质量流量 kg/h
  volumeFlow?: number;     // 体积流量 m³/h

  // 流体属性
  density: number;         // 密度 kg/m³
  gamma?: number;          // 比热比 (气体)
  molecularWeight?: number;// 分子量 (气体)
  Pv?: number;             // 饱和蒸汽压 KPa (液体)
  soundSpeed?: number;     // 声速 m/s

  // 阀门参数
  Kv: number;              // 计算Kv
  FL: number;              // 压力恢复系数
  xT?: number;             // 压差比系数
  Fd?: number;             // 阀门类型修正系数
  xFz?: number;            // 空化起始压差比 (液体)

  // 管道参数
  Di: number;              // 下游管道内径 mm
  tp: number;              // 管道壁厚 mm
  pipeMaterial?: 'steel' | 'stainless';
}
```

### 5.2 噪音计算结果接口

```typescript
interface NoiseResult {
  // 主要结果
  noiseLevel: number;      // 噪音级 dBA (距1m处)

  // 流动状态
  flowState: string;       // 流动状态描述
  cavitationState?: string;// 空化状态 (液体)

  // 中间计算值
  intermediate: {
    // 流速
    Uvc: number;           // 缩流断面流速 m/s
    U2: number;            // 出口流速 m/s
    Mvc?: number;          // 缩流断面马赫数 (气体)

    // 声效系数
    eta: number;           // 总声效系数
    etaTurb?: number;      // 紊流声效系数
    etaCav?: number;       // 空化声效系数

    // 功率
    Wm: number;            // 机械功率 W
    Wa: number;            // 声功率 W

    // 噪音级
    Lpi: number;           // 内部声功率级 dB
    TL: number;            // 透射损失 dB
    Lpe: number;           // 外部噪音级 dB
    deltaLA?: number;      // A加权校正 dB
  };

  // 频率信息
  peakFrequency?: number;  // 峰值频率 Hz

  // 警告信息
  warnings?: string[];
}
```

---

## 6. 常数定义

```typescript
const NOISE_CONSTANTS = {
  // 声学参考值
  W0: 1e-12,              // 参考声功率 W
  P0: 2e-5,               // 参考声压 Pa
  rho0: 1.293,            // 参考空气密度 kg/m³
  c0: 343,                // 参考声速 m/s

  // 材料常数
  STEEL_DENSITY: 7800,    // 钢密度 kg/m³
  STAINLESS_DENSITY: 8000,// 不锈钢密度 kg/m³

  // 流体声速
  WATER_SOUND_SPEED: 1480,// 水声速 m/s
  AIR_SOUND_SPEED: 343,   // 空气声速 m/s

  // 声效系数参考值
  ETA_REF: 1e-4,          // 参考声效系数

  // A加权校正系数
  A_WEIGHTING: {
    A1: -145.528,
    A2: 98.262,
    A3: -19.509,
    A4: 0.975
  },

  // 声功率比
  RW_STANDARD: 0.25,      // 标准阀门
  RW_CAGE: 0.20,          // 笼式阀
  RW_MULTISTAGE: 0.15,    // 多级降压

  // 计算常数
  N34: 2.12e-5,           // xFz计算常数
};
```

---

## 7. 测试方案

### 7.1 测试用例设计

#### 7.1.1 气体噪音测试用例

| 用例 | 流体 | P1 (KPa) | P2 (KPa) | T (℃) | 流量 | 预期噪音 |
|------|------|----------|----------|--------|------|----------|
| G1 | 空气 | 600 | 100 | 20 | 5000 Nm³/h | 85-95 dBA |
| G2 | 空气 | 1000 | 500 | 50 | 3000 Nm³/h | 75-85 dBA |
| G3 | 天然气 | 400 | 200 | 30 | 2000 Nm³/h | 70-80 dBA |
| G4 | 蒸汽 | 1000 | 500 | 200 | 2000 kg/h | 80-90 dBA |

#### 7.1.2 液体噪音测试用例

| 用例 | 流体 | P1 (KPa) | P2 (KPa) | T (℃) | 流量 | 预期噪音 |
|------|------|----------|----------|--------|------|----------|
| L1 | 水 | 1500 | 200 | 40 | 80 m³/h | 70-80 dBA |
| L2 | 水 | 2000 | 100 | 50 | 100 m³/h | 80-90 dBA |
| L3 | 水 | 500 | 100 | 25 | 10 m³/h | 60-70 dBA |
| L4 | 油 | 800 | 200 | 60 | 50 m³/h | 65-75 dBA |

### 7.2 验证标准

1. **误差容限**: ±3 dBA (符合IEC标准允许误差)
2. **流动状态**: 正确识别所有流动状态
3. **边界条件**: 处理极端工况（高压差、低流量等）
4. **与Excel比对**: 与原Excel计算结果误差 < 5%

### 7.3 测试文件结构

```
test/
├── noise/
│   ├── gas-noise.test.ts      # 气体噪音单元测试
│   ├── liquid-noise.test.ts   # 液体噪音单元测试
│   └── noise-integration.test.ts # 集成测试
├── fixtures/
│   └── noise-test-cases.json  # 测试数据
```

---

## 8. 实施计划

### Phase 1: 基础框架 (已完成规划)
- [x] 噪音计算设计文档
- [ ] 类型定义扩展
- [ ] 常数定义扩展

### Phase 2: 气体噪音实现
- [ ] 流动状态判定
- [ ] 缩流参数计算
- [ ] 声效系数计算
- [ ] 声功率级计算
- [ ] A加权校正

### Phase 3: 液体噪音实现
- [ ] 空化状态判定
- [ ] 缩流流速计算
- [ ] 紊流声效系数
- [ ] 空化声效系数
- [ ] 声功率计算

### Phase 4: 集成与测试
- [ ] 集成到KvCalculator
- [ ] 单元测试
- [ ] Excel比对验证
- [ ] CLI工具更新

---

## 9. API设计

### 9.1 气体噪音计算

```typescript
// src/calculators/gas-noise.ts
export function calculateGasNoise(input: NoiseInput): NoiseResult;
export function determineGasFlowState(P1: number, P2: number, xT: number, gamma: number): GasFlowState;
export function calculateGasAcousticEfficiency(flowState: GasFlowState, Mvc: number): number;
```

### 9.2 液体噪音计算

```typescript
// src/calculators/liquid-noise.ts
export function calculateLiquidNoise(input: NoiseInput): NoiseResult;
export function determineCavitationState(xF: number, xFz: number, FL: number): CavitationState;
export function calculateCavitationEfficiency(params: CavitationParams): number;
```

### 9.3 主计算器集成

```typescript
// src/kv-calculator.ts (扩展)
class KvCalculator {
  calculate(input: KvInput): KvResult {
    // ... 现有Kv计算逻辑

    // 新增噪音计算
    if (shouldCalculateNoise) {
      result.noise = this.calculateNoise(input, result);
    }

    return result;
  }

  private calculateNoise(input: KvInput, kvResult: KvResult): number {
    // 根据流体类型选择计算方法
  }
}
```

---

## 10. 参考资料

1. IEC 60534-8-3:2010 - Control valve aerodynamic noise prediction
2. IEC 60534-8-4:2015 - Control valve hydrodynamic noise prediction
3. ISA-75.17-2020 - Control Valve Aerodynamic Noise Prediction
4. 原始Excel文件: Kv_calculate.xlsx (气体噪音计算、液体噪音计算工作表)
