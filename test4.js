var fs = require('fs');
var content = fs.readFileSync('/Users/wenxiaojun/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem/appraisal-task-create.html', 'utf-8');

var match = content.match(/var urlMap = (\{[\s\S]*?\});/);
if (match) {
    eval('var urlMap = ' + match[1] + ';');
    var nameMap = {};
    for (var key in urlMap) { nameMap[urlMap[key]] = key; }

    var currentUrl = 'index.html';
    var href = 'file:///Users/wenxiaojun/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem/appraisal-task-create.html';
    var sortedKeys = Object.keys(urlMap).sort(function(a, b) {
        return urlMap[b].length - urlMap[a].length;
    });
    for (var i = 0; i < sortedKeys.length; i++) {
        var key = sortedKeys[i];
        if (href.indexOf(urlMap[key]) !== -1) {
            currentUrl = urlMap[key];
            break;
        }
    }
    var currentName = nameMap[currentUrl] || '工作台';
    console.log("currentUrl:", currentUrl);
    console.log("currentName:", currentName);
}