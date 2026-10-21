# ASCII 全站主题

- 日期：2026-10-21
- 来源：[Oreo UI Explore · 330:10660](https://www.figma.com/design/IkbhK3tTt9Hj64nzeR8aVK/Oreo-UI-Explore?node-id=330-10660)
- 用户要求：用参考中的 ASCII 风格替换 Material 预设。
- 采用范围：现有全站 theme，不新建参考中的营销页面。

## 实际观察与映射

参考是暖白纸面 #f5f4f0、黑色操作、细灰边框和直角结构。
主标题 Source Serif 4，正文/导航 Inter，编辑区和模型标签 Geist Mono；
不是全站等宽字体。现有字号与层级保留，字族改为 display / UI / input / mono
角色 token。暖白背景与近白表面是新增 palette 值；其余中性文字、边框继续复用
Oreo semantic tokens。默认 radius=0、density=1，状态色保持语义。
圆形操作/头像仍是圆形，装饰性条纹 logo 和模板图片不是全站 UI 图标。
主题样本用 CSS 条纹表达，现有集中图标体系不变。

实现 owner：`src/lib/theme/tokens.ts`；根 provider 包括 body portals，Compare
与导出复用相同 tokens。字体自托管。旧 Material 保存项/链接在读取边界迁移，
旧预设默认值转换，用户自定义值保留。现有整页 220ms 主题过渡保持。

## 限制与证据

参考只给出浅色。深色是基于同一中性、暖灰层级的产品推导，非 Figma 逐像素复刻。
既有专用品牌画面/可视化色彩和明确指定字族的组件保持其用途。
审查与媒体沿用唯一任务索引：
`/Users/ziye/Documents/Project/Research/output/playground-figma-20261019/REVIEW.md`
（ASCII 2026-10-21 章节）。截图、迁移/导出测试和上线结果在该处记录。

## 三画板复核与补全

追加来源：330:16080（公告卡）、328:8288（功能弹窗），局部节点见任务 REVIEW。
原首轮“仅 token、不插入插画”的范围不足；本轮增加共享 surface recipes，
补齐页面构造线/淡斜线、composer 4px 定位角点、标题/技术文案字族、白色卡片与
奶油色插画层、轻阴影和语义圆角例外。Docs 标题区采用原稿 330:10859 的三段
条纹图形，SVG 原件集中在 `src/lib/theme/assets/ascii`，不作为操作图标使用。
蝴蝶、立方体、球体是同一插画语汇的替代稿，不同时堆进每个页面；本次选用
原稿条纹图形。功能弹窗中的协作头像/编辑框也不被误当作普通按钮装饰。

映射与理由：17px serif 卡标题 → 现有16px text-base；24px弹窗标题 → text-2xl；
Source Serif Pro → 已加载 Source Serif 4；20/24/8/16间距 → spacing5/6/2/4。
纸面/插画palette、4px图形标记、SVG固有坐标、19%蒙层、4%阴影无已有等价项，
作为此主题的集中角色token/静态图形值保留。用户自定义圆角不会消除keycap/model/media
角色差异，仍调整其增量。Hover/press继续叠加当前背景，切换继续整页过渡。
