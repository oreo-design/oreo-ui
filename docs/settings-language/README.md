# Settings：可继承的设计实现实验

这次实验把「可执行设计语言」落在一个很小的单元上：**真实实现、开放的组合、受审阅的扩展、可重复的证据**。入口是 `/settings-lab`，母版是 `/settings`。

首轮证据、具体修改与局限见 [RESULTS.md](RESULTS.md)。

它仍然写普通 React，不需要把产品需求先翻译成另一套 JSON 页面语言。`contract.json` 记录来源和审阅边界，不负责渲染页面。检查能发现一部分回归，不能自动判断审美，也不是安全沙箱。

## 怎样用于下一次需求

1. 读取这份说明、`contract.json` 和当前 Settings 实现。写下这次需要变化的内容、结构、行为，以及可能受到影响的关系。
2. 优先在 `src/pages/settings-lab/` 新建普通 React recipe。直接复用现有控件、`SettingsPageHeader`、`SettingsGroup`、`SettingsCard`、`SettingsFlow`。产品状态留在 recipe 中。
3. 普通设置用 `SettingsRow`；需要窄容器适配、媒体或详情时用 `AdaptiveRow`。它的 `media / title / description / control / detail` 是内容插槽，不是重新设计内部排版的邀请。
4. 现有接口表达不了时，明确提出一项扩展和它牵动的关系。改动可以进行，但需更新变化记录、原版回归和相应状态检查；不能仅修改哈希消除报错。
5. 运行 `pnpm settings:verify`。先看失败原因，再看桌面、窄容器、暗色与重要交互的实际预览。源码、截图与行为证据需要一起检查。
6. 一个经过验证的新结构可以成为下一次起点。升级 `reviewedChanges` 时记录理由与证据，并保留原始母版 commit。用户的设计判断仍然优先于自动检查。

## 已经保存的判断

| 关系 | 实现载体 | 允许变化的内容 |
| --- | --- | --- |
| 小号分组 label 只命名分组，不携带 description；缩进跟随卡片内部文字边缘 | `language/SettingsGroup.tsx` 复用原版对齐 | label、尾部操作、分组内容 |
| 行内文字与分隔线保持原版字号、行高、留白和末行规则 | 从原版无样式修改提取的 `row-primitives.tsx` | 设置名称、说明、控件 |
| 卡片表面跟随背景层级，圆角跟随 Oreo token | `settings.variants.ts`、`settings.css` | 三个原有外观轴 |
| 操作在空间足够时靠右，空间不足时回到文字下方 | `AdaptiveRow` 的命名容器查询 | 单个或多个控件、不同长度的标签 |
| 媒体靠近标题；窄容器中的操作与详情跟随文字列 | `language.css` 中媒体列、操作列、详情列的关联 | 图标、头像等媒体 |
| 同一次请求的初始与等待标签不改变按钮宽度 | 共享格内的完整标签测量 | 标签内容与请求行为 |

这里保留的是**具体结果及其关联**。例如，只允许改结构却禁止改间距并不可靠：窄容器中改为两行以后，操作需要跟随文字列，页面边距也需要一起审阅。

## 四个场景

| 场景 | 操作 | 验证的问题 |
| --- | --- | --- |
| Notifications | 中英文长描述、开关、长菜单选项 | 内容变化会不会损失排版与操作可达性 |
| Workspace | 重排分组、编辑器、保存操作与权限开关 | 不同部件组合后是否保留页面节奏与状态 |
| Integrations | 连接、等待、失败、重试、权限详情、断开确认 | 新行为能否扩展原型而不重写基础控件 |
| Your data | 选择 JSON/CSV、准备、失败与下载真实示例文件 | 扩展框架能否迁移到另一种异步流程 |

迁移场景在连接行之后编写，没有给 `AdaptiveRow` 增加参数或样式。它复用了同一套 media/control/detail 槽。导出和连接请求均为本地演示；导出文件明确标为 sample。

## 对照与证据的边界

实验界面的「现有接口」和「继承式扩展」使用相同内容与产品逻辑。前者只组合原有行接口，后者使用受审阅的适配。没有故意给对照组加入错误，也没有把同一作者的两种实现包装成独立模型实验。

本轮能验证：所列场景的布局、状态与交互；受保护实现是否变化；检查能否捕获有意注入的错误；原版 Settings 的截图是否保持一致。

本轮不能验证：任意需求都能表达、跨模型生成的稳定性、人的审阅时间节省比例，或所有浏览器上的审美品质。因此不提供虚构的成功率和提效百分比。

后续独立生成实验可以直接使用 `brief.md`：保持母版、模型、任务和预算一致，分别只提供源码／提供源码及这套材料，各运行至少三次。记录需求完成情况、无关改动、实际人工修正和审阅时间。不要为了让结果通过而修改任务或降低检查标准。

## 检查与产物

- `pnpm settings:guard`：检查继承实现和已经审阅的边界，附带内存中的反例测试，不改动工作区。
- `pnpm settings:verify`：在空闲端口启动当前实现及固定母版，跑布局、交互、迁移、反例、原版截图比较，结束时关闭自己启动的服务器。
- `artifacts/settings-lab/qa.json`：布局矩阵、具体交互、运行时错误与检查反例。
- `artifacts/settings-lab/state-probes.json`：320px / 390px 展开确认、导出失败恢复和暗色弹层的补充检查。
- `artifacts/settings-lab/baseline/report.json`：原版比较结果；截图只隐藏演示工具面板，不隐藏产品内容。
- `artifacts/settings-lab/desktop.png`、`mobile.png`、`dark.png`、`narrow.png`：人工检查的预览。

运行需要 Node 20+、pnpm 和 Playwright Chromium；首次准备浏览器可运行 `pnpm exec playwright install chromium`。验证使用已有的项目依赖，基线来自本地 Git 中固定的 commit，不访问真实服务。生成的截图与报告放在被忽略的 artifacts 目录，实验方法与检查脚本随源码保存。

## 为什么没有再加一套组件配置协议

Settings 本身已经具备组合能力。新机制真正补充的是「改动应该落在哪里」以及「如何证明没有顺带丢失旧判断」。先让这一条链条可用，比继续增加 variants 或写一个复杂的中间语言更有价值。

## 2026-09-14：收紧分组 label 边界

用户明确排除小号 label 下再接 description。实验页面统一使用 `language/SettingsGroup`，只开放 `label / actions / children`，`description` 在类型上禁止，运行时也不转发。原始 `/settings` 的 `SettingsSection` 保留为母版对照，业务组合层检查拒绝直接导入它。页面标题与具体设置行仍可承载说明；导出示例提示归到 Workspace archive 行。

通知和集成中的分组说明已移除。布局矩阵增加分组 label 与内容之间不能出现说明段落的检查，并通过注入反例验证。前后截图、源码快照和采集清单保存在 `artifacts/settings-label-boundary-2026-09-14/`。这些约束针对约定组件接口和已覆盖结构，任意自定义 JSX 仍需审阅。
