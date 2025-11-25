function AssignmentTable({ assignments, drivers, orders }) {
  const getDriverName = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : driverId;
  };

  const getOrderInfo = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    return order ? {
      location: order.pickup_location,
      weight: order.weight,
      priority: order.priority
    } : null;
  };

  if (assignments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无排班记录
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">排班ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">司机</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">取货地址</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">重量(lbs)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">优先级</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">预计时间(分钟)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assignments.map((assignment) => {
            const orderInfo = getOrderInfo(assignment.order_id);
            return (
              <tr key={assignment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {assignment.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {getDriverName(assignment.driver_id)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {assignment.order_id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {orderInfo ? orderInfo.location : '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {orderInfo ? orderInfo.weight : '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {orderInfo && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      orderInfo.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      orderInfo.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {orderInfo.priority === 'urgent' ? '紧急' : orderInfo.priority === 'high' ? '高' : '普通'}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {assignment.estimated_time}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {assignment.status === 'assigned' ? '已分配' : assignment.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AssignmentTable;

