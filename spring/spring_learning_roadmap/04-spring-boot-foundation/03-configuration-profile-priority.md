# 03-配置文件、Profile 和覆盖优先级

## 外部化配置为什么重要

同一份代码在本地、测试、生产环境运行时，端口、数据库、日志级别、第三方地址通常不同。

如果这些都写死在代码里，项目就不可运维。

## 常见配置文件

最常见的两类：

- `application.yml`
- `application.properties`

Profile 形式：

- `application-dev.yml`
- `application-test.yml`
- `application-prod.yml`

## Profile 的作用

Profile 用于隔离环境差异。

例如：

- `dev` 用本地数据库。
- `test` 用测试数据库和更详细日志。
- `prod` 用生产数据库和更严格的日志级别。

## 覆盖优先级

配置可能来自：

- 默认配置文件。
- Profile 配置文件。
- 环境变量。
- 命令行参数。

遇到配置不生效时，先问自己：是不是被更高优先级的来源覆盖了。

## 配置绑定

简单配置可以用 `@Value`，结构化配置优先用 `@ConfigurationProperties`。

后者更适合：

- 配置集中。
- 类型清晰。
- 易于维护和校验。

## 本节通过标准

- 能建立 `dev/test/prod` 三套配置。
- 能解释配置覆盖优先级。
- 能用 `@ConfigurationProperties` 管理结构化配置。
