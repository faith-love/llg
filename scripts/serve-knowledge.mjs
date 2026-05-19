import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const bundledModules = 'C:/Users/戴恩光/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'
const { marked } = await import(pathToFileURL(path.join(bundledModules, 'marked/lib/marked.esm.js')).href)

const hidden = new Set(['.git', '.idea', '.vitepress', '.workbuddy', 'node_modules', 'dist', '.npm-cache', '.tools', 'scripts'])
const sections = [
  'Java学习资料',
  'Spring学习资料',
  'Python学习资料',
  'SQL学习资料',
  'Linux学习资料',
  'Redis学习资料'
]

const sectionMeta = {
  Java学习资料: ['Java', '基础、JVM、并发、Web 与项目复盘'],
  Spring学习资料: ['Spring', 'Spring Framework、Boot、安全、事务与微服务'],
  Python学习资料: ['Python', '脚本、Web API、数据处理与工程化'],
  SQL学习资料: ['SQL', 'MySQL 语法参考与数据库设计方法论'],
  Linux学习资料: ['Linux', '运维、部署、网络、权限、日志与排障'],
  Redis学习资料: ['Redis', '知识库、命令速查、实战案例与故障复盘']
}

function exists(file) {
  try {
    return fs.existsSync(file)
  } catch {
    return false
  }
}

function readTitle(file) {
  try {
    const content = fs.readFileSync(file, 'utf8')
    const match = content.match(/^#\s+(.+)$/m)
    return match?.[1]?.trim() || path.parse(file).name
  } catch {
    return path.parse(file).name
  }
}

function isInsideRoot(target) {
  const relative = path.relative(root, target)
  return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative)
}

function routeToFile(route) {
  const clean = decodeURIComponent(route.split('?')[0]).replace(/^\/+/, '')
  const candidates = []

  if (!clean) {
    candidates.push(path.join(root, 'index.md'))
  } else {
    candidates.push(path.join(root, `${clean}.md`))
    candidates.push(path.join(root, clean, '说明.md'))
    candidates.push(path.join(root, clean, 'README.md'))
    candidates.push(path.join(root, clean, 'index.md'))
  }

  return candidates.find((candidate) => exists(candidate) && isInsideRoot(candidate))
}

function linkFor(file) {
  return '/' + path.relative(root, file).replace(/\\/g, '/').replace(/\.md$/, '')
}

function sortEntries(entries) {
  return entries.sort((a, b) => {
    if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1
    const rank = (name) => name === '说明.md' || name === 'README.md' ? '00' : name
    return rank(a.name).localeCompare(rank(b.name), 'zh-Hans-CN', {
      numeric: true,
      sensitivity: 'base'
    })
  })
}

function listItems(dir, depth = 0) {
  if (depth > 3 || !exists(dir)) return ''

  const entries = sortEntries(fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !hidden.has(entry.name) && !entry.name.startsWith('.'))
    .filter((entry) => entry.isDirectory() || entry.name.endsWith('.md')))

  return entries.map((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const index = ['说明.md', 'README.md', 'index.md']
        .map((name) => path.join(full, name))
        .find(exists)
      const text = index ? readTitle(index) : entry.name
      const nested = listItems(full, depth + 1)
      const href = index ? linkFor(index) : '#'
      const level = depth > 0 ? ' nested' : ''
      return `<li class="nav-item${level}"><a href="${href}">${escapeHtml(text)}</a>${nested ? `<ul>${nested}</ul>` : ''}</li>`
    }

    return `<li class="nav-item leaf"><a href="${linkFor(full)}">${escapeHtml(readTitle(full))}</a></li>`
  }).join('')
}

function renderTopNav() {
  return sections.map((section) => {
    const [label] = sectionMeta[section]
    return `<a href="/${encodeURIComponent(section)}/说明">${escapeHtml(label)}</a>`
  }).join('')
}

function renderSidebar() {
  return sections.map((section) => {
    const dir = path.join(root, section)
    const intro = path.join(dir, '说明.md')
    const [label] = sectionMeta[section]
    const title = exists(intro) ? readTitle(intro) : label
    return `<section class="side-section">
      <h3><a href="/${encodeURIComponent(section)}/说明">${escapeHtml(title)}</a></h3>
      <ul>${listItems(dir)}</ul>
    </section>`
  }).join('')
}

function extractHeadings(content) {
  return content
    .split('\n')
    .filter((line) => /^#{2,3}\s+/.test(line))
    .map((line) => {
      const level = line.match(/^#+/)?.[0].length ?? 2
      const text = line.replace(/^#{2,3}\s+/, '').trim()
      return { level, text }
    })
}

function renderToc(content) {
  const headings = extractHeadings(content)
  if (!headings.length) return ''

  return `<aside class="toc">
    <div class="toc-title">页面导航</div>
    ${headings.map((heading) => {
      const indent = heading.level === 3 ? ' toc-sub' : ''
      return `<a class="toc-item${indent}" href="#${slugify(heading.text)}">${escapeHtml(heading.text)}</a>`
    }).join('')}
  </aside>`
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'section'
}

function renderHomeEnhancement(file) {
  if (path.basename(file) !== 'index.md') return ''

  const cards = sections.map((section) => {
    const [label, desc] = sectionMeta[section]
    return `<a class="feature-card" href="/${encodeURIComponent(section)}/说明">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(desc)}</strong>
    </a>`
  }).join('')

  return `<div class="vp-hero">
    <div class="hero-copy">
      <p class="eyebrow">D:\\learn Knowledge Base</p>
      <h1>本地知识库<br>静态站点生成器</h1>
      <p class="tagline">将 Java、Spring、Python、SQL、Linux、Redis 文档变成优雅的可浏览知识站。</p>
      <div class="hero-actions">
        <a class="primary" href="/说明">开始阅读</a>
        <a class="secondary" href="/Redis学习资料/Redis知识库/说明">Redis 知识库</a>
      </div>
    </div>
    <div class="hero-visual" aria-hidden="true">
      <div class="glow blue"></div>
      <div class="glow purple"></div>
      <div class="doc-card">
        <div class="doc-logo">L</div>
        <div class="doc-lines">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="md-badge">MD</div>
      </div>
    </div>
  </div>
  <div class="feature-grid">${cards}</div>`
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function rewriteLinks(html, currentFile) {
  return html.replace(/href="([^"]+\.md(?:#[^"]*)?)"/g, (_all, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return `href="${href}"`
    const [raw, hash = ''] = href.split('#')
    const target = path.resolve(path.dirname(currentFile), raw)
    if (!isInsideRoot(target)) return `href="${href}"`
    return `href="${linkFor(target)}${hash ? `#${hash}` : ''}"`
  })
}

function renderPage(content, currentFile) {
  const isHome = path.basename(currentFile) === 'index.md'
  const rawHtml = marked.parse(content)
  const body = rewriteLinks(rawHtml, currentFile).replace(/<(h[2-3])>(.*?)<\/\1>/g, (match, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, '')
    return `<${tag} id="${slugify(text)}">${inner}</${tag}>`
  })
  const home = renderHomeEnhancement(currentFile)
  const toc = isHome ? '' : renderToc(content)
  const sidebar = isHome
    ? ''
    : `<aside class="sidebar">
      <a class="overview" href="/说明">总索引</a>
      ${renderSidebar()}
    </aside>`
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>D:\\learn 知识库</title>
  <style>${styles}</style>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/"><span class="brand-mark">L</span><span>D:\\learn</span></a>
    <div class="search"><span class="search-icon">⌕</span><span>搜索</span><kbd>Ctrl K</kbd></div>
    <nav>${renderTopNav()}</nav>
  </header>
  <div class="layout ${isHome ? 'home-layout' : 'doc-layout'}">
    ${sidebar}
    <main class="content">
      ${home}
      <article class="doc ${isHome ? 'home-doc' : ''}">${isHome ? '' : body}</article>
    </main>
    ${toc}
  </div>
</body>
</html>`
}

const styles = `
:root {
  --vp-c-bg: #1e1e20;
  --vp-c-bg-soft: #2a2a2e;
  --vp-c-bg-alt: #19191c;
  --vp-c-divider: rgba(255, 255, 255, .09);
  --vp-c-text-1: rgba(255, 255, 245, .92);
  --vp-c-text-2: rgba(235, 235, 245, .72);
  --vp-c-text-3: rgba(235, 235, 245, .48);
  --vp-c-brand-1: #8b5cf6;
  --vp-c-brand-2: #38bdf8;
  --vp-c-brand-soft: rgba(92, 118, 255, .14);
  --vp-shadow-1: 0 8px 28px rgba(0, 0, 0, .35);
  font-family: Inter, "Segoe UI", "Microsoft YaHei", sans-serif;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background:
    radial-gradient(circle at 70% 18%, rgba(59, 130, 246, .22), transparent 24%),
    radial-gradient(circle at 79% 28%, rgba(168, 85, 247, .17), transparent 18%),
    var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 16px;
  line-height: 1.7;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 96px;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 18px;
  padding: 0 24px 0 32px;
  background: rgba(24, 24, 27, .92);
  border-bottom: 1px solid var(--vp-c-divider);
  backdrop-filter: blur(14px);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--vp-c-text-1);
  font-size: 19px;
  font-weight: 800;
}
.brand-mark {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, #60a5fa, #a855f7);
  color: #fff;
  font-weight: 900;
  box-shadow: 0 0 0 1px rgba(255,255,255,.08);
}
.search {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 220px;
  height: 48px;
  padding: 0 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: rgba(255,255,255,.04);
  color: var(--vp-c-text-3);
  font-size: 14px;
}
.search kbd {
  margin-left: auto;
  padding: 2px 7px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: rgba(255,255,255,.03);
  color: var(--vp-c-text-3);
  font: inherit;
}
.topbar nav {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 14px;
}
.topbar nav a {
  color: var(--vp-c-text-1);
  opacity: .92;
}
a {
  color: inherit;
  text-decoration: none;
}
.layout {
  min-height: calc(100vh - 96px);
}
.doc-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 240px;
}
.home-layout {
  display: block;
}
.home-layout .content {
  max-width: 1650px;
  margin: 0 auto;
  padding: 0 10vw 96px;
}
.home-layout .doc {
  display: none;
}
.sidebar {
  position: sticky;
  top: 96px;
  align-self: start;
  height: calc(100vh - 96px);
  overflow: auto;
  padding: 24px 18px 56px 28px;
  border-right: 1px solid var(--vp-c-divider);
  background: #151518;
}
.overview {
  display: block;
  padding: 8px 0 18px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  font-weight: 700;
  font-size: 15px;
}
.side-section { margin-top: 18px; }
.side-section h3 {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.4;
  color: var(--vp-c-text-1);
}
.side-section h3 a { color: var(--vp-c-text-1); }
.sidebar ul { list-style: none; padding-left: 0; margin: 0; }
.sidebar li { margin: 2px 0; }
.sidebar li ul {
  margin: 4px 0 8px 10px;
  padding-left: 12px;
  border-left: 1px solid rgba(255,255,255,.08);
}
.sidebar a {
  display: block;
  padding: 5px 8px;
  border-radius: 7px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.45;
}
.sidebar a:hover {
  color: var(--vp-c-text-1);
  background: rgba(255,255,255,.05);
}
.nav-item.leaf a { color: var(--vp-c-text-3); }
.content {
  width: 100%;
  max-width: 1100px;
  padding: 26px 48px 96px;
  margin: 0 auto;
}
.doc {
  max-width: 760px;
}
.vp-hero {
  position: relative;
  min-height: 620px;
  padding: 96px 0 64px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, .9fr);
  align-items: center;
  gap: 24px;
}
.vp-hero::before {
  content: '';
  position: absolute;
  inset: 22px 0 auto auto;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56,189,248,.36), rgba(139,92,246,.26), transparent 70%);
  filter: blur(12px);
  pointer-events: none;
}
.hero-copy {
  position: relative;
  z-index: 2;
}
.vp-hero h1 {
  position: relative;
  max-width: 760px;
  margin: 0;
  font-size: clamp(56px, 6vw, 78px);
  line-height: .95;
  letter-spacing: -0.02em;
  font-weight: 900;
  background: linear-gradient(90deg, #8ec5ff, #a855f7 45%, #d946ef 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.eyebrow {
  margin: 0 0 22px;
  color: #c4b5fd;
  font-size: 17px;
  font-weight: 800;
}
.tagline {
  max-width: 680px;
  margin: 24px 0 0;
  color: var(--vp-c-text-2);
  font-size: 22px;
}
.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 34px;
}
.hero-actions a {
  display: inline-flex;
  align-items: center;
  height: 46px;
  padding: 0 20px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
}
.hero-actions .primary {
  background: #4f7cff;
  color: white;
  box-shadow: 0 12px 28px rgba(79,124,255,.28);
}
.hero-actions .secondary {
  background: rgba(255,255,255,.08);
  color: var(--vp-c-text-1);
  border: 1px solid rgba(255,255,255,.08);
}
.hero-visual {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 430px;
}
.glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(30px);
  opacity: .85;
}
.glow.blue {
  width: 360px;
  height: 360px;
  background: rgba(56, 189, 248, .32);
  transform: translate(-70px, -20px);
}
.glow.purple {
  width: 420px;
  height: 420px;
  background: rgba(168, 85, 247, .32);
  transform: translate(60px, 50px);
}
.doc-card {
  position: relative;
  width: 270px;
  height: 340px;
  padding: 34px 28px;
  border-radius: 28px;
  background: #fff;
  border: 18px solid #7c6cff;
  box-shadow:
    -42px 34px 0 rgba(40, 53, 90, .48),
    0 36px 90px rgba(124, 108, 255, .45);
  transform: rotate(-8deg);
}
.doc-logo {
  width: 86px;
  height: 86px;
  margin: 4px auto 34px;
  display: grid;
  place-items: center;
  color: #7c3aed;
  font-size: 54px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, #38bdf8, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
}
.doc-lines span {
  display: block;
  height: 14px;
  margin: 16px auto;
  border-radius: 999px;
  background: linear-gradient(90deg, #60a5fa, #a855f7);
}
.doc-lines span:nth-child(1) { width: 150px; }
.doc-lines span:nth-child(2) { width: 115px; }
.doc-lines span:nth-child(3) { width: 138px; }
.md-badge {
  position: absolute;
  left: 48px;
  bottom: 34px;
  min-width: 150px;
  height: 66px;
  display: grid;
  place-items: center;
  border: 8px solid #7c6cff;
  border-radius: 12px;
  color: #7c6cff;
  font-size: 34px;
  font-weight: 900;
}
.feature-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin: 0 auto;
  max-width: 1180px;
}
.feature-card {
  min-height: 178px;
  padding: 28px;
  border-radius: 18px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.05);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.02);
}
.feature-card:hover {
  background: rgba(255,255,255,.05);
  border-color: rgba(255,255,255,.1);
  box-shadow: var(--vp-shadow-1);
}
.feature-card span {
  display: block;
  margin-bottom: 14px;
  color: #c4b5fd;
  font-size: 15px;
  font-weight: 800;
}
.feature-card strong {
  display: block;
  color: var(--vp-c-text-1);
  font-size: 17px;
  line-height: 1.6;
}
.doc h1 {
  margin: 18px 0 24px;
  font-size: 38px;
  line-height: 1.18;
}
.doc h2 {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 25px;
}
.doc h3 { margin-top: 28px; font-size: 19px; }
.doc p, .doc li { color: var(--vp-c-text-2); }
.doc strong { color: var(--vp-c-text-1); }
.doc code {
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(255,255,255,.08);
  color: #e9d5ff;
  font-family: "Cascadia Code", Consolas, monospace;
  font-size: .92em;
}
.doc pre {
  overflow: auto;
  padding: 18px 20px;
  border-radius: 14px;
  background: #111827;
  border: 1px solid rgba(255,255,255,.08);
}
.doc pre code {
  padding: 0;
  background: transparent;
  color: #d1d5db;
}
.doc table {
  display: block;
  width: 100%;
  overflow: auto;
  border-collapse: collapse;
  margin: 18px 0;
}
.doc th, .doc td {
  border: 1px solid var(--vp-c-divider);
  padding: 9px 12px;
  vertical-align: top;
}
.doc th {
  background: rgba(255,255,255,.04);
  color: var(--vp-c-text-1);
}
.toc {
  position: sticky;
  top: 112px;
  align-self: start;
  height: calc(100vh - 128px);
  overflow: auto;
  padding: 32px 24px 48px 18px;
  border-left: 1px solid var(--vp-c-divider);
}
.toc-title {
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 800;
}
.toc-item {
  display: block;
  padding: 8px 0;
  color: var(--vp-c-text-3);
  font-size: 14px;
}
.toc-item.toc-sub { padding-left: 16px; font-size: 13px; }
.toc-item:hover { color: var(--vp-c-text-1); }
@media (max-width: 1240px) {
  .doc-layout { grid-template-columns: 260px minmax(0, 1fr); }
  .toc { display: none; }
  .home-layout .content { padding: 0 6vw 80px; }
  .feature-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 960px) {
  .topbar {
    grid-template-columns: auto 1fr;
    height: auto;
    padding: 16px 18px;
  }
  .search, .topbar nav { display: none; }
  .layout,
  .doc-layout,
  .home-layout { display: block; }
  .sidebar {
    position: relative;
    top: 0;
    height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--vp-c-divider);
  }
  .content { padding: 26px 18px 70px; }
  .home-layout .content { padding: 0 20px 70px; }
  .vp-hero {
    min-height: 0;
    grid-template-columns: 1fr;
    padding: 70px 0 26px;
  }
  .vp-hero h1 { font-size: 42px; }
  .tagline { font-size: 18px; }
  .feature-grid { grid-template-columns: 1fr; }
}
`

const port = Number(process.env.PORT || 5173)

http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${port}`)
  const file = routeToFile(url.pathname)

  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('页面不存在')
    return
  }

  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(renderPage(fs.readFileSync(file, 'utf8'), file))
}).listen(port, '0.0.0.0', () => {
  console.log(`Knowledge site running at http://localhost:${port}/`)
})
