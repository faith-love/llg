# 04-阶段导读：Spring Boot 基础主线

## 这一阶段解决什么问题

这个阶段把 Spring Boot 从“会创建项目”推进到“能解释项目为什么这样启动、配置为什么这样生效、自动配置为什么会接管这些 Bean”。

## 学习顺序

建议按下面顺序读：

1. [Starter 和依赖管理](01-starter-and-dependency-management.md)
2. [自动配置和条件装配](02-auto-configuration-and-conditions.md)
3. [配置文件、Profile 和覆盖优先级](03-configuration-profile-priority.md)
4. [Actuator、日志和启动观察](04-actuator-logging-and-bootstrap.md)
5. [依赖树、覆盖和排除策略](05-dependency-tree-override-exclusion.md)
6. [阶段练习和通过标准](06-stage-practice-checkpoints.md)

## 继续深挖

如果上面的主线已经看完，继续按下面顺序往下拆：

7. [`@SpringBootApplication` 和启动入口](07-springbootapplication-and-startup.md)
8. [Web Starter、嵌入式容器和自动装配结果](08-starter-web-and-embedded-server.md)
9. [条件注解和自动配置报告](09-condition-annotations-and-auto-config-report.md)
10. [配置加载顺序和覆盖细节](10-config-loading-priority-details.md)
11. [`@ConfigurationProperties`、宽松绑定和校验](11-configurationproperties-relaxed-binding-validation.md)
12. [Profile、环境变量和命令行参数](12-profile-environment-commandline.md)
13. [Actuator、health、info、metrics](13-actuator-health-info-metrics.md)
14. [日志、启动阶段和常见排错路径](14-logging-bootstrap-troubleshooting.md)
15. [依赖冲突、版本对齐和排除策略](15-dependency-conflict-version-alignment.md)
16. [阶段总验收](16-checkpoints.md)

## 小白需要先记住的结论

- Boot 负责快速组装 Spring 应用，不是替代 Spring。
- Starter 是依赖组合，自动配置是条件装配。
- 配置不生效，很多时候不是“Spring 有问题”，而是优先级、Profile 或命名没对上。
- `mvn dependency:tree` 和 Actuator 信息是定位问题的重要入口。

## 本阶段产出

完成本阶段后，至少产出：

- 一套 `dev/test/prod` 配置。
- 一个 `@ConfigurationProperties` 配置类。
- 一个开启 Actuator 的最小项目。
- 一份依赖树和配置优先级笔记。
