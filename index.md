---
layout: home

hero:
  name: "学习知识库"
  text: "前端 / Java / Spring / Python / SQL / Linux / Redis / Docker"
  tagline: "按主题归档，按阶段阅读，需要时快速检索。"
  image:
    src: /knowledge-hero.svg
    alt: 知识库插图
  actions:
    - theme: brand
      text: 开始阅读
      link: /说明
    - theme: alt
      text: 查看索引
      link: /说明

features:
  - title: 分类清晰
    details: 八个主题统一入口，侧边栏自动按目录展开。
  - title: 快速检索
    details: 支持本地搜索，适合查命令、查语法、查排障记录。
  - title: 持续沉淀
    details: 新增 Markdown 后自动进入站点导航，方便长期维护。
---

## 知识库入口

| 主题 | 入口 | 适合用途 |
| --- | --- | --- |
| 前端 | [前端学习资料](前端学习资料/说明.md) | JavaScript Class、语言机制、前端框架和工程化专题 |
| Java | [Java 学习资料](Java学习资料/说明.md) | Java 基础、JVM、并发、Web、项目与面试复盘 |
| Spring | [Spring 学习资料](Spring学习资料/说明.md) | Spring Framework、Spring Boot、事务、安全、测试、微服务 |
| Python | [Python 学习资料](Python学习资料/说明.md) | Python 基础、自动化、Web API、数据处理和工程化 |
| SQL | [SQL 学习资料](SQL学习资料/说明.md) | MySQL 语法参考、数据库表拆分方法论 |
| Linux | [Linux 学习资料](Linux学习资料/说明.md) | Linux 运维、部署、网络、权限、日志和排障 |
| Redis | [Redis 学习资料](Redis学习资料/说明.md) | Redis 知识库、命令速查、实战案例、面试与故障复盘 |
| Docker | [Docker 学习资料](Docker学习资料/说明.md) | Docker 镜像、容器、卷、网络、Compose、交付、运维和排障 |

## 使用约定

- 每个主题目录以 `说明.md` 作为入口页。
- 阶段目录优先阅读自身的 `说明.md`，再进入具体小节。
- VitePress 侧边栏会自动扫描目录结构，新增 Markdown 文件后无需手动维护站点导航。
