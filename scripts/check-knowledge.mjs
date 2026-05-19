import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.cwd())
const ignore = new Set(['.git', '.idea', '.vitepress', '.workbuddy', 'node_modules', 'dist'])
const issues = []
const knownCodeLanguages = new Set([
  'bash',
  'bat',
  'cmd',
  'css',
  'dockerfile',
  'conf',
  'cron',
  'dos',
  'ini',
  'csv',
  'go',
  'html',
  'http',
  'gitignore',
  'java',
  'javascript',
  'js',
  'json',
  'jsp',
  'lua',
  'mysql',
  'md',
  'markdown',
  'mermaid',
  'nginx',
  'powershell',
  'properties',
  'py',
  'python',
  'sh',
  'shell',
  'sql',
  'text',
  'toml',
  'ts',
  'typescript',
  'txt',
  'xml',
  'yaml',
  'yml'
])

function isExternal(link) {
  return /^(https?:|mailto:|#|javascript:|安全HTTP:)/.test(link)
}

function targetExists(currentDir, link) {
  const raw = decodeURIComponent(link.split('#')[0]).trim()
  if (!raw) return true
  const target = path.resolve(currentDir, raw)
  if (fs.existsSync(target)) return true
  if (!path.extname(target) && fs.existsSync(`${target}.md`)) return true
  if (!path.extname(target) && fs.existsSync(path.join(target, '说明.md'))) return true
  if (!path.extname(target) && fs.existsSync(path.join(target, 'README.md'))) return true
  return false
}

function checkCodeFenceLanguages(rel, content) {
  const fences = [...content.matchAll(/^```([^`\r\n]*)$/gm)]
  for (const fence of fences) {
    const raw = fence[1].trim()
    if (!raw) continue

    const lang = raw.split(/\s+/)[0].toLowerCase()
    if (knownCodeLanguages.has(lang)) continue

    const line = content.slice(0, fence.index).split('\n').length
    issues.push({
      file: rel,
      type: 'unknown_code_language',
      detail: `第 ${line} 行代码块语言可能无效: ${raw}`
    })
  }
}

function checkUntranslatedMarkers(rel, content) {
  const matches = [...content.matchAll(/未译\d+/g)]
  for (const match of matches) {
    const line = content.slice(0, match.index).split('\n').length
    issues.push({
      file: rel,
      type: 'untranslated_marker',
      detail: `第 ${line} 行存在未译占位: ${match[0]}`
    })
  }
}

function checkFile(file) {
  const rel = path.relative(root, file)
  const content = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')

  if (!content.trim()) {
    issues.push({ file: rel, type: 'empty', detail: '文件为空' })
    return
  }

  const hasHomeFrontmatter = /^---\n[\s\S]*?\n---\n/.test(content) && /layout:\s*home/.test(content)
  if (!/^#\s+.+/m.test(content) && !hasHomeFrontmatter) {
    issues.push({ file: rel, type: 'missing_h1', detail: '缺少 # 一级标题' })
  }

  checkCodeFenceLanguages(rel, content)
  checkUntranslatedMarkers(rel, content)

  const currentDir = path.dirname(file)
  const sanitized = content.replace(/```[\s\S]*?```/g, '')
  const links = [...sanitized.matchAll(/(?<!!)\[[^\]]*\]\(([^)]+)\)/g)]
    .map((m) => m[1])
    .filter((link) => !isExternal(link))
  for (const link of links) {
    if (!targetExists(currentDir, link)) {
      issues.push({ file: rel, type: 'broken_link', detail: `链接不存在: ${link}` })
    }
  }

  const images = [...sanitized.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)]
    .map((m) => m[1])
    .filter((link) => !/^(https?:|data:)/.test(link))
  for (const img of images) {
    if (!targetExists(currentDir, img)) {
      issues.push({ file: rel, type: 'missing_image', detail: `图片不存在: ${img}` })
    }
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ignore.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.md')) checkFile(full)
  }
}

walk(root)

if (!issues.length) {
  console.log('OK: 未发现明显知识库格式问题。')
  process.exit(0)
}

console.log(`发现 ${issues.length} 个问题：`)
for (const issue of issues) {
  console.log(`- [${issue.type}] ${issue.file} :: ${issue.detail}`)
}
process.exit(1)
