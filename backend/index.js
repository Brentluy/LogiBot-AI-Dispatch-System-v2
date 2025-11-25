const express = require('express');
const cors = require('cors');
require('dotenv').config();

const stateManager = require('./state');
const agentService = require('./services/agent');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 获取系统状态
app.get('/api/state', (req, res) => {
  res.json(stateManager.getState());
});

// 更新司机
app.put('/api/drivers/:id', (req, res) => {
  try {
    const state = stateManager.updateDriver(req.params.id, req.body);
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新订单
app.put('/api/orders/:id', (req, res) => {
  try {
    const state = stateManager.updateOrder(req.params.id, req.body);
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加司机
app.post('/api/drivers', (req, res) => {
  try {
    const { name, capacity, location = '1183 Florence Columbus Road, Fieldsboro, NJ 08505', shift_window = '9-17' } = req.body;
    const coords = stateManager.getLocationCoords(location);
    const currentState = stateManager.getState();
    
    const newDriver = {
      id: `D${String(currentState.drivers.length + 1).padStart(3, '0')}`,
      name,
      capacity,
      status: 'idle',
      location: coords.address || location,
      lat: coords.lat,
      lon: coords.lon,
      shift_window: shift_window
    };
    
    currentState.drivers.push(newDriver);
    const newState = stateManager.getState();
    res.json(newState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加订单
app.post('/api/orders', (req, res) => {
  try {
    const { pickup_location, destination, weight, volume = 10, contact = 'Customer', priority = 'normal', time_window = '09:00-17:00' } = req.body;
    const pickupCoords = stateManager.getLocationCoords(pickup_location);
    const destCoords = destination ? stateManager.getLocationCoords(destination) : { 
      lat: stateManager.HUB_COORDS.lat, 
      lon: stateManager.HUB_COORDS.lon, 
      address: stateManager.HUB_ADDRESS 
    };
    
    const newState = stateManager.addOrder({
      pickup_location: pickupCoords.address || pickup_location,
      pickup_lat: pickupCoords.lat,
      pickup_lon: pickupCoords.lon,
      destination: destCoords.address || destination || stateManager.HUB_ADDRESS,
      destination_lat: destCoords.lat,
      destination_lon: destCoords.lon,
      weight,
      volume,
      contact,
      priority,
      time_window
    });
    
    res.json(newState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 手动分配订单给司机
app.post('/api/assign', async (req, res) => {
  try {
    const { driver_id, order_id } = req.body;
    
    if (!driver_id || !order_id) {
      return res.status(400).json({ error: 'driver_id 和 order_id 不能为空' });
    }
    
    const currentState = stateManager.getState();
    const driver = currentState.drivers.find(d => d.id === driver_id);
    const order = currentState.orders.find(o => o.id === order_id);
    
    if (!driver) {
      return res.status(404).json({ error: '司机不存在' });
    }
    
    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }
    
    // 检查是否已经分配
    const existingAssignment = currentState.assignments.find(
      a => a.driver_id === driver_id && a.order_id === order_id
    );
    
    if (existingAssignment) {
      return res.status(400).json({ error: '该订单已经分配给该司机' });
    }
    
    // 计算预计时间（使用 ORS API）
    let estimatedTime = 60; // 默认值
    try {
      const routesService = require('./services/routes');
      const { HUB_COORDS } = stateManager;
      
      // 计算：司机位置 -> 取货地址 -> 总部 -> 目的地
      const route1 = await routesService.getRoute(
        [driver.lon, driver.lat],
        [order.pickup_lon, order.pickup_lat]
      );
      const route2 = await routesService.getRoute(
        [order.pickup_lon, order.pickup_lat],
        [HUB_COORDS.lon, HUB_COORDS.lat]
      );
      const route3 = await routesService.getRoute(
        [HUB_COORDS.lon, HUB_COORDS.lat],
        [order.destination_lon, order.destination_lat]
      );
      
      estimatedTime = Math.round((route1.duration + route2.duration + route3.duration) / 60);
    } catch (error) {
      console.error('计算预计时间失败，使用默认值:', error.message);
    }
    
    const newState = stateManager.addAssignment(driver_id, order_id, estimatedTime);
    res.json(newState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI 聊天（流式传输）
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: '消息不能为空' });
    }

    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 调用 AI Agent
    const agentResponse = await agentService.callAgent(message, false);
    
    // 处理响应并执行工具调用
    const result = await agentService.processAgentResponse(agentResponse);

    // 发送完整响应
    res.write(`data: ${JSON.stringify(result)}\n\n`);
    res.end();

  } catch (error) {
    console.error('AI 聊天错误:', error);
    res.status(500).json({ error: error.message || '服务器内部错误' });
  }
});

// AI 聊天（非流式，用于简单测试）
app.post('/api/chat/simple', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: '消息不能为空' });
    }

    console.log('收到 AI 聊天请求:', message);
    const agentResponse = await agentService.callAgent(message, false);
    console.log('AI 响应:', JSON.stringify(agentResponse, null, 2).substring(0, 500));
    const result = await agentService.processAgentResponse(agentResponse);
    console.log('处理结果:', result.success ? '成功' : '失败', result.message);

    res.json(result);
  } catch (error) {
    console.error('AI 聊天错误:', error);
    console.error('错误堆栈:', error.stack);
    res.status(500).json({ 
      error: error.message || '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// API Keys 配置相关端点
app.get('/api/config/status', (req, res) => {
  res.json(config.getApiKeysStatus());
});

app.post('/api/config/keys', (req, res) => {
  try {
    const { ors_api_key, anthropic_api_key } = req.body;
    
    if (!ors_api_key || !anthropic_api_key) {
      return res.status(400).json({ 
        error: 'ORS_API_KEY 和 ANTHROPIC_API_KEY 都是必需的' 
      });
    }
    
    const result = config.setApiKeys(ors_api_key, anthropic_api_key);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 重置配置（清除 API Keys）
app.post('/api/config/reset', (req, res) => {
  try {
    config.clearApiKeys();
    res.json({ success: true, message: '配置已重置，请重新输入 API Keys' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 确保在启动时初始化数据
const initialState = stateManager.getState();
console.log(`初始化完成: ${initialState.drivers.length} 个司机, ${initialState.orders.length} 个订单`);

app.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`);
  console.log('LogiBot 物流调度系统已启动');
  console.log(`当前状态: ${stateManager.getState().drivers.length} 个司机, ${stateManager.getState().orders.length} 个订单`);
});
