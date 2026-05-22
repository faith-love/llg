# Controller 增删改查 API 完整代码

这一节写真正暴露给前端的 REST API。Controller 的职责是接收 HTTP 请求、触发参数校验、调用 Service、包装统一响应。

## UserController 完整代码

`src/main/java/com/example/crud/user/controller/UserController.java`：

```java
package com.example.crud.user.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.example.crud.common.ApiResponse;
import com.example.crud.user.dto.UserCreateRequest;
import com.example.crud.user.dto.UserQueryRequest;
import com.example.crud.user.dto.UserResponse;
import com.example.crud.user.dto.UserUpdateRequest;
import com.example.crud.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户接口 Controller。
 *
 * @RestController = @Controller + @ResponseBody
 * 表示这个类的方法默认返回 JSON，而不是跳转页面。
 */
@Validated
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    /**
     * 构造器注入。
     *
     * 推荐这种方式：
     * - 依赖不可变
     * - 测试更方便
     * - 不需要字段上写 @Autowired
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 新增用户。
     *
     * POST /api/users
     */
    @PostMapping
    public ApiResponse<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        UserResponse response = userService.createUser(request);
        return ApiResponse.success(response);
    }

    /**
     * 查询用户详情。
     *
     * GET /api/users/1
     */
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> get(@PathVariable Long id) {
        UserResponse response = userService.getUser(id);
        return ApiResponse.success(response);
    }

    /**
     * 分页查询用户。
     *
     * GET /api/users?pageNo=1&pageSize=10&keyword=ada&status=1
     *
     * UserQueryRequest 不加 @RequestBody，因为 GET 查询参数来自 URL query。
     */
    @GetMapping
    public ApiResponse<IPage<UserResponse>> page(UserQueryRequest request) {
        IPage<UserResponse> response = userService.pageUsers(request);
        return ApiResponse.success(response);
    }

    /**
     * 修改用户。
     *
     * PUT /api/users/1
     */
    @PutMapping("/{id}")
    public ApiResponse<UserResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        UserResponse response = userService.updateUser(id, request);
        return ApiResponse.success(response);
    }

    /**
     * 删除用户。
     *
     * DELETE /api/users/1
     *
     * 这里底层使用 MyBatis-Plus 逻辑删除，不是真的物理删除。
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.success(null);
    }
}
```

## 关键注解解释

| 注解 | 放在哪里 | 作用 |
| --- | --- | --- |
| `@RestController` | 类 | 表示返回 JSON |
| `@RequestMapping` | 类 | 定义统一接口前缀 |
| `@PostMapping` | 方法 | 新增资源 |
| `@GetMapping` | 方法 | 查询资源 |
| `@PutMapping` | 方法 | 修改资源 |
| `@DeleteMapping` | 方法 | 删除资源 |
| `@PathVariable` | 方法参数 | 接收 URL 路径变量 |
| `@RequestBody` | 方法参数 | 接收 JSON 请求体 |
| `@Valid` | 方法参数 | 触发 DTO 校验 |

## HTTP 方法怎么选

| 操作 | HTTP 方法 | 示例 |
| --- | --- | --- |
| 新增 | `POST` | `POST /api/users` |
| 查询详情 | `GET` | `GET /api/users/1` |
| 分页查询 | `GET` | `GET /api/users?pageNo=1` |
| 全量修改 | `PUT` | `PUT /api/users/1` |
| 删除 | `DELETE` | `DELETE /api/users/1` |

## 调试请求

新增用户：

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"ada\",\"nickname\":\"Ada Lovelace\",\"email\":\"ada@example.com\"}"
```

查询详情：

```bash
curl http://localhost:8080/api/users/1
```

分页查询：

```bash
curl "http://localhost:8080/api/users?pageNo=1&pageSize=10&keyword=ada&status=1"
```

修改用户：

```bash
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d "{\"nickname\":\"Ada\",\"email\":\"ada.new@example.com\",\"status\":1}"
```

删除用户：

```bash
curl -X DELETE http://localhost:8080/api/users/1
```

## 常见错误

### 忘记 @RequestBody

错误写法：

```java
@PostMapping
public ApiResponse<UserResponse> create(@Valid UserCreateRequest request) {
    return ApiResponse.success(userService.createUser(request));
}
```

结果：前端发 JSON 时，字段可能全是 null。

正确写法：

```java
@PostMapping
public ApiResponse<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
    return ApiResponse.success(userService.createUser(request));
}
```

### 忘记 @Valid

忘记 `@Valid` 时，DTO 上的 `@NotBlank`、`@Email` 不会生效。

### Controller 写业务判断太多

Controller 可以做参数接收，但不要写大量业务规则。比如“用户名是否重复”应该在 Service。

## 练习

1. 用 curl 调通五个接口。
2. 故意传错误邮箱，观察统一异常响应。
3. 删除用户后，再查询这个用户，确认查不到。

## 验收

- 五个 CRUD 接口路径清晰。
- Controller 只调用 Service，不直接调用 Mapper。
- POST 和 PUT 的 JSON 请求体能被正确接收。
- DTO 校验能生效。
