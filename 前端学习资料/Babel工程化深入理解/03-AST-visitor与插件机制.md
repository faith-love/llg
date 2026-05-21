# AST、visitor 与插件机制

Babel 插件的本质是：注册一组 visitor，在遍历 AST 时遇到对应节点就执行逻辑。

## visitor 是什么

```javascript
export default function plugin() {
  return {
    visitor: {
      Identifier(path) {
        console.log(path.node.name)
      }
    }
  }
}
```

这里的 `Identifier` 就是节点类型。Babel 遍历 AST 时，每遇到一个标识符节点，就调用这个函数。

## path 是什么

`path` 不是 AST 节点本身，而是节点在树中的“路径对象”。它包含：

- `path.node`：当前 AST 节点。
- `path.parent`：父节点。
- `path.scope`：当前作用域。
- `path.replaceWith()`：替换节点。
- `path.remove()`：删除节点。
- `path.traverse()`：继续遍历子树。

直接改 `path.node` 可以工作，但复杂转换更推荐使用 path API。

## enter 和 exit

visitor 可以在进入节点或离开节点时执行：

```javascript
export default function plugin() {
  return {
    visitor: {
      BinaryExpression: {
        enter(path) {
          console.log('enter', path.node.operator)
        },
        exit(path) {
          console.log('exit', path.node.operator)
        }
      }
    }
  }
}
```

复杂转换里，`exit` 常用于等子节点处理完后再处理父节点。

## 替换节点

把 `process.env.NODE_ENV` 替换成字符串：

```javascript
import * as t from '@babel/types'

export default function plugin() {
  return {
    visitor: {
      MemberExpression(path) {
        const source = path.toString()

        if (source === 'process.env.NODE_ENV') {
          path.replaceWith(t.stringLiteral('production'))
        }
      }
    }
  }
}
```

真实插件通常不会用 `path.toString()` 做严肃判断，这里只是演示转换思路。

## 删除代码

删除 `console.log`：

```javascript
export default function plugin() {
  return {
    visitor: {
      CallExpression(path) {
        const callee = path.get('callee')

        if (callee.matchesPattern('console.log')) {
          path.remove()
        }
      }
    }
  }
}
```

这类插件常用于生产环境删除调试代码。

## 作用域很重要

不要只看名字：

```javascript
const name = 'outer'

function run() {
  const name = 'inner'
  console.log(name)
}
```

两个 `name` 在不同作用域。插件如果要改变量绑定，必须理解 scope，否则容易误改。

Babel 的 `path.scope` 可以查询绑定：

```javascript
const binding = path.scope.getBinding('name')
```

## 插件能做什么

适合：

- 语法降级。
- JSX/TS 语法转换。
- 自动埋点。
- 删除调试代码。
- import 按需加载转换。
- 编译框架 DSL。
- 自动注入 displayName。
- 编译宏。

不适合：

- 做复杂业务逻辑。
- 依赖运行时真实数据。
- 替代 lint 和类型检查。
- 修改不理解的第三方代码。

