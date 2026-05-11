# CRUD和参数化查询

CRUD 是 Create、Read、Update、Delete。它是数据库应用的基本能力。学习 CRUD 时必须同时学习参数化查询，因为安全写 SQL 比写出 SQL 更重要。

## Create

```python
def create_user(conn, name, email):
    cursor = conn.execute(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        (name, email),
    )
    return cursor.lastrowid
```

## Read

```python
def get_user_by_email(conn, email):
    return conn.execute(
        "SELECT id, name, email FROM users WHERE email = ?",
        (email,),
    ).fetchone()
```

## Update

```python
def update_user_name(conn, user_id, name):
    cursor = conn.execute(
        "UPDATE users SET name = ? WHERE id = ?",
        (name, user_id),
    )
    return cursor.rowcount
```

## Delete

```python
def delete_user(conn, user_id):
    cursor = conn.execute(
        "DELETE FROM users WHERE id = ?",
        (user_id,),
    )
    return cursor.rowcount
```

## 参数化查询

错误写法：

```python
sql = f"SELECT * FROM users WHERE email = '{email}'"
```

正确写法：

```python
conn.execute("SELECT * FROM users WHERE email = ?", (email,))
```

参数化查询让数据库驱动负责转义和绑定值，避免 SQL 注入。

## 批量插入

```python
users = [
    ("Alice", "alice@example.com"),
    ("Bob", "bob@example.com"),
]

conn.executemany(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    users,
)
```

批量插入要放在事务中。

## rowcount

`rowcount` 可用于判断影响行数。

```python
if cursor.rowcount == 0:
    raise ValueError("用户不存在")
```

注意不同驱动对 rowcount 的行为可能略有差异。

## 软删除

直接删除可能影响审计和恢复。常见做法是软删除：

```sql
UPDATE users
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

查询时过滤：

```sql
WHERE deleted_at IS NULL
```

## 常见错误

### UPDATE 忘记 WHERE

会更新整张表。

### DELETE 忘记 WHERE

会删除整张表。

### 拼接 SQL 处理用户输入

这是高风险错误。

### 不检查影响行数

更新不存在的数据时程序可能以为成功。

## 练习

1. 写 `create_user`。
2. 写 `get_user_by_id`。
3. 写 `get_user_by_email`。
4. 写 `update_user_name`。
5. 写 `delete_user`。
6. 给所有查询使用参数化。
7. 实现批量插入。
8. 实现软删除。
9. 检查更新影响行数。
10. 构造 SQL 注入输入并验证参数化能防护。

## 验收标准

- 能完成 CRUD。
- 能使用参数化查询。
- 能检查影响行数。
- 能避免危险更新和删除。
