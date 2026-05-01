const fs = require('fs');
const content = `\n## 2026-05-01 10:45:00\n\`e:\\TraeProjects\\开放鉴定系统\\ArcOpenAppraisalSystem\\appraisal-detail.html\` 接下来实现人工标注功能。人工标注其实就是对漏检的内容进行人工处理。未复制文件内容时，请把该按钮置灰；复制文字时，按钮可点击。点击按钮后，弹出选择敏感内容窗口（从敏感内容管理模块取），单选某项敏感内容后，点击加入漏检按钮，即可在错检漏检标签内生成一条漏检记录。并在错检漏检模块也生成一条记录。\n`;
fs.appendFileSync('e:/TraeProjects/开放鉴定系统/docs/dialogs/dialogs.md', content, 'utf8');
console.log('Appended dialogs.md');