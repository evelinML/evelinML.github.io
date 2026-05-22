# Polyglow 中文说明

[English README](README.md)

Polyglow 是一个基于 Astro 6 的多语言静态内容站。当前代码面向中文优先的编辑型博客，内置语言前缀路由、内容集合、分类和标签归档、作者页、Pagefind 搜索、RSS、站点地图、SEO 元数据、结构化数据、图片优化、明暗主题，以及可选的 Cloudflare Workers 静态资源部署。

普通静态托管不需要数据库，也不需要私有服务。

## 环境要求

- Node.js 24 或更新版本
- pnpm 11

## 开始

```bash
pnpm install
pnpm dev
```

Astro 会输出本地访问地址。当前默认入口从 `/` 跳转到中文路径：

```text
http://localhost:4321/zh/
```

## 常用命令

```bash
pnpm dev           # 本地开发
pnpm typecheck     # 运行 astro check
pnpm test          # 运行 Vitest 工具测试
pnpm build         # 类型检查、构建静态产物、格式化 sitemap XML
pnpm preview       # 本地预览构建产物
pnpm images:check  # 检查远程 OptimizedPicture 的宽高配置
pnpm seo:check     # 构建后检查生成 HTML 的 SEO 输出
pnpm design:lint   # 校验 DESIGN.md
pnpm design:theme  # 生成 src/styles/design-theme.css
pnpm deploy        # 构建后通过 Wrangler 部署 dist
```

## 项目结构

```text
astro.config.mjs             # Astro、i18n、图片、sitemap、集成配置
src/config/                  # 站点、语言、分类标签、分页、资源配置
src/content/                 # 作者、页面、文章内容
src/pages/                   # 多语言路由和生成端点
src/layouts/main.astro       # 共享页面壳、SEO、组件、页头页脚
src/components/              # 卡片、布局、导航、搜索、组件、图标
src/integrations/pagefind.mjs # 自定义 Pagefind 构建和开发集成
src/styles/global.css        # 运行时 Tailwind v4 主题和组件 CSS
src/styles/design-theme.css  # 从 DESIGN.md 生成的设计令牌
scripts/                     # 构建检查、sitemap、设计导出、部署脚本
tests/                       # Vitest 工具测试
```

## 路由和语言

已配置语言：

```text
zh en fr es ru ja ko pt de id ar
```

`zh` 是默认语言。公开页面使用语言前缀，并保留结尾斜杠：

```text
/zh/
/zh/posts/
/zh/posts/<slug>/
/zh/category/
/zh/category/<slug>/
/zh/tags/
/zh/tags/<slug>/
/zh/author/
/zh/search/
/zh/rss.xml
```

阿拉伯语页面通过语言元数据启用 RTL 方向。

## 写内容

内容位于 `src/content`：

```text
src/content/
  authors/<locale>/
  pages/<locale>/
  posts/<locale>/
```

文章示例：

```text
src/content/posts/zh/my-post.mdx
src/content/posts/en/my-post.mdx
```

文章 frontmatter：

```yaml
---
title: "文章标题"
description: "用于卡片和 SEO 的简短摘要。"
category: "build"
tags: ["strategy"]
pubDate: 2026-05-12
updatedDate: 2026-05-12
authors: ["default"]
heroImage: "/open-graph.webp"
heroImageAlt: "图片替代文本"
locale: "zh"
draft: false
featured: false
---
```

可选 SEO 字段：

```yaml
seoTitle: "自定义标题"
seoDescription: "自定义 meta description。"
canonical: "https://example.com/original/"
heroBlurDataURL: "data:image/..."
```

远程 `heroImage` 需要同时填写 `heroImageWidth` 和 `heroImageHeight`。远程图片域名限制为 `PUBLIC_ASSET_BASE_URL` 和 Unsplash。内容中的远程 `OptimizedPicture` 需要显式填写 `width` 和 `height`，使用以下命令检查：

```bash
pnpm images:check
```

## 配置

常用文件：

```text
src/config/site.ts       # 站点名、域名、仓库、首页、统计、x402
src/config/locales.ts    # 语言列表、默认语言、hreflang、文字方向
src/config/taxonomy.ts   # 分类、标签、多语言名称、slug 工具
src/config/pagination.ts # 分页数量
src/config/assets.ts     # 远程图片域名白名单和 URL 优化
src/i18n/*.json          # 界面文案
astro.config.mjs         # Astro 集成和构建级配置
```

`src/config/site.ts` 中的首页布局：

- `cover`：图片封面首页。
- `archive`：紧凑归档首页。
- `text`：文字卡片首页，适合少图内容。

环境变量使用 `PUBLIC_*`，Astro 会把这些值写入客户端构建：

```bash
PUBLIC_SITE_URL=https://example.com
PUBLIC_ASSET_BASE_URL=https://assets.example.com
```

未设置 `PUBLIC_SITE_URL` 时，当前代码回退到 `https://example.com`。

## 设计

`DESIGN.md` 是视觉令牌和 UI 规则来源。生成的 Tailwind v4 令牌文件是 `src/styles/design-theme.css`；实际运行时主题仍在 `src/styles/global.css` 中实现。

```bash
pnpm design:lint
pnpm design:theme
```

修改设计令牌、颜色、字体、间距、圆角、卡片、导航、文章排版或搜索样式后运行以上命令。

## 搜索

Pagefind 由 `src/integrations/pagefind.mjs` 在构建阶段生成。

当前索引范围包含各语言 about 页面和文章详情页。搜索界面在 `src/components/search/PagefindSearch.astro` 中按需加载 `/pagefind/pagefind-ui.js`。

## SEO

`src/layouts/main.astro` 输出 canonical、hreflang、Open Graph、Twitter metadata、JSON-LD 和 content-language。`x-default` 指向中文默认语言。

修改路由、元数据、sitemap、布局或内容 schema 后运行：

```bash
pnpm build
pnpm seo:check
```

## 部署

构建产物位于 `dist`。

```bash
pnpm build
```

Polyglow 可以发布到任意静态托管平台，包括 Cloudflare Pages、Vercel、Netlify、GitHub Pages 或普通 Web 服务器。

项目还保留了可选的 Cloudflare Workers Static Assets 部署方式：

```bash
pnpm deploy
```

`pnpm deploy` 会先执行 `pnpm build`，再运行 `scripts/deploy-worker.mjs` 调用 `wrangler deploy`。部署脚本支持重试：

```bash
WRANGLER_DEPLOY_ATTEMPTS=3
WRANGLER_DEPLOY_RETRY_DELAY_MS=15000
```

修改 Worker 配置后，用以下命令验证打包：

```bash
pnpm build
pnpm exec wrangler deploy --dry-run
```

## Google Tag Manager

Google Tag Manager 默认关闭。开启后，GTM 脚本通过 Partytown 加载。

```bash
PUBLIC_GTM_ENABLED=true
PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Google AdSense

Google AdSense 默认关闭。开启后，共享布局加载官方 async AdSense 脚本。

```bash
PUBLIC_ADSENSE_ENABLED=true
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000
```

## x402

x402 元数据默认关闭。`X402.astro` 是可选组件，默认不挂载到共享布局。它只发布机器可读元数据，不执行 HTTP 402 支付拦截。

```bash
PUBLIC_X402_ENABLED=true
PUBLIC_X402_PAY_TO=YourWalletAddress
PUBLIC_X402_NETWORK=solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp
PUBLIC_X402_PRICE=$0.01
PUBLIC_X402_DESCRIPTION=Voluntary x402 payment support for Polyglow content.
PUBLIC_X402_FACILITATOR_URL=https://your-solana-mainnet-facilitator.example
PUBLIC_X402_CHARGE_MODE=all
PUBLIC_X402_BOT_SCORE_THRESHOLD=30
```

`PUBLIC_X402_CHARGE_MODE` 支持 `all` 和 `bot-only`。

## 反馈

疑问、建议和 bug 反馈请提交到 [GitHub Issues](https://github.com/realriplab/Polyglow/issues)。

## 许可证

MIT。详见 [LICENSE](LICENSE)。
