---
layout: home

hero:
  name: "D:\\learn 知识库"
  text: "Java、Spring、Python、SQL、Linux、Redis 的学习资料静态站点"
  tagline: "按主题沉淀，按阶段阅读，按项目和排障场景复盘。"
  actions:
    - theme: brand
      text: 开始阅读
      link: /说明
    - theme: alt
      text: Redis 知识库
      link: /Redis学习资料/Redis知识库/说明

features:
  - title: 路线型知识库
    details: Java、Spring、Python 按阶段拆分，适合从总览进入再逐篇推进。
  - title: 查阅型手册
    details: SQL、Redis 命令和 Linux 运维内容适合按问题、命令、场景快速定位。
  - title: 实战与复盘
    details: Redis 案例、故障库、面试题库和项目检查清单用于把知识落到真实项目。
---

## 知识库入口

| 主题 | 入口 | 适合用途 |
| --- | --- | --- |
| Java | [Java 学习资料](Java学习资料/说明.md) | Java 基础、JVM、并发、Web、项目与面试复盘 |
| Spring | [Spring 学习资料](Spring学习资料/说明.md) | Spring Framework、Spring Boot、事务、安全、测试、微服务 |
| Python | [Python 学习资料](Python学习资料/说明.md) | Python 基础、自动化、Web API、数据处理和工程化 |
| SQL | [SQL 学习资料](SQL学习资料/说明.md) | MySQL 语法参考、数据库表拆分方法论 |
| Linux | [Linux 学习资料](Linux学习资料/说明.md) | Linux 运维、部署、网络、权限、日志和排障 |
| Redis | [Redis 学习资料](Redis学习资料/说明.md) | Redis 知识库、命令速查、实战案例、面试与故障复盘 |

## 使用约定

- 每个主题目录以 `说明.md` 作为入口页。
- 阶段目录优先阅读自身的 `说明.md`，再进入具体小节。
- VitePress 侧边栏会自动扫描目录结构，新增 Markdown 文件后无需手动维护站点导航。
