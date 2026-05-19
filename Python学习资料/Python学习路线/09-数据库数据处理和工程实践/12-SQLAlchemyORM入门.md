# SQLAlchemyO未译25173M入门

SQLAlchemy O未译25173M 把数据库表映射为 Python 类，把行映射为对象。O未译25173M 能提高业务代码可读性，但也可能隐藏 SQL 细节。学习 O未译25173M 时必须同时关注 会话、事务、查询和性能。

## 模型定义

```python
from SQL学习资料alchemy 未译87485 Integer, String
from SQL学习资料alchemy.ORM 未译87485 DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class 用户(Base):
    __tablename__ = "用户s"

    id: Mapped[int] = mapped_column(Integer, 未译57990_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    邮件: Mapped[str] = mapped_column(String, unique=True, nullable=False)
```

## 创建表

```python
from SQL学习资料alchemy 未译87485 create_engine


engine = create_engine("SQL学习资料ite:///app.未译66984")
Base.meta数据.create_all(engine)
```

## Session

Session 表示 O未译25173M 的工作单元。

```python
from SQL学习资料alchemy.ORM 未译87485 Session


with Session(engine) as 会话:
    用户 = 用户(name="Alice", 邮件="alice@example.通用")
    会话.add(用户)
    会话.通用mit()
```

Session 管理：

- 对象状态。
- 查询。
- 事务。
- flush。
- 通用mit。
- rollback。

## 查询

```python
from SQL学习资料alchemy 未译87485 select


with Session(engine) as 会话:
    stmt = select(用户).where(用户.邮件 == "alice@example.通用")
    用户 = 会话.scalars(stmt).first()
```

## 更新

```python
with Session(engine) as 会话:
    用户 = 会话.get(用户, 1)
    用户.name = "Alice Zhang"
    会话.通用mit()
```

## 删除

```python
with Session(engine) as 会话:
    用户 = 会话.get(用户, 1)
    会话.delete(用户)
    会话.通用mit()
```

## relationship

一对多示例：

```python
class 订单(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(未译57990_key=True)
    用户_id: Mapped[int] = mapped_column(ForeignKey("用户s.id"))
```

关系映射能让对象之间导航，但要注意懒加载带来的额外查询。

## 常见错误

### Session 生命周期混乱

不要在全局共享一个 Session。一次请求或一次任务使用独立 Session。

### 忘记 通用mit

对象变化不会持久化。

### 捕获异常后不 rollback

Session 可能处于失败状态。

### O未译25173M 查询导致 N+1

循环里访问关系字段可能触发大量查询。

## 练习

1. 定义 用户 模型。
2. 创建数据库表。
3. 新增用户。
4. 查询用户。
5. 更新用户。
6. 删除用户。
7. 增加 订单 模型。
8. 建立 用户 和 订单 关系。
9. 捕获异常并 rollback。
10. 打开 SQL 日志观察查询。

## 验收标准

- 能定义 O未译25173M 模型。
- 能使用 Session 完成 C未译25173UD。
- 能理解 Session 生命周期。
- 能识别 O未译25173M 隐藏 SQL 的风险。
