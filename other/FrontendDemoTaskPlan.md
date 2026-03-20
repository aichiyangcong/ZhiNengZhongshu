# 前端 Demo 任务图与分工方案

基于 `other/WorkbenchAscii_v2.md`，这份文档只面向 **前端 Demo 开发**。

约束前提：
- 只做前端 Demo，不做后端接口
- 所有数据使用本地 mock data / 常量 / JSON 文件驱动
- 不做真实权限系统、真实消息系统、真实订阅系统
- 目标是尽快把 5 个页面跑起来，并保证组件复用和页面切换顺畅

---

## 1. 目标定义

### 1.1 这次要交付什么
前端 Demo 需要完整覆盖 5 个页面：
1. `AI 工作台首页`
2. `经营分析页`
3. `门店风险页`
4. `任务协同页`
5. `报告中心页`

### 1.2 这次不做什么
- 不接真实接口
- 不做登录态
- 不做真实权限控制
- 不做复杂图表交互
- 不做真实消息推送
- 不做真实任务流转持久化

换句话说，这次交付的是一个 **结构完整、交互可演示、数据可假、页面能讲故事** 的前端壳子。

---

## 2. 架构判断：怎么拆最合理

如果只是把 5 个页面分别做掉，短期能出图，但后面会很难维护。更合理的拆法应该是：

### 第一层：工作台主框架
先把整个系统的公共骨架搭出来：
- Top Bar
- Left Nav
- Right Panel
- 页面路由切换
- 统一样式体系

### 第二层：跨页复用模块
把多个页面都会用到的模块抽出来：
- KPI 摘要卡
- 列表卡片 / 表格容器
- 详情面板
- 对话线程块
- 右侧任务/提醒/报告面板
- 筛选条
- Follow-up chips

### 第三层：页面业务模块
在公共骨架和公共组件之上，再做每个页面的特有内容。

这个拆法的核心收益是：
- 页面并行开发可行
- Demo 风格更统一
- 后面真要落业务，也不至于全部推翻

---

## 3. 推荐任务图

推荐按 4 层任务图推进：

```text
T0 项目初始化
 ├─ T1 工作台主框架与全局布局
 │   ├─ T1.1 Top Bar
 │   ├─ T1.2 Left Nav
 │   ├─ T1.3 Right Panel Tabs
 │   └─ T1.4 路由与页面容器
 │
 ├─ T2 共享基础组件
 │   ├─ T2.1 KPI / Summary Card
 │   ├─ T2.2 Section Header
 │   ├─ T2.3 Filter Bar
 │   ├─ T2.4 Table / List 容器
 │   ├─ T2.5 Detail Panel / Drawer
 │   ├─ T2.6 Question Chips / Action Buttons
 │   └─ T2.7 Report / Task / Alert 简卡
 │
 ├─ T3 页面业务实现
 │   ├─ T3.1 AI 工作台首页
 │   ├─ T3.2 经营分析页
 │   ├─ T3.3 门店风险页
 │   ├─ T3.4 任务协同页
 │   └─ T3.5 报告中心页
 │
 └─ T4 Demo 打磨
     ├─ T4.1 页面跳转串联
     ├─ T4.2 mock 数据统一
     ├─ T4.3 交互细节补齐
     └─ T4.4 Demo 演示路径校验
```

关键依赖关系：
- `T0 -> T1 -> T2 -> T3 -> T4`
- 但 `T2` 和 `T3` 可以部分交叉推进
- 页面开发必须建立在 `工作台主框架` 基础之上

---

## 4. 推荐分工方案

如果按 4 个人来做，我建议这样分。

### 角色 A：前端架构 / 主程
负责整个 Demo 的底座，不负责某一个具体页面。

**职责**
- 项目初始化
- 路由结构
- 全局布局骨架
- 样式变量 / spacing / typography 基线
- 共享组件抽象
- mock 数据组织方式
- 最终集成和收口

**负责任务**
- `T0`
- `T1`
- `T2` 的主导
- `T4` 的集成

**为什么必须单独有人负责**
因为如果没有一个人统一壳子和组件标准，5 个页面最后会像 5 个独立 demo 拼起来的，不像一套系统。

---

### 角色 B：页面负责人 1
负责“首页 + 经营分析页”。

**职责**
- 首页信息结构落地
- 经营分析页核心内容落地
- 对话线程、结论卡、分析区块联动

**负责任务**
- `T3.1 AI 工作台首页`
- `T3.2 经营分析页`

**原因**
这两个页面叙事连续：
- 首页负责入口
- 经营分析页负责“查数 + 归因 + 建议”

由同一个人负责，逻辑会更顺。

---

### 角色 C：页面负责人 2
负责“门店风险页 + 任务协同页”。

**职责**
- 风险列表与详情抽屉
- 任务列表与任务详情
- 风险到任务的跳转串联

**负责任务**
- `T3.3 门店风险页`
- `T3.4 任务协同页`

**原因**
这两个页面是执行闭环链路：
- 风险识别
- 生成任务
- 跟踪执行

属于一个完整业务段，适合一人负责。

---

### 角色 D：页面负责人 3
负责“报告中心页 + Demo 数据体验”。

**职责**
- 报告中心页
- 右侧报告面板内容
- 全局 mock 数据填充和文案统一
- 帮助各页面补齐能讲故事的数据

**负责任务**
- `T3.5 报告中心页`
- `T4.2 mock 数据统一`

**原因**
报告中心和 mock 数据高度相关。
如果报告页和假数据由不同人做，很容易出现文案风格和口径不一致。

---

## 5. 页面与模块复用关系

这是最关键的一部分。要避免每页重新造轮子。

### 5.1 全局复用模块

#### M1. `WorkbenchShell`
**被复用页面**
- 全部 5 页

**包含**
- Top Bar
- Left Nav
- Right Panel
- 主内容容器

#### M2. `RightPanelTabs`
**被复用页面**
- 全部 5 页

**变化项**
- 默认高亮 tab 不同
- 内容数据不同

#### M3. `SectionHeader`
**被复用页面**
- 全部 5 页

**用途**
- 每个页面的 Page Header
- 每个内容块标题

#### M4. `MetricCard`
**被复用页面**
- 首页
- 门店风险页
- 任务协同页

**用途**
- KPI 概览卡
- 状态摘要卡

#### M5. `ActionChipGroup`
**被复用页面**
- 首页
- 经营分析页
- 部分可用于风险页

**用途**
- 推荐问题
- Follow-up questions
- 快捷动作按钮

#### M6. `FilterBar`
**被复用页面**
- 门店风险页
- 任务协同页
- 报告中心页

**变化项**
- 筛选字段不同
- 样式一致

#### M7. `SplitPanel`
**被复用页面**
- 门店风险页
- 任务协同页

**用途**
- 左侧列表 / 右侧详情
- 列表 + 详情联动

#### M8. `InfoTable`
**被复用页面**
- 经营分析页
- 后续可复用到报告中心详情

#### M9. `CardGrid`
**被复用页面**
- 报告中心页
- 首页也可部分复用

---

## 6. 任务分解到可开发粒度

下面这部分是可以直接拿来排开发的。

### T0 项目初始化
**责任人**：角色 A

**任务项**
- 建立前端项目
- 选择 UI 技术方案
- 配置路由
- 配置目录结构
- 配置 mock 数据目录
- 配置全局样式和设计 token

**产出**
- 可运行的前端项目基础框架
- 空白壳子可切换 5 个页面

**依赖**
- 无

---

### T1 工作台主框架与全局布局
**责任人**：角色 A

**任务项**
- Top Bar 组件
- Left Nav 组件
- Right Panel Tabs 组件
- 三栏布局容器
- 页面标题容器

**产出**
- 全部页面共享的统一壳子

**依赖**
- `T0`

---

### T2 共享基础组件
**责任人**：角色 A 主导，角色 B/C/D 协作

**任务项**
- `MetricCard`
- `SectionHeader`
- `FilterBar`
- `ActionChipGroup`
- `InfoTable`
- `SplitPanel`
- `ReportCard`
- `AlertCard`
- `TaskCard`

**产出**
- 可复用基础组件库

**依赖**
- `T1`

---

### T3.1 AI 工作台首页
**责任人**：角色 B

**页面模块**
- Page Header
- Summary Strip
- Hero Card
- Recommended Questions
- Default Conversation Thread
- Right Panel 提醒态

**复用组件**
- `MetricCard`
- `ActionChipGroup`
- `AlertCard`
- `SectionHeader`

**依赖**
- `T1`
- 部分依赖 `T2`

---

### T3.2 经营分析页
**责任人**：角色 B

**页面模块**
- Query Bar
- Conclusion Card
- Insight Cards
- Visualization Area
- Detail Table
- Follow-up Questions
- Right Panel 报告态

**复用组件**
- `SectionHeader`
- `InfoTable`
- `ActionChipGroup`
- `ReportCard`

**依赖**
- `T1`
- `T2`

**备注**
- 图表可以先用静态占位块或轻量 chart mock
- 不需要真实数据交互

---

### T3.3 门店风险页
**责任人**：角色 C

**页面模块**
- Filter Bar
- Risk Overview
- Risk List
- Risk Detail Drawer
- Right Panel 任务态

**复用组件**
- `FilterBar`
- `MetricCard`
- `SplitPanel`
- `TaskCard`

**依赖**
- `T1`
- `T2`

---

### T3.4 任务协同页
**责任人**：角色 C

**页面模块**
- Task Summary
- Task Filter Bar
- Task List
- Task Detail Panel
- Right Panel 任务态

**复用组件**
- `MetricCard`
- `FilterBar`
- `SplitPanel`
- `TaskCard`

**依赖**
- `T1`
- `T2`
- 和 `T3.3` 有强业务连续性，但可以并行开发

---

### T3.5 报告中心页
**责任人**：角色 D

**页面模块**
- Report Filter Bar
- Report Card Grid
- Selected Report Detail
- Subscription Section
- Right Panel 报告态

**复用组件**
- `FilterBar`
- `CardGrid`
- `ReportCard`
- `SectionHeader`

**依赖**
- `T1`
- `T2`

---

### T4 Demo 打磨
**责任人**：角色 A 主导，B/C/D 配合

**任务项**
- 页面跳转联调
- mock 数据统一
- 文案统一
- 视觉 spacing 统一
- 演示路径排查
- 明显 bug 修复

**依赖**
- `T3.1 ~ T3.5` 基本完成

---

## 7. 建议目录结构

既然还没有前端结构，我建议一开始就按 Demo 友好的方式建。

```text
src/
  workspace/
    router/
    layout/
  pages/
    workbench-home/
    analysis/
    risk/
    tasks/
    reports/
  components/
    workbench-shell/
    top-bar/
    left-nav/
    right-panel/
    metric-card/
    filter-bar/
    section-header/
    info-table/
    split-panel/
    action-chip-group/
    report-card/
    task-card/
    alert-card/
  mocks/
    home.ts
    analysis.ts
    risk.ts
    tasks.ts
    reports.ts
    shared.ts
  styles/
    tokens.css
    globals.css
```

这个目录的好处是：
- 页面和组件分离清楚
- mock 数据集中管理
- 后续即使接接口，也不需要重构太多

---

## 8. 依赖与并行关系

这里给一个更实际的并行视角。

### 串行必须项
1. `T0 项目初始化`
2. `T1 工作台主框架`

这两步没做完，其他人没法高效开工。

### 可以并行项
在 `T1` 完成后，可以并行：
- 角色 B：首页 + 经营分析
- 角色 C：门店风险 + 任务协同
- 角色 D：报告中心 + mock 数据
- 角色 A：持续补共享组件

### 强依赖关系
- 首页依赖 `RightPanelTabs`、`MetricCard`
- 经营分析依赖 `InfoTable`、`ActionChipGroup`
- 门店风险依赖 `FilterBar`、`SplitPanel`
- 任务协同依赖 `SplitPanel`、`TaskCard`
- 报告中心依赖 `CardGrid`、`ReportCard`

### 最容易卡住的地方
1. 右侧 Panel 做得太重
2. 共享组件抽象过度，导致反而开发慢
3. mock 数据风格不一致，导致 demo 很假
4. 页面自己写自己的 spacing，最后系统感不统一

---

## 9. 开发顺序建议

如果目标是尽快出一个能演示的版本，我建议顺序如下：

### 第一波：先把壳子跑起来
- `T0`
- `T1`

### 第二波：先做最关键的 3 页
- 首页
- 经营分析页
- 任务协同页

因为这 3 页已经够讲清楚：
- 从哪进
- AI 怎么分析
- 怎么转成执行

### 第三波：补风险页和报告中心页
- 门店风险页
- 报告中心页

### 第四波：统一 polish
- demo 文案
- 页面切换
- 假数据一致性
- hover / active / selected 状态

---

## 10. 给前端 Demo 的工程建议

### 10.1 数据策略
因为不做后端，所以建议所有页面采用：
- 页面级 mock 文件
- 统一 shared mock 常量
- 页面内不直接 hardcode 大段数据

### 10.2 状态策略
Demo 阶段不要上复杂状态管理。
建议：
- 轻量本地 state
- 页面内假交互切换
- 少量共享状态用于右侧 panel 或导航选中态

### 10.3 图表策略
不要在 Demo 阶段花太多时间做复杂图表。
建议：
- 先做静态图表占位
- 或用最轻量图表库
- 保证视觉上“像分析页”就够了

### 10.4 交互策略
所有交互只需要做到“可演示”：
- 点击问题 -> 切换到对应内容
- 点击任务 -> 加载详情
- 点击报告 -> 展示详情
- 点击按钮 -> 本地 toast / 本地状态更新

不需要真的有业务闭环。

---

## 11. 最终建议的执行模型

如果你现在要马上开始，我建议采用下面这个执行模型：

### Day 1
- 角色 A：完成项目初始化 + 工作台主框架
- 角色 D：先整理 mock 数据骨架

### Day 2
- 角色 B：开始首页 + 经营分析
- 角色 C：开始门店风险 + 任务协同
- 角色 D：开始报告中心
- 角色 A：补共享组件

### Day 3
- 全员联调
- 统一文案、间距、右侧 panel 行为
- 跑 demo 演示链路

这是最适合“纯前端 demo”节奏的拆法。

---

## 12. 结论

这次不需要按“页面 = 人”的方式粗暴拆分，而应该按：
- 一个人守底座
- 两个人守主业务链路
- 一个人守报告和 mock 数据

推荐最终分工：
- `角色 A`：架构 / 壳子 / 共享组件 / 集成
- `角色 B`：首页 + 经营分析
- `角色 C`：门店风险 + 任务协同
- `角色 D`：报告中心 + mock 数据

这是当前最稳、复用最高、并行效率也最高的拆法。
