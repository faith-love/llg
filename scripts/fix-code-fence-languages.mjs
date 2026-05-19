import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd())
const ignore = new Set(['.git', '.idea', '.vitepress', '.workbuddy', 'node_modules', 'dist'])
const languageMap = [
  [/^java\s*学习\s*资料$/i, 'java'],
  [/^spring\s*学习\s*资料$/i, 'java'],
  [/^python\s*学习\s*资料$/i, 'python'],
  [/^sql\s*学习\s*资料$/i, 'sql'],
  [/^脚本on$/i, 'json']
]
let changedFiles = 0
let changedFences = 0

function shouldIgnore(name) {
  return name.startsWith('.') || ignore.has(name)
}

function normalizeLanguage(raw) {
  const cleaned = raw.trim().replace(/\s+/g, '')
  for (const [pattern, replacement] of languageMap) {
    if (pattern.test(cleaned)) return replacement
  }
  return null
}

function fixFile(file) {
  const original = fs.readFileSync(file, 'utf8')
  const updated = original.replace(/^```([^`\r\n]*)$/gm, (line, raw) => {
    const replacement = normalizeLanguage(raw)
    if (!replacement) return line
    changedFences += 1
    return `\`\`\`${replacement}`
  })

  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8')
    changedFiles += 1
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (shouldIgnore(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.md')) fixFile(full)
  }
}

walk(root)
console.log(`Fixed ${changedFences} code fences in ${changedFiles} files.`)
