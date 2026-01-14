# Kv-Calculator 集成指南

## 📦 将计算引擎集成到 Valve 桌面应用

本指南说明如何将 kv-calculator 集成到 valve 项目中，同时保持两个项目的独立维护。

---

## 🎯 方案选择

### 推荐方案：Git Submodule + npm Workspace

**适用场景**：
- ✅ 两个项目都在本地开发
- ✅ 需要频繁同步更新
- ✅ 保持独立的 Git 仓库
- ✅ 便于调试和开发

**优点**：
- 实时同步代码更改（开发模式）
- 独立的版本控制
- 统一的依赖管理
- 支持 TypeScript 类型提示

---

## 🚀 集成步骤

### 步骤 1：在 valve 项目中添加 Submodule

```bash
cd /Users/harryma/Documents/codes/ZH/idiot/tricorekernel/valve

# 创建 packages 目录
mkdir -p packages

# 添加 kv-calculator 作为 submodule
git submodule add \
  /Users/harryma/Documents/codes/DirectorLi/kv_system \
  packages/kv-calculator

# 初始化 submodule
git submodule update --init --recursive
```

### 步骤 2：配置 valve 项目的 package.json

修改 `/Users/harryma/Documents/codes/ZH/idiot/tricorekernel/valve/package.json`：

```json
{
  "name": "valve-specification",
  "private": true,
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "vite",
    "build": "npm run build:kv && vite build",
    "build:kv": "npm run build --workspace=kv-calculator",
    "preview": "vite preview",
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  },
  "dependencies": {
    "kv-calculator": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.9.6",
    "@vitejs/plugin-react": "^5.1.1",
    "vite": "^7.2.4"
  }
}
```

### 步骤 3：配置 Vite 支持 TypeScript 模块

修改 `vite.config.js`：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'kv-calculator': path.resolve(__dirname, './packages/kv-calculator/dist')
    }
  },
  // 确保能正确解析 submodule 中的依赖
  optimizeDeps: {
    include: ['kv-calculator']
  }
})
```

### 步骤 4：编译 kv-calculator

```bash
cd packages/kv-calculator
npm run build
# 或者在开发模式下自动编译
npm run build:watch
```

### 步骤 5：在 React 组件中使用

创建计算 Hook（示例）：

```typescript
// valve/src/hooks/useKvCalculator.js
import { kvCalculator } from 'kv-calculator';
import { useState } from 'react';

export function useKvCalculator() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculate = async (params) => {
    setLoading(true);
    setError(null);

    try {
      // 调用计算引擎
      const calculationResult = kvCalculator.calculate(params);
      setResult(calculationResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, calculate };
}
```

在组件中使用：

```jsx
// valve/src/components/ValveSpecificationForm.jsx
import { useKvCalculator } from '../hooks/useKvCalculator';

function ValveSpecificationForm() {
  const { result, loading, error, calculate } = useKvCalculator();

  const handleSubmit = (formData) => {
    calculate({
      flowType: 'liquid',
      flowRate: formData.flowRate,
      pressureDrop: formData.pressureDrop,
      // ... 其他参数
    });
  };

  return (
    <div>
      {/* 表单 UI */}
      {loading && <p>计算中...</p>}
      {error && <p>错误: {error}</p>}
      {result && (
        <div>
          <h3>计算结果</h3>
          <p>Kv 值: {result.kv}</p>
          <p>Cv 值: {result.cv}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 日常开发工作流

### 开发 kv-calculator

```bash
# 在 kv_system 独立项目中开发
cd /Users/harryma/Documents/codes/DirectorLi/kv_system

# 进行修改和测试
npm run test

# 提交代码
git add .
git commit -m "feat: 新增功能"
git push
```

### 同步更新到 valve 项目

```bash
# 在 valve 项目中更新 submodule
cd /Users/harryma/Documents/codes/ZH/idiot/tricorekernel/valve
git submodule update --remote packages/kv-calculator

# 重新编译
cd packages/kv-calculator
npm run build

# 测试 valve 应用
cd ../..
npm run dev
```

### 自动监听模式（推荐）

```bash
# 终端 1：启动 kv-calculator 监听编译
cd /Users/harryma/Documents/codes/ZH/idiot/tricorekernel/valve/packages/kv-calculator
npm run build:watch

# 终端 2：启动 valve 开发服务器
cd /Users/harryma/Documents/codes/ZH/idiot/tricorekernel/valve
npm run dev
```

---

## 🎨 TypeScript 类型支持

kv-calculator 已配置自动生成类型定义文件（.d.ts），在 valve 项目中可以获得完整的类型提示。

```typescript
// 在 TypeScript 文件中
import type { CalculationInput, CalculationResult } from 'kv-calculator';

const input: CalculationInput = {
  flowType: 'liquid',
  flowRate: 100,
  pressureDrop: 5
};
```

---

## ⚠️ 注意事项

### 1. **依赖管理**
- kv-calculator 的依赖会被提升到 valve 根目录的 node_modules
- 避免版本冲突，确保两个项目使用兼容的依赖版本

### 2. **构建顺序**
- 确保 kv-calculator 先编译，再运行 valve
- 使用 `npm run build:kv` 可以自动处理

### 3. **Git 提交**
- submodule 的修改需要在两个仓库分别提交
- valve 项目只记录 submodule 的 commit hash

```bash
# 提交 kv-calculator 的修改
cd packages/kv-calculator
git add .
git commit -m "fix: 修复计算错误"
git push

# 提交 valve 项目（更新 submodule 引用）
cd ../..
git add packages/kv-calculator
git commit -m "chore: 更新 kv-calculator 到最新版本"
git push
```

### 4. **团队协作**
其他开发者克隆 valve 项目时，需要初始化 submodule：

```bash
git clone <valve-repo-url>
cd valve
git submodule update --init --recursive
```

---

## 🔀 替代方案

### 方案 2：npm link（仅开发环境）

如果不想使用 Git Submodule：

```bash
# 在 kv_system 项目中
cd /Users/harryma/Documents/codes/DirectorLi/kv_system
npm link

# 在 valve 项目中
cd /Users/harryma/Documents/codes/ZH/idiot/tricorekernel/valve
npm link kv-calculator
```

**优点**：不需要修改 Git 配置
**缺点**：每次重装依赖后需要重新 link

### 方案 3：发布为 npm 包（生产环境推荐）

```bash
# 在 kv_system 项目中
npm publish

# 在 valve 项目中
npm install kv-calculator@latest
```

---

## 📚 API 使用示例

### 液体流量计算

```javascript
import { calculateLiquidKv } from 'kv-calculator';

const result = calculateLiquidKv({
  flowRate: 100,        // kg/h
  pressureDrop: 5,      // bar
  density: 1000,        // kg/m³
  temperature: 20       // °C
});

console.log(result.kv); // Kv 值
console.log(result.cv); // Cv 值
```

### 气体流量计算

```javascript
import { calculateGasKv } from 'kv-calculator';

const result = calculateGasKv({
  flowRate: 1000,       // Nm³/h
  pressureDrop: 2,      // bar
  inletPressure: 10,    // bar
  temperature: 25,      // °C
  molecularWeight: 29   // g/mol
});
```

---

## 🐛 故障排查

### 问题：找不到模块 'kv-calculator'

**解决方案**：
1. 确保 kv-calculator 已编译：`cd packages/kv-calculator && npm run build`
2. 重新安装依赖：`npm install`
3. 检查 vite.config.js 的 alias 配置

### 问题：类型提示不工作

**解决方案**：
1. 确保 kv-calculator 生成了 .d.ts 文件
2. 重启 IDE/编辑器
3. 检查 tsconfig.json 的 paths 配置

### 问题：Submodule 更新失败

**解决方案**：
```bash
git submodule deinit -f packages/kv-calculator
git submodule update --init --recursive
```

---

## 📞 支持

如有问题，请查看：
- kv-calculator 项目：/Users/harryma/Documents/codes/DirectorLi/kv_system
- valve 项目：/Users/harryma/Documents/codes/ZH/idiot/tricorekernel/valve
