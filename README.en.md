# Knowledge Base

A software knowledge learning platform built on VitePress, designed to apply technical knowledge to real-world projects.

## Project Overview

This knowledge base aims to integrate practical case studies, troubleshooting experiences, interview question banks, and project checklists from software development and operations, helping engineers transform theoretical knowledge into practical project capabilities.

## Main Contents

- **Redis Cases**: Real-world application scenarios and best practices for Redis
- **Docker Knowledge Base**: Docker images, containers, Compose, production operations, and troubleshooting
- **Troubleshooting Library**: Common issues and their solutions
- **Interview Question Bank**: Essential knowledge for software engineering interviews
- **Project Checklists**: Key checkpoints at each stage of project development

## Tech Stack

- [VitePress](https://vitepress.dev/) - Static site generator
- Node.js

## Quick Start

### Install Dependencies

```bash
npm install
```

### Local Development

```bash
npm run docs:dev
# or
npm run serve
```

### Project Validation

```bash
npm run check
```

## Project Structure

```
├── .vitepress/          # VitePress configuration and theme
│   ├── config.mts       # Site configuration
│   └── theme/           # Custom theme
├── public/              # Static assets
├── scripts/             # Build scripts
│   ├── check-knowledge.mjs
│   └── serve-knowledge.mjs
├── index.md             # Knowledge base entry point
└── package.json
```

## Usage Guidelines

Please refer to [index.md](./index.md) for detailed usage guidelines and contribution instructions.

## License

MIT License
