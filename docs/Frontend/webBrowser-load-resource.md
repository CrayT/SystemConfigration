### html结构
```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="*.css">
    </head>
    <body>
        <div></div>
        <script></script>
    </body>
</html>
```


- `script` 脚本，三种方式：
  - `直接加载`
    > 没有 `async` 和 `defer`, 浏览器立即加载并执行脚本;
  - `async`
  > 加载和渲染后续文档元素的过程将和 `script` 的加载与执行并行进行（异步）, 加载完就立即执行，适用于不依赖任何其他脚本或不被其他脚本依赖的情况;
  - `defer`
  > 加载后续文档元素的过程将和 `script` 的加载并行进行（异步），但是 `script` 的执行要在所有元素解析完成之后，`DOMContentLoaded` 事件触发之前完成;