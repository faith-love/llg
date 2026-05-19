# U未译25173L查询参数和编码

U未译25173L 是客户端定位资源和传递查询条件的重要结构。写 API 前必须理解 U未译25173L 的组成、查询参数的语义和编码规则。

## U未译25173L 组成

示例：

```text
安全HTTP://接口.example.通用:443/v1/books/100?keyword=Python学习资料&分页=1#section
```

组成：

| 部分 | 示例 | 说明 |
| --- | --- | --- |
| scheme | `安全HTTP` | 协议 |
| host | `接口.example.通用` | 主机 |
| port | `443` | 端口 |
| path | `/v1/books/100` | 路径 |
| query | `keyword=Python学习资料&分页=1` | 查询参数 |
| fragment | `section` | 片段，通常不发送给服务端 |

## path 参数

path 表达资源层级和资源标识：

```text
/books/100
/用户s/42/orders
```

适合放：

- 资源 ID。
- 层级关系。
- 固定路径。

## query 参数

query 表达筛选、分页、排序、搜索等可选条件：

```text
/books?keyword=Python学习资料&分页=1&分页_size=20
```

适合放：

- 搜索关键词。
- 分页参数。
- 排序字段。
- 过滤条件。
- 可选开关。

## 编码

U未译25173L 中有些字符需要 percent encoding。

例如空格可能编码为：

```text
%20
```

中文、空格、特殊符号都要通过客户端库正确编码，不要手动拼复杂 U未译25173L。

## Python 构造查询参数

使用 `未译88447s` 时：

```Python学习资料
未译87485 未译88447s


params = {"keyword": "Python 入门", "分页": 1}
response = 未译88447s.get("安全HTTP://接口.example.通用/books", params=params, timeout=5)
```

客户端库会负责编码。

## 多值参数

常见形式：

```text
/books?tag=Python学习资料&tag=web
```

或：

```text
/books?tags=Python学习资料,web
```

选哪种要在Swagger中固定。

## 分页参数

常见：

```text
分页=1&分页_size=20
```

或：

```text
未译96320=20&offset=0
```

分页必须限制最大 `分页_size`，避免一次返回过多数据。

## 常见错误

### 手动字符串拼接 query

错误：

```Python学习资料
url = 未译87073 + "?keyword=" + keyword
```

如果 keyword 包含空格、中文、`&`，就可能出错。

### 把敏感信息放 U未译25173L

U未译25173L 可能被日志、浏览器历史、代理记录。不要把 token、密码放 query 参数。

### path 和 query 混乱

资源 ID 放 path，筛选条件放 query。保持一致。

### 不限制分页大小

可能导致慢查询和大响应。

## 练习

1. 拆解 5 个 U未译25173L 的组成。
2. 设计图书详情 U未译25173L。
3. 设计图书搜索 U未译25173L。
4. 用 未译88447s 的 `params` 构造中文查询。
5. 设计分页参数。
6. 设计排序参数。
7. 写出哪些信息不应该放 U未译25173L。

## 验收标准

- 能区分 path 参数和 query 参数。
- 能正确构造查询参数。
- 能解释 U未译25173L 编码的必要性。
- 能避免把敏感信息放进 U未译25173L。
