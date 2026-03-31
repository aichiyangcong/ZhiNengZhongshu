---
name: interview-demand-extractor
description: Extract and maintain customer requirements from interview transcripts under docs/interview, and update BRD-style requirement docs for an Agent-as-a-Service cowork product. Use when new interview files are added, when the team asks to refresh requirement summaries, or when you need mock-ready dialogue scenarios grounded in interview evidence.
---

# Interview Demand Extractor

## Overview

Extract reusable product requirements from interview transcripts and convert them into:
- a structured BRD-style requirements document for demo/product alignment
- mock-ready query/response scenarios for conversation-driven demos
- a change-aware summary when new interview files are added

Primary output target:
- `docs/BRD.md` (preferred)

Reference style:
- align writing tone and scene granularity with `other/MockData.md`

## Workflow

### 1) Build source inventory first
Run:

```bash
python3 skills/interview-demand-extractor/scripts/interview_inventory.py \
  --interview-dir docs/interview \
  --format markdown
```

Purpose:
- confirm input coverage
- surface new or recently changed files
- avoid遗漏访谈来源

### 2) Read baseline context before synthesis
Always read:
- `docs/interview/*.md` (or user-specified subset)
- `other/MockData.md`

Read if present:
- `docs/other/Demands.md`
- existing `docs/BRD.md`

If both `BRD.md` and `docs/BRD.md` exist, default to updating `docs/BRD.md` unless user specifies otherwise.

### 3) Extract with fixed taxonomy
Use `references/requirement-taxonomy.md` as mandatory schema.

Minimum extracted dimensions:
- business goals and KPI orientation
- current workflow and pain points
- must-have product capabilities vs optional capabilities
- data integration constraints and reliability requirements
- role-specific needs (总部/区域/督导/店长/运维)
- demo implications (what should be shown in conversation flow)

### 4) Write BRD-style output
Use `references/brd-output-template.md`.

Hard requirements:
- evidence-driven statements (grounded in interviews)
- clearly separate `事实` / `推断` / `mock建议`
- include `P0 / P1 / P2` priorities
- include AaaS cowork framing, not traditional SaaS page list only
- include conversation scenarios that reflect real user asks

### 5) Keep incremental update history
When refreshing existing output:
- add/update a `变更记录` section with date
- list new interview files absorbed this round
- list changed conclusions (added/removed/re-prioritized)

## Output Rules

### Language and structure
- Write in Chinese.
- Use concrete, executable wording.
- Keep sections compact; avoid transcript restatement.

### Fact discipline
- Do not fabricate numeric facts as interview evidence.
- If mock data is needed for demo narrative, tag it explicitly as `Mock`.

### Demo orientation
- Prioritize “对话即入口”的共性需求解法:
  - 自然语言取数
  - 主动预警/订阅
  - 根因诊断
  - 任务闭环
  - 低风险代操作
  - 报告沉淀

## Resources

### scripts
- `scripts/interview_inventory.py`: inventory source interviews (path, type, size, lines, mtime, sha1)

### references
- `references/requirement-taxonomy.md`: fixed extraction schema
- `references/brd-output-template.md`: output template compatible with `other/MockData.md` style

## Quick Commands

Generate inventory markdown:

```bash
python3 skills/interview-demand-extractor/scripts/interview_inventory.py \
  --interview-dir docs/interview \
  --format markdown
```

Save inventory json:

```bash
python3 skills/interview-demand-extractor/scripts/interview_inventory.py \
  --interview-dir docs/interview \
  --format json \
  --write docs/interview/_inventory.json
```
