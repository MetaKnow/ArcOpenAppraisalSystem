const fs = require('fs');
const content = `\n## 2026-05-01 11:45:00\n\`e:\\TraeProjects\\开放鉴定系统\\ArcOpenAppraisalSystem\\appraisal-detail.html\` 审核记录页面只需要写一句话注明即可：此处显示错检、漏检（人工标注）、人工审核结果的记录。需要记录“审核人、审核时间、审核行为（标注漏检、标注错检、确定结果）”。并给我生成几条示例数据\n`;
fs.appendFileSync('e:/TraeProjects/开放鉴定系统/docs/dialogs/dialogs.md', content, 'utf8');
console.log('Appended dialogs.md');