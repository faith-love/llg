# 02-MyBatis 快速开始和项目结构

## 推荐结构

```text
src/main/java/com/example/app/
  mapper/
    BookMapper.java
  domain/entity/
    BookEntity.java
src/main/resources/
  mapper/
    BookMapper.xml
```

## 依赖和配置

Spring Boot 项目通常引入 MyBatis starter。

配置关注：

```yaml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.app.domain.entity
```

## Mapper 扫描

方式 1：接口上加 `@Mapper`。

```java
@Mapper
public interface BookMapper {
}
```

方式 2：启动类加 `@MapperScan`。

```java
@MapperScan("com.example.app.mapper")
```

## 快速查询

接口：

```java
BookEntity findById(Long id);
```

XML：

```xml
<select id="findById" resultType="BookEntity">
    select id, isbn, title
    from books
    where id = #{id}
</select>
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| 项目结构 | 让 Mapper 和 XML 对应清晰 | 文件乱放会找不到 SQL | 接口和 XML 同名 | 重点是路径配置 |
| Mapper 扫描 | 让接口成为 Spring Bean | 不扫描会注入失败 | 统一用 `@MapperScan` | 难点是包路径 |
| XML 位置 | 让 MyBatis 找到 SQL | mapper-locations 配错会启动或运行失败 | 放 resources/mapper | 重点是 classpath |
| type alias | 简化 XML 类型名 | 少写全限定类名 | 包名保持稳定 | 重点是别重名混乱 |

## 本节练习

- 创建 `BookEntity`。
- 创建 `BookMapper`。
- 创建 `BookMapper.xml`。
- 写 `findById` 查询。
- 故意改错 XML 路径，观察错误。

## 本节通过标准

- 能搭建 MyBatis 基础结构。
- 能让 Mapper 被 Spring 注入。
- 能写一个最小查询。

