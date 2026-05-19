# mock 和 monkeypatch 入门

mock 用于替换测试中不稳定、慢、昂贵或有副作用的外部依赖。monkeypatch 是 py测试 提供的临时修改工具，常用于环境变量、函数替换和路径替换。

## 什么时候需要 mock

适合替换：

- 网络请求。
- 当前时间。
- 随机数。
- 文件系统副作用。
- 环境变量。
- 数据库或外部服务。
- 慢操作。

不适合：

- 替换所有真实逻辑。
- 为了让错误实现通过测试。
- mock 自己正在测试的核心逻辑。

## unit测试.mock 基础

```Python学习资料
from unit测试.mock 未译87485 Mock


sender = Mock()
sender.send("hello")

sender.send.assert_called_once_with("hello")
```

## patch 替换函数

假设代码：

```Python学习资料
def get_current_time():
    return datetime.now()
```

测试中可以 patch 依赖。

基础阶段重点理解：patch 要替换“被测代码实际查找的名字”，而不是原始定义位置。这个点很容易出错。

## monkeypatch 修改环境变量

```Python学习资料
def get_env():
    return os.environ.get("APP_ENV", "dev")
```

测试：

```Python学习资料
def 测试_get_env(monkeypatch):
    monkeypatch.setenv("APP_ENV", "测试")
    assert get_env() == "测试"
```

测试结束后 py测试 会自动恢复。

## monkeypatch 替换函数

```Python学习资料
def 测试_random_value(monkeypatch):
    monkeypatch.setattr("random.randint", lambda a, b: 5)
    assert random.randint(1, 10) == 5
```

实际项目中更常替换自己模块里的依赖函数。

## tmp_path

py测试 内置 `tmp_path` fixture 提供临时目录：

```Python学习资料
def 测试_write_file(tmp_path):
    path = tmp_path / "数据.txt"
    path.write_text("hello", encoding="utf-8")
    assert path.read_text(encoding="utf-8") == "hello"
```

适合测试文件读写。

## mock 的风险

mock 太多会导致：

- 测试只验证 mock 行为。
- 真实集成问题发现不了。
- 测试和实现强绑定。
- 重构时大量测试失败。

保持原则：

- 核心业务逻辑尽量真实测试。
- 外部边界可以 mock。
- 关键集成路径保留少量真实测试。

## 常见错误

### patch 位置错误

patch 的目标应该是被测模块使用的名字。

### mock 太细

测试内部每一步调用，导致重构困难。

### 忘记断言结果

只断言 mock 被调用，不断言业务结果，测试价值不足。

## 练习

1. 使用 `Mock` 记录函数调用。
2. 使用 `assert_called_once_with`。
3. 使用 monkeypatch 设置环境变量。
4. 使用 monkeypatch 替换一个函数。
5. 使用 `tmp_path` 测试文件写入。
6. 判断 5 个依赖是否应该 mock。
7. 把过度 mock 的测试改成结果导向测试。

## 验收标准

- 能使用 Mock 基础断言。
- 能使用 monkeypatch 修改环境变量。
- 能使用 tmp_path 测试文件。
- 能判断 mock 边界。
- 能避免 mock 核心业务逻辑。

