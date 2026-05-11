# SQLAlchemyCore入门

SQLAlchemy Core 提供一种用 Python 表达 SQL 的方式。它比直接拼 SQL 更结构化，也比 ORM 更接近 SQL 本身。学习 Core 能帮助你理解 SQLAlchemy 的底层思想。

## Engine

Engine 表示数据库访问入口。

```python
from sqlalchemy import create_engine


engine = create_engine("sqlite:///app.db", echo=True)
```

`echo=True` 会打印 SQL，适合学习和调试。

## MetaData 和 Table

```python
from sqlalchemy import MetaData, Table, Column, Integer, String


metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String, nullable=False),
    Column("email", String, nullable=False, unique=True),
)
```

创建表：

```python
metadata.create_all(engine)
```

## Insert

```python
from sqlalchemy import insert


stmt = insert(users).values(name="Alice", email="alice@example.com")
with engine.begin() as conn:
    conn.execute(stmt)
```

`engine.begin()` 会开启事务，成功提交，失败回滚。

## Select

```python
from sqlalchemy import select


stmt = select(users).where(users.c.email == "alice@example.com")
with engine.connect() as conn:
    row = conn.execute(stmt).first()
```

`users.c.email` 表示 users 表的 email 列。

## Update

```python
from sqlalchemy import update


stmt = (
    update(users)
    .where(users.c.id == 1)
    .values(name="Alice Zhang")
)
```

## Delete

```python
from sqlalchemy import delete


stmt = delete(users).where(users.c.id == 1)
```

## Core 的价值

适合：

- 动态构建 SQL。
- 写复杂查询。
- 保持 SQL 思维。
- 不想引入完整 ORM 对象生命周期。

## 常见错误

### 以为 Core 不需要事务

写操作仍然需要事务。

### 混淆 Table 和 ORM Model

Core 使用 `Table`，ORM 使用模型类。

### 不看生成的 SQL

学习阶段建议打开 echo，理解实际 SQL。

### 连接不关闭

使用 `with engine.connect()` 或 `with engine.begin()`。

## 练习

1. 创建 engine。
2. 定义 users Table。
3. 创建表。
4. 插入用户。
5. 查询用户。
6. 更新用户。
7. 删除用户。
8. 打印生成 SQL。
9. 用事务执行两条写入。

## 验收标准

- 能使用 SQLAlchemy Core 定义表。
- 能执行 insert、select、update、delete。
- 能理解 engine、connection、metadata。
- 能使用事务上下文。
