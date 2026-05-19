# 12-Bean Validation 校验注解

Bean Validation 用注解表达对象字段、方法参数和返回值的校验规则。在 Spring Web 项目中，它常用于请求 DTO 入参校验。

## 常用校验注解

| 注解 | 作用 |
| --- | --- |
| `@NotNull` | 不能为 `null` |
| `@NotBlank` | 字符串不能为 `null`，且去空格后不能为空 |
| `@NotEmpty` | 集合、数组、字符串不能为 `null` 且长度不能为 0 |
| `@Size` | 限制长度或集合大小 |
| `@Min`、`@Max` | 数值最小值、最大值 |
| `@DecimalMin`、`@DecimalMax` | 小数边界 |
| `@Email` | 邮箱格式 |
| `@Pattern` | 正则匹配 |
| `@Past`、`@Future` | 时间过去或未来 |
| `@Valid` | 级联校验 |

## 请求 DTO 示例

```java
public class Create用户Request {
    @NotBlank(name = "用户名不能为空")
    @Size(max = 30, name = "用户名不能超过30个字符")
    private String 用户name;

    @NotBlank(name = "手机号不能为空")
    @Pattern(regexp = "^1\\d{10}$", name = "手机号格式不正确")
    private String phone;

    @NotNull(name = "年龄不能为空")
    @Min(value = 1, name = "年龄必须大于0")
    private Integer age;
}
```

Controller 中触发校验：

```java
@PostMapping("/用户s")
public Long create(@Valid @RequestBody Create用户Request request) {
    return 用户Service.create(request);
}
```

如果没有 `@Valid` 或 `@Validated`，很多场景下校验不会自动触发。

这点很关键：校验注解只是规则，校验器触发后规则才会执行。

## @NotNull、@NotEmpty、@NotBlank 区别

| 注解 | `null` | `""` | `"   "` | 常见用途 |
| --- | --- | --- | --- | --- |
| `@NotNull` | 不允许 | 允许 | 允许 | 数字、对象、枚举 |
| `@NotEmpty` | 不允许 | 不允许 | 允许 | 集合、数组、字符串 |
| `@NotBlank` | 不允许 | 不允许 | 不允许 | 用户输入文本 |

字符串必填通常用 `@NotBlank`，不是 `@NotNull`。

很多线上脏数据都来自只写了 `@NotNull`，结果空字符串绕过校验。

## 嵌套对象校验

```java
public class Create订单Request {
    @NotNull
    private Long 用户Id;

    @Valid
    @NotEmpty
    private List<订单ItemRequest> items;
}
```

```java
public class 订单ItemRequest {
    @NotNull
    private Long skuId;

    @Min(1)
    private Integer quantity;
}
```

没有 `@Valid` 时，`items` 里的对象字段可能不会继续校验。

嵌套校验的关键是：外层字段负责集合是否存在，`@Valid` 负责继续检查集合元素里的字段。

## 分组校验

同一个 DTO 在新增和修改时规则不同，可以使用分组。

```java
public interface CreateGroup {
}

public interface UpdateGroup {
}
```

```java
public class 用户Request {
    @NotNull(groups = UpdateGroup.class)
    private Long id;

    @NotBlank(groups = {CreateGroup.class, UpdateGroup.class})
    private String 用户name;
}
```

触发：

```java
public void create(@Validated(CreateGroup.class) @RequestBody 用户Request request) {
}
```

分组不要滥用。规则过多时，拆分 DTO 更清晰。

分组适合“同一对象在少数几个场景下规则不同”。如果新增、修改、审核、导入、导出规则都不同，通常拆 DTO 更可维护。

## 自定义校验注解

定义注解：

```java
@Documented
@Constraint(validatedBy = PhoneValidator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER})
public @interface Phone {
    String name() default "手机号格式不正确";
    类<?>[] groups() default {};
    类<? extends Payload>[] payload() default {};
}
```

实现校验器：

```java
public class PhoneValidator 实现ements ConstraintValidator<Phone, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }
        return value.matches("^1\\d{10}$");
    }
}
```

是否允许空值要和 `@NotBlank` 配合设计。格式校验通常只校验格式，不负责必填。

这个设计能让注解组合更灵活：

```java
@Phone
private String optionalPhone;

@NotBlank
@Phone
private String requiredPhone;
```

前者允许不填，后者必须填写且格式正确。

## 方法参数校验

在 Spring 中，如果要校验普通方法参数，通常需要在类上加 `@Validated`：

```java
@Service
@Validated
public class 用户服务 {
    public void changePassword(
            @NotNull Long 用户Id,
            @NotBlank String newPassword
    ) {
    }
}
```

这类校验一般依赖 Spring AOP 代理，和事务一样，要注意调用路径。

## 统一错误响应

校验失败后，不应该把框架原始异常直接返回给前端。常见做法是用全局异常处理：

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ErrorResponse handleValidException(MethodArgumentNotValidException ex) {
        return ErrorResponse.badRequest("参数校验失败");
    }
}
```

真实项目里还应把字段名、错误消息、错误码整理成统一格式。

## 小结

- 校验注解只表达规则，必须有校验器触发。
- Spring Web 入参通常用 `@Valid` 或 `@Validated` 触发。
- 字符串必填优先考虑 `@NotBlank`。
- 嵌套对象要加 `@Valid`。
- 自定义校验注解要明确是否允许空值。

## 小练习

1. 给一个注册请求 DTO 添加用户名、手机号、密码校验。
2. 写一个嵌套订单 DTO，确保订单明细列表里的每一项都会被校验。
3. 设计一个自定义 `@EnumValue` 校验注解，校验字符串是否属于枚举范围。
