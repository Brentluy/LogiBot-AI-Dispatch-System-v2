import { useState } from 'react';

function OrderTable({ orders, assignments, drivers, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    pickup_location: 'Princeton, NJ 08540, USA',
    destination: '',
    weight: 500,
    volume: 10,
    contact: '',
    priority: 'normal',
    time_window: '09:00-17:00'
  });

  const handleEdit = (order) => {
    setEditingId(order.id);
    setEditData({ ...order });
  };

  const handleSave = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
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
      console.error('更新订单失败:', error);
      alert('更新失败: ' + error.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      
      if (!response.ok) {
        throw new Error(`添加失败: ${response.status}`);
      }
      
      const newState = await response.json();
      onUpdate(newState);
      setShowAddForm(false);
      setNewOrder({
        pickup_location: 'Princeton, NJ 08540, USA',
        destination: '',
        weight: 500,
        volume: 10,
        contact: '',
        priority: 'normal',
        time_window: '09:00-17:00'
      });
    } catch (error) {
      console.error('添加订单失败:', error);
      alert('添加失败: ' + error.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取订单分配的司机
  const getOrderAssignments = (orderId) => {
    return assignments.filter(a => a.order_id === orderId);
  };

  // 获取司机信息
  const getDriverInfo = (driverId) => {
    return drivers.find(d => d.id === driverId);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">订单列表表</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md transition-all"
        >
          {showAddForm ? '✕ 取消' : '+ 添加订单'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-green-300">
          <h3 className="font-bold mb-3">添加新订单</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">取货地址</label>
              <input
                type="text"
                value={newOrder.pickup_location}
                onChange={(e) => setNewOrder({ ...newOrder, pickup_location: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Princeton, NJ 08540, USA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">目的地（留空则送到总部）</label>
              <input
                type="text"
                value={newOrder.destination}
                onChange={(e) => setNewOrder({ ...newOrder, destination: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Trenton, NJ 08608, USA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">重量 (lbs)</label>
              <input
                type="number"
                value={newOrder.weight}
                onChange={(e) => setNewOrder({ ...newOrder, weight: parseInt(e.target.value) || 0 })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">体积 (ft³)</label>
              <input
                type="number"
                value={newOrder.volume}
                onChange={(e) => setNewOrder({ ...newOrder, volume: parseInt(e.target.value) || 0 })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">联系人</label>
              <input
                type="text"
                value={newOrder.contact}
                onChange={(e) => setNewOrder({ ...newOrder, contact: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="客户姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">优先级</label>
              <select
                value={newOrder.priority}
                onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="normal">普通</option>
                <option value="high">高</option>
                <option value="urgent">紧急</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">时间窗口</label>
              <input
                type="text"
                value={newOrder.time_window}
                onChange={(e) => setNewOrder({ ...newOrder, time_window: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="09:00-17:00"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newOrder.pickup_location || !newOrder.weight}
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">取货地址</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">目的地</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">重量(lbs)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">体积(ft³)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">联系人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">优先级</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间窗口</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">分配的司机</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const orderAssignments = getOrderAssignments(order.id);
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                    {editingId === order.id ? (
                      <input
                        type="text"
                        value={editData.pickup_location || ''}
                        onChange={(e) => setEditData({ ...editData, pickup_location: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span className="truncate block" title={order.pickup_location}>
                        {order.pickup_location}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                    {editingId === order.id ? (
                      <input
                        type="text"
                        value={editData.destination || ''}
                        onChange={(e) => setEditData({ ...editData, destination: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span className="truncate block" title={order.destination || '总部'}>
                        {order.destination || '1183 Florence Columbus Road, Fieldsboro, NJ 08505'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingId === order.id ? (
                      <input
                        type="number"
                        value={editData.weight || ''}
                        onChange={(e) => setEditData({ ...editData, weight: parseInt(e.target.value) })}
                        className="border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      order.weight
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingId === order.id ? (
                      <input
                        type="number"
                        value={editData.volume || ''}
                        onChange={(e) => setEditData({ ...editData, volume: parseInt(e.target.value) })}
                        className="border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      order.volume
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingId === order.id ? (
                      <input
                        type="text"
                        value={editData.contact || ''}
                        onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                        className="border rounded px-2 py-1 w-24"
                      />
                    ) : (
                      order.contact
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingId === order.id ? (
                      <select
                        value={editData.priority || 'normal'}
                        onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="normal">普通</option>
                        <option value="high">高</option>
                        <option value="urgent">紧急</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(order.priority)}`}>
                        {order.priority === 'urgent' ? '紧急' : order.priority === 'high' ? '高' : '普通'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {editingId === order.id ? (
                      <input
                        type="text"
                        value={editData.time_window || ''}
                        onChange={(e) => setEditData({ ...editData, time_window: e.target.value })}
                        className="border rounded px-2 py-1 w-32"
                        placeholder="09:00-12:00"
                      />
                    ) : (
                      order.time_window
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status === 'pending' ? '待分配' : order.status === 'assigned' ? '已分配' : '已完成'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {orderAssignments.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {orderAssignments.map(assignment => {
                          const driver = getDriverInfo(assignment.driver_id);
                          return (
                            <span
                              key={assignment.id}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                              title={driver ? `${driver.name} (${driver.id})` : assignment.driver_id}
                            >
                              {driver ? driver.name : assignment.driver_id}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <select
                        onChange={async (e) => {
                          const driverId = e.target.value;
                          if (driverId && driverId !== '') {
                            try {
                              const response = await fetch('/api/assign', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ driver_id: driverId, order_id: order.id })
                              });
                              if (response.ok) {
                                const newState = await response.json();
                                onUpdate(newState);
                              } else {
                                alert('分配失败');
                              }
                            } catch (error) {
                              console.error('分配失败:', error);
                              alert('分配失败: ' + error.message);
                            }
                          }
                          e.target.value = '';
                        }}
                        className="text-xs border rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="">选择司机...</option>
                        {drivers.filter(d => d.status === 'idle' || d.status === 'assigned').map(driver => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name} ({driver.capacity}lbs)
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {editingId === order.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(order.id)}
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
                        onClick={() => handleEdit(order)}
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

export default OrderTable;
