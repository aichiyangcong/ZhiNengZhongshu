# HANDOFF

更新时间：2026-03-20

## 1. 当前任务背景

这是一个 **PC 端前端静态 Demo**，用于表达一个新的 **Agent as a Service 工作台**。

当前阶段目标不是工程化落地，而是：
- 快速给用户一个可演示、可评审的前端 Demo
- 把产品表达从“传统页面后台”拉到“AI 数字员工对话工作台”
- 支持本地直接双击 `index.html` 演示

强约束：
- 只做前端 Demo
- 不接后端接口
- 不做真实数据持久化
- 用户明确强调这是 **PC 端，不是 App**
- 当前优先级是“可看、可点、可讲”，不是工程规范

## 2. 用户已经明确确认过的产品方向

这些不是猜测，是已经和用户对齐过的：

1. 左侧“最近会话”应该是 **全局 AI 会话流**，按时间倒排，不跟主导航绑定。
2. 点击某条最近会话后，进入 **会话态**。
3. 会话态下：
   - `Main Workspace` 只保留完整会话流
   - 不要再混入该页面原有的分析卡片、风险列表、任务列表、报告模块
4. 会话态下左侧高亮规则：
   - 只高亮当前会话
   - 主导航全部不要高亮
5. 右侧“沉淀结果”在会话态下必须收敛成 **当前会话的沉淀结果**，不能继续按页面维度展示。
6. AI 统一以 `Toast AI` 角色出现。
7. 系统触发、主动提醒、定时简报，都算 `Toast AI` 在主动汇报，而不是独立的系统消息源。
8. AI 回复不能只是一大段文字，应该像数字员工向老板汇报：
   - 结论先行
   - 再给指标
   - 再给证据/图表
   - 再给动作/任务/执行结果
9. 用户明确接受继续往“会话工作流”方向推进，并允许用 subagents 辅助，但最终落地由主 agent 完成。

## 3. 现在已经完成了什么

### 3.1 文档

已存在并可作为上下文使用的文档：
- `progress.md`：当前进度报告，已更新到最近状态
- `BRD.md`：当前 Demo 的产品定义、交互原则、信息架构与范围基线
- `other/v2.md`
- `other/MockData.md`
- `other/WorkbenchDemo.md`
- `other/WorkbenchWireframes.md`
- `other/WorkbenchAscii.md`
- `other/WorkbenchAscii_v2.md`
- `other/FrontendDemoTaskPlan.md`

### 3.2 前端运行方式

当前 Demo 文件：
- `index.html`
- `src/data.js`
- `src/main.js`
- `src/app.js`
- `src/styles.css`

关键点：
- `index.html` 现在直接加载 `src/app.js`
- `src/app.js` 是由 `src/data.js` + `src/main.js` 拼出来的非 module 文件
- 这样做是为了支持 `file://` 下直接双击打开，不再出现空白页

### 3.3 交互与状态

已经完成：
- 左侧最近会话改成全局 AI 会话流
- 最近会话点击后进入独立会话态
- 会话态下主导航不高亮
- 会话态下最近会话列表高亮当前会话
- 会话态下 `Main Workspace` 只渲染会话流
- 会话态下右侧 `任务 / 提醒 / 报告` 已按当前会话收敛

### 3.4 AI 会话内容

已经完成：
- `Toast AI` 统一承担系统触发 + 主动汇报角色
- 5 个主要业务场景都做成了多轮会话线程
- 还额外补了两条独立历史会话

当前已覆盖的会话：
- 午市经营复盘 + 牛腩补货处理
- 利润率下降归因拆解到门店和动作
- 哪家门店风险最高，先处理什么
- 任务生成后怎么跟进和回看
- 老板今天想看什么报告
- 春季菜品上新执行计划
- 会员复购分析 + 大众点评评价

### 3.5 AI 回复中的结构化卡片

已经接入的卡片类型：
- `summary` 结论卡
- `kpis` 指标卡
- `bars` 条形图卡
- `table` 证据表卡
- `task` 任务卡
- `agent` Agent 执行卡

渲染逻辑在 `src/main.js` 的 `renderStructuredCard()`。

## 4. 关键文件现状

### `src/data.js`

作用：
- 所有 mock 数据源
- 左侧最近会话数据
- 5 个页面数据
- 独立会话数据 `conversations`
- 会话态右侧数据 `conversationPanels`

当前最重要的数据结构：
- `recentChats`
- `pages`
- `conversations`
- `conversationPanels`

### `src/main.js`

作用：
- 全部渲染逻辑
- 状态管理
- 点击事件绑定

当前关键状态：
- `state.page`
- `state.panelTab`
- `state.activeConversationId`

当前关键逻辑：
- `activeConversation()`：返回当前独立会话
- `panelItemsForCurrentPage()`：如果有 `activeConversationId`，优先走 `conversationPanels`
- `renderConversation()`：渲染聊天工作区
- `renderMain()`：如果是会话态，则只渲染对话流

### `src/styles.css`

作用：
- 三栏布局样式
- 会话态样式
- 卡片样式
- 最近会话列表高亮样式

当前关键样式：
- `.chat-link.active`
- `.message-bubble.*`
- `.message-card*`
- `.conversation-*`
- `.artifact-grid`
- `.mini-kpi-grid`
- `.bar-chart`
- `.task-fields`
- `.agent-steps`

## 5. 我试过什么，什么有效

### 有效的方案

1. **从页面中心转向会话中心**
   - 之前主区是“页面模块 + 对话卡片”混合
   - 用户不满意
   - 改成“点击最近会话 -> 主区只剩完整会话流”后，方向明显更对

2. **把系统触发统一并入 `Toast AI`**
   - 之前系统提醒和 AI 回答分裂，像两个角色
   - 合并后更像一个数字员工在主动汇报

3. **AI 回复内插结构化卡片**
   - 只给文字时，用户明确说阅读负担太重
   - 加入结论卡、图表卡、任务卡后，更接近用户给的截图和期待

4. **右侧沉淀结果按当前会话收敛**
   - 之前右侧仍按页面维度展示，和会话态冲突
   - 改成按 `conversationPanels` 取数据后，逻辑更统一

5. **保留 `src/data.js` / `src/main.js` 作为源文件，再生成 `src/app.js`**
   - 这是当前最稳妥的本地静态演示方式

## 6. 我试过什么，什么没用 / 不够好

1. **把最近会话做成按页面切换的数据**
   - 这不符合用户想法
   - 用户明确指出最近会话应该是全局 AI 会话流，而不是跟随主导航变化

2. **主区保留页面模块，再加一个会话卡片**
   - 用户不认可
   - 他要的是“完整会话流工作区”，不是页面内容拼装

3. **只用一问一答的 mock**
   - 不够真实
   - 用户明确要求像数字员工汇报，要有多轮上下文和结构化证据

4. **右侧按页面上下文展示沉淀结果**
   - 在页面模式下可以接受
   - 但在会话态下用户已经明确否定，要改成当前会话维度

5. **最近会话按钮同时走 `data-page` 和普通页面点击逻辑**
   - 容易造成高亮和状态不一致
   - 后来改成独立监听 `data-conversation` 后更稳

## 7. 当前还没完成，但最值得继续做的事

按优先级排序：

### P1
1. **让推荐问题支持在当前会话中继续追问并追加消息**
   - 现在推荐问题更多还是静态按钮/跳转型
   - 下一个 agent 最应该继续把它做成“点击后在当前线程追加一轮 user + AI”

2. **继续加强“老板汇报感”的卡片与图表**
   - 当前有条形图卡和 KPI 卡，但还可以再补：
     - 趋势图占位卡
     - 门店对比卡
     - 推送编排卡
     - 会话小结卡

### P2
3. **把右侧进一步固定成会话产物结构**
   - 现在右侧虽然已经按当前会话收敛
   - 但还可以进一步收敛成更稳定的信息架构，比如：
     - 本次会话小结
     - 任务
     - Agent 执行
     - 协作同步
     - 报告输出

4. **继续增加更多会话内容密度**
   - 特别是 `conv-6`、`conv-7` 这两条独立会话，还可以继续做厚

### P3
5. **让页面模式和会话模式之间的切换关系更清楚**
   - 目前已经可用，但还有继续整理空间

## 8. 下一个 agent 最好怎么开始

建议顺序：

1. 先看 `HANDOFF.md`
2. 再看 `BRD.md`
3. 再看 `progress.md`
4. 直接打开：
   - `src/data.js`
   - `src/main.js`
   - `src/styles.css`
5. 刷新 `index.html` 本地看当前效果
6. 优先实现：
   - 推荐问题追加到当前会话线程
   - 会话型图表/卡片再加强一轮

## 9. 重要注意事项

- 不要把产品方向又拉回“页面后台”模式。用户已经明确要 **会话工作流**。
- 不要把系统消息重新拆成独立系统角色。用户要的是统一的 `Toast AI` 数字员工。
- 不要在会话态里再塞回分析页/风险页/任务页/报告页的大块模块。
- 不要忘记这是 **PC 端 Demo**，不是 App。
- 不要破坏 `index.html` 直接双击可运行这条要求。
- 修改 `src/data.js` / `src/main.js` 后，记得重新生成 `src/app.js`。

## 10. 每次改完都要做的事

```bash
python3 - <<'PY'
from pathlib import Path
root = Path('/Users/zhaoziwei/Desktop/新Cowork工具')
data = (root / 'src/data.js').read_text()
main = (root / 'src/main.js').read_text()
main_lines = main.splitlines()
if main_lines and main_lines[0].startswith('import '):
    main = '\n'.join(main_lines[1:]) + ('\n' if main.endswith('\n') else '')
app = data.replace('export const ', 'const ') + '\n' + main
(root / 'src/app.js').write_text(app)
PY
node --check src/main.js
node --check src/app.js
```

## 11. 当前状态一句话总结

当前 Demo 已经从“业务页面 + 对话卡片”推进到了“全局最近会话 + 独立会话态 + 会话维度沉淀结果”的形态，下一步最核心的是让推荐追问真正追加到当前线程，并把 AI 汇报卡片再做得更像老板工作台。
