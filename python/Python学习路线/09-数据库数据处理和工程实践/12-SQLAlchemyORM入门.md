# SQLAlchemyORM入门

SQLAlchemy ORM 把数据库表映射为 Python 类，把行映射为对象。ORM 能提高业务代码可读性，但也可能隐藏 SQL 细节。学习 ORM 时必须同时关注 session、事务、查询和性能。

## 模型定义

```python
from sqlalchemy import Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
```

## 创建表

```python
from sqlalchemy import create_engine


engine = create_engine("sqlite:///app.db")
Base.metadata.create_all(engine)
```

## Session

Session 表示 ORM 的工作单元。

```python
from sqlalchemy.orm import Session


with Session(engine) as session:
    user = User(name="Alice", email="alice@example.com")
    session.add(user)
    session.commit()
```

Session 管理：

- 对象状态。
- 查询。
- 事务。
- flush。
- commit。
- rollback。

## 查询

```python
from sqlalchemy import select


with Session(engine) as session:
    stmt = select(User).where(User.email == "alice@example.com")
    user = session.scalars(stmt).first()
```

## 更新

```python
with Session(engine) as session:
    user = session.get(User, 1)
    user.name = "Alice Zhang"
    session.commit()
```

## 删除

```python
with Session(engine) as session:
    user = session.get(User, 1)
    session.delete(user)
    session.commit()
```

## relationship

一对多示例：

```python
class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
```

关系映射能让对象之间导航，但要注意懒加载带来的额外查询。

## 常见错误

### Session 生命周期混乱

不要在全局共享一个 Session。一次请求或一次任务使用独立 Session。

### 忘记 commit

对象变化不会持久化。

### 捕获异常后不 rollback

Session 可能处于失败状态。

### ORM 查询导致 N+1

循环里访问关系字段可能触发大量查询。

## 练习

1. 定义 User 模型。
2. 创建数据库表。
3. 新增用户。
4. 查询用户。
5. 更新用户。
6. 删除用户。
7. 增加 Order 模型。
8. 建立 User 和 Order 关系。
9. 捕获异常并 rollback。
10. 打开 SQL 日志观察查询。

## 验收标准

- 能定义 ORM 模型。
- 能使用 Session 完成 CRUD。
- 能理解 Session 生命周期。
- 能识别 ORM 隐藏 SQL 的风险。
