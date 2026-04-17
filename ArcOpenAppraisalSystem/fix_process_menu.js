const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // 1. Update map in navigate function
    if (content.includes("'元数据配置': 'metadata-config.html'") && !content.includes("'鉴定流程配置': 'appraisal-process-config.html'")) {
        content = content.replace(
            /'元数据配置': 'metadata-config.html'/g,
            "'元数据配置': 'metadata-config.html',\n                        '鉴定流程配置': 'appraisal-process-config.html'"
        );
        updated = true;
    }
    
    // 2. Update menuItems
    if (content.includes("'全宗配置', '用户管理', '角色权限', '元数据配置'") && !content.includes("'鉴定流程配置'")) {
        content = content.replace(
            /'全宗配置', '用户管理', '角色权限', '元数据配置'/g,
            "'全宗配置', '用户管理', '角色权限', '元数据配置', '鉴定流程配置'"
        );
        updated = true;
    }
    
    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + file);
    }
});