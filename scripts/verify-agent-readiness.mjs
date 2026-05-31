import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import assert from "node:assert/strict"

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
}

function readJson(path) {
  return JSON.parse(read(path))
}

const robotsSource = read("src/pages/robots.txt.ts")
assert.match(robotsSource, /sitemap-index\.xml/, "robots.txt must advertise sitemap-index.xml")

const siteConfigSource = read("src/config/site.ts")
assert.match(
  siteConfigSource,
  /https:\/\/polyglow\.realrip\.com/,
  "default SITE_CONFIG.url must match the production domain"
)

const astroConfigSource = read("astro.config.mjs")
assert.match(
  astroConfigSource,
  /https:\/\/polyglow\.realrip\.com/,
  "default Astro site must match the production domain"
)

const agentMarkdownSource = read("src/utils/agent-markdown.ts")
assert.match(agentMarkdownSource, /sitemap-index\.xml/, "llms files must advertise sitemap-index.xml")

const headers = read("public/_headers")
assert.match(headers, /<\/llms\.txt>;\s*rel="service-doc"/, "_headers must link llms.txt")
assert.match(headers, /<\/llms-full\.txt>;\s*rel="service-doc"/, "_headers must link llms-full.txt")
assert.match(
  headers,
  /<\/\.well-known\/agent-skills\/index\.json>;\s*rel="service-desc"/,
  "_headers must link the agent skills index"
)

const skill = read("public/.well-known/agent-skills/polyglow-content/SKILL.md")
const skillDigest = createHash("sha256").update(skill).digest("hex")
const skillsIndex = readJson("public/.well-known/agent-skills/index.json")
assert.equal(skillsIndex.$schema, "https://agentskills.io/schemas/skills-index/v0.2.0.json")
assert.ok(Array.isArray(skillsIndex.skills), "skills index must contain a skills array")
assert.ok(
  skillsIndex.skills.some(
    (entry) =>
      entry.name === "polyglow-content" &&
      entry.type === "skill-md" &&
      entry.sha256 === skillDigest
  ),
  "skills index must reference polyglow-content with the correct sha256"
)

const mcpCard = readJson("public/.well-known/mcp/server-card.json")
assert.equal(mcpCard.serverInfo.name, "Polyglow Content")
assert.equal(mcpCard.transport.type, "none")

const agentCard = readJson("public/.well-known/agent-card.json")
assert.equal(agentCard.name, "Polyglow Content")
assert.ok(Array.isArray(agentCard.skills), "agent card must expose skills")

console.log("Agent readiness source checks passed.")
