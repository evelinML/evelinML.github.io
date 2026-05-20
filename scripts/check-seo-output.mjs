import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

const distDir = join(process.cwd(), "dist")
const siteUrl = (
  process.env.PUBLIC_SITE_URL ?? "https://polyglow.realrip.com"
).replace(/\/$/, "")
const localeHreflang = {
  zh: "zh-CN",
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  ru: "ru-RU",
  ja: "ja-JP",
  ko: "ko-KR",
  pt: "pt-PT",
  de: "de-DE",
  id: "id-ID",
  ar: "ar",
}
const locales = Object.keys(localeHreflang)
const hreflangs = new Set([...Object.values(localeHreflang), "x-default"])
const expectedAlternateCount = hreflangs.size
const failures = []

function fail(message) {
  failures.push(message)
}

function walkHtml(dir) {
  const entries = readdirSync(dir)
  return entries.flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return walkHtml(path)
    return entry === "index.html" ? [path] : []
  })
}

function extractAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`, "i"))
  return match?.[1]
}

function htmlPathToUrl(file) {
  const rel = relative(distDir, file).split(sep).join("/")
  const path = rel === "index.html" ? "/" : `/${rel.replace(/index\.html$/, "")}`
  return `${siteUrl}${path}`
}

function htmlPathToLocale(file) {
  const rel = relative(distDir, file).split(sep).join("/")
  const locale = rel.split("/")[0]
  return locales.includes(locale) ? locale : undefined
}

function validateHtml(file) {
  const rel = relative(process.cwd(), file)
  const html = readFileSync(file, "utf8")
  const expectedUrl = htmlPathToUrl(file)
  const locale = htmlPathToLocale(file)
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim()
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+>/i)?.[0]
  const description = html.match(/<meta[^>]+name="description"[^>]+>/i)?.[0]
  const robots = html.match(/<meta[^>]+name="robots"[^>]+>/i)?.[0]
  const contentLanguage = html.match(
    /<meta[^>]+http-equiv="content-language"[^>]+>/i
  )?.[0]
  const noindex = /content="[^"]*noindex/i.test(robots ?? "")
  const alternates = [...html.matchAll(/<link[^>]+rel="alternate"[^>]+>/gi)]
    .map((match) => match[0])
    .map((tag) => ({
      hreflang: extractAttr(tag, "hreflang"),
      href: extractAttr(tag, "href"),
    }))
    .filter((alternate) => alternate.hreflang && alternate.href)

  if (!title) fail(`${rel}: missing <title>`)
  if (!canonical) fail(`${rel}: missing canonical link`)
  if (!robots) fail(`${rel}: missing robots meta`)

  if (!noindex && canonical && extractAttr(canonical, "href") !== expectedUrl) {
    fail(`${rel}: canonical does not match ${expectedUrl}`)
  }

  if (noindex) {
    if (alternates.length > 0) fail(`${rel}: noindex page has hreflang links`)
    return
  }

  if (!description) fail(`${rel}: missing meta description`)
  if (!html.includes('type="application/ld+json"')) {
    fail(`${rel}: missing JSON-LD structured data`)
  }

  if (locale) {
    if (extractAttr(contentLanguage ?? "", "content") !== localeHreflang[locale]) {
      fail(`${rel}: content-language does not match locale`)
    }
    if (alternates.length !== expectedAlternateCount) {
      fail(`${rel}: expected ${expectedAlternateCount} hreflang links`)
    }
    const alternateMap = new Map(
      alternates.map((alternate) => [alternate.hreflang, alternate.href])
    )
    for (const hreflang of hreflangs) {
      if (!alternateMap.has(hreflang)) {
        fail(`${rel}: missing hreflang ${hreflang}`)
      }
    }
    const selfHref = alternateMap.get(localeHreflang[locale])
    if (selfHref !== expectedUrl) {
      fail(`${rel}: hreflang self-reference does not match canonical`)
    }
    const defaultHref = alternateMap.get("x-default")
    if (defaultHref !== alternateMap.get(localeHreflang.en)) {
      fail(`${rel}: x-default does not point to English fallback`)
    }
    for (const href of alternateMap.values()) {
      if (href === `${siteUrl}/`) {
        fail(`${rel}: hreflang points to root redirect URL`)
      }
    }
  }
}

function readSitemapXml() {
  const indexPath = join(distDir, "sitemap-index.xml")
  if (!existsSync(indexPath)) {
    fail("dist/sitemap-index.xml: missing sitemap index")
    return ""
  }
  const indexXml = readFileSync(indexPath, "utf8")
  const sitemapUrls = [...indexXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1]
  )
  const xml = sitemapUrls
    .map((url) => {
      const file = join(distDir, new URL(url).pathname.slice(1))
      if (!existsSync(file)) {
        fail(`${relative(process.cwd(), file)}: sitemap file is missing`)
        return ""
      }
      return readFileSync(file, "utf8")
    })
    .join("\n")

  if (!indexXml.includes(`${siteUrl}/sitemap-0.xml`)) {
    fail("dist/sitemap-index.xml: sitemap URLs do not use configured site URL")
  }

  return xml
}

function validateSitemap() {
  const xml = readSitemapXml()
  if (!xml) return

  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(
    (match) => match[1]
  )
  const locs = new Set()

  for (const block of urls) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]
    if (!loc) {
      fail("sitemap: url entry missing loc")
      continue
    }
    locs.add(loc)
    if (loc === `${siteUrl}/`) fail("sitemap: root redirect URL is indexable")
    if (loc.includes("/search/")) fail(`sitemap: search page listed: ${loc}`)
    if (loc.includes("/404/")) fail(`sitemap: 404 page listed: ${loc}`)

    const links = [...block.matchAll(/<xhtml:link[^>]+>/g)].map((match) => {
      const tag = match[0]
      return {
        hreflang: extractAttr(tag, "hreflang"),
        href: extractAttr(tag, "href"),
      }
    })

    if (links.length === 0) continue

    const seen = new Set()
    const map = new Map()
    for (const link of links) {
      if (!link.hreflang || !link.href) {
        fail(`sitemap: malformed hreflang link for ${loc}`)
        continue
      }
      if (seen.has(link.hreflang)) {
        fail(`sitemap: duplicate hreflang ${link.hreflang} for ${loc}`)
      }
      seen.add(link.hreflang)
      map.set(link.hreflang, link.href)
      if (link.href === `${siteUrl}/`) {
        fail(`sitemap: hreflang points to root redirect URL for ${loc}`)
      }
    }

    if (!map.has("x-default")) {
      fail(`sitemap: missing x-default for ${loc}`)
    }
    if (![...map.values()].includes(loc)) {
      fail(`sitemap: loc is not present in its hreflang cluster: ${loc}`)
    }
    if (map.get("x-default") !== map.get(localeHreflang.en)) {
      fail(`sitemap: x-default does not match English URL for ${loc}`)
    }
  }

  for (const file of walkHtml(distDir)) {
    const html = readFileSync(file, "utf8")
    const robots = html.match(/<meta[^>]+name="robots"[^>]+>/i)?.[0]
    const noindex = /content="[^"]*noindex/i.test(robots ?? "")
    const url = htmlPathToUrl(file)
    if (!noindex && !locs.has(url)) {
      fail(`${relative(process.cwd(), file)}: indexable page missing from sitemap`)
    }
    if (noindex && locs.has(url)) {
      fail(`${relative(process.cwd(), file)}: noindex page present in sitemap`)
    }
  }
}

if (!existsSync(distDir)) {
  throw new Error("dist directory does not exist. Run pnpm build first.")
}

for (const file of walkHtml(distDir)) validateHtml(file)
validateSitemap()

if (failures.length > 0) {
  console.error(`SEO output check failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log("SEO output check passed.")
