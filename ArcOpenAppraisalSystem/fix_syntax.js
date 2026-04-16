const fs = require('fs');
const path = require('path');

const dir = '/Users/wenxiaojun/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    const badCode = `            app.directive('ngRightClick', ['$parse', function($parse) {
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
    
    if (content.includes(badCode)) {
        content = content.replace(badCode, '');
        fs.writeFileSync(path.join(dir, file), content, 'utf8');
        console.log('Fixed ' + file);
    }
});