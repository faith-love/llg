# 03-Java 版本选择策略

## 为什么版本选择很重要

Java 学习中最常见的混乱之一就是版本混用。

比如：

- 教程用 Java 8。
- 你安装了 JDK 25。
- 项目依赖 Spring Boot 3 或 4。
- 网上复制的代码来自 Spring Boot 2。

这些内容混在一起，就可能出现代码能看懂但跑不起来的问题。

## 小白先记住的结论

- 新学习主线：优先 JDK 25 LTS。
- 企业兼容基线：Java 17/21 很常见。
- 老项目维护：可能遇到 Java 8/11。
- Spring Boot 当前主线：按 Java 17+ 学习。
- 不要把 Java 8 老教程和现代 Spring Boot 项目直接混用。

## 什么是 LTS

LTS 是 Long-Term Support，意思是长期支持版本。

长期支持版本通常更适合：

- 公司项目。
- 长期学习。
- 生产环境。
- 需要稳定升级路线的项目。

小白不需要追每一个短期版本。先抓住 LTS 版本即可。

## JDK 25、21、17、8 怎么看

| 版本 | 学习定位 | 说明 |
| --- | --- | --- |
| JDK 25 LTS | 新学习主线 | 当前长期支持版本，适合新路线 |
| JDK 21 LTS | 现代企业项目常见 | 生态成熟，很多教程和项目会使用 |
| JDK 17 LTS | Spring Boot 3+ 常见基线 | 很多公司升级到的最低现代版本 |
| Java 11 | 老项目常见 | 仍可能在企业项目里看到 |
| Java 8 | 历史包袱和老项目 | 必须了解 lambda、Stream，但不建议新路线停在这里 |

## 初学应该怎么装

如果你只想开始学习：

1. 安装 JDK 25 LTS。
2. IDE 项目 SDK 选择 JDK 25。
3. 如果某个教程明确要求 JDK 17 或 21，再为该项目单独配置对应 JDK。

不要为了一个旧教程把全局环境反复改来改去。更好的做法是每个项目指定自己的 JDK。

## 学 Java 8 还有必要吗

有必要，但不要把 Java 8 当成终点。

Java 8 必须掌握：

- lambda。
- Stream。
- Optional。
- 新日期时间 API。
- 接口默认方法。

但现代 Java 还要了解：

- `var` 局部变量类型推断。
- 文本块。
- `record`。
- 增强 `switch`。
- sealed class。
- 虚拟线程。

这些新特性不一定每天都用，但你需要知道它们解决什么问题。

## Spring Boot 版本提醒

Spring Boot 和 JDK 有对应关系。现代 Spring Boot 不再支持 Java 8。

学习时要先看官方系统要求，再确定：

- JDK 版本。
- Spring Boot 版本。
- Maven 或 Gradle 版本。
- 依赖库版本。

小白常见错误：

- 用 Java 8 跑 Spring Boot 3+ 项目。
- 用旧教程的配置复制到新版本项目。
- 看到报错后只改代码，不检查版本。

## 遇到版本报错怎么排查

按这个顺序查：

1. `java -version` 看命令行 JDK。
2. IDE Project SDK 看项目 JDK。
3. `pom.xml` 看 `java.version`。
4. 看 Spring Boot 版本。
5. 查官方文档确认最低 Java 要求。
6. 清理并重新构建项目。

常见命令：

```powershell
java -version
javac -version
mvn -version
mvn clean test
```

## 本节练习

写一个 `version-note.md`：

```markdown
# Java 版本记录

## 本机命令行 JDK

## IDE 项目 JDK

## 我准备主线学习的版本

## 我可能遇到的教程版本

## 版本混用风险
```

## 本节通过标准

- 能解释为什么推荐 LTS。
- 能说清 JDK 25、21、17、8 的学习定位。
- 能排查“命令行版本”和“IDE 版本”不一致的问题。

