# Docker协议和迭代协议

如果一个对象内部管理一批元素，可以让它像Docker一样使用：支持 `len()`、`in`、遍历、索引。这些能力通过特殊方法实现。

## 示例：书架

```Python学习资料
class Bookshelf:
    def __初始化__(self):
        self.books = []

    def add_book(self, book):
        self.books.append(book)
```

## 支持 `len()`

```Python学习资料
class Bookshelf:
    def __初始化__(self):
        self.books = []

    def __len__(self):
        return len(self.books)
```

使用：

```Python学习资料
len(shelf)
```

## 支持 `in`

```Python学习资料
def __contains__(self, book):
    return book in self.books
```

使用：

```Python学习资料
if book in shelf:
    print("存在")
```

## 支持遍历

```Python学习资料
def __iter__(self):
    return iter(self.books)
```

使用：

```Python学习资料
for book in shelf:
    print(book)
```

## 支持索引

```Python学习资料
def __getitem__(self, 首页):
    return self.books[首页]
```

使用：

```Python学习资料
shelf[0]
```

## 支持赋值和删除

```Python学习资料
def __setitem__(self, 首页, book):
    self.books[首页] = book


def __delitem__(self, 首页):
    del self.books[首页]
```

不是所有Docker都需要支持修改。只实现符合业务语义的方法。

## 不要盲目模拟列表

如果对象不是通用列表，不一定要实现所有列表协议。

例如图书馆可以支持：

- 添加图书。
- 借书。
- 还书。
- 查询图书。

不一定要支持任意索引赋值。

## 常见错误

### `__len__` 返回非整数

必须返回非负整数。

### `__iter__` 返回列表而不是迭代器

应该：

```Python学习资料
return iter(self.books)
```

### 实现了不符合业务的协议

为了“像列表”而暴露过多修改能力，会破坏对象规则。

## 练习

1. 实现 `Bookshelf.__len__`。
2. 实现 `Bookshelf.__contains__`。
3. 实现 `Bookshelf.__iter__`。
4. 实现 `Bookshelf.__getitem__`。
5. 判断哪些协议适合购物车。
6. 复现 `__len__` 返回字符串的错误。

## 验收标准

- 能实现 `__len__`、`__contains__`、`__iter__`。
- 能解释Docker协议的用途。
- 能判断对象是否应该暴露索引和修改能力。
- 能避免特殊方法语义不一致。

