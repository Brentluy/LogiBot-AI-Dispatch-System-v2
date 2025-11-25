import { useState, useRef, useEffect } from 'react';
import './AIChat.css';

function AIChat({ onStateUpdate }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '你好！我是 LogiBot，你的物流调度助手。我可以帮你添加订单、分配司机、查询状态等。试试说"帮我分单"或"添加一个订单到 Princeton，重量 500 磅"。'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // 添加用户消息
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat/simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`服务器错误 (${response.status}): ${errorText.substring(0, 100)}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`服务器返回了非 JSON 格式: ${text.substring(0, 100)}`);
      }

      const result = await response.json();

      // 添加 AI 回复
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.text || result.message || '操作完成',
        toolResults: result.toolResults
      }]);

      // 更新状态
      if (result.state) {
        onStateUpdate(result.state);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，发生了错误：' + error.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h3>🤖 LogiBot AI 助手</h3>
        <div className="ai-status">在线</div>
      </div>
      
      <div className="ai-chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">{msg.content}</div>
              {msg.toolResults && msg.toolResults.length > 0 && (
                <div className="tool-results">
                  {msg.toolResults.map((tool, i) => (
                    <div key={i} className="tool-result">
                      <span className="tool-name">🔧 {tool.result}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息... (例如：添加一个订单到 Princeton，重量 500 磅)"
          disabled={loading}
          className="chat-input-field"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="chat-send-button"
        >
          发送
        </button>
      </div>
    </div>
  );
}

export default AIChat;

