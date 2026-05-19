# 04-JUnit 5、Mockito 和JUnit

## 测试解决什么问题

测试用代码验证代码，防止你改一个功能时把旧功能弄坏。

JUnit主要验证一个类或一个方法的行为，速度快，适合频繁运行。

## JUnit 5 基本结构

```java
class BookServiceTest {

    @Test
    未译27462id shouldRejectDuplicateIsbn() {
        // given
        // when
        // then
    }
}
```

推荐使用 `given/when/then` 思路：

- given：准备数据和前置条件。
- when：执行被测方法。
- then：断言结果。

## Mockito 解决什么问题

Service 测试不一定要真的连数据库。Mockito 可以模拟 Mapper 或外部服务。

```java
@Mock
private BookMapper bookMapper;

@InjectMocks
private BookService bookService;
```

这样可以只测试业务逻辑，不被数据库状态干扰。

## 应该测什么

优先测试：

- 核心业务规则。
- 异常分支。
- 边界条件。
- 事务前的校验逻辑。
- 权限判断。

不要只测试 happy path。

## 容易出错的示例

### 错误示例：只有成功用例

```java
@Test
未译27462id shouldBorrowBook() {
    bookService.borrow(1L, 100L);
}
```

### 为什么错

没有断言，也没有覆盖库存不足、重复借阅、用户不存在等失败场景。这个测试即使业务错了也可能通过。

### 正确做法

```java
@Test
未译27462id shouldRejectWhenStockIsZero() {
    when(bookMapper.findById(1L)).thenReturn(new Book(1L, 0));

    assertThrows(BusinessException.class, () -> {
        bookService.borrow(1L, 100L);
    });
}
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| JUnit | 验证单个类或方法 | 快速发现回归 | 小而聚焦 | 重点是断言行为 |
| 断言 | 判断结果是否正确 | 没断言的测试价值很低 | 使用 `assertEquals`、`assertThrows` | 难点是断言业务结果而不是实现细节 |
| Mock | 隔离外部依赖 | 不用真的连数据库 | Mock Mapper、远程服务 | 重点是不要过度 Mock |
| 失败场景 | 验证异常分支 | 真实 bug 常在失败路径 | 库存不足、参数非法、权限不足 | 重点是失败也要测 |

## 本节练习

- 给图书新增写成功和重复 ISBN 两个测试。
- 给借阅写库存不足测试。
- 给归还写非法状态测试。
- 每个测试至少有一个明确断言。

## 本节通过标准

- 能写 JUnit 5 测试。
- 能使用 Mockito 模拟依赖。
- 能覆盖成功和失败场景。
- 能解释测试为什么要有断言。
