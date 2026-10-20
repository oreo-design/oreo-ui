> 历史研究归档：正文结论、日期和验证限制来自原分析；本次只迁移文件并将本包媒体链接改为相对路径。历史“当前/已交付/待完成”等表述均以原日期为准。

# Playground 功能差距审阅

日期：2026-10-14。范围：只读分析；未改产品代码、未提交或发布。

## 来源与版本

- [原帖](https://x.com/alibey_10/status/2110028700313948603)：29 秒 CommandMenu 演示；检查了视频 4 秒画面及实际产品。
- [参考 CommandMenu](https://www.fluidfunctionalism.com/docs/command-menu?preset=kdAK)；[参考 InputMessage](https://www.fluidfunctionalism.com/docs/input-message?preset=ma2fE)。
- Oreo：本机已有 localhost:5201 服务，目录 `oreo-ui-alibey-20261014`，HEAD `6df7697a6399ae92470a414dcaf825a02f719473`；检查 Button、Prompt Box 页面。
- 查询时远端 main 为 `ae25227202641f5252ed199eb37692c0e9e61027`。其 ComponentPlayground.tsx 与所查看服务源码一致，SHA1 均为 `552246a557ca8bcf222692678f05f521ebf90c3a`。主目录 oreo-ui 的同文件也一致。此核对仅覆盖共享 playground 外壳，不代表服务全站等同 main，也不代表线上部署状态。
- Chrome + Playwriter 会话 34；桌面 1440×1000，浅色。截图均已打开检查。浏览器有钱包扩展报错与本地 analytics 404；未据此判断产品缺陷。

## 已有能力

共享 ComponentPlayground / PropertyControl / schema 已支持：文本、开关、枚举、数值滑块与输入、分组、依赖数值边界、Reset、Replay、主题、圆角、图标库、实时 JSX 与 imports。Prompt Box 等页面已有可选的自动演示播放器。

实际打开 Prompt Box 的 Show attachments，预览出现 Design brief.pdf；Code 页同步生成 AttachmentBar / Attachment 和相应 imports。导出明确是起始 JSX，回调需由使用方接入。

## 值得补充

| 优先级 | 能力 | 参考证据 | Oreo 当前差距 / 建议 |
| --- | --- | --- | --- |
| P1 | 配置分享与恢复 | CommandMenu 开启 Filters 后 URL 从 preset=kd8G 变为 kdAK；刷新后 Filters 仍为 true | 当前属性仅为 React 本地状态。统一序列化组件配置，增加 Copy link；校验版本、枚举与数值边界 |
| P1 | Copy prompt | 实际复制结果包含当前 preset 专用 shadcn 安装 URL、组合组件用法、API、依赖条件、回链 | 现有 Copy code / Copy command 不提供 AI 接入上下文。先复用现有 JSX 与 schema 生成说明；专用安装包能力单独建设，不能假装已经可用 |
| P1 | Randomize properties | InputMessage 点击后 History recall、Queue 状态变化，preset 从 ma288 改为 ma2fE | 从 schema 的合法选项与范围随机；允许锁定内容，保留 Reset。不要生成互相冲突的业务状态 |
| P2 | Inspect 标尺 | 打开 Inspect 后预览上边与左边出现像素刻度 | 在共享预览容器加入标尺 / 尺寸辅助。Token 映射与间距说明是我们可进一步做的扩展，本次没有验证参考已具备这些能力 |
| P2 | 控件依赖与条件显示 | Oreo Prompt Box 关闭 Dictation & action review 时仍显示 Action review 子项 | schema 增加 visibleWhen / enabledWhen，并沿用项目禁用说明规则；属于现有属性面板可读性改进 |
| P3 | 全局 Size / density | 参考 Make them yours 有 Size；Oreo 只有部分组件自己的 size，公共 Appearance 没有密度 | 可加统一密度预览；只映射组件已有尺寸/token，不缩放整个截图冒充响应式 |

Copy prompt 的安装命令未实际运行，不能据复制文本声称其安装成功。参考 Primitive 选择器可见 Base UI；没有验证其它选项。Oreo 以 Base UI 为既定底层，不建议仅为对齐参考而增加第二套实现。

额外产品建议（不是已确认的参考功能）：命名场景预设、窄屏预览与多变体并排比较。第一轮可先做共享配置模型，再覆盖 Button、Prompt Box、Web Search，避免每页各自实现。

## 一致性检查

| Lens | 对照与共享归属 | 结果 / 覆盖限制 |
| --- | --- | --- |
| Entry behavior | 参考 CommandMenu/InputMessage；Oreo Button/Prompt Box；ComponentPlayground、DocsPage | checked：实际打开并观察对应页；Oreo Preview→Code 保留当前附件配置。Documentation 往返未专项验证 |
| Loading | 页面进入 / demo 播放 | unverified：没有模拟慢网络或完整录制 loading；不据静态图评价加载一致性 |
| Empty states | Prompt Box 默认空输入；参考空 composer | checked：观察了默认空内容；错误与无搜索结果状态未覆盖，不能推广为通用空状态已一致 |
| Actions | Button/Prompt Box 的 Replay、Reset、Code 与复制动作 | checked：共享外壳源码与两页媒体；使用既有 Button/PropertyControl。未全面检查 hover/focus/disabled |
| Titled scrolling | 两站属性栏与页面滚动 | unverified：截图和源码显示滚动容器，但未完成 top/middle/end、长标题专项对比 |
| Icons/color | Oreo 两页共享 Icon、Switch 与语义色 token；参考使用其自有蓝色开关 | checked（静态正常态）：沿用 Oreo 语义，不照搬参考蓝色。破坏性/禁用菜单与深色主题本轮未覆盖 |

## 媒体索引

这些是本轮参考/现状对照，不是实施前后证据；没有实现任何改动。

| 文件 | 状态 |
| --- | --- |
| [tweet-video-04.png](tweet-video-04.png) | 原帖视频 4 秒，CommandMenu 属性区 |
| [reference-command-menu.png](reference-command-menu.png) | 参考 CommandMenu，Filters 开启 |
| [reference-playground.png](reference-playground.png) | 参考 InputMessage 默认变体 |
| [reference-inspect.png](reference-inspect.png) | 参考 InputMessage 随机变体、Inspect 开启 |
| [oreo-button.png](oreo-button.png) | Oreo Button 默认 playground |
| [oreo-prompt-box.png](oreo-prompt-box.png) | Oreo Prompt Box 默认 playground |

证据限制：未完整录制参考视频、未做移动端/深色主题、安装流程、生产环境或所有组件的视觉审查。此次结论是已检查共享能力的差距，不是全站一致性认证。
