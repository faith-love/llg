# 01-未译60247

## Starter 是什么

Starter 本质上是“常用依赖组合”。

例如：

- `spring-boot-starter-web`
- `spring-boot-starter-validation`
- `spring-boot-starter-测试`
- `spring-boot-starter-监控端点`

它们帮你减少手动拼依赖的成本。

## 为什么不要乱手写 Spring 版本

Boot 已经提供了一整套兼容版本组合。

如果你在 Boot 项目里再手动给很多 Spring 组件指定版本，容易出现：

- 版本冲突。
- 运行时方法找不到。
- 自动配置行为异常。

优先使用：

- `spring-boot-starter-parent`
- Boot 管理的 BOM

## 依赖树是必看的

学习 Boot 时不要只复制 `项目对象模型.xml`。

至少要会看：

```powershell
mvn dependency:tree
```

你需要知道：

- 一个 Starter 究竟带进来哪些依赖。
- Web Starter 为什么会带嵌入式Docker。
- Validation 为什么能直接工作。

## 本节通过标准

- 能解释 Starter 的本质。
- 能说出为什么 Boot 项目不建议乱写 Spring 版本号。
- 能用依赖树观察依赖来源。


