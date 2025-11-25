import { useState, useEffect } from 'react';
import DriverTable from './components/DriverTable';
import OrderTable from './components/OrderTable';
import AssignmentTable from './components/AssignmentTable';
import AIChat from './components/AIChat';
import Dashboard from './components/Dashboard';
import ConfigPage from './components/ConfigPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, operations, ai
  const [state, setState] = useState({
    drivers: [],
    orders: [],
    assignments: []
  });
  const [loading, setLoading] = useState(true);
  const [configRequired, setConfigRequired] = useState(false);
  const [checkingConfig, setCheckingConfig] = useState(true);

  // 检查配置状态
  useEffect(() => {
    checkConfig();
  }, []);

  const checkConfig = async () => {
    try {
      const response = await fetch('/api/config/status');
      const status = await response.json();
      
      if (!status.configured) {
        setConfigRequired(true);
      } else {
        loadState();
      }
    } catch (error) {
      console.error('检查配置失败:', error);
      // 如果检查失败，尝试加载状态（可能是旧版本后端）
      loadState();
    } finally {
      setCheckingConfig(false);
    }
  };

  const handleConfigComplete = () => {
    setConfigRequired(false);
    loadState();
  };

  // 加载初始状态
  const loadState = async () => {
    try {
      const response = await fetch('/api/state');
      const data = await response.json();
      setState(data);
      setLoading(false);
    } catch (error) {
      console.error('加载状态失败:', error);
      setLoading(false);
    }
  };

  const handleStateUpdate = (newState) => {
    setState(newState);
    // 如果排班表有变化，自动刷新
    if (newState.assignments && newState.assignments.length !== state.assignments.length) {
      // 排班表已更新
    }
  };

  // 定期刷新状态（每5秒）
  useEffect(() => {
    if (activeTab === 'operations') {
      const interval = setInterval(() => {
        loadState();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // 如果正在检查配置，显示加载状态
  if (checkingConfig) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>正在初始化...</p>
      </div>
    );
  }

  // 如果需要配置，显示配置页面
  if (configRequired) {
    return <ConfigPage onConfigComplete={handleConfigComplete} />;
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🚚 Gofo Express - LogiBot 物流调度系统</h1>
          <div className="header-subtitle">Fieldsboro Hub, New Jersey</div>
        </div>
        <nav className="tab-nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 数据看板
          </button>
          <button
            className={activeTab === 'operations' ? 'active' : ''}
            onClick={() => setActiveTab('operations')}
          >
            ⚙️ 操作面板
          </button>
          <button
            className={activeTab === 'ai' ? 'active' : ''}
            onClick={() => setActiveTab('ai')}
          >
            🤖 AI 助手
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'dashboard' && (
          <Dashboard state={state} />
        )}

        {activeTab === 'operations' && (
          <div className="operations-layout">
            <div className="left-panel">
              <div className="table-section">
                <DriverTable
                  drivers={state.drivers}
                  assignments={state.assignments}
                  orders={state.orders}
                  onUpdate={handleStateUpdate}
                />
              </div>
              <div className="table-section">
                <OrderTable
                  orders={state.orders}
                  assignments={state.assignments}
                  drivers={state.drivers}
                  onUpdate={handleStateUpdate}
                />
              </div>
              <div className="table-section">
                <h2>司机排班表</h2>
                <AssignmentTable
                  assignments={state.assignments}
                  drivers={state.drivers}
                  orders={state.orders}
                />
              </div>
            </div>
            <div className="right-panel">
              <AIChat onStateUpdate={handleStateUpdate} />
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="ai-full-layout">
            <AIChat onStateUpdate={handleStateUpdate} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
