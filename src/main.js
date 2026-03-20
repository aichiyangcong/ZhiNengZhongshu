import { appMeta, navigation, pages, recentChats, conversations, conversationPanels, sharedPanels } from './data.js';

const state = {
  page: 'home',
  panelTab: pages.home.defaultPanel,
  activeConversationId: null,
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
    '查看全部任务': 'tasks',
    '查看回看': 'tasks',
    '生成周报素材': 'reports',
    '标记处理中': 'tasks',
    '查看规则详情': 'push',
    '查看图表': 'reports',
    '下载报告': 'reports',
    '看风险门店': 'risk',
    '看任务进度': 'tasks',
    '看利润缺口': 'analysis',
    '看定时推送': 'push',
  };
  return map[label] || null;
}

function interactiveAttrs(label) {
  const target = actionTarget(label);
  return target ? `data-page="${target}"` : 'data-action="noop"';
}

function activeConversation() {
  return state.activeConversationId ? conversations[state.activeConversationId] : null;
}

function panelItemsForCurrentPage() {
  if (state.activeConversationId) {
    const scopedPanels = conversationPanels[state.activeConversationId] || {};
    return scopedPanels[state.panelTab] || [];
  }

  const byPage = {
    home: {
      tasks: [
        {
          title: '春菜上架任务',
          status: '处理中',
          chain: '总部运营 → 区域负责人 → 华东督导组',
          due: '2026-03-22 18:00',
          progress: '68%（8/12 店）',
          meta: '卡点：苏州 2 店未完成试菜回执',
          actions: ['查看全部任务'],
        },
        {
          title: '食安巡检任务',
          status: '超时风险',
          chain: '区域负责人 → 南京督导 → 5 家门店',
          due: '2026-03-20 20:00',
          progress: '60%（3/5 店）',
          meta: '高风险项：后厨留样记录不完整',
          actions: ['查看异常门店'],
        },
      ],
      alerts: [
        {
          title: '[高] 苏州片区差评率异常',
          status: '待处理',
          source: 'Toast AI主动发现',
          trigger: '今天 10:20',
          impact: '差评率 +1.8pct；影响 5 家门店',
          suggestion: '优先排查晚高峰出餐与打包 SOP',
          actions: ['查看异常门店'],
        },
        {
          title: '[中] 经营利润下滑提醒',
          status: '待处理',
          source: '下级提报',
          trigger: '今天 09:40',
          impact: '南京南区利润率 -1.3pct；外卖毛利承压',
          suggestion: '暂停低毛利活动并复核补贴规则',
          actions: ['看利润缺口'],
        },
      ],
      reports: [
        {
          title: '📈 周营收分析',
          source: '用户创建',
          snapshotId: '#RPT-20260316-003',
          generatedAt: '2026-03-16 09:00',
          summary: '本周营收同比增长 8.5%，外卖占比提升。',
          metrics: [
            { label: '周营收', value: '¥128,450' },
            { label: '同比', value: '+8.5%' },
            { label: '外卖占比', value: '42%' },
          ],
          verified: '已验证',
          evidence: [
            '综合好评率 96.2%，环比 +1.1pct',
            '抖音渠道贡献 12%，环比 +0.7pct',
            '差评集中门店：苏州园区店、南京中山店（QSC: 出餐/打包）',
          ],
          actions: ['查看图表', '下载报告'],
        },
      ],
    },
    analysis: {
      tasks: [
        {
          title: '低毛利活动优化任务',
          status: '待处理',
          chain: '区域负责人 → 督导组长 → 重点门店',
          due: '2026-03-21 16:00',
          progress: '25%（2/8 店）',
          meta: '目标：恢复利润率 +0.9pct',
          actions: ['生成整改任务'],
        },
      ],
      alerts: [
        {
          title: '[高] 生鲜品类目标缺口持续扩大',
          status: '待处理',
          source: 'Toast AI主动发现',
          trigger: '今天 11:02',
          impact: '生鲜达成率 84%，缺口 ¥21,000',
          suggestion: '优先复制杭州样板店活动结构',
          actions: ['看利润缺口'],
        },
      ],
      reports: [
        {
          title: '📈 目标达成与缺口分析',
          source: 'Toast AI生成',
          snapshotId: '#RPT-20260320-ANL',
          generatedAt: '2026-03-20 14:10',
          summary: '外卖和生鲜是主要缺口来源，南京/苏州需优先修复。',
          metrics: [
            { label: '总体达成', value: '91%' },
            { label: '目标缺口', value: '¥82,000' },
            { label: '活动贡献', value: '22.3%' },
          ],
          verified: '已验证',
          evidence: [
            '区域排名：杭州 > 上海 > 南京 > 苏州',
            '督导排名：赵琳 108%，周凡 89%',
            '低毛利活动导致利润稀释 1.1pct',
          ],
          actions: ['查看图表', '下载报告'],
        },
      ],
    },
    risk: {
      tasks: [
        {
          title: '高风险门店整改任务包',
          status: '处理中',
          chain: '区域负责人 → 苏州督导 → 园区店/高新区店',
          due: '2026-03-21 18:00',
          progress: '50%（2/4 项）',
          meta: '已完成补货，待完成晚高峰排班复核',
          actions: ['查看全部任务'],
        },
      ],
      alerts: [
        {
          title: '[高] 苏州园区店复合风险',
          status: '待处理',
          source: 'Toast AI主动发现',
          trigger: '今天 14:32',
          impact: '差评率 8.7% + 牛腩库存 12.5kg',
          suggestion: '补货与督导巡检并行推进',
          actions: ['查看异常门店'],
        },
        {
          title: '[中] 南京鸡尾店食安预警',
          status: '待处理',
          source: '下级提报',
          trigger: '今天 13:15',
          impact: '食安相关差评连续 2 天上升',
          suggestion: '抽检后厨留样与清洁记录',
          actions: ['查看异常门店'],
        },
      ],
      reports: [
        {
          title: '📈 风险门店周报',
          source: 'Toast AI生成',
          snapshotId: '#RPT-20260320-RSK',
          generatedAt: '2026-03-20 15:00',
          summary: '高风险门店 3 家，QSC 共性问题集中在出餐与打包。',
          metrics: [
            { label: '高风险门店', value: '3 家' },
            { label: '差评率环比', value: '+1.4pct' },
            { label: '已闭环', value: '8 条' },
          ],
          verified: '待复核',
          evidence: [
            '平台分布：美团 63%，点评 22%，抖音 15%',
            'QSC 聚类：出餐慢、打包漏液、食安留样缺失',
            '共性门店：苏州园区店、南京鸡尾店',
          ],
          actions: ['查看图表', '下载报告'],
        },
      ],
    },
    tasks: {
      tasks: [
        {
          title: '春菜上架派发任务',
          status: '处理中',
          chain: '总部运营 → 区域负责人 → 12 家门店',
          due: '2026-03-20 18:00',
          progress: '68%（8/12 店）',
          meta: '督导反馈：2 家门店需追加培训',
          actions: ['查看全部任务'],
        },
        {
          title: '食安巡检专项',
          status: '待处理',
          chain: '区域负责人 → 督导组 → 风险门店',
          due: '2026-03-21 12:00',
          progress: '40%（4/10 店）',
          meta: '重点检查后厨留样与温控记录',
          actions: ['查看全部任务'],
        },
      ],
      alerts: [
        {
          title: '[高] 任务超时风险',
          status: '待处理',
          source: 'Toast AI主动发现',
          trigger: '今天 12:20',
          impact: '3 条任务将在 24h 内到期',
          suggestion: '优先推进苏州片区巡检任务',
          actions: ['查看全部任务'],
        },
      ],
      reports: [
        {
          title: '📈 任务闭环复盘',
          source: '用户创建',
          snapshotId: '#RPT-20260320-TSK',
          generatedAt: '2026-03-20 13:50',
          summary: '当前任务完成率 68%，超时风险主要集中在苏州片区。',
          metrics: [
            { label: '任务完成率', value: '68%' },
            { label: '超时风险', value: '3 条' },
            { label: '回看达标', value: '5 条' },
          ],
          verified: '已验证',
          evidence: [
            '总部派发任务按时完成率 81%',
            '督导执行差异：南京 > 杭州 > 苏州',
            '未达标原因：巡检回执上传延迟',
          ],
          actions: ['查看图表', '下载报告'],
        },
      ],
    },
    reports: {
      alerts: [
        {
          title: '[中] 待发送报告提醒',
          status: '待处理',
          source: 'Toast AI主动发现',
          trigger: '今天 08:45',
          impact: '华东经营复盘仍未推送',
          suggestion: '先发老板日报，再发区域周报',
          actions: ['查看报告'],
        },
      ],
      tasks: [
        {
          title: '报告补充确认任务',
          status: '待处理',
          chain: '区域负责人 → 数据专员',
          due: '2026-03-20 17:00',
          progress: '50%（1/2 报告）',
          meta: '需补录督导区域平台拆分图',
          actions: ['查看报告'],
        },
      ],
      reports: [
        {
          title: '📈 周营收分析',
          source: '用户创建',
          snapshotId: '#RPT-20260316-003',
          generatedAt: '2026-03-16 09:00',
          summary: '本周营收同比增长 8.5%，外卖占比提升。',
          metrics: [
            { label: '周营收', value: '¥128,450' },
            { label: '同比', value: '+8.5%' },
            { label: '外卖占比', value: '42%' },
          ],
          verified: '已验证',
          evidence: [
            '综合好评率 96.2%，环比 +1.1pct',
            '督导区域平台分布：赵琳片区外卖占比 46%',
            '差评门店 QSC：出餐慢、打包漏液',
          ],
          actions: ['查看图表', '下载报告'],
        },
        {
          title: '📈 好差评率及分析报告',
          source: 'Toast AI生成',
          snapshotId: '#RPT-20260320-007',
          generatedAt: '2026-03-20 09:20',
          summary: '综合好评率提升，但苏州片区差评仍偏高。',
          metrics: [
            { label: '综合好评率', value: '96.2%' },
            { label: '环比', value: '+1.1pct' },
            { label: '差评门店', value: '3 家' },
          ],
          verified: '已验证',
          evidence: [
            '平台分布：美团好评率 95.8%，点评 96.9%',
            '苏州片区差评率 8.7%，环比 +1.4pct',
            'QSC 主要问题：出餐速度、食安记录、打包规范',
          ],
          actions: ['查看图表', '下载报告'],
        },
      ],
    },
    push: {
      tasks: [
        {
          title: '定时推送维护任务',
          status: '处理中',
          chain: '区域负责人 → 数据运营',
          due: '2026-03-21 10:00',
          progress: '67%（4/6 规则）',
          meta: '需要复核老板日报推送窗口',
          actions: ['看定时推送'],
        },
      ],
      alerts: [
        {
          title: '[高] 区域利润率下滑推送命中',
          status: '待处理',
          source: 'Toast AI主动发现',
          trigger: '今天 10:50',
          impact: '苏州南区利润率 -1.6pct',
          suggestion: '立即触发区域经理提醒并附整改建议',
          actions: ['查看规则详情'],
        },
        {
          title: '[中] 下级提报：差评率上升',
          status: '待处理',
          source: '下级提报',
          trigger: '今天 09:30',
          impact: '南京北区差评率 +1.2pct',
          suggestion: '并入 12:00 汇总推送',
          actions: ['查看规则详情'],
        },
      ],
      reports: [
        {
          title: '📈 推送规则命中周报',
          source: 'Toast AI生成',
          snapshotId: '#RPT-20260320-PSH',
          generatedAt: '2026-03-20 11:20',
          summary: '规则命中 9 次，高优风险 3 次，均已触达负责人。',
          metrics: [
            { label: '命中次数', value: '9 次' },
            { label: '高优风险', value: '3 次' },
            { label: '触达率', value: '100%' },
          ],
          verified: '已验证',
          evidence: [
            'L1 风险实时推送平均延迟 2 分钟',
            'L2 经营提醒按 2 小时汇总已生效',
            '下级提报占提醒来源 34%',
          ],
          actions: ['查看图表', '下载报告'],
        },
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
        <div class="nav-group-title">主导航</div>
        <div class="nav-list">
          ${navigation
            .map(
              (item) => `
              <button class="nav-btn ${!state.activeConversationId && state.page === item.id ? 'active' : ''}" data-page="${item.id}">
                <span class="nav-label">${escapeHtml(item.label)}</span>
                <span class="nav-meta">${navMeta(item.id)}</span>
              </button>
            `,
            )
            .join('')}
        </div>
      </div>
      <div>
        <div class="nav-group-title">主题会话</div>
        <div class="simple-list">
          ${recentChats
            .map(
              (item) => `
                <button class="link-btn chat-link ${item.unread ? 'unread' : ''} ${state.activeConversationId === item.id ? 'active' : ''}" data-page="${item.page}" data-conversation="${item.id}">
                  <span class="chat-link-top">
                    <span class="chat-link-title">${escapeHtml(item.title)}</span>
                    <span class="chat-link-time">${escapeHtml(item.time)}</span>
                  </span>
                  <span class="chat-link-summary">${escapeHtml(item.summary)}</span>
                  ${item.unread ? `<span class="chat-link-badge">+${escapeHtml(item.unread)}</span>` : ''}
                </button>`,
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
    case 'push': return '定时与规则推送编排';
    default: return '';
  }
}

function renderRoleFocus(pageId, page) {
  const focus = page.focus;
  if (!focus) {
    return '';
  }

  if (pageId === 'analysis') {
    return `
      <section class="card focus-card">
        <div class="focus-head">
          <h2>${escapeHtml(focus.title)}</h2>
          <span class="status-badge ok">区域运营视角</span>
        </div>
        <div class="focus-query"><strong>Query：</strong>${escapeHtml(focus.query)}</div>
        <div class="focus-conclusion"><strong>结论：</strong>${escapeHtml(focus.conclusion)}</div>
        <div class="focus-grid">
          ${focus.blocks
            .map(
              (block) => `
                <div class="focus-block">
                  <strong>${escapeHtml(block.title)}</strong>
                  <ul>${block.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
                </div>
              `,
            )
            .join('')}
        </div>
      </section>
    `;
  }

  return `
    <section class="card focus-card">
      <div class="focus-head">
        <h2>${escapeHtml(focus.title)}</h2>
        <span class="status-badge">角色关注摘要</span>
      </div>
      <ul>${focus.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      ${focus.chips?.length ? `
        <div class="chip-row">
          ${focus.chips.map((chip) => `<button class="chip" ${interactiveAttrs(chip)}>${escapeHtml(chip)}</button>`).join('')}
        </div>
      ` : ''}
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

function renderStructuredCard(card) {
  switch (card.type) {
    case 'summary':
      return `
        <div class="message-card summary-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            ${card.badge ? `<span class="status-badge ok">${escapeHtml(card.badge)}</span>` : ''}
          </div>
          ${card.lines?.length ? `<ul>${card.lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>` : ''}
        </div>
      `;
    case 'kpis':
      return `
        <div class="message-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            ${card.badge ? `<span class="status-badge">${escapeHtml(card.badge)}</span>` : ''}
          </div>
          <div class="mini-kpi-grid">
            ${card.items.map((item) => `
              <div class="mini-kpi">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
                ${item.change ? `<em class="${item.trend || ''}">${escapeHtml(item.change)}</em>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    case 'bars':
      return `
        <div class="message-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            ${card.badge ? `<span class="status-badge">${escapeHtml(card.badge)}</span>` : ''}
          </div>
          <div class="bar-chart">
            ${card.items.map((item) => `
              <div class="bar-row">
                <div class="bar-row-top">
                  <span>${escapeHtml(item.label)}</span>
                  <strong>${escapeHtml(item.valueLabel || item.value)}</strong>
                </div>
                <div class="bar-track"><div class="bar-fill ${item.tone || ''}" style="width:${Number(item.value) || 0}%"></div></div>
                ${item.meta ? `<div class="bar-meta">${escapeHtml(item.meta)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    case 'table':
      return `
        <div class="message-card table-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            ${card.badge ? `<span class="status-badge">${escapeHtml(card.badge)}</span>` : ''}
          </div>
          <div class="mini-table-wrap">
            <table class="mini-table">
              <thead><tr>${card.columns.map((col) => `<th>${escapeHtml(col)}</th>`).join('')}</tr></thead>
              <tbody>
                ${card.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    case 'task':
      return `
        <div class="message-card task-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            <span class="status-badge warn">${escapeHtml(card.status || '待确认')}</span>
          </div>
          <div class="task-fields">
            ${card.fields.map((item) => `
              <div class="task-field">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
              </div>
            `).join('')}
          </div>
          ${card.actions?.length ? `<div class="chip-row">${card.actions.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}</div>` : ''}
        </div>
      `;
    case 'agent':
      return `
        <div class="message-card agent-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title)}</strong>
            <span class="status-badge ok">${escapeHtml(card.status || '执行中')}</span>
          </div>
          <div class="agent-steps">
            ${card.steps.map((step) => `
              <div class="agent-step">
                <span class="agent-dot ${step.status || ''}"></span>
                <span>${escapeHtml(step.text)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    default:
      return `
        <div class="message-card">
          <div class="message-card-head">
            <strong>${escapeHtml(card.title || '信息卡')}</strong>
          </div>
          ${card.lines?.map((line) => `<p>${escapeHtml(line)}</p>`).join('') || ''}
        </div>
      `;
  }
}

function renderConversation(conversation) {
  if (conversation.messages?.length) {
    return `
      <section class="card conversation-workspace">
        <div class="conversation-head">
          <div>
            <h2>${escapeHtml(conversation.title || '默认对话流')}</h2>
            ${conversation.meta ? `<p class="helper-text">${escapeHtml(conversation.meta)}</p>` : ''}
          </div>
          <div class="conversation-actions">
            <button class="secondary-btn" data-action="noop">生成简报</button>
            <button class="secondary-btn" data-action="noop">同步协作</button>
          </div>
        </div>
        <div class="conversation-thread">
          ${conversation.messages
            .map(
              (message) => `
                <div class="message-bubble ${escapeHtml(message.role)}">
                  <div class="message-meta">
                    <div class="message-meta-main">
                      <strong>${escapeHtml(message.label || message.role)}</strong>
                      ${message.badge ? `<span class="status-badge ${message.role === 'ai' ? 'ok' : ''}">${escapeHtml(message.badge)}</span>` : ''}
                    </div>
                    ${message.time ? `<span>${escapeHtml(message.time)}</span>` : ''}
                  </div>
                  <p>${escapeHtml(message.content)}</p>
                  ${message.highlights?.length ? `<div class="tag-row">${message.highlights.map((item) => `<span class="tag strong">${escapeHtml(item)}</span>`).join('')}</div>` : ''}
                  ${message.cards?.length ? `<div class="message-card-stack">${message.cards.map((card) => renderStructuredCard(card)).join('')}</div>` : ''}
                  ${message.actions?.length ? `<div class="chip-row">${message.actions.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}</div>` : ''}
                </div>
              `,
            )
            .join('')}
        </div>
        ${conversation.artifacts?.length ? `
          <div class="artifact-grid">
            ${conversation.artifacts
              .map(
                (artifact) => `
                  <div class="detail-card artifact-card">
                    <header>
                      <strong>${escapeHtml(artifact.title)}</strong>
                      <span class="status-badge">${escapeHtml(artifact.type)}</span>
                    </header>
                    ${artifact.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
                  </div>
                `,
              )
              .join('')}
          </div>
        ` : ''}
        ${conversation.followUps?.length ? `
          <div class="chip-row" style="margin-top:16px;">
            ${conversation.followUps.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}
          </div>
        ` : ''}
        <div class="conversation-composer">
          <div class="composer-input">输入消息...（Shift+Enter 换行，输入 @ 可引用历史记录）</div>
          <button class="primary-btn" data-action="noop">发送</button>
        </div>
      </section>
    `;
  }

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
    ${renderRoleFocus('analysis', page)}
    ${renderConversation(page.conversation)}
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
    ${renderRoleFocus('risk', page)}
    ${renderConversation(page.conversation)}
  `;
}

function renderTasks(page) {
  return `
    ${renderRoleFocus('tasks', page)}
    ${renderConversation(page.conversation)}
  `;
}

function renderReports(page) {
  return `
    ${renderRoleFocus('reports', page)}
    ${renderConversation(page.conversation)}
  `;
}

function renderPush(page) {
  return `
    ${renderRoleFocus('push', page)}
    ${renderConversation(page.conversation)}
  `;
}

function renderHome(page) {
  return `
    ${renderRoleFocus('home', page)}
    ${renderConversation(page.conversation)}
  `;
}

function renderMain() {
  const conversation = activeConversation();
  if (conversation) {
    return `<main class="main-pane conversation-only">${renderConversation(conversation)}</main>`;
  }

  const page = pages[state.page];
  const body = (() => {
    switch (state.page) {
      case 'home': return renderHome(page);
      case 'analysis': return renderAnalysis(page);
      case 'risk': return renderRisk(page);
      case 'tasks': return renderTasks(page);
      case 'reports': return renderReports(page);
      case 'push': return renderPush(page);
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

function statusTone(status = '') {
  if (status.includes('高') || status.includes('超时') || status.includes('待处理')) return 'danger';
  if (status.includes('中') || status.includes('待确认')) return 'warn';
  if (status.includes('已') || status.includes('处理') || status.includes('完成')) return 'ok';
  return '';
}

function renderPanelActions(item) {
  const actions = item.actions || (item.action ? [item.action] : []);
  if (!actions.length) return '';
  return `
    <div class="action-row panel-action-row">
      ${actions.map((action) => `<button class="secondary-btn" ${interactiveAttrs(action)}>${escapeHtml(action)}</button>`).join('')}
    </div>
  `;
}

function renderPanelContent() {
  const key = state.panelTab;
  const items = panelItemsForCurrentPage();
  return items.map((item) => {
    if (key === 'reports') {
      return `
        <div class="panel-card report-panel-card">
          <div class="panel-card-head">
            <strong>${escapeHtml(item.title)}</strong>
            ${item.verified ? `<span class="status-badge ${statusTone(item.verified)}">${escapeHtml(item.verified)}</span>` : ''}
          </div>
          ${item.source ? `<p><strong>来源：</strong>${escapeHtml(item.source)}</p>` : ''}
          ${item.snapshotId ? `<p><strong>快照ID：</strong>${escapeHtml(item.snapshotId)}</p>` : ''}
          ${item.generatedAt ? `<p><strong>生成时间：</strong>${escapeHtml(item.generatedAt)}</p>` : ''}
          ${item.summary || item.subtitle ? `<p>${escapeHtml(item.summary || item.subtitle)}</p>` : ''}
          ${item.metrics?.length ? `
            <div class="panel-kpis">
              ${item.metrics.map((metric) => `
                <div class="panel-kpi">
                  <span>${escapeHtml(metric.label)}</span>
                  <strong>${escapeHtml(metric.value)}</strong>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${item.evidence?.length ? `
            <div class="panel-evidence">
              ${item.evidence.map((line) => `<p>• ${escapeHtml(line)}</p>`).join('')}
            </div>
          ` : ''}
          ${renderPanelActions(item)}
        </div>
      `;
    }

    if (key === 'tasks') {
      return `
        <div class="panel-card task-panel-card">
          <div class="panel-card-head">
            <strong>${escapeHtml(item.title)}</strong>
            ${item.status ? `<span class="status-badge ${statusTone(item.status)}">${escapeHtml(item.status)}</span>` : ''}
          </div>
          ${item.chain ? `<p><strong>责任链路：</strong>${escapeHtml(item.chain)}</p>` : ''}
          ${item.due ? `<p><strong>截止时间：</strong>${escapeHtml(item.due)}</p>` : ''}
          ${item.progress ? `<p><strong>完成进度：</strong>${escapeHtml(item.progress)}</p>` : ''}
          ${item.meta ? `<p>${escapeHtml(item.meta)}</p>` : ''}
          ${renderPanelActions(item)}
        </div>
      `;
    }

    return `
      <div class="panel-card alert-panel-card">
        <div class="panel-card-head">
          <strong>${escapeHtml(item.title)}</strong>
          ${item.status ? `<span class="status-badge ${statusTone(item.status)}">${escapeHtml(item.status)}</span>` : ''}
        </div>
        ${item.source ? `<p><strong>来源：</strong>${escapeHtml(item.source)}</p>` : ''}
        ${item.trigger ? `<p><strong>触发时间：</strong>${escapeHtml(item.trigger)}</p>` : ''}
        ${item.impact || item.subtitle ? `<p><strong>异常：</strong>${escapeHtml(item.impact || item.subtitle)}</p>` : ''}
        ${item.suggestion ? `<p><strong>建议动作：</strong>${escapeHtml(item.suggestion)}</p>` : ''}
        ${renderPanelActions(item)}
      </div>
    `;
  }).join('');
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

  app.querySelectorAll('[data-page]:not([data-conversation])').forEach((node) => {
    node.addEventListener('click', () => {
      const next = node.getAttribute('data-page');
      state.page = next;
      state.panelTab = pages[next].defaultPanel;
      state.activeConversationId = null;
      renderApp();
    });
  });

  app.querySelectorAll('[data-conversation]').forEach((node) => {
    node.addEventListener('click', () => {
      const next = node.getAttribute('data-page');
      const conversationId = node.getAttribute('data-conversation');
      state.page = next;
      state.panelTab = pages[next].defaultPanel;
      state.activeConversationId = conversationId;
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
