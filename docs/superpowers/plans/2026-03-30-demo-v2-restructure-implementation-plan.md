# Demo V2 信息架构重构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前“按业务场景分页面”的 Demo 重构成“围绕智能体展开”的 AI 工作台，落地分组手风琴导航、多 tab 工作区、配置类工具页、定时任务主从视图，以及新建智能体弹窗。

**Architecture:** 保持当前纯前端单页 Demo 结构不变，继续以 `src/data.js` 承载种子数据、`src/main.js` 承载状态与渲染、`src/styles.css` 承载样式，最终再生成 `src/app.js` 供 `index.html` 直接加载。重构重点放在状态模型和派生 helper 上，不改会话卡片、结构化动作、toast 和动态沉淀逻辑的核心机制。

**Tech Stack:** Vanilla JS, HTML, CSS, `python3 -m http.server`, `node --check`

---

## File Structure

- Modify: `src/data.js`
  责任：把扁平导航和 page 归属数据改成“智能体中心”的种子数据，新增智能体、技能广场、应用授权、消息渠道、定时任务等 registry。
- Modify: `src/main.js`
  责任：重建状态结构、左侧导航、多 tab 工作区、右侧沉淀联动、配置页、automation 列表/详情、新建智能体弹窗和事件绑定。
- Modify: `src/styles.css`
  责任：补齐分组导航、手风琴、tab 栏、专家身份卡、配置卡片、automation 视图、模态弹窗、两栏/三栏布局切换和右侧淡入动效。
- Regenerate: `src/app.js`
  责任：将最新的 `src/data.js` 和 `src/main.js` 拼接成运行文件。

说明：
- 不新增运行时入口文件，避免打破 `index.html` 当前直接加载 `src/app.js` 的方式。
- 该仓库没有现成自动化测试框架，本计划的验证以 `node --check`、本地静态服务和浏览器手工验收为主。

### Task 1: 重建种子数据模型

**Files:**
- Modify: `src/data.js`
- Verify: `src/data.js`

- [ ] **Step 1: 把扁平导航改成分组导航与智能体 registry**

```js
export const navigationGroups = {
  main: [
    { id: 'home', label: '今日工作台', icon: '🏠', type: 'home' },
  ],
  tools: [
    { id: 'skills', label: '技能广场', icon: '⚡', type: 'config' },
    { id: 'connectors', label: '应用授权', icon: '🔗', type: 'config' },
    { id: 'channels', label: '消息渠道', icon: '💬', type: 'config' },
    { id: 'automation', label: '定时任务', icon: '⏰', type: 'automation' },
  ],
};

export const agents = [
  {
    id: 'analysis',
    name: '经营分析专家',
    icon: '📊',
    desc: '专注利润归因、渠道结构分析、目标追踪与动作建议',
    skills: ['利润诊断', '渠道拆解', '活动ROI', '目标追踪'],
    connectors: ['meituan', 'member'],
    channels: ['wecom'],
  },
  {
    id: 'risk',
    name: '门店风险专家',
    icon: '⚠️',
    desc: '识别门店风险、差评归因、库存预警与闭环处置',
    skills: ['差评聚类', '库存预警', '风险评级', 'QSC巡检'],
    connectors: ['meituan'],
    channels: ['wecom', 'feishu'],
  },
  {
    id: 'tasks',
    name: '任务协同专家',
    icon: '📋',
    desc: '任务拆解、派发、催办、回看与闭环管理',
    skills: ['任务拆解', '责任链路', '超时预警', '自动回看'],
    connectors: ['meituan'],
    channels: ['wecom'],
  },
];
```

- [ ] **Step 2: 让历史会话归属于智能体，并把页面数据改成 agent-aware**

```js
export const recentChats = [
  {
    id: 'conv-1',
    title: '3月目标追踪：渠道/品类/区域缺口',
    time: '3 分钟前',
    agentId: 'home',
    summary: '总目标达成约50%，线下缺口更大，需优先追赶三名掉队负责人',
    unread: 0,
  },
  {
    id: 'conv-2',
    title: '周三活动复盘：营收贡献与利润稀释',
    time: '8 分钟前',
    agentId: 'analysis',
    summary: '活动增收有效，但两片区执行次数高、利润贡献低，需要A/B收缩策略',
    unread: 0,
  },
  {
    id: 'conv-3',
    title: '平台口碑风险：好评率/差评/QSC归因',
    time: '15 分钟前',
    agentId: 'risk',
    summary: '综合好评率提升但差评集中度上升，QSC问题聚焦出餐、打包、食安记录',
    unread: 0,
  },
  {
    id: 'conv-4',
    title: '单店盈利提升方案：90天执行版',
    time: '22 分钟前',
    agentId: 'analysis',
    summary: '基于xlsx生成佳兆业店90天方案：线下引流+外卖投流+团购优化',
    unread: 0,
  },
  {
    id: 'conv-5',
    title: '总部任务闭环：拆解、派发、回看',
    time: '39 分钟前',
    agentId: 'tasks',
    summary: '总部任务拆解完成度68%，苏州片区超时风险高，需24h追赶',
    unread: 0,
  },
  {
    id: 'conv-6',
    title: '周营收+好差评综合报告沉淀',
    time: '1 小时前',
    agentId: 'analysis',
    summary: '周营收同比+8.5%，外卖占比42%，已生成图表快照并可下载',
    unread: 0,
  },
  {
    id: 'conv-7',
    title: '定时规则推送命中优先级',
    time: '2 小时前',
    agentId: 'home',
    summary: '今日命中9次，L1风险3次；下级提报占34%，建议分层推送',
    unread: 0,
  },
];

export const pages = {
  home: {
    title: '今日工作台',
    subtitle: '今日重点：利润、差评、库存',
    defaultPanel: 'alerts',
    agentId: 'home',
  },
  analysis: {
    title: '经营分析专家',
    subtitle: '利润归因、渠道结构分析、目标追踪与动作建议',
    defaultPanel: 'reports',
    agentId: 'analysis',
  },
  risk: {
    title: '门店风险专家',
    subtitle: '识别门店风险、差评归因、库存预警与闭环处置',
    defaultPanel: 'alerts',
    agentId: 'risk',
  },
  tasks: {
    title: '任务协同专家',
    subtitle: '任务拆解、派发、催办、回看与闭环管理',
    defaultPanel: 'tasks',
    agentId: 'tasks',
  },
};
```

保留规则：

```text
仅修改 `pages.home` / `pages.analysis` / `pages.risk` / `pages.tasks` 的 title、subtitle、defaultPanel、agentId。
每个 page 现有的 focus、summaryCards、hero、prompts、conversation 结构原样保留，不新增 reports/push page。
```

- [ ] **Step 3: 增加技能广场、应用授权、消息渠道和 automation 种子数据**

```js
export const skillMarket = [
  { id: 'revenue', name: '查昨日营收', icon: '📈', desc: '一键查询昨日各渠道营收', installed: true, usedBy: ['home', 'analysis'] },
  { id: 'weekly-report', name: '生成周报', icon: '📊', desc: '按模板自动生成周期报告', installed: true, usedBy: ['home', 'analysis'] },
  { id: 'alert-rule', name: '建预警规则', icon: '🔔', desc: '配置阈值和推送对象', installed: true, usedBy: ['risk'] },
  { id: 'dish-analysis', name: '菜品表现分析', icon: '🍽️', desc: '按菜品维度拆解销量和评价', installed: false, usedBy: [] },
  { id: 'inspection', name: '巡检任务生成', icon: '📋', desc: '基于风险自动生成巡检清单', installed: false, usedBy: [] },
  { id: 'member', name: '会员贡献分析', icon: '💰', desc: '会员渠道占比和复购趋势', installed: false, usedBy: [] },
];

export const connectors = [
  { id: 'meituan', name: '美团经营数据', status: 'connected', desc: 'POS/外卖/团购/评价/督导', connectedAt: '3月20日', usedBy: ['home', 'analysis', 'risk'] },
  { id: 'member', name: '会员系统', status: 'connected', desc: '会员画像/复购/渠道占比', connectedAt: '3月18日', usedBy: ['analysis'] },
  { id: 'supply', name: '供应链系统', status: 'disconnected', desc: '库存/采购/供应商管理', usedBy: [] },
  { id: 'finance', name: '财务系统', status: 'disconnected', desc: '利润/成本/预算', usedBy: [] },
];

export const channels = [
  { id: 'wecom', name: '企业微信', status: 'enabled', desc: '推送日报/周报 · 接收任务回执', usedBy: ['analysis', 'tasks'] },
  { id: 'feishu', name: '飞书', status: 'disabled', desc: '规则推送 · 专题订阅', usedBy: ['risk'] },
  { id: 'dingtalk', name: '钉钉', status: 'disabled', desc: '告警推送 · 任务协同', usedBy: [] },
  { id: 'email', name: '邮件', status: 'partial', desc: '仅周报推送', usedBy: ['analysis'] },
];

export const automationTasks = [
  {
    id: 'auto-1',
    agentId: 'analysis',
    agentName: '经营分析专家',
    kind: 'report',
    title: '老板日报推送',
    schedule: '每日 08:00',
    channel: '企微',
    desc: '全国经营简报',
    status: 'active',
    totalRuns: 28,
    successRuns: 27,
    failedRuns: 1,
    lastTrigger: '今天 08:00',
    history: [
      { date: '3月30日', title: '全国经营简报', status: 'success' },
      { date: '3月29日', title: '全国经营简报', status: 'success' },
      { date: '3月28日', title: '全国经营简报', status: 'failed' },
      { date: '3月27日', title: '全国经营简报', status: 'success' },
    ],
  },
  {
    id: 'auto-2',
    agentId: 'analysis',
    agentName: '经营分析专家',
    kind: 'report',
    title: '区域周报推送',
    schedule: '周一 09:00',
    channel: '工作台+邮件',
    desc: '华东经营复盘',
    status: 'active',
    totalRuns: 4,
    successRuns: 4,
    failedRuns: 0,
    lastTrigger: '3月18日',
    history: [
      { date: '3月25日', title: '华东经营复盘', status: 'success' },
      { date: '3月18日', title: '华东经营复盘', status: 'success' },
    ],
  },
  {
    id: 'auto-3',
    agentId: 'risk',
    agentName: '门店风险专家',
    kind: 'alert',
    title: '外卖订单下滑预警',
    schedule: '实时',
    channel: '工作台+飞书',
    desc: '订单↓15%+差评↑',
    status: 'active',
    totalRuns: 42,
    successRuns: 39,
    failedRuns: 3,
    lastTrigger: '今天 10:22',
    history: [
      { date: '3月30日 10:22', title: '苏州片区预警', status: 'success' },
      { date: '3月30日 09:15', title: '南京片区预警', status: 'success' },
      { date: '3月29日 14:30', title: '杭州片区预警', status: 'failed' },
    ],
  },
  {
    id: 'auto-4',
    agentId: 'risk',
    agentName: '门店风险专家',
    kind: 'alert',
    title: '库存断货风险提醒',
    schedule: '实时',
    channel: '工作台',
    desc: '关键食材低于安全阈值',
    status: 'active',
    totalRuns: 15,
    successRuns: 15,
    failedRuns: 0,
    lastTrigger: '今天 08:55',
    history: [
      { date: '3月30日 08:55', title: '牛腩库存预警', status: 'success' },
    ],
  },
  {
    id: 'auto-5',
    agentId: 'tasks',
    agentName: '任务协同专家',
    kind: 'task',
    title: '专题周报订阅',
    schedule: '周五 17:00',
    channel: '飞书',
    desc: '春季上新/新店口碑',
    status: 'pending',
    totalRuns: 2,
    successRuns: 2,
    failedRuns: 0,
    lastTrigger: '3月21日',
    history: [
      { date: '3月28日', title: '春季上新专题', status: 'success' },
      { date: '3月21日', title: '新店口碑专题', status: 'success' },
    ],
  },
];
```

- [ ] **Step 4: 运行数据层语法与导出检查**

Run:

```bash
node --check src/data.js
node --input-type=module -e "import('./src/data.js').then((m) => { console.log(Object.keys(m).sort().join(',')); console.log(m.recentChats.every((item) => Boolean(item.agentId))); console.log(m.automationTasks.every((item) => Boolean(item.kind))); })"
```

Expected:

```text
无语法错误
agents,appMeta,automationTasks,channels,connectors,conversationPanels,conversations,navigationGroups,pages,recentChats,sharedPanels,skillMarket
true
true
```

- [ ] **Step 5: 提交数据模型改动**

```bash
git add src/data.js
git commit -m "feat: add agent-centered demo seed data"
```

### Task 2: 重建应用状态与 tab helper

**Files:**
- Modify: `src/main.js`
- Verify: `src/main.js`

- [ ] **Step 1: 更新 import 和 state 结构，给新建智能体与配置卡片预留本地可变副本**

```js
import {
  agents as seedAgents,
  appMeta,
  automationTasks,
  channels as seedChannels,
  connectors as seedConnectors,
  conversationPanels,
  conversations,
  navigationGroups,
  pages,
  recentChats,
  sharedPanels,
  skillMarket as seedSkillMarket,
} from './data.js';

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
  agents: [...seedAgents],
  skillMarket: structuredClone(seedSkillMarket),
  connectors: structuredClone(seedConnectors),
  channels: structuredClone(seedChannels),
  dynamicPanels: {
    tasks: [],
    alerts: [],
    reports: [],
  },
};
```

- [ ] **Step 2: 写入 tab、上下文和左侧联动 helper，替代 `state.page` 驱动**

```js
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

function setConversationContext(agentId, conversationId) {
  const label = agentId === 'home' ? '今日工作台' : getAgentById(agentId).name;
  openTab(agentId, conversationId ? 'history' : agentId === 'home' ? 'home' : 'agent', label, {
    agentId,
    conversationId: conversationId || null,
  });
}
```

- [ ] **Step 3: 补齐查询 helper 和跳转目标映射，去掉对 `reports` / `push` page 的依赖**

```js
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
```

- [ ] **Step 4: 运行主逻辑语法检查**

Run:

```bash
node --check src/main.js
```

Expected:

```text
无输出，退出码为 0
```

- [ ] **Step 5: 提交状态和 helper 改动**

```bash
git add src/main.js
git commit -m "refactor: add tab-driven workspace state"
```

### Task 3: 重写左侧导航、手风琴和中间 tab 栏

**Files:**
- Modify: `src/main.js`
- Verify: `src/main.js`

- [ ] **Step 1: 用分组 + 手风琴重写 `renderLeftNav()`**

```js
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
  const active = activeTab().id === agent.id;
  return `
    <div class="agent-accordion ${expanded ? 'expanded' : ''}">
      <button class="nav-btn ${active ? 'active' : ''}" data-nav-id="${agent.id}" data-nav-type="agent">
        <span class="nav-label">${escapeHtml(agent.icon)} ${escapeHtml(agent.name)}</span>
        <span class="nav-meta">+</span>
      </button>
      <div class="accordion-body">
        <button class="link-btn mini-action" data-nav-id="${agent.id}" data-nav-type="agent">+ 新建会话</button>
        <div class="simple-list">
          ${renderConversationLinks(agent.id)}
        </div>
      </div>
    </div>
  `;
}

function renderLeftNav() {
  return `
    <aside class="left-nav">
      <section>
        <div class="nav-group-title">主工作台</div>
        <div class="agent-accordion ${state.expandedAgentId === 'home' ? 'expanded' : ''}">
          <button class="nav-btn ${activeTab().id === 'home' ? 'active' : ''}" data-nav-id="home" data-nav-type="home">
            <span class="nav-label">🏠 今日工作台</span>
            <span class="nav-meta">+</span>
          </button>
          <div class="accordion-body">
            <button class="link-btn mini-action" data-nav-id="home" data-nav-type="home">+ 新建会话</button>
            <div class="simple-list">
              ${renderConversationLinks('home')}
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="nav-group-title">智能体</div>
        <div class="nav-list">
          ${state.agents.map((agent) => renderAgentNavItem(agent)).join('')}
          <button class="nav-btn nav-create-agent" data-action="open-create-agent">
            <span class="nav-label">➕ 新建智能体</span>
            <span class="nav-meta">选配技能/授权/渠道</span>
          </button>
        </div>
      </section>
      <section>
        <div class="nav-group-title">工具</div>
        <div class="nav-list">
          ${navigationGroups.tools
            .map(
              (item) => `
                <button class="nav-btn ${activeTab().id === item.id ? 'active' : ''}" data-nav-id="${item.id}" data-nav-type="${item.type}">
                  <span class="nav-label">${escapeHtml(item.icon)} ${escapeHtml(item.label)}</span>
                </button>
              `,
            )
            .join('')}
        </div>
      </section>
    </aside>
  `;
}
```

- [ ] **Step 2: 新增 `renderTabBar()` 并把主内容包装成“tab bar + body”**

```js
function renderTabBar() {
  return `
    <div class="workspace-tabs">
      ${state.tabs
        .map(
          (tab) => `
            <button class="workspace-tab ${tab.id === state.activeTabId ? 'active' : ''}" data-tab-id="${tab.id}">
              <span>${escapeHtml(tab.label)}</span>
              ${tab.closable ? `<span class="tab-close" data-close-tab="${tab.id}">×</span>` : ''}
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
```

- [ ] **Step 3: 改写点击事件绑定，统一走 `openTab()` / `setConversationContext()` / `closeTab()`**

```js
app.querySelectorAll('[data-nav-id]').forEach((node) => {
  node.addEventListener('click', () => {
    const id = node.getAttribute('data-nav-id');
    const type = node.getAttribute('data-nav-type');
    const label =
      id === 'home'
        ? '今日工作台'
        : navigationGroups.tools.find((item) => item.id === id)?.label || getAgentById(id)?.name || '未知页';

    openTab(id, type, label, { agentId: type === 'agent' ? id : type === 'home' ? 'home' : null, conversationId: null });
    renderApp();
  });
});

app.querySelectorAll('[data-conversation]').forEach((node) => {
  node.addEventListener('click', () => {
    const agentId = node.getAttribute('data-agent-id');
    const conversationId = node.getAttribute('data-conversation');
    setConversationContext(agentId, conversationId);
    renderApp();
  });
});

app.querySelectorAll('[data-tab-id]').forEach((node) => {
  node.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-tab]')) return;
    state.activeTabId = node.getAttribute('data-tab-id');
    syncLeftNav(state.activeTabId);
    renderApp();
  });
});

app.querySelectorAll('[data-close-tab]').forEach((node) => {
  node.addEventListener('click', (event) => {
    event.stopPropagation();
    closeTab(node.getAttribute('data-close-tab'));
    renderApp();
  });
});
```

- [ ] **Step 4: 手工验证左侧与 tab 行为**

Run:

```bash
python3 -m http.server 8000
```

Manual check:

```text
1. 打开首页后只存在一个不可关闭的“今日工作台” tab。
2. 点击“经营分析专家”后新开 tab，左侧只展开该智能体。
3. 再点“门店风险专家”后，经营分析收起、门店风险展开。
4. 点击任一历史会话，不新增新 tab，而是在父智能体 tab 内进入会话上下文。
5. 点击 tab 关闭按钮后，自动激活相邻 tab。
```

- [ ] **Step 5: 提交导航与 tab 改动**

```bash
git add src/main.js
git commit -m "feat: add grouped nav and workspace tabs"
```

### Task 4: 改写主内容渲染为 home / agent / history / config / automation

**Files:**
- Modify: `src/main.js`
- Verify: `src/main.js`

- [ ] **Step 1: 新增专家身份卡和 agent/history 内容渲染**

```js
function renderAgentIdentityCard(agent) {
  return `
    <section class="card expert-card">
      <div class="expert-card-title">${escapeHtml(agent.icon)} ${escapeHtml(agent.name)}</div>
      <p>${escapeHtml(agent.desc)}</p>
      <div class="expert-card-meta">
        <strong>已装技能：</strong>${escapeHtml(agent.skills.join(' · '))}
      </div>
    </section>
  `;
}

function renderAgentTab(agentId, conversationId = null) {
  const page = pages[agentId];
  const agent = getAgentById(agentId);
  const conversation = conversationId ? conversations[conversationId] : page.conversation;
  return renderMainFrame(`
    ${renderAgentIdentityCard(agent)}
    ${renderConversation(conversation)}
  `);
}

function renderHomeTab() {
  const page = pages.home;
  const conversation = state.activeConversationId ? conversations[state.activeConversationId] : page.conversation;
  return renderMainFrame(`
    ${renderRoleFocus('home', page)}
    ${renderConversation(conversation)}
  `);
}
```

- [ ] **Step 2: 新增三个纯展示配置页 renderer**

```js
function formatUsedBy(usedBy) {
  if (!usedBy.length) return '暂未被智能体调用';
  return usedBy.map((agentId) => getAgentById(agentId)?.name || agentId).join(' · ');
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
    <section class="config-list">
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
    <section class="config-list">
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
```

- [ ] **Step 3: 新增 automation 列表/详情 renderer，并用 `renderMain()` 分发所有 tab 类型**

```js
function filteredAutomationTasks() {
  return automationTasks.filter((task) => {
    const agentOk = state.automationFilterAgentId ? task.agentId === state.automationFilterAgentId : true;
    const kindOk = state.automationFilterKind ? task.kind === state.automationFilterKind : true;
    return agentOk && kindOk;
  });
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
            ${state.automationFilterAgentId ? `${getAgentById(state.automationFilterAgentId).name} ×` : '全部'}
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
  if (tab.type === 'home') return renderHomeTab();
  if (tab.type === 'agent') return renderAgentTab(tab.agentId);
  if (tab.type === 'history') return renderAgentTab(tab.agentId, tab.conversationId);
  if (tab.id === 'skills') return renderMainFrame(renderSkillMarket(), 'management');
  if (tab.id === 'connectors') return renderMainFrame(renderConnectors(), 'management');
  if (tab.id === 'channels') return renderMainFrame(renderChannels(), 'management');
  if (tab.type === 'automation') return renderAutomation();
  return renderHomeTab();
}
```

- [ ] **Step 4: 手工验证内容分发**

Run:

```bash
node --check src/main.js
python3 -m http.server 8000
```

Manual check:

```text
1. 今日工作台仍显示原会话流。
2. 智能体 tab 顶部出现专家身份卡。
3. 技能广场、应用授权、消息渠道都以静态卡片形式渲染，并显示“调用方”。
4. 定时任务 tab 以表格形式渲染，点击“详情”后进入主从详情页。
```

- [ ] **Step 5: 提交内容渲染改动**

```bash
git add src/main.js
git commit -m "feat: add agent, config, and automation renders"
```

### Task 5: 右侧沉淀区与 automation 跳转联动

**Files:**
- Modify: `src/main.js`
- Verify: `src/main.js`

- [ ] **Step 1: 把 `panelItemsForCurrentPage()` 改成按 active tab 解析上下文**

```js
function panelContext() {
  const tab = activeTab();
  if (tab.type === 'history' && tab.conversationId) {
    return {
      title: `📌 会话：${recentChats.find((item) => item.id === tab.conversationId)?.title || '当前会话'}`,
      agentId: tab.agentId,
      items: conversationPanels[tab.conversationId]?.[state.panelTab] || [],
    };
  }

  if (tab.type === 'home' || tab.type === 'agent') {
    const agentId = tab.agentId || 'home';
    const byAgent = {
      home: {
        tasks: [
          { title: '春菜上架任务', status: '处理中', chain: '总部运营 → 区域负责人 → 华东督导组', due: '2026-03-22 18:00', progress: '68%（8/12 店）', meta: '卡点：苏州 2 店未完成试菜回执', actions: ['查看全部任务'] },
          { title: '食安巡检任务', status: '超时风险', chain: '区域负责人 → 南京督导 → 5 家门店', due: '2026-03-20 20:00', progress: '60%（3/5 店）', meta: '高风险项：后厨留样记录不完整', actions: ['查看异常门店'] },
        ],
        alerts: [
          { title: '[高] 苏州片区差评率异常', status: '待处理', source: '美团餐饮AI助手主动发现', trigger: '今天 10:20', impact: '差评率 +1.8pct；影响 5 家门店', suggestion: '优先排查晚高峰出餐与打包 SOP', actions: ['查看异常门店'] },
          { title: '[中] 经营利润下滑提醒', status: '待处理', source: '下级提报', trigger: '今天 09:40', impact: '南京南区利润率 -1.3pct；外卖毛利承压', suggestion: '暂停低毛利活动并复核补贴规则', actions: ['看利润缺口'] },
        ],
        reports: [
          { title: '📈 周营收分析', source: '用户创建', snapshotId: '#RPT-20260316-003', generatedAt: '2026-03-16 09:00', summary: '本周营收同比增长 8.5%，外卖占比提升。', metrics: [{ label: '周营收', value: '¥128,450' }, { label: '同比', value: '+8.5%' }, { label: '外卖占比', value: '42%' }], verified: '已验证', evidence: ['综合好评率 96.2%，环比 +1.1pct', '抖音渠道贡献 12%，环比 +0.7pct', '差评集中门店：苏州园区店、南京中山店（QSC: 出餐/打包）'], actions: ['查看图表', '下载报告'] },
        ],
      },
      analysis: sharedPanels,
      risk: sharedPanels,
      tasks: sharedPanels,
    };

    return {
      title: agentId === 'home' ? '📌 今日工作台' : `📌 ${getAgentById(agentId).name} 的工作成果`,
      agentId,
      items: byAgent[agentId]?.[state.panelTab] || [],
    };
  }

  return { title: '', agentId: null, items: [] };
}
```

- [ ] **Step 2: 重写右侧 panel renderer，并在管理类 tab 激活时直接隐藏**

```js
function renderRightPanel() {
  if (isManagementTab()) {
    return '';
  }

  const context = panelContext();
  const tabs = [
    { id: 'tasks', label: '任务' },
    { id: 'alerts', label: '提醒' },
    { id: 'reports', label: '报告' },
  ];

  return `
    <aside class="right-panel fade-in">
      <div class="panel-context-label">${escapeHtml(context.title)}</div>
      <div class="panel-tabs">
        ${tabs.map((tab) => `<button class="tab-btn ${state.panelTab === tab.id ? 'active' : ''}" data-panel-tab="${tab.id}">${escapeHtml(tab.label)}</button>`).join('')}
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
  return `
    <div class="workspace ${isManagementTab() ? 'workspace--management' : 'workspace--conversation'}">
      ${renderLeftNav()}
      ${renderMain()}
      ${renderRightPanel()}
    </div>
  `;
}
```

- [ ] **Step 3: 让“查看全部”和结构化动作联动到 automation，不破坏既有 report/task 动作语义**

```js
function jumpToAutomationFromPanel() {
  const agentId = panelContext().agentId;
  state.automationFilterAgentId = agentId;
  state.automationFilterKind =
    state.panelTab === 'tasks' ? 'task' :
    state.panelTab === 'alerts' ? 'alert' :
    'report';
  state.automationDetailId = null;
  openTab('automation', 'automation', '定时任务');
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

  if (label === '查看规则详情' || label === '看定时推送') {
    state.automationFilterAgentId = activeAgentId();
    state.automationFilterKind = null;
    state.automationDetailId = null;
    openTab('automation', 'automation', '定时任务');
    renderApp();
    return true;
  }

  if (semantic === 'download') {
    triggerReportDownload();
    showToast('报告下载已触发（Demo）');
    return true;
  }

  return false;
}
```

- [ ] **Step 4: 手工验证右侧与 automation 联动**

Run:

```bash
node --check src/main.js
python3 -m http.server 8000
```

Manual check:

```text
1. 在 home / agent / history tab 下右侧 panel 可见，在 skills / connectors / channels / automation 下隐藏。
2. 切换不同 tab 时右侧标题跟随变成“今日工作台 / 专家工作成果 / 会话标题”。
3. 点击右侧“查看全部”会打开或激活 automation tab，并自动按当前智能体过滤。
4. 在 automation 页清空过滤后可以看到全部任务。
```

- [ ] **Step 5: 提交右侧联动改动**

```bash
git add src/main.js
git commit -m "feat: sync right panel with tab context"
```

### Task 6: 新建智能体模态弹窗与 mock 创建流程

**Files:**
- Modify: `src/main.js`
- Verify: `src/main.js`

- [ ] **Step 1: 新增 modal renderer 和表单草稿更新函数**

```js
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
```

- [ ] **Step 2: 提交创建逻辑，让新智能体写回左导航和配置卡片的 `usedBy`**

```js
function normalizeAgentId(name) {
  return name
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^a-z0-9-\u4e00-\u9fa5]/g, '') || `agent-${Date.now()}`;
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
    skills: state.skillMarket.filter((item) => state.createAgentDraft.skills.includes(item.id)).map((item) => item.name),
    connectors: [...state.createAgentDraft.connectors],
    channels: [...state.createAgentDraft.channels],
  };

  state.agents.push(agent);
  applyUsedBySelection(state.skillMarket, state.createAgentDraft.skills, agentId);
  applyUsedBySelection(state.connectors, state.createAgentDraft.connectors, agentId);
  applyUsedBySelection(state.channels, state.createAgentDraft.channels, agentId);
  state.isCreateAgentModalOpen = false;
  state.expandedAgentId = agentId;
  showToast('智能体已创建（Demo）');
}
```

- [ ] **Step 3: 绑定 modal 事件并把 modal 插入 `renderApp()`**

```js
function renderApp() {
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopBar()}
      ${renderWorkspace()}
      ${renderCreateAgentModal()}
    </div>
  `;

  app.querySelectorAll('[data-action="open-create-agent"]').forEach((node) => {
    node.addEventListener('click', () => {
      state.isCreateAgentModalOpen = true;
      renderApp();
    });
  });

  app.querySelectorAll('[data-action="close-create-agent"]').forEach((node) => {
    node.addEventListener('click', () => {
      state.isCreateAgentModalOpen = false;
      renderApp();
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
      renderApp();
    });
  });
}
```

- [ ] **Step 4: 手工验证创建流程**

Run:

```bash
node --check src/main.js
python3 -m http.server 8000
```

Manual check:

```text
1. 点击“➕ 新建智能体”后出现模态弹窗。
2. 勾选技能/授权/渠道并创建后，左侧智能体分组新增条目。
3. 对应的技能、授权、渠道卡片底部“调用方”会追加新智能体。
4. 创建后弹出“智能体已创建（Demo）” toast。
```

- [ ] **Step 5: 提交 modal 改动**

```bash
git add src/main.js
git commit -m "feat: add create-agent modal flow"
```

### Task 7: 样式、生成运行文件和最终验收

**Files:**
- Modify: `src/styles.css`
- Regenerate: `src/app.js`
- Verify: `src/data.js`
- Verify: `src/main.js`
- Verify: `src/app.js`

- [ ] **Step 1: 为新布局和新组件补齐样式**

```css
.workspace--conversation {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 320px;
  gap: 20px;
  padding: 20px;
}

.workspace--management {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 20px;
  padding: 20px;
}

.workspace-tabs {
  display: flex;
  gap: 10px;
  padding: 4px;
  margin-bottom: 16px;
  overflow-x: auto;
}

.workspace-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 999px;
  padding: 9px 14px;
}

.workspace-tab.active {
  border-color: var(--border-strong);
  background: var(--accent-soft);
}

.agent-accordion .accordion-body {
  display: none;
  padding: 8px 0 0 12px;
}

.agent-accordion.expanded .accordion-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.expert-card,
.config-card,
.automation-card,
.modal-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.automation-table {
  width: 100%;
  border-collapse: collapse;
}

.automation-table th,
.automation-table td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid var(--border);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  place-items: center;
}

.fade-in {
  animation: panel-fade 180ms ease;
}

@keyframes panel-fade {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 2: 重新生成 `src/app.js`**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
root = Path('.')
data = (root / 'src/data.js').read_text()
main = (root / 'src/main.js').read_text()
main_lines = main.splitlines()
if main_lines and main_lines[0].startswith('import '):
    main = '\n'.join(main_lines[1:]) + ('\n' if main.endswith('\n') else '')
app = data.replace('export const ', 'const ') + '\n' + main
(root / 'src/app.js').write_text(app)
PY
```

Expected:

```text
命令无输出，`src/app.js` 时间戳更新
```

- [ ] **Step 3: 做最终语法检查**

Run:

```bash
node --check src/data.js
node --check src/main.js
node --check src/app.js
```

Expected:

```text
三条命令都无输出，退出码均为 0
```

- [ ] **Step 4: 走完整条评审演示路径**

Run:

```bash
python3 -m http.server 8000
```

Manual check:

```text
1. 打开首页，看到今日工作台和默认展开的 home 历史会话。
2. 打开经营分析专家，看到新 tab、专家身份卡、右侧工作成果。
3. 切回今日工作台 tab，左侧与右侧联动恢复。
4. 打开技能广场、应用授权、消息渠道，确认管理页为两栏布局。
5. 新建一个智能体，确认左侧新增条目且配置卡片“调用方”变化。
6. 从右侧“查看全部”进入 automation，确认自动带入过滤条件。
7. 点开某个 automation 详情，确认可以“查看”“下载”“重试”和返回列表。
8. 点击某条历史会话，确认不新开 tab，只切到父智能体上下文。
```

- [ ] **Step 5: 提交样式和产物**

```bash
git add src/styles.css src/app.js src/main.js src/data.js
git commit -m "feat: finish demo v2 workspace restructure"
```

## Self-Review

### Spec coverage

- Section 4 布局切换：
  Task 5 和 Task 7 通过 `workspace--conversation` / `workspace--management` 完成三栏和两栏切换。
- Section 5 左侧导航重构：
  Task 1 提供新数据结构，Task 3 落地分组导航和手风琴。
- Section 6 多 tab 系统：
  Task 2 和 Task 3 完成 `tabs` state、`openTab()`、`closeTab()`、`syncLeftNav()` 和事件联动。
- Section 7 右侧沉淀区：
  Task 5 完成上下文标题、按 tab 类型显示/隐藏和“查看全部”跳转。
- Section 8 静态配置页：
  Task 1 提供数据，Task 4 渲染技能广场、应用授权、消息渠道。
- Section 9 新建智能体：
  Task 6 完成 modal、mock 创建和调用方回写。
- Section 10 定时任务：
  Task 1 提供 `automationTasks`，Task 4 提供列表/详情，Task 5 完成过滤联动。
- Section 11 不变部分：
  计划没有改会话消息结构、`handleStructuredAction` 主干能力、toast 机制和品牌呈现。

无遗漏项。

### Placeholder scan

- 没有使用 `TODO`、`TBD`、`similar to Task N`、`appropriate handling` 这类占位语句。
- 所有改代码步骤都给出了具体代码片段。
- 所有验证步骤都给出了具体命令或手工验收项。

### Type consistency

- 导航主键统一使用 `home` / `analysis` / `risk` / `tasks` / `skills` / `connectors` / `channels` / `automation`。
- 历史会话统一使用 `recentChats[].agentId` 归属智能体。
- automation 过滤补充了 `automationFilterKind` 和 `automationTasks[].kind`，这是为了满足 spec 7.3 中“任务/提醒/报告”来源过滤，否则仅有 `automationFilterAgentId` 无法区分来源类型。
- 所有新建智能体相关状态统一收口在 `state.createAgentDraft` 和 `state.isCreateAgentModalOpen`。
