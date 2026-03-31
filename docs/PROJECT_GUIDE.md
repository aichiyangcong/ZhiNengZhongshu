# Project Guide

更新时间：2026-03-30

## 1. 这是什么项目

这是一个纯前端的 AI 工作台 Demo，用来演示“Agent as a Service CoWork 工作台”在餐饮连锁管理场景下的产品表达。

当前 Demo 的核心不是传统后台页面，而是：

- 左侧：主导航 + 主题会话
- 中间：会话流主工作区
- 右侧：沉淀结果（任务 / 提醒 / 报告）

目标是证明 AI 不只是回答问题，而是能完成：

- 取数
- 诊断
- 建议动作
- 任务闭环
- 报告沉淀

## 2. 新 agent 从哪里开始看

建议按这个顺序阅读：

1. [docs/BRD.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/BRD.md)
   作用：当前最完整的产品级定义，包含定位、角色、场景、能力边界。
2. [README.md](/Users/zhaoziwei/Desktop/新Cowork工具/README.md)
   作用：了解仓库结构、运行方式、生成方式。
3. [HANDOFF.md](/Users/zhaoziwei/Desktop/新Cowork工具/HANDOFF.md)
   作用：了解最近一轮设计与实现背景。
   注意：它是阶段性交接记录，不是长期真相源。
4. [src/data.js](/Users/zhaoziwei/Desktop/新Cowork工具/src/data.js)
   作用：理解 Demo 覆盖的具体场景、会话内容和右侧沉淀数据。
5. [src/main.js](/Users/zhaoziwei/Desktop/新Cowork工具/src/main.js)
   作用：理解动作分发、页面渲染、右侧联动、toast 和定位逻辑。
6. [src/styles.css](/Users/zhaoziwei/Desktop/新Cowork工具/src/styles.css)
   作用：理解页面结构和视觉规则。

## 3. 当前文档地图

### 当前有效文档

- [docs/BRD.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/BRD.md)
  当前产品主文档，优先级最高。
- [README.md](/Users/zhaoziwei/Desktop/新Cowork工具/README.md)
  当前运行与仓库说明。
- [HANDOFF.md](/Users/zhaoziwei/Desktop/新Cowork工具/HANDOFF.md)
  最近一轮交接说明，适合补上下文。
- [docs/PROJECT_GUIDE.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/PROJECT_GUIDE.md)
  当前统一入口。

### 研究与原始资料

- `docs/interview/*.md`
  原始访谈素材。
- [docs/other/Demands.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/other/Demands.md)
  讨论纪要，解释早期结构选择来源。
- `other/MockData.md`
  演示 Query 和 Mock 结果库。
- [other/RegionalOps_QueryConversationMock.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/RegionalOps_QueryConversationMock.md)
  区域运营负责人会话流素材。
- [other/v2.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/v2.md)
  较早的需求提炼稿。

### 方案与过程稿

- [other/WorkbenchDemo.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/WorkbenchDemo.md)
- [other/WorkbenchWireframes.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/WorkbenchWireframes.md)
- [other/WorkbenchAscii.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/WorkbenchAscii.md)
- [other/WorkbenchAscii_v2.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/WorkbenchAscii_v2.md)
- [other/FrontendDemoTaskPlan.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/FrontendDemoTaskPlan.md)

这些文档主要用于回看方案演进，不建议新 agent 作为第一入口。

### 历史归档

- [docs/archive/README.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/archive/README.md)
- [docs/DOCS_CLEANUP_PLAN.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/DOCS_CLEANUP_PLAN.md)

## 4. 当前代码结构

### 运行链路

- `index.html` 直接加载 `src/app.js`
- `src/app.js` 不是源码入口，而是运行拼接产物
- 真正源码入口是：
  - [src/data.js](/Users/zhaoziwei/Desktop/新Cowork工具/src/data.js)
  - [src/main.js](/Users/zhaoziwei/Desktop/新Cowork工具/src/main.js)

### 代码职责

- [src/data.js](/Users/zhaoziwei/Desktop/新Cowork工具/src/data.js)
  负责会话内容、页面 mock 数据、右侧 panel 数据。
- [src/main.js](/Users/zhaoziwei/Desktop/新Cowork工具/src/main.js)
  负责动作语义、点击分发、动态插卡、定位与渲染。
- [src/styles.css](/Users/zhaoziwei/Desktop/新Cowork工具/src/styles.css)
  负责三栏布局、会话样式、右侧 panel、响应式规则。

## 5. 当前已知事实

- 这是 Demo，不接后端。
- 所有状态流都是 mock。
- 页面壳子已经基本稳定，后续更多是改交互一致性、文案、数据、叙事和信息结构。
- 代码中最需要注意的是 `src/app.js` 必须在改完源码后重新生成。

## 6. 当前已知风险

- [HANDOFF.md](/Users/zhaoziwei/Desktop/新Cowork工具/HANDOFF.md) 是阶段性文档，可能落后于最新代码。
- 根目录老文档和 `other/` 里的过程稿很多，容易干扰判断。
- 目前仓库里仍有一些本地临时目录和未归档内容，不适合作为知识入口。

## 7. 建议的后续文档治理方向

- 只保留一个产品主文档：`docs/BRD.md`
- 只保留一个项目入口：`docs/PROJECT_GUIDE.md`
- `README.md` 只做运行说明 + 导航
- 历史计划、旧 BRD、旧进度文档都进 `docs/archive/`
- `other/` 逐步只保留仍在引用的方案稿和 mock 资料
