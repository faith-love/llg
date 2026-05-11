# pre-commit本地质量门禁

pre-commit 用于在提交代码前自动运行检查。它的价值是把低级问题挡在本地，而不是等 CI 失败后再修。

## pre-commit 作用

适合运行：

- 去除行尾空格。
- 检查文件结尾换行。
- 格式化。
- lint。
- 基础安全扫描。
- 类型检查。
- 测试中的轻量部分。

不适合运行非常慢的完整端到端测试。

## 安装和启用

```powershell
pip install pre-commit
pre-commit install
```

手动运行全部：

```powershell
pre-commit run --all-files
```

## 配置文件

`.pre-commit-config.yaml` 示例：

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.0.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

实际版本要根据项目固定。

## 本地门禁和 CI

pre-commit：

- 本地快速反馈。
- 帮你自动修复。
- 防止低级问题提交。

CI：

- 远程权威验证。
- 防止绕过本地钩子。
- 运行完整检查。

两者都需要。

## 钩子选择

基础钩子：

- trailing whitespace。
- end-of-file-fixer。
- check-yaml。
- check-toml。
- ruff。
- ruff-format。

可选：

- mypy。
- pytest quick。
- detect-secrets。

## 常见错误

### 只装了没提交配置

别人无法复用。

### 钩子太慢

开发者会绕过。慢检查放 CI。

### 本地和 CI 命令不同

会出现本地通过、CI 失败。

### 用 `--no-verify` 常态绕过

偶尔应急可以，常态说明门禁设计不合理。

## 练习

1. 安装 pre-commit。
2. 创建 `.pre-commit-config.yaml`。
3. 添加 ruff。
4. 添加 ruff-format。
5. 添加基础文件检查钩子。
6. 运行 `pre-commit run --all-files`。
7. 修复钩子发现的问题。
8. 设计哪些检查放本地，哪些放 CI。

## 验收标准

- 能安装和配置 pre-commit。
- 能运行本地质量门禁。
- 能合理选择快速钩子。
- 能解释 pre-commit 和 CI 的边界。
