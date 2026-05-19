# 10-集合：List、Set、Map、Queue

## 集合是什么

数组长度固定，使用不够灵活。集合可以更方便地保存、查找、删除多个对象。

常见集合：

- `List`：有序，可重复。
- `Set`：不重复。
- `Map`：key-value。
- `Queue`：队列。

## List

`List` 适合保存一组有顺序的数据。

```java
List<String> names = new ArrayList<>();
names.add("小明");
names.add("小红");
names.add("小明");

System.out.println(names.get(0));
System.out.println(names.size());
```

特点：

- 可以重复。
- 有下标。
- `ArrayList` 最常用。

## ArrayList 和 LinkedList

小白先记：

- 大多数场景优先 `ArrayList`。
- 经常按下标读取，优先 `ArrayList`。
- `LinkedList` 不是万能优化，别乱用。

## Set

`Set` 用于去重。

```java
Set<String> tags = new HashSet<>();
tags.add("Java");
tags.add("SQL");
tags.add("Java");

System.out.println(tags.size()); // 2
```

常见实现：

- `HashSet`：常用，无序。
- `LinkedHashSet`：保持插入顺序。
- `TreeSet`：排序。

## Map

`Map` 保存 key-value。

```java
Map<String, Book> bookMap = new HashMap<>();
bookMap.put("978711", new Book("978711", "Java"));

Book book = bookMap.get("978711");
```

适合根据唯一 key 快速查找。

常见实现：

- `HashMap`：常用。
- `LinkedHashMap`：保持插入顺序。
- `TreeMap`：按 key 排序。

## Queue

队列适合先进先出。

```java
Queue<String> queue = new LinkedList<>();
queue.offer("任务1");
queue.offer("任务2");

System.out.println(queue.poll()); // 任务1
```

常用方法：

- `offer`：入队。
- `poll`：出队。
- `peek`：查看队头但不移除。

## PriorityQueue

优先队列会按优先级取出元素。

```java
PriorityQueue<Integer> queue = new PriorityQueue<>();
queue.offer(3);
queue.offer(1);
queue.offer(2);

System.out.println(queue.poll()); // 1
```

## 迭代器

遍历集合可以用增强 `for`：

```java
for (String name : names) {
    System.out.println(name);
}
```

删除元素时，使用迭代器更安全：

```java
Iterator<String> iterator = names.iterator();
while (iterator.hasNext()) {
    String name = iterator.next();
    if (name.isBlank()) {
        iterator.remove();
    }
}
```

## 不可变集合

```java
List<String> courses = List.of("Java", "SQL", "Spring");
```

这种集合不能再添加或删除元素。

## 集合选择规则

| 场景 | 推荐 |
| --- | --- |
| 保存列表并按顺序遍历 | `ArrayList` |
| 去重 | `HashSet` |
| 去重并保持插入顺序 | `LinkedHashSet` |
| 按 key 查询对象 | `HashMap` |
| 按 key 排序 | `TreeMap` |
| 先进先出 | `Queue` |
| 按优先级取出 | `PriorityQueue` |

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| `List` | 保存有顺序、可重复的数据 | 比数组长度更灵活 | 大多数列表优先用 `ArrayList` | 重点是有下标、可重复、适合顺序遍历 |
| `Set` | 保存不重复的数据 | 解决手动去重麻烦 | 去重优先 `HashSet`，要顺序用 `LinkedHashSet` | 难点是对象去重依赖 `equals` 和 `hashCode` |
| `Map` | 按 key 快速查 value | 避免遍历列表查找对象 | 唯一标识如 ISBN 适合作 key | 重点是 key 要稳定且唯一 |
| `Queue` | 表达排队和先进先出 | 适合任务队列、消息处理模型 | 用 `offer`、`poll`、`peek` 替代容易抛异常的方法 | 重点是理解入队和出队顺序 |
| 迭代器 | 安全遍历和删除集合元素 | 避免边遍历边删除导致错误 | 删除时用 `iterator.remove()` | 难点是不能随便在增强 for 中删除集合元素 |

## 本节练习

完成：

- 用 `List<Book>` 保存图书列表。
- 用 `Set<String>` 保存标签并去重。
- 用 `Map<String, Book>` 根据 ISBN 查询图书。
- 用 `Queue<String>` 模拟排队任务。
- 删除 `List` 中标题为空的图书。

## 本节通过标准

- 能说出 `List`、`Set`、`Map` 的区别。
- 能根据场景选择集合。
- 能遍历集合。
- 能用 `Map` 做 key-value 查询。
- 知道集合中对象去重依赖 `equals` 和 `hashCode`。
