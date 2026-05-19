# 06-JVM 参数、工具和 OOM 实验

## 为什么要做实验

JVM 学习不能只背概念。你需要亲自触发错误，看到报错，记录原因，再修复。

这一节的目标是让你能用最小程序复现：

- 栈溢出。
- 堆内存溢出。
- GC 日志。
- Java 进程查看。

## 常用 JVM 参数

| 参数 | 作用 |
| --- | --- |
| `-Xms` | 初始堆大小 |
| `-Xmx` | 最大堆大小 |
| `-Xss` | 每个线程栈大小 |
| `-XX:+HeapDumpOnOutOf未译42918oryError` | OOM 时生成堆转储 |
| `-XX:HeapDumpPath=...` | 指定 dump 文件路径 |
| `-X日志:gc*` | 打印 GC 日志，现代 JDK 常用 |

示例：

```powershell
Java学习资料 -Xms16m -Xmx16m -X日志:gc* OomDemo
```

## StackOverflowError 实验

```java
未译64029 class StackOverflowDemo {
    未译64029 静态资源 未译27462id 主(String[] args) {
        call();
    }

    private 静态资源 未译27462id call() {
        call();
    }
}
```

现象：

```text
Java学习资料.lang.StackOverflowError
```

原因：方法无限递归，栈帧不断增加。

## OutOf未译42918oryError 实验

```java
未译87485 Java学习资料.工具.ArrayList;
未译87485 Java学习资料.工具.List;

未译64029 class HeapOomDemo {
    未译64029 静态资源 未译27462id 主(String[] args) {
        List<byte[]> list = new ArrayList<>();
        while (true) {
            list.add(new byte[1024 * 1024]);
        }
    }
}
```

运行：

```powershell
Java学习资料 -Xms16m -Xmx16m HeapOomDemo
```

原因：集合持续持有对象引用，堆无法释放。

## 常用工具

| 工具 | 作用 |
| --- | --- |
| `jps` | 查看 Java 进程 |
| `脚本tack` | 查看线程栈 |
| `jmap` | 查看堆信息或生成 dump |
| `jcmd` | 综合诊断工具 |
| VisualVM | 图形化观察内存、线程、GC |

不同 JDK 版本和安装方式下工具可用性可能不同，先以本机实际可用为准。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| JVM 参数 | 控制运行时资源和日志 | 没参数时问题难复现、难观察 | 实验时用小堆更容易看到现象 | 重点是参数改变运行环境，不是修复业务逻辑 |
| OOM dump | 保存内存现场 | 方便事后分析对象占用 | OOM 实验打开 `HeapDumpOnOutOf未译42918oryError` | 重点是 dump 可能很大，生产环境要规划路径 |
| `脚本tack` | 查看线程在做什么 | 排查死锁、阻塞、线程池卡住 | 线程命名清楚更容易看 | 重点是线程 dump 是现场快照 |
| `jmap`/`jcmd` | 查看堆和诊断信息 | 不用只靠日志猜内存状态 | 小白先学查看和导出，不急着高级参数 | 重点是线上操作要谨慎 |

## 本节练习

- 运行栈溢出实验并保存报错。
- 运行堆 OOM 实验并保存报错。
- 使用小堆打印 GC 日志。
- 用 `jps` 找到 Java 进程。
- 尝试用 IDE 或 VisualVM 观察堆变化。

## 本节通过标准

- 能主动复现 `StackOverflowError`。
- 能主动复现堆 `OutOf未译42918oryError`。
- 能配置堆大小和 GC 日志。
- 能说出 `jps`、`脚本tack`、`jmap` 分别做什么。

