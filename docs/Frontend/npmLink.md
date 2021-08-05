### npm link
- 用于在不同项目之间建立引用
#### 项目1
- demo, 在`package.json`中，指定`main`为`index.js`，`name`为`demo`
  - index.js
```javascript
module.exports = {
    name:123
}
```
- 在目录内执行 `npm link`，会在全局的node_modules下生成一个modules。

#### 项目2
- 项目内执行 `npm link demo`，会在项目内创建一个类似软连接，从 `node_modules` 引用全局的`modules`
- 在文件内可引用 `demo` 内导出的对象：
```javascript
const a = require("demo")
```
> `npm link`只能按 `ES5` 的语法进行引用，即不能通过 `import` 引用，原因为通过 `link` 方式导入的无法向`webpack`一样进行升级到 `es6` ，如果需要通过`import`方式引用，可参考一下方法
- 原项目的导出方式改为：
```javascript
export const a = {
    name:123
}
```
- 本项目内引用方式改为从 `node_modules` 引用：
```javascript
import a from "../node_modules/demo"
```
