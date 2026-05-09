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
| `-XX:+HeapDumpOnOutOfMemoryError` | OOM 时生成堆转储 |
| `-XX:HeapDumpPath=...` | 指定 dump 文件路径 |
| `-Xlog:gc*` | 打印 GC 日志，现代 JDK 常用 |

示例：

```powershell
java -Xms16m -Xmx16m -Xlog:gc* OomDemo
```

## StackOverflowError 实验

```java
public class StackOverflowDemo {
    public static void main(String[] args) {
        call();
    }

    private static void call() {
        call();
    }
}
```

现象：

```text
java.lang.StackOverflowError
```

原因：方法无限递归，栈帧不断增加。

## OutOfMemoryError 实验

```java
import java.util.ArrayList;
import java.util.List;

public class HeapOomDemo {
    public static void main(String[] args) {
        List<byte[]> list = new ArrayList<>();
        while (true) {
            list.add(new byte[1024 * 1024]);
        }
    }
}
```

运行：

```powershell
java -Xms16m -Xmx16m HeapOomDemo
```

原因：集合持续持有对象引用，堆无法释放。

## 常用工具

| 工具 | 作用 |
| --- | --- |
| `jps` | 查看 Java 进程 |
| `jstack` | 查看线程栈 |
| `jmap` | 查看堆信息或生成 dump |
| `jcmd` | 综合诊断工具 |
| VisualVM | 图形化观察内存、线程、GC |

不同 JDK 版本和安装方式下工具可用性可能不同，先以本机实际可用为准。

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| JVM 参数 | 控制运行时资源和日志 | 没参数时问题难复现、难观察 | 实验时用小堆更容易看到现象 | 重点是参数改变运行环境，不是修复业务逻辑 |
| OOM dump | 保存内存现场 | 方便事后分析对象占用 | OOM 实验打开 `HeapDumpOnOutOfMemoryError` | 重点是 dump 可能很大，生产环境要规划路径 |
| `jstack` | 查看线程在做什么 | 排查死锁、阻塞、线程池卡住 | 线程命名清楚更容易看 | 重点是线程 dump 是现场快照 |
| `jmap`/`jcmd` | 查看堆和诊断信息 | 不用只靠日志猜内存状态 | 小白先学查看和导出，不急着高级参数 | 重点是线上操作要谨慎 |

## 本节练习

- 运行栈溢出实验并保存报错。
- 运行堆 OOM 实验并保存报错。
- 使用小堆打印 GC 日志。
- 用 `jps` 找到 Java 进程。
- 尝试用 IDE 或 VisualVM 观察堆变化。

## 本节通过标准

- 能主动复现 `StackOverflowError`。
- 能主动复现堆 `OutOfMemoryError`。
- 能配置堆大小和 GC 日志。
- 能说出 `jps`、`jstack`、`jmap` 分别做什么。

