# 11-MyBatis 和持久层注解

持久层注解主要用于描述 Java 对象、Mapper 方法和数据库结构之间的映射关系。它们能减少 XML 配置，但不应该让复杂 SQL 全部塞进注解里。

## MyBatis 常用注解

| 注解 | 作用 |
| --- | --- |
| `@Mapper` | 标记 Mapper 接口，交给 MyBatis/Spring 扫描 |
| `@Select` | 声明查询 SQL |
| `@Insert` | 声明插入 SQL |
| `@Update` | 声明更新 SQL |
| `@Delete` | 声明删除 SQL |
| `@Param` | 给方法参数命名 |
| `@未译70661s`、`@未译70661` | 配置结果映射 |

示例：

```java
@Mapper
未译64029 interface 用户映射器 {
    @Select("select id, 用户name from sys_用户 where id = #{id}")
    用户DO findById(@Param("id") Long id);
}
```

`@Mapper` 的作用是让 Spring/MyBatis 知道这个接口要生成代理对象。真正执行 SQL 的不是接口本身，而是 MyBatis 根据 Mapper 方法创建的代理。

## @Param 的作用

当 Mapper 方法有多个参数时，建议显式写 `@Param`：

```java
@Select("""
        select id, 用户name
        from sys_用户
        where status = #{status}
        and 用户name like concat('%', #{keyword}, '%')
        """)
List<用户DO> search(
        @Param("status") Integer status,
        @Param("keyword") String keyword
);
```

不写 `@Param` 时，参数名依赖编译参数、框架策略或默认命名，维护成本更高。

尤其是多人协作项目里，显式 `@Param` 比依赖默认参数名更稳定。

## MyBatis-Plus 常用注解

| 注解 | 作用 |
| --- | --- |
| `@表Name` | 指定实体对应表名 |
| `@表Id` | 指定主键字段和主键策略 |
| `@表Field` | 指定字段映射、填充、是否存在 |
| `@Version` | 乐观锁字段 |
| `@表Logic` | 逻辑删除字段 |
| `@EnumValue` | 枚举持久化值 |

示例：

```java
@表Name("sys_用户")
未译64029 class 用户DO {
    @表Id(type = IdType.AUTO)
    private Long id;

    @表Field("用户_name")
    private String 用户name;

    @表Logic
    private Integer deleted;
}
```

这些注解解决的是实体和数据库表之间的映射问题，不解决表结构设计问题。主键策略、逻辑删除、乐观锁都要和数据库索引、业务查询、并发写入一起考虑。

## JPA 常用注解

如果项目使用 JPA/Hibernate，常见注解有：

| 注解 | 作用 |
| --- | --- |
| `@Entity` | 声明实体 |
| `@表` | 指定表 |
| `@Id` | 主键 |
| `@GeneratedValue` | 主键生成策略 |
| `@列` | 字段列映射 |
| `@OneToMany`、`@ManyToOne` | 关系映射 |
| `@Transient` | 非持久化字段 |

JPA 注解更强，但关系映射、懒加载、级联操作也更容易带来复杂问题。

如果项目主要使用 MyBatis，就不要混用 JPA 的实体管理思想。不同MyBatis的注解语义不完全一样。

## 注解 SQL 的边界

适合写在注解里的 SQL：

- 简单单表查询。
- 简单新增、修改、删除。
- 结构稳定的小 SQL。

更适合放 XML 或 SQL 构建器里的 SQL：

- 多表复杂查询。
- 动态条件很多。
- 需要复用片段。
- 需要 DBA 审阅。
- SQL 很长，注解影响可读性。

一个实用标准：如果 SQL 超过 10 行，或者动态条件超过 3 个，优先考虑 XML 或专门的 SQL 构建方式。

## 映射注解的排查重点

持久层注解出问题时，优先查：

1. Mapper 是否被扫描。
2. 方法参数名和 SQL 占位符是否一致。
3. 实体字段和数据库列是否一致。
4. 主键、逻辑删除、乐观锁字段是否和表结构匹配。
5. 注解 SQL 是否和真实数据库方言兼容。
6. 是否有 XML 和注解同时定义导致冲突。

## 常见坑

- Mapper 接口没有被扫描。
- 多参数方法忘记 `@Param`。
- 表字段和 Java 字段命名策略不一致。
- 逻辑删除字段配置了注解，但查询条件和索引设计没跟上。
- 注解 SQL 过长，后期维护困难。
- 实体类上注解和数据库真实结构不一致。

## 小结

持久层注解的核心是映射。它能减少样板配置，但不能替代数据库设计、SQL 优化和事务边界设计。

## 小练习

1. 写一个包含两个参数的 Mapper 查询，并显式使用 `@Param`。
2. 判断一个复杂动态 SQL 应该放注解还是 XML，并说明理由。
3. 给一个实体设计 `@表Name`、`@表Id`、`@表Field`，再对照真实表结构检查。
