const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update navbar map
    // We look for: '全宗配置': 'fonds-config.html',
    if (content.includes("'全宗配置': 'fonds-config.html',") && !content.includes("'用户管理': 'user-management.html',")) {
        content = content.replace(
            "'全宗配置': 'fonds-config.html',",
            "'全宗配置': 'fonds-config.html',\n                        '用户管理': 'user-management.html',"
        );
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
});
