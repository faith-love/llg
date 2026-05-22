# Babel 编译三阶段 AST 与插件机制

Babel 的核心能力来自 AST。它不是用字符串搜索替换代码，而是先把源码解析成语法树，再按节点类型遍历和修改，最后重新生成代码。理解 AST 后，Babel 插件、preset、装饰器转换、JSX 转换、按需引入都会变得清晰。

## 三阶段

| 阶段 | 输入 | 输出 | 重点 |
| --- | --- | --- | --- |
| parse | 源码字符串 | AST | 词法和语法解析 |
| transform | AST | 新 AST | 插件 visitor 改写节点 |
| generate | 新 AST | 代码和 sourcemap | 打印代码、保留映射关系 |

流程：

```text
const x = <Button />
  -> parse 成 JSXElement、VariableDeclaration 等节点
  -> transform 成 React.createElement 或 jsx runtime 调用
  -> generate 输出普通 JS
```

## AST 是什么

代码：

```javascript
const count = 1
```

大致会被解析成：

```text
Program
  VariableDeclaration kind=const
    VariableDeclarator
      Identifier name=count
      NumericLiteral value=1
```

插件操作的是这些结构化节点，而不是原始字符串。

## visitor 机制

Babel 插件通常提供 visitor：

```javascript
export default function plugin() {
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name === 'oldName') {
          path.node.name = 'newName'
        }
      }
    }
  }
}
```

`path` 不只是节点本身，还包含父节点、作用域、替换、删除、插入等操作能力。

## path 和 scope

插件不能只看名字，还要看作用域。

```javascript
const name = 'outer'

function run() {
  const name = 'inner'
  console.log(name)
}
```

如果插件要改外层 `name`，必须通过 scope 判断绑定关系，不能把所有同名标识符都改掉。

## 插件执行顺序

插件顺序会影响结果。常见规律：

- plugin 按数组从前到后执行。
- preset 通常按数组从后到前展开。
- 语法解析插件要先让 Babel 能读懂代码。
- 转换插件之间可能依赖前一个插件的输出。

装饰器和 class fields 就是典型顺序敏感场景。

## 插件适合做什么

适合：

- 语法降级。
- JSX 转换。
- 自动 import。
- 代码插桩。
- 删除调试代码。
- 编译时常量替换。
- 组件库按需引入。

不适合：

- 依赖完整模块图的优化。
- 复杂跨文件分析。
- 运行时用户数据处理。
- 类型检查。

跨文件依赖图更适合交给 bundler 或 TypeScript。

## sourcemap 串联

如果 Babel 后面还有 bundler 和 minifier，每一阶段都要正确传递 sourcemap：

```text
source.tsx -> Babel map -> bundler map -> minifier map -> production map
```

任一环节丢失或错配，线上错误栈就可能无法还原源码位置。

## 排查插件问题

常用思路：

1. 用最小代码复现。
2. 打印转换前后代码。
3. 逐个关闭插件定位。
4. 检查 plugin 和 preset 顺序。
5. 检查 Babel 配置是否真的命中该文件。
6. 检查同一文件是否被多次转换。

## 落地清单

- 是否理解 parse、transform、generate 的输入输出？
- 是否知道 visitor 是按节点类型进入？
- 是否能解释 path 和 scope 的作用？
- 是否能判断某个需求适不适合写 Babel 插件？
- 是否知道插件顺序为什么会影响装饰器、class fields 等语法？
- 是否能用转换前后代码定位插件问题？

