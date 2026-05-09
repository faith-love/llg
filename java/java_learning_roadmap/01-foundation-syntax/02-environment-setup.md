# 02-环境准备

## 需要安装什么

这一阶段至少需要：

- JDK：编译和运行 Java 程序。
- IntelliJ IDEA：写代码和调试。
- Maven：后面管理项目依赖。
- Git：保存练习代码历史。

如果你暂时只想开始写基础语法，JDK 和 IDE 最重要。Maven 和 Git 也建议尽早装好。

## JDK 检查

安装后在 PowerShell 执行：

```powershell
java -version
javac -version
```

你应该看到类似版本输出。

两个命令的区别：

- `java`：运行 Java 程序。
- `javac`：把 `.java` 源码编译成 `.class` 字节码。

如果 `java` 能用但 `javac` 不能用，通常说明环境变量或安装内容有问题。

## IDE 准备

推荐使用 IntelliJ IDEA。

先学这些操作：

- 创建 Java 项目。
- 创建 Java 类。
- 运行 `main` 方法。
- 设置断点。
- 单步调试。
- 查看控制台输出。
- 查看错误堆栈。

小白不要一开始就配置太多插件。先把“创建、运行、调试”练熟。

## Maven 检查

执行：

```powershell
mvn -version
```

如果能看到 Maven 和 Java 版本，说明 Maven 基本可用。

基础语法阶段不一定马上用 Maven，但后面 Spring Boot 必须用到，所以现在先装好。

## Git 检查

执行：

```powershell
git --version
git status
```

`git status` 如果提示当前目录不是仓库，是正常的。进入练习项目后再初始化或提交。

## 第一个手动编译实验

即使用 IDE，也建议手动编译一次，理解 Java 文件怎么变成可运行程序。

创建 `HelloJava.java`：

```java
public class HelloJava {
    public static void main(String[] args) {
        System.out.println("Hello Java");
    }
}
```

在文件所在目录执行：

```powershell
javac HelloJava.java
java HelloJava
```

你会看到：

```text
Hello Java
```

同时目录里会出现 `HelloJava.class`。

## 常见环境问题

### 类名和文件名不一致

如果类是：

```java
public class HelloJava {
}
```

文件名必须是：

```text
HelloJava.java
```

大小写也要一致。

### 命令找不到

如果提示 `java`、`javac` 或 `mvn` 不是可识别命令，通常是环境变量没有配置好。

先检查：

- JDK 是否安装成功。
- `JAVA_HOME` 是否指向 JDK 目录。
- `Path` 是否包含 JDK 的 `bin` 目录。

### IDE 使用的 JDK 不一致

命令行显示一个版本，IDE 项目使用另一个版本，也会导致奇怪问题。

检查：

- Project SDK。
- Module SDK。
- Maven 使用的 JDK。

## 本节练习

写一个 `environment-check.md`：

```markdown
# 环境检查

## java -version 输出

## javac -version 输出

## mvn -version 输出

## git --version 输出

## IDEA 项目 SDK

## 当前遇到的问题
```

## 本节通过标准

- 能在命令行看到 Java 和 javac 版本。
- 能用 IDE 运行一个 `main` 方法。
- 能手动执行 `javac` 和 `java`。
- 能解释 `.java` 和 `.class` 的区别。

