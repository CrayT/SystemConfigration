### js实现自动复制
```javascript
let t = document.createElement('input')
t.value=url
document.body.appendChild(t)
t.select()
document.execCommand("Copy");
t.remove()
```