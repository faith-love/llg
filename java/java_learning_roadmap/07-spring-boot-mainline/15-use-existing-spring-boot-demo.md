# 15-如何使用现有 spring-boot-demo

## 使用原则

`D:\learn\java\spring-boot-demo` 是一个多模块示例项目。不要一次性读完整个项目。

正确方式：

```text
学一个专题 -> 找对应模块 -> 跑起来 -> 看核心配置 -> 自己复写最小版本
```

## 推荐模块对应关系

| 专题 | 模块 |
| --- | --- |
| 启动流程 | `demo-helloworld` |
| MyBatis | `demo-orm-mybatis` |
| Redis 缓存 | `demo-cache-redis` |
| RabbitMQ | `demo-mq-rabbitmq` |
| Kafka | `demo-mq-kafka` |
| RocketMQ | `demo-mq-rocketmq` |
| 任务调度 | `demo-task`、`demo-task-quartz` |
| 权限控制 | `demo-rbac-security`、`demo-rbac-shiro` |
| Docker | `demo-docker` |
| Actuator | `demo-actuator` |

## 阅读一个模块的顺序

1. 看 `pom.xml`，理解依赖。
2. 看 `application.yml`，理解配置。
3. 找启动类。
4. 找 Controller。
5. 找 Service。
6. 找配置类。
7. 跑一个最小请求。
8. 自己新建项目复写最小版本。

## 不要怎么做

- 不要把整个 demo 当成要背的源码。
- 不要一次打开几十个模块。
- 不要复制一堆配置但不知道用途。
- 不要只跑通，不复写。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 示例项目 | 提供真实集成参考 | 比零散代码片段更接近项目 | 每次只看一个模块 | 重点是带着问题读 |
| `pom.xml` | 识别依赖来源 | 知道功能靠哪些 starter | 先看 dependency | 重点是依赖和功能对应 |
| `application.yml` | 识别运行配置 | 知道服务端口、数据源、中间件地址 | 记录关键配置项 | 难点是环境差异 |
| 复写最小版本 | 真正掌握专题 | 只看 demo 容易以为自己会了 | 删除不必要功能，只保留核心链路 | 重点是自己写一遍 |

## 本节练习

- 选择 `demo-helloworld`，记录启动流程。
- 选择 `demo-orm-mybatis`，记录 MyBatis 配置。
- 选择 `demo-cache-redis`，记录 Redis 使用方式。
- 每个专题复写一个最小 demo。

## 本节通过标准

- 能按模块阅读 demo。
- 能从 `pom.xml` 和配置文件找到关键依赖。
- 能复写一个最小版本。
- 能说明 demo 中哪些内容暂时不需要。

