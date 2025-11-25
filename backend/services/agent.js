const fetch = require('node-fetch');
const stateManager = require('../state');
const routesService = require('./routes');
const config = require('../config');

const { HUB_COORDS } = stateManager;

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// 工具定义（Function Calling）
const TOOLS = [
  {
    name: 'addDriver',
    description: '添加一个新司机。当用户提到新司机、司机信息、运载能力等信息时使用。',
    input_schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '司机姓名'
        },
        capacity: {
          type: 'number',
          description: '运载能力（磅）'
        },
        location: {
          type: 'string',
          description: '司机位置，例如：Fieldsboro Hub, Princeton, Trenton 等'
        },
        shift_window: {
          type: 'string',
          description: '班次时间窗口，格式：HH:MM-HH:MM，例如：09:00-18:00。也可以使用中文描述，如"早9到晚6"'
        }
      },
      required: ['name', 'capacity']
    }
  },
  {
    name: 'addOrder',
    description: '添加一个新订单。当用户提到新订单、取货地址、重量等信息时使用。',
    input_schema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: '取货地址，例如：Princeton, Trenton, Newark, Cherry Hill, Moorestown, Hamilton'
        },
        weight: {
          type: 'number',
          description: '货物重量（磅）'
        },
        volume: {
          type: 'number',
          description: '货物体积（立方英尺）'
        },
        contact: {
          type: 'string',
          description: '联系人姓名'
        },
        priority: {
          type: 'string',
          enum: ['normal', 'high', 'urgent'],
          description: '订单优先级'
        },
        time_window: {
          type: 'string',
          description: '取货时间窗口，格式：HH:MM-HH:MM，例如：09:00-12:00'
        }
      },
      required: ['location', 'weight']
    }
  },
  {
    name: 'assignDrivers',
    description: '分配司机给订单。当用户说"分单"、"分配"、"优化路线"、"重新分配"时使用。使用贪婪算法：优先处理加急订单，优先匹配附近司机。',
    input_schema: {
      type: 'object',
      properties: {
        strategy: {
          type: 'string',
          enum: ['greedy', 'nearest', 'capacity'],
          description: '分配策略：greedy=贪婪算法（优先加急+最近），nearest=最近优先，capacity=容量优先'
        }
      }
    }
  },
  {
    name: 'queryStatus',
    description: '查询当前系统状态。当用户问"有多少空闲司机"、"订单情况"、"系统状态"时使用。',
    input_schema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'resetSystem',
    description: '重置整个系统，清除所有排班和订单。',
    input_schema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'generateRandomData',
    description: '批量生成随机司机和订单数据。当用户说"生成司机"、"生成订单"、"随机生成数据"时使用。',
    input_schema: {
      type: 'object',
      properties: {
        driver_count: {
          type: 'number',
          description: '要生成的司机数量'
        },
        order_count: {
          type: 'number',
          description: '要生成的订单数量'
        }
      }
    }
  }
];

// System Prompt
const SYSTEM_PROMPT = `You are LogiBot, the intelligent dispatch assistant for Gofo Express in New Jersey. Your job is to manage the fleet located at Fieldsboro Hub. You operate in a real-time environment. When a user gives a command, analyze it and call the appropriate tool. Always respond professionally. 

When users mention adding drivers, extract:
- Name (can be Chinese or English)
- Capacity (in lbs)
- Location (default: Fieldsboro Hub)
- Shift (morning/afternoon/evening, default: morning)
- Work hours (e.g., "9 AM to 6 PM" means shift: morning, you can infer from time)

When users mention adding orders, extract:
- Location (pickup address)
- Weight (in lbs)
- Volume (optional, in cubic feet)
- Contact (optional)
- Priority (normal/high/urgent)
- Time window (optional, format: HH:MM-HH:MM)

Known locations in NJ: Fieldsboro Hub, Trenton, Princeton, Newark, Cherry Hill, Moorestown, Hamilton, Camden, Edison, Jersey City.`;

/**
 * 调用 AI Agent（支持流式传输）
 */
async function callAgent(userMessage, stream = false) {
  const apiKey = config.getAnthropicApiKey();
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY 未设置，请在配置页面输入 API Key');
  }

  const currentState = stateManager.getState();
  
  // 构建上下文消息
  const contextMessage = `当前系统状态：
司机数量：${currentState.drivers.length}（空闲：${currentState.drivers.filter(d => d.status === 'idle').length}）
订单数量：${currentState.orders.length}（待分配：${currentState.orders.filter(o => o.status === 'pending').length}）
排班数量：${currentState.assignments.length}`;

  const messages = [
    {
      role: 'user',
      content: `${contextMessage}\n\n用户消息：${userMessage}`
    }
  ];

  const requestBody = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: messages,
    tools: TOOLS
  };

  if (stream) {
    requestBody.stream = true;
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API 错误: ${response.status} - ${errorText}`);
  }

  if (stream) {
    return response.body;
  } else {
    const data = await response.json();
    return data;
  }
}

/**
 * 执行工具调用
 */
async function executeTool(toolName, toolInput) {
  const currentState = stateManager.getState();

  switch (toolName) {
    case 'addDriver': {
      const { name, capacity, location = 'Fieldsboro Hub', shift_window = '09:00-18:00' } = toolInput;
      const coords = stateManager.getLocationCoords(location);
      
      // 如果用户提供了工作时间（如"早9到晚6"或"9-17"），转换为数字格式
      let finalShiftWindow = shift_window;
      if (typeof shift_window === 'string') {
        if (shift_window.includes('到')) {
          // 解析中文时间描述，如"早9到晚6" -> "9-17"
          const timeMatch = shift_window.match(/(\d+).*?(\d+)/);
          if (timeMatch) {
            const start = parseInt(timeMatch[1]);
            const end = parseInt(timeMatch[2]);
            finalShiftWindow = `${start}-${end}`;
          }
        } else if (shift_window.includes(':')) {
          // 转换 "09:00-18:00" 格式为 "9-17"
          const timeMatch = shift_window.match(/(\d+):\d+.*?(\d+):\d+/);
          if (timeMatch) {
            const start = parseInt(timeMatch[1]);
            const end = parseInt(timeMatch[2]);
            finalShiftWindow = `${start}-${end}`;
          }
        }
      }
      
      const newState = stateManager.addDriver({
        name,
        capacity,
        location,
        lat: coords.lat,
        lon: coords.lon,
        shift_window: finalShiftWindow
      });

      return {
        success: true,
        message: `已添加司机：${name}，运载能力 ${capacity}lbs，工作时间 ${finalShiftWindow}`,
        state: newState
      };
    }

    case 'addOrder': {
      const { location, destination, weight, volume = 10, contact = 'Customer', priority = 'normal', time_window = '09:00-17:00' } = toolInput;
      const pickupCoords = stateManager.getLocationCoords(location);
      const destCoords = destination ? stateManager.getLocationCoords(destination) : pickupCoords;
      
      const newState = stateManager.addOrder({
        pickup_location: pickupCoords.address || location,
        pickup_lat: pickupCoords.lat,
        pickup_lon: pickupCoords.lon,
        destination: destCoords.address || destination || pickupCoords.address,
        destination_lat: destCoords.lat,
        destination_lon: destCoords.lon,
        weight,
        volume,
        contact,
        priority,
        time_window
      });

      return {
        success: true,
        message: `已添加订单：从 ${pickupCoords.address || location} 到 ${destCoords.address || destination || '总部'}，重量 ${weight}lbs`,
        state: newState
      };
    }

    case 'assignDrivers': {
      const { strategy = 'greedy' } = toolInput;
      
      // 先保存当前状态，以便出错时恢复
      const previousState = JSON.parse(JSON.stringify(currentState));
      
      try {
        // 清除现有排班（但保留数据备份）
        stateManager.clearAssignments();
        
        const idleDrivers = currentState.drivers.filter(d => d.status === 'idle');
        const pendingOrders = currentState.orders.filter(o => o.status === 'pending');
        
        if (idleDrivers.length === 0) {
          // 恢复状态
          stateManager.restoreState(previousState);
          return {
            success: false,
            message: '没有空闲司机',
            state: stateManager.getState()
          };
        }

        if (pendingOrders.length === 0) {
          // 恢复状态
          stateManager.restoreState(previousState);
          return {
            success: false,
            message: '没有待分配的订单',
            state: stateManager.getState()
          };
        }

      // 按优先级排序订单（urgent > high > normal）
      const priorityOrder = { urgent: 3, high: 2, normal: 1 };
      const sortedOrders = [...pendingOrders].sort((a, b) => 
        (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1)
      );

      const assignments = [];
      // 跟踪每个司机已分配的订单总重量
      const driverLoads = new Map();
      idleDrivers.forEach(d => driverLoads.set(d.id, 0));

      // 贪婪算法：优先处理加急订单，优先匹配最近司机，一个司机可以分配多个订单
      // 路线逻辑：司机当前位置 -> 取货地址 -> 总部 -> 目的地
      for (const order of sortedOrders) {
        // 找到能承载该订单且总时间最短的空闲司机（考虑已分配负载）
        let bestDriver = null;
        let minTotalTime = Infinity;

        for (const driver of idleDrivers) {
          const currentLoad = driverLoads.get(driver.id) || 0;
          const remainingCapacity = driver.capacity - currentLoad;
          
          // 检查司机是否有足够剩余容量
          if (remainingCapacity < order.weight) continue;

          try {
            // 计算总时间：司机位置 -> 取货地址 -> 总部 -> 目的地
            // 步骤1: 司机 -> 取货地址
            const route1 = await routesService.getRoute(
              [driver.lon, driver.lat],
              [order.pickup_lon, order.pickup_lat]
            );
            
            // 步骤2: 取货地址 -> 总部
            const route2 = await routesService.getRoute(
              [order.pickup_lon, order.pickup_lat],
              [HUB_COORDS.lon, HUB_COORDS.lat]
            );
            
            // 步骤3: 总部 -> 目的地
            const route3 = await routesService.getRoute(
              [HUB_COORDS.lon, HUB_COORDS.lat],
              [order.destination_lon, order.destination_lat]
            );
            
            // 总时间（秒转分钟）
            const totalTime = Math.round((route1.duration + route2.duration + route3.duration) / 60);

            if (totalTime < minTotalTime) {
              minTotalTime = totalTime;
              bestDriver = driver;
            }
          } catch (error) {
            console.error(`计算路线失败 (司机 ${driver.id} -> 订单 ${order.id}):`, error.message);
            // 如果 API 调用失败，使用简单距离估算
            const distance = Math.sqrt(
              Math.pow(driver.lat - order.pickup_lat, 2) + Math.pow(driver.lon - order.pickup_lon, 2)
            );
            const estimatedTime = Math.round(distance * 10 + 60);
            if (estimatedTime < minTotalTime) {
              minTotalTime = estimatedTime;
              bestDriver = driver;
            }
          }
        }

        if (bestDriver) {
          stateManager.addAssignment(bestDriver.id, order.id, minTotalTime);
          
          // 更新司机负载
          const currentLoad = driverLoads.get(bestDriver.id) || 0;
          driverLoads.set(bestDriver.id, currentLoad + order.weight);
          
          assignments.push({
            driver: bestDriver.name,
            order: order.pickup_location,
            time: minTotalTime
          });
        }
        }

        return {
          success: true,
          message: `已分配 ${assignments.length} 个订单`,
          assignments,
          state: stateManager.getState()
        };
      } catch (error) {
        // 如果分配过程中出错，恢复之前的状态
        console.error('分配司机时出错，恢复状态:', error);
        stateManager.restoreState(previousState);
        return {
          success: false,
          message: `分配失败: ${error.message}`,
          state: stateManager.getState()
        };
      }
    }

    case 'queryStatus': {
      const stats = {
        total_drivers: currentState.drivers.length,
        idle_drivers: currentState.drivers.filter(d => d.status === 'idle').length,
        assigned_drivers: currentState.drivers.filter(d => d.status === 'assigned').length,
        total_orders: currentState.orders.length,
        pending_orders: currentState.orders.filter(o => o.status === 'pending').length,
        assigned_orders: currentState.orders.filter(o => o.status === 'assigned').length,
        total_assignments: currentState.assignments.length
      };

      return {
        success: true,
        message: `系统状态：${stats.idle_drivers} 个空闲司机，${stats.pending_orders} 个待分配订单`,
        stats,
        state: currentState
      };
    }

    case 'resetSystem': {
      const newState = stateManager.resetSystem();
      return {
        success: true,
        message: '系统已重置',
        state: newState
      };
    }

    case 'generateRandomData': {
      const { driver_count = 10, order_count = 20 } = toolInput;
      
      try {
        const locations = Object.keys(stateManager.NJ_LOCATIONS);
        const priorities = ['normal', 'high', 'urgent'];
        const contacts = ['Alice Chen', 'Bob Zhang', 'Carol Wang', 'Dan Liu', 'Eva Li', 'Frank Wu', 'Grace Kim', 'Henry Park', 'Iris Zhao', 'Jack Sun'];
        const timeWindows = ['08:00-11:00', '09:00-12:00', '10:00-13:00', '11:00-14:00', '13:00-16:00', '14:00-17:00', '15:00-18:00'];
        const shiftWindows = ['8-16', '9-17', '10-18', '12-20'];
        
        // 生成随机司机
        const currentState = stateManager.getState();
        
        for (let i = 0; i < driver_count; i++) {
          const location = locations[Math.floor(Math.random() * locations.length)];
          const coords = stateManager.getLocationCoords(location);
          const name = Math.random() > 0.5 
            ? `${['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴'][Math.floor(Math.random() * 10)]}${['伟', '芳', '娜', '敏', '静', '强', '磊', '军', '勇', '杰'][Math.floor(Math.random() * 10)]}`
            : `${['John', 'Mike', 'David', 'Chris', 'Tom', 'James', 'Robert', 'William'][Math.floor(Math.random() * 8)]} ${['Smith', 'Johnson', 'Lee', 'Brown', 'Wilson', 'Davis'][Math.floor(Math.random() * 6)]}`;
          
          stateManager.addDriver({
            name: name,
            capacity: Math.floor(Math.random() * 5000) + 1000,
            location: stateManager.HUB_ADDRESS,
            lat: stateManager.HUB_COORDS.lat,
            lon: stateManager.HUB_COORDS.lon,
            shift_window: shiftWindows[Math.floor(Math.random() * shiftWindows.length)]
          });
        }
        
        // 生成随机订单
        for (let i = 0; i < order_count; i++) {
          const pickupLocation = locations[Math.floor(Math.random() * locations.length)];
          const pickupData = stateManager.getLocationCoords(pickupLocation);
          
          const destOptions = locations.filter(l => l !== pickupLocation);
          const destLocation = destOptions[Math.floor(Math.random() * destOptions.length)];
          const destData = stateManager.getLocationCoords(destLocation);
          
          stateManager.addOrder({
            pickup_location: pickupData.address,
            pickup_lat: pickupData.lat,
            pickup_lon: pickupData.lon,
            destination: destData.address,
            destination_lat: destData.lat,
            destination_lon: destData.lon,
            weight: Math.floor(Math.random() * 800) + 200,
            volume: Math.floor(Math.random() * 20) + 5,
            contact: contacts[Math.floor(Math.random() * contacts.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            time_window: timeWindows[Math.floor(Math.random() * timeWindows.length)]
          });
        }
        
        const finalState = stateManager.getState();
        return {
          success: true,
          message: `已生成 ${driver_count} 个司机和 ${order_count} 个订单`,
          state: finalState
        };
      } catch (error) {
        console.error('生成随机数据失败:', error);
        return {
          success: false,
          message: `生成失败: ${error.message}`,
          state: stateManager.getState()
        };
      }
    }

    default:
      return {
        success: false,
        message: `未知工具：${toolName}`,
        state: currentState
      };
  }
}

/**
 * 处理 AI 响应并执行工具调用
 */
async function processAgentResponse(agentResponse) {
  const content = agentResponse.content || [];
  const toolCalls = [];

  // 查找工具调用
  for (const block of content) {
    if (block.type === 'tool_use') {
      toolCalls.push({
        id: block.id,
        name: block.name,
        input: block.input
      });
    }
  }

  const results = [];
  let finalState = stateManager.getState();

  // 执行所有工具调用
  for (const toolCall of toolCalls) {
    try {
      const result = await executeTool(toolCall.name, toolCall.input);
      results.push({
        tool_call_id: toolCall.id,
        result: result.message,
        state: result.state
      });
      if (result.state) {
        finalState = result.state;
      }
    } catch (error) {
      console.error(`执行工具 ${toolCall.name} 失败:`, error);
      results.push({
        tool_call_id: toolCall.id,
        result: `错误: ${error.message}`,
        state: finalState
      });
    }
  }

  // 获取 AI 的文本回复
  const textResponse = content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');

  // 如果没有文本回复但有工具调用，生成默认回复
  const finalText = textResponse || (toolCalls.length > 0 
    ? `已执行 ${toolCalls.length} 个操作。` 
    : '操作完成。');

  return {
    text: finalText,
    toolResults: results,
    state: finalState
  };
}

module.exports = {
  callAgent,
  executeTool,
  processAgentResponse,
  TOOLS
};

