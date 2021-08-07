### html一般结构：
```html
<!DOCTYPE html>
<html>
    <head>
        <title>title</title>
        <meta charset="utf-7">
        <meta name="" content="">
        <link rel="stylesheet" href="*.css">
        
    </head>
    <body>
        <div></div>
        <script></script>
    </body>
</html>
```
- `head`头部标签
  - `title`:
    - 可定义文档的标题；
    - 它显示在浏览器窗口的标题栏或状态栏上；
    - `title` 写与网页相关的关键词有利于SEO优化
  - `meta`:
      - 一般定义一些当前网页的特殊属性
      - 通过 meta 标签的属性定义页面的特征
      - 格式:  `<meta 属性1 = '  ' 属性2 = ‘’>  </meta> `
  - `link`:
      - 引入外部`css`样式表

### 1, `css`加载方式：
> `CSS`可在`head`中引入，也可以在`body`中引入，一般在`head`中。
- 在`body`中引入：
  - 在 `body末尾` 引入:
    - 1, 在解析到`link`标签之前, 浏览器自上而下解析`html`生成`dom`树，然后与`CSSOM`树（并非外部引入的CSS）结合生成了`Layout`树，计算布局之后进行绘制，将页面渲染到浏览器中;
  
    - 2, 浏览器解析到`link`标签，下载外部css文件；下载完之后开始解析`css样式`生成`CSSOM`树，并重新解析HTML生成`DOM`树；将DOM树和`CSSOM`树结合生成`Layout`树，进行计算布局和Paint，完成页面的渲染，这个过程称为`reflow`，也就是`回流`，是一种消耗性能的现象;
    > 所以，外部 `css` 在body中引入，不会阻塞html的渲染，页面的呈现过程是：文本渲染完成，但没有css样式，即裸奔，css加载完成之后，样式发生改变，在这个过程发生`Layout shift`现象，即`累计布局偏移`.
    
  - `在body中间`引入：
    - 在中间位置引入时，会阻塞html的解析，在下载外部css的过程中，后面的html不会解析渲染，所以中间引入，会阻塞解析，但不阻塞渲染(渲染已经解析的之前标签)- `script` 脚本，三种方式：

- 在 `head` 中引入:
  - 阻塞html的渲染，页面呈现出：一段时间的白屏，然后css加载完毕后，呈现带有样式的页面


### 2, `js`加载方式：
> 一般在`<body>`标签末尾

- 放在 `head` 中：
  - 会阻塞`html`的渲染，且是顺序加载，全部加载完毕才会开始渲染`html`。页面呈现出一片长时间的空白(如果`js`过大)

- 放在 `body` 末尾:
  - 在`html`渲染完毕后再加载执行，不会阻塞界面的渲染.

- 加载属性：
  - `直接加载`
      > 没有 `async` 和 `defer`, 浏览器立即加载并执行脚本，顺序加载`script`脚本，会`阻塞`后续脚本的加载，必须等当前脚本加载、执行完成才能加载下一个;

  - `async`
    > 加载和渲染后续文档元素的过程将和 `script` 的加载与执行并行进行（`异步加载`,不会阻塞）, 加载完就立即执行(但是实际测试下来，好像是在页面渲染完成之后 defer指定脚本执行之后执行？)，适用于不依赖任何其他脚本或不被其他脚本依赖的情况;

  - `defer`
    > 加载后续文档元素的过程将和 `script` 的加载并行进行（异步），但是 `script` 的执行要在所有元素解析完成之后，`DOMContentLoaded` 事件触发之前完成;
    window.addEventListener('DOMContentLoaded', (event) => {
        console.log('DOM fully loaded and parsed');
    });

### 3, 注意点：
- `defer` 和 `async` 只对外部加载的脚本有效果。
- `defer` 和 `async` 在网络读取（下载）这部分是一样的，都是异步（相较于 HTML 解析），它们的差别在于脚本下载完之后何时执行。
- 如果加载过程中，碰到类似`image`标签的`src`，会异步去请求资源，不会阻塞后面的加载解析。

- 调试方法可以在`chrome`浏览器中，将`Network`的网速切换为`slow 3G`，就能详细的看到加载流程。

- `DOMContentLoaded`与`onload`：
  - 1，`DOMContentLoaded`:
  此时浏览器已经完全`加载`了HTML文件，并且DOM树已经生成好了。但是其他外部资源，如样式文件、图片、字体等并没有加载好, （如果该方法定义在了`async`的脚本中，则该方法不会执行，原因 `可能` 为该脚本为异步，无法获知其他脚本加载情况？），该方法是在`defer`指定脚本执行完毕才会执行.

  - 2，`onload`:
  此时浏览器已经将所有的资源都加载完毕，且其余脚本`执行完毕`之后，最后执行`onload`。

- `动态`添加的 `script` 标签隐含 `async` 属性
