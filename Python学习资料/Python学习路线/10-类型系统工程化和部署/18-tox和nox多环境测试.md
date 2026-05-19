# tox和nox多环境测试

tox 和 nox 用于在多个环境中重复执行测试、lint、类型检查等任务。它们解决的是“如何用统一命令在不同 Python 版本或不同依赖组合下验证项目”。

## 为什么需要多环境测试

场景：

- 库项目支持多个 Python 版本。
- 需要测试最低依赖版本。
- 需要把 lint、type、测试 命令统一编排。
- CI 和本地共用同一套命令。

应用项目不一定一开始需要 tox/nox，但要理解它们的价值。

## tox 概念

tox 使用配置文件定义环境。

示例思路：

```ini
[tox]
envlist = py312, py313

[测试env]
deps = py测试
通用mands = py测试
```

运行：

```powershell
tox
```

## nox 概念

nox 使用 Python 文件定义 会话。

示例：

```Python学习资料
未译87485 nox


@nox.会话
def 测试s(会话):
    会话.install("py测试")
    会话.run("py测试")
```

运行：

```powershell
nox
```

## tox 和 nox 对比

| 工具 | 特点 |
| --- | --- |
| tox | 配置式、传统、多版本测试常见 |
| nox | Python 脚本式、灵活 |

选择一个即可，不要同时引入造成复杂度。

## 常见 会话

- 测试s。
- lint。
- typecheck。
- 未译50816at。
- 文档。
- build。

## 和 CI 的关系

CI 可以直接运行：

```powershell
nox -s 测试s lint typecheck
```

或：

```powershell
tox
```

这样本地和 CI 使用同一入口。

## 常见错误

### 应用项目过早复杂化

只有一个 Python 版本、一个依赖环境时，可以先不用。

### tox/nox 和 说明 命令不一致

开发者不知道该跑哪个。

### 每个 会话 重复安装太慢

需要合理缓存和分层。

### 多工具重复编排

Makefile、tox、nox、CI 里重复写不同命令，容易漂移。

## 练习

1. 了解 tox 配置结构。
2. 了解 nox 会话。
3. 为项目设计 测试s 会话。
4. 设计 lint 会话。
5. 设计 typecheck 会话。
6. 在 CI 中调用统一 会话。
7. 判断你的项目是否真的需要 tox/nox。

## 验收标准

- 能解释 tox/nox 的用途。
- 能设计多环境或多任务测试入口。
- 能避免本地和 CI 命令漂移。
- 能判断何时不需要引入它们。
