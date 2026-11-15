# 中山东方印塑厂 · WordPress 动态首屏落地指南（Hero-Only v2）

线上纯首屏交互预览地址（全套锁定 `100vh` 首屏演示、零多余下文、无视频整数像素抖动，支持 `?scheme=1`～`5` 与 `?embed=1` 纯净模式）：
- **总预览页**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/`
- **方案 01（Erewhon 同款三栏顶栏 + 丝滑轮播 + GPU 呼吸动效）**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=1`
- **方案 02（Gander 巨型字标 + 指针光追）**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=2`
- **方案 03（Studio Freight 留白排版 + 鼠标深景视差）**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=3`
- **方案 04（Codrops 五联错落艺廊 · 点击聚焦）**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=4`
- **方案 05（不对称画报拼版 + 1.8× 放大镜）**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=5`

> 若希望客户**仅看某一套、看不到底部任何切换条**，在网址后加 `&embed=1` 即可，例如：
> `https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=1&embed=1`

---

## 为什么上一版出现莫名抖动？本次如何根治

1. **旧版视频编码帧步进抖动**：此前 `media/hero-erewhon-theater.mp4` 采用 `ffmpeg zoompan` 生成缓慢推镜，受整数像素坐标取整影响，连续 7 帧静止后突然整体跳移 `1px`，导致画面周期性微抖；本次已彻底移除该视频及 `ScrollTrigger.min.js`，改为浏览器 GPU 合成层亚像素级 CSS `transform: translate3d / scale3d` 缓动（`s1SlowBreathe`，丝滑零跳帧）。
2. **滚动平滑与 `pin` 抢占冲突**：移除 `html { scroll-behavior: smooth }` 与整屏滚动 `pin` 锁定，全套演示收束为纯 `100vh` 首屏，从根本上杜绝滚轮回弹与画面撕裂。

---

## WordPress 中哪套最合适、怎么实现？

| 方案 | WordPress 实现难度 | 需不需要付费/重插件 | 在 Elementor / Gutenberg 中的做法 | 后期后台换图换字便捷度 |
| :--- | :--- | :--- | :--- | :--- |
| **01 · Erewhon 极简轮播（首推）** | **极低** | **零插件**（或 WP 原生 / Elementor Slides + 15 行 CSS `translate3d`） | 顶部 `#1C1D1D` 三栏极细导航栏（68px），下方全幅 Slider 配居中大写标语、磨砂描边按钮与底部圆点 | **极高**（媒体库直接换 3 张高清 JPG） |
| **02 · Gander 巨字光追** | **极低** | **零插件**（纯 CSS + 12 行原生 JS） | 背景图 + Heading 设置 `background-clip: text` + 鼠标 `--gx / --gy` 坐标写入，脚本 < 1KB | **极高**（改文字即改巨字） |
| **03 · 留白鼠标深景视差** | **极低 / 零代码** | **Elementor Pro 原生 Mouse Track**（或 15 行 `gsap.quickTo`） | 6 个 Image 控件开启 *Motion Effects → Mouse Effects → Mouse Track* 并设不同正负深度系数 | **极高**（可视化拖拽替换 6 张图） |
| **04 · 五联错落艺廊** | 中低 | **零插件** | 5 个 `<button>` 采用 Flexbox `flex` 与 `height` CSS 过渡，放入 Gutenberg Custom HTML 或 Elementor HTML 挂件 | **中**（HTML 中替换 5 个图片链接） |
| **05 · 拼版 + 1.8× 放大镜** | 中 | **零插件** | CSS Grid + `clip-path` + 原生 `background-position` 放大跟随，无需商用相册放大插件 | **中**（HTML 中维护 3 组幻灯图 URL） |

---

## 快速上线建议（给公司 WordPress 建站同事）

1. **优先推荐组合**：参照 `ship.erewhon.com` 的品牌质感与后期免折腾维护成本，首推 **方案 01（Erewhon 极简轮播）**，其次 **方案 03（鼠标深景视差）** 与 **方案 02（巨字光追）**。
2. **媒体替换规范**：将本目录 `assets/` 高清静图上传到 WordPress **媒体库（Media Library）**（无需再传 `.mp4` 视频），在页面或顶部“WP 实现”代码弹窗中替换占位 URL 即可直接上线。
3. **无障碍与移动端退化**：演示站内置 `prefers-reduced-motion` 检测，在弱动效设置或 390px 移动端下自动关闭剧烈位移，保持干净稳固的排版展示。
