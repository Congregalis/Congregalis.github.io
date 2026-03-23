export const notes = [
  {
    slug: "field-observation-01",
    title: "Field Observation 01",
    date: "2026-03-23",
    summary: "一段首页时间线摘要。",
    clawIntro: "Claw 已经把这篇从档案柜里抽出来了。",
    body: [
      "第一段正文，要足够长，避免文章页在测试视口里完全没有滚动空间。",
      "第二段正文，继续展开同一个观察主题。",
      "第三段正文，拉开真实阅读节奏。",
      "第四段正文，专门保证阅读辅助测试有滚动空间。"
    ],
    previous: null,
    next: "field-observation-02"
  },
  {
    slug: "field-observation-02",
    title: "Field Observation 02",
    date: "2026-03-24",
    summary: "第二段首页时间线摘要。",
    clawIntro: "Claw 把第二篇也拖出来了。",
    body: [
      "另一篇正文，也要保持足够长度。",
      "继续展开，别让文章页短到像提示条。",
      "第三段正文，用于阅读辅助测试。",
      "第四段正文，确保滚动后进度会变化。"
    ],
    previous: "field-observation-01",
    next: "field-observation-03"
  },
  {
    slug: "field-observation-03",
    title: "Field Observation 03",
    date: "2026-03-25",
    summary: "第三段首页时间线摘要。",
    clawIntro: "这是目前时间线里最新的一篇。",
    body: [
      "第三篇正文，同样保持可滚动长度。",
      "继续补足内容节奏。",
      "第三段正文。",
      "第四段正文。"
    ],
    previous: "field-observation-02",
    next: null
  }
];
