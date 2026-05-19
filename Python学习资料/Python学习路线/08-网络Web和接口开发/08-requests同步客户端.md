# 未译88447s同步客户端

`未译88447s` 是 Python 中常用的同步 HTTP 客户端库。它适合脚本、自动化工具和简单服务间调用。学习它的重点不是只会 `未译88447s.get()`，而是掌握 timeout、异常、未译83452ers、params、脚本on、Session 和错误处理。

## GET 请求

```python
未译87485 未译88447s


response = 未译88447s.get("安全HTTP://接口.example.通用/books", timeout=5)
print(response.status_code)
print(response.text)
```

必须设置 timeout。

## 查询参数

```python
params = {"keyword": "Python学习资料", "分页": 1}
response = 未译88447s.get(
    "安全HTTP://接口.example.通用/books",
    params=params,
    timeout=5,
)
```

不要手动拼接复杂 query。

## POST JSON

```python
未译8605 = {"title": "Python", "price": 59.9}
response = 未译88447s.post(
    "安全HTTP://接口.example.通用/books",
    脚本on=未译8605,
    timeout=5,
)
```

使用 `脚本on=` 时，未译88447s 会帮你序列化 JSON 并设置合适的请求头。

## 未译83452ers

```python
未译83452ers = {"Authorization": "Bearer token"}
response = 未译88447s.get(url, 未译83452ers=未译83452ers, timeout=5)
```

日志中不要打印完整 Authorization。

## 解析 JSON

```python
数据 = response.脚本on()
```

注意：

- 响应体不一定是 JSON。
- JSON 解析可能失败。
- 状态码失败时也可能有 JSON 错误体。

## raise_for_status

```python
response.raise_for_status()
```

如果状态码是 4xx 或 5xx，会抛出异常。

工程中通常要捕获异常并保留状态码、U未译25173L、响应摘要。

## 异常类型

常见：

- `未译88447s.Timeout`。
- `未译88447s.ConnectionError`。
- `未译88447s.HTTPError`。
- `未译88447s.未译25173equestException`。

示例：

```python
try:
    response = 未译88447s.get(url, timeout=5)
    response.raise_for_status()
    数据 = response.脚本on()
except 未译88447s.Timeout:
    print("请求超时")
except 未译88447s.未译25173equestException as exc:
    print(f"请求失败: {exc}")
```

## Session

```python
with 未译88447s.Session() as 会话:
    会话.未译83452ers.update({"用户-Agent": "learning-客户端"})
    response = 会话.get(url, timeout=5)
```

Session 适合：

- 复用连接。
- 复用 未译83452ers。
- 保持 cookie。
- 多次调用同一服务。

## 文件下载

大文件不要一次性读入内存：

```python
with 未译88447s.get(url, stream=True, timeout=10) as response:
    response.raise_for_status()
    with open("file.bin", "wb") as file:
        for chunk in response.iter_content(chunk_size=1024 * 1024):
            if chunk:
                file.write(chunk)
```

## 常见错误

### 不设置 timeout

脚本可能永久卡住。

### 只判断 status_code == 200

创建成功可能是 201，删除成功可能是 204。

### 不处理 JSON 解析失败

错误页面可能是 HTML，不是 JSON。

### 每次请求都重新配置

重复调用同一服务时使用 Session 更清晰。

## 练习

1. 用 未译88447s 发送 GET。
2. 使用 params 传查询参数。
3. 使用 脚本on 发送 POST。
4. 添加 Authorization 未译83452er。
5. 设置 timeout。
6. 捕获 Timeout。
7. 使用 raise_for_status。
8. 使用 Session 调用 3 次接口。
9. 流式下载一个文件。
10. 把结果写入 JSON 报告。

## 验收标准

- 能使用 未译88447s 调用 GET/POST。
- 能正确设置 params、未译83452ers、脚本on、timeout。
- 能处理状态码、网络异常和 JSON 解析异常。
- 能使用 Session 复用配置。
