const fs = require('fs');

const file = 'e:/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem/error-omission-db.html';
let content = fs.readFileSync(file, 'utf8');

const idx = content.indexOf("app.component('sensitiveContentManage'");
if (idx !== -1) {
    const before = content.slice(0, idx);
    const newComponent = `app.component('errorOmissionManage', {
    template: \`
        <div class="bg-surface rounded-lg shadow-sm border border-slate-200 flex flex-col h-full">
            <!-- 头部：标题和切换 -->
            <div class="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <div class="flex space-x-6">
                    <div ng-click="$ctrl.switchTab('error')" 
                         ng-class="{'text-primary border-b-2 border-primary font-medium': $ctrl.activeTab === 'error', 'text-slate-500 cursor-pointer hover:text-slate-700': $ctrl.activeTab !== 'error'}"
                         class="pb-4 -mb-4 text-lg">
                        错检库
                    </div>
                    <div ng-click="$ctrl.switchTab('omission')" 
                         ng-class="{'text-primary border-b-2 border-primary font-medium': $ctrl.activeTab === 'omission', 'text-slate-500 cursor-pointer hover:text-slate-700': $ctrl.activeTab !== 'omission'}"
                         class="pb-4 -mb-4 text-lg">
                        漏检库
                    </div>
                </div>
                <div class="flex space-x-3">
                    <button class="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 flex items-center space-x-1 text-sm font-medium transition-colors"
                            ng-click="$ctrl.batchDelete()"
                            ng-disabled="!$ctrl.hasSelected()"
                            ng-class="{'opacity-50 cursor-not-allowed': !$ctrl.hasSelected()}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                        <span>批量删除</span>
                    </button>
                </div>
            </div>

            <!-- 列表区域 -->
            <div class="flex-1 overflow-auto p-6">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                            <th class="py-3 px-4 w-12 text-center">
                                <input type="checkbox" ng-model="$ctrl.selectAll" ng-change="$ctrl.toggleAll()" class="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary">
                            </th>
                            <th class="py-3 px-4 w-16 text-center font-medium">序号</th>
                            <th class="py-3 px-4 font-medium">任务名称</th>
                            <th class="py-3 px-4 font-medium" ng-if="$ctrl.activeTab === 'error'">错检内容</th>
                            <th class="py-3 px-4 font-medium" ng-if="$ctrl.activeTab === 'error'">错检类型</th>
                            <th class="py-3 px-4 font-medium" ng-if="$ctrl.activeTab === 'omission'">漏检内容</th>
                            <th class="py-3 px-4 font-medium" ng-if="$ctrl.activeTab === 'omission'">所属敏感内容</th>
                            <th class="py-3 px-4 font-medium w-48">创建时间</th>
                            <th class="py-3 px-4 font-medium w-24 text-center">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="item in $ctrl.list" class="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                            <td class="py-3 px-4 text-center">
                                <input type="checkbox" ng-model="item.selected" ng-change="$ctrl.updateSelectAll()" class="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary">
                            </td>
                            <td class="py-3 px-4 text-center text-slate-500">{{$index + 1}}</td>
                            <td class="py-3 px-4 text-slate-800">{{item.taskName}}</td>
                            
                            <td class="py-3 px-4 text-slate-800" ng-if="$ctrl.activeTab === 'error'">{{item.errorContent}}</td>
                            <td class="py-3 px-4 text-slate-800" ng-if="$ctrl.activeTab === 'error'">
                                <span class="px-2 py-1 rounded text-xs font-medium bg-rose-50 text-rose-600">{{item.errorType}}</span>
                            </td>

                            <td class="py-3 px-4 text-slate-800" ng-if="$ctrl.activeTab === 'omission'">{{item.omissionContent}}</td>
                            <td class="py-3 px-4 text-slate-800" ng-if="$ctrl.activeTab === 'omission'">{{item.belongingSensitiveContent}}</td>
                            
                            <td class="py-3 px-4 text-slate-500 text-sm">{{item.createdAt}}</td>
                            <td class="py-3 px-4 text-center">
                                <button ng-click="$ctrl.deleteItem(item)" class="text-rose-500 hover:text-rose-700 transition-colors p-1 rounded hover:bg-rose-50" title="删除">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </td>
                        </tr>
                        <tr ng-if="$ctrl.list.length === 0">
                            <td colspan="8" class="py-12 text-center text-slate-500">
                                <div class="flex flex-col items-center justify-center">
                                    <i data-lucide="inbox" class="w-12 h-12 text-slate-300 mb-3"></i>
                                    <p>暂无数据</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <!-- 分页区 -->
            <div class="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-b-lg">
                <div class="text-sm text-slate-500">
                    共 {{$ctrl.list.length}} 条记录
                </div>
                <div class="flex space-x-2">
                    <button class="px-3 py-1.5 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>上一页</button>
                    <button class="px-3 py-1.5 bg-primary border border-primary rounded text-sm text-white">1</button>
                    <button class="px-3 py-1.5 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled>下一页</button>
                </div>
            </div>
        </div>
    \`,
    controller: ['IconService', '$timeout', function(IconService, $timeout) {
        var ctrl = this;
        
        /** 
         * @description 当前激活的标签页
         * @type {string} 'error' 表示错检库, 'omission' 表示漏检库
         */
        ctrl.activeTab = 'error';
        
        /** 
         * @description 全选状态标识
         * @type {boolean}
         */
        ctrl.selectAll = false;
        
        /**
         * @description 错检库列表数据
         * @type {Array<Object>}
         */
        ctrl.errorList = [
            { id: 1, taskName: '2024年度馆藏档案开放鉴定', errorContent: '包含个人隐私信息', errorType: '错检为受控', createdAt: '2026-04-30 10:00:00', selected: false },
            { id: 2, taskName: '2024年度馆藏档案开放鉴定', errorContent: '涉及企业商业机密', errorType: '错检为受控', createdAt: '2026-04-30 11:30:00', selected: false },
            { id: 3, taskName: '市发改委2023年移交档案鉴定', errorContent: '公开会议纪要', errorType: '错检敏感类型及内容', createdAt: '2026-05-01 09:15:00', selected: false }
        ];

        /**
         * @description 漏检库列表数据
         * @type {Array<Object>}
         */
        ctrl.omissionList = [
            { id: 4, taskName: '2024年度馆藏档案开放鉴定', omissionContent: '王某某的家庭住址位于朝阳区...', belongingSensitiveContent: '个人隐私住址信息', createdAt: '2026-04-30 14:20:00', selected: false },
            { id: 5, taskName: '市发改委2023年移交档案鉴定', omissionContent: '2024年经济预算目标为...', belongingSensitiveContent: '未公开经济数据', createdAt: '2026-05-01 10:05:00', selected: false }
        ];
        
        /**
         * @description 当前显示的列表数据
         * @type {Array<Object>}
         */
        ctrl.list = ctrl.errorList;

        /**
         * @function $onInit
         * @description 组件初始化函数，刷新图标
         */
        ctrl.$onInit = function() {
            IconService.refresh();
        };

        /**
         * @function switchTab
         * @description 切换标签页（错检库/漏检库）
         * @param {string} tab - 标签页名称 ('error' | 'omission')
         */
        ctrl.switchTab = function(tab) {
            ctrl.activeTab = tab;
            ctrl.list = tab === 'error' ? ctrl.errorList : ctrl.omissionList;
            ctrl.updateSelectAll();
            IconService.refresh();
        };

        /**
         * @function toggleAll
         * @description 切换当前列表所有项的选中状态
         */
        ctrl.toggleAll = function() {
            ctrl.list.forEach(function(item) {
                item.selected = ctrl.selectAll;
            });
        };

        /**
         * @function updateSelectAll
         * @description 更新全选复选框的状态，当列表项选中状态改变时触发
         */
        ctrl.updateSelectAll = function() {
            if (ctrl.list.length === 0) {
                ctrl.selectAll = false;
                return;
            }
            ctrl.selectAll = ctrl.list.every(function(item) {
                return item.selected;
            });
        };

        /**
         * @function hasSelected
         * @description 检查当前列表中是否有选中的项
         * @returns {boolean} 是否有选中项
         */
        ctrl.hasSelected = function() {
            return ctrl.list.some(function(item) {
                return item.selected;
            });
        };

        /**
         * @function batchDelete
         * @description 批量删除当前列表中选中的项
         */
        ctrl.batchDelete = function() {
            var selectedCount = ctrl.list.filter(function(item) { return item.selected; }).length;
            if (selectedCount === 0) return;
            if (confirm('确定要删除选中的 ' + selectedCount + ' 项记录吗？')) {
                if (ctrl.activeTab === 'error') {
                    ctrl.errorList = ctrl.errorList.filter(function(item) { return !item.selected; });
                    ctrl.list = ctrl.errorList;
                } else {
                    ctrl.omissionList = ctrl.omissionList.filter(function(item) { return !item.selected; });
                    ctrl.list = ctrl.omissionList;
                }
                ctrl.selectAll = false;
                IconService.refresh();
            }
        };

        /**
         * @function deleteItem
         * @description 删除指定的单条记录
         * @param {Object} item - 要删除的记录对象
         */
        ctrl.deleteItem = function(item) {
            if (confirm('确定要删除该记录吗？')) {
                if (ctrl.activeTab === 'error') {
                    ctrl.errorList = ctrl.errorList.filter(function(i) { return i.id !== item.id; });
                    ctrl.list = ctrl.errorList;
                } else {
                    ctrl.omissionList = ctrl.omissionList.filter(function(i) { return i.id !== item.id; });
                    ctrl.list = ctrl.omissionList;
                }
                ctrl.updateSelectAll();
                IconService.refresh();
            }
        };
    }]
});
</script>
</body>
</html>`;
    
    fs.writeFileSync(file, before + newComponent, 'utf8');
    console.log('Replaced successfully');
} else {
    console.log('Not found');
}
