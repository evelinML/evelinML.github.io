import { describe, expect, it } from "vitest"

import { DEFAULT_LOCALE, LOCALES, getLocaleMeta } from "@/config/locales"
import { canonicalUrl, buildAlternates, localePath } from "@/utils/routes"
import {
  articleJsonLd,
  webPageJsonLd,
  webSiteJsonLd,
} from "@/utils/structured-data"

describe("SEO route helpers", () => {
  it("builds locale-prefixed canonical URLs with trailing slashes", () => {
    expect(localePath("en", "/posts/example")).toBe("/en/posts/example/")
    expect(canonicalUrl("en", "/")).toBe("https://polyglow.realrip.com/en/")
    expect(canonicalUrl("zh", "/category/build/")).toBe(
      "https://polyglow.realrip.com/zh/category/build/"
    )
  })

  it("uses BCP 47 hreflang codes and x-default for alternates", () => {
    const path = "/posts/20150714-agiot/"
    const alternates = buildAlternates(path)

    for (const locale of LOCALES) {
      expect(alternates[getLocaleMeta(locale).hreflang]).toBe(
        canonicalUrl(locale, path)
      )
    }
    expect(alternates["x-default"]).toBe(canonicalUrl(DEFAULT_LOCALE, path))
    expect(Object.keys(alternates)).not.toContain(DEFAULT_LOCALE)
  })
})

describe("structured data language metadata", () => {
  it("uses the same hreflang code in WebSite, WebPage, and Article JSON-LD", () => {
    const language = getLocaleMeta("zh").hreflang

    expect(webSiteJsonLd("zh").inLanguage).toBe(language)
    expect(
      webPageJsonLd({
        lang: "zh",
        path: "/posts/20150714-agiot/",
        title: "Title",
        description: "Description",
      }).inLanguage
    ).toBe(language)
    expect(
      articleJsonLd({
        lang: "zh",
        path: "/posts/20150714-agiot/",
        title: "Title",
        description: "Description",
        image: "/open-graph.webp",
        pubDate: new Date("2024-01-01T00:00:00.000Z"),
        authors: [
          { name: "Polyglow", url: "https://polyglow.realrip.com/zh/author/" },
        ],
      }).inLanguage
    ).toBe(language)
  })
})
