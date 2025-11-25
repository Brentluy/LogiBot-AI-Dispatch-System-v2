# 快速启动指南

## 1. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

## 2. 配置环境变量

在 `backend` 目录下创建 `.env` 文件：

```bash
cd backend
cp ../env.example .env
```

编辑 `backend/.env`，填入你的 API keys：

```
ORS_API_KEY=your_openrouteservice_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001
```

## 3. 启动服务

### 启动后端（终端 1）

```bash
cd backend
npm run dev
```

后端将在 `http://localhost:3001` 运行。

### 启动前端（终端 2）

```bash
cd frontend
npm run dev
```

前端将在 `http://localhost:3000` 运行。

## 4. 使用系统

1. 打开浏览器访问 `http://localhost:3000`
2. 查看司机列表和订单列表
3. 点击"开始调度"按钮
4. 系统会：
   - 计算所有司机到所有订单的 ETA
   - 使用 AI 选择最佳司机
   - 在地图上显示路线

## 注意事项

- 确保已获取 OpenRouteService API Key（免费注册：https://openrouteservice.org/）
- 确保已获取 Anthropic Claude API Key
- 地图需要网络连接才能加载
- 如果遇到 CORS 错误，检查后端是否正常运行

