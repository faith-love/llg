# 06-Spring MVC：Controller、参数绑定、异常处理和拦截器

## Spring MVC 解决什么问题

Spring MVC 负责把 HTTP 请求映射到 Java 方法，并把 Java 对象返回成 HTTP 响应。

基本链路：

```text
HTTP 请求 -> DispatcherServlet -> Controller -> Service -> JSON 响应
```

## Controller

```java
@RestController
@RequestMapping("/接口/books")
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }
}
```

## 参数绑定

路径参数：

```java
@GetMapping("/{id}")
public BookResponse getById(@PathVariable Long id) {
    return bookService.getById(id);
}
```

查询参数：

```java
@GetMapping
public PageResponse<BookResponse> list(@RequestParam int 分页, @RequestParam int size) {
    return bookService.list(分页, size);
}
```

请求体：

```java
@PostMapping
public BookResponse create(@RequestBody CreateBookRequest request) {
    return bookService.create(request);
}
```

## 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BookNotFoundException.class)
    public ErrorResponse handle(BookNotFoundException e) {
        return new ErrorResponse("BOOK_NOT_FOUND", e.getMessage());
    }
}
```

## 拦截器

拦截器可以在 Controller 前后执行逻辑，常用于：

- 登录校验。
- 日志记录。
- 请求耗时统计。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| Spring MVC | 把 HTTP 映射到 Java 方法 | 不用手写 Servlet 处理每个请求 | 先掌握 Controller 参数绑定 | 重点是请求进入 Controller 的过程 |
| `@RestController` | 返回 JSON API | 少写 `@ResponseBody` | REST API 默认用它 | 重点是和页面 Controller 区分 |
| 参数绑定 | 把 HTTP 参数变成 Java 参数 | 少写手动解析代码 | 路径、查询、body 分清 | 难点是注解用错导致参数为空 |
| 全局异常 | 统一错误响应 | 避免每个接口 try-catch | 用 `@RestControllerAdvice` | 重点是业务异常和未知异常分开 |
| 拦截器 | 处理请求前后通用逻辑 | 适合登录、日志、耗时 | 不要在拦截器写复杂业务 | 重点是它在 Controller 前后工作 |

## 本节练习

- 写图书列表、详情、新增接口。
- 分别使用 `@PathVariable`、`@RequestParam`、`@RequestBody`。
- 写一个全局异常处理器。
- 写一个打印请求耗时的拦截器。

## 本节通过标准

- 能写 REST Controller。
- 能正确绑定三类参数。
- 能设计全局异常处理。
- 能说明拦截器适合什么场景。

