const fetch = require('node-fetch');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * 使用 Claude API 选择最佳司机
 * @param {Array} drivers - 司机列表
 * @param {Array} orders - 订单列表
 * @param {Array} etaResults - ETA 计算结果
 * @returns {Promise<{chosen_driver_id: string, chosen_order_id: string, reason: string, eta_minutes: number}>}
 */
async function chooseBestDriver(drivers, orders, etaResults) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY 未设置');
  }

  // 构建提示词
  const prompt = buildPrompt(drivers, orders, etaResults);

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
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
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API 错误: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // 解析 AI 返回的 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI 返回格式不正确，无法解析 JSON');
    }

    const result = JSON.parse(jsonMatch[0]);

    // 验证返回结构
    if (!result.chosen_driver_id || !result.chosen_order_id || !result.reason || result.eta_minutes === undefined) {
      throw new Error('AI 返回数据不完整');
    }

    return result;
  } catch (error) {
    console.error('AI 选择司机失败:', error);
    throw error;
  }
}

/**
 * 构建提示词
 */
function buildPrompt(drivers, orders, etaResults) {
  let prompt = `你是一个智能调度系统。请根据以下信息选择最佳司机来执行订单。

司机列表：
${drivers.map(d => `- ID: ${d.id}, 姓名: ${d.name}, 位置: (${d.latitude}, ${d.longitude}), 状态: ${d.status || '空闲'}`).join('\n')}

订单列表：
${orders.map(o => `- ID: ${o.id}, 目的地: ${o.destination || '未知'}, 位置: (${o.latitude}, ${o.longitude})`).join('\n')}

ETA 计算结果（司机到订单的预计时间）：
${etaResults.map(r => `- 司机 ${r.driver_id} -> 订单 ${r.order_id}: ${r.eta_minutes} 分钟`).join('\n')}

请分析所有信息，选择最佳司机-订单组合，并返回 JSON 格式：
{
  "chosen_driver_id": "选择的司机ID",
  "chosen_order_id": "选择的订单ID",
  "reason": "选择理由（中文）",
  "eta_minutes": 预计到达时间（分钟数）
}

请只返回 JSON，不要其他文字。`;

  return prompt;
}

module.exports = {
  chooseBestDriver
};

