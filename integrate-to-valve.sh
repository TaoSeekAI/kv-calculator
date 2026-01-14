#!/bin/bash

# Kv-Calculator 集成到 Valve 项目的自动化脚本
# 使用方法：./integrate-to-valve.sh

set -e  # 遇到错误立即退出

# 定义颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目路径
VALVE_PATH="/Users/harryma/Documents/codes/ZH/idiot/tricorekernel/valve"
KV_PATH="/Users/harryma/Documents/codes/DirectorLi/kv_system"

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}  Kv-Calculator 集成到 Valve 项目${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

# 检查 valve 项目是否存在
if [ ! -d "$VALVE_PATH" ]; then
    echo -e "${RED}错误: Valve 项目不存在: $VALVE_PATH${NC}"
    exit 1
fi

# 步骤 1: 编译 kv-calculator
echo -e "${YELLOW}[1/5] 编译 kv-calculator...${NC}"
cd "$KV_PATH"
npm run build
echo -e "${GREEN}✓ 编译完成${NC}"
echo ""

# 步骤 2: 在 valve 项目中创建 packages 目录
echo -e "${YELLOW}[2/5] 创建 packages 目录...${NC}"
cd "$VALVE_PATH"
mkdir -p packages
echo -e "${GREEN}✓ 目录创建完成${NC}"
echo ""

# 步骤 3: 添加 Git Submodule
echo -e "${YELLOW}[3/5] 添加 Git Submodule...${NC}"
if [ -d "packages/kv-calculator" ]; then
    echo -e "${BLUE}ℹ Submodule 已存在，跳过...${NC}"
else
    git submodule add "$KV_PATH" packages/kv-calculator || {
        echo -e "${BLUE}ℹ Submodule 可能已存在，尝试初始化...${NC}"
        git submodule update --init --recursive
    }
    echo -e "${GREEN}✓ Submodule 添加完成${NC}"
fi
echo ""

# 步骤 4: 更新 valve 项目的 package.json
echo -e "${YELLOW}[4/5] 更新 package.json...${NC}"
cat > package.json.new << 'EOF'
{
  "name": "valve-specification",
  "private": true,
  "version": "1.0.0",
  "description": "阀门规格书桌面应用 - Valve Specification Sheet Desktop Application",
  "type": "module",
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
EOF

# 备份原有的 package.json
if [ -f "package.json" ]; then
    cp package.json package.json.backup
    echo -e "${BLUE}ℹ 原 package.json 已备份为 package.json.backup${NC}"
fi

mv package.json.new package.json
echo -e "${GREEN}✓ package.json 更新完成${NC}"
echo ""

# 步骤 5: 安装依赖
echo -e "${YELLOW}[5/5] 安装依赖...${NC}"
npm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"
echo ""

# 完成
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}  ✓ 集成完成！${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""
echo -e "${BLUE}下一步操作：${NC}"
echo ""
echo -e "1. 查看集成文档："
echo -e "   ${YELLOW}cat $KV_PATH/INTEGRATION.md${NC}"
echo ""
echo -e "2. 启动开发服务器："
echo -e "   ${YELLOW}cd $VALVE_PATH${NC}"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo -e "3. 在 React 组件中使用："
echo -e "   ${YELLOW}import { kvCalculator } from 'kv-calculator';${NC}"
echo ""
echo -e "4. 如需监听模式开发，打开两个终端："
echo -e "   终端 1: ${YELLOW}cd packages/kv-calculator && npm run build:watch${NC}"
echo -e "   终端 2: ${YELLOW}npm run dev${NC}"
echo ""
