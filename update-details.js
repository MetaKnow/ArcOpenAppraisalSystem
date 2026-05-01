const fs = require('fs');

const file = 'e:/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem/error-omission-db.html';
let content = fs.readFileSync(file, 'utf8');

// The replacement should happen inside errorOmissionManage component template and controller.
// Add View Button
content = content.replace(
    `<button ng-click="$ctrl.deleteItem(item)" class="text-rose-500 hover:text-rose-700 transition-colors p-1 rounded hover:bg-rose-50" title="删除">`,
    `<button ng-click="$ctrl.viewItem(item)" class="text-sky-600 hover:text-sky-800 transition-colors p-1 rounded hover:bg-sky-50 mr-1" title="查看详情">
                                    <i data-lucide="eye" class="w-4 h-4"></i>
                                </button>
                                <button ng-click="$ctrl.deleteItem(item)" class="text-rose-500 hover:text-rose-700 transition-colors p-1 rounded hover:bg-rose-50" title="删除">`
);

// Add Modal in template
const modalTemplate = `
            <!-- 查看详情弹窗 -->
            <div ng-if="$ctrl.showViewModal" class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100]">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                    <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 class="text-lg font-bold text-slate-800">{{$ctrl.activeTab === 'error' ? '错检详情' : '漏检详情'}}</h3>
                        <button ng-click="$ctrl.closeViewModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">任务名称</label>
                                <div class="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 text-sm">{{$ctrl.currentItem.taskName}}</div>
                            </div>
                            
                            <div ng-if="$ctrl.activeTab === 'error'">
                                <label class="block text-sm font-medium text-slate-700 mb-1">错检内容</label>
                                <div class="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 text-sm whitespace-pre-wrap">{{$ctrl.currentItem.errorContent}}</div>
                            </div>
                            
                            <div ng-if="$ctrl.activeTab === 'error'">
                                <label class="block text-sm font-medium text-slate-700 mb-1">错检类型</label>
                                <div class="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 text-sm">
                                    <span class="px-2 py-1 rounded text-xs font-medium bg-rose-50 text-rose-600">{{$ctrl.currentItem.errorType}}</span>
                                </div>
                            </div>

                            <div ng-if="$ctrl.activeTab === 'error'">
                                <label class="block text-sm font-medium text-slate-700 mb-1">错检描述</label>
                                <div class="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 text-sm leading-relaxed">{{$ctrl.currentItem.errorDescription}}</div>
                            </div>

                            <div ng-if="$ctrl.activeTab === 'omission'">
                                <label class="block text-sm font-medium text-slate-700 mb-1">漏检内容</label>
                                <div class="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 text-sm whitespace-pre-wrap">{{$ctrl.currentItem.omissionContent}}</div>
                            </div>
                            
                            <div ng-if="$ctrl.activeTab === 'omission'">
                                <label class="block text-sm font-medium text-slate-700 mb-1">所属敏感内容</label>
                                <div class="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 text-sm">{{$ctrl.currentItem.belongingSensitiveContent}}</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">创建时间</label>
                                <div class="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 text-sm">{{$ctrl.currentItem.createdAt}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button ng-click="$ctrl.closeViewModal()" class="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium">关闭</button>
                    </div>
                </div>
            </div>
        </div>
    \`,
`;

content = content.replace(`        </div>\n    \`,`, modalTemplate);

// Update Controller Mock Data & Methods
const newCtrlCode = `
        /**
         * @description 错检库列表数据
         * @type {Array<Object>}
         */
        ctrl.errorList = [
            { id: 1, taskName: '2024年度馆藏档案开放鉴定', errorContent: '包含个人隐私信息', errorType: '错检为受控', errorDescription: '以上内容AI错检为个人信息类档案敏感内容，经人工审核后确认该内容不涉及敏感信息', createdAt: '2026-04-30 10:00:00', selected: false },
            { id: 2, taskName: '2024年度馆藏档案开放鉴定', errorContent: '涉及企业商业机密', errorType: '错检为受控', errorDescription: '以上内容AI错检为经济类档案敏感内容，经人工审核后确认该内容不涉及敏感信息', createdAt: '2026-04-30 11:30:00', selected: false },
            { id: 3, taskName: '市发改委2023年移交档案鉴定', errorContent: '公开会议纪要', errorType: '错检敏感类型及内容', errorDescription: '以上内容AI错检为干部人事类档案敏感内容，经人工审核后确认该内容符合经济类档案敏感内容', createdAt: '2026-05-01 09:15:00', selected: false }
        ];

        /**
         * @description 漏检库列表数据
         * @type {Array<Object>}
         */
        ctrl.omissionList = [
            { id: 4, taskName: '2024年度馆藏档案开放鉴定', omissionContent: '王某某的家庭住址位于朝阳区...', belongingSensitiveContent: '个人信息类档案敏感内容', createdAt: '2026-04-30 14:20:00', selected: false },
            { id: 5, taskName: '市发改委2023年移交档案鉴定', omissionContent: '2024年经济预算目标为...', belongingSensitiveContent: '经济类档案敏感内容', createdAt: '2026-05-01 10:05:00', selected: false }
        ];
        
        /**
         * @description 当前显示的列表数据
         * @type {Array<Object>}
         */
        ctrl.list = ctrl.errorList;

        /**
         * @description 模态框显示状态
         * @type {boolean}
         */
        ctrl.showViewModal = false;

        /**
         * @description 当前查看的数据项
         * @type {Object|null}
         */
        ctrl.currentItem = null;

        /**
         * @function viewItem
         * @description 查看指定记录的详情
         * @param {Object} item - 要查看的记录对象
         */
        ctrl.viewItem = function(item) {
            ctrl.currentItem = angular.copy(item);
            ctrl.showViewModal = true;
            $timeout(function() {
                IconService.refresh();
            }, 0);
        };

        /**
         * @function closeViewModal
         * @description 关闭查看详情模态框
         */
        ctrl.closeViewModal = function() {
            ctrl.showViewModal = false;
            ctrl.currentItem = null;
        };
`;

content = content.replace(/ctrl\.errorList\s*=\s*\[[\s\S]*?ctrl\.list\s*=\s*ctrl\.errorList;/, newCtrlCode.trim());

fs.writeFileSync(file, content, 'utf8');
console.log('Update Complete');
