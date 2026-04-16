const fs = require('fs');
const path = require('path');

const dir = '/Users/wenxiaojun/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const correctDirective = `        // Ensure ng-right-click is registered
        if (!app._invokeQueue.some(function(item) { return item[1] === 'directive' && item[2][0] === 'ngRightClick'; })) {
            app.directive('ngRightClick', ['$parse', function($parse) {
                return function(scope, element, attrs) {
                    var fn = $parse(attrs.ngRightClick);
                    element.bind('contextmenu', function(event) {
                        scope.$apply(function() {
                            event.preventDefault();
                            fn(scope, {$event: event});
                        });
                    });
                };
            }]);
        }`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Replace everything from "// Ensure ng-right-click" to the end of the block
    const regex = /[ \t]*\/\/[ \t]*Ensure ng-right-click is registered[\s\S]*?(?:if \(!app\._invokeQueue\.some\(function\(item\) \{ return item\[1\] === 'directive' && item\[2\]\[0\] === 'ngRightClick'; \}\)\) \{)[\s\S]*?(?:app\.directive\('ngRightClick'[\s\S]*?\}\]\);\s*\})?/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, correctDirective);
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log('Fixed directive in ' + file);
    }
});