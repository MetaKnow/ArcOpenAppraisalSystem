const fs = require('fs');
const file = 'e:/TraeProjects/开放鉴定系统/ArcOpenAppraisalSystem/appraisal-detail.html';
let content = fs.readFileSync(file, 'utf8');

// Replace Primary Tabs
const oldPrimaryTabs = `            <!-- 一级标签页 -->
            <div class="px-4 border-b border-slate-200 bg-slate-50/50">
                <div class="flex space-x-6 text-sm font-medium text-slate-600">
                    <button class="text-primary border-b-2 border-primary py-2.5 px-1 focus:outline-none">智能鉴定</button>
                    <button class="hover:text-primary py-2.5 px-1 border-b-2 border-transparent focus:outline-none transition-colors">错检漏检</button>
                    <button class="hover:text-primary py-2.5 px-1 border-b-2 border-transparent focus:outline-none transition-colors">审核记录</button>
                </div>
            </div>`;

const newPrimaryTabs = `            <!-- 一级标签页 -->
            <div class="px-4 border-b border-slate-200 bg-slate-50/50">
                <div class="flex space-x-6 text-sm font-medium text-slate-600">
                    <button ng-click="ctrl.activePrimaryTab = 'ai'" ng-class="{'text-primary border-b-2 border-primary': ctrl.activePrimaryTab === 'ai', 'hover:text-primary border-b-2 border-transparent': ctrl.activePrimaryTab !== 'ai'}" class="py-2.5 px-1 focus:outline-none transition-colors">智能鉴定</button>
                    <button ng-click="ctrl.activePrimaryTab = 'errorOmission'" ng-class="{'text-primary border-b-2 border-primary': ctrl.activePrimaryTab === 'errorOmission', 'hover:text-primary border-b-2 border-transparent': ctrl.activePrimaryTab !== 'errorOmission'}" class="py-2.5 px-1 focus:outline-none transition-colors">错检漏检</button>
                    <button ng-click="ctrl.activePrimaryTab = 'audit'" ng-class="{'text-primary border-b-2 border-primary': ctrl.activePrimaryTab === 'audit', 'hover:text-primary border-b-2 border-transparent': ctrl.activePrimaryTab !== 'audit'}" class="py-2.5 px-1 focus:outline-none transition-colors">审核记录</button>
                </div>
            </div>`;

content = content.replace(oldPrimaryTabs, newPrimaryTabs);

// Add ng-if to secondary tabs
content = content.replace(
    `<!-- 二级标签页 -->
            <div class="px-4 border-b border-slate-200">`,
    `<!-- 二级标签页 -->
            <div class="px-4 border-b border-slate-200" ng-if="ctrl.activePrimaryTab === 'ai'">`
);

// Add ng-if to Result List
content = content.replace(
    `<!-- 鉴定结果列表 -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-32">`,
    `<!-- 鉴定结果列表 -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-32" ng-show="ctrl.activePrimaryTab === 'ai'">`
);

// Insert Error/Omission List and Audit List right after the ai result list
const newLists = `
            <!-- 错检漏检列表 -->
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
            </div>

            <!-- 审核记录列表 (占位) -->
            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-32" ng-show="ctrl.activePrimaryTab === 'audit'">
                <div class="py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                    <i data-lucide="clock" class="w-10 h-10 text-slate-300 mb-2"></i>
                    <p class="text-sm">暂无审核记录</p>
                </div>
            </div>
`;

content = content.replace(
    `            <!-- 底部固定 AI 建议条 -->`,
    newLists + `            <!-- 底部固定 AI 建议条 -->`
);


// Update JS logic to use activePrimaryTab and documentOmissions
const initVarsLogic = `
            ctrl.activePrimaryTab = 'ai';
            ctrl.documentOmissions = [];
`;
content = content.replace(`var ctrl = this;`, `var ctrl = this;` + initVarsLogic);

// Fix addToOmission function: remove pushing to semantic, push to documentOmissions instead
content = content.replace(
    `                // 1. 在当前页面的右侧结果列表中生成一条语义命中记录（模拟漏检生成结果）
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
                }`,
    `                // 1. 在当前页面的右侧错检漏检列表中生成一条漏检记录
                var newItem = {
                    id: Date.now(),
                    omissionContent: ctrl.selectedText,
                    belongingSensitiveContent: ctrl.selectedSensitiveContent.title,
                    createdAt: createdAt
                };
                ctrl.documentOmissions.unshift(newItem);
                // 自动切换到错检漏检标签以展示新数据
                ctrl.activePrimaryTab = 'errorOmission';
                `
);

fs.writeFileSync(file, content, 'utf8');
console.log('Tabs implementation complete');