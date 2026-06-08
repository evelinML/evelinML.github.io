import { readFile } from "node:fs/promises"

const files = {
  header: "src/components/ui/Header.astro",
  footer: "src/components/ui/Footer.astro",
  css: "src/styles/global.css",
}

const [header, footer, css] = await Promise.all(
  Object.values(files).map((file) => readFile(file, "utf8"))
)

const logoClassPattern = /class="[^"]*\bsite-logo\b[^"]*"/
const darkLogoRulePattern =
  /\.dark\s+\.site-logo\s*\{[^}]*filter:\s*invert\(1\)\s+brightness\(1\.08\)/s

const failures = []

if (!logoClassPattern.test(header)) {
  failures.push("Header logo is missing the site-logo class.")
}

if (!logoClassPattern.test(footer)) {
  failures.push("Footer logo is missing the site-logo class.")
}

if (!darkLogoRulePattern.test(css)) {
  failures.push("Dark theme CSS is missing the site-logo filter rule.")
}

if (failures.length > 0) {
  console.error(failures.join("\n"))
  process.exit(1)
}

console.log("Logo theme styling is configured for header and footer.")
