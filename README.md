# 🚚 LogiBot - AI 物流调度系统 / AI Logistics Dispatch System

一个基于 **AI Function Calling** 的智能物流调度系统 Demo，使用 Claude API 实现自然语言交互，结合 OpenRouteService 进行路线优化和实时调度。

An intelligent logistics dispatch system demo based on **AI Function Calling**, using Claude API for natural language interaction, combined with OpenRouteService for route optimization and real-time scheduling.

---

## 📋 目录 / Table of Contents

- [项目简介 / Project Introduction](#项目简介--project-introduction)
- [功能特性 / Features](#功能特性--features)
- [技术栈 / Tech Stack](#技术栈--tech-stack)
- [项目结构 / Project Structure](#项目结构--project-structure)
- [快速开始 / Quick Start](#快速开始--quick-start)
- [环境配置 / Configuration](#环境配置--configuration)
- [API 文档 / API Documentation](#api-文档--api-documentation)
- [使用指南 / User Guide](#使用指南--user-guide)
- [技术架构 / Technical Architecture](#技术架构--technical-architecture)
- [核心难点 / Key Challenges](#核心难点--key-challenges)
- [开发说明 / Development Guide](#开发说明--development-guide)
- [常见问题 / FAQ](#常见问题--faq)

---

## 🎯 项目简介 / Project Introduction

LogiBot 是一个智能物流调度系统，专为 **Gofo Express** 在 **New Jersey** 的 Fieldsboro Hub 设计。系统通过 AI Agent 实现自然语言交互，用户可以像与助手对话一样管理司机、订单和调度任务。

LogiBot is an intelligent logistics dispatch system designed for **Gofo Express** at the Fieldsboro Hub in **New Jersey**. The system uses AI Agent to enable natural language interaction, allowing users to manage drivers, orders, and dispatch tasks through conversational interfaces.

### 核心亮点 / Key Highlights

- 🤖 **AI Function Calling**: 使用 Claude API 的 Function Calling 能力，实现自然语言到系统操作的转换
  - Uses Claude API's Function Calling capability to convert natural language into system operations

- 🗺️ **实时地图可视化**: 基于 Leaflet 的地图展示，显示司机位置、订单位置和配送路线
  - Real-time map visualization using Leaflet, displaying driver locations, order locations, and delivery routes

- 📊 **数据看板**: KPI 卡片、图表和热力图，实时监控系统状态
  - Data dashboard with KPI cards, charts, and heatmaps for real-time system monitoring

- ✏️ **可编辑表格**: 直接在页面中编辑司机和订单信息
  - Editable tables for direct editing of driver and order information on the page

- 🚀 **智能调度算法**: 贪婪算法实现多订单、多司机的最优分配
  - Intelligent dispatch algorithm using greedy approach for optimal multi-order, multi-driver assignment

---

## ✨ 功能特性 / Features

### 1. 数据看板 (Dashboard)

**中文：**
- **KPI 卡片**: 空闲司机数、待分配订单数、紧急订单数、运力利用率等
- **数据可视化**: 司机状态分布图、订单优先级分布图
- **实时地图**: 显示所有司机和订单的地理位置

**English:**
- **KPI Cards**: Idle drivers count, pending orders count, urgent orders count, capacity utilization rate, etc.
- **Data Visualization**: Driver status distribution charts, order priority distribution charts
- **Real-time Map**: Displays geographic locations of all drivers and orders

### 2. 操作面板 (Operations)

**中文：**
- **司机状态表**: 可编辑的司机信息表格，包括容量、状态、位置、班次时间
- **订单列表表**: 可编辑的订单信息表格，包括取货地址、目的地、重量、优先级
- **司机排班表**: 显示司机-订单分配关系和预计时间
- **手动分配**: 支持手动将订单分配给指定司机

**English:**
- **Driver Status Table**: Editable driver information table including capacity, status, location, shift time
- **Order List Table**: Editable order information table including pickup address, destination, weight, priority
- **Driver Schedule Table**: Displays driver-order assignment relationships and estimated time
- **Manual Assignment**: Supports manually assigning orders to specific drivers

### 3. AI 助手 (AI Chat)

**中文：**
- **自然语言交互**: 通过对话方式管理系统
- **智能理解**: 支持中文和英文指令
- **自动执行**: AI 自动调用相应工具完成操作
- **实时反馈**: 操作结果实时更新到表格

**English:**
- **Natural Language Interaction**: Manage the system through conversational interface
- **Intelligent Understanding**: Supports both Chinese and English commands
- **Automatic Execution**: AI automatically calls appropriate tools to complete operations
- **Real-time Feedback**: Operation results are updated to tables in real-time

### 支持的 AI 指令示例 / Supported AI Command Examples

**中文：**
```
- "帮我分单" / "优化路线" → 自动分配司机给订单
- "添加一个订单到 Princeton，重量 500 磅" → 创建新订单
- "添加一个司机，姓名张三，容量 2000 磅" → 创建新司机
- "现在有多少空闲司机？" → 查询系统状态
- "重置系统" → 清除所有数据
- "生成10个司机和20个订单" → 批量生成测试数据
```

**English:**
```
- "Help me dispatch" / "Optimize routes" → Automatically assign drivers to orders
- "Add an order to Princeton, weight 500 lbs" → Create new order
- "Add a driver, name John, capacity 2000 lbs" → Create new driver
- "How many idle drivers are there?" → Query system status
- "Reset system" → Clear all data
- "Generate 10 drivers and 20 orders" → Batch generate test data
```

---

## 🛠️ 技术栈 / Tech Stack

### 后端 / Backend
- **Node.js** (>=14.0.0): JavaScript 运行时 / JavaScript runtime
- **Express**: Web 框架 / Web framework
- **node-fetch**: HTTP 请求库 / HTTP request library
- **dotenv**: 环境变量管理 / Environment variable management
- **cors**: 跨域资源共享 / Cross-origin resource sharing

### 前端 / Frontend
- **React 18**: UI 框架 / UI framework
- **Vite**: 构建工具和开发服务器 / Build tool and development server
- **Tailwind CSS**: 样式框架 / Styling framework
- **Leaflet**: 地图可视化库 / Map visualization library
- **React Hooks**: 状态管理 / State management

### 外部服务 / External Services
- **Anthropic Claude API**: AI 对话和 Function Calling / AI conversation and Function Calling
- **OpenRouteService (ORS) API**: 路线计算和 ETA 估算 / Route calculation and ETA estimation

---

## 📁 项目结构 / Project Structure

```
dispatch-webapp/
├── backend/                    # 后端服务 / Backend Service
│   ├── index.js               # Express 服务器主文件 / Main Express server file
│   ├── state.js               # 全局状态管理 / Global state management
│   ├── config.js              # API Keys 配置管理 / API Keys configuration manager
│   ├── persistence.js         # 数据持久化 / Data persistence
│   ├── services/              # 服务模块 / Service modules
│   │   ├── agent.js          # AI Agent (Function Calling)
│   │   ├── ai.js             # Claude API 封装 / Claude API wrapper
│   │   └── routes.js          # ORS 路线服务 / ORS route service
│   ├── data/                  # 数据文件目录 / Data files directory
│   │   └── state.json        # 保存的状态数据 / Saved state data
│   └── package.json
├── frontend/                  # 前端应用 / Frontend Application
│   ├── src/
│   │   ├── App.jsx            # 主应用组件 / Main application component
│   │   ├── App.css            # 全局样式 / Global styles
│   │   ├── main.jsx           # 入口文件 / Entry file
│   │   ├── index.css          # 基础样式 / Base styles
│   │   └── components/        # 组件目录 / Components directory
│   │       ├── Dashboard.jsx  # 数据看板 / Data dashboard
│   │       ├── Dashboard.css
│   │       ├── ConfigPage.jsx # 配置页面 / Configuration page
│   │       ├── ConfigPage.css
│   │       ├── DriverTable.jsx # 司机表格 / Driver table
│   │       ├── OrderTable.jsx # 订单表格 / Order table
│   │       ├── AssignmentTable.jsx # 排班表格 / Assignment table
│   │       ├── AIChat.jsx     # AI 聊天组件 / AI chat component
│   │       ├── AIChat.css
│   │       └── MapView.jsx    # 地图组件 / Map component
│   ├── index.html
│   ├── vite.config.js         # Vite 配置（包含 API 代理）/ Vite config (includes API proxy)
│   ├── tailwind.config.js     # Tailwind 配置 / Tailwind config
│   └── package.json
├── package.json               # 根目录脚本 / Root directory scripts
├── vercel.json                # Vercel 部署配置 / Vercel deployment config
├── env.example                # 环境变量模板 / Environment variables template
└── README.md                  # 本文档 / This document
```

---

## 🚀 快速开始 / Quick Start

### 1. 克隆项目 / Clone Repository

**中文：**
```bash
git clone <repository-url>
cd dispatch-webapp
```

**English:**
```bash
git clone <repository-url>
cd dispatch-webapp
```

### 2. 安装依赖 / Install Dependencies

**方式一：使用根目录脚本（推荐）/ Method 1: Use root script (Recommended)**

```bash
npm run install:all
```

**方式二：分别安装 / Method 2: Install separately**

```bash
# 安装后端依赖 / Install backend dependencies
cd backend
npm install

# 安装前端依赖 / Install frontend dependencies
cd ../frontend
npm install
```

### 3. 启动服务 / Start Services

**注意 / Note：** 现在支持两种配置方式 / Now supports two configuration methods:
- **方式一（推荐）/ Method 1 (Recommended)**：通过网页界面配置（首次访问时会自动显示配置页面）/ Configure via web interface (configuration page will appear automatically on first visit)
- **方式二（传统）/ Method 2 (Traditional)**：通过环境变量文件配置（向后兼容）/ Configure via environment variable file (backward compatible)

**启动后端 / Start Backend**（在项目根目录 / In project root）：

```bash
npm run dev:backend
```

或者 / Or:

```bash
cd backend
npm run dev
```

后端将在 `http://localhost:3001` 运行。/ Backend will run on `http://localhost:3001`.

**启动前端 / Start Frontend**（新开一个终端 / In a new terminal，在项目根目录 / in project root）：

```bash
npm run dev:frontend
```

或者 / Or:

```bash
cd frontend
npm run dev
```

前端将在 `http://localhost:3000` 运行。/ Frontend will run on `http://localhost:3000`.

### 4. 配置 API Keys / Configure API Keys

**方式一：通过网页界面配置（推荐）/ Method 1: Configure via Web Interface (Recommended)**

**中文：**
1. 在浏览器中打开：**http://localhost:3000**
2. 首次访问会自动显示配置页面
3. 输入你的 API Keys：
   - **OpenRouteService API Key**: 访问 https://openrouteservice.org/ 注册并获取
   - **Anthropic Claude API Key**: 访问 https://console.anthropic.com/ 注册并获取
4. 点击"保存并开始使用"
5. API Keys 会存储在服务器内存中（不写入文件，安全可靠）

**English:**
1. Open in browser: **http://localhost:3000**
2. Configuration page will appear automatically on first visit
3. Enter your API Keys:
   - **OpenRouteService API Key**: Visit https://openrouteservice.org/ to register and get one
   - **Anthropic Claude API Key**: Visit https://console.anthropic.com/ to register and get one
4. Click "Save and Start Using"
5. API Keys are stored in server memory (not written to files, secure and reliable)

**方式二：通过环境变量文件配置（向后兼容）/ Method 2: Configure via Environment Variables (Backward Compatible)**

**中文：**
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

**English:**
If you prefer using environment variable files:

```bash
cp env.example backend/.env
```

Edit `backend/.env` and fill in your API Keys:

```env
ORS_API_KEY=your_openrouteservice_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001
```

**Note:** If using environment variables, the system will prioritize values from environment variables.

### 5. 访问应用 / Access Application

**中文：** 在浏览器中打开：**http://localhost:3000**

**English:** Open in browser: **http://localhost:3000**

---

## ⚙️ 配置说明 / Configuration

### API Keys 配置 / API Keys Configuration

| 配置方式 / Method | 说明 / Description | 适用场景 / Use Case |
|---------|------|---------|
| **网页界面配置 / Web Interface** | 通过浏览器界面输入，存储在服务器内存 / Input via browser interface, stored in server memory | 推荐用于快速部署和演示 / Recommended for quick deployment and demos |
| **环境变量配置 / Environment Variables** | 通过 `.env` 文件配置 / Configure via `.env` file | 适合生产环境和持续运行 / Suitable for production and continuous operation |

### 安全提示 / Security Notes

**中文：**
- ✅ API Keys **仅存储在服务器内存中**，不会写入文件或数据库
- ✅ 重启服务器后需要重新配置（或使用环境变量）
- ✅ 代码中**不包含任何 API Keys**，可以安全地提交到 GitHub
- ✅ `.env` 文件已添加到 `.gitignore`，不会被提交

**English:**
- ✅ API Keys are **only stored in server memory**, not written to files or databases
- ✅ Need to reconfigure after server restart (or use environment variables)
- ✅ **No API Keys in code**, safe to commit to GitHub
- ✅ `.env` files are added to `.gitignore` and won't be committed

### 环境变量（可选）/ Environment Variables (Optional)

如果需要使用环境变量配置 / If you need to use environment variables:

| 变量名 / Variable | 说明 / Description | 示例 / Example |
|--------|------|------|
| `ORS_API_KEY` | OpenRouteService API Key | `5b3ce35...` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API Key | `sk-ant-api03-...` |
| `PORT` | 后端服务端口（可选，默认 3001）/ Backend port (optional, default 3001) | `3001` |

**环境变量文件位置 / Environment Variable File Location：**
- 开发环境 / Development: `backend/.env`
- 生产环境 / Production: Configure in deployment platform (e.g., Vercel)

---

## 📡 API 文档 / API Documentation

### 基础端点 / Basic Endpoints

#### `GET /api/state`
**中文：** 获取当前系统状态（司机、订单、分配关系）

**English:** Get current system state (drivers, orders, assignments)

**响应示例 / Response Example：**
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
**中文：** 添加新司机

**English:** Add new driver

**请求体 / Request Body：**
```json
{
  "name": "李四",
  "capacity": 1500,
  "location": "Fieldsboro Hub",
  "shift_window": "9-17"
}
```

#### `POST /api/orders`
**中文：** 添加新订单

**English:** Add new order

**请求体 / Request Body：**
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
**中文：** 更新司机信息

**English:** Update driver information

#### `PUT /api/orders/:id`
**中文：** 更新订单信息

**English:** Update order information

#### `POST /api/assign`
**中文：** 手动分配订单给司机

**English:** Manually assign order to driver

**请求体 / Request Body：**
```json
{
  "driver_id": "D001",
  "order_id": "O001"
}
```

#### `POST /api/chat/simple`
**中文：** AI 聊天接口（非流式）

**English:** AI chat interface (non-streaming)

**请求体 / Request Body：**
```json
{
  "message": "帮我分单"
}
```

**响应示例 / Response Example：**
```json
{
  "text": "已成功分配 5 个订单给司机...",
  "state": {
    "drivers": [...],
    "orders": [...],
    "assignments": [...]
  }
}
```

#### `GET /api/config/status`
**中文：** 获取 API Keys 配置状态

**English:** Get API Keys configuration status

**响应示例 / Response Example：**
```json
{
  "configured": true,
  "hasOrsKey": true,
  "hasAnthropicKey": true
}
```

#### `POST /api/config/keys`
**中文：** 设置 API Keys（存储在内存中）

**English:** Set API Keys (stored in memory)

**请求体 / Request Body：**
```json
{
  "ors_api_key": "your_ors_api_key",
  "anthropic_api_key": "your_anthropic_api_key"
}
```

#### `POST /api/config/reset`
**中文：** 重置配置（清除 API Keys）

**English:** Reset configuration (clear API Keys)

#### `GET /health`
**中文：** 健康检查端点

**English:** Health check endpoint

---

## 📖 使用指南 / User Guide

### 基本操作流程 / Basic Operations

**中文：**

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
     - "生成10个司机和20个订单"
   - AI 会自动执行相应操作并更新系统状态

4. **手动分配订单**
   - 在订单列表表的 "分配的司机" 列中，选择下拉菜单中的司机
   - 系统会自动计算路线并创建分配关系

**English:**
1. **View Data Dashboard**
   - Click the "📊 Data Dashboard" tab at the top
   - View KPI metrics and map view

2. **Manage Drivers and Orders**
   - Click the "⚙️ Operations Panel" tab
   - Click "Edit" button in the left tables to modify information
   - Click "+ Add Driver" or "+ Add Order" buttons to create new records

3. **Use AI Assistant**
   - Click "🤖 AI Assistant" tab or use the chat window on the right side of operations panel
   - Enter natural language commands, for example:
     - "Help me dispatch"
     - "Add an order to Princeton, weight 500 lbs"
     - "How many idle drivers are there?"
     - "Generate 10 drivers and 20 orders"
   - AI will automatically execute corresponding operations and update system state

4. **Manually Assign Orders**
   - In the "Assigned Driver" column of the order list table, select a driver from the dropdown menu
   - System will automatically calculate route and create assignment relationship

### AI 指令示例 / AI Command Examples

| 指令 / Command | 功能 / Function |
|------|------|
| "帮我分单" / "Help me dispatch" | 自动分配司机给订单 / Automatically assign drivers to orders |
| "添加一个订单到 Princeton，重量 500 磅" / "Add an order to Princeton, weight 500 lbs" | 创建新订单 / Create new order |
| "添加一个司机，姓名张三，容量 2000 磅" / "Add a driver, name John, capacity 2000 lbs" | 创建新司机 / Create new driver |
| "现在有多少空闲司机？" / "How many idle drivers are there?" | 查询系统状态 / Query system status |
| "重置系统" / "Reset system" | 清除所有数据 / Clear all data |
| "生成10个司机和20个订单" / "Generate 10 drivers and 20 orders" | 批量生成测试数据 / Batch generate test data |

---

## 🏗️ 技术架构 / Technical Architecture

### 系统架构图 / System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    前端 (React + Vite)                   │
│              Frontend (React + Vite)                    │
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
│                    Backend (Express)                      │
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

### 核心模块说明 / Core Module Description

#### 1. State Manager (`backend/state.js`)
**中文：**
- 管理全局状态（司机、订单、分配关系）
- 提供 CRUD 操作接口
- 处理位置坐标映射
- 初始化模拟数据
- 数据持久化支持

**English:**
- Manages global state (drivers, orders, assignments)
- Provides CRUD operation interfaces
- Handles location coordinate mapping
- Initializes mock data
- Data persistence support

#### 2. AI Agent Service (`backend/services/agent.js`)
**中文：**
- 定义 Function Calling 工具（addDriver, addOrder, assignDrivers 等）
- 解析 AI 返回的工具调用
- 执行工具并返回结果
- 维护系统上下文
- 错误恢复机制

**English:**
- Defines Function Calling tools (addDriver, addOrder, assignDrivers, etc.)
- Parses AI-returned tool calls
- Executes tools and returns results
- Maintains system context
- Error recovery mechanism

#### 3. Routes Service (`backend/services/routes.js`)
**中文：**
- 调用 OpenRouteService API 计算路线
- 支持多段路线计算（司机→取货点→总部→目的地）
- 返回 ETA 和 Polyline

**English:**
- Calls OpenRouteService API to calculate routes
- Supports multi-segment route calculation (driver → pickup → hub → destination)
- Returns ETA and Polyline

#### 4. Config Manager (`backend/config.js`)
**中文：**
- 管理 API Keys 配置（存储在内存中）
- 提供配置状态检查接口
- 支持环境变量和内存配置

**English:**
- Manages API Keys configuration (stored in memory)
- Provides configuration status check interface
- Supports environment variables and in-memory configuration

#### 5. Persistence (`backend/persistence.js`)
**中文：**
- 自动保存状态到文件
- 启动时自动恢复数据
- 创建备份文件

**English:**
- Automatically saves state to files
- Automatically restores data on startup
- Creates backup files

---

## 🎯 核心难点 / Key Challenges

### 1. AI Function Calling 实现 / AI Function Calling Implementation

**中文：**
- **挑战**: 让 AI 理解用户意图并调用正确的工具
- **解决**: 
  - 定义清晰的工具 Schema
  - 设计详细的 System Prompt
  - 实现工具调用解析和执行逻辑

**English:**
- **Challenge**: Make AI understand user intent and call the correct tools
- **Solution**: 
  - Define clear tool schemas
  - Design detailed system prompts
  - Implement tool call parsing and execution logic

### 2. 多段路线计算 / Multi-segment Route Calculation

**中文：**
- **挑战**: 物流路线为"司机→取货点→总部→目的地"三段
- **解决**: 顺序调用 ORS API 计算三段，累加总时长

**English:**
- **Challenge**: Logistics route consists of three segments: "driver → pickup → hub → destination"
- **Solution**: Sequentially call ORS API to calculate three segments, sum total duration

### 3. 贪婪调度算法 / Greedy Dispatch Algorithm

**中文：**
- **挑战**: 多订单、多司机的最优分配
- **解决**: 
  - 按优先级排序订单
  - 对每个订单选择时间最短的司机
  - 考虑容量限制和动态位置更新

**English:**
- **Challenge**: Optimal assignment of multiple orders to multiple drivers
- **Solution**: 
  - Sort orders by priority
  - For each order, select driver with shortest time
  - Consider capacity constraints and dynamic location updates

### 4. 实时状态同步 / Real-time State Synchronization

**中文：**
- **挑战**: 前端编辑、AI 操作、手动分配需要同步
- **解决**: 统一后端状态管理，操作后立即刷新

**English:**
- **Challenge**: Frontend editing, AI operations, and manual assignments need synchronization
- **Solution**: Unified backend state management, refresh immediately after operations

### 5. 数据持久化 / Data Persistence

**中文：**
- **挑战**: 确保数据不因服务器重启或错误而丢失
- **解决**: 
  - 自动保存状态到文件
  - 启动时自动恢复
  - 错误时恢复之前的状态

**English:**
- **Challenge**: Ensure data is not lost due to server restart or errors
- **Solution**: 
  - Automatically save state to files
  - Automatically restore on startup
  - Restore previous state on errors

---

## 💻 开发说明 / Development Guide

### 开发模式 / Development Mode

**中文：**
后端和前端分别运行在不同的端口：
- 后端: `http://localhost:3001`
- 前端: `http://localhost:3000`

前端通过 Vite 代理访问后端 API（配置在 `frontend/vite.config.js`）。

**English:**
Backend and frontend run on different ports:
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`

Frontend accesses backend API through Vite proxy (configured in `frontend/vite.config.js`).

### 代码结构说明 / Code Structure

**中文：**
- **后端**: 采用模块化设计，`services/` 目录包含各个服务模块
- **前端**: 组件化设计，每个功能对应一个组件
- **状态管理**: 后端统一管理状态，前端通过 API 获取和更新

**English:**
- **Backend**: Modular design, `services/` directory contains various service modules
- **Frontend**: Component-based design, each feature corresponds to a component
- **State Management**: Backend manages state uniformly, frontend gets and updates via API

### 添加新功能 / Adding New Features

**中文：**

1. **添加新的 AI 工具**:
   - 在 `backend/services/agent.js` 的 `TOOLS` 数组中添加工具定义
   - 在 `executeTool` 函数中添加工具执行逻辑

2. **添加新的 API 端点**:
   - 在 `backend/index.js` 中添加路由处理

3. **添加新的前端组件**:
   - 在 `frontend/src/components/` 中创建新组件
   - 在 `App.jsx` 中引入和使用

**English:**
1. **Add new AI tool**:
   - Add tool definition in `TOOLS` array in `backend/services/agent.js`
   - Add tool execution logic in `executeTool` function

2. **Add new API endpoint**:
   - Add route handler in `backend/index.js`

3. **Add new frontend component**:
   - Create new component in `frontend/src/components/`
   - Import and use in `App.jsx`

---

## 🚀 部署到 GitHub / Deploy to GitHub

### 安全部署指南 / Secure Deployment Guide

**中文：**

1. **确保 `.gitignore` 包含敏感文件**：
   ```
   .env
   backend/.env
   *.env
   backend/data/
   ```

2. **检查代码中无硬编码的 API Keys**：
   - ✅ 所有 API Keys 通过配置页面或环境变量获取
   - ✅ 代码可以安全提交到 GitHub

3. **部署后配置**：
   - 首次访问会自动显示配置页面
   - 输入 API Keys 即可开始使用
   - 或使用部署平台的环境变量功能

**English:**
1. **Ensure `.gitignore` includes sensitive files**:
   ```
   .env
   backend/.env
   *.env
   backend/data/
   ```

2. **Check that no API Keys are hardcoded in code**:
   - ✅ All API Keys are obtained through configuration page or environment variables
   - ✅ Code can be safely committed to GitHub

3. **Post-deployment configuration**:
   - Configuration page will appear automatically on first visit
   - Enter API Keys to start using
   - Or use deployment platform's environment variable feature

### 部署平台推荐 / Recommended Deployment Platforms

- **Vercel**: 支持环境变量配置，自动部署 / Supports environment variable configuration, automatic deployment
- **Railway**: 支持环境变量，简单易用 / Supports environment variables, simple and easy to use
- **Render**: 免费额度，支持环境变量 / Free tier, supports environment variables

---

## ❓ 常见问题 / FAQ

### Q: 如何配置 API Keys？/ How to configure API Keys?

**中文：**
A: 有两种方式：
1. **网页界面**：首次访问时会自动显示配置页面
2. **环境变量**：创建 `backend/.env` 文件并填入 API Keys

**English:**
A: There are two methods:
1. **Web Interface**: Configuration page will appear automatically on first visit
2. **Environment Variables**: Create `backend/.env` file and fill in API Keys

### Q: API Keys 安全吗？/ Are API Keys secure?

**中文：**
A: 是的！API Keys 仅存储在服务器内存中，不会写入文件。重启服务器后需要重新配置。

**English:**
A: Yes! API Keys are only stored in server memory and not written to files. Need to reconfigure after server restart.

### Q: 页面无法打开？/ Page won't open?

**中文：**
A: 
1. 确保后端和前端服务都已启动
2. 检查端口是否被占用
3. 查看浏览器控制台是否有错误
4. 确认 API Keys 已正确配置

**English:**
A:
1. Ensure both backend and frontend services are running
2. Check if ports are occupied
3. Check browser console for errors
4. Confirm API Keys are correctly configured

### Q: 地图不显示？/ Map not displaying?

**中文：**
A: 
1. 检查网络连接（地图需要访问 OpenStreetMap）
2. 查看浏览器控制台是否有坐标错误
3. 确认司机和订单的坐标数据有效

**English:**
A:
1. Check network connection (map needs to access OpenStreetMap)
2. Check browser console for coordinate errors
3. Confirm driver and order coordinate data is valid

### Q: AI 聊天不响应？/ AI chat not responding?

**中文：**
A: 
1. 检查 `ANTHROPIC_API_KEY` 是否正确配置
2. 查看后端控制台是否有错误日志
3. 确认 API Key 有足够的额度

**English:**
A:
1. Check if `ANTHROPIC_API_KEY` is correctly configured
2. Check backend console for error logs
3. Confirm API Key has sufficient quota

### Q: 路线计算失败？/ Route calculation failed?

**中文：**
A: 
1. 检查 `ORS_API_KEY` 是否正确配置
2. 确认 API Key 未超过免费额度限制
3. 查看后端控制台的错误信息

**English:**
A:
1. Check if `ORS_API_KEY` is correctly configured
2. Confirm API Key hasn't exceeded free tier limit
3. Check backend console for error messages

### Q: 如何重置系统？/ How to reset the system?

**中文：**
A: 在 AI 聊天中输入 "重置系统" 或调用 `resetSystem` 工具。也可以运行 `node backend/reset.js` 脚本。

**English:**
A: Enter "Reset system" in AI chat or call `resetSystem` tool. You can also run `node backend/reset.js` script.

### Q: 数据丢失了怎么办？/ What if data is lost?

**中文：**
A: 
1. 检查 `backend/data/state.json` 文件是否存在
2. 如果存在备份文件，系统会自动恢复
3. 如果数据完全丢失，可以运行 `node backend/reset.js` 重置到初始状态

**English:**
A:
1. Check if `backend/data/state.json` file exists
2. If backup files exist, system will automatically restore
3. If data is completely lost, run `node backend/reset.js` to reset to initial state

---

## 📝 许可证 / License

MIT License

## 🙏 致谢 / Acknowledgments

- [OpenRouteService](https://openrouteservice.org/) - 路线计算服务 / Route calculation service
- [Anthropic](https://www.anthropic.com/) - Claude AI 服务 / Claude AI service
- [Leaflet](https://leafletjs.com/) - 地图可视化库 / Map visualization library
- [React](https://react.dev/) - UI 框架 / UI framework
- [Vite](https://vitejs.dev/) - 构建工具 / Build tool

---

**开发时间 / Development Time**: 2025年 / 2025
**版本 / Version**: 2.0.0  
**维护者 / Maintainer**: Siyuan Brentliy 
