const fs = require('fs');

const file = 'e:/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem/appraisal-detail.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add id and disabled logic to the "人工标注" button in the template
const oldButton = `<button class="flex items-center justify-center space-x-1 px-2 py-0.5 rounded hover:bg-slate-100 text-slate-600 hover:text-primary focus:outline-none transition-colors" title="人工标注">
                        <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
                        <span class="text-xs font-medium">人工标注</span>
                    </button>`;
const newButton = `<button ng-click="ctrl.openAnnotationModal()" ng-disabled="!ctrl.hasSelection" ng-class="{'opacity-50 cursor-not-allowed': !ctrl.hasSelection, 'hover:bg-slate-100 hover:text-primary text-slate-600': ctrl.hasSelection}" class="flex items-center justify-center space-x-1 px-2 py-0.5 rounded focus:outline-none transition-colors" title="人工标注">
                        <i data-lucide="pen-tool" class="w-3.5 h-3.5"></i>
                        <span class="text-xs font-medium">人工标注</span>
                    </button>`;

content = content.replace(oldButton, newButton);

// 2. Add Modal template to the end of main body
const modalTemplate = `
    <!-- 人工标注选择敏感内容弹窗 -->
    <div ng-if="ctrl.showAnnotationModal" class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100]">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                <h3 class="text-lg font-bold text-slate-800">人工标注 - 选择敏感内容</h3>
                <button ng-click="ctrl.closeAnnotationModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-slate-700 mb-1">选中的内容：</label>
                    <div class="p-3 bg-slate-50 rounded border border-slate-200 text-slate-800 text-sm whitespace-pre-wrap">{{ctrl.selectedText}}</div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">选择所属敏感内容：</label>
                    <div class="border border-slate-200 rounded-md overflow-hidden">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th class="px-4 py-2 w-10 text-center"></th>
                                    <th class="px-4 py-2 font-medium text-slate-600">敏感内容标题</th>
                                    <th class="px-4 py-2 font-medium text-slate-600">敏感类型</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr ng-repeat="item in ctrl.sensitiveContents track by item.id" class="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors" ng-click="ctrl.selectedSensitiveContent = item">
                                    <td class="px-4 py-2 text-center">
                                        <input type="radio" ng-model="ctrl.selectedSensitiveContent" ng-value="item" class="w-4 h-4 text-primary focus:ring-primary border-slate-300">
                                    </td>
                                    <td class="px-4 py-2 text-slate-800">{{item.title}}</td>
                                    <td class="px-4 py-2 text-slate-600">
                                        <span class="px-2 py-0.5 bg-slate-100 rounded text-xs">{{item.type.name}}</span>
                                    </td>
                                </tr>
                                <tr ng-if="ctrl.sensitiveContents.length === 0">
                                    <td colspan="3" class="px-4 py-8 text-center text-slate-500">暂无敏感内容数据</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3 shrink-0">
                <button ng-click="ctrl.closeAnnotationModal()" class="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">取消</button>
                <button ng-click="ctrl.addToOmission()" ng-disabled="!ctrl.selectedSensitiveContent" ng-class="{'opacity-50 cursor-not-allowed': !ctrl.selectedSensitiveContent}" class="px-4 py-2 bg-primary border border-primary rounded text-white hover:bg-sky-800 transition-colors text-sm font-medium">加入漏检</button>
            </div>
        </div>
    </div>
    </main>`;

content = content.replace('</main>', modalTemplate);

// 3. Add logic to the controller
const controllerLogic = `
            // 人工标注相关状态
            ctrl.hasSelection = false;
            ctrl.selectedText = '';
            ctrl.showAnnotationModal = false;
            ctrl.sensitiveContents = [];
            ctrl.selectedSensitiveContent = null;

            // 监听全局选区变化
            document.addEventListener('selectionchange', function() {
                var selection = window.getSelection();
                var text = selection.toString().trim();
                
                // 由于 AngularJS 的机制，需要使用 $timeout 或 $scope.$apply 来通知视图更新
                if (window.angular) {
                    var scope = angular.element(document.querySelector('[ng-controller="DetailController as ctrl"]')).scope();
                    if (scope) {
                        scope.$applyAsync(function() {
                            ctrl.selectedText = text;
                            ctrl.hasSelection = text.length > 0;
                        });
                    }
                }
            });

            // 也可以监听 iframe 内部的选区变化 (如果可能的话，跨域受限)
            ctrl.initIframeSelection = function() {
                var iframe = document.querySelector('iframe');
                if (iframe) {
                    iframe.addEventListener('load', function() {
                        try {
                            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            iframeDoc.addEventListener('selectionchange', function() {
                                var selection = iframe.contentWindow.getSelection();
                                var text = selection.toString().trim();
                                
                                var scope = angular.element(document.querySelector('[ng-controller="DetailController as ctrl"]')).scope();
                                if (scope) {
                                    scope.$applyAsync(function() {
                                        ctrl.selectedText = text;
                                        ctrl.hasSelection = text.length > 0;
                                    });
                                }
                            });
                        } catch(e) {
                            // 跨域限制，静默失败
                        }
                    });
                }
            };

            ctrl.openAnnotationModal = function() {
                if (!ctrl.hasSelection) return;
                
                // 加载敏感内容数据
                try {
                    var storedData = localStorage.getItem('oaas_sensitive_contents_v2');
                    if (storedData) {
                        ctrl.sensitiveContents = JSON.parse(storedData);
                    }
                } catch(e) {
                    console.error('Failed to load sensitive contents', e);
                }
                
                ctrl.selectedSensitiveContent = null;
                ctrl.showAnnotationModal = true;
                
                $timeout(function() {
                    IconService.refresh();
                });
            };

            ctrl.closeAnnotationModal = function() {
                ctrl.showAnnotationModal = false;
                ctrl.selectedSensitiveContent = null;
            };

            ctrl.addToOmission = function() {
                if (!ctrl.selectedSensitiveContent || !ctrl.selectedText) return;
                
                var d = new Date();
                var pad = function(n) { return n < 10 ? '0' + n : n; };
                var createdAt = d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
                
                // 1. 在当前页面的右侧结果列表中生成一条语义命中记录（模拟漏检生成结果）
                var newItem = {
                    id: 'semantic-omission-' + Date.now(),
                    title: ctrl.selectedText.substring(0, 100) + (ctrl.selectedText.length > 100 ? '...' : ''),
                    pageTag: '人工',
                    description: '经人工标注，该内容涉及' + ctrl.selectedSensitiveContent.title + '，属于漏检内容。',
                    rules: [
                        ctrl.selectedSensitiveContent.type.name + '敏感内容-' + ctrl.selectedSensitiveContent.title
                    ]
                };
                
                ctrl.resultGroups.semantic.unshift(newItem);
                ctrl.resultCounts.semantic = ctrl.resultGroups.semantic.length;
                ctrl.resultCounts.all = ctrl.resultCounts.catalog + ctrl.resultCounts.fullText + ctrl.resultCounts.semantic;
                
                if (ctrl.activeResultTab === 'semantic' || ctrl.activeResultTab === 'all') {
                    ctrl.updateDisplayedResults();
                }

                // 2. 将漏检记录写入 localStorage，以便错检漏检模块读取
                try {
                    var omissions = JSON.parse(localStorage.getItem('oaas_omission_list')) || [];
                    
                    var newOmissionRecord = {
                        id: Date.now(),
                        taskName: ctrl.document.title,
                        omissionContent: ctrl.selectedText,
                        belongingSensitiveContent: ctrl.selectedSensitiveContent.title,
                        createdAt: createdAt,
                        selected: false
                    };
                    
                    omissions.unshift(newOmissionRecord);
                    localStorage.setItem('oaas_omission_list', JSON.stringify(omissions));
                    
                    alert('成功加入漏检库！');
                } catch(e) {
                    console.error('Failed to save omission record', e);
                    alert('保存漏检记录失败');
                }

                ctrl.closeAnnotationModal();
                
                // 清除选区
                if (window.getSelection) {
                    if (window.getSelection().empty) {
                        window.getSelection().empty();
                    } else if (window.getSelection().removeAllRanges) {
                        window.getSelection().removeAllRanges();
                    }
                }
                
                $timeout(function() {
                    IconService.refresh();
                });
            };

            ctrl.$onInit`;

content = content.replace('ctrl.$onInit', controllerLogic);

fs.writeFileSync(file, content, 'utf8');
console.log('Done');