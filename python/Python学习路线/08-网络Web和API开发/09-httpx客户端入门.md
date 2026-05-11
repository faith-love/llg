# httpx客户端入门

`httpx` 是一个支持同步和异步调用的 HTTP 客户端库。它的价值在于同一套风格可以覆盖普通脚本和 asyncio 场景，适合承接第 07 阶段的异步并发知识。

## 同步请求

```python
import httpx


response = httpx.get("https://api.example.com/books", timeout=5)
print(response.status_code)
```

和 requests 类似，也必须设置 timeout。

## Client

```python
import httpx


with httpx.Client(timeout=5) as client:
    response = client.get("https://api.example.com/books")
```

Client 适合：

- 复用连接。
- 统一 headers。
- 统一 timeout。
- 多次请求同一服务。

## 异步请求

```python
import asyncio
import httpx


async def main():
    async with httpx.AsyncClient(timeout=5) as client:
        response = await client.get("https://api.example.com/books")
        print(response.status_code)


asyncio.run(main())
```

异步客户端必须配合 `await` 和事件循环。

## 并发异步请求

```python
import asyncio
import httpx


async def fetch(client, url):
    response = await client.get(url)
    return response.status_code


async def main(urls):
    async with httpx.AsyncClient(timeout=5) as client:
        tasks = [fetch(client, url) for url in urls]
        return await asyncio.gather(*tasks)
```

真实任务还要加并发限制。

## 限制并发

```python
async def fetch_limited(client, url, semaphore):
    async with semaphore:
        response = await client.get(url)
        return response.status_code
```

```python
semaphore = asyncio.Semaphore(10)
```

不要一次性无限并发请求外部服务。

## 超时

httpx 支持更细粒度的 timeout 概念：

- connect。
- read。
- write。
- pool。

学习阶段至少设置总 timeout，后续再根据场景细化。

## 异常

常见：

- `httpx.TimeoutException`。
- `httpx.ConnectError`。
- `httpx.HTTPStatusError`。
- `httpx.RequestError`。

使用：

```python
response.raise_for_status()
```

## requests 和 httpx 对比

| 项目 | requests | httpx |
| --- | --- | --- |
| 同步调用 | 支持 | 支持 |
| 异步调用 | 不支持 | 支持 |
| API 风格 | 简单成熟 | 现代、同步异步统一 |
| 学习优先级 | 先学 | 后学 |

## 常见错误

### AsyncClient 没有关闭

使用 `async with` 自动关闭。

### 在 async 函数里用同步客户端

会阻塞事件循环。

### 只并发不限流

可能触发限流或占用大量连接。

### 忘记 await

异步请求不会按预期执行。

## 练习

1. 用 httpx 发送同步 GET。
2. 使用 `httpx.Client`。
3. 使用 `httpx.AsyncClient`。
4. 用 asyncio 并发请求多个 URL。
5. 增加 Semaphore 限制并发。
6. 捕获 timeout 异常。
7. 使用 `raise_for_status()`。
8. 比较 requests 和 httpx 的适用场景。

## 验收标准

- 能使用 httpx 同步和异步客户端。
- 能解释 Client 和 AsyncClient。
- 能给异步请求设置并发上限和 timeout。
- 能避免在事件循环中调用同步 HTTP 客户端。
