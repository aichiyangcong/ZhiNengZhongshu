import {
  agents,
  appMeta,
  automationTasks,
  channels,
  connectors,
  conversationPanels,
  conversations,
  navigationGroups,
  pages,
  recentChats,
  sharedPanels,
  skillMarket,
} from './data.js';

const navLabelMap = [...navigationGroups.main, ...(navigationGroups.tools || [])].reduce((acc, item) => {
  acc[item.id] = item.label;
  return acc;
}, {});

const state = {
  tabs: [{ id: 'home', type: 'home', label: '今日工作台', closable: false, agentId: 'home' }],
  activeTabId: 'home',
  expandedAgentId: 'home',
  panelTab: pages.home.defaultPanel,
  activeConversationId: null,
  automationDetailId: null,
  automationFilterAgentId: null,
  automationFilterKind: null,
  isCreateAgentModalOpen: false,
  createAgentDraft: {
    name: '',
    desc: '',
    icon: '🧠',
    skills: [],
    connectors: [],
    channels: [],
  },
  agents: [...agents],
  skillMarket: structuredClone(skillMarket),
  connectors: structuredClone(connectors),
  channels: structuredClone(channels),
  dynamicPanels: {
    tasks: [],
    alerts: [],
    reports: [],
  },
};

function activeTab() {
  return state.tabs.find((tab) => tab.id === state.activeTabId) || state.tabs[0];
}

function activeAgentId() {
  const tab = activeTab();
  return tab?.agentId || 'home';
}

function isConversationTab(tab = activeTab()) {
  return ['home', 'agent', 'history'].includes(tab?.type);
}

function isManagementTab(tab = activeTab()) {
  return ['config', 'automation'].includes(tab?.type);
}

function openTab(id, type, label, extra = {}) {
  const existing = state.tabs.find((tab) => tab.id === id);
  if (existing) {
    Object.assign(existing, { type, label, ...extra });
  } else {
    state.tabs.push({ id, type, label, closable: id !== 'home', ...extra });
  }
  state.activeTabId = id;
  syncLeftNav(id);
}

function closeTab(id) {
  if (id === 'home') return;
  const index = state.tabs.findIndex((tab) => tab.id === id);
  if (index < 0) return;
  state.tabs.splice(index, 1);
  const fallback = state.tabs[Math.max(0, index - 1)] || state.tabs[0];
  state.activeTabId = fallback.id;
  syncLeftNav(fallback.id);
}

function syncLeftNav(tabId) {
  const tab = state.tabs.find((item) => item.id === tabId) || activeTab();
  if (!tab) return;
  state.activeConversationId = tab.conversationId || null;
  state.automationDetailId = tab.type === 'automation' ? state.automationDetailId : null;
  if (tab.type === 'config' || tab.type === 'automation') {
    state.expandedAgentId = null;
    state.panelTab = 'alerts';
    return;
  }
  state.expandedAgentId = tab.agentId || 'home';
  state.panelTab = pages[tab.agentId || 'home']?.defaultPanel || 'alerts';
}

function getAgentById(agentId) {
  if (agentId === 'home') {
    return {
      id: 'home',
      name: '今日工作台',
      icon: '🏠',
      desc: '主智能体，通用对话入口',
      skills: ['查昨日营收', '生成周报'],
      connectors: ['meituan'],
      channels: ['wecom'],
    };
  }
  return state.agents.find((agent) => agent.id === agentId);
}

function setConversationContext(agentId, conversationId) {
  const label = agentId === 'home' ? '今日工作台' : getAgentById(agentId).name;
  openTab(agentId, conversationId ? 'history' : agentId === 'home' ? 'home' : 'agent', label, {
    agentId,
    conversationId: conversationId || null,
  });
}

function openNewConversationTab(agentId) {
  const baseLabel = agentId === 'home' ? '今日工作台' : (getAgentById(agentId)?.name || agentId);
  const type = agentId === 'home' ? 'home' : 'agent';
  const id = `${agentId}-draft-${Date.now()}`;
  openTab(id, type, `${baseLabel} · 新会话`, {
    agentId,
    conversationId: null,
    isDraft: true,
  });
}

const app = document.querySelector('#app');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const PRIMARY_REPORT_ACTIONS = new Set(['查看报告', '保存为报告']);
const PRIMARY_TASK_ACTIONS = new Set(['生成任务', '生成整改任务', '生成运营整改任务', '生成巡检任务', '加入巡检计划']);
const PRIMARY_ACTIONS = new Set(['查看报告', '生成任务']);
const STATUS_ACTIONS = new Set(['标记处理中', '转派', '失效']);
const REVIEW_ACTIONS = new Set(['查看回看', '下载报告', '查看图表']);
const NAVIGATION_ACTIONS = new Set([
  '查看异常门店',
  '查看规则详情',
  '看利润缺口',
  '看风险门店',
  '看任务进度',
  '看定时推送',
  '展开看南京门店',
  '只看外卖渠道',
]);

function actionSemantic(label) {
  if (PRIMARY_REPORT_ACTIONS.has(label)) return 'primary-report';
  if (PRIMARY_TASK_ACTIONS.has(label)) return 'primary-task';
  if (STATUS_ACTIONS.has(label)) return 'status';
  if (REVIEW_ACTIONS.has(label)) {
    if (label === '查看回看') return 'review';
    if (label === '下载报告') return 'download';
    if (label === '查看图表') return 'chart';
  }
  if (NAVIGATION_ACTIONS.has(label)) return 'navigation';
  return null;
}

function uniqueLabels(labels) {
  return labels.filter((label, index) => labels.indexOf(label) === index);
}

function collectConversationActions(conversation) {
  const labels = [];
  if (!conversation) return labels;

  if (conversation.followUps?.length) {
    labels.push(...conversation.followUps);
  }
  for (const message of conversation.messages || []) {
    if (message.actions?.length) {
      labels.push(...message.actions);
    }
    for (const card of message.cards || []) {
      if (card.actions?.length) {
        labels.push(...card.actions);
      }
    }
  }
  for (const artifact of conversation.artifacts || []) {
    if (artifact.actions?.length) {
      labels.push(...artifact.actions);
    }
  }
  return uniqueLabels(labels);
}

function hasReportCapability(labels) {
  return labels.some(
    (label) =>
      actionSemantic(label) === 'primary-report'
      || label === '查看图表'
      || label === '下载报告'
      || label === '生成周报素材',
  );
}

function hasTaskCapability(labels) {
  return labels.some((label) => actionSemantic(label) === 'primary-task');
}

function mainActionsForConversation(conversation) {
  const labels = collectConversationActions(conversation);
  const next = [];
  if (hasReportCapability(labels)) {
    next.push('查看报告');
  }
  if (hasTaskCapability(labels)) {
    next.push('生成任务');
  }
  return next.slice(0, 2);
}

function navActionsForConversation(conversation) {
  const labels = collectConversationActions(conversation);
  return labels.filter((label) => actionSemantic(label) === 'navigation');
}

function filterConversationCardActions(actions = []) {
  return actions.filter((label) => !PRIMARY_ACTIONS.has(label) && !PRIMARY_REPORT_ACTIONS.has(label) && !PRIMARY_TASK_ACTIONS.has(label));
}


function actionTarget(label) {
  const map = {
    '为什么利润下降': { id: 'analysis', type: 'agent' },
    '查看异常门店': { id: 'risk', type: 'agent' },
    '生成整改任务': { id: 'tasks', type: 'agent' },
    '华东区昨天利润率为什么下降？': { id: 'analysis', type: 'agent' },
    '新店差评超过 3 条的有哪些？': { id: 'risk', type: 'agent' },
    '帮我建一个外卖订单下滑预警': { id: 'home', type: 'home' },
    '展开看南京门店': { id: 'analysis', type: 'agent' },
    '只看外卖渠道': { id: 'analysis', type: 'agent' },
    '生成运营整改任务': { id: 'tasks', type: 'agent' },
    '加入巡检计划': { id: 'tasks', type: 'agent' },
    '推送督导通知': { id: 'tasks', type: 'agent' },
    '查看规则详情': { id: 'automation', type: 'automation' },
    '看风险门店': { id: 'risk', type: 'agent' },
    '看任务进度': { id: 'tasks', type: 'agent' },
    '看利润缺口': { id: 'analysis', type: 'agent' },
    '看定时推送': { id: 'automation', type: 'automation' },
  };
  return map[label] || null;
}

function interactiveAttrs(label) {
  const target = actionTarget(label);
  return target ? `data-nav-id="${target.id}" data-nav-type="${target.type}"` : 'data-action="noop"';
}

function activeConversation() {
  return state.activeConversationId ? conversations[state.activeConversationId] : null;
}

function isGoalTrackingContext() {
  if (state.activeConversationId === 'conv-1') {
    return true;
  }
  if (state.activeConversationId) {
    return false;
  }
  return isConversationTab() && activeAgentId() === 'home' && pages.home.conversation?.title?.includes('3月目标追踪');
}

function isProfitAnalysisContext() {
  const active = activeConversation();
  if (active?.title?.includes('利润率下降归因拆解到门店和动作')) {
    return true;
  }
  if (state.activeConversationId) {
    return false;
  }
  return isConversationTab() && activeAgentId() === 'analysis' && pages.analysis.conversation?.title?.includes('利润率下降归因拆解到门店和动作');
}

function isRiskStoreContext() {
  const active = activeConversation();
  if (active?.title?.includes('哪家门店风险最高，先处理什么')) {
    return true;
  }
  if (state.activeConversationId) {
    return false;
  }
  return isConversationTab() && activeAgentId() === 'risk' && pages.risk.conversation?.title?.includes('哪家门店风险最高，先处理什么');
}

function isSingleStoreProfitContext() {
  return state.activeConversationId === 'conv-4';
}

function upsertDynamicPanelItem(tab, item) {
  const next = [...state.dynamicPanels[tab]];
  const index = next.findIndex((entry) => entry.title === item.title);
  const existed = index >= 0;
  if (index >= 0) {
    next[index] = { ...next[index], ...item };
  } else {
    next.unshift(item);
  }
  state.dynamicPanels[tab] = next;
  return existed;
}

function panelItemsForTab(tab) {
  const prev = state.panelTab;
  state.panelTab = tab;
  const items = panelItemsForCurrentContext();
  state.panelTab = prev;
  return items;
}

function reportItemsForCurrentContext() {
  return panelItemsForTab('reports');
}

function taskItemsForCurrentContext() {
  return panelItemsForTab('tasks');
}

function preferredReportTitleForContext() {
  if (isRiskStoreContext()) {
    return '📈 苏州园区店风险处置简报';
  }

  const byConversation = {
    'conv-1': '📈 3月目标追踪日报',
    'conv-2': '📈 活动效果分析专题',
    'conv-3': '📈 好差评率及分析报告',
    'conv-4': '📈 单店盈利提升方案',
    'conv-5': '📈 任务闭环周报素材',
    'conv-6': '📈 周营收+好差评综合报告',
    'conv-7': '📈 规则命中周报',
  };
  if (state.activeConversationId && byConversation[state.activeConversationId]) {
    return byConversation[state.activeConversationId];
  }

  const byAgent = {
    home: '📈 周营收分析',
    analysis: '📈 目标达成与缺口分析',
    risk: '📈 风险门店周报',
    tasks: '📈 任务闭环复盘',
  };
  return byAgent[activeAgentId()] || '';
}

function preferredTaskTitleForContext() {
  const byConversation = {
    'conv-1': '片区目标追赶任务',
    'conv-2': '活动策略A/B调整',
    'conv-3': '口碑整改任务包',
    'conv-4': '佳兆业店90天盈利提升任务',
    'conv-5': '总部任务24h追赶',
    'conv-6': '综合报告推送任务',
    'conv-7': '规则分层推送调整',
  };
  if (state.activeConversationId && byConversation[state.activeConversationId]) {
    return byConversation[state.activeConversationId];
  }

  const byAgent = {
    home: '片区目标追赶任务',
    analysis: '利润整改任务',
    risk: '风险闭环任务',
    tasks: '总部任务24h追赶',
  };
  return byAgent[activeAgentId()] || '会话跟进任务';
}

function focusPanelCard(selector, targetTitle) {
  requestAnimationFrame(() => {
    const panelBody = app.querySelector('.right-panel .panel-body');
    if (!panelBody) return;

    panelBody.scrollTo({ top: 0, behavior: 'smooth' });

    const cards = Array.from(panelBody.querySelectorAll(selector));
    if (!cards.length) return;

    const target = cards.find((card) => card.getAttribute('data-panel-title') === targetTitle) || cards[0];
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.add('focus-target');
    setTimeout(() => target.classList.remove('focus-target'), 1400);
  });
}

function focusReportCard(title) {
  focusPanelCard('.report-panel-card', title);
}

function focusTaskCard(title) {
  focusPanelCard('.task-panel-card', title);
}

function buildReportItemForContext(title) {
  if (isGoalTrackingContext()) {
    return {
      title,
      source: '美团餐饮AI助手生成',
      snapshotId: '#RPT-20260323-HOME-001',
      generatedAt: '2026-03-23 18:40',
      summary: '当前掉队最明显的是苏州南区、南京北区和三督导片区，三者合计约占总缺口 41%。',
      metrics: [
        { label: '总体达成', value: '50.23%' },
        { label: '累计缺口', value: '¥2.39M' },
        { label: '重点片区', value: '3 个' },
      ],
      verified: '已验证',
      evidence: [
        '线下达成 48.51%，低于线上 54.16%',
        '缺口 Top3 片区已生成 24 小时追赶清单',
        '预计追赶后可回补缺口约 ¥180,000',
      ],
      actions: ['查看图表', '下载报告'],
    };
  }

  if (isProfitAnalysisContext()) {
    return {
      title: '📈 利润归因分析简报',
      source: '美团餐饮AI助手生成',
      snapshotId: '#RPT-20260323-ANL-001',
      generatedAt: '2026-03-23 18:58',
      summary: '南京中山店和苏州园区店合计贡献了本次利润下滑的 57%，属于优先整改对象。',
      metrics: [
        { label: '重点门店', value: '2 家' },
        { label: '下滑贡献', value: '57%' },
        { label: '包装成本偏差', value: '+2.1pct' },
      ],
      verified: '已验证',
      evidence: [
        '南京中山店利润率 4.8%，包装成本占比 23%',
        '苏州园区店客单价 -6%，配送补偿异常上升',
        '活动毛利下降 8.4%，新店差评贡献 62%',
      ],
      actions: ['查看图表', '下载报告'],
    };
  }

  if (isRiskStoreContext()) {
    return {
      title: '📈 苏州园区店风险处置简报',
      source: '美团餐饮AI助手生成',
      snapshotId: '#RPT-20260323-RSK-001',
      generatedAt: '2026-03-23 19:20',
      summary: '苏州园区店复合风险由差评、库存、时效三项叠加触发，建议先补货再做晚高峰流程修复。',
      metrics: [
        { label: '差评率', value: '8.7%' },
        { label: '库存缺口', value: '5.5kg' },
        { label: '出餐超时', value: '+18%' },
      ],
      verified: '待复核',
      evidence: [
        '差评高发问题：出餐慢、打包漏液，集中在 19:00-20:00',
        '牛腩库存 12.5kg，低于安全阈值 18kg',
        '建议动作：补货30kg + 16:00督导巡检 + 22:00复盘回传',
      ],
      actions: ['查看图表', '下载报告'],
    };
  }

  return {
    title,
    source: '美团餐饮AI助手生成',
    snapshotId: '#RPT-20260323-AUTO',
    generatedAt: '2026-03-23 20:15',
    summary: '已按当前会话沉淀核心结论与执行建议，可直接用于汇报与回看。',
    metrics: [
      { label: '结论', value: '已沉淀' },
      { label: '证据', value: '已附带' },
      { label: '状态', value: '可下载' },
    ],
    verified: '待复核',
    evidence: [
      '已抽取当前会话中的关键结论',
      '已关联对应任务与回看节点',
      '可继续补充图表后再次导出',
    ],
    actions: ['查看图表', '下载报告'],
  };
}

function buildTaskItemForContext(title) {
  if (isGoalTrackingContext()) {
    return {
      title: '片区目标追赶任务',
      status: '进行中',
      chain: '苏州南区、南京北区和三督导片区 -> 对应30家门店',
      due: '2026-03-24 18:00（24小时追赶）',
      progress: '23%（7/30门店已提交追赶计划）',
      meta: '任务要求：24小时内提交片区追赶方案，优先恢复线下缺口并回传门店达成预测',
      replay: '回看节点：次日 10:00 检查达成率和缺口回补',
      actions: ['查看全部任务'],
    };
  }

  if (isProfitAnalysisContext()) {
    return {
      title: '南京/苏州利润整改任务',
      status: '进行中',
      chain: '区域负责人 -> 南京督导、苏州督导 -> 两地重点门店',
      due: '2026-03-24 16:00',
      progress: '31%（5/16 门店已提交整改动作）',
      meta: '任务要求：暂停低毛利活动、复核配送补偿、16:00 前完成打包SOP抽查并回传结果',
      replay: '回看节点：48小时后检查利润率和补贴偏差',
      actions: ['查看全部任务'],
    };
  }

  if (isRiskStoreContext()) {
    return {
      title: '苏州园区店风险闭环任务',
      status: '进行中',
      chain: '区域负责人 -> 苏州督导 -> 苏州园区店值班经理',
      due: '2026-03-23 20:00',
      progress: '40%（2/5 动作已回执）',
      meta: '任务要求：30kg补货、16:00督导到店、晚高峰排班与打包SOP抽检，22:00回传差评与库存快照',
      replay: '回看节点：22:00 回传差评与库存快照',
      actions: ['查看全部任务'],
    };
  }

  if (isSingleStoreProfitContext()) {
    return {
      title: '佳兆业店90天盈利提升任务',
      status: '进行中',
      chain: '区域负责人 -> 店长/督导 -> 运营支持',
      due: '2026-06-18',
      progress: '33%（第1阶段进行中）',
      meta: '任务要求：先完成第1-2周线下套餐引流与社群拉新，并回传日均营收与熟食客单两项回看数据',
      replay: '回看节点：每周一 09:00 自动回看四项指标',
      actions: ['查看全部任务'],
    };
  }

  return {
    title,
    status: '进行中',
    chain: '区域负责人 -> 督导 -> 门店',
    due: '2026-03-24 18:00',
    progress: '10%（待补充执行回执）',
    meta: '任务由会话动作生成，可继续补充责任人与截止节点。',
    replay: '回看节点：7天后自动回看完成率与结果指标',
    actions: ['查看全部任务'],
  };
}

function ensureReportForCurrentContext() {
  const preferred = preferredReportTitleForContext();
  const reports = reportItemsForCurrentContext();
  const exists = reports.find((item) => item.title === preferred);
  if (exists) {
    return { title: exists.title, created: false };
  }

  const title = preferred || reports[0]?.title || '📈 会话沉淀报告';
  upsertDynamicPanelItem('reports', buildReportItemForContext(title));
  return { title, created: true };
}

function upsertPrimaryTaskForCurrentContext() {
  const title = preferredTaskTitleForContext();
  const existed = upsertDynamicPanelItem('tasks', buildTaskItemForContext(title));
  return { title, existed };
}

function ensureReplayTaskForCurrentContext() {
  const preferred = preferredTaskTitleForContext();
  const tasks = taskItemsForCurrentContext();
  const existing = tasks.find((item) => item.title === preferred) || tasks[0];
  if (existing?.replay) {
    return { title: existing.title, created: false };
  }

  const title = existing?.title || preferred;
  upsertDynamicPanelItem('tasks', {
    ...buildTaskItemForContext(title),
    title,
    replay: '回看节点：已绑定差评、利润和执行回执三项回看数据',
  });
  return { title, created: true };
}

function triggerReportDownload() {
  const title = preferredReportTitleForContext() || '会话沉淀报告';
  const content = [
    `报告标题：${title}`,
    '来源：美团餐饮AI助手',
    '导出时间：2026-03-23 20:15',
    '说明：这是 Demo 下载内容，用于演示下载动作已触发。',
  ].join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'demo-report.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
}

function handleStatusAction(label) {
  const statusByAction = {
    '标记处理中': '进行中',
    '转派': '已转派',
    '失效': '已失效',
  };
  const title = preferredTaskTitleForContext();
  upsertDynamicPanelItem('tasks', {
    ...buildTaskItemForContext(title),
    title,
    status: statusByAction[label] || '进行中',
    meta: `状态流已更新：${label}（Mock）`,
  });
  refreshApp();
  showToast(`已执行：${label}（仅Mock状态流）`);
  return true;
}

function handleStructuredAction(label) {
  const semantic = actionSemantic(label);

  if (semantic === 'primary-report' || semantic === 'chart') {
    const result = ensureReportForCurrentContext();
    state.panelTab = 'reports';
    refreshApp();
    focusReportCard(result.title);
    showToast(result.created ? `已新增并定位报告：${result.title}` : `已定位到报告：${result.title}`);
    return true;
  }

  if (semantic === 'primary-task') {
    const result = upsertPrimaryTaskForCurrentContext();
    state.panelTab = 'tasks';
    refreshApp();
    focusTaskCard(result.title);
    showToast(result.existed ? `已更新任务：${result.title}` : `已新增任务：${result.title}`);
    return true;
  }

  if (semantic === 'status') {
    return handleStatusAction(label);
  }

  if (label === '查看规则详情' || label === '看定时推送') {
    state.automationFilterAgentId = activeAgentId();
    state.automationFilterKind = null;
    state.automationDetailId = null;
    openTab('automation', 'automation', '定时任务');
    refreshApp();
    return true;
  }

  if (semantic === 'review') {
    const result = ensureReplayTaskForCurrentContext();
    state.panelTab = 'tasks';
    refreshApp();
    focusTaskCard(result.title);
    showToast(result.created ? `已补齐回看并定位：${result.title}` : `已定位回看：${result.title}`);
    return true;
  }

  if (semantic === 'download') {
    triggerReportDownload();
    showToast('报告下载已触发（Demo）');
    return true;
  }

  return false;
}

function panelContext() {
  const tab = activeTab();
  const byAgent = {
      home: {
        tasks: [
          {
            title: '春菜上架任务',
            status: '处理中',
            chain: '总部运营 → 区域负责人 → 华东督导组',
            due: '2026-03-22 18:00',
            progress: '68%（8/12 店）',
            meta: '卡点：苏州 2 店未完成试菜回执',
            actions: ['查看全部任务'],
          },
          {
            title: '食安巡检任务',
            status: '超时风险',
            chain: '区域负责人 → 南京督导 → 5 家门店',
            due: '2026-03-20 20:00',
            progress: '60%（3/5 店）',
            meta: '高风险项：后厨留样记录不完整',
            actions: ['查看异常门店'],
          },
        ],
        alerts: [
          {
            title: '[高] 苏州片区差评率异常',
            status: '待处理',
            source: '美团餐饮AI助手主动发现',
            trigger: '今天 10:20',
            impact: '差评率 +1.8pct；影响 5 家门店',
            suggestion: '优先排查晚高峰出餐与打包 SOP',
            actions: ['查看异常门店'],
          },
          {
            title: '[中] 经营利润下滑提醒',
            status: '待处理',
            source: '下级提报',
            trigger: '今天 09:40',
            impact: '南京南区利润率 -1.3pct；外卖毛利承压',
            suggestion: '暂停低毛利活动并复核补贴规则',
            actions: ['看利润缺口'],
          },
        ],
        reports: [
          {
            title: '📈 周营收分析',
            source: '用户创建',
            snapshotId: '#RPT-20260316-003',
            generatedAt: '2026-03-16 09:00',
            summary: '本周营收同比增长 8.5%，外卖占比提升。',
            metrics: [
              { label: '周营收', value: '¥128,450' },
              { label: '同比', value: '+8.5%' },
              { label: '外卖占比', value: '42%' },
            ],
            verified: '已验证',
            evidence: [
              '综合好评率 96.2%，环比 +1.1pct',
              '抖音渠道贡献 12%，环比 +0.7pct',
              '差评集中门店：苏州园区店、南京中山店（QSC: 出餐/打包）',
            ],
            actions: ['查看图表', '下载报告'],
          },
        ],
      },
      analysis: {
        tasks: [
          {
            title: '低毛利活动优化任务',
            status: '待处理',
            chain: '区域负责人 → 督导组长 → 重点门店',
            due: '2026-03-21 16:00',
            progress: '25%（2/8 店）',
            meta: '目标：恢复利润率 +0.9pct',
            actions: ['生成整改任务'],
          },
        ],
        alerts: [
          {
            title: '[高] 生鲜品类目标缺口持续扩大',
            status: '待处理',
            source: '美团餐饮AI助手主动发现',
            trigger: '今天 11:02',
            impact: '生鲜达成率 84%，缺口 ¥21,000',
            suggestion: '优先复制杭州样板店活动结构',
            actions: ['看利润缺口'],
          },
        ],
        reports: [
          {
            title: '📈 目标达成与缺口分析',
            source: '美团餐饮AI助手生成',
            snapshotId: '#RPT-20260320-ANL',
            generatedAt: '2026-03-20 14:10',
            summary: '外卖和生鲜是主要缺口来源，南京/苏州需优先修复。',
            metrics: [
              { label: '总体达成', value: '91%' },
              { label: '目标缺口', value: '¥82,000' },
              { label: '活动贡献', value: '22.3%' },
            ],
            verified: '已验证',
            evidence: [
              '区域排名：杭州 > 上海 > 南京 > 苏州',
              '督导排名：赵琳 108%，周凡 89%',
              '低毛利活动导致利润稀释 1.1pct',
            ],
            actions: ['查看图表', '下载报告'],
          },
        ],
      },
      risk: {
        tasks: [
          {
            title: '高风险门店整改任务包',
            status: '处理中',
            chain: '区域负责人 → 苏州督导 → 园区店/高新区店',
            due: '2026-03-21 18:00',
            progress: '50%（2/4 项）',
            meta: '已完成补货，待完成晚高峰排班复核',
            actions: ['查看全部任务'],
          },
        ],
        alerts: [
          {
            title: '[高] 苏州园区店复合风险',
            status: '待处理',
            source: '美团餐饮AI助手主动发现',
            trigger: '今天 14:32',
            impact: '差评率 8.7% + 牛腩库存 12.5kg',
            suggestion: '补货与督导巡检并行推进',
            actions: ['查看异常门店'],
          },
          {
            title: '[中] 南京鸡尾店食安预警',
            status: '待处理',
            source: '下级提报',
            trigger: '今天 13:15',
            impact: '食安相关差评连续 2 天上升',
            suggestion: '抽检后厨留样与清洁记录',
            actions: ['查看异常门店'],
          },
        ],
        reports: [
          {
            title: '📈 风险门店周报',
            source: '美团餐饮AI助手生成',
            snapshotId: '#RPT-20260320-RSK',
            generatedAt: '2026-03-20 15:00',
            summary: '高风险门店 3 家，QSC 共性问题集中在出餐与打包。',
            metrics: [
              { label: '高风险门店', value: '3 家' },
              { label: '差评率环比', value: '+1.4pct' },
              { label: '已闭环', value: '8 条' },
            ],
            verified: '待复核',
            evidence: [
              '平台分布：美团 63%，点评 22%，抖音 15%',
              'QSC 聚类：出餐慢、打包漏液、食安留样缺失',
              '共性门店：苏州园区店、南京鸡尾店',
            ],
            actions: ['查看图表', '下载报告'],
          },
        ],
      },
      tasks: {
        tasks: [
          {
            title: '春菜上架派发任务',
            status: '处理中',
            chain: '总部运营 → 区域负责人 → 12 家门店',
            due: '2026-03-20 18:00',
            progress: '68%（8/12 店）',
            meta: '督导反馈：2 家门店需追加培训',
            actions: ['查看全部任务'],
          },
          {
            title: '食安巡检专项',
            status: '待处理',
            chain: '区域负责人 → 督导组 → 风险门店',
            due: '2026-03-21 12:00',
            progress: '40%（4/10 店）',
            meta: '重点检查后厨留样与温控记录',
            actions: ['查看全部任务'],
          },
        ],
        alerts: [
          {
            title: '[高] 任务超时风险',
            status: '待处理',
            source: '美团餐饮AI助手主动发现',
            trigger: '今天 12:20',
            impact: '3 条任务将在 24h 内到期',
            suggestion: '优先推进苏州片区巡检任务',
            actions: ['查看全部任务'],
          },
        ],
        reports: [
          {
            title: '📈 任务闭环复盘',
            source: '用户创建',
            snapshotId: '#RPT-20260320-TSK',
            generatedAt: '2026-03-20 13:50',
            summary: '当前任务完成率 68%，超时风险主要集中在苏州片区。',
            metrics: [
              { label: '任务完成率', value: '68%' },
              { label: '超时风险', value: '3 条' },
              { label: '回看达标', value: '5 条' },
            ],
            verified: '已验证',
            evidence: [
              '总部派发任务按时完成率 81%',
              '督导执行差异：南京 > 杭州 > 苏州',
              '未达标原因：巡检回执上传延迟',
            ],
            actions: ['查看图表', '下载报告'],
          },
        ],
      },
    };

  let title = '';
  let agentId = null;
  let items = [];

  if (tab?.type === 'history' && tab.conversationId) {
    title = `📌 会话：${recentChats.find((item) => item.id === tab.conversationId)?.title || '当前会话'}`;
    agentId = tab.agentId;
    items = conversationPanels[tab.conversationId]?.[state.panelTab] || [];
  } else if (tab?.type === 'home' || tab?.type === 'agent') {
    agentId = tab.agentId || 'home';
    title = agentId === 'home' ? '📌 今日工作台' : `📌 ${getAgentById(agentId)?.name || agentId} 的工作成果`;
    items = byAgent[agentId]?.[state.panelTab] || sharedPanels[state.panelTab] || [];
  }

  const dynamic = state.dynamicPanels[state.panelTab] || [];
  return {
    title,
    agentId,
    items: dynamic.length ? [...dynamic, ...items] : items,
  };
}

function panelItemsForCurrentContext() {
  return panelContext().items;
}

function jumpToAutomationFromPanel() {
  const agentId = panelContext().agentId;
  state.automationFilterAgentId = agentId;
  state.automationFilterKind = state.panelTab === 'tasks' ? 'task' : state.panelTab === 'alerts' ? 'alert' : 'report';
  state.automationDetailId = null;
  openTab('automation', 'automation', '定时任务');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 180);
  }, 1800);
}

function renderTopBar() {
  return `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">AI</div>
        <div>${escapeHtml(appMeta.productName)}</div>
      </div>
      <div class="topbar-center">
        <div class="role-pill">
          <strong>${escapeHtml(appMeta.role)}</strong>
          <span>${escapeHtml(appMeta.scope)}</span>
        </div>
        <div class="topbar-status">
          <span class="topbar-status-item"><i>数据</i> 最新</span>
          <span class="topbar-status-item"><i>连接</i> 正常</span>
          <span class="topbar-status-item"><i>风险</i> 3 项待处理</span>
        </div>
      </div>
      <div class="topbar-actions">
        <button class="topbar-chip" data-action="noop">${escapeHtml(appMeta.date)}</button>
        <button class="icon-btn" data-action="noop" aria-label="通知">铃</button>
        <button class="icon-btn" data-action="noop" aria-label="用户">人</button>
      </div>
    </header>
  `;
}

function renderConversationLinks(agentId) {
  return recentChats
    .filter((item) => item.agentId === agentId)
    .map(
      (item) => `
        <button
          class="link-btn chat-link ${state.activeConversationId === item.id ? 'active' : ''}"
          data-agent-id="${agentId}"
          data-conversation="${item.id}"
        >
          <span class="chat-link-top">
            <span class="chat-link-title">${escapeHtml(item.title)}</span>
            <span class="chat-link-time">${escapeHtml(item.time)}</span>
          </span>
        </button>
      `,
    )
    .join('');
}

function renderAgentNavItem(agent) {
  const expanded = state.expandedAgentId === agent.id;
  const active = isConversationTab() && activeAgentId() === agent.id;
  return `
    <div class="agent-accordion ${expanded ? 'expanded' : ''}">
      <button
        class="nav-btn ${active ? 'active' : ''}"
        data-nav-id="${agent.id}"
        data-nav-type="agent"
        data-nav-label="${escapeHtml(agent.name)}"
        aria-expanded="${expanded ? 'true' : 'false'}"
      >
        <span class="nav-main">
          <span class="nav-label">${escapeHtml(agent.icon)} ${escapeHtml(agent.name)}</span>
          <span class="nav-meta">近期会话与新建入口</span>
        </span>
        <span class="nav-caret" aria-hidden="true">${expanded ? '-' : '+'}</span>
      </button>
      <div class="accordion-body">
        <div class="accordion-inner">
          <button class="link-btn mini-action" data-action="new-conversation" data-nav-id="${agent.id}">+ 新建会话</button>
          <div class="simple-list">
            ${renderConversationLinks(agent.id)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLeftNav() {
  const tab = activeTab();
  return `
    <aside class="left-nav">
      <div class="left-nav-scrollable">
        <section>
          <div class="nav-group-title">主导航</div>
          <div class="agent-accordion ${state.expandedAgentId === 'home' ? 'expanded' : ''}">
            <button
              class="nav-btn ${isConversationTab() && activeAgentId() === 'home' ? 'active' : ''}"
              data-nav-id="home"
              data-nav-type="home"
              data-nav-label="今日工作台"
              aria-expanded="${state.expandedAgentId === 'home' ? 'true' : 'false'}"
            >
              <span class="nav-main">
                <span class="nav-label">🏠 今日工作台</span>
                <span class="nav-meta">今日重点与对话入口</span>
              </span>
              <span class="nav-caret" aria-hidden="true">${state.expandedAgentId === 'home' ? '-' : '+'}</span>
            </button>
            <div class="accordion-body">
              <div class="accordion-inner">
                <button class="link-btn mini-action" data-action="new-conversation" data-nav-id="home">+ 新建会话</button>
                <div class="simple-list">
                  ${renderConversationLinks('home')}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div class="nav-group-title">智能体</div>
          <div class="nav-list">
            ${state.agents.map((agent) => renderAgentNavItem(agent)).join('')}
            <button class="nav-btn nav-create-agent" data-action="open-create-agent">
              <span class="nav-main">
                <span class="nav-label">新建智能体</span>
                <span class="nav-meta">选配技能、授权与消息渠道</span>
              </span>
              <span class="nav-caret" aria-hidden="true">+</span>
            </button>
          </div>
        </section>
        <section>
          <div class="nav-group-title">工具</div>
          <div class="nav-list">
            ${(navigationGroups.tools || [])
              .map(
                (item) => `
                <button
                  class="nav-btn ${tab?.id === item.id && tab?.type === item.type ? 'active' : ''}"
                  data-nav-id="${item.id}"
                  data-nav-type="${item.type}"
                  data-nav-label="${escapeHtml(item.label)}"
                >
                  <span class="nav-main">
                    <span class="nav-label">${escapeHtml(item.icon)} ${escapeHtml(item.label)}</span>
                    <span class="nav-meta">${navMeta(item.id)}</span>
                  </span>
                </button>
              `,
              )
              .join('')}
          </div>
        </section>
      </div>
    </aside>
  `;
}

function navMeta(page) {
  switch (page) {
    case 'home': return '今日重点与对话入口';
    case 'analysis': return '查数、归因、建议';
    case 'risk': return '门店风险识别与处理';
    case 'tasks': return '执行闭环与回看';
    case 'skills': return '安装与管理技能';
    case 'connectors': return '外部系统授权';
    case 'channels': return '推送渠道配置';
    case 'automation': return '定时任务与执行日志';
    default: return '';
  }
}

function renderRoleFocus(pageId, page) {
  const focus = page.focus;
  if (!focus) {
    return '';
  }

  if (pageId === 'analysis') {
    return `
      <section class="card focus-card">
        <div class="focus-head">
          <h2>${escapeHtml(focus.title)}</h2>
          <span class="status-badge ok">区域运营视角</span>
        </div>
        <div class="focus-query"><strong>Query：</strong>${escapeHtml(focus.query)}</div>
        <div class="focus-conclusion"><strong>结论：</strong>${escapeHtml(focus.conclusion)}</div>
        <div class="focus-grid">
          ${focus.blocks
            .map(
              (block) => `
                <div class="focus-block">
                  <strong>${escapeHtml(block.title)}</strong>
                  <ul>${block.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
                </div>
              `,
            )
            .join('')}
        </div>
      </section>
    `;
  }

  return `
    <section class="card focus-card">
      <div class="focus-head">
        <h2>${escapeHtml(focus.title)}</h2>
        <span class="status-badge">角色关注摘要</span>
      </div>
      <ul>${focus.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      ${focus.chips?.length ? `
        <div class="chip-row">
          ${focus.chips.map((chip) => `<button class="chip" ${interactiveAttrs(chip)}>${escapeHtml(chip)}</button>`).join('')}
        </div>
      ` : ''}
    </section>
  `;
}

function renderSummaryCards(cards) {
  return `
    <section class="grid-4">
      ${cards
        .map(
          (card) => `
          <button class="metric-card" data-action="noop">
            <small>${escapeHtml(card.label)}</small>
            <strong>${escapeHtml(card.value)}</strong>
          </button>
        `,
        )
        .join('')}
    </section>
  `;
}

function renderHero(hero) {
  return `
    <section class="card hero-card">
      <h2>${escapeHtml(hero.title)}</h2>
      <ul>${hero.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      <div class="action-row" style="margin-top:16px;">
        ${hero.actions.map((action) => `<button class="primary-btn" ${interactiveAttrs(action)}>${escapeHtml(action)}</button>`).join('')}
      </div>
    </section>
  `;
}

function renderPrompts(title, prompts, variant = 'prompt') {
  const cls = variant === 'chip' ? 'chip-row' : 'prompt-grid';
  const btnClass = variant === 'chip' ? 'chip' : 'prompt-btn';
  return `
    <section class="card">
      <h2>${escapeHtml(title)}</h2>
      <div class="${cls}">
        ${prompts.map((prompt) => `<button class="${btnClass}" ${interactiveAttrs(prompt)}>${escapeHtml(prompt)}</button>`).join('')}
      </div>
    </section>
  `;
}

function renderStructuredCard(card) {
  switch (card.type) {
    case 'summary':
      return `
        <div class="message-card summary-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            ${card.badge ? `<span class="status-badge ok">${escapeHtml(card.badge)}</span>` : ''}
          </div>
          ${card.lines?.length ? `<ul>${card.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>` : ''}
        </div>
      `;
    case 'kpis':
      return `
        <div class="message-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            ${card.badge ? `<span class="status-badge">${escapeHtml(card.badge)}</span>` : ''}
          </div>
          <div class="mini-kpi-grid">
            ${card.items.map((item) => `
              <div class="mini-kpi">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
                ${item.change ? `<em class="${item.trend || ''}">${escapeHtml(item.change)}</em>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    case 'bars':
      return `
        <div class="message-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            ${card.badge ? `<span class="status-badge">${escapeHtml(card.badge)}</span>` : ''}
          </div>
          <div class="bar-chart">
            ${card.items.map((item) => `
              <div class="bar-row">
                <div class="bar-row-top">
                  <span>${escapeHtml(item.label)}</span>
                  <strong>${escapeHtml(item.valueLabel || item.value)}</strong>
                </div>
                <div class="bar-track"><div class="bar-fill ${item.tone || ''}" style="width:${Number(item.value) || 0}%"></div></div>
                ${item.meta ? `<div class="bar-meta">${escapeHtml(item.meta)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    case 'table':
      return `
        <div class="message-card table-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            ${card.badge ? `<span class="status-badge">${escapeHtml(card.badge)}</span>` : ''}
          </div>
          <div class="mini-table-wrap">
            <table class="mini-table">
              <thead><tr>${card.columns.map((col) => `<th>${escapeHtml(col)}</th>`).join('')}</tr></thead>
              <tbody>
                ${card.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    case 'task': {
      const localActions = filterConversationCardActions(card.actions || []);
      return `
        <div class="message-card task-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            <span class="status-badge warn">${escapeHtml(card.status || '待确认')}</span>
          </div>
          <div class="task-fields">
            ${card.fields.map((item) => `
              <div class="task-field">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
              </div>
            `).join('')}
          </div>
          ${localActions.length ? `<div class="chip-row">${localActions.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}</div>` : ''}
        </div>
      `;
    }
    case 'agent':
      return `
        <div class="message-card agent-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            <span class="status-badge ok">${escapeHtml(card.status || '执行中')}</span>
          </div>
          <div class="agent-steps">
            ${card.steps.map((step) => `
              <div class="agent-step">
                <span class="agent-dot ${step.status || ''}"></span>
                <span>${escapeHtml(step.text)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    default:
      return `
        <div class="message-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title || '信息卡')}</strong>
          </div>
          ${card.lines?.map((line) => `<p>${escapeHtml(line)}</p>`).join('') || ''}
        </div>
      `;
  }
}

function renderConversation(conversation, options = {}) {
  if (options.isDraft) {
    return `
      <section class="card conversation-workspace">
        <header class="conversation-header conversation-only">
          <div class="conversation-header-left">
            <h2>新会话</h2>
            <p class="conversation-subtitle">输入问题后开始新的分析、风险处理或任务协同。</p>
          </div>
        </header>
        <div class="conversation-composer conversation-only">
          <div class="composer-input">输入消息...（Shift+Enter 换行，输入 @ 可引用历史记录）</div>
          <button class="primary-btn" data-action="noop">发送</button>
        </div>
      </section>
    `;
  }

  const mainActions = mainActionsForConversation(conversation);
  const navActions = navActionsForConversation(conversation);

  if (conversation.messages?.length) {
    return `
      <section class="card conversation-workspace">
        <header class="conversation-header">
          <div class="conversation-header-left">
            <h2>${escapeHtml(conversation.title || '默认对话流')}</h2>
            ${conversation.meta ? `<p class="conversation-subtitle">${escapeHtml(conversation.meta)}</p>` : ''}
          </div>
          <div class="conversation-header-right">
            <span class="conversation-badge">对话</span>
            <div class="conversation-actions">
              <button class="secondary-btn" data-action="noop">生成简报</button>
              <button class="secondary-btn" data-action="noop">同步协作</button>
            </div>
          </div>
        </header>
        <div class="conversation-thread">
          ${conversation.messages
            .map(
              (message) => `
                <div class="message-bubble ${escapeHtml(message.role)}">
                  <div class="message-meta">
                    <div class="message-meta-main">
                      <strong>${escapeHtml(message.label || message.role)}</strong>
                      ${message.badge ? `<span class="status-badge ${message.role === 'ai' ? 'ok' : ''}">${escapeHtml(message.badge)}</span>` : ''}
                    </div>
                    ${message.time ? `<span>${escapeHtml(message.time)}</span>` : ''}
                  </div>
                  <p>${escapeHtml(message.content)}</p>
                  ${message.highlights?.length ? `<div class="tag-row">${message.highlights.map((item) => `<span class="tag strong">${escapeHtml(item)}</span>`).join('')}</div>` : ''}
                  ${message.cards?.length ? `<div class="message-card-stack">${message.cards.map((card) => renderStructuredCard(card)).join('')}</div>` : ''}
                </div>
              `,
            )
            .join('')}
        </div>
        ${conversation.artifacts?.length ? `
          <div class="artifact-grid">
            ${conversation.artifacts
              .map(
                (artifact) => {
                  const localActions = filterConversationCardActions(artifact.actions || []);
                  return `
                  <div class="detail-card artifact-card">
                    <header>
                      <strong>${escapeHtml(artifact.title)}</strong>
                      <span class="status-badge">${escapeHtml(artifact.type)}</span>
                    </header>
                    ${artifact.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
                    ${localActions.length ? `<div class="chip-row" style="margin-top:10px;">${localActions.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}</div>` : ''}
                  </div>
                `;
                },
              )
              .join('')}
          </div>
        ` : ''}
        ${mainActions.length ? `
          <div class="chip-row" style="margin-top:16px;">
            ${mainActions.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}
          </div>
        ` : ''}
        ${navActions.length ? `
          <div class="chip-row" style="margin-top:8px;">
            ${navActions.map((item) => `<button class="secondary-btn" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}
          </div>
        ` : ''}
        <div class="conversation-composer">
          <div class="composer-input">输入消息...（Shift+Enter 换行，输入 @ 可引用历史记录）</div>
          <button class="primary-btn" data-action="noop">发送</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="card">
      <h2>默认对话流</h2>
      <div class="section-stack">
        <div class="list-card">
          <header>
            <strong>User</strong>
            <span class="status-badge">问题</span>
          </header>
          <p>${escapeHtml(conversation.question)}</p>
        </div>
        <div class="detail-card">
          <header>
            <strong>AI</strong>
            <span class="status-badge ok">${escapeHtml(conversation.answerType)}</span>
          </header>
          <p>${escapeHtml(conversation.answer)}</p>
          <div class="tag-row">
            ${conversation.bullets.map((item) => `<span class="tag strong">${escapeHtml(item)}</span>`).join('')}
          </div>
          ${mainActions.length ? `<div class="chip-row" style="margin-top:16px;">${mainActions.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}</div>` : ''}
          ${navActions.length ? `<div class="chip-row" style="margin-top:8px;">${navActions.map((item) => `<button class="secondary-btn" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}</div>` : ''}
        </div>
      </div>
    </section>
  `;
}

function renderTable(table) {
  return `
    <section class="card table-wrap">
      <h2>明细表</h2>
      <table class="table">
        <thead><tr>${table.columns.map((col) => `<th>${escapeHtml(col)}</th>`).join('')}</tr></thead>
        <tbody>
          ${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </section>
  `;
}

function renderTabBar() {
  return `
    <div class="workspace-tabs">
      ${state.tabs
        .map(
          (tab) => `
            <button class="workspace-tab ${tab.id === state.activeTabId ? 'active' : ''}" data-tab-id="${tab.id}">
              <span class="workspace-tab-label">${escapeHtml(tab.label)}</span>
              ${tab.closable ? `<span class="tab-close" data-close-tab="${tab.id}" aria-label="关闭标签页">×</span>` : ''}
            </button>
          `,
        )
        .join('')}
    </div>
  `;
}

function renderMainFrame(body, mode = 'conversation') {
  return `
    <main class="main-pane ${mode === 'management' ? 'management' : ''}">
      ${renderTabBar()}
      <div class="main-pane-body">
        ${body}
      </div>
    </main>
  `;
}

function renderAgentTab(agentId, conversationId = null) {
  const page = pages[agentId];
  const tab = activeTab();
  const conversation = conversationId ? conversations[conversationId] : page?.conversation;
  const showFocus = tab?.type === 'agent' && !tab?.isDraft && tab?.id === agentId;
  return renderMainFrame(`
    ${showFocus && page?.focus ? renderRoleFocus(agentId, page) : ''}
    ${renderConversation(conversation || page?.conversation || pages.home.conversation, { isDraft: Boolean(tab?.isDraft) })}
  `);
}

function renderHomeTab() {
  const page = pages.home;
  const tab = activeTab();
  const showFocus = tab?.type === 'home' && !tab?.isDraft && tab?.id === 'home';
  return renderMainFrame(`
    ${showFocus ? renderRoleFocus('home', page) : ''}
    ${renderConversation(page.conversation, { isDraft: Boolean(tab?.isDraft) })}
  `);
}

function formatUsedBy(usedBy) {
  if (!usedBy.length) return '暂未被智能体调用';
  return usedBy.map((agentId) => getAgentById(agentId)?.name || agentId).join(' · ');
}

function toggleDraftSelection(key, value) {
  const next = new Set(state.createAgentDraft[key]);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  state.createAgentDraft[key] = Array.from(next);
}

function renderChecklist(name, items, sourceKey) {
  return `
    <section class="modal-section">
      <h3>${escapeHtml(name)}</h3>
      ${items
        .map(
          (item) => `
            <label class="modal-check">
              <input
                type="checkbox"
                data-draft-group="${sourceKey}"
                data-draft-value="${item.id}"
                ${state.createAgentDraft[sourceKey].includes(item.id) ? 'checked' : ''}
              />
              <span>${escapeHtml(item.name)}</span>
            </label>
          `,
        )
        .join('')}
    </section>
  `;
}

function renderSkillMarket() {
  return `
    <section class="config-grid">
      ${state.skillMarket
        .map(
          (item) => `
            <article class="config-card">
              <div class="config-card-head">
                <strong>${escapeHtml(item.icon)} ${escapeHtml(item.name)}</strong>
                <span class="status-badge ${item.installed ? 'ok' : 'warn'}">${item.installed ? '已安装' : '未安装'}</span>
              </div>
              <p>${escapeHtml(item.desc)}</p>
              <p class="used-by">调用方：${escapeHtml(formatUsedBy(item.usedBy))}</p>
              <button class="secondary-btn" data-action="install-skill" data-item-id="${item.id}">${item.installed ? '已安装' : '安装'}</button>
            </article>
          `,
        )
        .join('')}
    </section>
  `;
}

function renderConnectors() {
  return `
    <section class="config-grid">
      ${state.connectors
        .map(
          (item) => `
            <article class="config-card connector-card">
              <div class="config-card-head">
                <strong>${escapeHtml(item.name)}</strong>
                <span class="status-badge ${item.status === 'connected' ? 'ok' : 'warn'}">${escapeHtml(item.status)}</span>
              </div>
              <p>${escapeHtml(item.desc)}</p>
              ${item.connectedAt ? `<p>连接时间：${escapeHtml(item.connectedAt)}</p>` : ''}
              <p class="used-by">调用方：${escapeHtml(formatUsedBy(item.usedBy))}</p>
              <button class="secondary-btn" data-action="connect-connector" data-item-id="${item.id}">${item.status === 'connected' ? '已连接' : '连接'}</button>
            </article>
          `,
        )
        .join('')}
    </section>
  `;
}

function renderChannels() {
  return `
    <section class="config-grid">
      ${state.channels
        .map(
          (item) => `
            <article class="config-card channel-card">
              <div class="config-card-head">
                <strong>${escapeHtml(item.name)}</strong>
                <span class="status-badge ${item.status === 'enabled' ? 'ok' : 'warn'}">${escapeHtml(item.status)}</span>
              </div>
              <p>${escapeHtml(item.desc)}</p>
              <p class="used-by">调用方：${escapeHtml(formatUsedBy(item.usedBy))}</p>
              <button class="secondary-btn" data-action="toggle-channel" data-item-id="${item.id}">${item.status === 'enabled' ? '已启用' : '启用'}</button>
            </article>
          `,
        )
        .join('')}
    </section>
  `;
}

function filteredAutomationTasks() {
  return automationTasks.filter((task) => {
    const agentOk = state.automationFilterAgentId ? task.agentId === state.automationFilterAgentId : true;
    const kindOk = state.automationFilterKind ? task.kind === state.automationFilterKind : true;
    return agentOk && kindOk;
  });
}

function renderAutomationDetail(taskId) {
  const task = automationTasks.find((item) => item.id === taskId);
  if (!task) {
    state.automationDetailId = null;
    return renderAutomation();
  }

  return renderMainFrame(`
    <section class="card automation-card">
      <div class="automation-header">
        <button class="secondary-btn" data-action="close-automation-detail">返回列表</button>
        <h2>${escapeHtml(task.title)}</h2>
      </div>
      <div class="section-stack">
        <div class="detail-card">
          <header>
            <strong>${escapeHtml(task.agentName)}</strong>
            <span class="status-badge ${statusTone(task.status)}">${escapeHtml(task.status)}</span>
          </header>
          <p>频率：${escapeHtml(task.schedule)}</p>
          <p>渠道：${escapeHtml(task.channel)}</p>
          <p>说明：${escapeHtml(task.desc)}</p>
          <p>最近执行：${escapeHtml(task.lastTrigger)}</p>
        </div>
        <section class="card">
          <h2>执行历史</h2>
          <div class="section-stack">
            ${task.history
              .map(
                (item) => `
                  <div class="list-card automation-history-card">
                    <header>
                      <strong>${escapeHtml(item.title)}</strong>
                      <span class="status-badge ${statusTone(item.status)}">${escapeHtml(item.status)}</span>
                    </header>
                    <p>${escapeHtml(item.date)}</p>
                    ${task.kind === 'report' ? `
                      <div class="automation-history-actions">
                        <button class="secondary-btn" type="button">立即查看</button>
                        <button class="secondary-btn" type="button">下载</button>
                      </div>
                    ` : ''}
                  </div>
                `,
              )
              .join('')}
          </div>
        </section>
      </div>
    </section>
  `, 'management');
}

function renderAutomation() {
  if (state.automationDetailId) {
    return renderAutomationDetail(state.automationDetailId);
  }

  return renderMainFrame(`
    <section class="card automation-card">
      <div class="automation-header">
        <h2>⏰ 定时任务</h2>
        <div class="filter-chip-row">
          <button class="chip ${state.automationFilterAgentId ? 'active' : ''}" data-action="clear-automation-filter">
            ${state.automationFilterAgentId ? `${getAgentById(state.automationFilterAgentId)?.name || state.automationFilterAgentId} ×` : '全部'}
          </button>
        </div>
      </div>
      <table class="automation-table">
        <thead>
          <tr>
            <th>任务名</th>
            <th>频率</th>
            <th>总次</th>
            <th>成功</th>
            <th>失败</th>
            <th>最近执行</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${filteredAutomationTasks()
            .map(
              (task) => `
                <tr>
                  <td>${escapeHtml(task.title)}</td>
                  <td>${escapeHtml(task.schedule)}</td>
                  <td>${escapeHtml(String(task.totalRuns))}</td>
                  <td>${escapeHtml(String(task.successRuns))}</td>
                  <td>${escapeHtml(String(task.failedRuns))}</td>
                  <td>${escapeHtml(task.lastTrigger)}</td>
                  <td><button class="secondary-btn" data-action="open-automation-detail" data-task-id="${task.id}">详情</button></td>
                </tr>
              `,
            )
            .join('')}
        </tbody>
      </table>
    </section>
  `, 'management');
}

function renderMain() {
  const tab = activeTab();
  if (tab?.type === 'home') return renderHomeTab();
  if (tab?.type === 'agent') return renderAgentTab(tab.agentId);
  if (tab?.type === 'history') return renderAgentTab(tab.agentId, tab.conversationId);
  if (tab?.id === 'skills') return renderMainFrame(renderSkillMarket(), 'management');
  if (tab?.id === 'connectors') return renderMainFrame(renderConnectors(), 'management');
  if (tab?.id === 'channels') return renderMainFrame(renderChannels(), 'management');
  if (tab?.type === 'automation') return renderAutomation();
  return renderHomeTab();
}

function panelLabel(key) {
  switch (key) {
    case 'tasks': return '任务';
    case 'alerts': return '提醒';
    case 'reports': return '报告';
    default: return key;
  }
}

function statusTone(status = '') {
  if (status.includes('进行中')) return 'ok';
  if (status.includes('高') || status.includes('超时') || status.includes('待处理')) return 'danger';
  if (status.includes('中') || status.includes('待确认')) return 'warn';
  if (status.includes('已') || status.includes('处理') || status.includes('完成')) return 'ok';
  return '';
}

function renderPanelActions(item) {
  const actions = item.actions || (item.action ? [item.action] : []);
  if (!actions.length) return '';
  return `
    <div class="action-row panel-action-row">
      ${actions.map((action) => `<button class="secondary-btn" ${interactiveAttrs(action)}>${escapeHtml(action)}</button>`).join('')}
    </div>
  `;
}

function renderPanelContent(items = []) {
  const key = state.panelTab;
  return items.map((item) => {
    if (key === 'reports') {
      return `
        <div class="panel-card report-panel-card" data-panel-title="${escapeHtml(item.title)}">
          <div class="panel-card-head">
            <strong>${escapeHtml(item.title)}</strong>
            ${item.verified ? `<span class="status-badge ${statusTone(item.verified)}">${escapeHtml(item.verified)}</span>` : ''}
          </div>
          ${item.source ? `<p><strong>来源：</strong>${escapeHtml(item.source)}</p>` : ''}
          ${item.snapshotId ? `<p><strong>快照ID：</strong>${escapeHtml(item.snapshotId)}</p>` : ''}
          ${item.generatedAt ? `<p><strong>生成时间：</strong>${escapeHtml(item.generatedAt)}</p>` : ''}
          ${item.summary || item.subtitle ? `<p>${escapeHtml(item.summary || item.subtitle)}</p>` : ''}
          ${item.metrics?.length ? `
            <div class="panel-kpis">
              ${item.metrics.map((metric) => `
                <div class="panel-kpi">
                  <span>${escapeHtml(metric.label)}</span>
                  <strong>${escapeHtml(metric.value)}</strong>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${item.evidence?.length ? `
            <div class="panel-evidence">
              ${item.evidence.map((line) => `<p>• ${escapeHtml(line)}</p>`).join('')}
            </div>
          ` : ''}
          ${renderPanelActions(item)}
        </div>
      `;
    }

    if (key === 'tasks') {
      return `
        <div class="panel-card task-panel-card" data-panel-title="${escapeHtml(item.title)}">
          <div class="panel-card-head">
            <strong>${escapeHtml(item.title)}</strong>
            ${item.status ? `<span class="status-badge ${statusTone(item.status)}">${escapeHtml(item.status)}</span>` : ''}
          </div>
          ${item.chain ? `<p><strong>责任链路：</strong>${escapeHtml(item.chain)}</p>` : ''}
          ${item.due ? `<p><strong>截止时间：</strong>${escapeHtml(item.due)}</p>` : ''}
          ${item.progress ? `<p><strong>完成进度：</strong>${escapeHtml(item.progress)}</p>` : ''}
          ${item.meta ? `<p>${escapeHtml(item.meta)}</p>` : ''}
          ${item.replay ? `<p><strong>回看节点：</strong>${escapeHtml(item.replay)}</p>` : ''}
          ${renderPanelActions(item)}
        </div>
      `;
    }

    return `
      <div class="panel-card alert-panel-card">
        <div class="panel-card-head">
          <strong>${escapeHtml(item.title)}</strong>
          ${item.status ? `<span class="status-badge ${statusTone(item.status)}">${escapeHtml(item.status)}</span>` : ''}
        </div>
        ${item.source ? `<p><strong>来源：</strong>${escapeHtml(item.source)}</p>` : ''}
        ${item.trigger ? `<p><strong>触发时间：</strong>${escapeHtml(item.trigger)}</p>` : ''}
        ${item.impact || item.subtitle ? `<p><strong>异常：</strong>${escapeHtml(item.impact || item.subtitle)}</p>` : ''}
        ${item.suggestion ? `<p><strong>建议动作：</strong>${escapeHtml(item.suggestion)}</p>` : ''}
        ${renderPanelActions(item)}
      </div>
    `;
  }).join('');
}

function renderRightPanel() {
  if (isManagementTab()) {
    return '';
  }

  const context = panelContext();
  const tabs = [
    { id: 'tasks', label: '任务', hint: '执行闭环' },
    { id: 'alerts', label: '提醒', hint: '异常待处理' },
    { id: 'reports', label: '报告', hint: '沉淀结果' },
  ];
  const counts = Object.fromEntries(tabs.map((tab) => [tab.id, panelItemsForTab(tab.id).length]));
  return `
    <aside class="right-panel fade-in">
      <div class="panel-header">
        <div class="panel-context-label">${escapeHtml(context.title)}</div>
        <div class="panel-context-meta">当前角色视角 · ${escapeHtml(appMeta.role)}</div>
      </div>
      <div class="panel-tabs" role="tablist" aria-label="右侧面板切换">
        ${tabs.map((tab) => `
          <button class="tab-btn ${state.panelTab === tab.id ? 'active' : ''}" data-panel-tab="${tab.id}" role="tab" aria-selected="${state.panelTab === tab.id ? 'true' : 'false'}">
            <span class="tab-btn-top">
              <span class="tab-btn-label">${escapeHtml(tab.label)}</span>
              <span class="tab-badge">${counts[tab.id]}</span>
            </span>
            <span class="tab-btn-hint">${escapeHtml(tab.hint)}</span>
          </button>
        `).join('')}
      </div>
      <div class="panel-body">
        ${renderPanelContent(context.items)}
      </div>
      <div class="panel-footer">
        <button class="secondary-btn" data-action="view-all-panel-items">查看全部</button>
      </div>
    </aside>
  `;
}

function renderWorkspace() {
  const managementLayout = isManagementTab() ? ' style="grid-template-columns: 260px minmax(0,1fr);"' : '';
  return `
    <div class="workspace ${isManagementTab() ? 'workspace--management' : 'workspace--conversation'}"${managementLayout}>
      ${renderLeftNav()}
      ${renderMain()}
      ${renderRightPanel()}
    </div>
  `;
}

function renderCreateAgentModal() {
  if (!state.isCreateAgentModalOpen) return '';

  return `
    <div class="modal-backdrop">
      <div class="modal-card">
        <div class="modal-head">
          <h2>新建智能体</h2>
          <button class="icon-btn" data-action="close-create-agent">×</button>
        </div>
        <label class="modal-field">
          <span>名称</span>
          <input value="${escapeHtml(state.createAgentDraft.name)}" data-draft-field="name" />
        </label>
        <label class="modal-field">
          <span>描述</span>
          <input value="${escapeHtml(state.createAgentDraft.desc)}" data-draft-field="desc" />
        </label>
        <label class="modal-field">
          <span>图标</span>
          <input value="${escapeHtml(state.createAgentDraft.icon)}" data-draft-field="icon" />
        </label>
        ${renderChecklist('选择技能', state.skillMarket, 'skills')}
        ${renderChecklist('应用授权', state.connectors, 'connectors')}
        ${renderChecklist('消息渠道', state.channels, 'channels')}
        <div class="modal-actions">
          <button class="secondary-btn" data-action="close-create-agent">取消</button>
          <button class="primary-btn" data-action="submit-create-agent">创建智能体</button>
        </div>
      </div>
    </div>
  `;
}

function normalizeAgentId(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-\u4e00-\u9fa5]/g, '') || `agent-${Date.now()}`;
}

function applyUsedBySelection(collection, ids, agentId) {
  collection.forEach((item) => {
    if (ids.includes(item.id) && !item.usedBy.includes(agentId)) {
      item.usedBy.push(agentId);
    }
  });
}

function submitCreateAgent() {
  const agentId = normalizeAgentId(state.createAgentDraft.name);
  const agent = {
    id: agentId,
    name: state.createAgentDraft.name || '未命名智能体',
    icon: state.createAgentDraft.icon || '🧠',
    desc: state.createAgentDraft.desc || '新建 Demo 智能体',
    skills: state.skillMarket
      .filter((item) => state.createAgentDraft.skills.includes(item.id))
      .map((item) => item.name),
    connectors: [...state.createAgentDraft.connectors],
    channels: [...state.createAgentDraft.channels],
  };

  state.agents.push(agent);
  applyUsedBySelection(state.skillMarket, state.createAgentDraft.skills, agentId);
  applyUsedBySelection(state.connectors, state.createAgentDraft.connectors, agentId);
  applyUsedBySelection(state.channels, state.createAgentDraft.channels, agentId);
  state.createAgentDraft = {
    name: '',
    desc: '',
    icon: '🧠',
    skills: [],
    connectors: [],
    channels: [],
  };
  state.isCreateAgentModalOpen = false;
  openTab(agentId, 'agent', agent.name, { agentId, conversationId: null });
  showToast('智能体已创建（Demo）');
}

function refreshApp() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (document.startViewTransition && !reduceMotion) {
    document.startViewTransition(() => renderApp());
    return;
  }
  renderApp();
}

function renderApp() {
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopBar()}
      ${renderWorkspace()}
      ${renderCreateAgentModal()}
    </div>
  `;

  app.querySelectorAll('[data-nav-id][data-nav-type]').forEach((node) => {
    node.addEventListener('click', (event) => {
      const id = node.getAttribute('data-nav-id');
      const type = node.getAttribute('data-nav-type');
      const label = node.getAttribute('data-nav-label')
        || (type === 'agent' ? getAgentById(id)?.name : navLabelMap[id])
        || node.textContent.trim();

      // 如果点击的是 accordion 头部按钮,切换展开状态
      if (node.classList.contains('nav-btn') && node.querySelector('.nav-caret')) {
        const isExpanded = state.expandedAgentId === id;
        if (isExpanded) {
          // 已经展开,执行跳转
          openTab(id, type, label, {
            agentId: type === 'agent' || type === 'home' ? id : null,
            conversationId: null,
          });
        } else {
          // 未展开,先展开
          state.expandedAgentId = id;
        }
        refreshApp();
        return;
      }

      // 默认行为:打开标签页
      openTab(id, type, label, {
        agentId: type === 'agent' || type === 'home' ? id : null,
        conversationId: null,
      });
      refreshApp();
    });
  });

  app.querySelectorAll('[data-action="new-conversation"]').forEach((node) => {
    node.addEventListener('click', (event) => {
      event.stopPropagation();
      const agentId = node.getAttribute('data-nav-id');
      openNewConversationTab(agentId);
      refreshApp();
    });
  });

  app.querySelectorAll('[data-conversation]').forEach((node) => {
    node.addEventListener('click', () => {
      const agentId = node.getAttribute('data-agent-id') || 'home';
      const conversationId = node.getAttribute('data-conversation');
      setConversationContext(agentId, conversationId);
      refreshApp();
    });
  });

  app.querySelectorAll('[data-tab-id]').forEach((node) => {
    node.addEventListener('click', (event) => {
      if (event.target.closest('[data-close-tab]')) return;
      state.activeTabId = node.getAttribute('data-tab-id');
      syncLeftNav(state.activeTabId);
      refreshApp();
    });
  });

  app.querySelectorAll('[data-close-tab]').forEach((node) => {
    node.addEventListener('click', (event) => {
      event.stopPropagation();
      closeTab(node.getAttribute('data-close-tab'));
      refreshApp();
    });
  });

  app.querySelectorAll('[data-panel-tab]').forEach((node) => {
    node.addEventListener('click', () => {
      state.panelTab = node.getAttribute('data-panel-tab');
      refreshApp();
    });
  });

  app.querySelectorAll('[data-action="open-create-agent"]').forEach((node) => {
    node.addEventListener('click', () => {
      state.isCreateAgentModalOpen = true;
      refreshApp();
    });
  });

  app.querySelectorAll('[data-action="install-skill"], [data-action="connect-connector"], [data-action="toggle-channel"]').forEach((node) => {
    node.addEventListener('click', () => {
      showToast(`已触发演示动作：${node.textContent.trim()}`);
    });
  });

  app.querySelectorAll('[data-action="open-automation-detail"]').forEach((node) => {
    node.addEventListener('click', () => {
      state.automationDetailId = node.getAttribute('data-task-id');
      refreshApp();
    });
  });

  app.querySelectorAll('[data-action="close-automation-detail"]').forEach((node) => {
    node.addEventListener('click', () => {
      state.automationDetailId = null;
      refreshApp();
    });
  });

  app.querySelectorAll('[data-action="clear-automation-filter"]').forEach((node) => {
    node.addEventListener('click', () => {
      state.automationFilterAgentId = null;
      state.automationFilterKind = null;
      state.automationDetailId = null;
      refreshApp();
    });
  });

  app.querySelectorAll('[data-action="view-all-panel-items"]').forEach((node) => {
    node.addEventListener('click', () => {
      jumpToAutomationFromPanel();
      refreshApp();
    });
  });

  app.querySelectorAll('[data-action="close-create-agent"]').forEach((node) => {
    node.addEventListener('click', () => {
      state.isCreateAgentModalOpen = false;
      refreshApp();
    });
  });

  app.querySelectorAll('[data-draft-field]').forEach((node) => {
    node.addEventListener('input', (event) => {
      state.createAgentDraft[node.getAttribute('data-draft-field')] = event.target.value;
    });
  });

  app.querySelectorAll('[data-draft-group]').forEach((node) => {
    node.addEventListener('change', () => {
      toggleDraftSelection(node.getAttribute('data-draft-group'), node.getAttribute('data-draft-value'));
    });
  });

  app.querySelectorAll('[data-action="submit-create-agent"]').forEach((node) => {
    node.addEventListener('click', () => {
      submitCreateAgent();
      refreshApp();
    });
  });

  app.querySelectorAll('[data-action="noop"]').forEach((node) => {
    node.addEventListener('click', () => {
      if (handleStructuredAction(node.textContent.trim())) {
        return;
      }
      showToast(`已触发演示动作：${node.textContent.trim()}`);
    });
  });
}


refreshApp();
