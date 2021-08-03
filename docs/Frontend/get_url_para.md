### 正则匹配url参数
```javascript
function getUrlPara(name) {
    if (name) {
        var pattern = "(^|&)" + name + "=([^&]*)(&|$)"; //定义正则
        var flags = "i"; // 大小写不记
        var reg = new RegExp(pattern, flags); 
        var result = window.location.search.substr(1).match(reg); 
        if ( result ) return decodeURIComponent(result[2]);
        return null; 
    }
}
```
> `(^|&)` 从头开始匹配或匹配&，`=([^&]*)` 匹配后面零个或多个不是 `&` 的字符，`(&|$)` 匹配最后一个 `&` 或结尾.

`window.location.search` : 取`？`后面的字符串，包括`？`
- 示例：
  - `www.baidu.com?name=test&id=123456`, `getUrlPara("name')`应为返回`test`.