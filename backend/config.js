// API Keys 配置管理器（存储在内存中，不写入文件）
let apiKeys = {
  ORS_API_KEY: null,
  ANTHROPIC_API_KEY: null
};

/**
 * 设置 API Keys
 * @param {string} orsKey - OpenRouteService API Key
 * @param {string} anthropicKey - Anthropic Claude API Key
 */
function setApiKeys(orsKey, anthropicKey) {
  apiKeys.ORS_API_KEY = orsKey;
  apiKeys.ANTHROPIC_API_KEY = anthropicKey;
  return {
    success: true,
    message: 'API Keys 已设置'
  };
}

/**
 * 获取 API Keys（仅用于检查是否已配置，不返回实际值）
 * @returns {object} 配置状态
 */
function getApiKeysStatus() {
  return {
    configured: !!(apiKeys.ORS_API_KEY && apiKeys.ANTHROPIC_API_KEY),
    hasOrsKey: !!apiKeys.ORS_API_KEY,
    hasAnthropicKey: !!apiKeys.ANTHROPIC_API_KEY
  };
}

/**
 * 获取 ORS API Key
 * @returns {string|null}
 */
function getOrsApiKey() {
  // 优先使用内存中的 key，如果没有则尝试从环境变量读取（向后兼容）
  return apiKeys.ORS_API_KEY || process.env.ORS_API_KEY || null;
}

/**
 * 获取 Anthropic API Key
 * @returns {string|null}
 */
function getAnthropicApiKey() {
  // 优先使用内存中的 key，如果没有则尝试从环境变量读取（向后兼容）
  return apiKeys.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY || null;
}

/**
 * 清除 API Keys（用于测试或重置）
 */
function clearApiKeys() {
  apiKeys.ORS_API_KEY = null;
  apiKeys.ANTHROPIC_API_KEY = null;
}

module.exports = {
  setApiKeys,
  getApiKeysStatus,
  getOrsApiKey,
  getAnthropicApiKey,
  clearApiKeys
};

