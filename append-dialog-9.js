const fs = require('fs');
const content = `\n## 2026-05-01 12:30:00\n\`e:\\TraeProjects\\开放鉴定系统\\ArcOpenAppraisalSystem\\appraisal-detail.html\` AI鉴定后建议开放的数据，智能鉴定中不需要显示任何命中信息\n`;
fs.appendFileSync('e:/TraeProjects/开放鉴定系统/docs/dialogs/dialogs.md', content, 'utf8');
console.log('Appended dialogs.md');