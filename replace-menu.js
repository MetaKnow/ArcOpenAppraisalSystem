const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'ArcOpenAppraisalSystem');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const regex = /\{ name: '系统管理', children: \['全宗配置', '用户管理', '角色权限', '元数据配置', '鉴定流程配置', '系统参数配置'\] \}/g;
const newStr = "{ name: '系统管理', children: ['全宗配置', '用户管理', '角色权限', '元数据配置', '鉴定流程配置', '系统参数配置', '日志管理'] }";

for (const file of files) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.match(regex)) {
        content = content.replace(regex, newStr);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    } else {
        console.log('Not found in', file);
    }
}
