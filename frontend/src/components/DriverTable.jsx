import { useState } from 'react';

function DriverTable({ drivers, assignments, orders, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    capacity: 1000,
    location: '1183 Florence Columbus Road, Fieldsboro, NJ 08505',
    shift_window: '9-17'
  });

  const handleEdit = (driver) => {
    setEditingId(driver.id);
    setEditData({ ...driver });
  };

  const handleSave = async (driverId) => {
    try {
      const response = await fetch(`/api/drivers/${driverId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      
      if (!response.ok) {
        throw new Error(`更新失败: ${response.status}`);
      }
      
      const newState = await response.json();
      onUpdate(newState);
      setEditingId(null);
    } catch (error) {
      console.error('更新司机失败:', error);
      alert('更新失败: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver)
      });
      
      if (!response.ok) {
        throw new Error(`添加失败: ${response.status}`);
      }
      
      const newState = await response.json();
      onUpdate(newState);
      setShowAddForm(false);
      setNewDriver({ name: '', capacity: 1000, location: '1183 Florence Columbus Road, Fieldsboro, NJ 08505', shift_window: '9-17' });
    } catch (error) {
      console.error('添加司机失败:', error);
      alert('添加失败: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'idle': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取司机分配的订单
  const getDriverAssignments = (driverId) => {
    return assignments.filter(a => a.driver_id === driverId);
  };

  // 获取订单信息
  const getOrderInfo = (orderId) => {
    return orders.find(o => o.id === orderId);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">司机状态表</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md transition-all"
        >
          {showAddForm ? '✕ 取消' : '+ 添加司机'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-green-300">
          <h3 className="font-bold mb-3">添加新司机</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">姓名</label>
              <input
                type="text"
                value={newDriver.name}
                onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="例如：王师傅"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">运载能力 (lbs)</label>
              <input
                type="number"
                value={newDriver.capacity}
                onChange={(e) => setNewDriver({ ...newDriver, capacity: parseInt(e.target.value) || 0 })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">位置</label>
              <input
                type="text"
                value={newDriver.location}
                onChange={(e) => setNewDriver({ ...newDriver, location: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Fieldsboro Hub"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">班次时间（格式：9-17）</label>
              <input
                type="text"
                value={newDriver.shift_window}
                onChange={(e) => setNewDriver({ ...newDriver, shift_window: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="9-17"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newDriver.name || !newDriver.capacity}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
          >
            确认添加
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">姓名</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">容量(lbs)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">位置</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">班次时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">分配的订单</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => {
              const driverAssignments = getDriverAssignments(driver.id);
              return (
                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {driver.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingId === driver.id ? (
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      driver.name
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingId === driver.id ? (
                      <input
                        type="number"
                        value={editData.capacity || ''}
                        onChange={(e) => setEditData({ ...editData, capacity: parseInt(e.target.value) })}
                        className="border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      driver.capacity
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingId === driver.id ? (
                      <select
                        value={editData.status || 'idle'}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="idle">空闲</option>
                        <option value="assigned">已分配</option>
                        <option value="busy">忙碌</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(driver.status)}`}>
                        {driver.status === 'idle' ? '空闲' : driver.status === 'assigned' ? '已分配' : '忙碌'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingId === driver.id ? (
                      <input
                        type="text"
                        value={editData.location || ''}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="border rounded px-2 py-1 w-32"
                      />
                    ) : (
                      driver.location
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingId === driver.id ? (
                      <input
                        type="text"
                        value={editData.shift_window || editData.shift || ''}
                        onChange={(e) => setEditData({ ...editData, shift_window: e.target.value })}
                        className="border rounded px-2 py-1 w-24"
                        placeholder="9-17"
                      />
                    ) : (
                      driver.shift_window || driver.shift || '未设置'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {driverAssignments.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {driverAssignments.map(assignment => {
                          const order = getOrderInfo(assignment.order_id);
                          return (
                            <span
                              key={assignment.id}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                              title={order ? `${order.pickup_location} (${order.weight}lbs)` : assignment.order_id}
                            >
                              {order ? `${order.pickup_location}` : assignment.order_id}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-400">无</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {editingId === driver.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(driver.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md transition-all"
                        >
                          ✓ 保存
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold shadow-md transition-all"
                        >
                          ✕ 取消
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(driver)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-all flex items-center gap-1"
                      >
                        ✏️ 编辑
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DriverTable;
