# 统一响应、DTO、校验与异常处理

这一节先搭接口的公共能力。真实项目里，接口不能一会儿返回字符串、一会儿返回对象、一会儿抛默认错误页。前后端协作时，响应格式必须稳定。

## 统一响应 ApiResponse

`src/main/java/com/example/crud/common/ApiResponse.java`：

```java
package com.example.crud.common;

/**
 * 统一接口响应对象。
 *
 * @param <T> data 的类型，例如 UserResponse、List<UserResponse>
 */
public class ApiResponse<T> {

    /** 业务状态码。0 表示成功，非 0 表示失败 */
    private int code;

    /** 给前端或调用方看的消息 */
    private String message;

    /** 真正的响应数据 */
    private T data;

    public ApiResponse() {
    }

    public ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(0, "success", data);
    }

    public static <T> ApiResponse<T> fail(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
```

响应示例：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "username": "ada"
  }
}
```

## 错误码 ErrorCode

`src/main/java/com/example/crud/common/ErrorCode.java`：

```java
package com.example.crud.common;

/**
 * 项目统一错误码。
 *
 * 小项目可以先用枚举维护；大项目可以再拆成更细的错误码体系。
 */
public enum ErrorCode {
    BAD_REQUEST(400, "请求参数错误"),
    NOT_FOUND(404, "资源不存在"),
    CONFLICT(409, "资源冲突"),
    INTERNAL_ERROR(500, "服务器内部错误");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
```

## 业务异常 BusinessException

`src/main/java/com/example/crud/common/BusinessException.java`：

```java
package com.example.crud.common;

/**
 * 业务异常。
 *
 * 例如：
 * - 用户不存在
 * - 用户名重复
 * - 状态不允许修改
 */
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
```

注意事项：

- 业务异常继承 `RuntimeException`，配合事务默认会回滚。
- 不要到处 `return null` 表示失败，失败路径应该明确抛异常。

## 全局异常处理

`src/main/java/com/example/crud/common/GlobalExceptionHandler.java`：

```java
package com.example.crud.common;

import java.util.stream.Collectors;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器。
 *
 * 作用：
 * 1. 把异常转换成统一 JSON 响应。
 * 2. 避免把 Java 堆栈直接暴露给前端。
 * 3. 让 Controller 不需要每个方法都 try-catch。
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ApiResponse<Void> handleBusinessException(BusinessException ex) {
        return ApiResponse.fail(ex.getErrorCode().getCode(), ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::formatFieldError)
                .collect(Collectors.joining("; "));

        return ApiResponse.fail(ErrorCode.BAD_REQUEST.getCode(), message);
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> handleUnknownException(Exception ex) {
        // 真实项目这里应该记录日志，例如 log.error("unknown error", ex)
        return ApiResponse.fail(ErrorCode.INTERNAL_ERROR.getCode(), ErrorCode.INTERNAL_ERROR.getMessage());
    }

    private String formatFieldError(FieldError error) {
        return error.getField() + " " + error.getDefaultMessage();
    }
}
```

## 创建请求 DTO

`src/main/java/com/example/crud/user/dto/UserCreateRequest.java`：

```java
package com.example.crud.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 新增用户请求。
 *
 * 这个类只表示前端创建用户时允许传入的字段。
 */
public class UserCreateRequest {

    @NotBlank(message = "不能为空")
    @Size(max = 50, message = "长度不能超过 50")
    private String username;

    @NotBlank(message = "不能为空")
    @Size(max = 50, message = "长度不能超过 50")
    private String nickname;

    @NotBlank(message = "不能为空")
    @Email(message = "格式不正确")
    @Size(max = 100, message = "长度不能超过 100")
    private String email;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
```

注意事项：

- DTO 上写校验注解。
- Controller 方法参数上还要加 `@Valid`，校验才会生效。
- 不要让前端传 `deleted`、`createdAt`、`updatedAt`。

## 修改请求 DTO

`src/main/java/com/example/crud/user/dto/UserUpdateRequest.java`：

```java
package com.example.crud.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 修改用户请求。
 *
 * status 允许修改，用来演示启用、禁用用户。
 */
public class UserUpdateRequest {

    @NotBlank(message = "不能为空")
    @Size(max = 50, message = "长度不能超过 50")
    private String nickname;

    @NotBlank(message = "不能为空")
    @Email(message = "格式不正确")
    @Size(max = 100, message = "长度不能超过 100")
    private String email;

    @NotNull(message = "不能为空")
    private Integer status;

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
```

## 查询请求 DTO

`src/main/java/com/example/crud/user/dto/UserQueryRequest.java`：

```java
package com.example.crud.user.dto;

/**
 * 用户分页查询请求。
 *
 * GET /api/users?pageNo=1&pageSize=10&keyword=ada&status=1
 */
public class UserQueryRequest {

    private long pageNo = 1;

    private long pageSize = 10;

    private String keyword;

    private Integer status;

    public long getPageNo() {
        return pageNo;
    }

    public void setPageNo(long pageNo) {
        this.pageNo = pageNo;
    }

    public long getPageSize() {
        return pageSize;
    }

    public void setPageSize(long pageSize) {
        this.pageSize = pageSize;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
```

## 响应 DTO

`src/main/java/com/example/crud/user/dto/UserResponse.java`：

```java
package com.example.crud.user.dto;

import java.time.LocalDateTime;

/**
 * 用户响应对象。
 *
 * 只返回前端需要看的字段。
 */
public class UserResponse {

    private Long id;
    private String username;
    private String nickname;
    private String email;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
```

## 练习

1. 给 `UserCreateRequest` 增加 `phone` 字段，并添加长度校验。
2. 故意传空 `username`，观察全局异常处理返回什么。
3. 解释为什么不直接返回 `UserDO`。

## 验收

- 成功响应和失败响应格式统一。
- 参数校验失败能返回明确字段错误。
- Controller 不需要到处写 try-catch。
- DTO 和 Entity 职责清楚。
