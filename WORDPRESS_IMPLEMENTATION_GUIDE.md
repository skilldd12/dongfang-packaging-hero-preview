# 中山东方印塑厂 · WordPress 动态首屏落地指南

线上交互预览地址（可发给客户逐套对比，支持 `?scheme=1`～`5` 与 `?embed=1` 纯净模式）：
- **总预览页**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/`
- **方案 01（影院视频 + 三幕滚动推镜）**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=1`
- **方案 02（巨型字标 + 指针光追）**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=2`
- **方案 03（纯白留白 + 四周多速视差）**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=3`
- **方案 04（五联错落艺廊 · 点击聚焦）**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=4`
- **方案 05（不对称画报拼版 + 1.8× 放大镜）**：`https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=5`

> 若希望客户**仅看某一套、看不到底部任何切换条**，在网址后加 `&embed=1` 即可，例如：
> `https://skilldd12.github.io/dongfang-packaging-hero-preview/?scheme=1&embed=1`

---

## WordPress 中哪套最合适、怎么实现？

| 方案 | WordPress 实现难度 | 需不需要付费/重插件 | 在 Elementor / Gutenberg 中的做法 | 后期后台换图换字便捷度 |
| :--- | :--- | :--- | :--- | :--- |
| **01 · 影院视频推镜（首推）** | 低 | **不需要**（WPCode + 官方 2 个 GSAP JS 文件） | 底层视频用 WP 原生 Container Background Video；三幕切镜靠 `gsap.min.js` + `ScrollTrigger.min.js`（约 35 行） | **极高**（媒体库直接换 MP4 / JPG） |
| **02 · Gander 巨字光追** | **极低** | **零插件**（纯 CSS + 12 行原生 JS） | 背景图 + Heading 设置 `background-clip: text` + 鼠标 `--gx / --gy` 坐标写入，加载仅 < 1KB | **极高**（改文字即改巨字） |
| **03 · 留白视差画框** | **极低 / 零代码** | **Elementor Pro 原生自带**（或 18 行 GSAP） | Elementor Image 控件开启 *Advanced → Motion Effects → Scrolling Effects（Vertical Scroll 设不同速度）* | **极高**（可视化拖拽替换 6 张图） |
| **04 · 五联错落艺廊** | 中低 | **零插件** | 5 个 `<button>` 采用 Flexbox `flex` 与 `height` CSS 过渡，放入 Gutenberg Custom HTML 或 Elementor HTML 挂件 | **中**（HTML 中替换 5 个图片链接） |
| **05 · 拼版 + 1.8× 放大镜** | 中 | **零插件** | CSS Grid + `clip-path` + 原生 `background-position` 放大跟随，无需商用相册放大插件 | **中**（HTML 中维护 3 组幻灯图 URL） |

---

## 快速上线建议（给公司 WordPress 建站同事）

1. **优先推荐组合**：如果客户喜欢简约高级感又考虑后期自己方便换产品图，最推荐 **方案 01** 或 **方案 03**，其次 **方案 02**。
2. **媒体替换规范**：将本仓库 `assets/` 与 `media/hero-erewhon-theater.mp4` 上传到 WordPress **媒体库（Media Library）**，替换掉嵌入片段里的 `REPLACE_*_URL` 占位地址即可。
3. **无障碍与移动端退化**：演示站内置 `prefers-reduced-motion` 检测，在弱动效设置或 390px 移动端下会自动停止高耗能滚动推镜、切换为清晰稳定的静态或 2 列排版。
