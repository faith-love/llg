# 14-推荐项目结构和必做功能

## 推荐项目结构

```text
src/main/java/com/example/app/
  AppApplication.java
  controller/
  service/
  service/impl/
  mapper/
  domain/entity/
  domain/dto/
  domain/vo/
  config/
  exception/
  security/
  common/
src/main/resources/
  application.yml
  application-dev.yml
  application-prod.yml
  mapper/
```

## 各目录职责

| 目录 | 职责 |
| --- | --- |
| controller | HTTP 接口入口 |
| service | 业务规则和事务 |
| mapper | 数据访问 |
| entity | 数据库映射对象 |
| dto | 请求和响应对象 |
| config | 配置类 |
| exception | 异常和错误处理 |
| security | 登录、鉴权、权限 |
| common | 通用响应、工具、常量 |

## 必做功能

一个合格的 Spring Boot 学习项目至少包括：

- REST CRUD。
- 参数校验。
- 统一响应结构。
- 统一异常处理。
- 分页查询。
- 登录和鉴权。
- 数据库事务。
- Redis 缓存。
- 接口测试。
- Docker 启动依赖服务。
- README 写清启动步骤和接口示例。

## 开发顺序

建议：

1. 建表和 Entity。
2. Mapper 和基础 SQL。
3. Service 业务。
4. Controller 接口。
5. 参数校验。
6. 统一异常。
7. 分页。
8. 事务。
9. 登录鉴权。
10. 缓存。
11. 测试。
12. README。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 分层目录 | 控制代码职责 | 不同逻辑不混在一起 | 按职责放文件，不按随手方便放 | 重点是 Controller、Service、Mapper 边界 |
| 必做功能 | 形成完整项目闭环 | 不只停留在 CRUD | 一项一项验收 | 重点是校验、异常、事务、测试不能省 |
| 开发顺序 | 降低复杂度 | 避免一开始全堆一起 | 先主流程，再补工程能力 | 重点是每一步可运行 |
| README | 让项目可复现 | 别人能按说明启动 | 写环境、配置、接口、错误码 | 重点是项目交付能力 |

## 本节练习

- 为你的项目创建目录结构。
- 写出每个目录的用途。
- 建立项目功能 checklist。
- 写 README 初稿。

## 本节通过标准

- 项目结构清晰。
- 每个类能找到合理目录。
- 必做功能有清单。
- README 包含启动和接口示例。

