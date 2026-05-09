# 00-阶段导读：面向对象和核心 API

## 这一阶段解决什么问题

基础语法阶段，你主要是在写语句：变量、判断、循环、数组、方法。

从这一阶段开始，你要学习怎么组织程序：

- 用类描述一种事物。
- 用对象保存具体数据。
- 用封装保护数据。
- 用继承和多态复用能力。
- 用接口定义规则。
- 用集合管理大量对象。
- 用异常处理错误。
- 用 IO 保存数据。

## 推荐学习顺序

1. [知识点深挖模板](00-knowledge-point-template.md)
2. [阶段目标](01-stage-goal.md)
3. [类、对象、字段、方法和构造器](02-classes-objects-constructors.md)
4. [封装、getter/setter 和不可变对象](03-encapsulation.md)
5. [继承、方法重写和 super](04-inheritance-overriding-super.md)
6. [多态](05-polymorphism.md)
7. [抽象类和接口](06-abstract-classes-interfaces.md)
8. [内部类、匿名类和枚举](07-inner-anonymous-enum.md)
9. [Object 基础方法](08-object-methods.md)
10. [字符串和日期 API](09-string-date-api.md)
11. [集合：List、Set、Map、Queue](10-collections.md)
12. [异常处理](11-exceptions.md)
13. [泛型](12-generics.md)
14. [Lambda 和 Stream](13-lambda-stream.md)
15. [IO 和 NIO](14-io-nio.md)
16. [反射和注解](15-reflection-annotations.md)
17. [阶段项目：命令行图书管理系统](16-library-management-project.md)
18. [通过标准和复盘清单](17-checkpoints.md)
19. [难点错误示例和避坑指南](18-pitfall-guide.md)

## 小白先记住的主线

这一阶段可以围绕一个“图书管理系统”理解：

- `Book` 是类。
- 一本具体的书是对象。
- `title`、`author`、`isbn` 是字段。
- `borrow()`、`returnBook()` 是方法。
- `BookRepository` 是接口，规定怎么保存和查找图书。
- `FileBookRepository` 是实现类，把数据保存到文件。
- `List<Book>` 可以保存很多本书。
- 找不到图书时可以抛出自定义异常。

## 本阶段产出

完成后应该有：

- 一个命令行图书管理系统。
- 至少 5 个类。
- 至少 1 个接口。
- 至少 1 个自定义异常。
- 使用集合保存对象。
- 使用文件保存和加载数据。
- 一份项目 README 和复盘。

## 读每个知识点时要问的问题

- 它的作用是什么？
- 没有它会有什么痛点？
- 它比更原始的写法好在哪里？
- 实际使用时有哪些技巧？
- 小白最容易错在哪里？
- 哪些点必须重点掌握？

## 避坑学习法

读完一个知识点后，不要只看正确代码。再去看 [难点错误示例和避坑指南](18-pitfall-guide.md)，对照错误示例判断自己是否真的理解。
