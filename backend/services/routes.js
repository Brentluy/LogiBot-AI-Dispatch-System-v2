const fetch = require('node-fetch');
const config = require('../config');

const ORS_API_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

/**
 * 获取两点之间的路线信息
 * @param {Array<number>} start - [longitude, latitude]
 * @param {Array<number>} end - [longitude, latitude]
 * @returns {Promise<{duration: number, distance: number, polyline: string}>}
 */
async function getRoute(start, end) {
  const apiKey = config.getOrsApiKey();

  if (!apiKey) {
    throw new Error('ORS_API_KEY 未设置，请在配置页面输入 API Key');
  }

  try {
    const response = await fetch(ORS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coordinates: [start, end]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ORS API 错误: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error('ORS API 未返回路线');
    }

    const route = data.routes[0];
    const segment = route.segments[0];

    return {
      duration: segment.duration, // 秒
      distance: segment.distance, // 米
      polyline: route.geometry // encoded polyline
    };
  } catch (error) {
    console.error('获取路线失败:', error);
    throw error;
  }
}

module.exports = {
  getRoute
};

