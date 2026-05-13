# 08-阶段导读：测试、可观测性和部署

## 这一阶段解决什么问题

这个阶段把项目从“能跑”推进到“能验证、能定位、能上线”。核心不是工具名，而是形成一套可交付、可排错的工程习惯。

## 学习顺序

建议按下面顺序读：

1. [测试分层和选择策略](01-test-layering-and-strategy.md)
2. [Web、Data 和集成测试](02-web-data-integration-test.md)
3. [日志、指标、健康检查和追踪](03-logging-metrics-health-tracing.md)
4. [打包、Docker 和环境配置](04-packaging-docker-environment.md)
5. [阶段练习和通过标准](05-stage-practice-checkpoints.md)

## 继续深挖

如果上面的主线已经看完，继续按下面顺序往下拆：

6. [单元测试边界和假对象使用](06-unit-test-boundary-and-test-double.md)
7. [Web 切片测试和 MockMvc 主线](07-web-slice-and-mockmvc.md)
8. [数据层测试和 Testcontainers](08-data-test-and-testcontainers.md)
9. [`@SpringBootTest` 的使用边界](09-springboottest-boundary.md)
10. [日志设计、traceId 和请求链路](10-log-design-traceid.md)
11. [health、readiness、指标和告警视角](11-health-readiness-metrics-alerting.md)
12. [Dockerfile 和镜像基线](12-dockerfile-image-baseline.md)
13. [环境配置、密钥和部署参数](13-env-config-secret-runtime.md)
14. [部署 README、发布和回滚](14-deploy-readme-release-rollback.md)
15. [常见陷阱和排查手册](15-pitfall-guide.md)

## 小白需要先记住的结论

- 不是所有测试都要 `@SpringBootTest`。
- 日志、指标和健康检查是后端交付物的一部分。
- 本地能跑，不代表能上线。
- 配置隔离、依赖准备和回滚思路都属于部署范畴。

## 本阶段产出

完成本阶段后，至少产出：

- 单元测试、Web 测试、数据层测试各一组。
- Actuator 健康检查和指标。
- 一份最小 Dockerfile。
- 一份启动、配置、部署 README。
