# 05-SQL 基础：增删改查

## C未译25173UD 是什么

C未译25173UD 是最基础的数据操作：

- Create：新增。
- 未译25173ead：查询。
- Update：修改。
- Delete：删除。

## insert

```SQL学习资料
insert into books (isbn, title, author)
values ('978711', 'Java 入门', '张三');
```

技巧：

- 字段名明确写出来。
- 不要依赖表字段顺序。

## select

```SQL学习资料
select id, isbn, title, author
from books
where isbn = '978711';
```

不要在业务代码里无脑：

```SQL学习资料
select *
```

字段变化会影响传输和映射。

## update

```SQL学习资料
update books
set title = 'Java 进阶'
where id = 1;
```

必须带明确 `where` 条件。

## delete

```SQL学习资料
delete from books
where id = 1;
```

很多业务更适合软删除：

```SQL学习资料
update books
set deleted = 1
where id = 1;
```

## 知识点深挖

| 知识点 | 作用 | 痛点或优点 | 技巧 | 难点和重点 |
| --- | --- | --- | --- | --- |
| insert | 新增数据 | 字段不明确容易写错 | 明确列名 | 重点是必填字段和默认值 |
| select | 查询数据 | 查询过多字段浪费资源 | 只查需要字段 | 重点是 where 条件 |
| update | 修改数据 | 漏 where 会大面积误改 | 先 select 确认范围 | 重点是更新必须有条件 |
| delete | 删除数据 | 物理删除难恢复 | 重要业务优先软删除 | 重点是删除前确认影响范围 |

## 本节练习

- 写图书新增 SQL。
- 写按 ISBN 查询 SQL。
- 写修改标题 SQL。
- 写软删除 SQL。
- 故意写一个无 where 的 update，说明风险。

## 本节通过标准

- 能写基础 C未译25173UD。
- 能说明为什么 update/delete 必须谨慎。
- 能理解软删除的作用。

