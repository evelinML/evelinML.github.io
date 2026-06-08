import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const themeSwitcherPath = join(
  scriptDir,
  "..",
  "src",
  "components",
  "islands",
  "ThemeSwitcher.astro",
)
const source = readFileSync(themeSwitcherPath, "utf8")

const expectedIcons = {
  light: "sun",
  dark: "moon",
  system: "monitor",
}

const triggerMarkup =
  source.match(
    /<button[\s\S]*?data-dropdown-menu-trigger[\s\S]*?<\/button>/,
  )?.[0] ?? ""

const triggerFailures = Object.entries(expectedIcons).flatMap(
  ([themeValue, icon]) => {
    if (!triggerMarkup.includes(`data-theme-trigger-icon="${themeValue}"`)) {
      return [`Missing ${themeValue} trigger icon state.`]
    }
    if (!triggerMarkup.includes(`<Icon name="${icon}"`)) {
      return [`Expected ${themeValue} trigger state to use ${icon} icon.`]
    }
    return []
  },
)

if (!source.includes("updateThemeTriggerIcon")) {
  triggerFailures.push("Missing trigger icon update logic.")
}

const getOptionMarkup = (themeValue) => {
  const pattern = new RegExp(
    `<button[\\s\\S]*?data-theme-value="${themeValue}"[\\s\\S]*?</button>`,
  )
  return source.match(pattern)?.[0] ?? ""
}

const failures = Object.entries(expectedIcons).flatMap(([themeValue, icon]) => {
  const optionMarkup = getOptionMarkup(themeValue)
  if (!optionMarkup) return [`Missing ${themeValue} theme option.`]
  if (!optionMarkup.includes(`<Icon name="${icon}"`)) {
    return [`Expected ${themeValue} theme option to use ${icon} icon.`]
  }
  return []
})

const allFailures = [...triggerFailures, ...failures]

if (allFailures.length > 0) {
  console.error(allFailures.join("\n"))
  process.exit(1)
}
