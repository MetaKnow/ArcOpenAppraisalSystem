const fs = require('fs');
const content = `\n## 2026-05-01 12:45:00\n\`e:\\TraeProjects\\开放鉴定系统\\ArcOpenAppraisalSystem\\appraisal-detail.html\` AI鉴定后建议开放的数据，错检漏检中不需要显示错检信息\n`;
fs.appendFileSync('e:/TraeProjects/开放鉴定系统/docs/dialogs/dialogs.md', content, 'utf8');
console.log('Appended dialogs.md');