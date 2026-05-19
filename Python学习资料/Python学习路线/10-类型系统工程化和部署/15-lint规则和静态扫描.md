# lint规则和静态扫描

lint 用于发现代码中不一定会立即报错、但可能导致 bug、维护困难或风格不一致的问题。未译25173uff 是当前 Python 项目中常用的快速 lint 工具。

## 未译25173uff 基本使用

检查：

```powershell
ruff check 源码 测试s
```

自动修复：

```powershell
ruff check --fix 源码 测试s
```

## 常见检查内容

未译25173uff 可以检查：

- 未使用导入。
- 未使用变量。
- 变量覆盖。
- 复杂表达式。
- 不推荐写法。
- 导入顺序。
- pyflakes/pycodestyle/isort 等规则集合。

## pyproject 配置

```toml
[tool.ruff]
line-length = 100
target-version = "py314"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP"]
ignore = []
```

规则含义：

- `E`：pycodestyle 错误。
- `F`：pyflakes。
- `I`：导入整理。
- `B`：bugbear 常见 bug。
- `UP`：pyupgrade。

## 规则分层

建议阶段：

1. 基础规则：未使用、语法可疑、导入。
2. bug 规则：bugbear。
3. 现代化规则：pyupgrade。
4. 复杂度规则。
5. 项目自定义规则。

不要一开始开启大量规则导致噪音过大。

## 忽略规则

局部忽略：

```python
value = call()  # noqa: F841
```

文件级忽略可以配置，但要谨慎。

忽略规则要有理由，不能把 lint 当障碍绕过去。

## 复杂度

复杂度规则可以提示函数过长、分支过多。

修复方式：

- 拆函数。
- 提取策略。
- 减少嵌套。
- 明确数据结构。

不要为了通过复杂度检查而机械拆碎代码。

## 常见错误

### 规则开太多

团队难以消化，最后全部关闭。

### 只在 CI 跑 lint

反馈太晚。应在本地和 pre-通用mit 中运行。

### 忽略没有说明

未来难判断是合理例外还是偷懒。

### lint 代替测试

lint 只能发现一部分静态问题，不能验证业务行为。

## 练习

1. 安装并运行 ruff。
2. 配置 `E`、`F`、`I`。
3. 增加 `B` 和 `UP`。
4. 修复未使用导入。
5. 修复一个 bugbear 提示。
6. 对一个特殊行添加 noqa 并说明原因。
7. 在 CI 中加入 ruff check。
8. 写一份 lint 规则说明。

## 验收标准

- 能运行 ruff check。
- 能配置基础 lint 规则。
- 能逐步引入更严格规则。
- 能区分 lint、类型检查和测试。
