const fs = require('fs');
const content = `\n## 2026-05-01 11:30:00\n\`e:\\TraeProjects\\开放鉴定系统\\ArcOpenAppraisalSystem\\appraisal-detail.html\` 请给错检漏检标签生成示例数据\n`;
fs.appendFileSync('e:/TraeProjects/开放鉴定系统/docs/dialogs/dialogs.md', content, 'utf8');
console.log('Appended dialogs.md');