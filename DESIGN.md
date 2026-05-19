---
version: "alpha"
name: "Polyglow"
description: "A multilingual editorial Astro theme with neutral surfaces, glassmorphism image cards, compact archives, dark mode, and generous long-form typography."
colors:
  background: "#FFFFFF"
  foreground: "#18181B"
  card: "#FFFFFF"
  cardForeground: "#18181B"
  popover: "#FFFFFF"
  popoverForeground: "#18181B"
  primary: "#27272A"
  primaryForeground: "#FAFAFA"
  secondary: "#F4F4F5"
  secondaryForeground: "#27272A"
  muted: "#F4F4F5"
  mutedForeground: "#71717A"
  accent: "#F4F4F5"
  accentForeground: "#27272A"
  destructive: "#DC2626"
  border: "#E4E4E7"
  input: "#E4E4E7"
  ring: "#A1A1AA"
  darkBackground: "#18181B"
  darkForeground: "#FAFAFA"
  darkCard: "#27272A"
  darkPopover: "#27272A"
  darkPrimary: "#E4E4E7"
  darkPrimaryForeground: "#27272A"
  darkSecondary: "#3F3F46"
  darkSecondaryForeground: "#FAFAFA"
  darkMuted: "#3F3F46"
  darkMutedForeground: "#A1A1AA"
  darkAccent: "#3F3F46"
  darkAccentForeground: "#FAFAFA"
  darkBorder: "#FFFFFF"
  darkInput: "#FFFFFF"
  darkRing: "#71717A"
  glassOverlay: "#000000"
  glassOverlayStrong: "#262626"
  glassBorder: "#FFFFFF"
  glassSurfaceLight: "#FFFFFF"
typography:
  sans:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "0px"
  heading:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: "1.15"
    letterSpacing: "0px"
  heroTitle:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: "1.05"
    letterSpacing: "0px"
  articleBody:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "2rem"
    letterSpacing: "0px"
  nav:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25"
    letterSpacing: "0px"
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: "1.25"
    letterSpacing: "0.025em"
  small:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1.5"
    letterSpacing: "0px"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  card: "24px"
  hero: "28px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  page-x: "16px"
  page-x-sm: "20px"
  page-x-md: "24px"
  section-y: "40px"
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.sans}"
  page-dark:
    backgroundColor: "{colors.darkBackground}"
    textColor: "{colors.darkForeground}"
    typography: "{typography.sans}"
  post-card:
    backgroundColor: "{colors.glassOverlay}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.card}"
    padding: "{spacing.md}"
  article-hero-panel:
    backgroundColor: "{colors.glassOverlayStrong}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  text-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.cardForeground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  taxonomy-card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  nav-link:
    textColor: "{colors.mutedForeground}"
    typography: "{typography.nav}"
  primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
  secondary-button:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
  search-input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md}"
  meta-pill:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm}"
  glass-meta-pill:
    backgroundColor: "{colors.glassOverlayStrong}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm}"
  destructive-button:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
---

## Overview

Polyglow is an editorial publishing interface for multilingual long-form
writing. The visual system is already implemented in `src/styles/global.css`.
This file records that implementation as design tokens and guidance so future
UI work can preserve the existing theme.

The current UI is neutral, image-led, compact, and content-first. It uses
glass panels over imagery, quiet navigation, strong article readability, and
small metadata treatments.

## Theme Model

The live theme uses Tailwind v4 CSS variables. `global.css` maps Tailwind token
namespaces to semantic variables, then changes the actual values through
`:root` and `.dark`.

`DESIGN.md` stores sRGB approximations of the current OKLCH runtime tokens so
the design system can be exported into Tailwind-compatible token files. The
generated CSS is a token reference; it does not replace the runtime dark-mode
variables by itself.

## Color System

The palette is a neutral publishing palette:

- `background` and `foreground` define the main reading surface.
- `card`, `popover`, `secondary`, `muted`, and `accent` are neutral surfaces for
  cards, dropdowns, hover states, chips, and low-emphasis UI.
- `primary` and `primaryForeground` define high-emphasis actions and inverted
  text.
- `border`, `input`, and `ring` define structure and focus affordances.
- `destructive` is reserved for destructive or error states.
- `glassOverlay`, `glassOverlayStrong`, `glassBorder`, and `glassSurfaceLight`
  support image-card panels, header glass, dropdowns, and mobile navigation.

Dark-mode colors mirror the same neutral hierarchy with darker surfaces and
lighter text. Use dark tokens only as design references; runtime switching stays
in CSS.

## Typography

The project uses the system sans stack throughout. This keeps startup fast,
supports all configured locales, and avoids external font loading.

Article body text uses `1rem` type with `2rem` line height. Headlines are strong
and compact. Navigation and metadata are smaller, with normal or slight positive
tracking only where the existing UI already uses uppercase labels.

Do not use viewport-scaled font sizes. Do not use negative letter spacing.

## Layout

The standard page frame is `max-w-6xl` with responsive horizontal padding:
16px on mobile, 20px on small screens, and 24px on medium screens.

Article prose centers at `max-w-3xl`. Article media stays within the article
content width unless the existing page template intentionally gives it a wider
surface. Archive, taxonomy, and search pages favor dense scanning and compact
rows over large promotional sections.

## Cards and Glass

Post cover cards use full-bleed imagery with a gradient and a glass content
panel. The glass panel uses dark translucent backgrounds, subtle white borders,
blur, and restrained shadow. Header, dropdown, and mobile navigation use the
same glass language.

Text cards and taxonomy cards stay quiet: neutral background, small radius,
thin border, and modest hover movement.

Do not create cards inside cards. Do not turn full page sections into floating
cards.

## Shapes

The base runtime radius is 10px. Small controls use 6px, standard buttons and
dropdown items use 8px, regular cards use 10px to 14px, image cards use 24px to
28px, and metadata chips use fully rounded pills.

## Component Guidance

- **Header and nav:** compact height, glass background, understated links, no
  marketing-style hero navigation.
- **Post cards:** image-first with readable glass panels and real imagery.
- **Article page:** hero image, compact metadata, centered readable prose.
- **Archive list:** dense rows, tabular dates, no oversized cards.
- **Search:** Pagefind controls follow background, foreground, border, ring,
  and radius tokens.
- **Page view counter:** project eye icon plus numeric value only.
- **Icons:** use the project icon component and configured Lucide icons.

## Visual Constraints

- Keep UI text inside its container at mobile, tablet, and desktop sizes.
- Preserve multilingual and RTL layout behavior.
- Preserve real image-led surfaces for post cards and article heroes.
- Avoid decorative background blobs, one-note color palettes, and nested cards.
- Avoid visible UI text that explains implementation details.
