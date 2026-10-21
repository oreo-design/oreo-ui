# Szymon · 光学玻璃材质与浏览器渲染

- 日期：2026-10-21
- 来源：https://x.com/aecyydesign/status/2112623654530138136?s=20
- 作者：Szymon / @aecyydesign；原帖展示四段浏览器工具渲染，前三段约 8 秒，第四段约 16 秒。
- 分类：材质 / 三维品牌视觉 / 程序化表面 / WebGPU
- 用户意图：研究视频中的漂亮材质，积累到 Oreo。

## 实际看到的内容

黑底上旋转的厚玻璃圆片，有清晰的倒角与侧壁。高光呈粉紫、白色和暖色条带；正面有暗蓝/紫色、透射和反射形成的明暗切换。可见细小划痕与柔和的表面雾感。四段分别展示堆叠、圆环排列、沿画面斜向散布的圆片和单片近景。已逐段播放并暂停观察；原始截图保存在同一任务 REVIEW。

这属于有真实体积的三维光学材质。不能仅用 UI 的半透明背景与 backdrop-filter 得到相同的厚边、折射、内部路径和转动高光。

## 作者明确说明的技术

原帖明确列出：基于 Three.js、自定义 WebGPU 光谱路径追踪器、Intel AI 降噪、蓝噪声采样、稳定视频循环，以及程序化 scratches / haze / smudges。回复进一步说明可导入 SVG 形状，包括文字、标志和自定义路径；主要展示目标是玻璃材质。

这证明的是作者的公开描述，尚未取得其 shader、光谱采样方式、灯光参数、降噪器浏览器移植方式与工具源码。不能把下述实现建议说成原作者的精确实现。

## 为什么漂亮：观察与合理推断

1. **几何边界先于材质参数。** 有厚度、有倒角的闭合几何给边缘高光留出空间。圆片正面、侧壁和倒角采用不同方向的法线，转动时会形成连续但分离的亮带。具体几何参数属于推断。
2. **透射、折射与体吸收。** 光线穿过玻璃后改变方向与颜色；入射角和传播距离变化，使同一片玻璃出现通透、深色和高亮几个区域。具体 IOR/吸收系数未知。
3. **布光塑造形状。** 明确的长条反射说明场景有形状清楚的光源/环境亮区；粉紫色既可能来自光源、环境或玻璃吸收，不能仅由画面断言使用某种薄膜。纯黑背景让窄高光和透射色更加突出。
4. **色散与光谱渲染。** 作者明确使用光谱追踪；不同波长的传播可产生更自然的色边和复杂玻璃光路。彩色外观不能单独证明全部颜色都来自色散，也不能等同于 iridescence 薄膜干涉。
5. **微观的不完美。** 程序化划痕、雾感和污渍在粗糙度与法线等通道中打破过于理想的镜面。原通道实现未知；稳定的纹理和采样有助于防止动画闪烁。
6. **采样与降噪是画质保障。** 蓝噪声组织采样，降噪减少蒙特卡洛噪点；它们不替代几何、材质和布光。Intel 的官方项目说明其滤镜用于光线追踪图像去噪，但未证明作者的具体移植方案。

## 在 Oreo 中如何采用

新增 `SpectralGlass` 和完整 `/spectral-glass-studio` 材质台；组件入口 `/spectral-glass` 复用现有 Playground/文档体系。保留三种颜色、堆叠/环形/单片构图，以及粗糙度、色散、厚度、表面细节、转角和暂停控制。

本次用实时 Three.js WebGL RGB 渲染来积累可操作的近似配方：闭合 LatheGeometry、MeshPhysicalMaterial、PMREM 预过滤环境、程序化条形灯和粗糙度/bump 纹理。透射缓冲保留程序化摄影棚环境，再通过物体 mask 合成到黑底，避免空黑舞台令透射面全部变黑。没有复现光谱路径追踪、玻璃之间的多次反射/折射、焦散、蓝噪声采样或 AI 降噪。不能宣称与原视频像素一致。

材质的艺术色值由独立 palette 管理；Oreo 的文字、间距、圆角、动作和页面主题继续使用已有 tokens、Button、IconButton、Icon、useThemeMode。原有 AuroraSurface 是界面中的装饰边缘光，不承担体积玻璃；本次不改它。

适用：品牌主视觉、局部装饰、材质实验、预渲染品牌资产的原型。不建议把持续三维渲染铺到业务卡片、表格或文本背景；生产官网若无需交互，可评估离线渲染的视频/静帧与静态替代，再按目标设备测试。

## 采用状态与证据

- 2026-10-21：用户明确认可材质方向；可复用组件、完整模板与研究档案已实现，合入状态见 [唯一任务 REVIEW](../../reviews/spectral-glass-20261021/REVIEW.md)。
- [组件与模板使用说明](../../../src/patterns/spectral-glass-studio/README.md)。
- 原视频截图、Oreo 缺失路由基线、渲染同角色参考、实现后截图、动作录屏和验证边界统一保留在 REVIEW。

## 技术依据

- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html)：transmission、IOR、thickness、attenuation、dispersion、iridescence 的定义；复杂材质有额外每像素成本，建议提供 environment map。
- [Three.js transmission example](https://threejs.org/examples/webgl_materials_physical_transmission.html)：官方实时透射示例。
- [Intel Open Image Denoise](https://www.openimagedenoise.org/)：光线追踪图像的深度学习降噪，不是玻璃 shader。
