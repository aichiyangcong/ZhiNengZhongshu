# 新Cowork工具（AI 工作台 Demo）

这是一个纯前端 Demo，用于演示“会话优先”的 AI 工作台。当前仓库同时包含产品文档、访谈资料、历史方案稿和前端实现代码。

如果你是第一次接手这个项目，不要先从零散 Markdown 开始翻。先看 [docs/PROJECT_GUIDE.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/PROJECT_GUIDE.md)，它是当前的统一入口文档。

## 推荐阅读顺序

1. [docs/PROJECT_GUIDE.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/PROJECT_GUIDE.md)
2. [docs/BRD.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/BRD.md)
3. [HANDOFF.md](/Users/zhaoziwei/Desktop/新Cowork工具/HANDOFF.md)
4. [src/data.js](/Users/zhaoziwei/Desktop/新Cowork工具/src/data.js)
5. [src/main.js](/Users/zhaoziwei/Desktop/新Cowork工具/src/main.js)

## 代码结构

- `index.html`：页面入口
- `src/data.js`：业务 mock 数据
- `src/main.js`：交互逻辑与渲染
- `src/app.js`：运行文件，由 `src/data.js + src/main.js` 生成
- `src/styles.css`：样式
- `docs/`：当前产品文档、访谈资料、归档文档
- `other/`：过程稿、草图、方案稿、Mock 资料

## 本地运行

```bash
python3 -m http.server 8000
```

浏览器打开：`http://127.0.0.1:8000/`

## 开发注意事项

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

## Replit 使用

从 GitHub 导入仓库后，直接运行：

```bash
python3 -m http.server ${PORT:-3000}
```

如果是已有 Replit 项目，先拉最新代码：

```bash
git pull origin main
python3 -m http.server ${PORT:-3000}
```

部署命令同样使用：

```bash
python3 -m http.server $PORT
```

## 常见问题

- 页面空白：通常是 `src/app.js` 没按最新源码重新生成。
- 改了 `src/data.js` 但页面没变：需要重新生成并提交 `src/app.js`。
- 新 agent 不知道先看什么：从 [docs/PROJECT_GUIDE.md](/Users/zhaoziwei/Desktop/新Cowork工具/docs/PROJECT_GUIDE.md) 开始。
