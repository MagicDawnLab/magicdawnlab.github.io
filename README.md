# MagicDawn Research – 项目架构说明

> **MagicDawn** 是腾讯游戏旗下的前沿游戏研发技术团队，本仓库为其学术研究成果展示网站，托管于 GitHub Pages。

---

## 1. 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| CSS 框架 | [Bulma](https://bulma.io/) v0.9.x | 提供响应式栅格、导航栏、Footer 等基础组件 |
| 自定义样式 | `static/css/index.css` | 所有自定义样式（Hero、论文卡片、对比滑块等） |
| 图标 | [Font Awesome](https://fontawesome.com/) 5.x | 全站图标（导航、标签、按钮等） |
| 学术图标 | [Academicons](https://jpswalsh.github.io/academicons/) | 用于论文详情页的学术平台图标 |
| 字体 | [Google Fonts – Inter](https://fonts.google.com/specimen/Inter) | 全站主字体 (400/500/600/700/800) |
| JS 库 | jQuery 3.5.1 | DOM 操作辅助 |
| 轮播 | bulma-carousel + bulma-slider | 论文详情页图片轮播和滑块 |
| 自定义脚本 | `static/js/index.js` | 轮播初始化、对比滑块、论文面板切换等 |
| 托管平台 | GitHub Pages | 静态站点托管，根目录下 `.nojekyll` 禁用 Jekyll 构建 |

---

## 2. 目录结构

```
magicdawnlab.github.io/
├── .nojekyll                      # 禁用 GitHub Pages 的 Jekyll 处理
├── index.html                     # 🏠 主页（About + Publications 两大板块）
├── README.md                      # 本文件
│
├── dawn/png/                      # Logo 素材
│   ├── MD标识_横版_原色_白字.png    # 导航栏横版 Logo
│   ├── MD标识_竖版_原色_白字.png    # Hero 区域竖版 Logo
│   └── MD标识_竖版_原色_黑字.png    # Favicon
│
├── pages/                         # 📄 论文详情页
│   ├── ndgi.html                  # Neural Dynamic GI (CVPR 2026)
│   ├── uv.html                    # UV-based Lightmap Compression (Eurographics 2026)
│   └── gpc.html                   # Gaussian Probe Compression (SIGGRAPH 2025)
│
└── static/
    ├── css/
    │   ├── bulma.min.css          # Bulma 框架
    │   ├── bulma-carousel.min.css # 轮播插件样式
    │   ├── bulma-slider.min.css   # 滑块插件样式
    │   ├── fontawesome.all.min.css# Font Awesome 图标
    │   └── index.css              # ⭐ 自定义样式（所有页面共用）
    ├── js/
    │   ├── bulma-carousel.min.js  # 轮播插件
    │   ├── bulma-slider.min.js    # 滑块插件
    │   ├── fontawesome.all.min.js # Font Awesome JS
    │   └── index.js               # ⭐ 自定义脚本（所有页面共用）
    ├── images/                    # 论文配图（按论文分子目录）
    │   ├── gpc/                   # GPC 论文图片
    │   ├── ndgi/                  # NDGI 论文图片
    │   └── uv/                    # UV 论文图片
    ├── pdfs/                      # 论文 PDF 文件
    └── videos/                    # 论文视频
        ├── gpc/                   # GPC 论文视频
        └── ndgi/                  # NDGI 论文视频
```

---

## 3. 页面结构

### 3.1 主页 (`index.html`)

主页由以下模块自上而下组成：

```
┌─────────────────────────────────────────────┐
│  TopBar (固定导航栏)                          │
│  Logo + [About] [Publications] 链接           │
├─────────────────────────────────────────────┤
│  Hero Banner (深色背景 #about)                │
│  ┌──────────┬────────────────────────┐      │
│  │ 竖版Logo │ About Us 介绍文案       │      │
│  │          │ 📧 邮箱联系按钮         │      │
│  │          │ 三大技术方向标签         │      │
│  │          │ Performance / Visual /  │      │
│  │          │ Audio                   │      │
│  └──────────┴────────────────────────┘      │
├─────────────────────────────────────────────┤
│  Publications (#publications)                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ Paper 1 │ │ Paper 2 │ │ Paper 3 │       │
│  │ NDGI    │ │ UV      │ │ GPC     │       │
│  │ CVPR'26 │ │ EG'26   │ │ SIG'25  │       │
│  └─────────┘ └─────────┘ └─────────┘       │
│  (每张卡片可点击跳转到 pages/*.html)          │
├─────────────────────────────────────────────┤
│  Footer (© 2026 Tencent Games)              │
└─────────────────────────────────────────────┘
```

### 3.2 论文详情页 (`pages/*.html`)

每个论文详情页为独立的 HTML 文件，共用相同的 CSS/JS 资源（通过相对路径 `../static/` 引用）。典型结构包含：

- **顶部导航栏**：与主页一致，包含返回主页的链接
- **论文标题 & 会议标签**
- **作者列表**
- **操作按钮**：Paper PDF / ArXiv / Code / Video 等
- **摘要 (Abstract)**
- **图片轮播 / 对比滑块**：展示效果对比
- **方法概览图**
- **BibTeX 引用**

---

## 4. 关键 CSS 约定 (`static/css/index.css`)

### 4.1 CSS 变量

```css
:root {
  --ease: all .35s cubic-bezier(.4,0,.2,1);  /* 全局过渡动画 */
}
```

### 4.2 主要 CSS 类名

| 类名 | 作用 |
|------|------|
| `.topbar` | 顶部固定导航栏 |
| `.topbar.scrolled` | 滚动后导航栏变为半透明 + 模糊 |
| `.site-hero` | Hero Banner 容器 |
| `.hero-logo` | Hero 区域的大 Logo |
| `.hero-tagline` | Hero 区域的介绍文案 |
| `.hero-email-btn` | 📧 邮箱联系按钮（渐变蓝色 + 发光 + 悬浮动画） |
| `.hero-pillars` | 三大技术方向标签容器 |
| `.hero-pillar` | 单个技术方向标签 |
| `.pub-section` | Publications 板块容器 |
| `.paper-cards` | 论文卡片网格容器 |
| `.paper-card` | 单张论文卡片（悬浮时上移 + 边框高亮） |
| `.paper-card-venue` | 论文会议标签 (如 CVPR 2026) |
| `.btn-top` | 回到顶部按钮 |
| `.cmp-box` | 图片对比滑块容器 |
| `.cmp-handle` | 对比滑块的拖拽手柄 |

### 4.3 响应式断点

CSS 中使用 `@media` 进行移动端适配：
- `max-width: 1024px` — 平板适配
- `max-width: 768px` — 手机端适配（Hero 区域改为纵向布局）

---

## 5. 关键 JS 模块 (`static/js/index.js`)

| 函数 / 模块 | 功能 |
|-------------|------|
| `initCarouselsInPanel(panel)` | 懒初始化指定面板内的轮播组件 |
| `switchPaper(id)` | 切换论文详情面板（主页旧版功能，目前为独立页面模式） |
| `refreshAllCmp()` | 刷新所有对比滑块覆盖层宽度 |
| `goTop()` | 平滑滚动回顶部 |
| `initSliders()` | 初始化对比滑块拖拽交互（支持鼠标和触摸） |
| `initMethodTabs()` | 初始化方法切换 Tab（切换对比图中的不同方法） |
| `$(document).ready()` | DOM 就绪后初始化轮播、处理 URL hash 跳转 |

---

## 6. 如何新增一篇论文

### Step 1: 准备资源

在 `static/` 下创建对应子目录：
```
static/images/<paper-id>/    # 论文配图
static/videos/<paper-id>/    # 论文视频（如有）
static/pdfs/<paper-id>.pdf   # 论文 PDF（如有）
```

### Step 2: 创建论文详情页

复制一个现有详情页（如 `pages/gpc.html`）为模板，修改以下内容：
- `<title>` 和 `<meta>` 标签
- 论文标题、作者、摘要
- 操作按钮链接 (PDF / ArXiv / Code / Video)
- 图片、视频、对比滑块素材
- BibTeX 引用

### Step 3: 在主页添加论文卡片

在 `index.html` 的 `<div class="paper-cards">` 内添加新卡片：

```html
<a class="paper-card" href="./pages/<paper-id>.html">
  <div class="paper-card-img">
    <img src="./static/images/<paper-id>/teaser.png" alt="..." loading="lazy"/>
  </div>
  <div class="paper-card-body">
    <span class="paper-card-venue">会议名称 年份</span>
    <h3 class="paper-card-title">论文标题</h3>
    <p class="paper-card-authors">作者列表</p>
    <p class="paper-card-desc">一句话描述</p>
  </div>
</a>
```

### Step 4: 推送部署

```bash
git add .
git commit -m "Add paper: <paper-title>"
git push origin main
```

GitHub Pages 会自动部署（由于 `.nojekyll` 文件存在，不经过 Jekyll 构建）。

---

## 7. 本地开发

本项目为纯静态网站，无需构建工具。推荐使用以下方式本地预览：

```bash
# 方式一：VS Code Live Server 插件
# 安装后右键 index.html → Open with Live Server

# 方式二：Python HTTP Server
python -m http.server 8000

# 方式三：Node.js
npx serve .
```

然后在浏览器访问 `http://localhost:8000` 即可。

---

## 8. 联系方式

📧 **magicdawn@tencent.com**

如有实习或合作意向，欢迎发送邮件联系。
