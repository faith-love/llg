# 事务边界、ServiceImpl 注意事项与常见坑

这一节解释为什么事务一般放在 Service 层，以及 MyBatis-Plus 的 `ServiceImpl` 使用时有哪些坑。

## 事务放在哪里

推荐：

```java
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, UserDO> implements UserService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserResponse createUser(UserCreateRequest request) {
        // 业务判断
        // 数据库写入
        // 返回响应
    }
}
```

不推荐：

```java
@RestController
public class UserController {

    @Transactional
    @PostMapping
    public ApiResponse<UserResponse> create(@RequestBody UserCreateRequest request) {
        // 不推荐 Controller 承担事务边界
        return ApiResponse.success(userService.createUser(request));
    }
}
```

原因：

- Controller 是 HTTP 层，不应该关心数据库事务。
- 一个业务流程可能调用多个 Mapper，事务边界应该包住完整业务流程。
- Service 更容易被 Controller、定时任务、消息消费者复用。

## rollbackFor 的意义

```java
@Transactional(rollbackFor = Exception.class)
```

说明：

- Spring 默认只对 `RuntimeException` 和 `Error` 回滚。
- 加 `rollbackFor = Exception.class` 后，受检异常也会回滚。
- 项目里业务异常通常继承 `RuntimeException`，天然会回滚。

## 同类内部调用导致事务失效

错误例子：

```java
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, UserDO> implements UserService {

    public void outer() {
        // 同一个类内部直接调用 inner，不会经过 Spring 代理
        inner();
    }

    @Transactional(rollbackFor = Exception.class)
    public void inner() {
        save(new UserDO());
        throw new RuntimeException("test");
    }
}
```

问题：

- `@Transactional` 依赖 Spring 代理。
- 同一个类内部 `this.inner()` 不经过代理。
- 事务可能不会生效。

修正方式：

- 把事务放在外层入口方法。
- 或者把需要事务的方法拆到另一个 Service。

## updateById 的注意事项

```java
UserDO entity = getRequiredUser(id);
entity.setNickname(request.getNickname());
entity.setEmail(request.getEmail());
entity.setStatus(request.getStatus());
updateById(entity);
```

注意：

- `updateById` 根据 id 更新。
- 传入对象的 null 字段通常不会更新，具体受 MyBatis-Plus 字段策略影响。
- 修改前先查一次，可以判断用户是否存在，也能避免盲更新。

## save 和 insert 的区别

在 `ServiceImpl` 里：

```java
save(entity);
```

在 Mapper 里：

```java
baseMapper.insert(entity);
```

区别：

- `save` 是 Service 层方法，底层会调用 Mapper。
- `insert` 是 Mapper 层方法。
- 在 ServiceImpl 里优先用 `save`、`updateById`、`removeById`，表达业务层语义更统一。

## count 查询的并发问题

当前代码：

```java
private void ensureUsernameNotExists(String username) {
    LambdaQueryWrapper<UserDO> wrapper = new LambdaQueryWrapper<>();
    wrapper.eq(UserDO::getUsername, username);

    if (count(wrapper) > 0) {
        throw new BusinessException(ErrorCode.CONFLICT, "用户名已存在");
    }
}
```

这个检查能给用户友好错误，但不能替代数据库唯一索引。

原因：

```text
请求 A 检查 username 不存在
请求 B 检查 username 不存在
请求 A 插入成功
请求 B 插入时才发现唯一索引冲突
```

所以必须保留数据库唯一索引：

```sql
UNIQUE KEY uk_users_username (username)
```

真实项目还要捕获唯一索引异常并转成业务错误。

## 常见坑清单

| 坑 | 表现 | 解决 |
| --- | --- | --- |
| 忘记 `@MapperScan` | 启动时报找不到 Mapper Bean | 启动类加 `@MapperScan` |
| 忘记分页插件 | 分页结果不对或不拼 limit | 配置 `PaginationInnerInterceptor` |
| Controller 直接返回 Entity | 前端看到内部字段 | 转成 Response |
| 事务放在私有方法 | 事务不生效 | 放在 public Service 方法 |
| 前端传超大 pageSize | 查询很慢 | 后端限制最大值 |
| 只靠代码查重 | 并发下重复插入 | 数据库唯一索引兜底 |

## 练习

1. 故意去掉 `@MapperScan`，观察启动报错。
2. 去掉分页插件，观察分页 SQL 变化。
3. 写一个内部调用事务失效实验。
4. 并发插入同名用户，理解唯一索引的作用。

## 验收

- 能解释事务为什么放 Service。
- 能解释 `@Transactional` 依赖代理。
- 能解释唯一索引为什么不能省。
- 能定位常见 MyBatis-Plus 配置错误。
