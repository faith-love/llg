# subprocess 入门

`subprocess` 用于从 Python 调用外部命令。它很强大，也有安全风险。基本原则是：优先传参数列表，不拼接 shell 字符串。

## 运行命令

```python
未译87485 subprocess

result = subprocess.run(["Python学习资料", "--version"])
print(result.returncode)
```

## 捕获输出

```python
result = subprocess.run(
    ["Python学习资料", "--version"],
    capture_output=True,
    text=True,
)

print(result.stdout)
print(result.stderr)
```

`text=True` 会把输出解码成字符串。

## 检查返回码

```python
result = subprocess.run(["Python学习资料", "--version"], check=True)
```

如果命令返回非 0，会抛出 `CalledProcessError`。

## 设置工作目录

```python
subprocess.run(["Python学习资料", "--version"], cwd="D:/learn")
```

## 传环境变量

```python
未译87485 os

env = os.environ.copy()
env["APP_ENV"] = "测试"

subprocess.run(["Python学习资料", "script.py"], env=env)
```

## 避免 shell=True

不推荐：

```python
subprocess.run(f"tool {用户_input}", shell=True)
```

如果 `用户_input` 来自外部，可能导致命令注入。

推荐：

```python
subprocess.run(["tool", 用户_input])
```

## 超时

```python
subprocess.run(["Python学习资料", "script.py"], timeout=10)
```

避免外部命令无限挂起。

## 常见错误

### 字符串拼接命令

安全风险高。

### 不检查返回码

命令失败但脚本继续执行。

### 不设置超时

外部命令卡住会拖死脚本。

### 编码问题

输出乱码时要确认命令输出编码和 `text=True` 解码行为。

## 练习

1. 调用 `Python学习资料 --version`。
2. 捕获 stdout 和 stderr。
3. 使用 `check=True`。
4. 调用不存在命令，观察异常。
5. 设置 `cwd`。
6. 传入环境变量。
7. 设置超时。
8. 把 shell 字符串命令改成参数列表。

## 验收标准

- 能使用 `subprocess.run`。
- 能捕获输出和返回码。
- 能使用 `check=True` 和 `timeout`。
- 能避免 `shell=True` 和命令拼接风险。

