# 03-SecurityFilterChain 和请求保护

## SecurityFilterChain 的位置

SecurityFilterChain 负责在请求进入业务 Controller 前做一系列安全处理。

它通常会参与：

- 认证。
- 鉴权。
- 异常转换。
- 会话或 Token 处理。

## URL 保护

你至少要区分：

- 公开接口。
- 需要登录的接口。
- 需要特定角色或权限的接口。

安全配置里要明确这些边界，而不是默认一把梭。

## 本节通过标准

- 能解释 SecurityFilterChain 在请求链路里的位置。
- 能配置公开接口和受保护接口。
- 能理解为什么安全问题要在 Controller 前处理。


