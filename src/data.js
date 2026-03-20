export const appMeta = {
  productName: "AI 工作台",
  role: "区域运营负责人",
  scope: "华东区 · 182 家门店",
  date: "2026-03-20",
};

export const navigation = [
  { id: "home", label: "今日工作台" },
  { id: "analysis", label: "经营分析" },
  { id: "risk", label: "门店风险" },
  { id: "tasks", label: "任务协同" },
  { id: "reports", label: "报告中心" },
];

export const recentChats = [
  {
    id: "conv-1",
    title: "午市经营复盘 + 牛腩补货处理",
    time: "15:45",
    page: "home",
    summary: "库存预警、午市利润诊断、补货单确认、外部数据接入分析",
    unread: 3,
  },
  {
    id: "conv-2",
    title: "哪家门店风险最高，先处理什么",
    time: "14:32",
    page: "risk",
    summary: "苏州园区店命中 R-INV-009，差评与库存风险叠加",
    unread: 1,
  },
  {
    id: "conv-3",
    title: "利润率下降归因拆解到门店和动作",
    time: "14:05",
    page: "analysis",
    summary: "拆出南京/苏州问题门店，形成暂停活动与督导抽查动作",
    unread: 0,
  },
  {
    id: "conv-4",
    title: "任务生成后怎么跟进和回看",
    time: "13:40",
    page: "tasks",
    summary: "责任人、截止时间、回看节点、周报素材自动沉淀",
    unread: 0,
  },
  {
    id: "conv-5",
    title: "老板今天想看什么报告",
    time: "09:00",
    page: "reports",
    summary: "日报先推老板，周报给区域运营，专题按订阅周期发送",
    unread: 0,
  },
  {
    id: "conv-6",
    title: "春季菜品上新执行计划",
    time: "昨天",
    page: "tasks",
    summary: "总部派发任务承接，拆成 5 天执行计划并同步飞书",
    unread: 0,
  },
  {
    id: "conv-7",
    title: "会员复购分析 + 大众点评评价",
    time: "2天前",
    page: "analysis",
    summary: "Excel 上传 + Agent 采集，发现低复购与菜量反馈相关",
    unread: 0,
  },
];

export const quickPrompts = [
  { label: "看今日摘要", target: "home" },
  { label: "生成整改任务", target: "tasks" },
];

export const sharedPanels = {
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

export const pages = {
  home: {
    title: "今日工作台",
    subtitle: "今日重点：利润、差评、库存",
    defaultPanel: "alerts",
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
          label: "Toast AI",
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
          label: "Toast AI",
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
          label: "Toast AI",
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
          label: "Toast AI",
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
          label: "Toast AI",
          time: "14:08",
          content: "建议按优先级分 3 步：第一，南京/苏州门店立即暂停两档低毛利活动；第二，把外卖满减切到会员券承接，恢复毛利；第三，安排督导 16:00 抽查打包 SOP 和补偿规则。这样可以先止损，再看明天数据回弹。",
          highlights: ["暂停低毛利活动", "改用会员满减", "16:00 督导抽查"],
          cards: [
            {
              type: "bars",
              title: "动作优先级",
              items: [
                { label: "暂停低毛利活动", value: 92, valueLabel: "P1", meta: "最快止损" },
                { label: "切换会员满减", value: 78, valueLabel: "P2", meta: "恢复毛利" },
                { label: "督导抽查 SOP", value: 64, valueLabel: "P3", meta: "防止问题反复", tone: "warn" },
              ],
            },
          ],
          actions: ["展开看南京门店", "只看外卖渠道", "生成运营整改任务"],
        },
        {
          role: "ai",
          label: "Toast AI",
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
          actions: ["保存为报告", "生成任务"],
        },
      ],
      artifacts: [
        {
          title: "分析证据摘要",
          type: "数据",
          lines: ["包装成本率较近 4 周均值高 2.1pct", "活动毛利下降 8.4%", "新店差评贡献 62%"],
        },
        {
          title: "建议动作包",
          type: "动作",
          lines: ["暂停低毛利活动", "复核配送补偿", "督导抽查打包流程"],
        },
      ],
      followUps: ["展开看南京门店", "只看外卖渠道", "生成运营整改任务"],
    },
  },
  risk: {
    title: "门店风险",
    subtitle: "系统自动识别的高优先级问题",
    defaultPanel: "tasks",
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
          label: "Toast AI",
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
              type: "bars",
              title: "风险权重拆解",
              items: [
                { label: "差评风险", value: 87, valueLabel: "8.7%", meta: "高于均值 4.2%", tone: "danger" },
                { label: "库存风险", value: 69, valueLabel: "12.5kg", meta: "低于阈值 18kg", tone: "danger" },
                { label: "出餐超时", value: 54, valueLabel: "+18%", meta: "晚高峰明显放大", tone: "warn" },
              ],
            },
          ],
        },
        {
          role: "user",
          label: "区域运营负责人",
          time: "14:34",
          content: "如果今天只能推进一个动作，你建议先做什么？",
        },
        {
          role: "ai",
          label: "Toast AI",
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
              actions: ["生成任务", "加入巡检计划"],
            },
          ],
          actions: ["生成任务", "加入巡检计划", "推送督导通知"],
        },
      ],
      artifacts: [
        {
          title: "高风险证据",
          type: "风险",
          lines: ["差评率 8.7% vs 均值 4.2%", "出餐超时 +18%", "牛腩库存少 5.5kg"],
        },
        {
          title: "推荐闭环动作",
          type: "任务",
          lines: ["立即补货 30kg", "督导现场复盘", "加入巡检计划并追踪"],
        },
      ],
      followUps: ["生成任务", "加入巡检计划", "推送督导通知"],
    },
  },
  tasks: {
    title: "任务协同",
    subtitle: "AI 洞察 + 人工创建的执行闭环",
    defaultPanel: "tasks",
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
          label: "Toast AI",
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
          label: "Toast AI",
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
          label: "Toast AI",
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
          label: "Toast AI",
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
          label: "Toast AI",
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
};

export const conversations = {
  "conv-1": pages.home.conversation,
  "conv-2": pages.risk.conversation,
  "conv-3": pages.analysis.conversation,
  "conv-4": pages.tasks.conversation,
  "conv-5": pages.reports.conversation,
  "conv-6": {
    title: "会话流：春季菜品上新执行计划",
    meta: "总部派发任务 · 昨天 10:00 · 已承接并同步飞书",
    messages: [
      {
        role: "ai",
        label: "Toast AI",
        badge: "总部派发",
        time: "昨天 10:00",
        content: "总部下发了“春季菜品上新执行”任务，要求 3 月 20 日前完成春笋系列 3 道菜上线，包括培训、备货、菜单更新和图文上架。",
        highlights: ["截止 3/20 18:00", "适用店：12 家", "上线首周日均 >= 20 份"],
        cards: [
          {
            type: "summary",
            title: "为什么派给你们店",
            badge: "选店原因",
            lines: ["去年春季上新执行效果排名前列。", "你们店客单价与春笋系列定价匹配。", "厨房团队稳定，适合做标准样板。"],
          },
          {
            type: "table",
            title: "总部任务要求",
            columns: ["项目", "内容"],
            rows: [
              ["派发人", "区域经理 · 刘总"],
              ["截止时间", "2026-03-20 18:00"],
              ["验收标准", "首周日均 >= 20 份"],
              ["同步渠道", "飞书 + 工作台"],
            ],
          },
        ],
      },
      {
        role: "user",
        label: "区域运营负责人",
        time: "昨天 10:02",
        content: "承接任务，帮我直接拆成执行计划。",
      },
      {
        role: "ai",
        label: "Toast AI",
        time: "昨天 10:03",
        content: "已承接。我按 5 天给你拆好计划，并把提醒同步到飞书，便于门店和督导一起推进。",
        cards: [
          {
            type: "task",
            title: "任务已创建：春季菜品上新执行",
            status: "执行中",
            fields: [
              { label: "执行周期", value: "3/16 - 3/20" },
              { label: "责任人", value: "陈经理" },
              { label: "同步渠道", value: "飞书可回执" },
            ],
            actions: ["查看执行计划", "同步协作"],
          },
          {
            type: "agent",
            title: "Agent 执行进度",
            status: "进行中",
            steps: [
              { text: "任务承接确认", status: "done" },
              { text: "拆成 5 天执行计划", status: "done" },
              { text: "飞书推送给责任人", status: "done" },
              { text: "设置每日提醒", status: "running" },
            ],
          },
        ],
        actions: ["查看执行计划", "上传执行进度", "申请延期"],
      },
    ],
    artifacts: [
      {
        title: "5 天时间线",
        type: "计划",
        lines: ["3/16 食材下单", "3/17 厨房培训", "3/18 菜单上线", "3/19 试运行", "3/20 正式上线"],
      },
      {
        title: "验收口径",
        type: "指标",
        lines: ["上线首周日均 >= 20 份", "同步外卖与堂食菜单", "保留首日反馈与执行证明"],
      },
    ],
    followUps: ["查看执行计划", "上传执行进度", "申请延期"],
  },
  "conv-7": {
    title: "会话流：会员复购分析 + 大众点评评价",
    meta: "本地上传 + Agent 采集 · 2 天前",
    messages: [
      {
        role: "user",
        label: "区域运营负责人",
        time: "2天前 15:10",
        content: "我从银豹导出了会员消费明细，你帮我分析复购。另外看看大众点评最近评价。",
      },
      {
        role: "ai",
        label: "Toast AI",
        time: "2天前 15:11",
        content: "收到。我会同时处理两条链路：一条解析你上传的 Excel 看会员复购；另一条让 Agent 采集大众点评近 30 天评价。",
        cards: [
          {
            type: "agent",
            title: "数据准备中",
            status: "处理中",
            steps: [
              { text: "Excel 文件已解析", status: "done" },
              { text: "大众点评页面已访问", status: "done" },
              { text: "近 30 天评价抓取中", status: "running" },
            ],
          },
        ],
      },
      {
        role: "ai",
        label: "Toast AI",
        time: "2天前 15:15",
        content: "结论先说：30 天复购率只有 34.2%，低于同商圈川菜 P50 的 38%。而且我把点评内容和复购数据交叉看了一下，首次消费后没有复购的会员里，有 80% 提到“菜量偏少”。",
        highlights: ["30 天复购率 34.2%", "低于行业 P50 38%", "菜量偏少可能影响复购"],
        cards: [
          {
            type: "kpis",
            title: "会员复购摘要",
            items: [
              { label: "30天复购率", value: "34.2%", change: "低于 P50", trend: "down" },
              { label: "高频会员占比", value: "12%", change: "偏低", trend: "down" },
              { label: "会员贡献营收", value: "61%", change: "老客依赖高", trend: "warning" },
              { label: "近30天评价", value: "87 条", change: "已交叉分析", trend: "up" },
            ],
          },
          {
            type: "bars",
            title: "点评关键词",
            items: [
              { label: "水煮肉片好吃", value: 72, valueLabel: "32 次", meta: "正向反馈" },
              { label: "环境干净", value: 61, valueLabel: "28 次", meta: "正向反馈" },
              { label: "服务态度好", value: 52, valueLabel: "24 次", meta: "正向反馈" },
              { label: "菜量偏少", value: 18, valueLabel: "8 成未复购提及", meta: "影响复购", tone: "danger" },
            ],
          },
        ],
        actions: ["设置会员触达策略", "优化菜量配置", "生成专题报告"],
      },
    ],
    artifacts: [
      {
        title: "多源数据融合",
        type: "数据源",
        lines: ["银豹 Excel 已解析", "大众点评 Agent 采集已完成", "POS 菜品销量数据已联动"],
      },
    ],
    followUps: ["设置会员触达策略", "优化菜量配置", "生成专题报告"],
  },
};

export const conversationPanels = {
  "conv-1": {
    tasks: [
      { title: "紧急补货牛腩", meta: "30kg · 张总 · 明天 10:00 前", status: "待确认" },
      { title: "利润整改任务候选", meta: "南京 / 苏州两店 · 今日下发", status: "待处理" },
    ],
    alerts: [
      { title: "库存风险已命中", subtitle: "R-INV-009 · 明天 11:30 前可能断货", action: "查看库存告警" },
      { title: "主力菜毛利破线", subtitle: "水煮肉片毛利 31% < 35% 红线", action: "生成任务" },
    ],
    reports: [
      { title: "午市经营快照", subtitle: "已生成 SNAP-001", action: "查看报告" },
      { title: "库存生意快照", subtitle: "已生成 SNAP-002", action: "查看报告" },
    ],
  },
  "conv-2": {
    tasks: [
      { title: "苏州园区店风险整改", meta: "补货 + 巡检并行", status: "待处理" },
      { title: "督导现场复盘", meta: "今日 16:00 到店", status: "处理中" },
    ],
    alerts: [
      { title: "复合风险门店", subtitle: "差评 8.7% + 库存 12.5kg", action: "查看异常门店" },
    ],
    reports: [
      { title: "门店风险专题", subtitle: "可沉淀为风险周报", action: "查看报告" },
    ],
  },
  "conv-3": {
    tasks: [
      { title: "南京/苏州利润整改", meta: "暂停低毛利活动", status: "待处理" },
    ],
    alerts: [
      { title: "利润归因已锁定", subtitle: "两店贡献 57% 利润下滑", action: "查看异常门店" },
    ],
    reports: [
      { title: "分析简报草稿", subtitle: "当前分析已沉淀", action: "保存为报告" },
      { title: "本周经营复盘", subtitle: "可并入当前结论", action: "查看报告" },
    ],
  },
  "conv-4": {
    tasks: [
      { title: "整改新店差评问题", meta: "南京区域经理 · 明日 18:00", status: "处理中" },
      { title: "7 天后自动回看", meta: "差评率下降 >= 0.5pct", status: "待确认" },
    ],
    alerts: [
      { title: "回看规则已绑定", subtitle: "差评 / 巡检 / 补货将一并追踪", action: "查看回看" },
    ],
    reports: [
      { title: "任务周报素材", subtitle: "会话沉淀已开启", action: "生成周报素材" },
    ],
  },
  "conv-5": {
    tasks: [
      { title: "老板日报推送", meta: "今日 08:00 窗口", status: "待确认" },
    ],
    alerts: [
      { title: "专题订阅建议", subtitle: "新店口碑 / 春季上新建议周五发送", action: "新建订阅" },
    ],
    reports: [
      { title: "全国经营简报", subtitle: "老板先看", action: "立即推送" },
      { title: "华东经营复盘", subtitle: "区域运营预览", action: "查看报告" },
    ],
  },
  "conv-6": {
    tasks: [
      { title: "春季上新执行", meta: "3/16 - 3/20 · 陈经理", status: "处理中" },
      { title: "每日提醒", meta: "09:00 飞书自动提醒", status: "处理中" },
    ],
    alerts: [
      { title: "总部派发任务", subtitle: "#HQ-042 · 验收标准已同步", action: "查看详情" },
    ],
    reports: [
      { title: "上新执行快照", subtitle: "可转总部汇报", action: "查看报告" },
    ],
  },
  "conv-7": {
    tasks: [
      { title: "会员触达策略", meta: "针对首次消费后 3 天内用户", status: "待处理" },
    ],
    alerts: [
      { title: "低复购风险", subtitle: "30 天复购率 34.2% < 行业 P50 38%", action: "生成任务" },
    ],
    reports: [
      { title: "会员复购专题", subtitle: "可沉淀为专题报告", action: "生成专题报告" },
    ],
  },
};
