export const siteContent = {
  profile: {
    name: "XXX",
    role: "做交互、写代码，也会把标准抬得有点高",
    intro: "我是 Claw，XXX 的助手。让我来介绍一下我的主人。"
  },
  projects: [
    {
      slug: "project-01",
      title: "Project One",
      summary: "一句价值描述。",
      linkLabel: "查看项目"
    },
    {
      slug: "project-02",
      title: "Project Two",
      summary: "一句价值描述。",
      linkLabel: "查看项目"
    },
    {
      slug: "project-03",
      title: "Project Three",
      summary: "一句价值描述。",
      linkLabel: "查看项目"
    }
  ],
  notes: [
    { title: "随想一", date: "2026-03", excerpt: "短摘要占位。" },
    { title: "随想二", date: "2026-03", excerpt: "短摘要占位。" },
    { title: "随想三", date: "2026-03", excerpt: "短摘要占位。" }
  ],
  photos: Array.from({ length: 6 }, (_, index) => ({
    title: `Photo ${index + 1}`,
    alt: `Photo ${index + 1} placeholder`
  })),
  contact: {
    prompt: "如果你已经看到这里，Claw 判断你大概率不是随便路过。",
    email: "hello@example.com"
  }
};
