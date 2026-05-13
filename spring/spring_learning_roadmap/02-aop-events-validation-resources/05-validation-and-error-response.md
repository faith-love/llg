# 05-Bean Validation 和统一错误响应

## 参数校验解决什么问题

接口输入是系统边界。边界不校验，错误数据就会进入业务层和数据库。

常见问题：

- 用户名为空。
- 手机号格式错误。
- 数量为负数。
- 日期范围不合法。
- 字符串过长。

Bean Validation 适合处理这类输入格式和基础约束。

## DTO 上写约束

示例：

```java
public class CreateUserRequest {

    @NotBlank(message = "用户名不能为空")
    private String username;

    @Email(message = "邮箱格式不正确")
    private String email;

    @NotNull(message = "年龄不能为空")
    @Min(value = 1, message = "年龄必须大于 0")
    private Integer age;
}
```

常用注解：

- `@NotNull`：不能为 null。
- `@NotBlank`：字符串不能为 null，也不能是空白。
- `@NotEmpty`：集合或字符串不能为空。
- `@Size`：长度或集合大小限制。
- `@Min`、`@Max`：数值范围。
- `@Email`：邮箱格式。
- `@Pattern`：正则格式。

## Controller 中触发校验

示例：

```java
@PostMapping("/users")
public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
    return userService.createUser(request);
}
```

没有 `@Valid` 或 `@Validated`，DTO 上的约束可能不会触发。

## 统一错误响应

校验失败不能直接把框架异常暴露给前端。

建议使用 `@RestControllerAdvice`：

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .findFirst()
            .map(FieldError::getDefaultMessage)
            .orElse("参数校验失败");

        return new ErrorResponse("VALIDATION_ERROR", message);
    }
}
```

统一响应至少要包含：

- 错误码。
- 错误消息。
- 必要时包含字段名。
- 请求追踪 ID。

## 格式校验和业务校验

Bean Validation 适合：

- 必填。
- 长度。
- 格式。
- 数值范围。

业务校验仍然放在 Service：

- 用户名是否重复。
- 库存是否足够。
- 订单状态是否允许取消。
- 当前用户是否能操作该资源。

不要把复杂业务规则塞进 DTO 注解里。

## 分组校验

有时创建和更新的校验规则不同。

例如：

- 创建时 ID 不能传。
- 更新时 ID 必须传。

可以使用 validation groups，但初学阶段不要过早使用。先把普通校验和统一异常处理做好。

## 本节练习

1. 写 `CreateUserRequest`。
2. 给用户名、邮箱、年龄添加校验注解。
3. Controller 使用 `@Valid`。
4. 写统一异常处理，返回统一错误结构。
5. 故意传空用户名、错误邮箱、负数年龄。
6. 在 Service 中校验用户名是否重复。

## 本节通过标准

- 能说出 `@Valid` 的作用。
- 能区分 `@NotNull`、`@NotBlank`、`@NotEmpty`。
- 能把校验失败转换成统一错误响应。
- 能区分格式校验和业务校验。
