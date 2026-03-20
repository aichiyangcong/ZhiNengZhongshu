// Mock data for AI Analysis Center

export const mockAlerts = [
  {
    id: 'alert-1',
    type: 'urgent',
    icon: '🚨',
    title: '牛腩即将断货',
    desc: '当前 12.5kg，按近7天中位消耗15.8kg/天，预计明天11:30前断货',
    actions: ['推送补货单', '稍后处理'],
    read: false,
    handled: false
  },
  {
    id: 'alert-2',
    type: 'warning',
    icon: '⚠️',
    title: '水煮肉片成本异常',
    desc: '今日成本率 48%，超出基准 12%，毛利已破35%红线',
    actions: ['查看菜品贡献矩阵', '忽略'],
    read: false,
    handled: false
  }
];

export const mockAlertItems = [
  {
    id: 'item-1',
    icon: '📦',
    title: '牛腩库存预警',
    time: '14:32',
    badge: '触发',
    badgeColor: 'red',
    priority: 'high',
    deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2小时后
  },
  {
    id: 'item-2',
    icon: '💰',
    title: '水煮肉片成本异常',
    time: '14:28',
    badge: '风险',
    badgeColor: 'orange',
    priority: 'high',
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4小时后
  },
  {
    id: 'item-3',
    icon: '📊',
    title: '午市营业额低于预期',
    time: '14:15',
    badge: '关注',
    badgeColor: 'blue',
    priority: 'medium',
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1天后
  }
];

export const mockConversations = [
  {
    id: 'conv-1',
    title: '午市经营复盘',
    time: '14:32',
    active: true,
    unreadCount: 3,
    messages: [
      {
        id: 'msg-1',
        type: 'system',
        trigger: 'R-INV-009（库存风险）',
        time: '今天 14:32'
      },
      {
        id: 'msg-2',
        type: 'ai',
        sender: 'Toast AI',
        systemType: '系统主动提醒',
        content: '触发规则 R-INV-009（库存风险巡检）：牛腩库存低于安全阈值，建议立即进入处理会话。\n\n触发逻辑：当前库存 12.5kg < 安全阈值 18kg，按近7天中位消耗 15.8kg/天，预计明天 11:30 前断货（置信度 0.87）。',
        cards: [
          {
            type: 'evidence',
            ruleId: 'R-INV-009',
            title: '🧠 触发证据卡 · R-INV-009',
            data: {
              headers: ['指标', '当前值', '阈值', '偏差', '状态'],
              rows: [
                { label: '牛腩库存', current: '12.5kg', threshold: '18kg', diff: '-5.5kg', status: '触发', highlight: true },
                { label: '近7天日均消耗', current: '15.8kg', threshold: '-', diff: '-', status: '高' },
                { label: '预计断货时间', current: '明日11:30', threshold: '-', diff: '-', status: '风险' }
              ],
              note: '证据图表：库存趋势(7天) + 时段消耗曲线 + 同城相似门店库存分位'
            }
          },
        ],
        actions: ['进入对话处理', '忽略本次提醒', '调整阈值']
      },
      {
        id: 'msg-3',
        type: 'user',
        sender: '陈经理',
        content: '收到，进入处理。顺便帮我看下今天午市整体情况'
      },
      {
        id: 'msg-4',
        type: 'ai',
        sender: 'Toast AI',
        content: '先说牛腩：当前库存 12.5kg，按近7天中位消耗15.8kg/天算，明天午市11点半前肯定断货。我看了下你们店牛腩类菜品占午市销量的22%，断货影响不小。已经帮你拉好补货单，确认后直接推给张总。\n\n再说午市整体：今天11-13点掉了18桌堂食，但外卖反而涨了9%，客单价还涨了3块多。我看了下菜品结构，¥28以下的引流套餐点得少了，招牌菜占比在涨——说明今天来的散客少了，但进店的人消费意愿不差。建议晚市在美团加一波满减券，把单量拉回来。',
        cards: [
          {
            type: 'task',
            title: '📋 任务已创建：紧急补货牛腩',
            status: '待确认',
            data: {
              rows: [
                { label: '补货量', value: '30kg（建议）' },
                { label: '供应商', value: '张总 · 恒源肉业' },
                { label: '预计到货', value: '明天 10:00 前' },
                { label: '���考价', value: '¥68/kg（本周涨 12%）' }
              ],
              actions: ['推送补货单', '切换供应商B报价', '调整补货数量']
            }
          },
          {
            type: 'analysis',
            title: '🍽️ 午市诊断 · 堂食+外卖',
            data: {
              kpis: [
                { label: '堂食', value: '¥12,840', change: '↓ ¥1,680', trend: 'down' },
                { label: '外卖', value: '¥5,632', change: '↑ 9.2%', trend: 'up' },
                { label: '翻台率', value: '2.1', change: '↓ 0.4', trend: 'down' },
                { label: '出餐', value: '18min', change: '⚠️ 慢3min', trend: 'warning' }
              ]
            }
          }
        ],
        actions: ['查看翻台率热力图', '拆解外卖渠道数据', '分析出餐慢原因']
      },
      {
        id: 'msg-5',
        type: 'user',
        sender: '陈经理',
        content: '牛腩涨价了是吧？水煮肉片毛利受影响多大'
      },
      {
        id: 'msg-6',
        type: 'ai',
        sender: 'Toast AI',
        content: '对，牛腩本周从¥60.7涨到¥68/kg，涨了12%。直接导致水煮肉片毛利从43%跌到31%，破了35%的红线。我看了下你们店水煮肉片日销58份，是午市主力菜，这个毛利率扛不住。\n\n我建议三选一：① 提价¥3（毛利恢复到38%，参考127家相似门店，销量预计掉2.8%）② 换供应商B（¥63/kg，毛利恢复到36%）③ 临时降推广力度（保毛利但单量会掉）。要不要我模拟下提价后对整体营收的影响？',
        cards: [
          {
            type: 'costimpact',
            title: '💰 成本联动分析 · 牛腩涨价影响',
            data: {
              headers: ['受影响菜品', '日销量', '原毛利', '现毛利', '状态', '建议'],
              rows: [
                {
                  dish: '🥩 水煮肉片',
                  dailySales: '58',
                  originalMargin: '43%',
                  currentMargin: '31%',
                  currentMarginHighlight: true,
                  status: '破线',
                  suggestion: '提价¥3 或换供应商',
                  highlight: 'red'
                },
                {
                  dish: '🆕 酸汤肥牛',
                  dailySales: '48',
                  originalMargin: '68%',
                  currentMargin: '65%',
                  status: '下降',
                  suggestion: '暂可接受',
                  highlight: 'yellow'
                },
                {
                  dish: '🍖 红烧牛腩',
                  dailySales: '22',
                  originalMargin: '52%',
                  currentMargin: '48%',
                  status: '正常',
                  suggestion: '观察'
                }
              ]
            }
          },
          {
            type: 'strategybenchmark',
            title: '🧪 相似门店策略样本 · 312店',
            data: {
              headers: ['策略组合', '样本数', '毛利变化', '销量变化', '置信度'],
              rows: [
                {
                  strategy: '水煮肉片提价 +2~3元',
                  samples: '127',
                  marginChange: '+7.1%',
                  salesChange: '-2.8%',
                  confidence: '高'
                },
                {
                  strategy: '换供应商（牛腩）+ 小幅提价',
                  samples: '83',
                  marginChange: '+8.4%',
                  salesChange: '-3.1%',
                  confidence: '高'
                },
                {
                  strategy: '仅降推广不提价',
                  samples: '102',
                  marginChange: '+2.2%',
                  salesChange: '-0.9%',
                  confidence: '中'
                }
              ],
              prediction: '针对A店预测：执行"提价¥3 + 保持推广"7天后，净毛利预计 +¥620/天（95%CI：¥450~¥780）'
            }
          }
        ],
        actions: ['水煮肉片提价¥3 → 模拟影响', '对比供应商B报价', '临时调整为「推荐」下架']
      },
      {
        id: 'msg-7',
        type: 'user',
        sender: '陈经理',
        content: '行，提价吧。补货单也确认发'
      },
      {
        id: 'msg-8',
        type: 'ai',
        sender: 'Toast AI',
        content: '收到，我来执行：\n① 水煮肉片提价 ¥3 → 同步到 POS 和外卖平台\n② 补货单发给张总 → 牛腩 30kg，明天 10 点前到\n\n执行完会通知你，并通过 [飞书] 同步给采购小王。',
        cards: [
          {
            type: 'agent',
            title: 'Agent 正在执行',
            status: '进行中',
            steps: [
              { text: '水煮肉片价格更新：¥40 → ¥43', status: 'done' },
              { text: '已同步到客如云 POS', status: 'done' },
              { text: '正在同步美团外卖...', status: 'running' },
              { text: '补货单发送给张总', status: 'pending' },
              { text: 'Feishu 推送给采购小王（卡片可回执）', status: 'pending' }
            ]
          }
        ]
      },
      {
        id: 'msg-9',
        type: 'system',
        trigger: '收到总部派发任务',
        time: '今天 15:10'
      },
      {
        id: 'msg-10',
        type: 'ai',
        sender: 'Toast AI',
        systemType: '总部派发',
        content: '总部下发了一个新任务给 A 店：「春季菜品上新执行」\n\n要求：3/15 前完成春笋系列 3 道菜的上线，包括员工培训、食材备货、菜单更新、拍摄上架图。\n验收标准：上线首周日均销量 ≥ 20 份。',
        cards: [
          {
            type: 'hqdispatch',
            title: '🏢 总部派发 #HQ-042 · 春季菜品上新',
            status: '待承接',
            data: {
              rows: [
                { label: '派发人', value: '区域经理 · 刘总' },
                { label: '适用店', value: '华北区 12 家门店' },
                { label: '截止', value: '2026-03-15 18:00' },
                { label: '验收', value: '上线首周日均 ≥ 20 份' }
              ],
              checklist: [
                '1. 春笋系列食材备货（春笋、腊肉、鲜笋尖）',
                '2. 厨房出品培训（3 道新菜 SOP）',
                '3. 菜单更新 + 堂食/外卖同步',
                '4. 拍摄菜品图 + 上架美团/点评',
                '5. 门店反馈：执行结果 + 首日数据'
              ],
              actions: ['承接任务', '查看详情', '申请延期']
            }
          }
        ],
        actions: ['承接任务', '查看详情', '申请延期']
      },
      {
        id: 'msg-11',
        type: 'user',
        sender: '陈经理',
        content: '收到，我先看看食材能不能到位'
      },
      {
        id: 'msg-12',
        type: 'ai',
        sender: 'Toast AI',
        content: '帮你查了下：春笋和鲜笋尖供应商张总有货，明天可以跟牛腩一起下单。腊肉库存还有 8kg，够用。\n\n建议你先承接任务，我帮你拆成每日执行计划：\n· 3/11 食材下单\n· 3/12 厨房培训（可约晚市后）\n· 3/13 菜单上线 + 拍图\n· 3/14 试运行\n· 3/15 正式上线 + 数据追踪',
        actions: ['承接任务 + 生成执行计划', '调整时间节点']
      },
      {
        id: 'msg-13',
        type: 'system',
        trigger: '异构数据接入',
        time: '今天 15:45'
      },
      {
        id: 'msg-14',
        type: 'user',
        sender: '陈经理',
        content: '我刚从银豹导出了一份上周的会员消费明细（Excel），你帮我分析下复购率。另外帮我看看饿了么上我们A店的评分和最新差评。'
      },
      {
        id: 'msg-15',
        type: 'ai',
        sender: 'Toast AI',
        content: '收到两个任务：\n① 本地上传：你的会员消费明细（银豹Excel）→ 我来解析并分析复购率\n② Agent 采集：去饿了么抓取 A店评分 + 最新差评数据',
        cards: [
          {
            type: 'upload',
            title: '📄 银豹会员消费明细.xlsx',
            status: '已上传',
            size: '2.3MB',
            parsed: '1,847 行 × 12 列',
            recognized: '会员消费流水'
          },
          {
            type: 'agent',
            title: '🤖 Agent 正在采集外部数据',
            status: '进行中',
            steps: [
              { text: '🕷️ 饿了么 A店页面已访问', status: 'done', icon: '✓' },
              { text: '🕷️ 饿了么 评分 4.6 · 月销 3,820 单', status: 'done', icon: '✓' },
              { text: '🕷️ 饿了么 正在抓取近30天差评（已获取 23 条）...', status: 'running', icon: '◐' },
              { text: '数据清洗 + 结构化入库', status: 'pending', icon: '○' }
            ]
          }
        ]
      },
      {
        id: 'msg-16',
        type: 'ai',
        sender: 'Toast AI',
        content: '数据准备好了，给你结论：\n\n① 会员复购：30天复购率 34.2%，低于同商圈川菜P50（38%）。高频会员（≥3次/月）贡献了 61% 营收但只占 12% 人数——说明你们店对老客依赖度高，但新客转化不够。\n\n② 饿了么差评：近30天差评 23 条，Top3 原因：出餐慢（9条）、少餐漏餐（6条）、包装破损（4条）。出餐慢与我们之前发现的18min问题吻合，建议优先解决这个。',
        cards: [
          {
            type: 'datasource',
            title: '📊 多源数据融合分析',
            sources: [
              { icon: '📄', name: '银豹 Excel', type: '会员消费流水', records: '1,847', method: '手动上传', status: 'success', statusText: '已解析' },
              { icon: '🕷️', name: '饿了么', type: '评分+差评', records: '23', method: 'Agent采集', status: 'success', statusText: '已入库' },
              { icon: '🔌', name: 'POS系统', type: '出餐时长', records: '486', method: 'API直连', status: 'success', statusText: '实时' },
              { icon: '🔌', name: '京东外卖', type: '评分+差评', records: '-', method: 'Agent采集', status: 'pending', statusText: '待配置' }
            ],
            note: '支持的接入方式：手动上传（Excel/CSV/JSON）· Agent采集（饿了么/京东外卖/大众点评）· API直连（POS/ERP/供应链）· 定时同步'
          }
        ],
        actions: ['深入分析出餐慢关联', '设置饿了么定时监控', '配置京东外卖采集']
      },
      {
        id: 'msg-17',
        type: 'ai',
        sender: 'Toast AI',
        content: '已基于你的会话生成快照报告【SNAP-001】和【SNAP-002】，进入人「库存报告」、「餐饮」、「数据报告」等，我会结合报告内容为你提供更精准的分析。\n\n报告可转发给：\n1) A店 vs 同P75 差距详解\n2) 本周区域对外与B门店概览\n3) 下周优化先后顺序（含时长预估）',
        cards: [
          {
            type: 'report',
            title: '📊 快照报告已生成',
            status: '已生成',
            description: '已基于本次会话生成快照报告【SNAP-001 / SNAP-002】，进入人「库存报告」、���餐饮」、「数据报告」等，我会结合报告内容为你提供更精准的分析。',
            reports: [
              {
                icon: '📊',
                name: '午市复盘报告 SNAP-001',
                meta: '14:35 · 手动生成'
              },
              {
                icon: '📊',
                name: '库存生意报告 SNAP-002',
                meta: '14:40 · 已同步'
              }
            ],
            note: '报告可转发给：1) A店 vs 同P75 差距详解 2) 本周区域对外与B门店概览 3) 下周优化先后顺序（含时长预估）'
          }
        ]
      }
    ]
  },
  {
    id: 'conv-2',
    title: '库存补货建议',
    time: '12:15',
    active: false,
    unreadCount: 0,
    messages: [
      {
        id: 'msg-c2-1',
        type: 'system',
        trigger: 'R-INV-012（补货优化）',
        time: '今天 12:15'
      },
      {
        id: 'msg-c2-2',
        type: 'ai',
        sender: 'Toast AI',
        systemType: '系统主动提醒',
        content: '触发规则 R-INV-012（智能补货建议）：检测到5种食材需要补货。我看了下你们近14天消耗趋势，加上本周「酸辣土豆丝」要做促销，土豆消耗会比平时高30%左右，建议提前多备一些。',
        cards: [
          {
            type: 'evidence',
            ruleId: 'R-INV-012',
            title: '🧠 触发证据卡 · R-INV-012',
            data: {
              headers: ['食材', '当前库存', '安全库存', '建议补货量', '优先级'],
              rows: [
                { label: '土豆', current: '8kg', threshold: '15kg', diff: '20kg', status: '高', highlight: true },
                { label: '青椒', current: '3kg', threshold: '8kg', diff: '12kg', status: '高', highlight: true },
                { label: '豆腐', current: '6盒', threshold: '10盒', diff: '15盒', status: '中' },
                { label: '香菜', current: '1.2kg', threshold: '2kg', diff: '3kg', status: '中' },
                { label: '花椒', current: '0.5kg', threshold: '1kg', diff: '1kg', status: '低' }
              ],
              note: '基于近14天消耗趋势 + 本周「酸辣土豆丝」促销计划（预计消耗+30%）'
            }
          }
        ],
        actions: ['查看详细补货方案', '一键生成补货单', '调整建议']
      },
      {
        id: 'msg-c2-3',
        type: 'user',
        sender: '陈经理',
        content: '土豆和青椒确实快没了，生成补货单吧'
      },
      {
        id: 'msg-c2-4',
        type: 'ai',
        sender: 'Toast AI',
        content: '已生成补货单，优先补充土豆和青椒。考虑到本周「酸辣土豆丝」促销，土豆建议多备5kg，按你们店促销期间的历史数据，这个量够用3天。',
        cards: [
          {
            type: 'task',
            title: '📋 任务已创建：蔬菜类补货',
            status: '待确认',
            data: {
              rows: [
                { label: '土豆', value: '20kg（含促销备货+5kg）' },
                { label: '青椒', value: '12kg' },
                { label: '供应商', value: '李总 · 鲜蔬配送' },
                { label: '预计到货', value: '明天 8:00 前' }
              ],
              actions: ['推送补货单给李总', '修改数量', '更换供应商']
            }
          }
        ]
      }
    ]
  },
  {
    id: 'conv-3',
    title: '成本分析',
    time: '10:30',
    active: false,
    unreadCount: 1,
    messages: [
      {
        id: 'msg-c3-1',
        type: 'user',
        sender: '陈经理',
        content: '帮我分析下本周成本情况，感觉毛利率在下降'
      },
      {
        id: 'msg-c3-2',
        type: 'ai',
        sender: 'Toast AI',
        content: '你的感觉是对的。本周综合毛利率 52.3%，比上周下降 4.2%。主要原因有两个：① 牛肉类食材涨价12%，直接拉高了食材成本率 ② 外卖占比从25%涨到32%，外卖毛利率比堂食低5个点。\n\n我看了下同商圈川菜的数据，你们店食材成本率36.2%，比行业P50高了2.7个点，建议优化供应商结构或者调整菜品定价。',
        cards: [
          {
            type: 'analysis',
            title: '📊 本周成本诊断',
            data: {
              kpis: [
                { label: '综合毛利率', value: '52.3%', change: '↓ 4.2%', trend: 'down' },
                { label: '食材成本', value: '¥8,420', change: '↑ 18%', trend: 'warning' },
                { label: '人力成本', value: '¥3,200', change: '→ 持平', trend: 'neutral' },
                { label: '外卖占比', value: '32%', change: '↑ 7%', trend: 'up' }
              ]
            }
          },
          {
            type: 'benchmark',
            title: '🏷️ 行业基准对比 · 同商圈川菜',
            data: {
              headers: ['指标', 'A店', '行业P50', '行业P75', '分位'],
              rows: [
                { label: '综合毛利率', store: '52.3%', p50: '54.8%', p75: '58.2%', percentile: 'P42', highlight: true },
                { label: '食材成本率', store: '36.2%', p50: '33.5%', p75: '31.8%', percentile: 'P38', highlight: true },
                { label: '人力成本率', store: '18.5%', p50: '19.2%', p75: '20.1%', percentile: 'P58' }
              ],
              conclusion: '食材成本偏高是主要问题，建议优化供应商结构或调整菜品定价（样本数：同商圈川菜 428 家）'
            }
          }
        ],
        actions: ['查看食材涨价明细', '对比供应商报价', '生成菜品定价建议']
      },
      {
        id: 'msg-c3-3',
        type: 'user',
        sender: '陈经理',
        content: '给我看看哪些菜品需要调价'
      },
      {
        id: 'msg-c3-4',
        type: 'ai',
        sender: 'Toast AI',
        content: '根据成本变化和行业对标，建议对3个菜品调价。水煮肉片和酸汤肥牛受牛肉涨价影响最大。我看了127家相似门店的数据，水煮肉片提价¥3后，销量平均掉2.8%，但毛利能从31%恢复到38%，整体净收益是正的。',
        cards: [
          {
            type: 'costimpact',
            title: '💰 菜品定价建议',
            data: {
              headers: ['菜品', '当前售价', '建议售价', '毛利变化', '状态', '建议'],
              rows: [
                {
                  dish: '🥩 水煮肉片',
                  dailySales: '¥40',
                  originalMargin: '¥43',
                  currentMargin: '31%→38%',
                  currentMarginHighlight: true,
                  status: '建议',
                  suggestion: '提价¥3',
                  highlight: 'yellow'
                },
                {
                  dish: '🆕 酸汤肥牛',
                  dailySales: '¥48',
                  originalMargin: '¥50',
                  currentMargin: '65%→68%',
                  status: '建议',
                  suggestion: '提价¥2',
                  highlight: 'yellow'
                },
                {
                  dish: '🌶️ 麻辣香锅',
                  dailySales: '¥38',
                  originalMargin: '¥38',
                  currentMargin: '58%',
                  status: '正常',
                  suggestion: '暂不调整'
                }
              ]
            }
          }
        ],
        actions: ['批量调价并同步POS', '单独调整', '查看历史调价效果']
      }
    ]
  },
  {
    id: 'conv-4',
    title: '每日经营简报',
    time: '09:00',
    active: false,
    unreadCount: 0,
    messages: [
      {
        id: 'msg-c4-1',
        type: 'system',
        trigger: 'R-DAILY-001（每日简报）',
        time: '今天 09:00'
      },
      {
        id: 'msg-c4-2',
        type: 'ai',
        sender: 'Toast AI',
        systemType: '定时任务触发',
        content: '早上好陈经理，昨天（3月15日）经营简报已生成。\n\n整体表现不错：营业额 ¥18,640，比上周三涨了8.2%。晚市表现突出，翻台率2.8，创本月新高。但有个小问题需要关注：午市出餐时长18分钟，比你们店平均水平慢了3分钟，影响了翻台率。',
        cards: [
          {
            type: 'evidence',
            ruleId: 'R-DAILY-001',
            title: '🧠 定时任务 · R-DAILY-001',
            data: {
              headers: ['任务配置', '详情'],
              rows: [
                { label: '执行时间', value: '每天 09:00' },
                { label: '作用范围', value: 'A店（单店）' },
                { label: '触发条件', value: '无条件触发' },
                { label: '产出类型', value: '经营简报 + 飞书推送' },
                { label: '责任人', value: '陈经理' }
              ],
              note: '定时任务链路：每日09:00触发 → 生成昨日简报 → 推送对话 → 飞书通知'
            }
          },
          {
            type: 'analysis',
            title: '📊 昨日经营数据 · 3月15日',
            data: {
              kpis: [
                { label: '营业额', value: '¥18,640', change: '↑ 8.2%', trend: 'up' },
                { label: '翻台率', value: '2.8', change: '↑ 0.5', trend: 'up' },
                { label: '客单价', value: '¥68', change: '↑ ¥3', trend: 'up' },
                { label: '毛利率', value: '56.2%', change: '→ 持平', trend: 'neutral' }
              ]
            }
          },
          {
            type: 'benchmark',
            title: '🏷️ 行业对比 · 同商圈川菜',
            data: {
              headers: ['指标', 'A店', '行业P50', '行业P75', '分位'],
              rows: [
                { label: '日营业额', store: '¥18,640', p50: '¥16,200', p75: '¥19,800', percentile: 'P68' },
                { label: '翻台率', store: '2.8', p50: '2.4', p75: '2.9', percentile: 'P72' },
                { label: '出餐时长', store: '18min', p50: '15min', p75: '13min', percentile: 'P22', highlight: true }
              ],
              conclusion: '出餐时长偏慢，建议优化厨房流程（样本数：同商圈川菜 428 家）'
            }
          }
        ],
        actions: ['查看时段明细', '分析出餐慢原因', '导出昨日报表']
      },
      {
        id: 'msg-c4-3',
        type: 'user',
        sender: '陈经理',
        content: '出餐慢的问题我知道了，今天盯一下'
      },
      {
        id: 'msg-c4-4',
        type: 'ai',
        sender: 'Toast AI',
        content: '好的。我会持续监控今天的出餐时长，如果超过16分钟会提醒你。另外，我看了下昨天出餐慢主要集中在午市11:30-12:30这个时段，可能是因为这个时段单量集中，建议提前做好备菜。',
        actions: ['设置出餐时长监控', '查看昨日时段分布']
      }
    ]
  },
  {
    id: 'conv-5',
    title: '春季菜品上新',
    time: '昨天',
    active: false,
    unreadCount: 0,
    messages: [
      {
        id: 'msg-c5-1',
        type: 'system',
        trigger: '总部派发任务 #HQ-042',
        time: '昨天 10:00'
      },
      {
        id: 'msg-c5-2',
        type: 'ai',
        sender: 'Toast AI',
        systemType: '总部派发',
        content: '总部下发了一个新任务给 A 店：「春季菜品上新执行」\n\n要求：3/20 前完成春笋系列 3 道菜的上线，包括员工培训、食材备货、菜单更新、拍摄上架图。\n验收标准：上线首周日均销量 ≥ 20 份。\n\n我看了下，这次任务派发给华北区 12 家门店，你们店被选中是因为：① 去年春季菜品上新执行效果好（首周日均28份，排名第2）② 客单价¥65，与春笋系列定价匹配 ③ 厨房团队稳定，培训执行力强。',
        cards: [
          {
            type: 'hqdispatch',
            title: '🏢 总部派发 #HQ-042 · 春季菜品上新',
            status: '待承接',
            data: {
              rows: [
                { label: '派发人', value: '区域经理 · 刘总' },
                { label: '适用店', value: '华北区 12 家门店' },
                { label: '截止', value: '2026-03-20 18:00' },
                { label: '验收', value: '上线首周日均 ≥ 20 份' },
                { label: '选中原因', value: '去年执行效果好 + 客单价匹配 + 团队稳定' }
              ],
              checklist: [
                '1. 春笋系列食材备货（春笋、腊肉、鲜笋尖）',
                '2. 厨房出品培训（3 道新菜 SOP）',
                '3. 菜单更新 + 堂食/外卖同步',
                '4. 拍摄菜品图 + 上架美团/点评',
                '5. 门店反馈：执行结果 + 首日数据'
              ],
              actions: ['承接任务', '查看其他门店状态', '申请延期']
            }
          },
          {
            type: 'strategybenchmark',
            title: '🧪 相似门店历史数据 · 去年春季上新',
            data: {
              headers: ['门店', '首周日均', '执行周期', '客单价影响', '复购率'],
              rows: [
                {
                  strategy: 'B店（朝阳区）',
                  samples: '32份',
                  marginChange: '7天',
                  salesChange: '+¥2',
                  confidence: '18%'
                },
                {
                  strategy: 'A店（国贸）',
                  samples: '28份',
                  marginChange: '7天',
                  salesChange: '+¥3',
                  confidence: '22%'
                },
                {
                  strategy: 'C店（望京）',
                  samples: '24份',
                  marginChange: '8天',
                  salesChange: '+¥1',
                  confidence: '15%'
                }
              ],
              prediction: '针对A店预测：执行春笋系列上新，预计首周日均 26±4 份，客单价提升 +¥2~3（置信度：高）'
            }
          }
        ],
        actions: ['承接任务', '查看其他门店状态', '申请延期']
      },
      {
        id: 'msg-c5-3',
        type: 'user',
        sender: '陈经理',
        content: '承接任务，帮我生成执行计划'
      },
      {
        id: 'msg-c5-4',
        type: 'ai',
        sender: 'Toast AI',
        content: '好的，已承接任务 #HQ-042。我帮你拆成每日执行计划，并已同步到飞书：\n\n· 3/16 食材下单（春笋20kg、腊肉15kg、鲜笋尖10kg）\n· 3/17 厨房培训（晚市后19:00-20:30）\n· 3/18 菜单上线 + 拍摄菜品图\n· 3/19 试运行 + 员工试吃反馈\n· 3/20 正式上线 + 数据追踪\n\n我会每天提醒你执行进度，并在3/20前汇总数据反馈给总部。',
        cards: [
          {
            type: 'task',
            title: '📋 任务已创建：春季菜品上新执行',
            status: '执行中',
            data: {
              rows: [
                { label: '任务来源', value: '总部派发 #HQ-042' },
                { label: '责任人', value: '陈经理' },
                { label: '执行周期', value: '3/16 - 3/20（5天）' },
                { label: '飞书推送', value: '已推送 · 可回执' }
              ],
              actions: ['查看执行计划', '上传执行进度', '申请延期']
            }
          },
          {
            type: 'agent',
            title: 'Agent 正在执行',
            status: '进行中',
            steps: [
              { text: '任务承接确认 → 已同步总部', status: 'done' },
              { text: '生成执行计划 → 5天时间线', status: 'done' },
              { text: '飞书推送给陈经理（卡片可回执）', status: 'done' },
              { text: '设置每日提醒（09:00）', status: 'running' },
              { text: '准备数据追踪看板', status: 'pending' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'conv-6',
    title: '会员复购分析',
    time: '2天前',
    active: false,
    unreadCount: 0,
    messages: [
      {
        id: 'msg-c6-1',
        type: 'user',
        sender: '陈经理',
        content: '我从银豹导出了上个月的会员消费明细（Excel），你帮我分析下复购情况。另外帮我看看大众点评上我们店的评分和最新评价。'
      },
      {
        id: 'msg-c6-2',
        type: 'ai',
        sender: 'Toast AI',
        content: '收到两个任务：\n① 本地上传：你的会员消费明细（银豹Excel）→ 我来解析并分析复购率\n② Agent 采集：去大众点评抓取 A店评分 + 最新评价数据\n\n开始执行...',
        cards: [
          {
            type: 'upload',
            title: '📄 银豹会员消费明细.xlsx',
            status: '已上传',
            size: '2.3MB',
            parsed: '1,847 行 × 12 列',
            recognized: '会员消费流水'
          },
          {
            type: 'agent',
            title: '🤖 Agent 正在采集外部数据',
            status: '进行中',
            steps: [
              { text: '🕷️ 大众点评 A店页面已访问', status: 'done', icon: '✓' },
              { text: '🕷️ 大众点评 评分 4.8 · 评价 1,240 条', status: 'done', icon: '✓' },
              { text: '🕷️ 大众点评 正在抓取近30天评价（已获取 87 条）...', status: 'running', icon: '◐' },
              { text: '数据清洗 + 结构化入库', status: 'pending', icon: '○' }
            ]
          }
        ]
      },
      {
        id: 'msg-c6-3',
        type: 'ai',
        sender: 'Toast AI',
        content: '数据准备好了，给你结论：\n\n① 会员复购：30天复购率 34.2%，低于同商圈川菜P50（38%）。高频会员（≥3次/月）贡献了 61% 营收但只占 12% 人数——说明你们店对老客依赖度高，但新客转化不够。建议加强首次消费后的会员触达，比如3天内推送优惠券。\n\n② 大众点评评价：近30天评价 87 条，好评率 92%。Top3 ���评关键词：水煮肉片好吃（32次）、环境干净（28次）、服务态度好（24次）。差评主要集中在：等位时间长（5条）、菜量偏少（3条）。\n\n③ 交叉分析：我把会员复购数据和点评数据打通看了下，发现首次消费后7天内没有二次消费的会员，80%在点评里提到了"菜量偏少"——这可能是影响复购的关键因素。',
        cards: [
          {
            type: 'datasource',
            title: '📊 多源数据融合分析',
            sources: [
              { icon: '📄', name: '银豹 Excel', type: '会员消费流水', records: '1,847', method: '手动上传', status: 'success', statusText: '已解析' },
              { icon: '🕷️', name: '大众点评', type: '评分+评价', records: '87', method: 'Agent采集', status: 'success', statusText: '已入库' },
              { icon: '🔌', name: 'POS系统', type: '菜品销量', records: '1,240', method: 'API直连', status: 'success', statusText: '实时' },
              { icon: '🔌', name: '饿了么', type: '评分+差评', records: '-', method: 'Agent采集', status: 'pending', statusText: '待配置' }
            ],
            note: '支持的接入方式：手动上传（Excel/CSV/JSON）· Agent采集（饿了么/京东外卖/大众点评）· API直连（POS/ERP/供应链）· 定时同步'
          },
          {
            type: 'benchmark',
            title: '🏷️ 会员复购对比 · 同商圈川菜',
            data: {
              headers: ['指标', 'A店', '行业P50', '行业P75', '分位'],
              rows: [
                { label: '30天复购率', store: '34.2%', p50: '38.0%', p75: '42.5%', percentile: 'P38', highlight: true },
                { label: '高频会员占比', store: '12%', p50: '15%', p75: '18%', percentile: 'P42', highlight: true },
                { label: '会员贡献营收', store: '61%', p50: '58%', p75: '65%', percentile: 'P55' }
              ],
              conclusion: '复购率偏低，建议加强首次消费后的会员触达（样本数：同商圈川菜 428 家）'
            }
          }
        ],
        actions: ['设置会员触达策略', '优化菜量配置', '配置饿了么采集']
      },
      {
        id: 'msg-c6-4',
        type: 'user',
        sender: '陈经理',
        content: '菜量的问题我知道了，下周调整一下'
      },
      {
        id: 'msg-c6-5',
        type: 'ai',
        sender: 'Toast AI',
        content: '好的。我会持续监控会员复购率和点评反馈，如果调整后有明显变化会通知你。另外，建议你配置一下饿了么的数据采集，这样可以更全面地了解顾客反馈。',
        actions: ['配置饿了么采集', '设置复购率监控']
      }
    ]
  }
];

export const mockHistoryConversations = [
  {
    id: 'hist-1',
    title: '昨日营业复盘',
    time: '昨天',
    category: '昨日',
    messages: [
      {
        id: 'msg-h1-1',
        type: 'user',
        sender: '陈经理',
        content: '帮我复盘下昨天的营业情况'
      },
      {
        id: 'msg-h1-2',
        type: 'ai',
        sender: 'Toast AI',
        content: '昨日整体表现不错。营业额 ¥18,640，比上周三涨了8.2%。晚市表现突出，翻台率2.8，创本月新高。我看了下时段数据，晚市18:00-20:00这个黄金时段翻台率达到3.2，说明你们店晚市运营效率很高。',
        cards: [
          {
            type: 'analysis',
            title: '📊 昨日经营数据',
            data: {
              kpis: [
                { label: '营业额', value: '¥18,640', change: '↑ 8.2%', trend: 'up' },
                { label: '翻台率', value: '2.8', change: '↑ 0.5', trend: 'up' },
                { label: '客单价', value: '¥68', change: '↑ ¥3', trend: 'up' },
                { label: '毛利率', value: '56.2%', change: '→ 持平', trend: 'neutral' }
              ]
            }
          }
        ],
        actions: ['查看时段明细', '对比上周', '导出报表']
      },
      {
        id: 'msg-h1-3',
        type: 'user',
        sender: '陈经理',
        content: '不错，继续保持'
      }
    ]
  },
  {
    id: 'hist-2',
    title: '周度经营分析',
    time: '3天前',
    category: '已沉淀记录',
    messages: [
      {
        id: 'msg-h2-1',
        type: 'system',
        trigger: 'R-WEEKLY-001（周度分析）',
        time: '3天前 09:00'
      },
      {
        id: 'msg-h2-2',
        type: 'ai',
        sender: 'Toast AI',
        systemType: '系统定时分析',
        content: '本周（3.3-3.9）经营周报已生成。整体营业额 ¥126,800，环比上周涨了5.4%。外卖渠道增长明显，从上周¥33,200涨到¥40,600，涨了22%。堂食略有下降，主要是工作日午市客流少了一些。\n\n我看了下同商圈川菜的数据，你们店外卖占比32%，已经超过行业P50（28%），说明外卖运营做得不错。但需要注意毛利率下降了1.2个点，主要是外卖毛利率比堂食低5个点。',
        cards: [
          {
            type: 'analysis',
            title: '📊 本周经营概览',
            data: {
              kpis: [
                { label: '周营业额', value: '¥126,800', change: '↑ 5.4%', trend: 'up' },
                { label: '堂食', value: '¥86,200', change: '↓ 2.1%', trend: 'down' },
                { label: '外卖', value: '¥40,600', change: '↑ 22%', trend: 'up' },
                { label: '周毛利率', value: '54.8%', change: '↓ 1.2%', trend: 'warning' }
              ]
            }
          },
          {
            type: 'benchmark',
            title: '🏷️ 周度行业对比',
            data: {
              headers: ['指标', 'A店', '行业P50', '行业P75', '分位'],
              rows: [
                { label: '周营业额增长', store: '+5.4%', p50: '+3.2%', p75: '+6.8%', percentile: 'P62' },
                { label: '外卖占比', store: '32%', p50: '28%', p75: '35%', percentile: 'P58' },
                { label: '周毛利率', store: '54.8%', p50: '56.2%', p75: '58.9%', percentile: 'P45', highlight: true }
              ],
              conclusion: '外卖增长表现优秀，但需关注毛利率下降问题（样本数：同商圈川菜 428 家）'
            }
          }
        ],
        actions: ['查看完整周报', '生成总部汇报', '同步飞书']
      }
    ]
  }
];
