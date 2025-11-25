const persistence = require('./persistence');

// 全局状态管理
let state = {
  drivers: [],
  orders: [],
  assignments: [] // 排班表：{ driver_id, order_id, estimated_time, status }
};

// 总部地址
const HUB_ADDRESS = '1183 Florence Columbus Road, Fieldsboro, NJ 08505';
const HUB_COORDS = { lat: 40.1373, lon: -74.7287 };

// New Jersey 主要城市完整地址和坐标
const NJ_LOCATIONS = {
  'Fieldsboro Hub': { 
    address: HUB_ADDRESS,
    lat: 40.1373, 
    lon: -74.7287 
  },
  'Trenton': { 
    address: 'Trenton, NJ 08608, USA',
    lat: 40.2206, 
    lon: -74.7597 
  },
  'Princeton': { 
    address: 'Princeton, NJ 08540, USA',
    lat: 40.3487, 
    lon: -74.6590 
  },
  'Newark': { 
    address: 'Newark, NJ 07102, USA',
    lat: 40.7357, 
    lon: -74.1724 
  },
  'Cherry Hill': { 
    address: 'Cherry Hill, NJ 08002, USA',
    lat: 39.9348, 
    lon: -75.0303 
  },
  'Moorestown': { 
    address: 'Moorestown, NJ 08057, USA',
    lat: 39.9687, 
    lon: -74.9490 
  },
  'Hamilton': { 
    address: 'Hamilton Township, NJ 08690, USA',
    lat: 40.2276, 
    lon: -74.6532 
  },
  'Camden': { 
    address: 'Camden, NJ 08102, USA',
    lat: 39.9259, 
    lon: -75.1196 
  },
  'Edison': { 
    address: 'Edison, NJ 08817, USA',
    lat: 40.5187, 
    lon: -74.4121 
  },
  'Jersey City': { 
    address: 'Jersey City, NJ 07302, USA',
    lat: 40.7178, 
    lon: -74.0431 
  }
};

// 随机生成中文姓名
function randomChineseName() {
  const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '林', '郭', '何', '高', '罗'];
  const givenNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英'];
  return surnames[Math.floor(Math.random() * surnames.length)] + givenNames[Math.floor(Math.random() * givenNames.length)];
}

// 随机生成英文姓名
function randomEnglishName() {
  const firstNames = ['John', 'Mike', 'David', 'Chris', 'Tom', 'James', 'Robert', 'William', 'Michael', 'Daniel', 'Joseph', 'Charles', 'Thomas', 'Christopher', 'Matthew'];
  const lastNames = ['Smith', 'Johnson', 'Lee', 'Brown', 'Wilson', 'Davis', 'Miller', 'Garcia', 'Martinez', 'Rodriguez', 'Anderson', 'Taylor', 'Moore', 'Jackson', 'White'];
  return firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)];
}

// 初始化默认数据
function initializeState() {
  // 生成 20 个随机司机
  state.drivers = [];
  const shifts = ['morning', 'afternoon', 'evening'];
  const shiftWindowMap = {
    'morning': '8-16',
    'afternoon': '12-20',
    'evening': '16-24'
  };
  const locations = Object.keys(NJ_LOCATIONS);
  
  for (let i = 1; i <= 20; i++) {
    const shift = shifts[Math.floor(Math.random() * shifts.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const coords = NJ_LOCATIONS[location];
    const name = Math.random() > 0.5 ? randomChineseName() : randomEnglishName();
    
    state.drivers.push({
      id: `D${String(i).padStart(3, '0')}`,
      name: name,
      capacity: Math.floor(Math.random() * 5000) + 1000, // 1000-6000 lbs
      status: 'idle',
      location: HUB_ADDRESS, // 所有司机初始位置在总部
      lat: HUB_COORDS.lat,
      lon: HUB_COORDS.lon,
      shift: shift,
      shift_window: shiftWindowMap[shift]
    });
  }

  // 生成 25 个随机订单
  state.orders = [];
  const priorities = ['normal', 'high', 'urgent'];
  const contacts = ['Alice Chen', 'Bob Zhang', 'Carol Wang', 'Dan Liu', 'Eva Li', 'Frank Wu', 'Grace Kim', 'Henry Park', 'Iris Zhao', 'Jack Sun'];
  const timeWindows = ['08:00-11:00', '09:00-12:00', '10:00-13:00', '11:00-14:00', '13:00-16:00', '14:00-17:00', '15:00-18:00'];
  
  for (let i = 1; i <= 25; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const locationData = NJ_LOCATIONS[location];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const contact = contacts[Math.floor(Math.random() * contacts.length)];
    const timeWindow = timeWindows[Math.floor(Math.random() * timeWindows.length)];
    
    // 生成目的地（随机选择另一个城市）
    const destinationOptions = locations.filter(l => l !== location);
    const destination = destinationOptions[Math.floor(Math.random() * destinationOptions.length)];
    const destinationData = NJ_LOCATIONS[destination];
    
    state.orders.push({
      id: `O${String(i).padStart(3, '0')}`,
      pickup_location: locationData.address, // 完整地址
      pickup_lat: locationData.lat,
      pickup_lon: locationData.lon,
      destination: destinationData.address, // 目的地完整地址
      destination_lat: destinationData.lat,
      destination_lon: destinationData.lon,
      weight: Math.floor(Math.random() * 800) + 200, // 200-1000 lbs
      volume: Math.floor(Math.random() * 20) + 5, // 5-25 ft³
      contact: contact,
      priority: priority,
      time_window: timeWindow,
      status: 'pending'
    });
  }

  state.assignments = [];
}

// 获取状态
function getState() {
  // 自动保存状态（异步，不阻塞）
  setImmediate(() => {
    try {
      persistence.saveState(state);
    } catch (error) {
      console.error('自动保存状态失败:', error);
    }
  });
  return { ...state };
}

// 更新司机
function updateDriver(driverId, updates) {
  const driver = state.drivers.find(d => d.id === driverId);
  if (driver) {
    Object.assign(driver, updates);
  }
  return getState();
}

// 更新订单
function updateOrder(orderId, updates) {
  const order = state.orders.find(o => o.id === orderId);
  if (order) {
    Object.assign(order, updates);
  }
  return getState();
}

// 添加司机
function addDriver(driverData) {
  const newDriver = {
    id: `D${String(state.drivers.length + 1).padStart(3, '0')}`,
    ...driverData,
    status: 'idle'
  };
  // 如果没有提供 shift_window，设置默认值
  if (!newDriver.shift_window && newDriver.shift) {
    const shiftWindowMap = {
      'morning': '8-16',
      'afternoon': '12-20',
      'evening': '16-24'
    };
    newDriver.shift_window = shiftWindowMap[newDriver.shift] || '9-17';
  }
  if (!newDriver.shift_window) {
    newDriver.shift_window = '9-17';
  }
  state.drivers.push(newDriver);
  return getState();
}

// 添加订单
function addOrder(orderData) {
  const newOrder = {
    id: `O${String(state.orders.length + 1).padStart(3, '0')}`,
    ...orderData,
    status: 'pending'
  };
  state.orders.push(newOrder);
  return getState();
}

// 添加排班
function addAssignment(driverId, orderId, estimatedTime) {
  const assignment = {
    id: `A${String(state.assignments.length + 1).padStart(3, '0')}`,
    driver_id: driverId,
    order_id: orderId,
    estimated_time: estimatedTime,
    status: 'assigned',
    created_at: new Date().toISOString()
  };
  state.assignments.push(assignment);
  
  // 更新司机状态（如果有订单就标记为已分配）
  const driver = state.drivers.find(d => d.id === driverId);
  if (driver && driver.status === 'idle') {
    driver.status = 'assigned';
  }
  
  // 更新订单状态
  updateOrder(orderId, { status: 'assigned' });
  
  return getState();
}

// 清除所有排班
function clearAssignments() {
  state.assignments = [];
  // 检查每个司机是否还有其他排班
  state.drivers.forEach(d => {
    const hasAssignments = state.assignments.some(a => a.driver_id === d.id);
    if (!hasAssignments && d.status === 'assigned') {
      d.status = 'idle';
    }
  });
  state.orders.forEach(o => {
    const hasAssignments = state.assignments.some(a => a.order_id === o.id);
    if (!hasAssignments && o.status === 'assigned') {
      o.status = 'pending';
    }
  });
  return getState();
}

// 重置系统
function resetSystem() {
  initializeState();
  return getState();
}

// 恢复状态（用于错误恢复）
function restoreState(savedState) {
  state.drivers = savedState.drivers || [];
  state.orders = savedState.orders || [];
  state.assignments = savedState.assignments || [];
  return getState();
}

// 获取位置坐标（支持地址字符串或城市名）
function getLocationCoords(locationName) {
  // 如果是完整地址，尝试查找匹配的城市
  for (const [city, data] of Object.entries(NJ_LOCATIONS)) {
    if (locationName.includes(city) || data.address.includes(locationName)) {
      return { lat: data.lat, lon: data.lon, address: data.address };
    }
  }
  // 默认返回总部
  return { lat: HUB_COORDS.lat, lon: HUB_COORDS.lon, address: HUB_ADDRESS };
}

// 初始化：尝试从文件加载，如果不存在则初始化新数据
const savedState = persistence.loadState();
if (savedState && savedState.drivers && savedState.orders) {
  console.log('从文件恢复状态:', savedState.drivers.length, '个司机,', savedState.orders.length, '个订单');
  state = savedState;
  // 确保所有字段都存在
  if (!state.assignments) state.assignments = [];
  if (!state.drivers) state.drivers = [];
  if (!state.orders) state.orders = [];
} else {
  console.log('初始化新状态');
  initializeState();
  // 保存初始状态
  persistence.saveState(state);
}

module.exports = {
  getState,
  updateDriver,
  updateOrder,
  addDriver,
  addOrder,
  addAssignment,
  clearAssignments,
  resetSystem,
  restoreState,
  getLocationCoords,
  NJ_LOCATIONS,
  HUB_ADDRESS,
  HUB_COORDS
};
