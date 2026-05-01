const fs = require('fs');
const content = `\n## 2026-05-01 12:15:00\n\`e:\\TraeProjects\\开放鉴定系统\\ArcOpenAppraisalSystem\\appraisal-detail.html\` 右下角的AI鉴定后建议的开放或受控，应当与鉴定任务数据列表中的AI鉴定结果一致。\n`;
fs.appendFileSync('e:/TraeProjects/开放鉴定系统/docs/dialogs/dialogs.md', content, 'utf8');
console.log('Appended dialogs.md');