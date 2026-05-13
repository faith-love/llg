# 03-阶段导读：Spring MVC 和 REST API

## 这一阶段解决什么问题

前面你已经掌握了 Bean、AOP、事件和参数校验的基础能力。这个阶段开始把 Spring 真正用于 Web API 开发，目标是把一个 HTTP 请求稳定地接进来、处理出去，并且边界清楚、错误可控、返回一致。

## 学习顺序

建议按下面顺序读：

1. [请求处理主线](01-request-lifecycle.md)
2. [Controller、路由和 REST 设计](02-controller-routing-rest-design.md)
3. [参数绑定、序列化和校验入口](03-argument-binding-serialization.md)
4. [统一响应、异常和状态码](04-response-exception-status-code.md)
5. [分层边界和图书 API 实战](05-layering-and-book-api-practice.md)
6. [阶段练习和通过标准](06-stage-practice-checkpoints.md)

## 继续深挖

如果上面的主线已经看完，继续按下面顺序往下拆：

7. [校验、异常和状态码分工](07-validation-exception-status.md)
8. [REST 资源设计和接口语义](08-rest-resource-design.md)
9. [查询、分页和排序约定](09-query-pagination-sorting.md)
10. [JSON、时间、枚举和 Long 精度](10-json-time-enum-long.md)
11. [ResponseEntity、文件和流式响应](11-responseentity-file-stream.md)
12. [Filter、Interceptor 和参数解析器](12-filter-interceptor-resolver.md)
13. [OpenAPI、接口调试和示例管理](13-openapi-testing-examples.md)
14. [图书 REST API 项目落地](14-book-rest-api-project.md)
15. [常见陷阱和排查手册](15-pitfall-guide.md)
16. [阶段总验收](16-checkpoints.md)

## 小白需要先记住的结论

- Spring MVC 负责请求路由、参数绑定、调用 Controller、处理返回值和异常。
- Controller 处理协议，Service 处理业务，Repository/Mapper 处理数据访问。
- REST API 不是“只要返回 JSON 就行”，还包括资源命名、状态码、错误结构和幂等语义。
- DTO 用来隔离输入输出边界，不要直接把数据库实体暴露给前端。
- 统一异常处理和统一响应是接口治理的一部分，不是最后补的格式活。

## 本阶段产出

完成本阶段后，至少产出：

- 一个图书 CRUD API。
- 一套统一响应和统一异常处理。
- 分页查询、条件查询、详情、创建、更新、删除接口。
- 一份接口调用示例。
- 一份请求处理链路笔记。
