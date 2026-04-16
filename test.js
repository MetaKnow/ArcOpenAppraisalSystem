var urlMap = {
    '工作台': 'index.html',
    '敏感类型管理': 'sensitive-type.html',
    '敏感内容管理': 'sensitive-content.html',
    '通用敏感词库': 'general-sensitive-word.html',
    '全宗配置': 'fonds-config.html',
    '全宗敏感词库': 'fonds-sensitive-word.html',
    '错检漏检库': 'error-omission-db.html',
    '鉴定任务管理': 'appraisal-task.html',
    '新建任务': 'appraisal-task-create.html',
    '查看任务': 'appraisal-task-view.html',
    '元数据配置': 'metadata-config.html'
};
var sortedKeys = Object.keys(urlMap).sort(function(a, b) {
    return urlMap[b].length - urlMap[a].length;
});
console.log(sortedKeys.map(k => urlMap[k]));
