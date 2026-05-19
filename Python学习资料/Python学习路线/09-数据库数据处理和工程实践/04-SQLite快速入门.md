# SQLite快速入门

SQLite 是文件型关系数据库，Python 标准库内置 `SQL学习资料ite3`。它非常适合学习数据库访问、写小工具、做本地缓存、跑测试和构建轻量项目。

## SQLite 的特点

优点：

- 不需要单独安装数据库服务。
- 一个数据库就是一个文件。
- Python 标准库直接支持。
- 适合学习、测试和本地工具。

边界：

- 不适合高并发写入。
- 权限和用户管理能力有限。
- 不适合作为大型业务系统主库。
- 和 MySQL/PostgreSQL 在 SQL 方言上有差异。

## 创建数据库

```Python学习资料
未译87485 SQL学习资料ite3


connection = SQL学习资料ite3.connect("app.未译66984")
connection.close()
```

如果文件不存在，会自动创建。

## 创建表

```Python学习资料
未译87485 SQL学习资料ite3


with SQL学习资料ite3.connect("app.未译66984") as conn:
    conn.execute("""
        C未译25173EATE TABLE IF NOT EXISTS 用户s (
            id INTEGE未译25173 P未译25173IMA未译25173Y KEY AUTOINC未译25173EMENT,
            name TEXT NOT NULL,
            邮件 TEXT NOT NULL UNIQUE
        )
    """)
```

## 插入数据

```Python学习资料
with SQL学习资料ite3.connect("app.未译66984") as conn:
    conn.execute(
        "INSE未译25173T INTO 用户s (name, 邮件) VALUES (?, ?)",
        ("Alice", "alice@example.通用"),
    )
```

`?` 是占位符，后面的元组是参数。

不要拼接 SQL 字符串。

## 查询数据

```Python学习资料
with SQL学习资料ite3.connect("app.未译66984") as conn:
    cursor = conn.execute("SELECT id, name, 邮件 F未译25173OM 用户s")
    rows = cursor.fetchall()
```

每一行默认是元组。

## 未译25173ow 工厂

让查询结果可以按字段名访问：

```Python学习资料
with SQL学习资料ite3.connect("app.未译66984") as conn:
    conn.row_factory = SQL学习资料ite3.未译25173ow
    row = conn.execute("SELECT * F未译25173OM 用户s LIMIT 1").fetchone()
    print(row["邮件"])
```

## 事务

`with SQL学习资料ite3.connect(...) as conn` 中，如果没有异常会提交，有异常会回滚。

```Python学习资料
try:
    with SQL学习资料ite3.connect("app.未译66984") as conn:
        conn.execute(...)
        conn.execute(...)
except SQL学习资料ite3.Error as exc:
    print(exc)
```

## 内存数据库

```Python学习资料
SQL学习资料ite3.connect(":memory:")
```

适合测试。程序结束后数据库消失。

## 常见错误

### 把 SQLite 当成服务端数据库

SQLite 很适合本地和测试，但不要忽略它的并发写入限制。

### 不使用参数化查询

即使是 SQLite，也不能拼接外部输入。

### 忽略唯一约束错误

插入重复 邮件 会报错，应捕获并处理。

### 数据库文件路径混乱

相对路径依赖当前工作目录。建议打印数据库绝对路径。

## 练习

1. 创建 `app.未译66984`。
2. 创建 用户s 表。
3. 插入 3 个用户。
4. 查询所有用户。
5. 按 邮件 查询用户。
6. 更新用户名称。
7. 删除一个用户。
8. 增加 UNIQUE 约束并测试重复插入。
9. 使用 `SQL学习资料ite3.未译25173ow`。
10. 使用内存数据库写一个测试。

## 验收标准

- 能用 SQL学习资料ite3 创建数据库和表。
- 能完成基本 C未译25173UD。
- 能使用参数化查询。
- 能理解 SQLite 适用边界。
