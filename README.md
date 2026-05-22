# Polyglow

[中文说明](readme-zh.md)

Polyglow is a static Astro 6 blog for multilingual editorial publishing. The
current codebase ships a Chinese-first site with locale-prefixed routes,
content collections, category and tag archives, author pages, Pagefind search,
RSS, sitemap output, SEO metadata, structured data, optimized images,
light/dark themes, and optional static deployment to Cloudflare Workers.

The site does not require a database or private service for ordinary static
hosting.

## Requirements

- Node.js 24 or newer
- pnpm 11

## Start

```bash
pnpm install
pnpm dev
```

Astro prints the local URL. The default public entry redirects from `/` to the
Chinese locale:

```text
http://localhost:4321/zh/
```

## Commands

```bash
pnpm dev           # Start local development
pnpm typecheck     # Run astro check
pnpm test          # Run Vitest utility tests
pnpm build         # Typecheck, build static output, format sitemap XML
pnpm preview       # Preview the built site locally
pnpm images:check  # Check remote OptimizedPicture width/height usage
pnpm seo:check     # Check generated HTML SEO output after pnpm build
pnpm design:lint   # Validate DESIGN.md
pnpm design:theme  # Generate src/styles/design-theme.css
pnpm deploy        # Build, then deploy dist with Wrangler
```

## Project Structure

```text
astro.config.mjs             # Astro, i18n, image, sitemap, integration config
src/config/                  # Site, locale, taxonomy, pagination, assets
src/content/                 # Authors, pages, posts
src/pages/                   # Localized routes and generated endpoints
src/layouts/main.astro       # Shared shell, SEO, widgets, header/footer
src/components/              # Cards, layout, nav, search, widgets, icons
src/integrations/pagefind.mjs # Custom Pagefind build/dev integration
src/styles/global.css        # Runtime Tailwind v4 theme and component CSS
src/styles/design-theme.css  # Generated tokens from DESIGN.md
scripts/                     # Build checks, sitemap, design export, deploy
tests/                       # Vitest utility tests
```

## Routes and Locales

Configured locales:

```text
zh en fr es ru ja ko pt de id ar
```

`zh` is the default locale. Public pages are locale-prefixed and keep trailing
slashes:

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

Arabic routes use RTL layout through locale metadata.

## Write Content

Content lives in `src/content`:

```text
src/content/
  authors/<locale>/
  pages/<locale>/
  posts/<locale>/
```

Post example:

```text
src/content/posts/zh/my-post.mdx
src/content/posts/en/my-post.mdx
```

Post frontmatter:

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

Optional SEO fields:

```yaml
seoTitle: "Custom title"
seoDescription: "Custom meta description."
canonical: "https://example.com/original/"
heroBlurDataURL: "data:image/..."
```

Remote `heroImage` values must include `heroImageWidth` and
`heroImageHeight`. Remote image hosts are limited to `PUBLIC_ASSET_BASE_URL`,
and Unsplash. Remote `OptimizedPicture` usage in content must include explicit
`width` and `height`; verify with:

```bash
pnpm images:check
```

## Configure

Common files:

```text
src/config/site.ts       # Site name, URL, repository, homepage, analytics, x402
src/config/locales.ts    # Locale list, default locale, hreflang, direction
src/config/taxonomy.ts   # Categories, tags, localized labels, slug helpers
src/config/pagination.ts # Page sizes
src/config/assets.ts     # Remote image host allowlist and URL optimization
src/i18n/*.json          # Interface text
astro.config.mjs         # Astro integrations and build-level config
```

Homepage layouts in `src/config/site.ts`:

- `cover`: image-led homepage.
- `archive`: compact archive-first homepage.
- `text`: text-card homepage for low-image publishing.

Environment variables are public because Astro embeds `PUBLIC_*` values in the
client build:

```bash
PUBLIC_SITE_URL=https://example.com
PUBLIC_ASSET_BASE_URL=https://assets.example.com
```

When `PUBLIC_SITE_URL` is not set, the current code falls back to
`https://example.com`.

## Design

`DESIGN.md` is the source for visual tokens and UI rules. The generated
Tailwind v4 token file is `src/styles/design-theme.css`; the live runtime theme
is still implemented in `src/styles/global.css`.

```bash
pnpm design:lint
pnpm design:theme
```

Run these commands after changing design tokens, colors, typography, spacing,
radii, card treatments, navigation, article prose, or search styling.

## Search

Pagefind is generated at build time by `src/integrations/pagefind.mjs`.

The current index covers localized about pages and post detail pages. The search
UI loads `/pagefind/pagefind-ui.js` lazily from
`src/components/search/PagefindSearch.astro`.

## SEO

`src/layouts/main.astro` renders canonical URLs, hreflang alternates, Open
Graph, Twitter metadata, JSON-LD, and content language metadata. `x-default`
points to the Chinese locale.

After route, metadata, sitemap, layout, or content schema changes:

```bash
pnpm build
pnpm seo:check
```

## Deploy

The build output is `dist`.

```bash
pnpm build
```

Polyglow can be published to any static host, including Cloudflare Pages,
Vercel, Netlify, GitHub Pages, or a plain web server.

The repository also includes an optional Cloudflare Workers Static Assets path:

```bash
pnpm deploy
```

`pnpm deploy` runs `pnpm build`, then `scripts/deploy-worker.mjs`, which calls
`wrangler deploy` with retry support. Useful retry variables:

```bash
WRANGLER_DEPLOY_ATTEMPTS=3
WRANGLER_DEPLOY_RETRY_DELAY_MS=15000
```

After Worker config changes, validate packaging with:

```bash
pnpm build
pnpm exec wrangler deploy --dry-run
```

## Google Tag Manager

Google Tag Manager is optional and disabled by default. When enabled, the GTM
script is loaded through Partytown.

```bash
PUBLIC_GTM_ENABLED=true
PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Google AdSense

Google AdSense is optional and disabled by default. When enabled, the shared
layout loads the official async AdSense script.

```bash
PUBLIC_ADSENSE_ENABLED=true
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000
```

## x402

x402 metadata is optional and disabled by default. `X402.astro` is available as
an opt-in widget and is not mounted in the shared layout by default. It
publishes machine-readable metadata only; it does not enforce HTTP 402 payment.

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

`PUBLIC_X402_CHARGE_MODE` accepts `all` or `bot-only`.

## Feedback

Questions, ideas, and bug reports go to
[GitHub Issues](https://github.com/realriplab/Polyglow/issues).

## License

MIT. See [LICENSE](LICENSE).
