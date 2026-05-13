# 03-参数绑定、序列化和校验入口

## 常见绑定方式

Controller 方法最常见的三类输入：

- 路径参数。
- 查询参数。
- 请求体。

示例：

```java
@GetMapping("/books/{id}")
public BookDetailResponse detail(@PathVariable Long id) {
    return bookService.detail(id);
}
```

```java
@GetMapping("/books")
public PageResponse<BookItemResponse> page(
    @RequestParam(required = false) String keyword,
    @RequestParam(defaultValue = "1") int pageNo,
    @RequestParam(defaultValue = "10") int pageSize
) {
    return bookService.page(keyword, pageNo, pageSize);
}
```

```java
@PostMapping("/books")
public BookDetailResponse create(@Valid @RequestBody CreateBookRequest request) {
    return bookService.create(request);
}
```

## 绑定失败的典型问题

常见问题：

- 路径参数类型不对。
- JSON 字段名和 DTO 对不上。
- 枚举值不合法。
- 日期时间格式不匹配。
- 少了 `@RequestBody` 或 `@Valid`。

绑定问题要先从输入边界查，不要一上来就怀疑 Service。

## JSON 序列化

Spring Boot 默认会帮你把对象序列化成 JSON。

需要特别留意：

- `LocalDateTime` 的格式。
- `null` 字段是否返回。
- 枚举是返回 code、name 还是 description。
- Long 类型在前端是否有精度问题。

这些约定要尽早统一，不然后面接口风格会漂。

## DTO 作用

DTO 不是多余的一层，它主要解决：

- 输入边界隔离。
- 输出边界隔离。
- 参数校验位置清晰。
- 避免实体类字段穿透。
- 便于接口演进。

数据库实体适合数据库，不一定适合前端接口。

## 本节练习

1. 写 `CreateBookRequest`、`UpdateBookRequest`、`BookDetailResponse`。
2. 为 `CreateBookRequest` 添加标题、作者、价格、状态等字段。
3. 故意传错误日期、错误枚举、缺失字段。
4. 观察绑定错误和校验错误的区别。

## 本节通过标准

- 能区分 `@PathVariable`、`@RequestParam`、`@RequestBody`。
- 能解释 DTO 为什么必要。
- 能定位常见 JSON 绑定错误。
