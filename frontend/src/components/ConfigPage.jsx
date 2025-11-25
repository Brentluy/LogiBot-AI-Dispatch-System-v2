import { useState, useEffect } from 'react';
import './ConfigPage.css';

function ConfigPage({ onConfigComplete }) {
  const [orsKey, setOrsKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checking, setChecking] = useState(true);
  const [configStatus, setConfigStatus] = useState(null);

  // 检查配置状态
  useEffect(() => {
    checkConfigStatus();
  }, []);

  const checkConfigStatus = async () => {
    try {
      const response = await fetch('/api/config/status');
      const status = await response.json();
      setConfigStatus(status);
      
      // 如果已配置，直接进入应用
      if (status.configured) {
        onConfigComplete();
      }
    } catch (error) {
      console.error('检查配置状态失败:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/config/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ors_api_key: orsKey.trim(),
          anthropic_api_key: anthropicKey.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '配置失败');
      }

      const result = await response.json();
      setSuccess(true);
      
      // 延迟一下再跳转，让用户看到成功消息
      setTimeout(() => {
        onConfigComplete();
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="config-page">
        <div className="config-container">
          <div className="spinner"></div>
          <p>正在检查配置状态...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="config-page">
      <div className="config-container">
        <div className="config-header">
          <h1>🚚 LogiBot 配置</h1>
          <p className="config-subtitle">首次使用需要配置 API Keys</p>
        </div>

        <div className="config-info">
          <div className="info-card">
            <h3>📋 需要配置的 API Keys</h3>
            <ul>
              <li>
                <strong>OpenRouteService API Key</strong>
                <p>用于路线计算和 ETA 估算</p>
                <a href="https://openrouteservice.org/" target="_blank" rel="noopener noreferrer">
                  获取 API Key →
                </a>
              </li>
              <li>
                <strong>Anthropic Claude API Key</strong>
                <p>用于 AI 对话和智能调度</p>
                <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">
                  获取 API Key →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="config-form">
          <div className="form-group">
            <label htmlFor="ors_key">
              OpenRouteService API Key <span className="required">*</span>
            </label>
            <input
              type="password"
              id="ors_key"
              value={orsKey}
              onChange={(e) => setOrsKey(e.target.value)}
              placeholder="输入你的 ORS API Key"
              required
              disabled={loading}
              className={configStatus?.hasOrsKey ? 'input-configured' : ''}
            />
            {configStatus?.hasOrsKey && (
              <span className="configured-badge">已配置</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="anthropic_key">
              Anthropic Claude API Key <span className="required">*</span>
            </label>
            <input
              type="password"
              id="anthropic_key"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="输入你的 Anthropic API Key"
              required
              disabled={loading}
              className={configStatus?.hasAnthropicKey ? 'input-configured' : ''}
            />
            {configStatus?.hasAnthropicKey && (
              <span className="configured-badge">已配置</span>
            )}
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              ✅ API Keys 配置成功！正在进入应用...
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !orsKey.trim() || !anthropicKey.trim()}
            className="submit-button"
          >
            {loading ? '配置中...' : '保存并开始使用'}
          </button>
        </form>

        <div className="config-footer">
          <p className="security-note">
            🔒 <strong>安全提示：</strong>API Keys 仅存储在服务器内存中，不会写入文件或数据库。
            重启服务器后需要重新配置。
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConfigPage;

