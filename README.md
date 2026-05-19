

# 学习知识库

一个基于 VitePress 构建的软件知识学习平台，用于将技术知识落到真实项目中。

## 项目简介

本知识库旨在整合软件开发和运维过程中的实用案例、故障排除经验、面试题库以及项目检查清单，帮助工程师将理论知识转化为实际项目能力。

## 主要内容

- **Redis 案例**：Redis 在实际项目中的应用场景和最佳实践
- **故障库**：常见故障排查与解决方案
- **面试题库**：软件工程师面试必备知识
- **项目检查清单**：项目开发各阶段检查要点

## 技术栈

- [VitePress](https://vitepress.dev/) - 静态网站生成器
- Node.js

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run docs:dev
# 或
npm run serve
```

### 项目检查

```bash
npm run check
```

## 项目结构

```
├── .vitepress/          # VitePress 配置和主题
│   ├── config.mts       # 站点配置
│   └── theme/           # 自定义主题
├── public/              # 静态资源
├── scripts/              # 构建脚本
│   ├── check-knowledge.mjs
│   └── serve-knowledge.mjs
├── index.md              # 知识库入口
└── package.json
```

## 使用约定

请参考 [index.md](./index.md) 了解详细的使用约定和贡献指南。

## License

MIT License