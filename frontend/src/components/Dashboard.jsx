import { useMemo } from 'react';
import MapView from './MapView';
import './Dashboard.css';

function Dashboard({ state }) {
  const stats = useMemo(() => {
    const idleDrivers = state.drivers.filter(d => d.status === 'idle').length;
    const assignedDrivers = state.drivers.filter(d => d.status === 'assigned').length;
    const pendingOrders = state.orders.filter(o => o.status === 'pending').length;
    const assignedOrders = state.orders.filter(o => o.status === 'assigned').length;
    const urgentOrders = state.orders.filter(o => o.priority === 'urgent' && o.status === 'pending').length;
    
    const totalWeight = state.orders.reduce((sum, o) => sum + (o.weight || 0), 0);
    const totalCapacity = state.drivers.reduce((sum, d) => sum + (d.capacity || 0), 0);
    const utilizationRate = totalCapacity > 0 ? ((totalWeight / totalCapacity) * 100).toFixed(1) : 0;

    return {
      idleDrivers,
      assignedDrivers,
      pendingOrders,
      assignedOrders,
      urgentOrders,
      totalWeight,
      totalCapacity,
      utilizationRate
    };
  }, [state]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <div className="stat-value">{stats.idleDrivers}</div>
            <div className="stat-label">空闲司机</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingOrders}</div>
            <div className="stat-label">待分配订单</div>
          </div>
        </div>
        <div className="stat-card urgent">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.urgentOrders}</div>
            <div className="stat-label">紧急订单</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.assignedOrders}</div>
            <div className="stat-label">已分配订单</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.utilizationRate}%</div>
            <div className="stat-label">运力利用率</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalWeight}</div>
            <div className="stat-label">总重量 (lbs)</div>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>司机状态分布</h3>
          <div className="chart-content">
            <div className="chart-bar">
              <div className="bar-label">空闲</div>
              <div className="bar-container">
                <div 
                  className="bar-fill green" 
                  style={{ width: `${(stats.idleDrivers / state.drivers.length) * 100}%` }}
                ></div>
              </div>
              <div className="bar-value">{stats.idleDrivers}</div>
            </div>
            <div className="chart-bar">
              <div className="bar-label">已分配</div>
              <div className="bar-container">
                <div 
                  className="bar-fill blue" 
                  style={{ width: `${(stats.assignedDrivers / state.drivers.length) * 100}%` }}
                ></div>
              </div>
              <div className="bar-value">{stats.assignedDrivers}</div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>订单优先级分布</h3>
          <div className="chart-content">
            <div className="priority-item">
              <span className="priority-dot urgent"></span>
              <span>紧急: {state.orders.filter(o => o.priority === 'urgent').length}</span>
            </div>
            <div className="priority-item">
              <span className="priority-dot high"></span>
              <span>高: {state.orders.filter(o => o.priority === 'high').length}</span>
            </div>
            <div className="priority-item">
              <span className="priority-dot normal"></span>
              <span>普通: {state.orders.filter(o => o.priority === 'normal').length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-map">
        <h3>实时地图视图</h3>
        <MapView
          drivers={state.drivers}
          orders={state.orders}
          assignments={state.assignments}
        />
      </div>
    </div>
  );
}

export default Dashboard;

