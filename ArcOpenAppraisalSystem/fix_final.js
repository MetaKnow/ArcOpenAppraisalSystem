const fs = require('fs');
const path = require('path');

const dir = '/Users/wenxiaojun/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // Let's just replace the whole section from "// Ensure ng-right-click" to the next "app.component"
    const sectionRegex = /\/\/[ \t]*Ensure ng-right-click is registered[\s\S]*?(?=app\.component)/g;
    
    const correctDirective = `// Ensure ng-right-click is registered
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
        }

        `;
        
    let newContent = content.replace(sectionRegex, correctDirective);
    
    if (content !== newContent) {
        fs.writeFileSync(path.join(dir, file), newContent, 'utf8');
        console.log('Fixed ' + file);
    }
});