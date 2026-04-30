const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'ArcOpenAppraisalSystem', 'log-management.html');
let content = fs.readFileSync(path.join(__dirname, 'ArcOpenAppraisalSystem', 'user-management.html'), 'utf8');

// Replace Title
content = content.replace('<title>MS-OAAS档案开放鉴定系统 - 用户管理</title>', '<title>MS-OAAS档案开放鉴定系统 - 日志管理</title>');

// Replace Component Tag
content = content.replace('<user-manage class="flex-1 flex flex-col min-w-0 w-full"></user-manage>', '<log-manage class="flex-1 flex flex-col min-w-0 w-full"></log-manage>');

// Replace NAVIGATE broadcast
content = content.replace("$rootScope.$broadcast('NAVIGATE', '用户管理', '系统管理');", "$rootScope.$broadcast('NAVIGATE', '日志管理', '系统管理');");

// Replace component definition
const componentRegex = /app\.component\('userManage', \{[\s\S]*\}\]\s*\}\);/;

const logManageComponent = `app.component('logManage', {
            template: \`
                <div class="bg-white rounded-lg shadow-sm border border-slate-100 flex-1 p-5 flex flex-col h-full">
                    <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                        <h2 class="text-lg font-bold text-slate-800">日志管理</h2>
                        <div class="flex items-center space-x-3">
                            <button ng-click="$ctrl.batchExport()" class="bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-md text-sm transition-colors flex items-center">
                                <i data-lucide="download" class="w-4 h-4 mr-1"></i> 导出日志
                            </button>
                            <button ng-click="$ctrl.clearLogs()" class="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-md text-sm transition-colors flex items-center">
                                <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> 清空日志
                            </button>
                        </div>
                    </div>
                    
                    <!-- 筛选区域 -->
                    <div class="mb-4 flex space-x-4 bg-slate-50 p-3 rounded-md border border-slate-100">
                        <div class="flex-1 max-w-xs">
                            <input type="text" ng-model="$ctrl.filter.operator" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm" placeholder="按操作人筛选">
                        </div>
                        <div class="flex-1 max-w-xs">
                            <select ng-model="$ctrl.filter.module" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                                <option value="">全部模块</option>
                                <option value="系统登录">系统登录</option>
                                <option value="用户管理">用户管理</option>
                                <option value="鉴定任务">鉴定任务</option>
                                <option value="全宗配置">全宗配置</option>
                            </select>
                        </div>
                        <div class="flex-1 max-w-xs">
                            <input type="date" ng-model="$ctrl.filter.date" class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm">
                        </div>
                        <button ng-click="$ctrl.applyFilter()" class="bg-primary hover:bg-sky-800 text-white px-4 py-2 rounded-md text-sm transition-colors">查询</button>
                        <button ng-click="$ctrl.resetFilter()" class="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md text-sm transition-colors">重置</button>
                    </div>

                    <div class="overflow-x-auto flex-1">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                    <th class="px-4 py-3 font-medium w-16">序号</th>
                                    <th class="px-4 py-3 font-medium">操作模块</th>
                                    <th class="px-4 py-3 font-medium">操作类型</th>
                                    <th class="px-4 py-3 font-medium">操作内容</th>
                                    <th class="px-4 py-3 font-medium">操作人</th>
                                    <th class="px-4 py-3 font-medium">IP地址</th>
                                    <th class="px-4 py-3 font-medium">操作时间</th>
                                    <th class="px-4 py-3 font-medium">状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr ng-repeat="item in $ctrl.displayedList" class="border-b border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                                    <td class="px-4 py-3 text-slate-500">{{$index + 1}}</td>
                                    <td class="px-4 py-3 text-slate-800 font-medium">{{item.module}}</td>
                                    <td class="px-4 py-3 text-slate-800">{{item.actionType}}</td>
                                    <td class="px-4 py-3 text-slate-600 max-w-xs truncate" title="{{item.content}}">{{item.content}}</td>
                                    <td class="px-4 py-3 text-slate-800">{{item.operator}}</td>
                                    <td class="px-4 py-3 text-slate-500">{{item.ip}}</td>
                                    <td class="px-4 py-3 text-slate-500">{{item.time}}</td>
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 rounded-full text-xs" 
                                              ng-class="{'bg-emerald-100 text-emerald-700': item.status === '成功', 'bg-red-100 text-red-700': item.status === '失败'}">
                                            {{item.status}}
                                        </span>
                                    </td>
                                </tr>
                                <tr ng-if="$ctrl.displayedList.length === 0">
                                    <td colspan="8" class="px-4 py-8 text-center text-slate-500">暂无数据</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- 分页 -->
                    <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div class="text-sm text-slate-500">
                            共 <span class="font-medium text-slate-700">{{$ctrl.totalItems}}</span> 条记录
                        </div>
                        <div class="flex space-x-1">
                            <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50">上一页</button>
                            <button class="px-3 py-1 border border-primary bg-primary text-white rounded text-sm">1</button>
                            <button class="px-3 py-1 border border-slate-300 rounded text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50">下一页</button>
                        </div>
                    </div>
                </div>
            \`,
            controller: ['$timeout', function($timeout) {
                var ctrl = this;
                
                ctrl.filter = { operator: '', module: '', date: '' };
                
                // Mock data
                var mockData = [
                    { id: 1, module: '系统登录', actionType: '登录', content: '用户 admin 登录系统', operator: 'admin', ip: '192.168.1.100', time: '2026-04-17 09:30:15', status: '成功' },
                    { id: 2, module: '用户管理', actionType: '新增', content: '新增用户 zhangsan', operator: 'admin', ip: '192.168.1.100', time: '2026-04-17 10:05:22', status: '成功' },
                    { id: 3, module: '鉴定任务', actionType: '修改', content: '修改任务 A全宗鉴定任务', operator: 'zhangsan', ip: '192.168.1.105', time: '2026-04-17 11:20:45', status: '成功' },
                    { id: 4, module: '系统登录', actionType: '登录', content: '用户 lisi 登录失败，密码错误', operator: 'lisi', ip: '192.168.1.110', time: '2026-04-17 13:15:10', status: '失败' },
                    { id: 5, module: '全宗配置', actionType: '删除', content: '删除全宗 C全宗', operator: 'admin', ip: '192.168.1.100', time: '2026-04-17 14:40:05', status: '成功' }
                ];
                
                ctrl.list = mockData;
                ctrl.displayedList = angular.copy(ctrl.list);
                ctrl.totalItems = ctrl.displayedList.length;
                
                ctrl.applyFilter = function() {
                    ctrl.displayedList = ctrl.list.filter(function(item) {
                        var matchOp = !ctrl.filter.operator || item.operator.indexOf(ctrl.filter.operator) !== -1;
                        var matchMod = !ctrl.filter.module || item.module === ctrl.filter.module;
                        var matchDate = !ctrl.filter.date || item.time.indexOf(ctrl.filter.date) !== -1;
                        return matchOp && matchMod && matchDate;
                    });
                    ctrl.totalItems = ctrl.displayedList.length;
                };
                
                ctrl.resetFilter = function() {
                    ctrl.filter = { operator: '', module: '', date: '' };
                    ctrl.displayedList = angular.copy(ctrl.list);
                    ctrl.totalItems = ctrl.displayedList.length;
                };
                
                ctrl.batchExport = function() {
                    alert('导出日志功能开发中');
                };
                
                ctrl.clearLogs = function() {
                    if (confirm('确定要清空所有日志吗？清空后不可恢复！')) {
                        ctrl.list = [];
                        ctrl.displayedList = [];
                        ctrl.totalItems = 0;
                        alert('日志已清空');
                    }
                };

                ctrl.$onInit = function() {
                    $timeout(function() {
                        if (window.lucide) { lucide.createIcons(); }
                    }, 0);
                };
            }]
        });`;

content = content.replace(componentRegex, logManageComponent);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Created log-management.html');
