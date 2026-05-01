const fs = require('fs');
const content = `\n## 2026-05-01 12:00:00\n\`e:\\TraeProjects\\开放鉴定系统\\ArcOpenAppraisalSystem\\appraisal-detail.html\` 请把页面右上角的关闭按钮去掉\n`;
fs.appendFileSync('e:/TraeProjects/开放鉴定系统/docs/dialogs/dialogs.md', content, 'utf8');
console.log('Appended dialogs.md');