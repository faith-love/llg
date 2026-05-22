# Babel 排障性能优化与迁移策略

Babel 问题通常出现在语法兼容、插件顺序、polyfill、配置命中、sourcemap、构建性能和工具迁移中。排查时不要直接改配置，先判断问题属于“解析不了、转换错了、没转换、转换多了、运行时缺东西、还是 sourcemap 对不上”。

## 排障分类

| 现象 | 可能原因 |
| --- | --- |
| 构建时报 syntax error | 解析插件缺失、文件未经过正确 loader |
| 浏览器时报语法错误 | targets 不覆盖、node_modules 未转译 |
| 浏览器报 API 不存在 | polyfill 缺失 |
| 装饰器行为异常 | decorators 配置版本或顺序不一致 |
| class fields 初始化异常 | loose/spec 模式差异或插件顺序 |
| helper 重复很多 | 未使用 transform-runtime 或配置不当 |
| sourcemap 错位 | Babel、bundler、minifier map 没串起来 |
| 构建很慢 | 转换范围过大、缓存失效、插件过重 |

## 最小复现

Babel 问题最好用最小代码定位：

```text
1. 拿出一段失败源码
2. 用当前 Babel 配置单独转换
3. 查看输出代码
4. 逐个关闭插件
5. 对比开发和生产配置
```

如果单独 Babel 转换没问题，再查 bundler、loader、minifier 或运行时。

## 配置命中问题

常见误区：

- monorepo 子包 `.babelrc` 没被读取。
- loader options 覆盖了外部配置。
- `envName` 不同导致 plugins 不同。
- `exclude: /node_modules/` 跳过了需要转译的现代依赖。
- 测试环境没有读取应用构建配置。

排查时要打印或确认最终 Babel 配置，而不是只看配置文件。

## 性能优化

优化方向：

- 缩小 Babel 处理范围。
- 跳过不需要转换的文件。
- 开启 Babel loader 缓存。
- 避免重复转换同一文件。
- 减少重型插件。
- 开发环境用 esbuild/SWC，生产保留必要 Babel 插件。
- monorepo 中配合任务缓存。

不要把整个 `node_modules` 都交给 Babel。只 include 必须转译的包。

## 迁移到 SWC 或 esbuild

迁移前先盘点：

- 当前 Babel 插件列表。
- 是否有自定义插件。
- 是否依赖 macros。
- 是否依赖 legacy decorators。
- JSX runtime 配置。
- polyfill 策略。
- sourcemap 要求。
- 测试和 Storybook 是否同步迁移。

迁移策略：

```text
先替换常规 TS/JSX 转译
保留少量 Babel 插件处理特殊语法
对关键页面做产物 diff 和 E2E
再逐步清理 Babel 配置
```

## 生产事故排查

如果生产环境出问题：

1. 确认 release 和构建产物。
2. 看错误是语法错误、API 缺失还是业务异常。
3. 对照 targets 和 polyfill 策略。
4. 检查是否只有某些浏览器出错。
5. 检查 source map 是否匹配当前 release。
6. 必要时回滚或关闭相关 Feature Flag。

## 落地清单

- 是否能打印最终 Babel 配置？
- 是否有最小复现转换方法？
- 是否限制 Babel 转换范围？
- 是否有 Babel 缓存和 monorepo 任务缓存？
- 是否有低版本浏览器或兼容环境验证？
- SWC/esbuild 迁移是否评估插件和语义差异？

