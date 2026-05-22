# Entity、Mapper、Service 文件作用与代码

这一节进入 MyBatis-Plus 核心文件。你需要先理解：Entity 负责映射表，Mapper 负责数据库操作，Service 负责业务规则。

## Entity：UserDO

`src/main/java/com/example/crud/user/entity/UserDO.java`：

```java
package com.example.crud.user.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.LocalDateTime;

/**
 * 用户数据库对象。
 *
 * DO = Data Object，只表示数据库表结构。
 * 不建议直接作为接口入参或接口返回值。
 */
@TableName("users")
public class UserDO {

    /**
     * 主键 id。
     *
     * IdType.AUTO 对应 MySQL AUTO_INCREMENT。
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 登录名，数据库里有唯一索引 */
    private String username;

    /** 展示昵称 */
    private String nickname;

    /** 邮箱 */
    private String email;

    /** 状态：1 启用，0 禁用 */
    private Integer status;

    /**
     * 逻辑删除字段。
     *
     * 调用 deleteById 时，MyBatis-Plus 会执行 update，把 deleted 改成 1。
     */
    @TableLogic
    private Integer deleted;

    /**
     * 创建时间。
     *
     * FieldFill.INSERT 表示插入时自动填充。
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 更新时间。
     *
     * FieldFill.INSERT_UPDATE 表示插入和更新时都自动填充。
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getDeleted() {
        return deleted;
    }

    public void setDeleted(Integer deleted) {
        this.deleted = deleted;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
```

注意事项：

- `UserDO` 字段名用驼峰，数据库字段用下划线，MyBatis-Plus 会自动映射。
- `deleted` 不返回给前端。
- `createdAt`、`updatedAt` 不让前端传。

## Mapper：UserMapper

`src/main/java/com/example/crud/user/mapper/UserMapper.java`：

```java
package com.example.crud.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.crud.user.entity.UserDO;

/**
 * 用户 Mapper。
 *
 * 继承 BaseMapper 后，MyBatis-Plus 自动提供：
 * - insert
 * - deleteById
 * - updateById
 * - selectById
 * - selectPage
 * - selectList
 */
public interface UserMapper extends BaseMapper<UserDO> {
    // 简单 CRUD 不需要写方法。
    // 如果以后有复杂 SQL，再在这里新增方法，并配合 XML 或注解 SQL。
}
```

注意事项：

- `BaseMapper<UserDO>` 里的泛型必须是 Entity。
- Mapper 接口不需要写 `@Repository`。
- 是否需要 `@Mapper` 取决于你有没有在启动类加 `@MapperScan`。

## Converter：DTO 和 Entity 转换

`src/main/java/com/example/crud/user/converter/UserConverter.java`：

```java
package com.example.crud.user.converter;

import com.example.crud.user.dto.UserCreateRequest;
import com.example.crud.user.dto.UserResponse;
import com.example.crud.user.dto.UserUpdateRequest;
import com.example.crud.user.entity.UserDO;

/**
 * 用户对象转换器。
 *
 * 作用：
 * - Request -> DO
 * - DO -> Response
 *
 * 先手写转换，方便理解字段流向。
 * 真实项目字段很多时，可以再考虑 MapStruct。
 */
public final class UserConverter {

    private UserConverter() {
        // 工具类不允许实例化
    }

    public static UserDO toEntity(UserCreateRequest request) {
        UserDO entity = new UserDO();
        entity.setUsername(request.getUsername());
        entity.setNickname(request.getNickname());
        entity.setEmail(request.getEmail());
        entity.setStatus(1); // 新增用户默认启用
        return entity;
    }

    public static void updateEntity(UserDO entity, UserUpdateRequest request) {
        entity.setNickname(request.getNickname());
        entity.setEmail(request.getEmail());
        entity.setStatus(request.getStatus());
    }

    public static UserResponse toResponse(UserDO entity) {
        UserResponse response = new UserResponse();
        response.setId(entity.getId());
        response.setUsername(entity.getUsername());
        response.setNickname(entity.getNickname());
        response.setEmail(entity.getEmail());
        response.setStatus(entity.getStatus());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());
        return response;
    }
}
```

注意事项：

- 不要让前端传什么就直接 `BeanUtils.copyProperties` 到数据库对象。
- 转换器里可以明确控制哪些字段允许写入。
- `deleted` 不出现在 response。

## Service 接口

`src/main/java/com/example/crud/user/service/UserService.java`：

```java
package com.example.crud.user.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.crud.user.dto.UserCreateRequest;
import com.example.crud.user.dto.UserQueryRequest;
import com.example.crud.user.dto.UserResponse;
import com.example.crud.user.dto.UserUpdateRequest;
import com.example.crud.user.entity.UserDO;

/**
 * 用户业务接口。
 *
 * IService<UserDO> 是 MyBatis-Plus 提供的通用 Service 能力。
 * 这里额外声明面向业务的接口方法，Controller 调这些方法。
 */
public interface UserService extends IService<UserDO> {

    UserResponse createUser(UserCreateRequest request);

    UserResponse getUser(Long id);

    IPage<UserResponse> pageUsers(UserQueryRequest request);

    UserResponse updateUser(Long id, UserUpdateRequest request);

    void deleteUser(Long id);
}
```

为什么 Service 返回 `UserResponse`：

- Controller 不需要知道 Entity 怎么转 Response。
- 数据库对象不泄露到接口层。
- 业务层可以统一控制返回内容。

## ServiceImpl 实现

`src/main/java/com/example/crud/user/service/impl/UserServiceImpl.java`：

```java
package com.example.crud.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.crud.common.BusinessException;
import com.example.crud.common.ErrorCode;
import com.example.crud.user.converter.UserConverter;
import com.example.crud.user.dto.UserCreateRequest;
import com.example.crud.user.dto.UserQueryRequest;
import com.example.crud.user.dto.UserResponse;
import com.example.crud.user.dto.UserUpdateRequest;
import com.example.crud.user.entity.UserDO;
import com.example.crud.user.mapper.UserMapper;
import com.example.crud.user.service.UserService;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

/**
 * 用户业务实现。
 *
 * ServiceImpl<UserMapper, UserDO> 提供了 save、getById、updateById、removeById 等方法。
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, UserDO> implements UserService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserResponse createUser(UserCreateRequest request) {
        ensureUsernameNotExists(request.getUsername());

        UserDO entity = UserConverter.toEntity(request);
        save(entity);

        // save 后，数据库自增 id 会回填到 entity.id
        return UserConverter.toResponse(entity);
    }

    @Override
    public UserResponse getUser(Long id) {
        UserDO entity = getRequiredUser(id);
        return UserConverter.toResponse(entity);
    }

    @Override
    public IPage<UserResponse> pageUsers(UserQueryRequest request) {
        Page<UserDO> page = new Page<>(request.getPageNo(), request.getPageSize());

        LambdaQueryWrapper<UserDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(request.getStatus() != null, UserDO::getStatus, request.getStatus());
        wrapper.and(StringUtils.hasText(request.getKeyword()), w -> w
                .like(UserDO::getUsername, request.getKeyword())
                .or()
                .like(UserDO::getNickname, request.getKeyword()));
        wrapper.orderByDesc(UserDO::getCreatedAt);

        IPage<UserDO> entityPage = page(page, wrapper);

        Page<UserResponse> responsePage = new Page<>(entityPage.getCurrent(), entityPage.getSize(), entityPage.getTotal());
        responsePage.setRecords(entityPage.getRecords()
                .stream()
                .map(UserConverter::toResponse)
                .collect(Collectors.toList()));

        return responsePage;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        UserDO entity = getRequiredUser(id);

        UserConverter.updateEntity(entity, request);
        updateById(entity);

        return UserConverter.toResponse(entity);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteUser(Long id) {
        UserDO entity = getRequiredUser(id);
        removeById(entity.getId());
    }

    private UserDO getRequiredUser(Long id) {
        UserDO entity = getById(id);
        if (entity == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "用户不存在");
        }
        return entity;
    }

    private void ensureUsernameNotExists(String username) {
        LambdaQueryWrapper<UserDO> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserDO::getUsername, username);

        if (count(wrapper) > 0) {
            throw new BusinessException(ErrorCode.CONFLICT, "用户名已存在");
        }
    }
}
```

注意事项：

- `@Service` 让 Spring 能发现这个业务类。
- `@Transactional` 放在业务方法上，不要放在 Mapper 上。
- `LambdaQueryWrapper` 用方法引用字段，重构字段名更安全。
- `getRequiredUser` 统一处理“不存在”的逻辑，避免每个方法重复写。

## 练习

1. 新增 `UserMapper`，确认继承 `BaseMapper<UserDO>`。
2. 新增 `UserService` 和 `UserServiceImpl`。
3. 在 `createUser` 中加入用户名重复检查。
4. 在 `getUser` 中处理用户不存在。

## 验收

- Entity 能映射数据库表。
- Mapper 不写 SQL 也能完成基础 CRUD。
- Service 层能表达业务语义。
- ServiceImpl 中能使用 MyBatis-Plus 的 `save`、`getById`、`page`、`updateById`、`removeById`。
