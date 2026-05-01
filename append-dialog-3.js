const fs = require('fs');
const content = `\n## 2026-05-01 11:00:00\n点击错检漏检没反应。需要在 appraisal-detail.html 详情页右侧实现一级标签（智能鉴定、错检漏检、审核记录）的切换逻辑。点击“错检漏检”时展示当前文档的漏检记录。另外，将人工标注新生成的漏检记录直接存入并展示在这个标签内，而不是在智能鉴定的全文语义命中内。\n`;
fs.appendFileSync('e:/TraeProjects/开放鉴定系统/docs/dialogs/dialogs.md', content, 'utf8');
console.log('Appended dialogs.md');