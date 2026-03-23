const appMeta = {
  productName: "AI 工作台",
  role: "区域运营负责人",
  scope: "华东区 · 182 家门店",
  date: "2026-03-20",
};

const navigation = [
  { id: "home", label: "今日工作台" },
  { id: "analysis", label: "经营分析" },
  { id: "risk", label: "门店风险" },
  { id: "tasks", label: "任务协同" },
  { id: "reports", label: "报告中心" },
  { id: "push", label: "定时/规则推送" },
];

const recentChats = [
  {
    id: "conv-1",
    title: "3月目标追踪：渠道/品类/区域缺口",
    time: "3 分钟前",
    page: "home",
    summary: "总目标达成约50%，线下缺口更大，需优先追赶三名掉队负责人",
    unread: 0,
  },
  {
    id: "conv-2",
    title: "周三活动复盘：营收贡献与利润稀释",
    time: "8 分钟前",
    page: "analysis",
    summary: "活动增收有效，但两片区执行次数高、利润贡献低，需要A/B收缩策略",
    unread: 0,
  },
  {
    id: "conv-3",
    title: "平台口碑风险：好评率/差评/QSC归因",
    time: "15 分钟前",
    page: "risk",
    summary: "综合好评率提升但差评集中度上升，QSC问题聚焦出餐、打包、食安记录",
    unread: 0,
  },
  {
    id: "conv-4",
    title: "单店盈利提升方案：90天执行版",
    time: "22 分钟前",
    page: "analysis",
    summary: "基于xlsx生成佳兆业店90天方案：线下引流+外卖投流+团购优化",
    unread: 0,
  },
  {
    id: "conv-5",
    title: "总部任务闭环：拆解、派发、回看",
    time: "39 分钟前",
    page: "tasks",
    summary: "总部任务拆解完成度68%，苏州片区超时风险高，需24h追赶",
    unread: 0,
  },
  {
    id: "conv-6",
    title: "周营收+好差评综合报告沉淀",
    time: "1 小时前",
    page: "reports",
    summary: "周营收同比+8.5%，外卖占比42%，已生成图表快照并可下载",
    unread: 0,
  },
  {
    id: "conv-7",
    title: "定时/规则推送命中优先级",
    time: "2 小时前",
    page: "push",
    summary: "今日命中9次，L1风险3次；下级提报占34%，建议分层推送",
    unread: 0,
  },
];

const sharedPanels = {
  tasks: [
    { title: "整改新店差评问题", meta: "南京区域经理 · 明日 18:00", status: "待处理" },
    { title: "巡检食安风险门店", meta: "苏州督导组 · 今日 16:00", status: "处理中" },
    { title: "补货确认与反馈", meta: "杭州门店负责人 · 今日 11:30", status: "即将超时" },
  ],
  alerts: [
    { title: "外卖订单下滑预警", subtitle: "4 家门店命中规则：订单↓15% + 差评↑", action: "查看异常门店" },
    { title: "新店差评异常", subtitle: "5 家门店集中在口味 / 打包 / 出餐慢", action: "生成巡检任务" },
    { title: "库存低于阈值", subtitle: "2 家门店需要补货并通知督导", action: "查看库存告警" },
  ],
  reports: [
    { title: "今日分析简报", subtitle: "草稿 · 08:00 推送", action: "查看报告" },
    { title: "本周经营复盘", subtitle: "已生成 · 区域运营模板", action: "查看报告" },
    { title: "新店口碑周报", subtitle: "待确认 · 4 月试点", action: "查看报告" },
  ],
};

const pages = {
  home: {
    title: "今日工作台",
    subtitle: "今日重点：利润、差评、库存",
    defaultPanel: "alerts",
    focus: {
      title: "今天最该关注的 3 件事",
      items: [
        "华东区利润达成 91%，仍有 ¥82,000 缺口；外卖渠道差距最大。",
        "苏州与南京片区差评率较上周上升 1.4pct，QSC 问题集中在出餐速度与打包。",
        "春季上新任务已完成 8/12 店，食安巡检任务有 2 店接近超时。",
      ],
      chips: ["看利润缺口", "看风险门店", "看任务进度"],
    },
    summaryCards: [
      { label: "高风险门店", value: "3" },
      { label: "待处理任务", value: "5" },
      { label: "新报告", value: "1" },
      { label: "命中提醒", value: "4" },
    ],
    hero: {
      title: "今天你最该关注的 3 件事",
      items: [
        "利润率下降 1.6pct",
        "5 家新店差评异常",
        "2 家门店库存告警",
      ],
      actions: ["为什么利润下降", "查看异常门店", "生成整改任务"],
    },
    prompts: [
      "华东区昨天利润率为什么下降？",
      "新店差评超过 3 条的有哪些？",
      "帮我建一个外卖订单下滑预警",
    ],
    conversation: {
      title: "会话流：午市经营复盘 + 牛腩补货处理",
      meta: "系统主动提醒 · 今天 14:32 开始 · 仍有 3 条未读",
      messages: [
        {
          role: "ai",
          label: "美团餐饮AI助手",
          badge: "系统主动提醒",
          time: "14:32",
          content: "触发规则 R-INV-009：牛腩库存低于安全阈值 18kg，按近 7 天中位消耗估算，明天 11:30 前可能断货。",
          highlights: ["当前库存 12.5kg", "置信度 0.87", "建议立即进入处理会话"],
          cards: [
            {
              type: "table",
              title: "触发证据卡 · R-INV-009",
              badge: "库存风险",
              columns: ["指标", "当前值", "阈值", "偏差", "状态"],
              rows: [
                ["牛腩库存", "12.5kg", "18kg", "-5.5kg", "触发"],
                ["近7天日均消耗", "15.8kg", "-", "-", "高"],
                ["预计断货时间", "明天11:30", "-", "-", "风险"],
              ],
            },
          ],
        },
        {
          role: "user",
          label: "区域运营负责人",
          time: "14:33",
          content: "收到，先帮我看今天午市利润率为什么掉了，顺便把牛腩补货动作也准备好。",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "14:34",
          content: "午市利润下降的确定性原因有 3 个：包装成本率较上周上升 2.1pct，活动补贴支出增加 8.4%，南京和苏州两家主力门店配送补偿金额翻倍。牛腩断货风险会继续拉低晚市收入，我已经按 30kg 帮你生成待确认补货单。",
          highlights: ["包装成本率↑2.1pct", "活动补贴↑8.4%", "南京/苏州补偿异常"],
          cards: [
            {
              type: "summary",
              title: "先说结论",
              badge: "结论先行",
              lines: ["利润下降主因不是单店波动，而是包装成本、活动补贴、配送补偿同时恶化。", "库存风险如果不处理，会继续拖累晚市收入。"],
            },
            {
              type: "kpis",
              title: "午市经营概览",
              items: [
                { label: "堂食", value: "¥12,840", change: "↓ ¥1,680", trend: "down" },
                { label: "外卖", value: "¥5,632", change: "↑ 9.2%", trend: "up" },
                { label: "翻台率", value: "2.1", change: "↓ 0.4", trend: "down" },
                { label: "出餐", value: "18min", change: "⚠ 慢 3min", trend: "warning" },
              ],
            },
            {
              type: "task",
              title: "任务已创建：紧急补货牛腩",
              status: "待确认",
              fields: [
                { label: "补货量", value: "30kg（建议）" },
                { label: "供应商", value: "张总 · 恒源肉业" },
                { label: "预计到货", value: "明天 10:00 前" },
              ],
              actions: ["推送补货单", "对比供应商B报价"],
            },
          ],
          actions: ["展开看南京门店", "只看外卖渠道", "生成运营整改任务"],
        },
        {
          role: "user",
          label: "区域运营负责人",
          time: "14:36",
          content: "牛腩涨价会不会影响主力菜毛利？",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "14:37",
          content: "会。牛腩本周从 ¥60.7 涨到 ¥68/kg，直接把水煮肉片毛利从 43% 压到 31%，已经破 35% 红线。建议优先比较供应商 B 报价，或者先把水煮肉片提价 ¥3 再观察 7 天销量。",
          highlights: ["水煮肉片 31%", "供应商 B 可恢复至 36%", "提价 ¥3 后预计净毛利 +¥620/天"],
          cards: [
            {
              type: "bars",
              title: "主力菜毛利影响",
              items: [
                { label: "水煮肉片", value: 31, valueLabel: "31%", meta: "已低于 35% 红线", tone: "danger" },
                { label: "酸汤肥牛", value: 65, valueLabel: "65%", meta: "仍可接受", tone: "warn" },
                { label: "红烧牛腩", value: 48, valueLabel: "48%", meta: "需持续观察" },
              ],
            },
            {
              type: "table",
              title: "策略样本对比",
              columns: ["策略", "样本数", "毛利变化", "销量变化"],
              rows: [
                ["提价 ¥3", "127 店", "+7.1%", "-2.8%"],
                ["换供应商 B", "83 店", "+8.4%", "-3.1%"],
                ["仅降推广", "102 店", "+2.2%", "-0.9%"],
              ],
            },
          ],
          actions: ["对比供应商B报价", "生成菜品定价建议", "推送补货单"],
        },
      ],
      artifacts: [
        {
          title: "触发证据卡 · R-INV-009",
          type: "证据",
          lines: ["牛腩库存 12.5kg < 安全阈值 18kg", "预计断货时间：明天 11:30", "库存趋势和时段消耗曲线已命中规则"],
        },
        {
          title: "任务已创建：紧急补货牛腩",
          type: "任务",
          lines: ["建议补货量：30kg", "供应商：张总 · 恒源肉业", "预计到货：明天 10:00 前"],
        },
      ],
      followUps: ["展开看南京门店", "只看外卖渠道", "生成运营整改任务"],
    },
  },
  analysis: {
    title: "经营分析",
    subtitle: "华东区利润率下降归因 + 结论 + 建议",
    defaultPanel: "reports",
    focus: {
      title: "Query + 结论（区域运营关注）",
      query: "华东区目标达成进度怎么样？按渠道、品类、区域和督导拆开，并给出盈利提升方案。",
      conclusion: "当前达成 91%，缺口主要来自外卖和生鲜；南京/苏州两区拉低整体，建议优先修复低毛利活动并复制杭州督导样板店策略。",
      blocks: [
        {
          title: "目标完成与缺口",
          lines: ["整体目标：91%（环比 +2.3pct）", "外卖：88%（缺口 ¥46,000）", "生鲜：84%（缺口 ¥21,000）", "生熟：94%（缺口 ¥7,500）"],
        },
        {
          title: "区域/督导排名",
          lines: ["区域：杭州 > 上海 > 南京 > 苏州", "督导：赵琳（108%）/ 王扬（102%）/ 周凡（89%）"],
        },
        {
          title: "营销活动贡献",
          lines: ["活动营收贡献 ¥286,000，占总营收 22.3%", "堂食贡献 46%，外卖 42%，团购 12%", "低毛利活动导致利润稀释 1.1pct"],
        },
        {
          title: "单店盈利模型建议",
          lines: ["对标样本：杭州西溪店同类活动毛利高 4.2pct", "建议：套餐结构优化 + 包装规格复核 + 晚高峰排班补强"],
        },
      ],
    },
    query: "华东区昨天利润率为什么下降？",
    queryActions: ["修改问题", "保存为报告", "生成任务"],
    conclusion: {
      title: "结论卡",
      lines: [
        "外卖包装成本 + 活动补贴共同压缩利润",
        "影响范围：南京 / 苏州 / 外卖渠道 / 5 家重点门店",
        "优先动作：暂停低毛利活动、复核补偿、强化会员触达",
      ],
      tags: ["确定性数据", "AI 建议"],
    },
    insightCards: [
      { title: "归因 1", value: "包装成本率 ↑2.1pct", desc: "高于近 4 周均值" },
      { title: "归因 2", value: "活动毛利 ↓8.4%", desc: "折扣过深导致毛利稀释" },
      { title: "归因 3", value: "配送补偿 ↑", desc: "南京/苏州异常明显" },
    ],
    visuals: [
      { title: "Trend", desc: "利润率 vs 包装成本率（7日）" },
      { title: "Distribution", desc: "高风险门店热力图" },
    ],
    table: {
      columns: ["门店", "利润率", "包装成本", "补贴金额", "差评率", "风险等级"],
      rows: [
        ["南京中山店", "4.8%", "23%", "¥12.8k", "3.9%", "高"],
        ["苏州园区店", "5.1%", "22%", "¥10.4k", "3.2%", "中高"],
        ["上海虹桥店", "6.0%", "19%", "¥9.2k", "2.1%", "中"],
      ],
    },
    prompts: ["展开看南京门店", "只看外卖渠道", "生成运营整改任务"],
    conversation: {
      title: "会话流：利润率下降归因拆解到门店和动作",
      meta: "用户主动分析 · 今天 14:05 · 已沉淀为分析简报草稿",
      messages: [
        {
          role: "user",
          label: "区域运营负责人",
          time: "14:05",
          content: "继续分析，我想知道这次利润下降能不能拆解到具体门店和动作？",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "14:06",
          content: "可以。南京中山店利润率 4.8%，包装成本占比 23%，活动补贴 ¥12.8k；苏州园区店客单价跌 6%，佣金和配送补偿上涨 ¥950。两个门店合计贡献了本次利润下滑的 57%。",
          highlights: ["南京中山店 4.8%", "苏州园区店客单价 -6%", "两店贡献 57%"],
          cards: [
            {
              type: "summary",
              title: "结论卡",
              badge: "门店拆解",
              lines: ["本次利润下滑不是全区平均下滑，而是被南京中山店和苏州园区店集中拉低。", "先抓这两家，收益最高。"],
            },
            {
              type: "table",
              title: "重点门店拆解",
              columns: ["门店", "利润率", "包装成本", "补贴金额", "贡献"],
              rows: [
                ["南京中山店", "4.8%", "23%", "¥12.8k", "高"],
                ["苏州园区店", "5.1%", "22%", "¥10.4k", "高"],
                ["上海虹桥店", "6.0%", "19%", "¥9.2k", "中"],
              ],
            },
          ],
        },
        {
          role: "user",
          label: "区域运营负责人",
          time: "14:07",
          content: "先说动作，今天最该先做什么？",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "14:08",
          content: "建议按优先级分 3 步：第一，南京/苏州门店立即暂停两档低毛利活动；第二，把外卖满减切到会员券承接，恢复毛利；第三，安排督导 16:00 抽查打包 SOP 和补偿规则。这样可以先止损，再看明天数据回弹。",
          highlights: ["暂停低毛利活动", "改用会员满减", "16:00 督导抽查"],
          cards: [
            {
              type: "summary",
              title: "动作优先级（P1/P2/P3）",
              badge: "执行顺序",
              lines: [
                "P1：南京/苏州门店先暂停两档低毛利活动，优先止损。",
                "P2：外卖满减切到会员券承接，恢复毛利结构。",
                "P3：督导16:00抽查打包SOP和补偿规则，防止问题反复。",
              ],
            },
          ],
          actions: ["查看报告", "生成任务"],
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "14:09",
          content: "我已经把本次结论写成分析简报草稿，如果确认，可以直接保存为报告或生成门店整改任务。",
          cards: [
            {
              type: "agent",
              title: "Agent 执行进度",
              status: "已完成",
              steps: [
                { text: "结论摘要已生成", status: "done" },
                { text: "分析简报草稿已保存", status: "done" },
                { text: "等待你决定：报告或任务", status: "running" },
              ],
            },
          ],
          actions: ["查看报告", "生成任务"],
        },
      ],
      artifacts: [
        {
          title: "分析证据摘要",
          type: "数据",
          lines: ["包装成本率较近 4 周均值高 2.1pct", "活动毛利下降 8.4%", "新店差评贡献 62%"],
          actions: ["查看报告"],
        },
        {
          title: "建议动作包",
          type: "动作",
          lines: ["暂停低毛利活动", "复核配送补偿", "督导抽查打包流程"],
          actions: ["生成任务"],
        },
      ],
      followUps: ["查看报告", "生成任务"],
    },
  },
  risk: {
    title: "门店风险",
    subtitle: "系统自动识别的高优先级问题",
    defaultPanel: "tasks",
    focus: {
      title: "督导区域风险视角",
      items: [
        "最坏门店：苏州园区店（差评率 8.7%，库存风险叠加）。",
        "最好门店：杭州西溪店（达成 108%，QSC 稳定）。",
        "共性问题：出餐慢、打包漏液、食安巡检记录缺失。",
      ],
      chips: ["看最坏门店", "看最好门店", "按QSC聚类"],
    },
    filters: ["区域：华东区", "风险类型：差评/食安/库存", "风险等级：高/中/低", "时间范围：近7天", "只看我负责门店"],
    summaryCards: [
      { label: "高风险", value: "12" },
      { label: "中风险", value: "24" },
      { label: "今日新增", value: "6" },
      { label: "已闭环", value: "8" },
    ],
    list: [
      { title: "苏州园区店", level: "高", problem: "差评聚焦出餐慢", action: "优化晚高峰排班" },
      { title: "南京鸡尾店", level: "高", problem: "食安评价增多", action: "立刻巡检后厨" },
      { title: "杭州西溪店", level: "中高", problem: "新品退单异常", action: "复核制作标准" },
    ],
    detail: {
      title: "苏州园区店",
      lines: [
        "风险摘要：库存告警 + 差评集中在出餐慢",
        "相关指标：差评率 8.7% ↑ vs 均值 4.2%；出餐超时 △18%；库存少 5.5kg",
        "可能原因：排班不足、配送补偿↑、新人操作不熟练",
        "推荐动作：16:00 前督导巡检、抽检排班与打包 SOP",
      ],
      actions: ["生成任务", "加入巡检计划", "推送督导通知"],
    },
    conversation: {
      title: "会话流：哪家门店风险最高，先处理什么",
      meta: "系统主动提醒 · 今天 14:32 · 风险和库存双命中",
      messages: [
        {
          role: "user",
          label: "区域运营负责人",
          time: "14:32",
          content: "哪家门店的风险等级最高？",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "14:33",
          content: "苏州园区店目前最高。它同时命中差评异常和库存告警两类规则：差评率 8.7%，明显高于历史均值 4.2%；牛腩库存只有 12.5kg，低于安全阈值 18kg。",
          highlights: ["差评率 8.7%", "库存 12.5kg", "规则 R-INV-009"],
          cards: [
            {
              type: "summary",
              title: "风险判断",
              badge: "高优先级",
              lines: ["苏州园区店属于复合型风险，不只是单一差评问题。", "如果不处理，晚市会同时受到断货和差评扩散影响。"],
            },
            {
              type: "summary",
              title: "风险拆解（文本）",
              badge: "证据排序",
              lines: [
                "差评风险：8.7%（高于均值 4.2%，高发问题是出餐超时和打包漏液）。",
                "库存风险：牛腩 12.5kg（低于阈值 18kg，预计明天 11:30 前出现断货）。",
                "时效风险：出餐超时 +18%（晚高峰放大，容易继续推高差评）。",
              ],
            },
          ],
          actions: ["查看报告", "生成任务"],
        },
        {
          role: "user",
          label: "区域运营负责人",
          time: "14:34",
          content: "如果今天只能推进一个动作，你建议先做什么？",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "14:35",
          content: "先做补货和现场复盘并行。补货 30kg 可以先解除断货风险；同时今天 16:00 督导到店，重点看晚高峰排班、打包 SOP 和新人站位。这个组合动作对晚市影响最大。",
          highlights: ["补货 30kg", "16:00 督导到店", "优先晚高峰排班"],
          cards: [
            {
              type: "task",
              title: "建议立即执行",
              status: "高优先级",
              fields: [
                { label: "补货", value: "30kg 牛腩" },
                { label: "巡检", value: "16:00 督导到店" },
                { label: "关注点", value: "排班 / 打包 / 新人站位" },
              ],
              actions: ["查看报告", "生成任务"],
            },
          ],
          actions: ["查看报告", "生成任务"],
        },
      ],
      artifacts: [
        {
          title: "高风险证据",
          type: "风险",
          lines: ["差评率 8.7% vs 均值 4.2%", "出餐超时 +18%", "牛腩库存少 5.5kg"],
          actions: ["查看报告"],
        },
        {
          title: "推荐闭环动作",
          type: "任务",
          lines: ["立即补货 30kg", "督导现场复盘", "加入巡检计划并追踪"],
          actions: ["生成任务"],
        },
      ],
      followUps: ["查看报告", "生成任务"],
    },
  },
  tasks: {
    title: "任务协同",
    subtitle: "AI 洞察 + 人工创建的执行闭环",
    defaultPanel: "tasks",
    focus: {
      title: "任务协同总览",
      items: [
        "总部派发给我：春菜上架、食安巡检共 4 条（2 条今日截止）。",
        "我拆解下发：督导 9 条、门店 27 条，当前整体完成度 68%。",
        "风险：2 条任务超时风险高，集中在苏州片区夜间巡检。",
      ],
      chips: ["看总部派发", "看我下发任务", "看完成度排行"],
    },
    summaryCards: [
      { label: "待处理", value: "18" },
      { label: "处理中", value: "7" },
      { label: "即将超时", value: "3" },
      { label: "待确认", value: "4" },
    ],
    filters: ["任务来源：AI分析", "状态：待处理/处理中/完成", "责任人：南京区", "区域：南京/苏州/杭州", "截止：近日"],
    list: [
      { title: "整改新店差评问题", source: "AI分析", status: "待处理", due: "明日 18:00" },
      { title: "巡检食安风险门店", source: "人工创建", status: "处理中", due: "后日 14:00" },
    ],
    detail: {
      title: "整改新店差评问题",
      lines: [
        "来源：门店风险页",
        "责任人：南京区域经理",
        "背景：近 2 日差评率持续上升",
        "关联指标：差评率↑1.9pct / 客单 / 订单量",
        "建议动作：抽查排班、扎实打包 SOP",
        "提交要求：上传整改照片 + 负责人签字",
        "回看节点：7 天后自动复盘（差评率下降 ≥0.5pct）",
      ],
      actions: ["标记处理中", "转派", "失效", "查看回看", "生成周报素材"],
    },
    conversation: {
      title: "会话流：任务生成后怎么跟进和回看",
      meta: "AI 生成任务 · 今天 13:40 · 已绑定责任人与回看条件",
      messages: [
        {
          role: "user",
          label: "区域运营负责人",
          time: "13:40",
          content: "生成任务后怎么跟进？我不想只是下发出去就结束。",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "13:41",
          content: "这条任务已经绑定完整闭环：责任人是南京区域经理，截止时间明日 18:00，需要上传整改照片和负责人签字。7 天后我会自动回看差评率是否回落 0.5pct。",
          highlights: ["责任人已绑定", "明日 18:00 截止", "7 天后自动回看"],
          cards: [
            {
              type: "task",
              title: "任务闭环配置",
              status: "已生成",
              fields: [
                { label: "责任人", value: "南京区域经理" },
                { label: "截止", value: "明日 18:00" },
                { label: "回看", value: "7 天后自动复盘" },
              ],
              actions: ["标记处理中", "查看回看"],
            },
          ],
        },
        {
          role: "user",
          label: "区域运营负责人",
          time: "13:42",
          content: "如果执行中发现门店自己处理不了呢？",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "13:43",
          content: "可以直接转派给督导组长做现场指导，同时保留原责任人回执义务。回看时我会把差评内容、补货完成度、巡检记录和周报素材一起沉淀，避免只盯一个结果指标。",
          highlights: ["支持转派", "保留原责任人", "自动沉淀周报素材"],
          cards: [
            {
              type: "agent",
              title: "回看沉淀链路",
              status: "已配置",
              steps: [
                { text: "督导现场记录回传", status: "done" },
                { text: "差评和补货数据自动汇总", status: "running" },
                { text: "周报素材自动沉淀", status: "pending" },
              ],
            },
          ],
          actions: ["标记处理中", "查看回看", "生成周报素材"],
        },
      ],
      artifacts: [
        {
          title: "任务闭环配置",
          type: "执行",
          lines: ["提交要求：整改照片 + 签字", "回看条件：差评率下降 >=0.5pct", "失败时支持升级转派"],
        },
        {
          title: "自动沉淀内容",
          type: "沉淀",
          lines: ["差评变化", "巡检记录", "补货完成度", "周报素材"],
        },
      ],
      followUps: ["标记处理中", "查看回看", "生成周报素材"],
    },
  },
  reports: {
    title: "报告中心",
    subtitle: "日报 / 周报 / 专题 · 角色模板切换",
    defaultPanel: "reports",
    focus: {
      title: "我订阅的沉淀报告",
      items: [
        "日报：老板 08:00 自动接收全国经营简报。",
        "周报：我在周一 09:00 收到华东经营复盘。",
        "专题：春季上新 / 新店口碑来自会话沉淀，每周五推送。",
      ],
      chips: ["看日报模板", "看周报快照", "看专题订阅"],
    },
    filters: ["Type：日报", "Template：老板", "Time：本周", "Status：草稿", "Filters：Region/Channel"],
    cards: [
      { title: "全国经营简报", tags: ["日报", "已订阅"], updated: "07:45" },
      { title: "华东经营复盘", tags: ["周报", "草稿"], updated: "03-19" },
      { title: "新店口碑周报", tags: ["专题", "草稿"], updated: "03-18" },
      { title: "活动效果分析", tags: ["专题", "草稿"], updated: "03-17" },
    ],
    detail: {
      title: "全国经营简报（每日）",
      lines: [
        "Audience：老板 / COO / 区域经理",
        "Conclusions：1) 营收环比 +1.8% 2) 外卖利润率下滑 1.2pct 3) 差评略回升",
        "Metrics：总营收 / 投入产出 / 会员复购 / 渠道占比",
        "Action：暂停低毛利活动，启动督导巡检",
      ],
      actions: ["立即推送", "保存为模板", "复制到其他区域"],
    },
    subscriptions: [
      "老板每日 8 点全国简报（微信/企微）",
      "华东区周一 9 点经营复盘（管家 + 邮件）",
      "新店口碑周报订阅（4 月试点）",
    ],
    subscriptionAction: "新建订阅",
    conversation: {
      title: "会话流：老板今天想看什么报告",
      meta: "定时简报 + 主动追问 · 今天 09:00",
      messages: [
        {
          role: "ai",
          label: "美团餐饮AI助手",
          badge: "定时简报",
          time: "09:00",
          content: "昨天经营简报已生成：营收环比 +1.8%，外卖利润率 -1.2pct，差评略回升。建议 08:00-09:00 区间推送给老板。",
          highlights: ["日报已生成", "适合老板先看", "风险点是外卖利润"],
          cards: [
            {
              type: "kpis",
              title: "老板日报摘要",
              items: [
                { label: "营收", value: "+1.8%", change: "环比增长", trend: "up" },
                { label: "外卖利润", value: "-1.2pct", change: "需关注", trend: "down" },
                { label: "差评", value: "略回升", change: "跟踪中", trend: "warning" },
                { label: "风险门店", value: "3 家", change: "已安排巡检", trend: "up" },
              ],
            },
          ],
        },
        {
          role: "user",
          label: "区域运营负责人",
          time: "09:03",
          content: "老板今天想看什么报告？别发太多，但要抓重点。",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "09:04",
          content: "建议先发日报：老板关心的是营收和异常，所以先给全国经营简报。华东周报可以给区域运营团队预览，重点看本周营收 +5.2%、外卖占比 27%、3 家风险门店已安排巡检。",
          highlights: ["日报先推老板", "周报给区域运营", "风险门店已安排巡检"],
          cards: [
            {
              type: "summary",
              title: "推荐汇报顺序",
              badge: "老板视角",
              lines: ["先发全国经营简报，让老板先看到营收和异常。", "区域运营再看周报，聚焦问题门店和动作执行。"],
            },
            {
              type: "table",
              title: "报告分发建议",
              columns: ["对象", "报告", "重点"],
              rows: [
                ["老板", "全国经营简报", "营收 + 异常"],
                ["区域运营", "华东经营复盘", "风险门店 + 动作"],
                ["专题跟踪", "新店口碑/春季上新", "按订阅发送"],
              ],
            },
          ],
        },
        {
          role: "user",
          label: "区域运营负责人",
          time: "09:05",
          content: "春季上新和新店口碑这种专题，要不要顺手订阅掉？",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "09:06",
          content: "可以。建议把新店口碑和春季上新专题都设为每周五 17:00 自动推送，这样老板在周会前能看到专题变化，不会被日报噪音打断。",
          highlights: ["专题改为每周五 17:00", "周会前推送", "减少日报噪音"],
          cards: [
            {
              type: "agent",
              title: "订阅编排建议",
              status: "待确认",
              steps: [
                { text: "日报：每日 08:00 推老板", status: "done" },
                { text: "周报：周一 09:00 推区域运营", status: "done" },
                { text: "专题：每周五 17:00 自动推送", status: "running" },
              ],
            },
          ],
          actions: ["立即推送", "保存为模板", "新建订阅"],
        },
      ],
      artifacts: [
        {
          title: "推荐推送顺序",
          type: "报告",
          lines: ["老板：全国经营简报", "区域运营：华东经营复盘", "专题：春季上新 / 新店口碑"],
        },
        {
          title: "订阅建议",
          type: "订阅",
          lines: ["日报每日 08:00", "周报周一 09:00", "专题每周五 17:00"],
        },
      ],
      followUps: ["立即推送", "保存为模板", "新建订阅"],
    },
  },
  push: {
    title: "定时/规则推送",
    subtitle: "把规则提醒、简报订阅和推送节奏统一编排",
    defaultPanel: "alerts",
    focus: {
      title: "定时与规则推送",
      items: [
        "当前生效规则 12 条，今天命中 9 次，L1 风险 3 次。",
        "定时任务 6 条：老板日报、区域周报、专题订阅已排班。",
        "待处理预警 4 条，其中 2 条来自下级提报。",
      ],
      chips: ["看规则命中", "看定时推送", "看待处理预警"],
    },
    summaryCards: [
      { label: "启用规则", value: "12" },
      { label: "今日触发", value: "9" },
      { label: "定时推送", value: "6" },
      { label: "静默窗口", value: "2" },
    ],
    filters: ["规则状态：启用", "对象：老板/区域运营", "时段：工作日", "渠道：企微/飞书", "类型：经营+风险"],
    rules: [
      { title: "外卖订单下滑预警", desc: "订单周同比下降 >= 15% 且差评上升", status: "启用", lastHit: "今天 10:22", action: "查看规则详情" },
      { title: "新店差评密集提醒", desc: "7 天内差评 >= 3 条且集中在口味/出餐", status: "启用", lastHit: "今天 09:40", action: "查看规则详情" },
      { title: "库存断货风险提醒", desc: "关键食材低于安全库存阈值", status: "启用", lastHit: "今天 08:55", action: "查看规则详情" },
    ],
    schedules: [
      "老板日报：每日 08:00（企微）",
      "区域周报：周一 09:00（工作台 + 邮件）",
      "专题推送：周五 17:00（飞书）",
    ],
    conversation: {
      title: "会话流：定时/规则推送编排优化",
      meta: "规则编排建议 · 今天 11:10",
      messages: [
        {
          role: "ai",
          label: "美团餐饮AI助手",
          badge: "主动建议",
          time: "11:10",
          content: "你当前启用了 12 条规则，其中 3 条在 08:00-09:00 高峰期集中触发，容易造成老板消息疲劳。建议做分层推送。",
          highlights: ["规则总数 12", "高峰冲突 3 条", "建议分层推送"],
          cards: [
            {
              type: "summary",
              title: "先说结论",
              badge: "推送优化",
              lines: ["高优风险继续实时推送。", "经营类提醒改为整点汇总。", "专题类固定到周会前发送。"],
            },
          ],
        },
        {
          role: "user",
          label: "区域运营负责人",
          time: "11:12",
          content: "行，给我一个能直接执行的推送编排方案。",
        },
        {
          role: "ai",
          label: "美团餐饮AI助手",
          time: "11:13",
          content: "已生成编排方案：高优风险实时、经营提醒每 2 小时汇总、专题周五 17:00 固定推送。你确认后我可以同步到飞书与工作台。",
          cards: [
            {
              type: "table",
              title: "推送编排方案",
              columns: ["层级", "内容", "频率", "渠道"],
              rows: [
                ["L1", "断货/食安/高风险门店", "实时", "工作台 + 飞书"],
                ["L2", "经营异常提醒", "2 小时汇总", "工作台"],
                ["L3", "专题分析", "每周五 17:00", "老板订阅"],
              ],
            },
            {
              type: "agent",
              title: "执行状态",
              status: "待确认",
              steps: [
                { text: "更新规则优先级", status: "done" },
                { text: "生成汇总推送模板", status: "running" },
                { text: "同步飞书机器人", status: "todo" },
              ],
            },
          ],
          actions: ["立即推送", "保存为模板", "查看规则详情"],
        },
      ],
      artifacts: [
        {
          title: "推送编排方案",
          type: "方案",
          lines: ["L1 实时预警", "L2 整点汇总", "L3 周会前专题"],
        },
      ],
      followUps: ["立即推送", "保存为模板", "查看规则详情"],
    },
  },
};

const conversations = {
  "conv-1": {
    title: "会话流：3月目标追踪：渠道/品类/区域缺口",
    meta: "基于业绩看板 + 目标追踪表 · 今天 16:10",
    messages: [
      {
        role: "user",
        label: "区域运营负责人",
        time: "16:10",
        content: "今天先给我结论：3月目标还差多少？线下和线上分别差多少？",
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "16:11",
        content: "结论先说：截至今天，3月总体达成 50.23%，累计缺口约 ¥2.39M。线上完成快于线下，线下是当前主要短板。",
        highlights: ["总达成 50.23%", "累计缺口 ¥2.39M", "线下压力更大"],
        cards: [
          {
            type: "kpis",
            title: "目标追踪总览",
            items: [
              { label: "总体达成", value: "50.23%", change: "仍低于计划", trend: "down" },
              { label: "线上达成", value: "54.16%", change: "高于线下", trend: "up" },
              { label: "线下达成", value: "48.51%", change: "缺口较大", trend: "down" },
              { label: "累计缺口", value: "¥2.39M", change: "需追赶", trend: "warning" },
            ],
          },
        ],
      },
      {
        role: "user",
        label: "区域运营负责人",
        time: "16:12",
        content: "最危险的三个负责人和区域给我。",
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "16:13",
        content: "当前掉队最明显的是苏州南区、南京北区和三督导片区，三者合计约占总缺口 41%。建议先下发 24 小时追赶任务。",
        cards: [
          {
            type: "table",
            title: "缺口 Top3",
            columns: ["区域/负责人", "达成率", "缺口", "日均完成", "风险"],
            rows: [
              ["苏州南区", "42.6%", "-¥0.68M", "-10.31%", "高"],
              ["南京北区", "47.6%", "-¥0.44M", "-8.24%", "中高"],
              ["三督导片区", "48.7%", "-¥0.37M", "-10.31%", "中高"],
            ],
          },
          {
            type: "task",
            title: "今日追赶任务包",
            status: "待确认",
            fields: [
              { label: "责任人", value: "3 位掉队负责人" },
              { label: "时限", value: "24 小时" },
              { label: "目标", value: "缩小缺口 ¥180,000" },
            ],
            actions: ["生成任务", "保存为报告"],
          },
        ],
        actions: ["生成任务", "下载报告"],
      },
    ],
    artifacts: [
      {
        title: "目标追踪日报",
        type: "报告",
        lines: ["总体达成 50.23%", "线上/线下差距 5.65pct", "缺口 Top3 已标注"],
      },
    ],
    followUps: ["看利润缺口", "看风险门店", "生成任务"],
  },
  "conv-2": {
    title: "会话流：周三活动复盘：营收贡献与利润稀释",
    meta: "基于周三第二斤半价活动名单 · 今天 15:32",
    messages: [
      {
        role: "user",
        label: "区域运营负责人",
        time: "15:32",
        content: "周三第二斤半价活动到底带来了多少营收？有没有把利润打薄？按区域和负责人拆开。",
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "15:33",
        content: "活动总体带来营收拉动，但出现“执行次数高、利润贡献低”的片区。建议保留头部样板区，收缩低效区并做 A/B 对照。",
        highlights: ["活动有增收", "两片区利润稀释", "建议A/B收缩"],
        cards: [
          {
            type: "summary",
            title: "活动结论",
            badge: "复盘结论",
            lines: ["活动在头部负责人区间有效。", "低效区应切换为满减 + 加价购策略。"],
          },
          {
            type: "table",
            title: "负责人执行效率",
            columns: ["负责人", "执行次数", "周营收环比", "周TC环比", "效率评级"],
            rows: [
              ["周成", "387", "-9.1%", "-8.3%", "低"],
              ["冉绍君", "611", "-6.3%", "-10.0%", "低"],
              ["何剑翱", "1153", "-8.4%", "-4.8%", "中"],
              ["司徒俊鹏", "170", "-1.8%", "-2.9%", "中高"],
            ],
          },
        ],
      },
      {
        role: "user",
        label: "区域运营负责人",
        time: "15:35",
        content: "今天给我可执行动作。",
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "15:36",
        content: "今天先做 3 件事：低效区暂停第二斤半价，切“满减+加价购”；高效区保留策略；48 小时回看利润率和执行效率。",
        cards: [
          {
            type: "task",
            title: "活动策略调整",
            status: "待确认",
            fields: [
              { label: "低效区", value: "暂停第二斤半价" },
              { label: "替代策略", value: "满减 + 加价购" },
              { label: "回看窗口", value: "48 小时" },
            ],
            actions: ["生成运营整改任务", "保存为报告"],
          },
        ],
        actions: ["生成运营整改任务", "下载报告"],
      },
    ],
    artifacts: [
      {
        title: "活动效果分析专题",
        type: "报告",
        lines: ["执行效率分层已输出", "低效区名单已标注", "48小时复盘已排程"],
      },
    ],
    followUps: ["只看外卖渠道", "保存为报告", "下载报告"],
  },
  "conv-3": {
    title: "会话流：平台口碑风险：好评率/差评/QSC归因",
    meta: "基于线上平台好评率&差评报表 · 今天 15:05",
    messages: [
      {
        role: "user",
        label: "区域运营负责人",
        time: "15:05",
        content: "线上好评率和差评是谁在拖后腿？差评主要集中在哪些门店、哪些 QSC 项？",
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "15:06",
        content: "综合好评率较上月提升，但差评集中度在苏州和南京片区上升。拖累平台主要是点评和抖音在部分门店的异常波动。",
        highlights: ["综合好评率提升", "差评集中度上升", "点评/抖音拖累"],
        cards: [
          {
            type: "kpis",
            title: "口碑总览",
            items: [
              { label: "综合好评率", value: "91.96%", change: "环比 +1.45%", trend: "up" },
              { label: "美团好评率", value: "93.35%", change: "稳定", trend: "up" },
              { label: "点评好评率", value: "88.84%", change: "波动", trend: "warning" },
              { label: "抖音好评率", value: "83.17%", change: "偏低", trend: "down" },
            ],
          },
          {
            type: "bars",
            title: "QSC 差评问题占比",
            items: [
              { label: "出餐速度", value: 41, valueLabel: "41%", meta: "高发", tone: "danger" },
              { label: "打包规范", value: 28, valueLabel: "28%", meta: "次高", tone: "warn" },
              { label: "食安记录", value: 19, valueLabel: "19%", meta: "需巡检" },
              { label: "服务沟通", value: 12, valueLabel: "12%", meta: "可训练" },
            ],
          },
        ],
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "15:08",
        content: "已为高发门店生成整改包：24 小时差评回复 + 48 小时食安巡检，并绑定 7 天回看指标。",
        cards: [
          {
            type: "table",
            title: "高风险门店",
            columns: ["门店", "平台", "好评率", "差评", "QSC 主因"],
            rows: [
              ["苏州园区店", "美团/点评", "85.7%", "12", "出餐慢"],
              ["南京中山店", "抖音/点评", "83.1%", "9", "打包漏液"],
              ["杭州西溪店", "点评", "87.3%", "6", "食安记录"],
            ],
          },
          {
            type: "task",
            title: "口碑整改任务包",
            status: "待下发",
            fields: [
              { label: "24h", value: "差评回复与复盘" },
              { label: "48h", value: "食安巡检" },
              { label: "7天", value: "口碑回看" },
            ],
            actions: ["加入巡检计划", "推送督导通知"],
          },
        ],
        actions: ["加入巡检计划", "下载报告"],
      },
    ],
    artifacts: [
      {
        title: "好差评率及分析报告",
        type: "报告",
        lines: ["平台分布已拆分", "QSC 聚类已输出", "高风险门店已入任务"],
      },
    ],
    followUps: ["查看异常门店", "加入巡检计划", "下载报告"],
  },
  "conv-4": {
    title: "会话流：单店盈利提升方案：90天执行版",
    meta: "基于 docs/interview/单店盈利提升方案.xlsx · 今天 14:18",
    messages: [
      {
        role: "user",
        label: "区域运营负责人",
        time: "14:18",
        content: "参考单店盈利提升方案.xlsx，先针对粤饺皇（佳兆业店）给我一版90天可执行方案。",
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "14:19",
        content: "结论：这家店可达月均 85,000，但必须同步拉升线下熟食客单与外卖单量。当前营业实收约 81,000，接近保本线 85,500。",
        highlights: ["目标月均 85,000", "当前实收约 81,000", "保本线 85,500"],
        cards: [
          {
            type: "kpis",
            title: "单店现状",
            items: [
              { label: "当前月实收", value: "¥81,000", change: "低于目标", trend: "down" },
              { label: "保本线", value: "¥85,500", change: "差额 ¥4,500", trend: "warning" },
              { label: "外卖占比", value: "57%", change: "需恢复单量", trend: "down" },
              { label: "近6月利润", value: "波动", change: "2月 -¥1,741", trend: "down" },
            ],
          },
          {
            type: "table",
            title: "投入产出测算",
            columns: ["动作", "投入", "预计产出", "ROI", "负责人"],
            rows: [
              ["线下套餐+社群引流", "¥0~¥500", "+¥1,000", "2.0", "周成"],
              ["外卖投流（美团）", "¥1,500", "+¥2,475", "1.65", "郑棉涛"],
              ["团购结构优化", "¥0", "稳定团购单量", "-", "陈悦"],
            ],
          },
        ],
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "14:21",
        content: "我已拆成三阶段执行：第1-2周线下引流，第3-6周外卖提量，第7-12周团购与复购优化。每周自动回看四个指标，连续两周未达标会触发调参提醒。",
        cards: [
          {
            type: "agent",
            title: "90天执行编排",
            status: "已排程",
            steps: [
              { text: "第1-2周：线下套餐与社群引流", status: "done" },
              { text: "第3-6周：外卖投流与客单保护", status: "running" },
              { text: "第7-12周：团购优化与复购触达", status: "pending" },
            ],
          },
        ],
        actions: ["生成任务", "保存为报告", "下载报告"],
      },
    ],
    artifacts: [
      {
        title: "单店盈利提升方案",
        type: "方案",
        lines: ["周期：90天", "总投入：约¥1,500", "目标：月均≥¥85,000"],
      },
    ],
    followUps: ["生成任务", "查看回看", "下载报告"],
  },
  "conv-5": {
    title: "会话流：总部任务闭环：拆解、派发、回看",
    meta: "总部任务协同 · 今天 13:42",
    messages: [
      {
        role: "user",
        label: "区域运营负责人",
        time: "13:42",
        content: "总部下发任务里，我哪些还没拆解完？哪些督导执行掉队？",
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "13:43",
        content: "当前总部任务整体完成度 68%。苏州片区掉队最明显，有 3 条任务在 24 小时内超时。",
        cards: [
          {
            type: "table",
            title: "任务执行分层",
            columns: ["层级", "总任务", "完成率", "超时风险", "备注"],
            rows: [
              ["总部→区域", "12", "83%", "1", "拆解基本完成"],
              ["区域→督导", "26", "69%", "3", "苏州片区偏慢"],
              ["督导→门店", "54", "64%", "6", "夜间巡检回执慢"],
            ],
          },
          {
            type: "task",
            title: "24h 追赶任务",
            status: "待确认",
            fields: [
              { label: "优先片区", value: "苏州南区" },
              { label: "追赶目标", value: "完成率 +12%" },
              { label: "回看节点", value: "7天" },
            ],
            actions: ["标记处理中", "查看回看"],
          },
        ],
        actions: ["标记处理中", "生成周报素材"],
      },
    ],
    artifacts: [
      {
        title: "任务闭环周报素材",
        type: "沉淀",
        lines: ["执行率分层", "超时风险清单", "督导掉队原因"],
      },
    ],
    followUps: ["查看回看", "生成周报素材", "标记处理中"],
  },
  "conv-6": {
    title: "会话流：周营收+好差评综合报告沉淀",
    meta: "报告沉淀与订阅 · 今天 11:20",
    messages: [
      {
        role: "user",
        label: "区域运营负责人",
        time: "11:20",
        content: "给我一份可下载的周营收分析和好差评分析，老板和我都能看。",
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "11:21",
        content: "已生成综合报告：本周营收同比 +8.5%，外卖占比 42%，综合好评率 91.96%，但苏州片区差评环比仍上升。",
        cards: [
          {
            type: "summary",
            title: "综合结论",
            badge: "可推送",
            lines: ["营收增长稳定，活动贡献明显。", "口碑风险集中在少数片区，建议并行整改。"],
          },
          {
            type: "kpis",
            title: "报告核心指标",
            items: [
              { label: "周营收", value: "¥128,450", change: "同比 +8.5%", trend: "up" },
              { label: "外卖占比", value: "42%", change: "环比提升", trend: "up" },
              { label: "综合好评率", value: "91.96%", change: "环比 +1.45%", trend: "up" },
              { label: "差评风险门店", value: "3 家", change: "需跟进", trend: "warning" },
            ],
          },
        ],
        actions: ["查看图表", "下载报告", "立即推送"],
      },
    ],
    artifacts: [
      {
        title: "周营收+好差评综合报告",
        type: "报告",
        lines: ["快照ID：#RPT-20260316-003", "模板：老板+区域运营", "状态：已验证"],
      },
    ],
    followUps: ["查看图表", "下载报告", "新建订阅"],
  },
  "conv-7": {
    title: "会话流：定时/规则推送命中优先级",
    meta: "规则命中调度 · 今天 10:50",
    messages: [
      {
        role: "user",
        label: "区域运营负责人",
        time: "10:50",
        content: "今天规则命中里，哪些要我马上处理？下级提报和AI主动发现比例是多少？",
      },
      {
        role: "ai",
        label: "美团餐饮AI助手",
        time: "10:51",
        content: "今天共命中 9 次，L1 高优风险 3 条需要立即处理。提醒来源中，AI 主动发现占 66%，下级提报占 34%。",
        cards: [
          {
            type: "table",
            title: "命中优先级",
            columns: ["级别", "数量", "典型事件", "处理时效"],
            rows: [
              ["L1", "3", "片区利润率下滑/食安风险", "实时"],
              ["L2", "4", "目标偏离/活动低效", "2小时汇总"],
              ["L3", "2", "专题波动", "周会前"],
            ],
          },
          {
            type: "agent",
            title: "推送编排",
            status: "待确认",
            steps: [
              { text: "L1 实时推送给区域经理", status: "done" },
              { text: "L2 并入12:00汇总", status: "running" },
              { text: "L3 周五17:00专题推送", status: "pending" },
            ],
          },
        ],
        actions: ["查看规则详情", "立即推送", "保存为模板"],
      },
    ],
    artifacts: [
      {
        title: "规则命中周报",
        type: "推送",
        lines: ["总命中 9 次", "AI主动发现 66%", "下级提报 34%"],
      },
    ],
    followUps: ["查看规则详情", "立即推送", "保存为模板"],
  },
};

// Keep home default conversation aligned with the top themed thread.
pages.home.conversation = conversations["conv-1"];

const conversationPanels = {
  "conv-1": {
    tasks: [
      {
        title: "3月目标追赶任务（Top3片区）",
        status: "待处理",
        chain: "区域负责人 → 三位片区负责人 → 督导组",
        due: "2026-03-21 18:00",
        progress: "22%（已确认1/3片区）",
        meta: "目标：24小时缩小缺口 ¥180,000",
        actions: ["生成任务"],
      },
    ],
    alerts: [
      {
        title: "[高] 目标缺口预警",
        status: "待处理",
        source: "美团餐饮AI助手主动发现",
        trigger: "今天 16:11",
        impact: "累计缺口 ¥2.39M；线下达成仅 48.51%",
        suggestion: "优先推进苏州南区/南京北区追赶动作",
        actions: ["看利润缺口"],
      },
    ],
    reports: [
      {
        title: "📈 3月目标追踪日报",
        source: "美团餐饮AI助手生成",
        snapshotId: "#RPT-20260320-101",
        generatedAt: "2026-03-20 16:14",
        summary: "总体达成 50.23%，缺口集中在三片区。",
        metrics: [
          { label: "总达成", value: "50.23%" },
          { label: "累计缺口", value: "¥2.39M" },
          { label: "线下达成", value: "48.51%" },
        ],
        verified: "已验证",
        evidence: ["缺口Top3已定位", "线上/线下差距 5.65pct", "追赶任务已生成"],
        actions: ["查看图表", "下载报告"],
      },
    ],
  },
  "conv-2": {
    tasks: [
      {
        title: "活动策略A/B调整",
        status: "待确认",
        chain: "区域负责人 → 片区督导 → 活动门店",
        due: "2026-03-22 12:00",
        progress: "10%（策略确认中）",
        meta: "低效区改满减+加价购，高效区保留原策略",
        actions: ["生成运营整改任务"],
      },
    ],
    alerts: [
      {
        title: "[中] 活动利润稀释风险",
        status: "待处理",
        source: "美团餐饮AI助手主动发现",
        trigger: "今天 15:33",
        impact: "两片区执行次数高但利润贡献偏低",
        suggestion: "48小时回看利润率并决定是否收缩",
        actions: ["只看外卖渠道"],
      },
    ],
    reports: [
      {
        title: "📈 活动效果分析专题",
        source: "用户创建",
        snapshotId: "#RPT-20260320-102",
        generatedAt: "2026-03-20 15:37",
        summary: "活动增收有效但存在分区效率差异。",
        metrics: [
          { label: "活动覆盖", value: "322店" },
          { label: "执行均价", value: "¥44.2" },
          { label: "低效片区", value: "2个" },
        ],
        verified: "待复核",
        evidence: ["负责人效率分层已输出", "低效区名单已标注", "复盘窗口48小时"],
        actions: ["查看图表", "下载报告"],
      },
    ],
  },
  "conv-3": {
    tasks: [
      {
        title: "口碑整改任务包",
        status: "待下发",
        chain: "区域负责人 → 督导组 → 高风险门店",
        due: "2026-03-21 20:00",
        progress: "0%（待确认）",
        meta: "24h差评回复 + 48h食安巡检 + 7天回看",
        actions: ["加入巡检计划"],
      },
    ],
    alerts: [
      {
        title: "[高] 差评集中度上升",
        status: "待处理",
        source: "美团餐饮AI助手主动发现",
        trigger: "今天 15:06",
        impact: "苏州/南京片区差评集中，点评和抖音波动明显",
        suggestion: "优先处理出餐速度和打包规范问题",
        actions: ["查看异常门店"],
      },
    ],
    reports: [
      {
        title: "📈 好差评率及分析报告",
        source: "美团餐饮AI助手生成",
        snapshotId: "#RPT-20260320-103",
        generatedAt: "2026-03-20 15:09",
        summary: "综合好评率 91.96%，但差评集中度上升。",
        metrics: [
          { label: "综合好评率", value: "91.96%" },
          { label: "环比", value: "+1.45%" },
          { label: "风险门店", value: "3 家" },
        ],
        verified: "已验证",
        evidence: ["平台分布已拆分", "QSC聚类已输出", "高风险门店已标注"],
        actions: ["查看图表", "下载报告"],
      },
    ],
  },
  "conv-4": {
    tasks: [
      {
        title: "90天单店盈利提升执行",
        status: "处理中",
        chain: "区域负责人 → 店长/督导 → 运营支持",
        due: "2026-06-18",
        progress: "33%（第1阶段进行中）",
        meta: "佳兆业店：线下引流已启动，外卖投流待上线",
        actions: ["生成任务"],
      },
    ],
    alerts: [
      {
        title: "[中] 单店盈利回看提醒",
        status: "待处理",
        source: "美团餐饮AI助手主动发现",
        trigger: "今天 14:21",
        impact: "若连续两周未达标将触发策略调参",
        suggestion: "本周先跟踪日均营收与熟食客单",
        actions: ["查看回看"],
      },
    ],
    reports: [
      {
        title: "📈 单店盈利提升方案",
        source: "用户创建",
        snapshotId: "#RPT-20260320-104",
        generatedAt: "2026-03-20 14:22",
        summary: "90天目标月均≥¥85,000，总投入约¥1,500。",
        metrics: [
          { label: "当前实收", value: "¥81,000" },
          { label: "保本线", value: "¥85,500" },
          { label: "ROI目标", value: "1.65+" },
        ],
        verified: "已验证",
        evidence: ["近6月营收/利润已纳入", "渠道占比与机会点已拆分", "阶段任务已排程"],
        actions: ["查看图表", "下载报告"],
      },
    ],
  },
  "conv-5": {
    tasks: [
      {
        title: "总部任务24h追赶",
        status: "待处理",
        chain: "总部 → 区域负责人 → 督导 → 门店",
        due: "2026-03-21 18:00",
        progress: "68%（总体）",
        meta: "苏州片区3条任务临近超时",
        actions: ["标记处理中"],
      },
    ],
    alerts: [
      {
        title: "[高] 督导执行掉队",
        status: "待处理",
        source: "下级提报",
        trigger: "今天 13:43",
        impact: "区域→督导层完成率仅 69%，3条24h超时风险",
        suggestion: "优先催办苏州南区并补齐夜间巡检回执",
        actions: ["查看全部任务"],
      },
    ],
    reports: [
      {
        title: "📈 任务闭环周报素材",
        source: "美团餐饮AI助手生成",
        snapshotId: "#RPT-20260320-105",
        generatedAt: "2026-03-20 13:45",
        summary: "任务完成率 68%，掉队主因在督导层执行速度。",
        metrics: [
          { label: "总部→区域", value: "83%" },
          { label: "区域→督导", value: "69%" },
          { label: "督导→门店", value: "64%" },
        ],
        verified: "已验证",
        evidence: ["分层执行率已输出", "超时清单已标注", "7天回看已绑定"],
        actions: ["查看图表", "下载报告"],
      },
    ],
  },
  "conv-6": {
    tasks: [
      {
        title: "综合报告推送任务",
        status: "处理中",
        chain: "区域负责人 → 数据专员 → 老板订阅组",
        due: "2026-03-20 18:00",
        progress: "75%（已生成待推送）",
        meta: "日报+周报合并视图已完成",
        actions: ["立即推送"],
      },
    ],
    alerts: [
      {
        title: "[中] 报告待发送",
        status: "待处理",
        source: "美团餐饮AI助手主动发现",
        trigger: "今天 11:22",
        impact: "老板模板报告已生成但尚未推送",
        suggestion: "先推老板版，再推区域运营版",
        actions: ["查看报告"],
      },
    ],
    reports: [
      {
        title: "📈 周营收+好差评综合报告",
        source: "用户创建",
        snapshotId: "#RPT-20260316-003",
        generatedAt: "2026-03-20 11:21",
        summary: "周营收同比+8.5%，综合好评率 91.96%。",
        metrics: [
          { label: "周营收", value: "¥128,450" },
          { label: "同比", value: "+8.5%" },
          { label: "外卖占比", value: "42%" },
        ],
        verified: "已验证",
        evidence: ["平台与区域分布已拆分", "QSC问题聚类已附图", "风险门店对比已标注"],
        actions: ["查看图表", "下载报告"],
      },
    ],
  },
  "conv-7": {
    tasks: [
      {
        title: "规则分层推送调整",
        status: "待确认",
        chain: "区域负责人 → 数据运营 → 飞书/企微机器人",
        due: "2026-03-20 17:00",
        progress: "50%（方案已生成）",
        meta: "L1实时，L2汇总，L3周会前推送",
        actions: ["保存为模板"],
      },
    ],
    alerts: [
      {
        title: "[高] L1 风险命中",
        status: "待处理",
        source: "美团餐饮AI助手主动发现",
        trigger: "今天 10:51",
        impact: "今日命中 9 次，其中 L1 高优 3 次",
        suggestion: "立即推送区域经理并附整改动作",
        actions: ["查看规则详情"],
      },
    ],
    reports: [
      {
        title: "📈 规则命中周报",
        source: "美团餐饮AI助手生成",
        snapshotId: "#RPT-20260320-106",
        generatedAt: "2026-03-20 10:55",
        summary: "AI主动发现占66%，下级提报占34%。",
        metrics: [
          { label: "总命中", value: "9 次" },
          { label: "L1 风险", value: "3 次" },
          { label: "触达率", value: "100%" },
        ],
        verified: "已验证",
        evidence: ["来源拆分已输出", "分层推送策略已生成", "执行日志可追溯"],
        actions: ["查看图表", "下载报告"],
      },
    ],
  },
};


const state = {
  page: 'home',
  panelTab: pages.home.defaultPanel,
  activeConversationId: null,
  dynamicPanels: {
    tasks: [],
    alerts: [],
    reports: [],
  },
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

const PRIMARY_REPORT_ACTIONS = new Set(['查看报告', '保存为报告']);
const PRIMARY_TASK_ACTIONS = new Set(['生成任务', '生成整改任务', '生成运营整改任务', '生成巡检任务', '加入巡检计划']);
const PRIMARY_ACTIONS = new Set(['查看报告', '生成任务']);
const STATUS_ACTIONS = new Set(['标记处理中', '转派', '失效']);
const REVIEW_ACTIONS = new Set(['查看回看', '下载报告', '查看图表']);
const NAVIGATION_ACTIONS = new Set([
  '查看异常门店',
  '查看规则详情',
  '看利润缺口',
  '看风险门店',
  '看任务进度',
  '看定时推送',
  '展开看南京门店',
  '只看外卖渠道',
]);

function actionSemantic(label) {
  if (PRIMARY_REPORT_ACTIONS.has(label)) return 'primary-report';
  if (PRIMARY_TASK_ACTIONS.has(label)) return 'primary-task';
  if (STATUS_ACTIONS.has(label)) return 'status';
  if (REVIEW_ACTIONS.has(label)) {
    if (label === '查看回看') return 'review';
    if (label === '下载报告') return 'download';
    if (label === '查看图表') return 'chart';
  }
  if (NAVIGATION_ACTIONS.has(label)) return 'navigation';
  return null;
}

function uniqueLabels(labels) {
  return labels.filter((label, index) => labels.indexOf(label) === index);
}

function collectConversationActions(conversation) {
  const labels = [];
  if (!conversation) return labels;

  if (conversation.followUps?.length) {
    labels.push(...conversation.followUps);
  }
  for (const message of conversation.messages || []) {
    if (message.actions?.length) {
      labels.push(...message.actions);
    }
    for (const card of message.cards || []) {
      if (card.actions?.length) {
        labels.push(...card.actions);
      }
    }
  }
  for (const artifact of conversation.artifacts || []) {
    if (artifact.actions?.length) {
      labels.push(...artifact.actions);
    }
  }
  return uniqueLabels(labels);
}

function hasReportCapability(labels) {
  return labels.some(
    (label) =>
      actionSemantic(label) === 'primary-report'
      || label === '查看图表'
      || label === '下载报告'
      || label === '生成周报素材',
  );
}

function hasTaskCapability(labels) {
  return labels.some((label) => actionSemantic(label) === 'primary-task');
}

function mainActionsForConversation(conversation) {
  const labels = collectConversationActions(conversation);
  const next = [];
  if (hasReportCapability(labels)) {
    next.push('查看报告');
  }
  if (hasTaskCapability(labels)) {
    next.push('生成任务');
  }
  return next.slice(0, 2);
}

function navActionsForConversation(conversation) {
  const labels = collectConversationActions(conversation);
  return labels.filter((label) => actionSemantic(label) === 'navigation');
}

function filterConversationCardActions(actions = []) {
  return actions.filter((label) => !PRIMARY_ACTIONS.has(label) && !PRIMARY_REPORT_ACTIONS.has(label) && !PRIMARY_TASK_ACTIONS.has(label));
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
    '转派': 'tasks',
    '失效': 'tasks',
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

function isGoalTrackingContext() {
  if (state.activeConversationId === 'conv-1') {
    return true;
  }
  if (state.activeConversationId) {
    return false;
  }
  return state.page === 'home' && pages.home.conversation?.title?.includes('3月目标追踪');
}

function isProfitAnalysisContext() {
  const active = activeConversation();
  if (active?.title?.includes('利润率下降归因拆解到门店和动作')) {
    return true;
  }
  if (state.activeConversationId) {
    return false;
  }
  return state.page === 'analysis' && pages.analysis.conversation?.title?.includes('利润率下降归因拆解到门店和动作');
}

function isRiskStoreContext() {
  const active = activeConversation();
  if (active?.title?.includes('哪家门店风险最高，先处理什么')) {
    return true;
  }
  if (state.activeConversationId) {
    return false;
  }
  return state.page === 'risk' && pages.risk.conversation?.title?.includes('哪家门店风险最高，先处理什么');
}

function isSingleStoreProfitContext() {
  return state.activeConversationId === 'conv-4';
}

function upsertDynamicPanelItem(tab, item) {
  const next = [...state.dynamicPanels[tab]];
  const index = next.findIndex((entry) => entry.title === item.title);
  const existed = index >= 0;
  if (index >= 0) {
    next[index] = { ...next[index], ...item };
  } else {
    next.unshift(item);
  }
  state.dynamicPanels[tab] = next;
  return existed;
}

function panelItemsForTab(tab) {
  const prev = state.panelTab;
  state.panelTab = tab;
  const items = panelItemsForCurrentPage();
  state.panelTab = prev;
  return items;
}

function reportItemsForCurrentContext() {
  return panelItemsForTab('reports');
}

function taskItemsForCurrentContext() {
  return panelItemsForTab('tasks');
}

function preferredReportTitleForContext() {
  if (isRiskStoreContext()) {
    return '📈 苏州园区店风险处置简报';
  }

  const byConversation = {
    'conv-1': '📈 3月目标追踪日报',
    'conv-2': '📈 活动效果分析专题',
    'conv-3': '📈 好差评率及分析报告',
    'conv-4': '📈 单店盈利提升方案',
    'conv-5': '📈 任务闭环周报素材',
    'conv-6': '📈 周营收+好差评综合报告',
    'conv-7': '📈 规则命中周报',
  };
  if (state.activeConversationId && byConversation[state.activeConversationId]) {
    return byConversation[state.activeConversationId];
  }

  const byPage = {
    home: '📈 周营收分析',
    analysis: '📈 目标达成与缺口分析',
    risk: '📈 风险门店周报',
    tasks: '📈 任务闭环复盘',
    reports: '📈 周营收分析',
    push: '📈 推送规则命中周报',
  };
  return byPage[state.page] || '';
}

function preferredTaskTitleForContext() {
  const byConversation = {
    'conv-1': '片区目标追赶任务',
    'conv-2': '活动策略A/B调整',
    'conv-3': '口碑整改任务包',
    'conv-4': '佳兆业店90天盈利提升任务',
    'conv-5': '总部任务24h追赶',
    'conv-6': '综合报告推送任务',
    'conv-7': '规则分层推送调整',
  };
  if (state.activeConversationId && byConversation[state.activeConversationId]) {
    return byConversation[state.activeConversationId];
  }

  const byPage = {
    home: '片区目标追赶任务',
    analysis: '利润整改任务',
    risk: '风险闭环任务',
    tasks: '总部任务24h追赶',
    reports: '综合报告推送任务',
    push: '规则分层推送调整',
  };
  return byPage[state.page] || '会话跟进任务';
}

function focusPanelCard(selector, targetTitle) {
  requestAnimationFrame(() => {
    const panelBody = app.querySelector('.right-panel .panel-body');
    if (!panelBody) return;

    panelBody.scrollTo({ top: 0, behavior: 'smooth' });

    const cards = Array.from(panelBody.querySelectorAll(selector));
    if (!cards.length) return;

    const target = cards.find((card) => card.getAttribute('data-panel-title') === targetTitle) || cards[0];
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.add('focus-target');
    setTimeout(() => target.classList.remove('focus-target'), 1400);
  });
}

function focusReportCard(title) {
  focusPanelCard('.report-panel-card', title);
}

function focusTaskCard(title) {
  focusPanelCard('.task-panel-card', title);
}

function buildReportItemForContext(title) {
  if (isGoalTrackingContext()) {
    return {
      title,
      source: '美团餐饮AI助手生成',
      snapshotId: '#RPT-20260323-HOME-001',
      generatedAt: '2026-03-23 18:40',
      summary: '当前掉队最明显的是苏州南区、南京北区和三督导片区，三者合计约占总缺口 41%。',
      metrics: [
        { label: '总体达成', value: '50.23%' },
        { label: '累计缺口', value: '¥2.39M' },
        { label: '重点片区', value: '3 个' },
      ],
      verified: '已验证',
      evidence: [
        '线下达成 48.51%，低于线上 54.16%',
        '缺口 Top3 片区已生成 24 小时追赶清单',
        '预计追赶后可回补缺口约 ¥180,000',
      ],
      actions: ['查看图表', '下载报告'],
    };
  }

  if (isProfitAnalysisContext()) {
    return {
      title: '📈 利润归因分析简报',
      source: '美团餐饮AI助手生成',
      snapshotId: '#RPT-20260323-ANL-001',
      generatedAt: '2026-03-23 18:58',
      summary: '南京中山店和苏州园区店合计贡献了本次利润下滑的 57%，属于优先整改对象。',
      metrics: [
        { label: '重点门店', value: '2 家' },
        { label: '下滑贡献', value: '57%' },
        { label: '包装成本偏差', value: '+2.1pct' },
      ],
      verified: '已验证',
      evidence: [
        '南京中山店利润率 4.8%，包装成本占比 23%',
        '苏州园区店客单价 -6%，配送补偿异常上升',
        '活动毛利下降 8.4%，新店差评贡献 62%',
      ],
      actions: ['查看图表', '下载报告'],
    };
  }

  if (isRiskStoreContext()) {
    return {
      title: '📈 苏州园区店风险处置简报',
      source: '美团餐饮AI助手生成',
      snapshotId: '#RPT-20260323-RSK-001',
      generatedAt: '2026-03-23 19:20',
      summary: '苏州园区店复合风险由差评、库存、时效三项叠加触发，建议先补货再做晚高峰流程修复。',
      metrics: [
        { label: '差评率', value: '8.7%' },
        { label: '库存缺口', value: '5.5kg' },
        { label: '出餐超时', value: '+18%' },
      ],
      verified: '待复核',
      evidence: [
        '差评高发问题：出餐慢、打包漏液，集中在 19:00-20:00',
        '牛腩库存 12.5kg，低于安全阈值 18kg',
        '建议动作：补货30kg + 16:00督导巡检 + 22:00复盘回传',
      ],
      actions: ['查看图表', '下载报告'],
    };
  }

  return {
    title,
    source: '美团餐饮AI助手生成',
    snapshotId: '#RPT-20260323-AUTO',
    generatedAt: '2026-03-23 20:15',
    summary: '已按当前会话沉淀核心结论与执行建议，可直接用于汇报与回看。',
    metrics: [
      { label: '结论', value: '已沉淀' },
      { label: '证据', value: '已附带' },
      { label: '状态', value: '可下载' },
    ],
    verified: '待复核',
    evidence: [
      '已抽取当前会话中的关键结论',
      '已关联对应任务与回看节点',
      '可继续补充图表后再次导出',
    ],
    actions: ['查看图表', '下载报告'],
  };
}

function buildTaskItemForContext(title) {
  if (isGoalTrackingContext()) {
    return {
      title: '片区目标追赶任务',
      status: '进行中',
      chain: '苏州南区、南京北区和三督导片区 -> 对应30家门店',
      due: '2026-03-24 18:00（24小时追赶）',
      progress: '23%（7/30门店已提交追赶计划）',
      meta: '任务要求：24小时内提交片区追赶方案，优先恢复线下缺口并回传门店达成预测',
      replay: '回看节点：次日 10:00 检查达成率和缺口回补',
      actions: ['查看全部任务'],
    };
  }

  if (isProfitAnalysisContext()) {
    return {
      title: '南京/苏州利润整改任务',
      status: '进行中',
      chain: '区域负责人 -> 南京督导、苏州督导 -> 两地重点门店',
      due: '2026-03-24 16:00',
      progress: '31%（5/16 门店已提交整改动作）',
      meta: '任务要求：暂停低毛利活动、复核配送补偿、16:00 前完成打包SOP抽查并回传结果',
      replay: '回看节点：48小时后检查利润率和补贴偏差',
      actions: ['查看全部任务'],
    };
  }

  if (isRiskStoreContext()) {
    return {
      title: '苏州园区店风险闭环任务',
      status: '进行中',
      chain: '区域负责人 -> 苏州督导 -> 苏州园区店值班经理',
      due: '2026-03-23 20:00',
      progress: '40%（2/5 动作已回执）',
      meta: '任务要求：30kg补货、16:00督导到店、晚高峰排班与打包SOP抽检，22:00回传差评与库存快照',
      replay: '回看节点：22:00 回传差评与库存快照',
      actions: ['查看全部任务'],
    };
  }

  if (isSingleStoreProfitContext()) {
    return {
      title: '佳兆业店90天盈利提升任务',
      status: '进行中',
      chain: '区域负责人 -> 店长/督导 -> 运营支持',
      due: '2026-06-18',
      progress: '33%（第1阶段进行中）',
      meta: '任务要求：先完成第1-2周线下套餐引流与社群拉新，并回传日均营收与熟食客单两项回看数据',
      replay: '回看节点：每周一 09:00 自动回看四项指标',
      actions: ['查看全部任务'],
    };
  }

  return {
    title,
    status: '进行中',
    chain: '区域负责人 -> 督导 -> 门店',
    due: '2026-03-24 18:00',
    progress: '10%（待补充执行回执）',
    meta: '任务由会话动作生成，可继续补充责任人与截止节点。',
    replay: '回看节点：7天后自动回看完成率与结果指标',
    actions: ['查看全部任务'],
  };
}

function ensureReportForCurrentContext() {
  const preferred = preferredReportTitleForContext();
  const reports = reportItemsForCurrentContext();
  const exists = reports.find((item) => item.title === preferred);
  if (exists) {
    return { title: exists.title, created: false };
  }

  const title = preferred || reports[0]?.title || '📈 会话沉淀报告';
  upsertDynamicPanelItem('reports', buildReportItemForContext(title));
  return { title, created: true };
}

function upsertPrimaryTaskForCurrentContext() {
  const title = preferredTaskTitleForContext();
  const existed = upsertDynamicPanelItem('tasks', buildTaskItemForContext(title));
  return { title, existed };
}

function ensureReplayTaskForCurrentContext() {
  const preferred = preferredTaskTitleForContext();
  const tasks = taskItemsForCurrentContext();
  const existing = tasks.find((item) => item.title === preferred) || tasks[0];
  if (existing?.replay) {
    return { title: existing.title, created: false };
  }

  const title = existing?.title || preferred;
  upsertDynamicPanelItem('tasks', {
    ...buildTaskItemForContext(title),
    title,
    replay: '回看节点：已绑定差评、利润和执行回执三项回看数据',
  });
  return { title, created: true };
}

function triggerReportDownload() {
  const title = preferredReportTitleForContext() || '会话沉淀报告';
  const content = [
    `报告标题：${title}`,
    '来源：美团餐饮AI助手',
    '导出时间：2026-03-23 20:15',
    '说明：这是 Demo 下载内容，用于演示下载动作已触发。',
  ].join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'demo-report.txt';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
}

function handleStatusAction(label) {
  const statusByAction = {
    '标记处理中': '进行中',
    '转派': '已转派',
    '失效': '已失效',
  };
  const title = preferredTaskTitleForContext();
  upsertDynamicPanelItem('tasks', {
    ...buildTaskItemForContext(title),
    title,
    status: statusByAction[label] || '进行中',
    meta: `状态流已更新：${label}（Mock）`,
  });
  renderApp();
  showToast(`已执行：${label}（仅Mock状态流）`);
  return true;
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

  if (semantic === 'status') {
    return handleStatusAction(label);
  }

  if (semantic === 'review') {
    const result = ensureReplayTaskForCurrentContext();
    state.panelTab = 'tasks';
    renderApp();
    focusTaskCard(result.title);
    showToast(result.created ? `已补齐回看并定位：${result.title}` : `已定位回看：${result.title}`);
    return true;
  }

  if (semantic === 'download') {
    triggerReportDownload();
    showToast('报告下载已触发（Demo）');
    return true;
  }

  return false;
}

function panelItemsForCurrentPage() {
  let baseItems = [];

  if (state.activeConversationId) {
    const scopedPanels = conversationPanels[state.activeConversationId] || {};
    baseItems = scopedPanels[state.panelTab] || [];
  } else {
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
            source: '美团餐饮AI助手主动发现',
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
            source: '美团餐饮AI助手主动发现',
            trigger: '今天 11:02',
            impact: '生鲜达成率 84%，缺口 ¥21,000',
            suggestion: '优先复制杭州样板店活动结构',
            actions: ['看利润缺口'],
          },
        ],
        reports: [
          {
            title: '📈 目标达成与缺口分析',
            source: '美团餐饮AI助手生成',
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
            source: '美团餐饮AI助手主动发现',
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
            source: '美团餐饮AI助手生成',
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
            source: '美团餐饮AI助手主动发现',
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
            source: '美团餐饮AI助手主动发现',
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
            source: '美团餐饮AI助手生成',
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
            source: '美团餐饮AI助手主动发现',
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
            source: '美团餐饮AI助手生成',
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
    baseItems = pagePanels[state.panelTab] || sharedPanels[state.panelTab] || [];
  }

  const dynamic = state.dynamicPanels[state.panelTab] || [];
  if (dynamic.length) {
    return [...dynamic, ...baseItems];
  }
  return baseItems;
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
                <button class="link-btn chat-link ${state.activeConversationId === item.id ? 'active' : ''}" data-page="${item.page}" data-conversation="${item.id}">
                  <span class="chat-link-top">
                    <span class="chat-link-title">${escapeHtml(item.title)}</span>
                    <span class="chat-link-time">${escapeHtml(item.time)}</span>
                  </span>
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
    case 'task': {
      const localActions = filterConversationCardActions(card.actions || []);
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
          ${localActions.length ? `<div class="chip-row">${localActions.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}</div>` : ''}
        </div>
      `;
    }
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
  const mainActions = mainActionsForConversation(conversation);
  const navActions = navActionsForConversation(conversation);

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
                </div>
              `,
            )
            .join('')}
        </div>
        ${conversation.artifacts?.length ? `
          <div class="artifact-grid">
            ${conversation.artifacts
              .map(
                (artifact) => {
                  const localActions = filterConversationCardActions(artifact.actions || []);
                  return `
                  <div class="detail-card artifact-card">
                    <header>
                      <strong>${escapeHtml(artifact.title)}</strong>
                      <span class="status-badge">${escapeHtml(artifact.type)}</span>
                    </header>
                    ${artifact.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
                    ${localActions.length ? `<div class="chip-row" style="margin-top:10px;">${localActions.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}</div>` : ''}
                  </div>
                `;
                },
              )
              .join('')}
          </div>
        ` : ''}
        ${mainActions.length ? `
          <div class="chip-row" style="margin-top:16px;">
            ${mainActions.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}
          </div>
        ` : ''}
        ${navActions.length ? `
          <div class="chip-row" style="margin-top:8px;">
            ${navActions.map((item) => `<button class="secondary-btn" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}
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
          ${mainActions.length ? `<div class="chip-row" style="margin-top:16px;">${mainActions.map((item) => `<button class="chip" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}</div>` : ''}
          ${navActions.length ? `<div class="chip-row" style="margin-top:8px;">${navActions.map((item) => `<button class="secondary-btn" ${interactiveAttrs(item)}>${escapeHtml(item)}</button>`).join('')}</div>` : ''}
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
  if (status.includes('进行中')) return 'ok';
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
        <div class="panel-card report-panel-card" data-panel-title="${escapeHtml(item.title)}">
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
        <div class="panel-card task-panel-card" data-panel-title="${escapeHtml(item.title)}">
          <div class="panel-card-head">
            <strong>${escapeHtml(item.title)}</strong>
            ${item.status ? `<span class="status-badge ${statusTone(item.status)}">${escapeHtml(item.status)}</span>` : ''}
          </div>
          ${item.chain ? `<p><strong>责任链路：</strong>${escapeHtml(item.chain)}</p>` : ''}
          ${item.due ? `<p><strong>截止时间：</strong>${escapeHtml(item.due)}</p>` : ''}
          ${item.progress ? `<p><strong>完成进度：</strong>${escapeHtml(item.progress)}</p>` : ''}
          ${item.meta ? `<p>${escapeHtml(item.meta)}</p>` : ''}
          ${item.replay ? `<p><strong>回看节点：</strong>${escapeHtml(item.replay)}</p>` : ''}
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
      const actionLabel = node.textContent.trim();
      if (handleStructuredAction(actionLabel)) {
        return;
      }

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
