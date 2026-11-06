# Align UI Input: 交互映射到 Oreo

研究日期：2026-11-06。来源：[Align UI v1.2 Input](https://www.alignui.com/docs/v1.2/ui/input)。

用户要求逐项查看交互并新建 Oreo Input；采用交互语义，基础颜色、尺寸、字阶、间距、圆角和焦点规范全部来自 Oreo。

参考共 19 项：基础、图标、尺寸、独立前后缀、行内前后缀、标签与说明、快捷键提示、密码显隐、密码条件反馈、禁用、错误、附带按钮、支付卡号、附带选择器、行内选择器、标签、分段日期、数量步进和 primitives 组合。参考页面实际操作及源代码检查分别记录在任务 review 中，不能把源码检查当成跨浏览器实测。

已采用：`src/components/input/` 的 native Input 和组合 API，React Aria 的日期/数字/选择行为，以及 react-payment-inputs 的本地格式化与卡种识别。组件文档有完整 19 项示例，Playground 有 6 类可调预览和独立可运行的导出示例。PropertyControl 的单行文字和数字输入改用共享 Input；现有数字归一化仍由 schema 负责。

有意差异：Oreo 使用已有单边框焦点反馈，不带参考的外部光晕；复用 Oreo IconButton、Tag、Shortcut 和 Menu 表面。卡种显示为文字，没有复用支付品牌图像。强度反馈只是三个条件的检查表，不是安全评分；卡号示例不提交支付请求。

唯一证据与审查索引：[REVIEW.md](/Users/ziye/Documents/Project/Research/oreo-input-align-20261106-evidence/REVIEW.md)。包含真实基线、桌面/窄屏/深色截图、录屏原帧、表单与输入法验证、版本及交付状态。此路径是本机证据位置，不是公共媒体 URL。正式组件规则只维护在 `src/components/input/rules.ts`，供 docs 与 Agent 导出共用。

后续修正（2026-11-06）：Playground 属性编辑器迁移到 Input 时误把字号从 12px 带到 md 的默认 14px。已在共享 PropertyControl 的文字和数字编辑器显式使用 Oreo text-xs token，保留 md 的 32px 高度；不改变基础 Input 的默认字号。前后截图、浏览器计算样式与验证继续维护在同一 REVIEW.md。
