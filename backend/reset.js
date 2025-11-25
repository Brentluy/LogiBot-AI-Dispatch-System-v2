// 重置脚本：清除所有配置和数据
const fs = require('fs');
const path = require('path');
const config = require('./config');
const stateManager = require('./state');

console.log('=== 重置系统到初始状态 ===\n');

// 1. 清除 API Keys
console.log('1. 清除 API Keys 配置...');
config.clearApiKeys();
console.log('   ✅ API Keys 已清除\n');

// 2. 清除数据文件
const dataDir = path.join(__dirname, 'data');
if (fs.existsSync(dataDir)) {
  console.log('2. 清除数据文件...');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  files.forEach(file => {
    fs.unlinkSync(path.join(dataDir, file));
    console.log(`   ✅ 已删除: ${file}`);
  });
  console.log('   ✅ 所有数据文件已清除\n');
} else {
  console.log('2. 数据目录不存在，跳过\n');
}

// 3. 重置系统状态
console.log('3. 重置系统状态...');
stateManager.resetSystem();
console.log('   ✅ 系统状态已重置\n');

console.log('=== 重置完成 ===');
console.log('\n下一步：');
console.log('1. 重启后端服务');
console.log('2. 访问 http://localhost:3000');
console.log('3. 会看到配置页面，需要重新输入 API Keys');

