# 00-章节导读：工程化、测试和部署

## 为什么工程化要单独学

业务代码能跑，只说明“当前机器上暂时能用”。工程化解决的是更现实的问题：

- 换一台电脑能不能跑。
- 改完代码有没有测。
- 出错时能不能定位。
- 配置能不能区分开发、测试、生产。
- 项目能不能打包和部署。
- 团队协作时会不会互相覆盖代码。

工程化的价值不是炫技，而是降低维护成本和交付风险。

## 推荐学习顺序

1. [阶段目标](01-stage-goal.md)
2. [Git 工作流和提交习惯](02-git-workflow.md)
3. [Maven 依赖、构建和冲突排查](03-maven-dependency-build.md)
4. [JUnit 5、Mockito 和单元测试](04-test-strategy-junit-mockito.md)
5. [Spring Boot Test 和集成测试](05-spring-boot-test.md)
6. [日志、异常堆栈和问题排查](06-logs-troubleshooting.md)
7. [配置、Profile 和敏感信息管理](07-configuration-profiles-secrets.md)
8. [Docker 和 Docker Compose](08-docker-docker-compose.md)
9. [部署、健康检查和 Nginx 了解](09-deployment-health-check-nginx.md)
10. [Linux 基础命令和线上排查](10-linux-basics.md)
11. [README、接口文档和本地启动说明](11-api-docs-readme.md)
12. [CI/CD 入门和质量门禁](12-ci-cd-basic.md)
13. [阶段项目：把图书 API 工程化](13-engineering-project.md)
14. [难点错误示例和避坑指南](14-pitfall-guide.md)
15. [通过标准和复盘清单](15-checkpoints.md)

## 小白先记住的主线

- Git 解决代码版本和协作问题。
- Maven 解决依赖、构建和打包问题。
- 测试解决“改了以后有没有坏”的问题。
- 日志解决“出错以后怎么找”的问题。
- 配置解决“不同环境不同参数”的问题。
- Docker 解决“环境不一致”的问题。
- README 解决“别人怎么运行项目”的问题。
- CI/CD 解决“每次提交都自动检查”的问题。

## 本章产出

完成后应该有：

- 一份清晰提交历史。
- 一个能 `mvn clean test` 的项目。
- 一组 Service 和 Controller 测试。
- 一份本地启动 README。
- 一个 `Dockerfile`。
- 一个 `docker-compose.yml`。
- 一份常见错误排查记录。
