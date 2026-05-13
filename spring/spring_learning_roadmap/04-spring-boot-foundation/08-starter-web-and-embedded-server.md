# 08-Web Starter、嵌入式容器和自动装配结果

## Web Starter 带来了什么

`spring-boot-starter-web` 不只是一个依赖名，它通常会带来一组常用能力：

- Spring MVC
- JSON 序列化
- 嵌入式 Web 容器
- 基础 Web 自动配置

这就是为什么很多 Boot Web 项目只加一个 Starter 就能起一个 HTTP 服务。

## 嵌入式容器的意义

Boot 的一个重要特点是自带嵌入式容器。

这让应用可以直接：

```text
java -jar app.jar
```

而不需要你先单独装一个外部容器再把 war 包丢进去。

## 容器不是唯一选择

虽然 Boot 默认适合 jar + 嵌入式容器模式，但你也要知道：

- 某些旧项目仍然会走 war 部署。
- 某些团队对容器化部署有额外约束。

初学阶段先把 jar 部署主线学稳。

## 观察自动装配结果

引入 Web Starter 后，你至少要能观察：

- 端口是否真的监听起来了。
- Controller 是否可以被访问。
- JSON 是否能正常返回。
- 容器启动日志里暴露了哪些信息。

## 本节通过标准

- 能解释 Web Starter 为什么能快速起一个 Web 服务。
- 能说明嵌入式容器在 Boot 里的意义。
- 能通过启动和访问结果判断 Web 自动装配是否正常。
