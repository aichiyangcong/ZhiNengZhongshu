const appMeta = {
  productName: "AI 工作台",
  role: "区域运营负责人",
  scope: "华东区 · 182 家门店",
  date: "2026-03-20",
};

const navigation = [
  { id: "home", label: "今日工作台" },
  { id: "analysis", label: "经营分析" },
  { id: "risk", label: "门店风险" },
  { id: "tasks", label: "任务协同" },
  { id: "reports", label: "报告中心" },
];

const recentChats = [
  "华东区利润率为什么下降？",
  "新店差评超过 3 条的有哪些？",
  "帮我建一个外卖订单下滑预警",
];

const quickPrompts = [
  { label: "看今日摘要", target: "home" },
  { label: "生成整改任务", target: "tasks" },
];

const sharedPanels = {
  tasks: [
    { title: "整改新店差评问题", meta: "南京区域经理 · 明日 18:00", status: "待处理" },
    { title: "巡检食安风险门店", meta: "苏州督导组 · 今日 16:00", status: "处理中" },
    { title: "补货确认与反馈", meta: "杭州门店负责人 · 今日 11:30", status: "即将超时" },
  ],
  alerts: [
    { title: "外卖订单下滑预警", subtitle: "4 家门店命中规则：订单↓15% + 差评↑", action: "查看异常门店" },
    { title: "新店差评异常", subtitle: "5 家门店集中在口味 / 打包 / 出餐慢", action: "生成巡检任务" },
    { title: "库存低于阈值", subtitle: "2 家门店需要补货并通知督导", action: "查看库存告警" },
  ],
  reports: [
    { title: "今日分析简报", subtitle: "草稿 · 08:00 推送", action: "查看报告" },
    { title: "本周经营复盘", subtitle: "已生成 · 区域运营模板", action: "查看报告" },
    { title: "新店口碑周报", subtitle: "待确认 · 4 月试点", action: "查看报告" },
  ],
};

const pages = {
  home: {
    title: "今日工作台",
    subtitle: "今日重点：利润、差评、库存",
    defaultPanel: "alerts",
    summaryCards: [
      { label: "高风险门店", value: "3" },
      { label: "待处理任务", value: "5" },
      { label: "新报告", value: "1" },
      { label: "命中提醒", value: "4" },
    ],
    hero: {
      title: "今天你最该关注的 3 件事",
      items: [
        "利润率下降 1.6pct",
        "5 家新店差评异常",
        "2 家门店库存告警",
      ],
      actions: ["为什么利润下降", "查看异常门店", "生成整改任务"],
    },
    prompts: [
      "华东区昨天利润率为什么下降？",
      "新店差评超过 3 条的有哪些？",
      "帮我建一个外卖订单下滑预警",
    ],
    conversation: {
      question: "昨天华东区利润率为什么下降？",
      answerType: "确定性数据 + AI 建议",
      answer:
        "外卖包装成本率上升 2.1pct 是确定性主因；活动补贴过深以及南京、苏州配送补偿异常属于 AI 归因建议。",
      bullets: ["包装成本", "活动补贴", "配送补偿"],
      followUps: ["展开看南京门店", "只看外卖渠道", "生成运营整改任务"],
    },
  },
  analysis: {
    title: "经营分析",
    subtitle: "华东区利润率下降归因 + 结论 + 建议",
    defaultPanel: "reports",
    query: "华东区昨天利润率为什么下降？",
    queryActions: ["修改问题", "保存为报告", "生成任务"],
    conclusion: {
      title: "结论卡",
      lines: [
        "外卖包装成本 + 活动补贴共同压缩利润",
        "影响范围：南京 / 苏州 / 外卖渠道 / 5 家重点门店",
        "优先动作：暂停低毛利活动、复核补偿、强化会员触达",
      ],
      tags: ["确定性数据", "AI 建议"],
    },
    insightCards: [
      { title: "归因 1", value: "包装成本率 ↑2.1pct", desc: "高于近 4 周均值" },
      { title: "归因 2", value: "活动毛利 ↓8.4%", desc: "折扣过深导致毛利稀释" },
      { title: "归因 3", value: "配送补偿 ↑", desc: "南京/苏州异常明显" },
    ],
    visuals: [
      { title: "Trend", desc: "利润率 vs 包装成本率（7日）" },
      { title: "Distribution", desc: "高风险门店热力图" },
    ],
    table: {
      columns: ["门店", "利润率", "包装成本", "补贴金额", "差评率", "风险等级"],
      rows: [
        ["南京中山店", "4.8%", "23%", "¥12.8k", "3.9%", "高"],
        ["苏州园区店", "5.1%", "22%", "¥10.4k", "3.2%", "中高"],
        ["上海虹桥店", "6.0%", "19%", "¥9.2k", "2.1%", "中"],
      ],
    },
    prompts: ["展开看南京门店", "只看外卖渠道", "生成运营整改任务"],
  },
  risk: {
    title: "门店风险",
    subtitle: "系统自动识别的高优先级问题",
    defaultPanel: "tasks",
    filters: ["区域：华东区", "风险类型：差评/食安/库存", "风险等级：高/中/低", "时间范围：近7天", "只看我负责门店"],
    summaryCards: [
      { label: "高风险", value: "12" },
      { label: "中风险", value: "24" },
      { label: "今日新增", value: "6" },
      { label: "已闭环", value: "8" },
    ],
    list: [
      { title: "苏州园区店", level: "高", problem: "差评聚焦出餐慢", action: "优化晚高峰排班" },
      { title: "南京鸡尾店", level: "高", problem: "食安评价增多", action: "立刻巡检后厨" },
      { title: "杭州西溪店", level: "中高", problem: "新品退单异常", action: "复核制作标准" },
    ],
    detail: {
      title: "苏州园区店",
      lines: [
        "风险摘要：新店差评集中在晚高峰出餐慢",
        "相关指标：差评率 8.7% ↑ vs 均值 4.2%；出餐超时 △18%",
        "可能原因：排班不足、配送补偿↑、新人操作不熟练",
        "推荐动作：16:00 前督导巡检、抽检排班与打包 SOP",
      ],
      actions: ["生成任务", "加入巡检计划", "推送督导通知"],
    },
  },
  tasks: {
    title: "任务协同",
    subtitle: "AI 洞察 + 人工创建的执行闭环",
    defaultPanel: "tasks",
    summaryCards: [
      { label: "待处理", value: "18" },
      { label: "处理中", value: "7" },
      { label: "即将超时", value: "3" },
      { label: "待确认", value: "4" },
    ],
    filters: ["任务来源：AI分析", "状态：待处理/处理中/完成", "责任人：南京区", "区域：南京/苏州/杭州", "截止：近日"],
    list: [
      { title: "整改新店差评问题", source: "AI分析", status: "待处理", due: "明日 18:00" },
      { title: "巡检食安风险门店", source: "人工创建", status: "处理中", due: "后日 14:00" },
    ],
    detail: {
      title: "整改新店差评问题",
      lines: [
        "来源：门店风险页",
        "责任人：南京区域经理",
        "背景：近 2 日差评率持续上升",
        "关联指标：差评率↑1.9pct / 客单 / 订单量",
        "建议动作：抽查排班、扎实打包 SOP",
        "提交要求：上传整改照片 + 负责人签字",
        "回看节点：7 天后自动复盘（差评率下降 ≥0.5pct）",
      ],
      actions: ["标记处理中", "转派", "失效", "查看回看", "生成周报素材"],
    },
  },
  reports: {
    title: "报告中心",
    subtitle: "日报 / 周报 / 专题 · 角色模板切换",
    defaultPanel: "reports",
    filters: ["Type：日报", "Template：老板", "Time：本周", "Status：草稿", "Filters：Region/Channel"],
    cards: [
      { title: "全国经营简报", tags: ["日报", "已订阅"], updated: "07:45" },
      { title: "华东经营复盘", tags: ["周报", "草稿"], updated: "03-19" },
      { title: "新店口碑周报", tags: ["专题", "草稿"], updated: "03-18" },
      { title: "活动效果分析", tags: ["专题", "草稿"], updated: "03-17" },
    ],
    detail: {
      title: "全国经营简报（每日）",
      lines: [
        "Audience：老板 / COO / 区域经理",
        "Conclusions：1) 营收环比 +1.8% 2) 外卖利润率下滑 1.2pct 3) 差评略回升",
        "Metrics：总营收 / 投入产出 / 会员复购 / 渠道占比",
        "Action：暂停低毛利活动，启动督导巡检",
      ],
      actions: ["立即推送", "保存为模板", "复制到其他区域"],
    },
    subscriptions: [
      "老板每日 8 点全国简报（微信/企微）",
      "华东区周一 9 点经营复盘（管家 + 邮件）",
      "新店口碑周报订阅（4 月试点）",
    ],
    subscriptionAction: "新建订阅",
  },
};


const state = {
  page: 'home',
  panelTab: pages.home.defaultPanel,
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
  };
  return map[label] || null;
}

function interactiveAttrs(label) {
  const target = actionTarget(label);
  return target ? `data-page="${target}"` : 'data-action="noop"';
}


function panelItemsForCurrentPage() {
  const byPage = {
    home: {
      alerts: sharedPanels.alerts,
      tasks: [
        { title: '待处理整改任务', meta: '今日 5 条 · 优先处理新店差评', status: '待处理' },
        { title: '补货确认任务', meta: '2 家门店 · 今日 11:30 前反馈', status: '即将超时' },
      ],
      reports: [
        { title: '今日经营简报', subtitle: '首页摘要对应日报', action: '查看报告' },
      ],
    },
    analysis: {
      alerts: [
        { title: '分析结论相关提醒', subtitle: '南京/苏州门店仍处高风险区', action: '查看异常门店' },
      ],
      tasks: [
        { title: '生成整改任务候选', meta: '由当前分析生成', status: '待处理' },
      ],
      reports: [
        { title: '今日分析简报', subtitle: '草稿 · 与当前分析绑定', action: '查看报告' },
        { title: '本周经营复盘', subtitle: '可并入当前结论', action: '查看报告' },
        { title: '保存当前分析为报告', subtitle: '下次推送 08:00', action: '保存为报告' },
      ],
    },
    risk: {
      alerts: [
        { title: '高风险门店提醒', subtitle: '苏州园区店 / 南京鸡尾店 / 杭州西溪店', action: '查看异常门店' },
      ],
      tasks: [
        { title: '待创建任务', meta: '3 条风险待转任务', status: '待处理' },
        { title: '今日已下发', meta: '5 条巡检/整改任务', status: '处理中' },
        { title: '即将超时', meta: '2 条任务需追踪', status: '即将超时' },
      ],
      reports: [
        { title: '门店风险周报', subtitle: '可从风险列表生成专题', action: '查看报告' },
      ],
    },
    tasks: {
      alerts: [
        { title: '任务超时提醒', subtitle: '3 条任务距离截止 <= 24h', action: '查看全部任务' },
      ],
      tasks: [
        { title: '我负责的任务', meta: '6 条', status: '处理中' },
        { title: '今日新建', meta: '4 条', status: '待处理' },
        { title: '即将超时', meta: '3 条', status: '即将超时' },
      ],
      reports: [
        { title: '任务周报素材', subtitle: '可从当前任务生成', action: '查看报告' },
      ],
    },
    reports: {
      alerts: [
        { title: '待发送报告提醒', subtitle: '今日仍有 1 份待发送', action: '查看报告' },
      ],
      tasks: [
        { title: '报告跟进任务', meta: '2 条报告需补充负责人确认', status: '待确认' },
      ],
      reports: [
        { title: '最新报告', subtitle: '2 份已生成', action: '查看报告' },
        { title: '已订阅模板', subtitle: '标准周报', action: '新建订阅' },
        { title: '下次推送', subtitle: '08:00', action: '查看报告' },
      ],
    },
  };
  const pagePanels = byPage[state.page] || {};
  return pagePanels[state.panelTab] || sharedPanels[state.panelTab] || [];
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
        <div class="nav-group-title">模式切换</div>
        <div class="mode-switch">
          <button class="active" data-action="noop">AI 工作台</button>
          <button data-action="noop">传统模式</button>
        </div>
      </div>
      <div>
        <div class="nav-group-title">主导航</div>
        <div class="nav-list">
          ${navigation
            .map(
              (item) => `
              <button class="nav-btn ${state.page === item.id ? 'active' : ''}" data-page="${item.id}">
                <span class="nav-label">${escapeHtml(item.label)}</span>
                <span class="nav-meta">${navMeta(item.id)}</span>
              </button>
            `,
            )
            .join('')}
        </div>
      </div>
      <div>
        <div class="nav-group-title">最近会话</div>
        <div class="simple-list">
          ${recentChats
            .map(
              (item, index) => `<button class="link-btn" data-page="${navigation[index]?.id || 'analysis'}">${escapeHtml(item)}</button>`,
            )
            .join('')}
        </div>
      </div>
      <div>
        <div class="nav-group-title">快捷提问</div>
        <div class="prompt-list">
          ${quickPrompts
            .map(
              (item) => `<button class="link-btn" data-page="${item.target}">${escapeHtml(item.label)}</button>`,
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
    default: return '';
  }
}

function renderPageHeader(page) {
  return `
    <section class="page-header">
      <div class="page-eyebrow">
        <span>PC 端工作台 Demo</span>
        <button class="topbar-chip" data-action="noop">${escapeHtml(appMeta.date)}</button>
      </div>
      <h1>${escapeHtml(page.title)}</h1>
      <p>${escapeHtml(page.subtitle)}</p>
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

function renderConversation(conversation) {
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
          <div class="chip-row" style="margin-top:16px;">
            ${conversation.followUps.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAnalysis(page) {
  return `
    ${renderPageHeader(page)}
    <section class="card">
      <h2>Query Bar</h2>
      <div class="list-card">
        <p>${escapeHtml(page.query)}</p>
        <div class="query-actions" style="margin-top:16px;">
          ${page.queryActions.map((item, idx) => `<button class="${idx === 1 ? 'secondary-btn' : 'primary-btn'}" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}
        </div>
      </div>
    </section>
    <section class="card">
      <h2>${escapeHtml(page.conclusion.title)}</h2>
      <ul>${page.conclusion.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
      <div class="tag-row">
        ${page.conclusion.tags.map((tag, idx) => `<span class="tag ${idx === 0 ? 'strong' : ''}">${escapeHtml(tag)}</span>`).join('')}
      </div>
    </section>
    <section class="insight-grid">
      ${page.insightCards.map((item) => `
        <div class="insight-card">
          <strong>${escapeHtml(item.title)}</strong>
          <div style="font-size:22px;font-weight:700;margin-bottom:8px;">${escapeHtml(item.value)}</div>
          <p>${escapeHtml(item.desc)}</p>
        </div>
      `).join('')}
    </section>
    <section class="visual-grid">
      ${page.visuals.map((item) => `
        <div class="visual-card">
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.desc)}</p>
          </div>
          <div class="chart-placeholder">静态图表占位</div>
        </div>
      `).join('')}
    </section>
    ${renderTable(page.table)}
    ${renderPrompts('Follow-up Questions', page.prompts, 'chip')}
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
    ${renderPageHeader(page)}
    <section class="card">
      <h2>Filter Bar</h2>
      <div class="filter-bar">
        ${page.filters.map((item) => `<button class="filter-pill" data-action="noop">${escapeHtml(item)}</button>`).join('')}
      </div>
    </section>
    ${renderSummaryCards(page.summaryCards)}
    <section class="split-grid">
      <div class="card">
        <h2>Risk List</h2>
        <div class="list-stack">
          ${page.list.map((item) => `
            <div class="list-card">
              <header>
                <strong>${escapeHtml(item.title)}</strong>
                <span class="status-badge ${item.level === '高' ? 'danger' : 'warn'}">${escapeHtml(item.level)}</span>
              </header>
              <p><strong>问题：</strong>${escapeHtml(item.problem)}</p>
              <p><strong>建议：</strong>${escapeHtml(item.action)}</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <h2>Risk Detail Drawer</h2>
        <div class="detail-card">
          <header>
            <strong>${escapeHtml(page.detail.title)}</strong>
            <span class="status-badge danger">选中门店</span>
          </header>
          ${page.detail.lines.map((line) => `<p style="margin-bottom:10px;">${escapeHtml(line)}</p>`).join('')}
          <div class="action-row" style="margin-top:14px;">
            ${page.detail.actions.map((action) => `<button class="primary-btn" data-page="${action.includes('任务') ? 'tasks' : 'risk'}">${escapeHtml(action)}</button>`).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderTasks(page) {
  return `
    ${renderPageHeader(page)}
    ${renderSummaryCards(page.summaryCards)}
    <section class="card">
      <h2>Task Filter Bar</h2>
      <div class="filter-bar">
        ${page.filters.map((item) => `<button class="filter-pill" data-action="noop">${escapeHtml(item)}</button>`).join('')}
      </div>
    </section>
    <section class="split-grid">
      <div class="card">
        <h2>Task List</h2>
        <div class="list-stack">
          ${page.list.map((item) => `
            <div class="list-card">
              <header>
                <strong>${escapeHtml(item.title)}</strong>
                <span class="status-badge ${item.status === '待处理' ? 'warn' : 'ok'}">${escapeHtml(item.status)}</span>
              </header>
              <p><strong>来源：</strong>${escapeHtml(item.source)}</p>
              <p><strong>截止：</strong>${escapeHtml(item.due)}</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <h2>Task Detail Panel</h2>
        <div class="detail-card">
          <header>
            <strong>${escapeHtml(page.detail.title)}</strong>
            <span class="status-badge warn">执行中</span>
          </header>
          ${page.detail.lines.map((line) => `<p style="margin-bottom:10px;">${escapeHtml(line)}</p>`).join('')}
          <div class="action-row" style="margin-top:14px;">
            ${page.detail.actions.map((action, index) => `<button class="${index === 0 ? 'primary-btn' : 'secondary-btn'}" data-action="noop">${escapeHtml(action)}</button>`).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderReports(page) {
  return `
    ${renderPageHeader(page)}
    <section class="card">
      <h2>Report Filter Bar</h2>
      <div class="filter-bar">
        ${page.filters.map((item) => `<button class="filter-pill" data-action="noop">${escapeHtml(item)}</button>`).join('')}
      </div>
    </section>
    <section class="report-grid" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
      ${page.cards.map((card) => `
        <div class="report-card">
          <header>
            <strong>${escapeHtml(card.title)}</strong>
            <span class="status-badge ${card.tags[1] === '已订阅' ? 'ok' : ''}">${escapeHtml(card.tags[1])}</span>
          </header>
          <p>${card.tags.join(' · ')}</p>
          <p style="margin-top:6px;">Updated: ${escapeHtml(card.updated)}</p>
        </div>
      `).join('')}
    </section>
    <section class="card">
      <h2>Selected Report Detail</h2>
      <div class="detail-card">
        <header>
          <strong>${escapeHtml(page.detail.title)}</strong>
          <span class="status-badge ok">已选择</span>
        </header>
        ${page.detail.lines.map((line) => `<p style="margin-bottom:10px;">${escapeHtml(line)}</p>`).join('')}
        <div class="action-row" style="margin-top:14px;">
          ${page.detail.actions.map((action, index) => `<button class="${index === 0 ? 'primary-btn' : 'secondary-btn'}" data-action="noop">${escapeHtml(action)}</button>`).join('')}
        </div>
      </div>
    </section>
    <section class="card">
      <h2>Subscription Section</h2>
      <div class="list-stack">
        ${page.subscriptions.map((item) => `<div class="list-card"><p>${escapeHtml(item)}</p></div>`).join('')}
      </div>
      <div class="action-row" style="margin-top:14px;">
        <button class="primary-btn" data-action="noop">${escapeHtml(page.subscriptionAction)}</button>
      </div>
    </section>
  `;
}

function renderHome(page) {
  return `
    ${renderPageHeader(page)}
    ${renderSummaryCards(page.summaryCards)}
    ${renderHero(page.hero)}
    ${renderPrompts('Recommended Questions', page.prompts)}
    ${renderConversation(page.conversation)}
  `;
}

function renderMain() {
  const page = pages[state.page];
  const body = (() => {
    switch (state.page) {
      case 'home': return renderHome(page);
      case 'analysis': return renderAnalysis(page);
      case 'risk': return renderRisk(page);
      case 'tasks': return renderTasks(page);
      case 'reports': return renderReports(page);
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

function renderPanelContent() {
  const key = state.panelTab;
  const items = panelItemsForCurrentPage();
  return items
    .map(
      (item) => `
      <div class="panel-card">
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.subtitle || item.meta || '')}</p>
        ${item.status ? `<div class="tag-row"><span class="status-badge ${item.status === '即将超时' ? 'danger' : item.status === '处理中' ? 'ok' : 'warn'}">${escapeHtml(item.status)}</span></div>` : ''}
        ${item.action ? `<div class="action-row" style="margin-top:12px;"><button class="secondary-btn" ${interactiveAttrs(item.action)}>${escapeHtml(item.action)}</button></div>` : ''}
      </div>
    `,
    )
    .join('');
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

  app.querySelectorAll('[data-page]').forEach((node) => {
    node.addEventListener('click', () => {
      const next = node.getAttribute('data-page');
      state.page = next;
      state.panelTab = pages[next].defaultPanel;
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