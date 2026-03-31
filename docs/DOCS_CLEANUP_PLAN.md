# Docs Cleanup Plan

更新时间：2026-03-30

## 1. 目标

这份文档用于明确当前仓库中文档的治理规则，避免新 agent 重复判断：

- 哪些文档是当前有效入口
- 哪些文档属于研究资料
- 哪些文档应该归档
- 哪些目录暂时不纳入产品文档体系

## 2. 当前保留策略

### 保留为当前有效文档

- [docs/PROJECT_GUIDE.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/PROJECT_GUIDE.md)
  统一入口，面向新 agent。
- [docs/BRD.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/BRD.md)
  当前产品主文档。
- [README.md](/Users/zhaoziwei/Desktop/新Cowork工具/README.md)
  运行说明与导航。
- [HANDOFF.md](/Users/zhaoziwei/Desktop/新Cowork工具/HANDOFF.md)
  最近一轮阶段性交接记录。

### 保留为研究资料

- `docs/interview/*.md`
- [docs/other/Demands.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/other/Demands.md)
- [other/MockData.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/MockData.md)
- [other/RegionalOps_QueryConversationMock.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/RegionalOps_QueryConversationMock.md)
- [other/v2.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/v2.md)

### 保留为方案过程稿

- [other/WorkbenchDemo.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/WorkbenchDemo.md)
- [other/WorkbenchWireframes.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/WorkbenchWireframes.md)
- [other/WorkbenchAscii.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/WorkbenchAscii.md)
- [other/WorkbenchAscii_v2.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/WorkbenchAscii_v2.md)
- [other/FrontendDemoTaskPlan.md](/Users/zhaoziwei/Desktop/新Cowork工具/other/FrontendDemoTaskPlan.md)

## 3. 已归档文档

这些文档不再作为入口，但保留参考价值：

- [docs/archive/BRD.2026-03-20.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/archive/BRD.2026-03-20.md)
- [docs/archive/progress.2026-03-20.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/archive/progress.2026-03-20.md)
- [docs/archive/FirstPlan.2026-03-20.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/archive/FirstPlan.2026-03-20.md)

## 4. 暂不处理的内容

以下内容暂不纳入本轮产品文档整理：

- `skills/`
  原因：属于技能系统，不是项目产品文档。
- `temp/`
  原因：本地临时目录，不应作为知识入口。
- `.vscode/`、`.mcp.json`
  原因：本地环境配置，不是项目说明。

## 5. 后续建议

- 如果 [HANDOFF.md](/Users/zhaoziwei/Desktop/新Cowork工具/HANDOFF.md) 后续继续积累，建议按日期改名归档，例如 `docs/archive/HANDOFF.2026-03-23.md`，只在根目录保留最新版。
- 如果 `other/` 中文档继续增多，建议后续拆成：
  - `docs/research/`
  - `docs/design/`
  - `docs/archive/`
- 如果 [docs/BRD.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/BRD.md) 稳定成为唯一主文档，根目录不应再出现新的 `BRD.md`。
