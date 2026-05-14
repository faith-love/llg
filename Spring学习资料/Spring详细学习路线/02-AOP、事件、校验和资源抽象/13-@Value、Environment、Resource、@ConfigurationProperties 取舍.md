# 13-`@Value`、`Environment`、`Resource`、`@ConfigurationProperties` 取舍

## 这些能力不要混着用

它们都和“读东西”有关，但定位不同。

`@Value`：

- 读简单配置

`Environment`：

- 看环境和属性

`Resource`：

- 读 classpath、文件、URL 资源

`@ConfigurationProperties`：

- 管理结构化配置

## 怎么选

简单单值：

- 优先 `@Value`

成组配置：

- 优先 `@ConfigurationProperties`

资源文件：

- 用 `Resource`

环境判断或临时调试：

- 用 `Environment`

## 本节通过标准

- 能根据用途选择合适工具。
- 能避免所有配置读取都一股脑写成 `@Value`。
- 能把资源读取和属性读取区分清楚。


