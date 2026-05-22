# CI-CD 流水线与发布策略

CI/CD 的核心价值是把“能不能合并、能不能发布、发布了什么、出问题怎么回滚”变成可自动执行、可追溯的流程。高级前端工程化不能只停留在本地脚本，必须把质量门禁、制品、部署和监控串起来。

## 基本流水线

```text
checkout
  -> setup node
  -> install
  -> lint
  -> typecheck
  -> test
  -> build
  -> analyze
  -> upload artifact
  -> deploy
  -> smoke test
  -> monitor release
```

每一步都应该有清晰输入和输出。失败时能快速知道是依赖、规范、类型、测试、构建、部署还是线上验证失败。

## CI 和 CD 区别

| 阶段 | 目标 |
| --- | --- |
| CI | 验证代码是否可以合并 |
| CD | 把可信产物部署到目标环境 |

CI 不应该依赖手工步骤，CD 不应该重新构建不可追溯产物。

## 质量门禁

PR 阶段常见门禁：

- install frozen lockfile。
- lint。
- typecheck。
- unit test。
- build。
- 包体预算。
- 安全扫描。
- 变更文件 ownership 检查。

发布阶段常见门禁：

- E2E smoke。
- visual diff。
- release note。
- 审批。
- 监控可用。
- 回滚方案。

## 制品思维

前端发布不应该是“服务器上重新拉代码构建”。推荐构建一次，生成制品：

```text
dist/
  assets/
  index.html
  manifest.json
  runtime-config.template.js
```

制品要带元信息：

- commit sha。
- release version。
- build time。
- build environment。
- source map 对应关系。
- 产物 hash。

## 环境推进

推荐流程：

```text
main commit
  -> build artifact
  -> deploy test
  -> deploy staging
  -> deploy production
```

同一份制品逐级推进，环境差异通过 runtime config 或部署配置注入。

## 发布策略

| 策略 | 适用场景 |
| --- | --- |
| 全量发布 | 小流量或低风险应用 |
| 蓝绿发布 | 需要快速切换整套环境 |
| 金丝雀发布 | 先给少量用户或流量使用 |
| 灰度发布 | 按用户、租户、地区、版本逐步开放 |
| Feature Flag | 功能和代码发布解耦 |

前端常见发布组合是：静态资源发 CDN，HTML 或入口配置控制版本，Feature Flag 控制功能。

## 回滚

回滚必须在发布前设计。

前端回滚关注：

- HTML 指向旧资源。
- CDN 缓存是否可控。
- runtime config 是否能回退。
- 后端接口是否兼容旧前端。
- 数据变更是否可逆。
- source map 和监控版本是否保留。

如果功能涉及前后端协议变更，后端要保持向后兼容，不能只回滚前端。

## 示例流水线

```yaml
name: frontend-ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

## 落地清单

- PR 是否自动跑完整基础门禁？
- 构建产物是否可下载、可追溯、可回滚？
- 部署是否复用同一份制品？
- 发布是否有关联 release、commit、source map 和监控？
- 回滚是否经过演练？
- 失败通知是否能定位到责任阶段和负责人？

## 深入展开：流水线要区分验证、制品和部署

CI/CD 最容易混在一起。建议把流水线拆成三段：

| 阶段 | 产出 | 失败处理 |
| --- | --- | --- |
| Verify | 证明代码可以合并 | 阻断 PR |
| Build Artifact | 生成可追溯制品 | 阻断发布 |
| Deploy Promote | 推进环境和验证线上 | 回滚或暂停灰度 |

制品一旦生成就不要在每个环境重新构建。环境差异通过 runtime config 注入，这样测试环境验证过的产物，才能和生产发布的产物保持一致。

发布记录至少包含：

```text
release id
commit sha
artifact hash
runtime config version
source map upload status
deployer
deploy time
rollback target
```

这样线上事故发生时，可以直接从监控事件反查到构建和配置。
