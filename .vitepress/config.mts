import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const hiddenDirs = new Set([
  '.git',
  '.idea',
  '.vitepress',
  '.workbuddy',
  'node_modules',
  'dist',
  '命名整理记录'
])

const topLevelSections = [
  'Java学习资料',
  'Spring学习资料',
  'Python学习资料',
  'SQL学习资料',
  'Linux学习资料',
  'Redis学习资料'
]

function isMarkdown(file: string) {
  return file.endsWith('.md')
}

function isHidden(name: string) {
  return name.startsWith('.') || hiddenDirs.has(name)
}

function titleFromFile(file: string) {
  try {
    const content = fs.readFileSync(file, 'utf8')
    const heading = content.match(/^#\s+(.+)$/m)
    if (heading?.[1]) {
      return heading[1].trim()
    }
  } catch {
    // Fall back to the filename when a legacy file cannot be read as UTF-8.
  }

  const parsed = path.parse(file)
  return parsed.name === '说明' || parsed.name === 'README'
    ? path.basename(path.dirname(file))
    : parsed.name
}

function normalizeLink(file: string) {
  const relative = path.relative(root, file).replace(/\\/g, '/')
  return `/${relative.replace(/\.md$/, '')}`
}

function sortEntries(entries: fs.Dirent[]) {
  return entries.sort((a, b) => {
    if (a.isDirectory() !== b.isDirectory()) {
      return a.isDirectory() ? -1 : 1
    }

    const score = (name: string) => {
      if (name === '说明.md' || name === 'README.md') return '00'
      return name
    }

    return score(a.name).localeCompare(score(b.name), 'zh-Hans-CN', {
      numeric: true,
      sensitivity: 'base'
    })
  })
}

function buildItems(dir: string, depth = 0): any[] {
  if (depth > 4) return []

  const entries = sortEntries(
    fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => {
      if (isHidden(entry.name)) return false
      const full = path.join(dir, entry.name)
      if (entry.isFile() && isMarkdown(entry.name)) {
        try {
          const content = fs.readFileSync(full, 'utf8').trim()
          return Boolean(content)
        } catch {
          return false
        }
      }
      return entry.isDirectory()
    })
  )

  const items: any[] = []

  for (const entry of entries) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      const indexFile = ['说明.md', 'README.md', 'index.md']
        .map((name) => path.join(full, name))
        .find((candidate) => fs.existsSync(candidate))
      const nested = buildItems(full, depth + 1)

      if (indexFile) {
        items.push({
          text: titleFromFile(indexFile),
          link: normalizeLink(indexFile),
          collapsed: depth >= 1,
          items: nested.filter((item) => item.link !== normalizeLink(indexFile))
        })
      } else if (nested.length) {
        items.push({
          text: entry.name,
          collapsed: true,
          items: nested
        })
      }

      continue
    }

    items.push({
      text: titleFromFile(full),
      link: normalizeLink(full)
    })
  }

  return items
}

function buildSidebar() {
  const sidebar: Record<string, any[]> = {
    '/': [
      { text: '首页', link: '/' },
      { text: '总索引', link: '/说明' }
    ]
  }

  for (const section of topLevelSections) {
    const dir = path.join(root, section)
    if (!fs.existsSync(dir)) continue

    sidebar[`/${section}/`] = [
      {
        text: section,
        collapsed: false,
        items: buildItems(dir)
      }
    ]
  }

  return sidebar
}

export default defineConfig({
  title: '学习知识库',
  description: '本地学习资料静态站点',
  lang: 'zh-CN',
  base: process.env.GITHUB_ACTIONS ? '/llg/' : '/',
  appearance: true,
  cleanUrls: true,
  ignoreDeadLinks: [
    /^https?:\/\/localhost(?::\d+)?(?:\/|$)/,
    /^\.\//
  ],
  srcExclude: [
    '**/node_modules/**',
    '**/.git/**',
    '**/.idea/**',
    '**/.workbuddy/**',
    '**/命名整理记录/**'
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '总索引', link: '/说明' },
      { text: 'Java', link: '/Java学习资料/说明' },
      { text: 'Spring', link: '/Spring学习资料/说明' },
      { text: 'Python', link: '/Python学习资料/说明' },
      { text: 'SQL', link: '/SQL学习资料/说明' },
      { text: 'Linux', link: '/Linux学习资料/说明' },
      { text: 'Redis', link: '/Redis学习资料/说明' }
    ],
    sidebar: buildSidebar(),
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    search: {
      provider: 'local'
    },
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },
  lastUpdated: true
})
