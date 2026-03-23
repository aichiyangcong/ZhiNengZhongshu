import { appMeta, navigation, pages, recentChats, conversations, conversationPanels, sharedPanels } from './data.js';

const state = {
  page: 'home',
  panelTab: pages.home.defaultPanel,
  activeConversationId: null,
  dynamicPanels: {
    tasks: [],
    alerts: [],
    reports: [],
  },
};

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
    '为什么利润下降': 'analysis',
    '查看异常门店': 'risk',
    '生成整改任务': 'tasks',
    '华东区昨天利润率为什么下降？': 'analysis',
    '新店差评超过 3 条的有哪些？': 'risk',
    '帮我建一个外卖订单下滑预警': 'home',
    '展开看南京门店': 'analysis',
    '只看外卖渠道': 'analysis',
    '生成运营整改任务': 'tasks',
    '加入巡检计划': 'tasks',
    '推送督导通知': 'tasks',
    '立即推送': 'reports',
    '保存为模板': 'reports',
    '复制到其他区域': 'reports',
    '新建订阅': 'reports',
    '查看报告': 'reports',
    '查看异常门店': 'risk',
    '查看库存告警': 'risk',
    '生成巡检任务': 'risk',
    '保存为报告': 'reports',
    '生成任务': 'tasks',
    '修改问题': 'analysis',
    '查看全部提醒': 'home',
    '查看全部任务': 'tasks',
    '查看回看': 'tasks',
    '生成周报素材': 'reports',
    '标记处理中': 'tasks',
    '转派': 'tasks',
    '失效': 'tasks',
    '查看规则详情': 'push',
    '查看图表': 'reports',
    '下载报告': 'reports',
    '看风险门店': 'risk',
    '看任务进度': 'tasks',
    '看利润缺口': 'analysis',
    '看定时推送': 'push',
  };
  return map[label] || null;
}

function interactiveAttrs(label) {
  const target = actionTarget(label);
  return target ? `data-page="${target}"` : 'data-action="noop"';
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
  return state.page === 'home' && pages.home.conversation?.title?.includes('3月目标追踪');
}

function isProfitAnalysisContext() {
  const active = activeConversation();
  if (active?.title?.includes('利润率下降归因拆解到门店和动作')) {
    return true;
  }
  if (state.activeConversationId) {
    return false;
  }
  return state.page === 'analysis' && pages.analysis.conversation?.title?.includes('利润率下降归因拆解到门店和动作');
}

function isRiskStoreContext() {
  const active = activeConversation();
  if (active?.title?.includes('哪家门店风险最高，先处理什么')) {
    return true;
  }
  if (state.activeConversationId) {
    return false;
  }
  return state.page === 'risk' && pages.risk.conversation?.title?.includes('哪家门店风险最高，先处理什么');
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
  const items = panelItemsForCurrentPage();
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

  const byPage = {
    home: '📈 周营收分析',
    analysis: '📈 目标达成与缺口分析',
    risk: '📈 风险门店周报',
    tasks: '📈 任务闭环复盘',
    reports: '📈 周营收分析',
    push: '📈 推送规则命中周报',
  };
  return byPage[state.page] || '';
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

  const byPage = {
    home: '片区目标追赶任务',
    analysis: '利润整改任务',
    risk: '风险闭环任务',
    tasks: '总部任务24h追赶',
    reports: '综合报告推送任务',
    push: '规则分层推送调整',
  };
  return byPage[state.page] || '会话跟进任务';
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
  renderApp();
  showToast(`已执行：${label}（仅Mock状态流）`);
  return true;
}

function handleStructuredAction(label) {
  const semantic = actionSemantic(label);

  if (semantic === 'primary-report' || semantic === 'chart') {
    const result = ensureReportForCurrentContext();
    state.panelTab = 'reports';
    renderApp();
    focusReportCard(result.title);
    showToast(result.created ? `已新增并定位报告：${result.title}` : `已定位到报告：${result.title}`);
    return true;
  }

  if (semantic === 'primary-task') {
    const result = upsertPrimaryTaskForCurrentContext();
    state.panelTab = 'tasks';
    renderApp();
    focusTaskCard(result.title);
    showToast(result.existed ? `已更新任务：${result.title}` : `已新增任务：${result.title}`);
    return true;
  }

  if (semantic === 'status') {
    return handleStatusAction(label);
  }

  if (semantic === 'review') {
    const result = ensureReplayTaskForCurrentContext();
    state.panelTab = 'tasks';
    renderApp();
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

function panelItemsForCurrentPage() {
  let baseItems = [];

  if (state.activeConversationId) {
    const scopedPanels = conversationPanels[state.activeConversationId] || {};
    baseItems = scopedPanels[state.panelTab] || [];
  } else {
    const byPage = {
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
      reports: {
        alerts: [
          {
            title: '[中] 待发送报告提醒',
            status: '待处理',
            source: '美团餐饮AI助手主动发现',
            trigger: '今天 08:45',
            impact: '华东经营复盘仍未推送',
            suggestion: '先发老板日报，再发区域周报',
            actions: ['查看报告'],
          },
        ],
        tasks: [
          {
            title: '报告补充确认任务',
            status: '待处理',
            chain: '区域负责人 → 数据专员',
            due: '2026-03-20 17:00',
            progress: '50%（1/2 报告）',
            meta: '需补录督导区域平台拆分图',
            actions: ['查看报告'],
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
              '督导区域平台分布：赵琳片区外卖占比 46%',
              '差评门店 QSC：出餐慢、打包漏液',
            ],
            actions: ['查看图表', '下载报告'],
          },
          {
            title: '📈 好差评率及分析报告',
            source: '美团餐饮AI助手生成',
            snapshotId: '#RPT-20260320-007',
            generatedAt: '2026-03-20 09:20',
            summary: '综合好评率提升，但苏州片区差评仍偏高。',
            metrics: [
              { label: '综合好评率', value: '96.2%' },
              { label: '环比', value: '+1.1pct' },
              { label: '差评门店', value: '3 家' },
            ],
            verified: '已验证',
            evidence: [
              '平台分布：美团好评率 95.8%，点评 96.9%',
              '苏州片区差评率 8.7%，环比 +1.4pct',
              'QSC 主要问题：出餐速度、食安记录、打包规范',
            ],
            actions: ['查看图表', '下载报告'],
          },
        ],
      },
      push: {
        tasks: [
          {
            title: '定时推送维护任务',
            status: '处理中',
            chain: '区域负责人 → 数据运营',
            due: '2026-03-21 10:00',
            progress: '67%（4/6 规则）',
            meta: '需要复核老板日报推送窗口',
            actions: ['看定时推送'],
          },
        ],
        alerts: [
          {
            title: '[高] 区域利润率下滑推送命中',
            status: '待处理',
            source: '美团餐饮AI助手主动发现',
            trigger: '今天 10:50',
            impact: '苏州南区利润率 -1.6pct',
            suggestion: '立即触发区域经理提醒并附整改建议',
            actions: ['查看规则详情'],
          },
          {
            title: '[中] 下级提报：差评率上升',
            status: '待处理',
            source: '下级提报',
            trigger: '今天 09:30',
            impact: '南京北区差评率 +1.2pct',
            suggestion: '并入 12:00 汇总推送',
            actions: ['查看规则详情'],
          },
        ],
        reports: [
          {
            title: '📈 推送规则命中周报',
            source: '美团餐饮AI助手生成',
            snapshotId: '#RPT-20260320-PSH',
            generatedAt: '2026-03-20 11:20',
            summary: '规则命中 9 次，高优风险 3 次，均已触达负责人。',
            metrics: [
              { label: '命中次数', value: '9 次' },
              { label: '高优风险', value: '3 次' },
              { label: '触达率', value: '100%' },
            ],
            verified: '已验证',
            evidence: [
              'L1 风险实时推送平均延迟 2 分钟',
              'L2 经营提醒按 2 小时汇总已生效',
              '下级提报占提醒来源 34%',
            ],
            actions: ['查看图表', '下载报告'],
          },
        ],
      },
    };
    const pagePanels = byPage[state.page] || {};
    baseItems = pagePanels[state.panelTab] || sharedPanels[state.panelTab] || [];
  }

  const dynamic = state.dynamicPanels[state.panelTab] || [];
  if (dynamic.length) {
    return [...dynamic, ...baseItems];
  }
  return baseItems;
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
        <div class="topbar-actions">
          <button class="topbar-chip" data-action="noop">日期 ${escapeHtml(appMeta.date)}</button>
          <button class="topbar-chip" data-action="noop">搜索</button>
        </div>
      </div>
      <div class="topbar-actions">
        <button class="icon-btn" data-action="noop" aria-label="通知">铃</button>
        <button class="icon-btn" data-action="noop" aria-label="用户">人</button>
      </div>
    </header>
  `;
}

function renderLeftNav() {
  return `
    <aside class="left-nav">
      <div>
        <div class="nav-group-title">主导航</div>
        <div class="nav-list">
          ${navigation
            .map(
              (item) => `
              <button class="nav-btn ${!state.activeConversationId && state.page === item.id ? 'active' : ''}" data-page="${item.id}">
                <span class="nav-label">${escapeHtml(item.label)}</span>
                <span class="nav-meta">${navMeta(item.id)}</span>
              </button>
            `,
            )
            .join('')}
        </div>
      </div>
      <div>
        <div class="nav-group-title">主题会话</div>
        <div class="simple-list">
          ${recentChats
            .map(
              (item) => `
                <button class="link-btn chat-link ${state.activeConversationId === item.id ? 'active' : ''}" data-page="${item.page}" data-conversation="${item.id}">
                  <span class="chat-link-top">
                    <span class="chat-link-title">${escapeHtml(item.title)}</span>
                    <span class="chat-link-time">${escapeHtml(item.time)}</span>
                  </span>
                </button>`,
            )
            .join('')}
        </div>
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
    case 'reports': return '日报、周报与专题';
    case 'push': return '定时与规则推送编排';
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

function renderConversation(conversation) {
  const mainActions = mainActionsForConversation(conversation);
  const navActions = navActionsForConversation(conversation);

  if (conversation.messages?.length) {
    return `
      <section class="card conversation-workspace">
        <div class="conversation-head">
          <div>
            <h2>${escapeHtml(conversation.title || '默认对话流')}</h2>
            ${conversation.meta ? `<p class="helper-text">${escapeHtml(conversation.meta)}</p>` : ''}
          </div>
          <div class="conversation-actions">
            <button class="secondary-btn" data-action="noop">生成简报</button>
            <button class="secondary-btn" data-action="noop">同步协作</button>
          </div>
        </div>
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

function renderAnalysis(page) {
  return `
    ${renderRoleFocus('analysis', page)}
    ${renderConversation(page.conversation)}
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

function renderRisk(page) {
  return `
    ${renderRoleFocus('risk', page)}
    ${renderConversation(page.conversation)}
  `;
}

function renderTasks(page) {
  return `
    ${renderRoleFocus('tasks', page)}
    ${renderConversation(page.conversation)}
  `;
}

function renderReports(page) {
  return `
    ${renderRoleFocus('reports', page)}
    ${renderConversation(page.conversation)}
  `;
}

function renderPush(page) {
  return `
    ${renderRoleFocus('push', page)}
    ${renderConversation(page.conversation)}
  `;
}

function renderHome(page) {
  return `
    ${renderRoleFocus('home', page)}
    ${renderConversation(page.conversation)}
  `;
}

function renderMain() {
  const conversation = activeConversation();
  if (conversation) {
    return `<main class="main-pane conversation-only">${renderConversation(conversation)}</main>`;
  }

  const page = pages[state.page];
  const body = (() => {
    switch (state.page) {
      case 'home': return renderHome(page);
      case 'analysis': return renderAnalysis(page);
      case 'risk': return renderRisk(page);
      case 'tasks': return renderTasks(page);
      case 'reports': return renderReports(page);
      case 'push': return renderPush(page);
      default: return renderHome(pages.home);
    }
  })();

  return `<main class="main-pane">${body}</main>`;
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

function renderPanelContent() {
  const key = state.panelTab;
  const items = panelItemsForCurrentPage();
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
  const tabs = [
    { id: 'tasks', label: '任务' },
    { id: 'alerts', label: '提醒' },
    { id: 'reports', label: '报告' },
  ];
  return `
    <aside class="right-panel">
      <div>
        <div class="nav-group-title">沉淀结果</div>
        <div class="panel-tabs">
          ${tabs.map((tab) => `<button class="tab-btn ${state.panelTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">${escapeHtml(tab.label)}</button>`).join('')}
        </div>
      </div>
      <div class="panel-body">
        ${renderPanelContent()}
      </div>
      <div class="panel-footer">
        <button class="secondary-btn" data-page="${state.page}">查看全部${panelLabel(state.panelTab)}</button>
      </div>
    </aside>
  `;
}

function renderApp() {
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopBar()}
      <div class="workspace">
        ${renderLeftNav()}
        ${renderMain()}
        ${renderRightPanel()}
      </div>
    </div>
  `;

  app.querySelectorAll('[data-page]:not([data-conversation])').forEach((node) => {
    node.addEventListener('click', () => {
      const actionLabel = node.textContent.trim();
      if (handleStructuredAction(actionLabel)) {
        return;
      }

      const next = node.getAttribute('data-page');
      state.page = next;
      state.panelTab = pages[next].defaultPanel;
      state.activeConversationId = null;
      renderApp();
    });
  });

  app.querySelectorAll('[data-conversation]').forEach((node) => {
    node.addEventListener('click', () => {
      const next = node.getAttribute('data-page');
      const conversationId = node.getAttribute('data-conversation');
      state.page = next;
      state.panelTab = pages[next].defaultPanel;
      state.activeConversationId = conversationId;
      renderApp();
    });
  });

  app.querySelectorAll('[data-tab]').forEach((node) => {
    node.addEventListener('click', () => {
      state.panelTab = node.getAttribute('data-tab');
      renderApp();
    });
  });

  app.querySelectorAll('[data-action="noop"]').forEach((node) => {
    node.addEventListener('click', () => {
      showToast(`已触发演示动作：${node.textContent.trim()}`);
    });
  });
}


renderApp();
