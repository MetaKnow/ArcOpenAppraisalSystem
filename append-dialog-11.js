const fs = require('fs');
const content = `\n## 2026-05-01 13:00:00\n\`e:\\TraeProjects\\开放鉴定系统\\ArcOpenAppraisalSystem\\appraisal-detail.html\` 去掉页面右上角的开放或控制印章，改为下拉选择形式：“经人工审核后，确定AI鉴定结果正确，决定开放/受控（与右下角AI鉴定后建议一致，开放/受控二字放大醒目）”，或者“经人工审核后，确定AI鉴定结果有误，决定开放/受控（与右下角AI鉴定后建议相反，开放/受控二字放大醒目）”。\n鉴定任务数据中，人工复核结果为待复核的数据， 右上角应当显示“经人工审核后，确定AI鉴定结果”，后面跟着下拉选项（如果AI鉴定建议为开放，选项为“正确，决定开放”或“有误，决定受控”；如果AI鉴定建议为受控，选项为“正确，决定受控”或“有误，决定开放”）\n`;
fs.appendFileSync('e:/TraeProjects/开放鉴定系统/docs/dialogs/dialogs.md', content, 'utf8');
console.log('Appended dialogs.md');