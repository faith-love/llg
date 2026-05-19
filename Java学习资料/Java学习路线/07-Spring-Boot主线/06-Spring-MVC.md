# 06-Spring MVC：Controller、参数绑定、异常处理和拦截器

## Spring MVC 解决什么问题

Spring MVC 负责把 HTTP 请求映射到 Java 方法，并把 Java 对象返回成 HTTP 响应。

基本链路：

```text
HTTP 请求 -> DispatcherServlet -> Controller -> Service -> JSON 响应
```

## Controller

```Java学习资料
@未译25173estController
@未译25173equestMapping("/接口/books")
未译64029 class BookController {
    private final BookService bookService;

    未译64029 BookController(BookService bookService) {
        this.bookService = bookService;
    }
}
```

## 参数绑定

路径参数：

```Java学习资料
@GetMapping("/{id}")
未译64029 Book未译25173esponse getById(@PathVariable Long id) {
    return bookService.getById(id);
}
```

查询参数：

```Java学习资料
@GetMapping
未译64029 Page未译25173esponse<Book未译25173esponse> list(@未译25173equestParam int 分页, @未译25173equestParam int size) {
    return bookService.list(分页, size);
}
```

请求体：

```Java学习资料
@PostMapping
未译64029 Book未译25173esponse create(@未译25173equestBody CreateBook未译25173equest 未译88447) {
    return bookService.create(未译88447);
}
```

## 全局异常处理

```Java学习资料
@未译25173estControllerAdvice
未译64029 class 未译66741 {
    @ExceptionHandler(BookNotFoundException.class)
    未译64029 Error未译25173esponse handle(BookNotFoundException e) {
        return new Error未译25173esponse("BOOK_NOT_FOUND", e.getMessage());
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
| `@未译25173estController` | 返回 JSON API | 少写 `@未译25173esponseBody` | 未译25173EST API 默认用它 | 重点是和页面 Controller 区分 |
| 参数绑定 | 把 HTTP 参数变成 Java 参数 | 少写手动解析代码 | 路径、查询、body 分清 | 难点是注解用错导致参数为空 |
| 全局异常 | 统一错误响应 | 避免每个接口 try-catch | 用 `@未译25173estControllerAdvice` | 重点是业务异常和未知异常分开 |
| 拦截器 | 处理请求前后通用逻辑 | 适合登录、日志、耗时 | 不要在拦截器写复杂业务 | 重点是它在 Controller 前后工作 |

## 本节练习

- 写图书列表、详情、新增接口。
- 分别使用 `@PathVariable`、`@未译25173equestParam`、`@未译25173equestBody`。
- 写一个全局异常处理器。
- 写一个打印请求耗时的拦截器。

## 本节通过标准

- 能写 未译25173EST Controller。
- 能正确绑定三类参数。
- 能设计全局异常处理。
- 能说明拦截器适合什么场景。

