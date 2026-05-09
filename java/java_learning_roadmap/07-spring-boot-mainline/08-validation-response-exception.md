# 08-参数校验、统一响应和统一异常

## 参数校验

Spring Boot 常用 Bean Validation 做参数校验。

请求 DTO：

```java
public class CreateBookRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String isbn;
}
```

Controller：

```java
@PostMapping
public BookResponse create(@Valid @RequestBody CreateBookRequest request) {
    return bookService.create(request);
}
```

## 统一响应

统一响应让前端处理更稳定。

```java
public class ApiResponse<T> {
    private String code;
    private String message;
    private T data;
}
```

## 统一异常

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handle(BusinessException e) {
        return ResponseEntity.status(e.getStatus()).body(...);
    }
}
```

## 错误码

错误码用于机器识别，message 用于人阅读。

示例：

```text
BOOK_NOT_FOUND
DUPLICATE_ISBN
VALIDATION_FAILED
UNAUTHORIZED
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| Bean Validation | 自动校验请求字段 | 不用手写大量 if | DTO 上加注解，Controller 用 `@Valid` | 重点是校验不能只靠前端 |
| 统一响应 | 固定成功结构 | 前端处理更稳定 | 泛型包装 data | 难点是不要过度包装文件下载等特殊响应 |
| 统一异常 | 固定失败结构 | 不用每个 Controller try-catch | 业务异常和系统异常分开 | 重点是未知异常不要暴露堆栈给前端 |
| 错误码 | 让错误可识别 | message 变了也不影响前端逻辑 | 错误码稳定、可枚举 | 重点是错误码要有业务含义 |

## 本节练习

- 给创建图书请求加校验。
- 写统一响应类。
- 写业务异常类。
- 写全局异常处理器。
- 设计 10 个错误码。

## 本节通过标准

- 能使用 `@Valid`。
- 能返回统一成功响应。
- 能返回统一错误响应。
- 能设计稳定错误码。

