// 测试 API 和 Claude API
require('dotenv').config();
const fetch = require('node-fetch');

async function testAPIs() {
  console.log('=== 测试后端 API ===\n');
  
  // 测试后端状态 API
  try {
    const response = await fetch('http://localhost:3001/api/state');
    const data = await response.json();
    console.log('✅ 后端状态 API 正常');
    console.log(`   司机数量: ${data.drivers.length}`);
    console.log(`   订单数量: ${data.orders.length}`);
    console.log(`   排班数量: ${data.assignments.length}\n`);
  } catch (error) {
    console.error('❌ 后端状态 API 失败:', error.message);
  }

  // 测试 Claude API
  console.log('=== 测试 Claude API ===\n');
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY 未设置');
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message. Please respond with "API is working".'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Claude API 错误: ${response.status}`);
      console.error(`   错误信息: ${errorText.substring(0, 200)}`);
      return;
    }

    const data = await response.json();
    console.log('✅ Claude API 正常工作');
    console.log(`   响应: ${data.content[0].text.substring(0, 100)}...\n`);
  } catch (error) {
    console.error('❌ Claude API 测试失败:', error.message);
  }
}

testAPIs();

