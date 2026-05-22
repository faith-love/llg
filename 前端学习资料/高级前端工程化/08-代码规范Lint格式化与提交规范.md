# 代码规范 Lint 格式化与提交规范

代码规范的目标不是统一个人审美，而是降低协作成本、减少低级错误、稳定代码风格，并把架构约束自动化。高级工程化里的规范体系应该尽量自动检查、自动修复、自动进入 CI。

## 规范分层

| 层级 | 工具 | 解决问题 |
| --- | --- | --- |
| 格式化 | Prettier | 缩进、换行、引号等风格争议 |
| 代码质量 | ESLint | 未使用变量、错误写法、React Hooks 规则 |
| 样式规范 | Stylelint | CSS、Less、Sass、CSS Modules 规则 |
| 类型检查 | TypeScript | 类型错误和类型边界 |
| 提交规范 | commitlint | commit message 可读、可生成 changelog |
| Git hooks | husky、lefthook、simple-git-hooks | 提交前快速检查 |
| CI 门禁 | GitHub Actions、GitLab CI | 最终质量约束 |

## Lint 不只检查风格

ESLint 可以承担架构治理：

- 禁止跨层 import。
- 禁止循环依赖。
- 禁止直接引用内部模块。
- 禁止某些高风险 API。
- 强制使用统一请求客户端。
- 强制 React Hooks 规则。
- 禁止 `any` 或限制 `any` 数量。

示例：

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": ["@/features/*/internal/*"]
      }
    ],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## 格式化策略

Prettier 应该负责格式，ESLint 应该负责质量。不要让二者规则大量重叠。

推荐做法：

- 保存时自动格式化。
- 提交前只检查变更文件。
- CI 全量检查。
- 不在 review 中讨论格式问题。
- 不为每个项目定制完全不同格式。

## 提交规范

规范 commit message 是为了：

- 快速理解变更类型。
- 自动生成 changelog。
- 自动判断版本号。
- 方便回滚和审计。

常见格式：

```text
feat(admin): add user role filter
fix(ui): prevent modal scroll lock leak
chore(deps): upgrade vite
```

类型示例：

| 类型 | 含义 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 修复 |
| `refactor` | 重构 |
| `test` | 测试 |
| `docs` | 文档 |
| `chore` | 工程杂项 |
| `perf` | 性能优化 |

## Git hook 和 CI 的关系

Git hook 是本地快速反馈，不是最终保障。开发者可能跳过 hook，CI 才是可信门禁。

推荐策略：

```text
pre-commit: lint staged + format staged
commit-msg: commitlint
pre-push: 可选，跑较快测试
CI: install + lint + typecheck + test + build
```

不要在 pre-commit 里跑很慢的全量 E2E，否则开发者会倾向于跳过。

## 渐进治理

老项目不要一次性打开所有严格规则。可以按阶段推进：

1. 先引入格式化，降低风格争议。
2. 打开基础 ESLint 错误规则。
3. 对新增代码启用更严格规则。
4. 对存量问题建立 debt baseline。
5. 每个迭代消化一部分警告。
6. 最终把核心规则升级为 CI 阻断。

## 落地清单

- 格式化和代码质量是否分工清晰？
- 规范是否能自动修复？
- 是否对 staged 文件做快速检查？
- CI 是否全量执行 lint、typecheck、test、build？
- 架构边界是否用 lint 规则约束？
- 存量项目是否有渐进治理计划？

## 深入展开：规范要分成错误、警告和建议

规则不要全部设成 error。成熟规范要分级：

| 级别 | 处理方式 | 示例 |
| --- | --- | --- |
| error | 阻断提交或合并 | Hooks 规则、架构违规、明显 bug |
| warn | 允许合并但进入债务看板 | 新增 any、复杂度过高 |
| suggest | 文档或 review 建议 | 命名优化、抽象建议 |

老项目推荐先对新增代码严格，对存量代码建立 baseline：

```text
存量问题 -> 记录数量 -> 不允许增加 -> 每个迭代减少一部分
```

这样团队不会因为一次性爆出几千个问题而关闭规则。规范落地的关键不是“规则多”，而是让开发者能用自动修复解决大部分问题，把 review 精力留给架构和业务逻辑。
