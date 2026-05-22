# Polyglow Agent Guide

## Purpose

This file tells coding agents how to work in this repository. Keep engineering
workflow, commands, repository structure, testing, deployment, and contribution
rules here. Keep visual tokens and UI appearance rules in `DESIGN.md`.

Polyglow is an Astro 6 static multilingual editorial blog. The current default
content and routing are Chinese-first, with locale-prefixed public routes and
static deployment output. The repository must remain usable without private
services, databases, Cloudflare credentials, analytics IDs, or payment
credentials.

## Stack

- Astro 6 with `output: "static"` and `trailingSlash: "always"`.
- Tailwind CSS v4 through `@tailwindcss/vite` and CSS-first runtime tokens.
- MDX content collections backed by `astro:content` glob loaders.
- `astro-expressive-code` for code blocks.
- Custom Pagefind integration in `src/integrations/pagefind.mjs`.
- `astro-icon` with a Lucide allowlist configured in `astro.config.mjs`.
- `@astrojs/partytown` for optional Google Tag Manager.
- Optional Google AdSense through `src/components/widgets/Adsense.astro`.
- Optional x402 metadata through `src/components/widgets/X402.astro`.
- Astro image optimization through `OptimizedPicture.astro`, currently using
  AVIF output only.
- Optional Cloudflare Workers Static Assets deployment.
- Vitest for utility tests.

## Required Commands

- Install dependencies: `pnpm install`
- Start development server: `pnpm dev`
- Run tests: `pnpm test`
- Typecheck: `pnpm typecheck`
- Typecheck and build: `pnpm build`
- Preview built site: `pnpm preview`
- Check remote content image dimensions: `pnpm images:check`
- Check generated SEO output after a build: `pnpm seo:check`
- Validate design tokens: `pnpm design:lint`
- Generate Tailwind v4 design theme: `pnpm design:theme`
- Deploy prebuilt static assets to Cloudflare Workers: `pnpm deploy`
- Validate Cloudflare packaging after Worker/config changes:
  `pnpm exec wrangler deploy --dry-run`

Use Node.js 24 or newer and pnpm 11. Do not add npm, yarn, or bun lockfiles.

## Repository Map

- `astro.config.mjs`: Astro static output, i18n, image domains, integrations,
  sitemap, Tailwind, Pagefind, and Lucide icon allowlist.
- `src/pages/`: localized routes, post/category/tag pagination, author, search,
  RSS, robots, and llms endpoints.
- `src/layouts/main.astro`: shared HTML shell, SEO, JSON-LD, header/footer,
  GTM, AdSense, and x402 metadata widgets.
- `src/components/`: cards, layout, navigation, search, islands, widgets, icons,
  and image helpers.
- `src/content/`: localized authors, pages, and posts.
- `src/content.config.ts`: content collection schemas and remote hero image
  validation.
- `src/config/`: site, locale, taxonomy, pagination, and asset configuration.
- `src/i18n/*.json`: visible UI strings for every supported locale.
- `src/integrations/pagefind.mjs`: build-time Pagefind indexing and dev server
  serving for `/pagefind/`.
- `src/styles/global.css`: live Tailwind v4 runtime theme, prose, cards,
  archive, taxonomy, search, and responsive UI CSS.
- `src/styles/design-theme.css`: generated Tailwind v4 `@theme` export from
  `DESIGN.md`; do not edit by hand.
- `scripts/`: SEO, image, sitemap, design export, and deploy helpers.
- `tests/`: unit tests for routing, taxonomy, and content slug utilities.
- `DESIGN.md`: visual design source for tokens and UI appearance.

## Architecture Rules

- Keep the primary site static-first. A plain `pnpm build` must produce a usable
  static site in `dist`.
- Preserve locale-prefixed routes. The current default locale is `zh`, and `/`
  redirects to `/zh/`.
- Preserve Astro `trailingSlash: "always"` behavior.
- Preserve RTL support for Arabic routes.
- Do not make Cloudflare mandatory. The Cloudflare path uploads static assets
  from `dist`; ordinary static hosting must continue to work.
- Do not add database-backed features by default.
- Keep site-wide configuration in `src/config/*` and `astro.config.mjs`; do not
  scatter site constants through components.
- Keep translated UI strings in `src/i18n/*.json`; avoid single-language
  hard-coded visible UI text.
- Google Tag Manager must stay optional. Configure it through
  `SITE_CONFIG.analytics.googleTagManager` and public env vars.
- Google AdSense must stay optional. Configure it through
  `SITE_CONFIG.analytics.googleAdsense` and public env vars.
- x402 metadata must stay opt-in. Keep `src/components/widgets/X402.astro`
  available, but do not mount it in `src/layouts/main.astro` unless explicitly
  requested. Do not add HTTP 402 enforcement or Cloudflare-only middleware
  unless explicitly requested.
- Pagefind indexes generated static HTML through `src/integrations/pagefind.mjs`.
  Preserve the current searchable surface unless the task explicitly changes
  search scope.
- Keep generated surfaces static: RSS, sitemap, robots, llms text files,
  Pagefind output, and Markdown-derived pages must not depend on runtime
  services.

## Content Rules

- Posts live in `src/content/posts/<locale>/`.
- Pages live in `src/content/pages/<locale>/`.
- Authors live in `src/content/authors/<locale>/`.
- Supported locales are `zh en fr es ru ja ko pt de id ar`.
- Use stable slugs and complete frontmatter.
- Post frontmatter uses `authors: ["default"]`, `locale`, `category`, `tags`,
  `heroImage`, and `heroImageAlt`.
- Remote `heroImage` values must include `heroImageWidth` and
  `heroImageHeight`.
- Remote images are limited to the configured asset host and Unsplash hosts.
- Remote `OptimizedPicture` usage in content must include explicit `width` and
  `height`; verify with `pnpm images:check`.
- Keep category and tag slugs canonical through `src/config/taxonomy.ts`.

## UI and Design Workflow

- Read `DESIGN.md` before changing colors, typography, spacing, radii, cards,
  navigation, article prose, search styling, or component appearance.
- For UI changes, run `pnpm design:lint`. The command must finish with 0 errors.
  Review warnings and fix new contrast warnings introduced by the change.
- When editing `DESIGN.md`, run `pnpm design:theme` and keep
  `src/styles/design-theme.css` current.
- Keep the live runtime theme in `src/styles/global.css` unless the task is
  specifically to wire generated design tokens into runtime CSS.
- Use the existing `Icon` component and configured Lucide icon allowlist. Add
  new icons to `astro.config.mjs` before use.
- Keep layouts responsive across mobile, tablet, and desktop.
- Preserve the existing image-led card language, compact archive rows, readable
  article pages, and Pagefind search styling.

## Testing Rules

- Run `pnpm test` after changing utilities, route helpers, taxonomy logic,
  pagination logic, slug normalization, or other test-covered helpers.
- Run `pnpm images:check` after changing content image usage or
  `OptimizedPicture` patterns.
- Run `pnpm build` after changing routes, layouts, components, styles, content
  schemas, Astro config, i18n, scripts, or design-generated CSS.
- Run `pnpm seo:check` after `pnpm build` when changing SEO, routes, canonical
  URLs, hreflang output, layouts, metadata, content schema, or sitemap behavior.
- Run `pnpm exec wrangler deploy --dry-run` after changing `wrangler.jsonc`,
  static asset routing, or Cloudflare deployment behavior.
- Do not report completion until the relevant commands have been run and their
  output has been checked.

## Open-Source Contribution Rules

- Keep defaults safe for forked projects and first-time users.
- Do not commit tokens, local credentials, private database IDs, analytics IDs,
  wallet addresses, or production secrets.
- Document any new environment variable in `.env.example`, `README.md`, and
  `readme-zh.md`.
- Prefer small, focused changes with clear deployment impact.
- Do not leave generated output stale when its source file changes in the same
  task.
- Preserve the MIT license and package metadata unless explicitly asked.

## Pull Request Guidance

- Summarize user-facing behavior and deployment implications.
- Include verification commands that were run.
- For dependency updates, merge only after conflicts are resolved and checks
  pass.
- For Cloudflare changes, state whether ordinary static hosting is affected.
