const fs = require('fs');
const path = require('path');

const dir = '/Users/wenxiaojun/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newBreadcrumb = `        app.component('breadcrumb', {
            template: \`
                <div class="bg-white border-b border-slate-200 flex items-center text-sm font-medium relative" style="height: 40px; padding-left: 1rem; padding-right: 1rem; overflow-x: auto; white-space: nowrap; -ms-overflow-style: none; scrollbar-width: none;">
                    <style>
                        .custom-tab-scroll::-webkit-scrollbar { display: none; }
                    </style>
                    <div class="flex items-center h-full custom-tab-scroll w-full">
                        <div ng-repeat="tab in $ctrl.tabs" 
                             ng-click="$ctrl.goToTab(tab)"
                             ng-right-click="$ctrl.showContextMenu($event, tab)"
                             class="flex items-center h-full px-4 border-r border-slate-200 cursor-pointer transition-colors relative group flex-shrink-0"
                             ng-class="{'bg-sky-50 text-primary border-t-2 border-t-primary': tab.active, 'text-slate-600 hover:bg-slate-50 border-t-2 border-t-transparent': !tab.active}">
                            <i ng-if="tab.name === '工作台'" data-lucide="layout-grid" class="w-4 h-4 mr-2"></i>
                            <span class="select-none">{{tab.name}}</span>
                            <div ng-if="tab.name !== '工作台'" 
                                 ng-click="$ctrl.closeTab($event, tab)" 
                                 class="ml-2 w-4 h-4 rounded-full flex items-center justify-center hover:bg-slate-200 hover:text-red-500 transition-colors"
                                 ng-class="{'opacity-100': tab.active, 'opacity-0 group-hover:opacity-100': !tab.active}">
                                <i data-lucide="x" class="w-3 h-3"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Context Menu -->
                    <div ng-if="$ctrl.contextMenu.show" 
                         class="fixed z-[100] w-32 bg-white rounded-md shadow-lg border border-slate-200 py-1"
                         ng-style="{'left': $ctrl.contextMenu.x + 'px', 'top': $ctrl.contextMenu.y + 'px'}">
                        <div ng-click="$ctrl.closeAllTabs()" class="px-4 py-2 hover:bg-slate-50 cursor-pointer text-slate-700 text-sm">全部关闭</div>
                        <div ng-click="$ctrl.closeOtherTabs()" class="px-4 py-2 hover:bg-slate-50 cursor-pointer text-slate-700 text-sm">关闭其他</div>
                    </div>
                </div>
            \`,
            controller: ['IconService', '$rootScope', '$scope', '$document', '$timeout', function(IconService, $rootScope, $scope, $document, $timeout) {
                var ctrl = this;
                
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
                    '修改任务': 'appraisal-task-edit.html',
                    '元数据配置': 'metadata-config.html'
                };
                
                var nameMap = {};
                for (var key in urlMap) { nameMap[urlMap[key]] = key; }
                
                ctrl.contextMenu = { show: false, x: 0, y: 0, targetTab: null };
                
                var currentUrl = 'index.html';
                var href = window.location.href;
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
                
                var storedTabs = localStorage.getItem('oaas_opened_tabs');
                if (storedTabs) {
                    try {
                        ctrl.tabs = JSON.parse(storedTabs);
                    } catch(e) {
                        ctrl.tabs = [{ name: '工作台', url: 'index.html', active: false }];
                    }
                } else {
                    ctrl.tabs = [{ name: '工作台', url: 'index.html', active: false }];
                }
                
                if (!ctrl.tabs.find(function(t) { return t.name === '工作台'; })) {
                    ctrl.tabs.unshift({ name: '工作台', url: 'index.html', active: false });
                }
                
                var existingTab = ctrl.tabs.find(function(t) { return t.name === currentName; });
                if (!existingTab && currentName) {
                    ctrl.tabs.push({ name: currentName, url: currentUrl, active: true });
                }
                
                ctrl.tabs.forEach(function(t) {
                    t.active = (t.name === currentName);
                });
                
                ctrl.saveTabs = function() {
                    localStorage.setItem('oaas_opened_tabs', JSON.stringify(ctrl.tabs));
                };
                
                ctrl.saveTabs();
                
                ctrl.goToTab = function(tab) {
                    if (tab.name !== currentName) {
                        window.location.href = tab.url;
                    }
                };
                
                ctrl.closeTab = function(e, tab) {
                    if (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    if (tab.name === '工作台') return;
                    
                    var index = ctrl.tabs.indexOf(tab);
                    if (index > -1) {
                        ctrl.tabs.splice(index, 1);
                        ctrl.saveTabs();
                        
                        if (tab.active) {
                            var nextTab = ctrl.tabs[index] || ctrl.tabs[index - 1] || ctrl.tabs[0];
                            window.location.href = nextTab.url;
                        }
                    }
                    ctrl.contextMenu.show = false;
                };
                
                ctrl.showContextMenu = function(e, tab) {
                    e.preventDefault();
                    ctrl.contextMenu.show = true;
                    ctrl.contextMenu.x = e.clientX;
                    ctrl.contextMenu.y = e.clientY;
                    ctrl.contextMenu.targetTab = tab;
                };
                
                ctrl.closeAllTabs = function() {
                    ctrl.tabs = [{ name: '工作台', url: 'index.html', active: currentName === '工作台' }];
                    ctrl.saveTabs();
                    ctrl.contextMenu.show = false;
                    if (currentName !== '工作台') {
                        window.location.href = 'index.html';
                    }
                };
                
                ctrl.closeOtherTabs = function() {
                    var target = ctrl.contextMenu.targetTab;
                    if (!target) return;
                    
                    ctrl.tabs = [{ name: '工作台', url: 'index.html', active: currentName === '工作台' }];
                    if (target.name !== '工作台') {
                        ctrl.tabs.push(target);
                    }
                    ctrl.saveTabs();
                    ctrl.contextMenu.show = false;
                    
                    if (currentName !== target.name && currentName !== '工作台') {
                        window.location.href = target.url;
                    } else if (currentName === target.name) {
                        // Keep current tab active
                    }
                };
                
                var closeMenuHandler = function(e) {
                    if (ctrl.contextMenu.show) {
                        $scope.$apply(function() {
                            ctrl.contextMenu.show = false;
                        });
                    }
                };
                
                $document.on('click', closeMenuHandler);
                $scope.$on('$destroy', function() {
                    $document.off('click', closeMenuHandler);
                });
                
                ctrl.$onInit = function() {
                    $timeout(function() { IconService.refresh(); }, 0);
                };
            }]
        });

        // Ensure ng-right-click is registered
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
    
    // Find where breadcrumb starts
    const startRegex = /^[ \t]*app\.component\('breadcrumb',[ \t]*\{/m;
    const match = startRegex.exec(content);
    if (match) {
        const startIndex = match.index;
        
        // Find the matching end. It ends with '        });' before another app.component or </script>
        let endIndex = -1;
        const nextComponentRegex = /^[ \t]*(app\.component|app\.directive|app\.controller|<\/script>)/mg;
        nextComponentRegex.lastIndex = startIndex + 10;
        const endMatch = nextComponentRegex.exec(content);
        if (endMatch) {
            endIndex = endMatch.index;
        }
        
        if (endIndex !== -1) {
            const before = content.substring(0, startIndex);
            const after = content.substring(endIndex);
            
            const newContent = before + newBreadcrumb + '\n\n' + after;
            fs.writeFileSync(path.join(dir, file), newContent, 'utf8');
            console.log('Updated ' + file);
        } else {
            console.log('Could not find end of breadcrumb in ' + file);
        }
    } else {
        console.log('Could not find breadcrumb component in ' + file);
    }
});
