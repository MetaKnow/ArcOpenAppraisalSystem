const fs = require('fs');

const file = 'e:/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem/appraisal-detail.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Update HTML Template for Audit Tab
const oldAuditTemplate = `            <!-- 审核记录列表 (占位) -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-32" ng-show="ctrl.activePrimaryTab === 'audit'">
                <div class="py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                    <i data-lucide="clock" class="w-10 h-10 text-slate-300 mb-2"></i>
                    <p class="text-sm">暂无审核记录</p>
                </div>
            </div>`;

const newAuditTemplate = `            <!-- 审核记录列表 -->
            <div class="flex-1 flex flex-col overflow-hidden" ng-show="ctrl.activePrimaryTab === 'audit'">
                <!-- 提示语句 -->
                <div class="px-4 py-3 bg-blue-50/50 border-b border-blue-100 text-xs text-blue-600 flex items-center shrink-0">
                    <i data-lucide="info" class="w-4 h-4 mr-2 shrink-0"></i>
                    <span>此处显示错检、漏检（人工标注）、人工审核结果的记录。</span>
                </div>
                
                <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-32">
                    <div ng-repeat="item in ctrl.auditRecords track by item.id" class="flex space-x-3">
                        <div class="flex flex-col items-center mt-1 shrink-0">
                            <div class="w-2 h-2 rounded-full bg-primary ring-4 ring-sky-50"></div>
                            <div class="w-px h-full bg-slate-200 mt-2" ng-if="!$last"></div>
                        </div>
                        <div class="flex-1 bg-white border border-slate-200 rounded-lg p-3 shadow-sm mb-4">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-sm font-medium text-slate-800">{{item.auditor}}</span>
                                <span class="text-xs text-slate-500">{{item.auditTime}}</span>
                            </div>
                            <div class="text-sm text-slate-600 flex items-center">
                                <span class="text-slate-400 mr-2 shrink-0">审核行为:</span>
                                <span class="px-2 py-0.5 rounded text-xs font-medium"
                                      ng-class="{
                                          'bg-amber-50 text-amber-700 border border-amber-200': item.action === '标注漏检',
                                          'bg-rose-50 text-rose-700 border border-rose-200': item.action === '标注错检',
                                          'bg-emerald-50 text-emerald-700 border border-emerald-200': item.action === '确定结果'
                                      }">
                                    {{item.action}}
                                </span>
                            </div>
                            <div class="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100" ng-if="item.detail">
                                {{item.detail}}
                            </div>
                        </div>
                    </div>

                    <div ng-if="ctrl.auditRecords.length === 0" class="py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                        <i data-lucide="clock" class="w-10 h-10 text-slate-300 mb-2"></i>
                        <p class="text-sm">暂无审核记录</p>
                    </div>
                </div>
            </div>`;

content = content.replace(oldAuditTemplate, newAuditTemplate);

// 2. Add Mock Data into the controller
const oldInitVars = `
            ctrl.activePrimaryTab = 'ai';
            ctrl.documentOmissions = [`;

const newInitVars = `
            ctrl.activePrimaryTab = 'ai';
            ctrl.auditRecords = [
                { id: 1, auditor: '张三 (馆内用户)', auditTime: '2026-05-01 09:30:00', action: '标注错检', detail: '将第2页的“经济预算目标”从受控修改为开放' },
                { id: 2, auditor: '李四 (形成/移交单位用户)', auditTime: '2026-05-01 10:15:00', action: '标注漏检', detail: '人工标注漏检内容：专项整治工作安排...' },
                { id: 3, auditor: '王五 (馆内用户)', auditTime: '2026-05-01 11:20:00', action: '确定结果', detail: '最终确认该档案开放状态为：控制' }
            ];
            ctrl.documentOmissions = [`;

content = content.replace(oldInitVars, newInitVars);

// 3. Add to audit list when omitting
content = content.replace(
    `                // 自动切换到错检漏检标签以展示新数据
                ctrl.activePrimaryTab = 'errorOmission';`,
    `                // 自动切换到错检漏检标签以展示新数据
                ctrl.activePrimaryTab = 'errorOmission';
                
                // 同时增加一条审核记录
                var currentUserName = '当前用户';
                try {
                    var userStr = localStorage.getItem('oaas_current_user');
                    if (userStr) {
                        currentUserName = JSON.parse(userStr).realName || currentUserName;
                    }
                } catch(e) {}
                
                ctrl.auditRecords.unshift({
                    id: Date.now() + 1,
                    auditor: currentUserName,
                    auditTime: createdAt,
                    action: '标注漏检',
                    detail: '人工标注漏检内容：' + ctrl.selectedText.substring(0, 50) + (ctrl.selectedText.length > 50 ? '...' : '')
                });`
);


fs.writeFileSync(file, content, 'utf8');
console.log('Audit Tab implementation complete');