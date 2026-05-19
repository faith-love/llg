# 03-MVC

## 阶段目标

这个阶段把 Spring 用到 Web 开发里，目标是能写出结构清楚、错误可控、参数校验完整的 REST API。

学完后要能掌握：

- 请求如何进入 DispatcherServlet。
- Controller、Service、Repository 的职责边界。
- 路径参数、查询参数、请求体、请求头如何绑定。
- JSON 序列化和反序列化如何工作。
- 统一响应、统一异常、参数校验如何落地。

## 请求处理主线

Spring MVC 请求处理可以按下面顺序理解：

1. 请求进入嵌入式 Web 容器。
2. DispatcherServlet 接管请求。
3. HandlerMapping 找到 Controller 方法。
4. 参数解析器完成参数绑定。
5. Controller 调用业务服务。
6. 返回值处理器把结果转换成响应。
7. 异常处理器处理失败路径。

这条主线要配合断点或日志看一遍。

## REST API 设计

先掌握常见资源风格：

- `GET /books`：分页查询。
- `GET /books/{id}`：详情。
- `POST /books`：创建。
- `PUT /books/{id}`：整体更新。
- `PATCH /books/{id}/status`：局部变更。
- `DELETE /books/{id}`：删除。

不要为了省事把所有操作都写成 `POST /doSomething`。

## 分层边界

推荐边界：

- Controller：处理协议层输入输出，不写复杂业务。
- DTO：承载请求和响应，不直接暴露数据库实体。
- Service：处理业务规则、事务边界、领域流程。
- Repository/Mapper：处理数据访问。
- Exception：表达业务失败类型。

## 必做练习

- 写一个图书 CRUD API。
- 支持分页查询、关键词查询、状态筛选。
- 创建和更新接口使用 DTO + 参数校验。
- 使用 `@RestControllerAdvice` 统一异常响应。
- 使用 `LocalDateTime` 字段，确认 JSON 格式符合预期。
- 编写Swagger或 OpenAPI 配置。

## 验收标准

- 能解释 `@Controller`、`@RestController`、`@ResponseBody` 的关系。
- 能区分 `@PathVariable`、`@RequestParam`、`@RequestBody`。
- 能处理 400、401、403、404、409、500 等常见错误。
- 能避免实体类直接穿透到前端响应。

## 常见误区

- 误区：统一响应一定要包住所有返回值。
  纠正：统一响应是团队约定，文件下载、流式响应、标准 OAuth 响应等场景要单独处理。

- 误区：Controller 越薄越好，所以什么都转给 Service。
  纠正：Controller 应该处理协议适配，Service 处理业务，不是简单搬运参数。


