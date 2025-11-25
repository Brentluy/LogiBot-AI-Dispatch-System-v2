# 🚚 LogiBot - AI 物流调度系统

一个基于 **AI Function Calling** 的智能物流调度系统 Demo，使用 Claude API 实现自然语言交互，结合 OpenRouteService 进行路线优化和实时调度。

## 📋 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [API 文档](#api-文档)
- [使用指南](#使用指南)
- [技术架构](#技术架构)
- [核心难点](#核心难点)
- [开发说明](#开发说明)
- [常见问题](#常见问题)

## 🎯 项目简介

LogiBot 是一个智能物流调度系统，专为 **Gofo Express** 在 **New Jersey** 的 Fieldsboro Hub 设计。系统通过 AI Agent 实现自然语言交互，用户可以像与助手对话一样管理司机、订单和调度任务。

### 核心亮点

- 🤖 **AI Function Calling**: 使用 Claude API 的 Function Calling 能力，实现自然语言到系统操作的转换
- 🗺️ **实时地图可视化**: 基于 Leaflet 的地图展示，显示司机位置、订单位置和配送路线
- 📊 **数据看板**: KPI 卡片、图表和热力图，实时监控系统状态
- ✏️ **可编辑表格**: 直接在页面中编辑司机和订单信息
- 🚀 **智能调度算法**: 贪婪算法实现多订单、多司机的最优分配

## ✨ 功能特性

### 1. 数据看板 (Dashboard)
- **KPI 卡片**: 空闲司机数、待分配订单数、紧急订单数、运力利用率等
- **数据可视化**: 司机状态分布图、订单优先级分布图
- **实时地图**: 显示所有司机和订单的地理位置

### 2. 操作面板 (Operations)
- **司机状态表**: 可编辑的司机信息表格，包括容量、状态、位置、班次时间
- **订单列表表**: 可编辑的订单信息表格，包括取货地址、目的地、重量、优先级
- **司机排班表**: 显示司机-订单分配关系和预计时间
- **手动分配**: 支持手动将订单分配给指定司机

### 3. AI 助手 (AI Chat)
- **自然语言交互**: 通过对话方式管理系统
- **智能理解**: 支持中文和英文指令
- **自动执行**: AI 自动调用相应工具完成操作
- **实时反馈**: 操作结果实时更新到表格

### 支持的 AI 指令示例

```
- "帮我分单" / "优化路线" → 自动分配司机给订单
- "添加一个订单到 Princeton，重量 500 磅" → 创建新订单
- "添加一个司机，姓名张三，容量 2000 磅" → 创建新司机
- "现在有多少空闲司机？" → 查询系统状态
- "重置系统" → 清除所有数据
```

## 🛠️ 技术栈

### 后端
- **Node.js** (>=14.0.0): JavaScript 运行时
- **Express**: Web 框架
- **node-fetch**: HTTP 请求库
- **dotenv**: 环境变量管理
- **cors**: 跨域资源共享

### 前端
- **React 18**: UI 框架
- **Vite**: 构建工具和开发服务器
- **Tailwind CSS**: 样式框架
- **Leaflet**: 地图可视化库
- **React Hooks**: 状态管理

### 外部服务
- **Anthropic Claude API**: AI 对话和 Function Calling
- **OpenRouteService (ORS) API**: 路线计算和 ETA 估算

## 📁 项目结构

```
dispatch-webapp/
├── backend/                    # 后端服务
│   ├── index.js               # Express 服务器主文件
│   ├── state.js               # 全局状态管理
│   ├── services/              # 服务模块
│   │   ├── agent.js          # AI Agent (Function Calling)
│   │   ├── ai.js             # Claude API 封装
│   │   └── routes.js          # ORS 路线服务
│   ├── mock/                  # Mock 数据（已废弃，使用 state.js 生成）
│   └── package.json
├── frontend/                  # 前端应用
│   ├── src/
│   │   ├── App.jsx            # 主应用组件
│   │   ├── App.css            # 全局样式
│   │   ├── main.jsx           # 入口文件
│   │   ├── index.css          # 基础样式
│   │   └── components/        # 组件目录
│   │       ├── Dashboard.jsx  # 数据看板
│   │       ├── Dashboard.css
│   │       ├── DriverTable.jsx # 司机表格
│   │       ├── OrderTable.jsx # 订单表格
│   │       ├── AssignmentTable.jsx # 排班表格
│   │       ├── AIChat.jsx     # AI 聊天组件
│   │       ├── AIChat.css
│   │       └── MapView.jsx    # 地图组件
│   ├── index.html
│   ├── vite.config.js         # Vite 配置（包含 API 代理）
│   ├── tailwind.config.js     # Tailwind 配置
│   └── package.json
├── package.json               # 根目录脚本
├── vercel.json                # Vercel 部署配置
├── env.example                # 环境变量模板
└── README.md                  # 本文档
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd dispatch-webapp
```

### 2. 安装依赖

**方式一：使用根目录脚本（推荐）**

```bash
npm run install:all
```

**方式二：分别安装**

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 3. 启动服务

**注意：** 现在支持两种配置方式：
- **方式一（推荐）**：通过网页界面配置（首次访问时会自动显示配置页面）
- **方式二（传统）**：通过环境变量文件配置（向后兼容）

**启动后端**（在项目根目录）：

**启动后端**（在项目根目录）：

```bash
npm run dev:backend
```

或者：

```bash
cd backend
npm run dev
```

后端将在 `http://localhost:3001` 运行。

**启动前端**（新开一个终端，在项目根目录）：

```bash
npm run dev:frontend
```

或者：

```bash
cd frontend
npm run dev
```

前端将在 `http://localhost:3000` 运行。

### 4. 配置 API Keys

**方式一：通过网页界面配置（推荐）**

1. 在浏览器中打开：**http://localhost:3000**
2. 首次访问会自动显示配置页面
3. 输入你的 API Keys：
   - **OpenRouteService API Key**: 访问 https://openrouteservice.org/ 注册并获取
   - **Anthropic Claude API Key**: 访问 https://console.anthropic.com/ 注册并获取
4. 点击"保存并开始使用"
5. API Keys 会存储在服务器内存中（不写入文件，安全可靠）

**方式二：通过环境变量文件配置（向后兼容）**

如果你更喜欢使用环境变量文件：

```bash
cp env.example backend/.env
```

编辑 `backend/.env`，填入你的 API Keys：

```env
ORS_API_KEY=your_openrouteservice_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001
```

**注意：** 如果使用环境变量配置，系统会优先使用环境变量中的值。

### 5. 访问应用

在浏览器中打开：**http://localhost:3000**

## ⚙️ 配置说明

### API Keys 配置

| 配置方式 | 说明 | 适用场景 |
|---------|------|---------|
| **网页界面配置** | 通过浏览器界面输入，存储在服务器内存 | 推荐用于快速部署和演示 |
| **环境变量配置** | 通过 `.env` 文件配置 | 适合生产环境和持续运行 |

### 安全提示

- ✅ API Keys **仅存储在服务器内存中**，不会写入文件或数据库
- ✅ 重启服务器后需要重新配置（或使用环境变量）
- ✅ 代码中**不包含任何 API Keys**，可以安全地提交到 GitHub
- ✅ `.env` 文件已添加到 `.gitignore`，不会被提交

### 环境变量（可选）

如果需要使用环境变量配置：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `ORS_API_KEY` | OpenRouteService API Key | `5b3ce35...` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API Key | `sk-ant-api03-...` |
| `PORT` | 后端服务端口（可选，默认 3001） | `3001` |

**环境变量文件位置：**
- 开发环境: `backend/.env`
- 生产环境: 在部署平台（如 Vercel）中配置

## 📡 API 文档

### 基础端点

#### `GET /api/state`
获取当前系统状态（司机、订单、分配关系）

**响应示例：**
```json
{
  "drivers": [
    {
      "id": "D001",
      "name": "张三",
      "capacity": 2000,
      "status": "idle",
      "location": "1183 Florence Columbus Road, Fieldsboro, NJ 08505",
      "lat": 40.1373,
      "lon": -74.7287,
      "shift_window": "9-17"
    }
  ],
  "orders": [
    {
      "id": "O001",
      "pickup_location": "Princeton, NJ 08540, USA",
      "destination": "Trenton, NJ 08608, USA",
      "pickup_lat": 40.3487,
      "pickup_lon": -74.6590,
      "destination_lat": 40.2206,
      "destination_lon": -74.7597,
      "weight": 500,
      "volume": 10,
      "contact": "Customer",
      "priority": "normal",
      "time_window": "09:00-17:00",
      "status": "pending"
    }
  ],
  "assignments": []
}
```

#### `POST /api/drivers`
添加新司机

**请求体：**
```json
{
  "name": "李四",
  "capacity": 1500,
  "location": "Fieldsboro Hub",
  "shift_window": "9-17"
}
```

#### `POST /api/orders`
添加新订单

**请求体：**
```json
{
  "pickup_location": "Princeton, NJ 08540, USA",
  "destination": "Trenton, NJ 08608, USA",
  "weight": 500,
  "volume": 10,
  "contact": "Customer",
  "priority": "normal",
  "time_window": "09:00-17:00"
}
```

#### `PUT /api/drivers/:id`
更新司机信息

#### `PUT /api/orders/:id`
更新订单信息

#### `POST /api/assign`
手动分配订单给司机

**请求体：**
```json
{
  "driver_id": "D001",
  "order_id": "O001"
}
```

#### `POST /api/chat/simple`
AI 聊天接口（非流式）

**请求体：**
```json
{
  "message": "帮我分单"
}
```

**响应示例：**
```json
{
  "message": "已成功分配 5 个订单给司机...",
  "state": {
    "drivers": [...],
    "orders": [...],
    "assignments": [...]
  }
}
```

#### `GET /api/config/status`
获取 API Keys 配置状态

**响应示例：**
```json
{
  "configured": true,
  "hasOrsKey": true,
  "hasAnthropicKey": true
}
```

#### `POST /api/config/keys`
设置 API Keys（存储在内存中）

**请求体：**
```json
{
  "ors_api_key": "your_ors_api_key",
  "anthropic_api_key": "your_anthropic_api_key"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "API Keys 已设置"
}
```

#### `GET /health`
健康检查端点

## 📖 使用指南

### 基本操作流程

1. **查看数据看板**
   - 点击顶部 "📊 数据看板" 标签
   - 查看 KPI 指标和地图视图

2. **管理司机和订单**
   - 点击 "⚙️ 操作面板" 标签
   - 在左侧表格中点击 "编辑" 按钮修改信息
   - 点击 "+ 添加司机" 或 "+ 添加订单" 按钮创建新记录

3. **使用 AI 助手**
   - 点击 "🤖 AI 助手" 标签或使用操作面板右侧的聊天窗口
   - 输入自然语言指令，例如：
     - "帮我分单"
     - "添加一个订单到 Princeton，重量 500 磅"
     - "现在有多少空闲司机？"
   - AI 会自动执行相应操作并更新系统状态

4. **手动分配订单**
   - 在订单列表表的 "分配的司机" 列中，选择下拉菜单中的司机
   - 系统会自动计算路线并创建分配关系

### AI 指令示例

| 指令 | 功能 |
|------|------|
| "帮我分单" / "优化路线" | 自动分配司机给订单 |
| "添加一个订单到 Princeton，重量 500 磅" | 创建新订单 |
| "添加一个司机，姓名张三，容量 2000 磅" | 创建新司机 |
| "现在有多少空闲司机？" | 查询系统状态 |
| "重置系统" | 清除所有数据 |

## 🏗️ 技术架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                    前端 (React + Vite)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  数据看板     │  │  操作面板     │  │  AI 聊天     │  │
│  │  Dashboard   │  │  Tables     │  │  AIChat      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                │                │            │
│           └────────────────┴────────────────┘            │
│                    (Vite Proxy /api)                     │
└──────────────────────────┼───────────────────────────────┘
                           │ HTTP/REST API
┌──────────────────────────┼───────────────────────────────┐
│                    后端 (Express)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  State       │  │  Agent       │  │  Routes      │  │
│  │  Manager     │  │  Service     │  │  Service     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                │                │            │
│           └────────────────┴────────────────┘            │
└──────────────────────────┼───────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                      │
┌───────▼────────┐                  ┌─────────▼──────────┐
│  Claude API    │                  │   ORS API         │
│  (Function     │                  │   (Route          │
│   Calling)     │                  │    Calculation)   │
└────────────────┘                  └─────────────────────┘
```

### 核心模块说明

#### 1. State Manager (`backend/state.js`)
- 管理全局状态（司机、订单、分配关系）
- 提供 CRUD 操作接口
- 处理位置坐标映射
- 初始化模拟数据

#### 2. AI Agent Service (`backend/services/agent.js`)
- 定义 Function Calling 工具（addDriver, addOrder, assignDrivers 等）
- 解析 AI 返回的工具调用
- 执行工具并返回结果
- 维护系统上下文

#### 3. Routes Service (`backend/services/routes.js`)
- 调用 OpenRouteService API 计算路线
- 支持多段路线计算（司机→取货点→总部→目的地）
- 返回 ETA 和 Polyline

## 🎯 核心难点

### 1. AI Function Calling 实现
- **挑战**: 让 AI 理解用户意图并调用正确的工具
- **解决**: 
  - 定义清晰的工具 Schema
  - 设计详细的 System Prompt
  - 实现工具调用解析和执行逻辑

### 2. 多段路线计算
- **挑战**: 物流路线为"司机→取货点→总部→目的地"三段
- **解决**: 顺序调用 ORS API 计算三段，累加总时长

### 3. 贪婪调度算法
- **挑战**: 多订单、多司机的最优分配
- **解决**: 
  - 按优先级排序订单
  - 对每个订单选择时间最短的司机
  - 考虑容量限制和动态位置更新

### 4. 实时状态同步
- **挑战**: 前端编辑、AI 操作、手动分配需要同步
- **解决**: 统一后端状态管理，操作后立即刷新

## 💻 开发说明

### 开发模式

后端和前端分别运行在不同的端口：
- 后端: `http://localhost:3001`
- 前端: `http://localhost:3000`

前端通过 Vite 代理访问后端 API（配置在 `frontend/vite.config.js`）。

### 代码结构说明

- **后端**: 采用模块化设计，`services/` 目录包含各个服务模块
- **前端**: 组件化设计，每个功能对应一个组件
- **状态管理**: 后端统一管理状态，前端通过 API 获取和更新

### 添加新功能

1. **添加新的 AI 工具**:
   - 在 `backend/services/agent.js` 的 `TOOLS` 数组中添加工具定义
   - 在 `executeTool` 函数中添加工具执行逻辑

2. **添加新的 API 端点**:
   - 在 `backend/index.js` 中添加路由处理

3. **添加新的前端组件**:
   - 在 `frontend/src/components/` 中创建新组件
   - 在 `App.jsx` 中引入和使用

## 🚀 部署到 GitHub

### 安全部署指南

1. **确保 `.gitignore` 包含敏感文件**：
   ```
   .env
   backend/.env
   *.env
   ```

2. **检查代码中无硬编码的 API Keys**：
   - ✅ 所有 API Keys 通过配置页面或环境变量获取
   - ✅ 代码可以安全提交到 GitHub

3. **部署后配置**：
   - 首次访问会自动显示配置页面
   - 输入 API Keys 即可开始使用
   - 或使用部署平台的环境变量功能

### 部署平台推荐

- **Vercel**: 支持环境变量配置，自动部署
- **Railway**: 支持环境变量，简单易用
- **Render**: 免费额度，支持环境变量

## ❓ 常见问题

### Q: 如何配置 API Keys？
A: 有两种方式：
1. **网页界面**：首次访问时会自动显示配置页面
2. **环境变量**：创建 `backend/.env` 文件并填入 API Keys

### Q: API Keys 安全吗？
A: 是的！API Keys 仅存储在服务器内存中，不会写入文件。重启服务器后需要重新配置。

### Q: 页面无法打开？
A: 
1. 确保后端和前端服务都已启动
2. 检查端口是否被占用
3. 查看浏览器控制台是否有错误
4. 确认 API Keys 已正确配置

### Q: 地图不显示？
A: 
1. 检查网络连接（地图需要访问 OpenStreetMap）
2. 查看浏览器控制台是否有坐标错误
3. 确认司机和订单的坐标数据有效

### Q: AI 聊天不响应？
A: 
1. 检查 `ANTHROPIC_API_KEY` 是否正确配置
2. 查看后端控制台是否有错误日志
3. 确认 API Key 有足够的额度

### Q: 路线计算失败？
A: 
1. 检查 `ORS_API_KEY` 是否正确配置
2. 确认 API Key 未超过免费额度限制
3. 查看后端控制台的错误信息

### Q: 如何重置系统？
A: 在 AI 聊天中输入 "重置系统" 或调用 `resetSystem` 工具

## 📝 许可证

MIT License

## 🙏 致谢

- [OpenRouteService](https://openrouteservice.org/) - 路线计算服务
- [Anthropic](https://www.anthropic.com/) - Claude AI 服务
- [Leaflet](https://leafletjs.com/) - 地图可视化库
- [React](https://react.dev/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具

---

**开发时间**: 2024年  
**版本**: 1.0.0  
**维护者**: Gofo Express Team
