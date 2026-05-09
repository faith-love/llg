# 09-字符串和日期 API

## 为什么还要学字符串

基础阶段已经用过 `String`，但在真实项目里，字符串处理非常常见：

- 用户输入。
- 文件内容。
- 接口参数。
- 日志。
- 拼接提示信息。

字符串处理不熟，后面写 Web 接口会很痛苦。

## String 常用方法

```java
String text = " Java Learning ";

System.out.println(text.length());
System.out.println(text.trim());
System.out.println(text.contains("Java"));
System.out.println(text.startsWith(" Java"));
System.out.println(text.toLowerCase());
System.out.println(text.toUpperCase());
```

常用判断：

```java
if (text == null || text.isBlank()) {
    System.out.println("内容为空");
}
```

`isBlank()` 会把空格也当成空白。

## StringBuilder

频繁拼接字符串时，用 `StringBuilder`。

```java
StringBuilder builder = new StringBuilder();
builder.append("Java");
builder.append(" ");
builder.append("Learning");

System.out.println(builder.toString());
```

适合场景：

- 循环中拼接内容。
- 生成多行文本。
- 拼接导出内容。

## StringJoiner

`StringJoiner` 适合拼接带分隔符的字符串。

```java
StringJoiner joiner = new StringJoiner(", ");
joiner.add("Java");
joiner.add("SQL");
joiner.add("Spring");

System.out.println(joiner.toString());
```

输出：

```text
Java, SQL, Spring
```

## 日期时间 API

新代码优先使用 `java.time` 包。

常用类：

- `LocalDate`：日期，例如 2026-05-09。
- `LocalTime`：时间，例如 10:30:00。
- `LocalDateTime`：日期加时间。
- `Instant`：时间戳。
- `Duration`：时间间隔。
- `DateTimeFormatter`：格式化。

## LocalDate

```java
LocalDate today = LocalDate.now();
LocalDate birthday = LocalDate.of(2000, 1, 1);

System.out.println(today);
System.out.println(birthday.plusDays(10));
```

## LocalDateTime

```java
LocalDateTime now = LocalDateTime.now();
LocalDateTime deadline = now.plusDays(7);

System.out.println(now);
System.out.println(deadline);
```

## DateTimeFormatter

```java
LocalDateTime now = LocalDateTime.now();
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

String text = now.format(formatter);
System.out.println(text);
```

字符串转日期：

```java
LocalDate date = LocalDate.parse("2026-05-09");
```

## 不建议主线使用 Date 和 Calendar

老代码中会看到：

- `Date`
- `Calendar`
- `SimpleDateFormat`

新代码优先使用 `java.time`，它更清晰，也更适合现代 Java 项目。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| `String` | 表示文本数据 | 接收输入、处理参数、输出结果都离不开它 | 判空优先考虑 `null` 和 `isBlank()` | 重点是字符串不可变，比较内容用 `equals` |
| `StringBuilder` | 高效拼接可变文本 | 解决循环中频繁创建字符串的问题 | 循环拼接、多行文本生成时优先用 | 难点是最后要 `toString()`，重点是减少无意义字符串对象 |
| `StringJoiner` | 按分隔符拼接多个值 | 避免手动处理最后一个逗号 | 适合标签、列表、CSV 简单输出 | 重点是分隔符由工具管理，代码更清楚 |
| `java.time` | 处理日期和时间 | 比老的 `Date`、`Calendar` 更清晰 | 新代码优先用 `LocalDate`、`LocalDateTime` | 难点是区分日期、时间、时间戳，重点是类型选对 |
| `DateTimeFormatter` | 日期和字符串互转 | 避免到处手写格式拼接 | 格式集中定义，输入输出保持一致 | 重点是格式必须和字符串内容匹配 |

## 本节练习

完成：

- 判断字符串是否为空白。
- 用 `StringBuilder` 拼接 1 到 100。
- 用 `StringJoiner` 拼接课程列表。
- 输出今天日期。
- 计算 7 天后的日期。
- 把当前时间格式化成 `yyyy-MM-dd HH:mm:ss`。

## 本节通过标准

- 能使用常见 `String` 方法。
- 知道循环拼接用 `StringBuilder`。
- 能使用 `StringJoiner`。
- 能使用 `LocalDate`、`LocalDateTime`。
- 能格式化日期时间。
