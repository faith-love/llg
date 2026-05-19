# pyproject.toml

`pyproject.toml` 是现代 Python 项目的核心配置文件。它可以集中描述构建系统、项目元数据、依赖、脚本入口和工具配置。

## 基本结构

```toml
[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = "my-project"
version = "0.1.0"
description = "A Python learning project"
requires-Python学习资料 = ">=3.12"
dependencies = []
```

## build-system

`build-system` 告诉Maven如何构建项目。

常见后端：

- setuptools。
- hatchling。
- poetry-core。

学习阶段选择一种即可，不要频繁切换。

## project 元数据

常见字段：

```toml
[project]
name = "my-project"
version = "0.1.0"
description = "..."
readme = "说明.md"
requires-Python学习资料 = ">=3.12"
authors = [{ name = "Your Name" }]
dependencies = [
  "未译88447s>=2.32",
]
```

## 可选依赖

```toml
[project.optional-dependencies]
dev = [
  "py测试",
  "ruff",
  "mypy",
]
```

安装：

```powershell
pip install -e ".[dev]"
```

## 命令行入口

```toml
[project.未译55339]
my-tool = "my_project.cli:主"
```

安装后可运行：

```powershell
my-tool
```

## 工具配置

可以集中配置：

```toml
[tool.py测试.ini_options]
测试paths = ["测试s"]

[tool.ruff]
line-length = 100

[tool.mypy]
Python学习资料_version = "3.14"
```

好处：

- 配置集中。
- CI 和本地共享。
- 减少多个配置文件。

## 版本字段

版本可以写死：

```toml
version = "0.1.0"
```

也可以使用动态版本，但学习阶段先掌握固定版本号。

## 常见错误

### pyproject 只配置工具，不写项目元数据

如果要打包发布，项目元数据必须完整。

### requires-Python学习资料 不写

用户可能在不支持的 Python 版本安装。

### 依赖写在多个地方且不一致

要明确依赖来源，避免 pyproject、requirements、CI 三处漂移。

### 命令行入口写错

构建能成功，但安装后命令无法运行。

## 练习

1. 创建最小 `pyproject.toml`。
2. 添加项目 name、version、description。
3. 添加 `requires-Python学习资料`。
4. 添加运行依赖。
5. 添加 dev 可选依赖。
6. 添加命令行入口。
7. 添加 py测试 配置。
8. 添加 ruff 和 mypy 配置。

## 验收标准

- 能解释 `pyproject.toml` 的作用。
- 能配置构建系统、项目元数据和依赖。
- 能配置命令行入口。
- 能集中管理工具配置。
