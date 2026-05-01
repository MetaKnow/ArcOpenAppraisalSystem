const fs = require('fs');
const file = 'e:/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem/appraisal-detail.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace the Error/Omission List Template to support both error and omission types
const oldListTemplate = `            <!-- 错检漏检列表 -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-32" ng-show="ctrl.activePrimaryTab === 'errorOmission'">
                <div ng-repeat="item in ctrl.documentOmissions track by item.id"
                     class="border border-slate-200 rounded-lg p-4 bg-white shadow-sm relative overflow-hidden">
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                    <div class="flex items-start justify-between mb-2">
                        <div class="text-sm font-medium text-slate-800 leading-snug flex-1 pr-4 whitespace-pre-wrap">
                            {{item.omissionContent}}
                        </div>
                        <span class="bg-amber-100 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded">漏检</span>
                    </div>
                    <div class="space-y-2 text-xs mt-3 border-t border-slate-100 pt-2">
                        <div class="flex">
                            <span class="text-slate-400 shrink-0 w-24">所属敏感内容:</span>
                            <span class="text-slate-600 font-medium">{{item.belongingSensitiveContent}}</span>
                        </div>
                        <div class="flex">
                            <span class="text-slate-400 shrink-0 w-24">创建时间:</span>
                            <span class="text-slate-600">{{item.createdAt}}</span>
                        </div>
                    </div>
                </div>
                
                <div ng-if="ctrl.documentOmissions.length === 0" class="py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                    <i data-lucide="inbox" class="w-10 h-10 text-slate-300 mb-2"></i>
                    <p class="text-sm">暂无错检漏检记录</p>
                </div>
            </div>`;

const newListTemplate = `            <!-- 错检漏检列表 -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-32" ng-show="ctrl.activePrimaryTab === 'errorOmission'">
                <div ng-repeat="item in ctrl.documentOmissions track by item.id"
                     class="border border-slate-200 rounded-lg p-4 bg-white shadow-sm relative overflow-hidden group">
                    <div class="absolute left-0 top-0 bottom-0 w-1" ng-class="item.type === 'error' ? 'bg-rose-500' : 'bg-amber-500'"></div>
                    
                    <div class="flex items-start justify-between mb-2">
                        <div class="text-sm font-medium text-slate-800 leading-snug flex-1 pr-4 whitespace-pre-wrap">
                            {{item.type === 'error' ? item.errorContent : item.omissionContent}}
                        </div>
                        <span ng-if="item.type === 'error'" class="bg-rose-100 text-rose-800 text-xs font-bold px-1.5 py-0.5 rounded shrink-0">错检</span>
                        <span ng-if="item.type === 'omission'" class="bg-amber-100 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded shrink-0">漏检</span>
                    </div>
                    
                    <div class="space-y-2 text-xs mt-3 border-t border-slate-100 pt-2">
                        <!-- 错检专属字段 -->
                        <div class="flex" ng-if="item.type === 'error'">
                            <span class="text-slate-400 shrink-0 w-24">错检类型:</span>
                            <span class="text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{{item.errorType}}</span>
                        </div>
                        <div class="flex" ng-if="item.type === 'error'">
                            <span class="text-slate-400 shrink-0 w-24">错检描述:</span>
                            <span class="text-slate-600 leading-relaxed">{{item.errorDescription}}</span>
                        </div>
                        
                        <!-- 漏检专属字段 -->
                        <div class="flex" ng-if="item.type === 'omission'">
                            <span class="text-slate-400 shrink-0 w-24">所属敏感内容:</span>
                            <span class="text-slate-600 font-medium">{{item.belongingSensitiveContent}}</span>
                        </div>
                        
                        <!-- 公共字段 -->
                        <div class="flex">
                            <span class="text-slate-400 shrink-0 w-24">创建时间:</span>
                            <span class="text-slate-600">{{item.createdAt}}</span>
                        </div>
                    </div>
                </div>
                
                <div ng-if="ctrl.documentOmissions.length === 0" class="py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                    <i data-lucide="inbox" class="w-10 h-10 text-slate-300 mb-2"></i>
                    <p class="text-sm">暂无错检漏检记录</p>
                </div>
            </div>`;

content = content.replace(oldListTemplate, newListTemplate);


// 2. Add Mock Data into the controller
const oldInitVars = `
            ctrl.activePrimaryTab = 'ai';
            ctrl.documentOmissions = [];
`;

const newInitVars = `
            ctrl.activePrimaryTab = 'ai';
            ctrl.documentOmissions = [
                {
                    id: 1001,
                    type: 'error',
                    errorContent: '关于2025年全国档案工作',
                    errorType: '错检为受控',
                    errorDescription: '以上内容AI错检为干部人事类档案敏感内容，经人工审核后确认该内容不涉及敏感信息。',
                    createdAt: '2026-05-01 11:30:00'
                },
                {
                    id: 1002,
                    type: 'omission',
                    omissionContent: '专项整治工作安排...',
                    belongingSensitiveContent: '涉及未公开的专项整治行动方案及执行细节',
                    createdAt: '2026-05-01 11:35:00'
                }
            ];
`;

content = content.replace(oldInitVars, newInitVars);

// 3. Update addToOmission to include 'type: omission'
content = content.replace(
    `var newItem = {
                    id: Date.now(),
                    omissionContent: ctrl.selectedText,
                    belongingSensitiveContent: ctrl.selectedSensitiveContent.title,
                    createdAt: createdAt
                };`,
    `var newItem = {
                    id: Date.now(),
                    type: 'omission',
                    omissionContent: ctrl.selectedText,
                    belongingSensitiveContent: ctrl.selectedSensitiveContent.title,
                    createdAt: createdAt
                };`
);


fs.writeFileSync(file, content, 'utf8');
console.log('Mock data added');