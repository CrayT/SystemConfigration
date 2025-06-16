React的两种route：BrowserRoute / HashRoute

HashRoute形式: localhost:3000/#/some/route, 此时location.hash为#/some/route，称为散列值，不会随请求发送到服务器端，所以改变hash不会重新加载页面。
BrowserRouter形式：localhost:3000/some/route

在单页面web网页中，单纯的浏览器地址改变，网页不会重载，如单纯的hash值改变，网页是不会变化的，因此我们的路由需要监听事件，并利用js实现动态改变网页。
hash 模式：监听浏览器地址hash值变化，onhashchange事件监听，并执行相应的js切换。

history 模式：利用H5 history API实现url地址改变，网页内容改变：
istory对象就是一个堆栈，方法：
History.back：移动上一个网址，等同于浏览器的后退。
History.forward:移动到下一个网址，等同于浏览器前进。
History.go:接受一个参数，以当前网页为基准，来进行跳转。默认history.go(0),刷新当前界面。
history.go(1) 相当与history.forward();
History.pushState():往history堆栈中添加一条记录。不会刷新界面，只会导致History对象变化，地址栏发生变化。
History.replaceState():是替换当前history堆栈中最上层的记录。也是不会刷新界面，只会是Histoty对象变化，地址栏发生变化。
每当history对象发生变化，就会触发popstate事件：window.addEventListener("popstate",function(){})

两种形式对比：
1，地址栏表现形式不一样：
BrowserRouter的路径：localhost:3000/demo/a
HashRouter的路径：localhost:3000/#/demo/a
2，刷新后对路由state参数的影响
BrowserRouter没有任何影响，因为state保存在history对象中。
HashRouter刷新后会导致路由state参数的丢失