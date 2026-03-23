# 新Cowork工具（AI 工作台 Demo）

这是一个纯前端 Demo，用于演示“会话优先”的 AI 工作台：

- 左侧：主导航 + 主题会话
- 中间：会话流（AI/用户消息 + 结构化卡片）
- 右侧：沉淀结果（任务 / 提醒 / 报告）

当前是静态页面方案，无后端依赖，适合在 Replit 快速拉起演示。

## 目录说明

- `index.html`：页面入口
- `src/data.js`：业务 mock 数据
- `src/main.js`：交互逻辑（动作分发、联动、渲染）
- `src/app.js`：运行文件（由 `data.js + main.js` 生成）
- `src/styles.css`：样式

## 本地运行

```bash
python3 -m http.server 8000
```

浏览器打开：`http://127.0.0.1:8000/`

## 开发时必须注意

`index.html` 直接加载的是 `src/app.js`，不是模块化源码。

所以每次改完 `src/data.js` 或 `src/main.js`，都要重新生成 `src/app.js`：

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

建议顺手做语法检查：

```bash
node --check src/data.js
node --check src/main.js
node --check src/app.js
```

## Replit 拉取代码

### 方式 A：新建 Replit（推荐）

1. 在 Replit 选择 **Import from GitHub**  
2. 填仓库地址：`https://github.com/aichiyangcong/ZhiNengZhongshu`  
3. 创建后在 Shell 执行：

```bash
python3 -m http.server ${PORT:-3000}
```

### 方式 B：已有 Replit 项目更新

在 Replit Shell 执行：

```bash
git pull origin main
python3 -m http.server ${PORT:-3000}
```

## Replit 部署建议

这是静态站点，直接用一个 web command 即可：

```bash
python3 -m http.server $PORT
```

部署后默认展示 `index.html`，即可在线访问 Demo。

## 常见问题

- 页面空白：通常是 `src/app.js` 未按最新 `data/main` 重新生成。
- 改了 `src/data.js` 但线上没变：同上，记得重新生成并提交 `src/app.js`。
