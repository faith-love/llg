# 09-阶段导读：Spring Cloud 和分布式基础

## 这一阶段解决什么问题

这一阶段学习微服务和分布式基础，但重点不是为了“拆得更细”，而是理解为什么拆、拆了以后要承担哪些复杂度。

## 学习顺序

建议按下面顺序读：

1. [微服务前置条件和拆分边界](01-microservice-prerequisites-and-boundaries.md)
2. [注册中心、配置中心和网关](02-registry-config-gateway.md)
3. [服务调用、超时、重试和降级](03-service-call-timeout-retry-fallback.md)
4. [分布式一致性、幂等和可观测性](04-distributed-consistency-idempotency-observability.md)
5. [阶段练习和通过标准](05-stage-practice-checkpoints.md)

## 继续深挖

如果上面的主线已经看完，继续按下面顺序往下拆：

6. [Boot 和 Cloud 版本对齐](06-boot-cloud-version-alignment.md)
7. [按业务边界拆服务](07-split-services-by-domain-boundary.md)
8. [网关路由、过滤器和统一入口](08-gateway-route-filter-entry.md)
9. [服务注册发现和实例治理](09-service-registry-discovery-instance.md)
10. [Feign、超时、重试和熔断](10-feign-timeout-retry-circuit-breaker.md)
11. [配置中心和动态刷新边界](11-config-center-and-refresh.md)
12. [traceId、日志和跨服务观测](12-traceid-log-observability.md)
13. [最终一致性、Outbox 和 Saga 思路](13-eventual-consistency-outbox-saga.md)
14. [微服务实验项目落地](14-microservice-lab-project.md)
15. [常见陷阱和排查手册](15-pitfall-guide.md)

## 小白需要先记住的结论

- 微服务不是默认更高级，而是默认更复杂。
- 单体边界不清楚时，拆服务只会把问题放大。
- 网关、注册中心、配置中心各自解决不同层面的问题。
- 分布式里超时、重试、降级和幂等是日常问题，不是边角情况。

## 本阶段产出

完成本阶段后，至少产出：

- 一个最小微服务拆分实验。
- 一份网关和注册中心配置。
- 一个 Feign 调用超时和降级实验。
- 一份分布式一致性和补偿笔记。
