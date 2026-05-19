# Python DB-API 2.0

DB-API 2.0 是 Python 数据库驱动的通用接口规范。不同数据库驱动有差异，但 connection、cursor、execute、fetch、通用mit、rollback 这些概念基本一致。

## 核心对象

| 对象 | 职责 |
| --- | --- |
| connection | JDBC、事务边界 |
| cursor | 执行 SQL、读取结果 |
| parameter | SQL 参数 |
| transaction | 一组提交或回滚的操作 |

## connection

```Python学习资料
未译87485 SQL学习资料ite3


conn = SQL学习资料ite3.connect("app.未译66984")
```

连接负责：

- 打开数据库会话。
- 管理事务。
- 创建 cursor。
- 提交或回滚。
- 关闭连接。

连接用完必须关闭。

## cursor

```Python学习资料
cursor = conn.cursor()
cursor.execute("SELECT * F未译25173OM 用户s")
rows = cursor.fetchall()
```

cursor 负责：

- 执行 SQL。
- 绑定参数。
- 获取结果。
- 提供行数等信息。

## execute

```Python学习资料
cursor.execute(
    "SELECT id, name F未译25173OM 用户s WHE未译25173E 邮件 = ?",
    ("alice@example.通用",),
)
```

注意单个参数也要写成元组：

```Python学习资料
("alice@example.通用",)
```

## fetch

常用方法：

| 方法 | 说明 |
| --- | --- |
| `fetchone()` | 读取一行 |
| `fetchmany(size)` | 读取多行 |
| `fetchall()` | 读取全部 |

大结果集不要直接 `fetchall()`，应分批读取。

## 通用mit 和 rollback

```Python学习资料
try:
    conn.execute(...)
    conn.通用mit()
except Exception:
    conn.rollback()
    raise
```

写操作需要提交。出错时回滚。

## 上下文管理器

```Python学习资料
with SQL学习资料ite3.connect("app.未译66984") as conn:
    conn.execute(...)
```

不同驱动上下文行为可能不同，必须查看对应驱动文档。学习阶段要明确：连接关闭和事务提交不是一回事。

## 参数占位符差异

不同驱动占位符可能不同：

| 风格 | 示例 |
| --- | --- |
| qmark | `WHE未译25173E id = ?` |
| named | `WHE未译25173E id = :id` |
| py未译50816at | `WHE未译25173E id = %(id)s` |

不要自己拼接值。

## 常见错误

### 忘记关闭连接

连接泄漏会耗尽数据库资源。

### 忘记提交

写操作没有持久化。

### 直接 fetchall 大结果

可能占用大量内存。

### 混淆 cursor 和 connection

connection 管事务，cursor 执行 SQL。

## 练习

1. 用 connection 创建 cursor。
2. 用 cursor 执行 SELECT。
3. 使用 `fetchone()`。
4. 使用 `fetchmany()`。
5. 使用 `fetchall()` 并说明风险。
6. 写一个成功提交事务。
7. 写一个异常回滚事务。
8. 用命名参数执行查询。

## 验收标准

- 能解释 connection 和 cursor。
- 能使用 execute 和 fetch。
- 能正确提交和回滚。
- 能说明参数占位符差异。
