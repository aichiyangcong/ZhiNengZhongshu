# Demo V2 信息架构重构设计

日期：2026-03-30
状态：待实现

## 1. 背景与目标

当前 Demo 是"按业务场景分页面"的扁平导航结构（6 个平级入口）。老板要求参考竞品，将信息架构重构为"以智能体为中心、按能力类型分层"的结构，引入智能体、技能广场、应用授权、消息渠道等概念。

**核心目标：** 让评审者看到的不是"一个有 6 个页面的后台"，而是"一个有专家团队、可扩展技能、可连接外部系统的 AI 工作台平台"。

**核心设计原则：一切围绕智能体展开。**
- 历史会话归属到各自的智能体下
- 技能/授权/渠道都标注"被哪些智能体调用"
- 新建智能体时选配技能+授权+渠道
- 定时任务是独立的执行日志视图

## 2. 概念定义

| 概念 | 定义 | 使用体验 |
|------|------|----------|
| 今日工作台 | 主智能体，通用对话入口 | 可通过技能广场安装额外 Skills 增强能力 |
| 智能体/专家 | 预置的多轮对话角色 | 有上下文记忆、专属视角、预装技能，打开即用 |
| 技能 (Skills) | 标准化快捷能力 | 可在技能广场浏览和安装，每个技能标注被哪些智能体调用 |
| 定时任务 | 自动化推送和规则 | 每个智能体都可创建，表格视图统一管理，可查看历史报告 |
| 应用授权 | 外部数据源连接器 | 配置页，展示已连接/未连接状态及调用方智能体 |
| 消息渠道 | IM 推送通道 | 配置页，展示企微/钉钉/飞书启用状态及调用方智能体 |

## 3. MVP 范围

| 模块 | 深度 | 说明 |
|------|------|------|
| 今日工作台 + 智能体 | 做实 | 有真实对话流、联动、沉淀、专家身份卡、手风琴历史会话 |
| 新建智能体 | 轻量 | 模态弹窗选配技能+授权+渠道，点击创建弹 toast + mock 新增 |
| 技能广场 | 静态壳子 | 卡片列表 + 安装状态 + 调用方标注，点击弹 toast |
| 应用授权 | 静态壳子 | 连接器卡片 + 已连接/未连接状态 + 调用方标注 |
| 消息渠道 | 静态壳子 | 渠道卡片 + 已启用/未启用状态 + 调用方标注 |
| 定时任务 | 复用已有 | 表格视图 + 执行统计 + 主从详情（历史报告可查看/下载） |

## 4. 布局规则（按 Tab 类型切换）

布局根据当前激活 tab 的类型动态切换：

**对话类 tab（home / agent / history）→ 三栏布局：**
```
┌─────────────────────────────────────────────────────────────────┐
│ 顶部栏：品牌 + 角色信息 + 搜索/通知                              │
├──────────┬─────────────────────────────────┬────────────────────┤
│ 左侧导航  │ 中间区：会话流                    │ 右侧：沉淀区       │
│ (分组结构) │ (多 Tab 栏 + 专家身份卡 + 对话)   │ [任务][提醒][报告] │
│ (手风琴)  │                                 │ [查看全部 →]       │
└──────────┴─────────────────────────────────┴────────────────────┘
```

**管理类 tab（config / automation）→ 两栏布局：**
```
┌─────────────────────────────────────────────────────────────────┐
│ 顶部栏：品牌 + 角色信息 + 搜索/通知                              │
├──────────┬──────────────────────────────────────────────────────┤
│ 左侧导航  │ 内容区（占满中间+右侧空间）                          │
│ (分组结构) │ 配置页卡片列表 / 定时任务表格                        │
│ (手风琴)  │                                                    │
└──────────┴──────────────────────────────────────────────────────┘
```

CSS 实现：管理类 tab 激活时 `.workspace` 从 `grid-template-columns: 260px minmax(0,1fr) 320px` 切换为 `grid-template-columns: 260px minmax(0,1fr)`，右侧 panel 隐藏。

## 5. 左侧导航重构

### 5.1 从扁平导航改为分组 + 手风琴结构

当前：
```
home / analysis / risk / tasks / reports / push（6 个平级）
+ 底部独立的 recentChats 列表
```

改为：
```
group: "main"
  └── home（今日工作台）                [+] 新建会话
      ├── 3月目标追踪...               3m    ← 归属于今日工作台的历史会话
      ├── 周三活动复盘...              8m
      └── ...

group: "agents"（智能体）
  ├── analysis → "经营分析专家"          [+] 新建会话
  │   ├── 利润率下降归因...            15m    ← 归属于该专家的历史会话
  │   └── 单店盈利提升...             22m
  ├── risk     → "门店风险专家"          [+] 新建会话
  │   └── 哪家门店风险最高...          15m
  ├── tasks    → "任务协同专家"          [+] 新建会话
  │   ├── 任务闭环跟进...             39m
  │   └── 总部任务拆解...              1h
  └── ➕ 新建智能体

group: "tools"（工具）
  ├── skills     → "技能广场"            icon: ⚡
  ├── connectors → "应用授权"            icon: 🔗
  ├── channels   → "消息渠道"            icon: 💬
  └── automation → "定时任务"            icon: ⏰
```

### 5.2 手风琴交互规则

- 默认只展开当前激活的智能体/工作台的历史会话
- 点击另一个智能体 → 收起当前展开的，展开新激活的
- 中间区切换 tab 时 → 左侧手风琴跟随展开对应智能体
- 工具页激活时 → 所有智能体/工作台的历史会话都收起，仅高亮对应工具条目

### 5.3 数据结构变化

- `navigation` 数组 → `navigationGroups` 分组对象
- `recentChats` 每条新增 `agentId` 字段，标记归属哪个智能体
- 新增 `agents` 数组：

```js
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

`recentChats` 每条新增 `agentId`：

```js
export const recentChats = [
  { id: 'conv-1', title: '3月目标追踪...', time: '3 分钟前', agentId: 'home' },
  { id: 'conv-2', title: '周三活动复盘...', time: '8 分钟前', agentId: 'home' },
  { id: 'conv-3', title: '平台口碑风险...', time: '15 分钟前', agentId: 'risk' },
  { id: 'conv-4', title: '单店盈利提升...', time: '22 分钟前', agentId: 'analysis' },
  { id: 'conv-5', title: '总部任务闭环...', time: '39 分钟前', agentId: 'tasks' },
  { id: 'conv-6', title: '周营收综合报告...', time: '1 小时前', agentId: 'analysis' },
  { id: 'conv-7', title: '定时规则推送...', time: '2 小时前', agentId: 'home' },
];
```

### 5.4 代码影响

- 改 `data.js`：导航数据结构，recentChats 增加 agentId，agents 增加 connectors/channels
- 改 `main.js`：`renderLeftNav()` 按分组+手风琴渲染
- 新增状态：`state.expandedAgentId`（当前展开的智能体 ID）

## 6. 中间区多 Tab 系统

### 6.1 Tab 行为规则

- 点击左侧任意入口 → 已有 tab 则激活跳转，没有则新建并激活
- 今日工作台 tab 始终存在、不可关闭
- 其他所有 tab 可关闭（×按钮）
- 同一个智能体/页面不能重复开 tab

### 6.2 Tab 类型

| type | 渲染内容 |
|------|----------|
| `home` | 今日工作台：聚焦摘要 + 默认会话流 |
| `agent` | 专家身份卡 + 独立会话流 |
| `config` | 静态配置页（技能广场/应用授权/消息渠道） |
| `automation` | 定时任务表格 + 主从详情 |
| `history` | 历史会话（归属于某个智能体上下文） |

### 6.3 State 变化

```js
// 当前
state = {
  page: 'home',
  panelTab: 'alerts',
  activeConversationId: null,
  dynamicPanels: { ... },
}

// 改为
state = {
  tabs: [
    { id: 'home', type: 'home', label: '今日工作台', closable: false }
  ],
  activeTabId: 'home',
  expandedAgentId: 'home',   // 左侧手风琴当前展开的智能体
  panelTab: 'alerts',
  dynamicPanels: { ... },
}
```

### 6.4 中间 Tab ↔ 左侧导航联动规则

| 用户动作 | 中间区 | 左侧 | 右侧 |
|---------|--------|------|------|
| 点击左侧智能体/工作台 | 新增/激活对应 tab | 高亮该条目 + 手风琴展开 | 切换到该智能体上下文 |
| 点击左侧工具条目 | 新增/激活对应 tab | 高亮该条目 + 所有手风琴收起 | 切换到对应配置说明 |
| 点击左侧历史会话条目 | 在父智能体 tab 内切换到该会话 | 高亮该会话条目 | 切换到该会话的沉淀数据 |
| 点击中间 tab 切换 | 激活该 tab | 跟随高亮 + 手风琴跟随展开/收起 | 跟随切换上下文 |
| 关闭中间某 tab | 激活相邻 tab | 跟随新激活的 tab 更新 | 跟随更新 |

### 6.5 历史会话 Tab 创建规则

点击左侧历史会话条目时：
- 不新建独立 tab，而是在其父智能体的 tab 内切换到该会话
- 如果父智能体 tab 未打开 → 先打开父智能体 tab，再切入该会话
- 右侧数据源 = `conversationPanels[convId]`
- 会话内容 = `conversations[convId]`

### 6.6 核心函数变化

- 新增 `openTab(id, type, label)` — 打开或激活 tab
- 新增 `closeTab(id)` — 关闭 tab（不可关闭 home）
- 新增 `syncLeftNav(activeTabId)` — 切换 tab 时同步左侧高亮和手风琴状态
- `renderMain()` 根据 `activeTab.type` 分发渲染，不再用 `switch(state.page)`
- 左侧点击事件从 `state.page = next` 改为调用 `openTab()`
- 新增 `renderTabBar()` — 渲染中间区顶部 tab 栏

### 6.7 专家身份卡

agent 类型 tab 顶部显示专家信息：

```
┌───────────────────────────────────────────┐
│ 📊 经营分析专家                            │
│ 专注利润归因、渠道结构分析、目标追踪...     │
│ 已装技能：利润诊断 · 渠道拆解 · 活动ROI    │
└───────────────────────────────────────────┘
```

数据来自 `agents` 配置。

## 7. 右侧沉淀区（仅对话类 tab 显示）

### 7.1 显示条件

右侧沉淀区仅在对话类 tab（home / agent / history）激活时显示。
config 和 automation 类 tab 激活时，右侧 panel 隐藏，内容区占满。

### 7.2 联动规则

| 激活 tab 类型 | 右侧标题 | 数据源 |
|-------------|---------|--------|
| `home` | "📌 今日工作台" | byAgent.home |
| `agent` | "📌 {专家名} 的工作成果" | byAgent[agentId] |
| `history`（在智能体内） | "📌 会话：{会话标题}" | conversationPanels[convId] |

### 7.3 "查看全部"跳转

右侧沉淀区底部固定一个"查看全部"按钮，点击后：
- 跳转到 automation tab（新增/激活）
- 自动按当前智能体过滤定时任务列表
- 用户可手动清除过滤查看全部

| 右侧当前 sub-tab | 点击"查看全部" | 效果 |
|---------|---------|---------|
| 任务 | 跳转 automation tab | 过滤为当前智能体的定时任务 |
| 提醒 | 跳转 automation tab | 过滤为当前智能体的提醒类 |
| 报告 | 跳转 automation tab | 过滤为当前智能体的报告类 |

### 7.4 渲染变化

- `renderRightPanel()` 顶部新增上下文标签行
- `panelItemsForCurrentPage()` → `panelItemsForActiveTab()`
- 切换 tab 时右侧做淡入动效（CSS transition）
- 管理类 tab 激活时跳过右侧渲染

### 7.5 数据迁移

当前 `byPage` 的数据按 page id 索引（home/analysis/risk/...），迁移为按 agent id 索引。由于 agent id 和 page id 一致（analysis/risk/tasks），数据结构基本直接复用。

## 8. 静态配置页

### 8.1 技能广场

卡片网格布局，每张卡片包含：名称、图标、描述、安装状态、**调用方智能体列表**。

```js
export const skillMarket = [
  { id: 'revenue', name: '查昨日营收', icon: '📈',
    desc: '一键查询昨日各渠道营收', installed: true,
    usedBy: ['home', 'analysis'] },
  { id: 'weekly-report', name: '生成周报', icon: '📊',
    desc: '按模板自动生成周期报告', installed: true,
    usedBy: ['home', 'analysis'] },
  { id: 'alert-rule', name: '建预警规则', icon: '🔔',
    desc: '配置阈值和推送对象', installed: true,
    usedBy: ['risk'] },
  { id: 'dish-analysis', name: '菜品表现分析', icon: '🍽️',
    desc: '按菜品维度拆解销量和评价', installed: false,
    usedBy: [] },
  { id: 'inspection', name: '巡检任务生成', icon: '📋',
    desc: '基于风险自动生成巡检清单', installed: false,
    usedBy: [] },
  { id: 'member', name: '会员贡献分析', icon: '💰',
    desc: '会员渠道占比和复购趋势', installed: false,
    usedBy: [] },
];
```

卡片展示示例：
```
┌───────────────────────────────────────────┐
│ 📈 查昨日营收                    [已安装]  │
│ 一键查询昨日各渠道营收                     │
│ 调用方：今日工作台 · 经营分析专家          │
└───────────────────────────────────────────┘
```

### 8.2 应用授权（Connectors）

纵向卡片列表，每张卡片包含：名称、描述、连接状态、**调用方智能体列表**。

```js
export const connectors = [
  { id: 'meituan', name: '美团经营数据', status: 'connected',
    desc: 'POS/外卖/团购/评价/督导', connectedAt: '3月20日',
    usedBy: ['home', 'analysis', 'risk'] },
  { id: 'member', name: '会员系统', status: 'connected',
    desc: '会员画像/复购/渠道占比', connectedAt: '3月18日',
    usedBy: ['analysis'] },
  { id: 'supply', name: '供应链系统', status: 'disconnected',
    desc: '库存/采购/供应商管理',
    usedBy: [] },
  { id: 'finance', name: '财务系统', status: 'disconnected',
    desc: '利润/成本/预算',
    usedBy: [] },
];
```

### 8.3 消息渠道

纵向卡片列表，每张卡片包含：名称、状态、用途描述、**调用方智能体列表**。

```js
export const channels = [
  { id: 'wecom', name: '企业微信', status: 'enabled',
    desc: '推送日报/周报 · 接收任务回执',
    usedBy: ['analysis', 'tasks'] },
  { id: 'feishu', name: '飞书', status: 'disabled',
    desc: '规则推送 · 专题订阅',
    usedBy: ['risk'] },
  { id: 'dingtalk', name: '钉钉', status: 'disabled',
    desc: '告警推送 · 任务协同',
    usedBy: [] },
  { id: 'email', name: '邮件', status: 'partial',
    desc: '仅周报推送',
    usedBy: ['analysis'] },
];
```

### 8.4 渲染

新增三个纯展示函数：
- `renderSkillMarket()` — 网格布局，每张卡片底部显示"调用方：{智能体名列表}"
- `renderConnectors()` — 纵向列表，每张卡片底部显示调用方
- `renderChannels()` — 纵向列表，每张卡片底部显示调用方

点击"安装/连接/启用"按钮只弹 toast，不执行逻辑。

## 9. 新建智能体（模态弹窗）

### 9.1 触发入口

左侧"智能体"分组底部的"➕ 新建智能体"按钮。

### 9.2 弹窗内容

```
┌─── 新建智能体 ───────────────────────────┐
│                                          │
│  名称：[________________]                │
│  描述：[________________]                │
│  图标：[选择]                            │
│                                          │
│  ── 选择技能 ──                          │
│  ☑ 查昨日营收                            │
│  ☑ 生成周报                              │
│  ☐ 建预警规则                            │
│  ☐ 菜品表现分析                          │
│  ...                                     │
│                                          │
│  ── 应用授权 ──                          │
│  ☑ 美团经营数据                          │
│  ☐ 会员系统                              │
│  ☐ 供应链系统                            │
│  ...                                     │
│                                          │
│  ── 消息渠道 ──                          │
│  ☑ 企业微信                              │
│  ☐ 飞书                                  │
│  ...                                     │
│                                          │
│         [取消]    [创建智能体]            │
└──────────────────────────────────────────┘
```

### 9.3 MVP 行为

- 技能/授权/渠道选项来自 `skillMarket` / `connectors` / `channels` 数据
- 点击"创建智能体"→ toast 提示"智能体已创建（Demo）"
- 左侧"智能体"分组新增一个条目（mock 数据，名称来自用户输入）
- 不需要真实持久化

### 9.4 代码影响

- `main.js` 新增 `renderCreateAgentModal()` 和 `showCreateAgentModal()`
- `styles.css` 新增模态弹窗样式

## 10. 定时任务（两栏布局 · 表格 + 主从视图）

定时任务为管理类 tab，使用两栏布局（左侧导航 + 内容区占满），无右侧沉淀区。

### 10.1 数据结构

```js
export const automationTasks = [
  {
    id: 'auto-1',
    agentId: 'analysis',
    agentName: '经营分析专家',
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

### 10.2 列表视图（默认）

表格形式展示所有定时任务，支持按智能体过滤：

```
⏰ 定时任务                    [全部▾] [经营分析专家 ×]  ← 来自"查看全部"的过滤条件

┌─────────┬──────────┬────┬────┬────┬────────┬─────────┐
│ 任务名   │ 频率     │ 总次│ 成功│ 失败│ 最近执行 │ 操作    │
├─────────┼──────────┼────┼────┼────┼────────┼─────────┤
│ 老板日报 │ 每日08:00│ 28 │ 27 │ 1  │ 今天   │ [详情]  │
│ 区域周报 │ 周一09:00│ 4  │ 4  │ 0  │ 3月18日│ [详情]  │
└─────────┴──────────┴────┴────┴────┴────────┴─────────┘
```

- 从右侧"查看全部"跳转来时，自动填入该智能体的过滤条件
- 过滤条件可手动清除（点 ×），恢复为全部
- 直接从左侧点击"定时任务"进入时，默认不过滤

### 10.3 主从详情视图

点击"详情"后，中间区切换为主从视图（不新开 tab）：

```
⏰ 定时任务 › 老板日报推送

来源：经营分析专家  频率：每日 08:00  渠道：企微
执行统计：总 28 次 · 成功 27 次 · 失败 1 次

── 历史报告 ──
┌──────────────────────────────────────────────────┐
│ 📄 3月30日 全国经营简报        ✅成功  [查看][下载]│
│ 📄 3月29日 全国经营简报        ✅成功  [查看][下载]│
│ 📄 3月28日 全国经营简报        ❌失败  [重试]     │
│ 📄 3月27日 全国经营简报        ✅成功  [查看][下载]│
│ ...                                               │
└──────────────────────────────────────────────────┘

[← 返回任务列表]
```

- [查看] → toast "报告查看（Demo）"
- [下载] → 触发下载（复用 `triggerReportDownload()`）
- [重试] → toast "已重试（Demo）"
- [← 返回任务列表] → 切回列表视图

### 10.4 代码影响

- `data.js` 新增 `automationTasks` 数组（含 history 字段）
- `main.js` 新增 `renderAutomation()` 和 `renderAutomationDetail(taskId)`
- `state` 新增 `automationDetailId`（当前展开的详情任务 ID，null 为列表视图）
- `state` 新增 `automationFilterAgentId`（从"查看全部"跳转时带入的过滤条件，null 为不过滤）

## 11. 不变的部分

以下内容保持不变，不在本次重构范围内：

- 会话内消息气泡和结构化卡片的渲染逻辑
- 右侧沉淀区的三个子 tab（任务/提醒/报告）
- 会话动作分层体系（沉淀型/状态型/回看型/导航型）
- `handleStructuredAction` 联动机制
- `upsertDynamicPanelItem` 动态沉淀卡逻辑
- 白底蓝色企业风格
- Toast 反馈机制
- 品牌名"美团餐饮AI助手"

注意：三栏布局比例（260px / flex / 320px）在对话类 tab 中保持不变，但管理类 tab 切换为两栏（260px / flex）。

## 12. 改动文件清单

| 文件 | 改动内容 |
|------|----------|
| `src/data.js` | 导航重构为分组、agents 增加 connectors/channels、recentChats 增加 agentId、新增 skillMarket/connectors/channels/automationTasks 数据 |
| `src/main.js` | 左侧分组+手风琴渲染、中间多 tab 系统+联动、右侧上下文联动、配置页渲染、新建智能体弹窗、定时任务表格+主从视图 |
| `src/styles.css` | tab 栏样式、手风琴动效、分组标题样式、配置页卡片样式（含调用方标注）、专家身份卡样式、模态弹窗样式、淡入动效、定时任务表格样式、两栏/三栏布局切换 |
| `src/app.js` | 重新生成（data.js + main.js 拼接） |

## 13. 评审叙事线

推荐评审时的演示路径：

1. **打开 → 今日工作台**：展示主智能体 + 全局聚焦摘要，左侧手风琴展开今日工作台的历史会话
2. **点击经营分析专家**：中间区新开 tab + 专家身份卡 + 对话流，左侧手风琴切换展开经营分析的历史会话，右侧跟随切换
3. **切回今日工作台 tab**（点中间 tab 栏）：左侧手风琴跟随切回，右侧也跟着切回
4. **点击技能广场**：展示所有技能卡片 + 调用方标注，说明"平台能力可被不同智能体调用"
5. **点击应用授权**：展示数据源连接状态 + 调用方标注
6. **点击消息渠道**：展示推送通道 + 调用方标注
7. **点击"新建智能体"**：弹出配置弹窗，展示可选技能/授权/渠道
8. **点击定时任务**：展示表格视图 + 执行统计，点详情展开历史报告列表
9. **点击某条历史会话**：展示在对应智能体 tab 内切换到具体会话上下文
