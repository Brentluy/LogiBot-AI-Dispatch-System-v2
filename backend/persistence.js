const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'state.json');
const DATA_DIR = path.dirname(DATA_FILE);

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * 保存状态到文件
 * @param {object} state - 状态对象
 */
function saveState(state) {
  try {
    // 创建备份
    if (fs.existsSync(DATA_FILE)) {
      const backupFile = DATA_FILE.replace('.json', `.backup.${Date.now()}.json`);
      fs.copyFileSync(DATA_FILE, backupFile);
      // 只保留最近5个备份
      const backups = fs.readdirSync(DATA_DIR)
        .filter(f => f.startsWith('state.backup.') && f.endsWith('.json'))
        .sort()
        .reverse();
      if (backups.length > 5) {
        backups.slice(5).forEach(f => {
          fs.unlinkSync(path.join(DATA_DIR, f));
        });
      }
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存状态失败:', error);
    return false;
  }
}

/**
 * 从文件加载状态
 * @returns {object|null} 状态对象，如果文件不存在则返回 null
 */
function loadState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('加载状态失败:', error);
    // 尝试加载备份
    try {
      const backups = fs.readdirSync(DATA_DIR)
        .filter(f => f.startsWith('state.backup.') && f.endsWith('.json'))
        .sort()
        .reverse();
      if (backups.length > 0) {
        const backupFile = path.join(DATA_DIR, backups[0]);
        const data = fs.readFileSync(backupFile, 'utf8');
        console.log('从备份恢复状态:', backupFile);
        return JSON.parse(data);
      }
    } catch (backupError) {
      console.error('从备份恢复失败:', backupError);
    }
  }
  return null;
}

/**
 * 检查是否有保存的状态
 * @returns {boolean}
 */
function hasSavedState() {
  return fs.existsSync(DATA_FILE);
}

module.exports = {
  saveState,
  loadState,
  hasSavedState,
  DATA_FILE
};

