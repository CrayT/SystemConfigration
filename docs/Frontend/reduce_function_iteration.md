### 实现一个方法：
- 可以传入一组 `function`和参数，`function`按照传入顺序逐个执行，每次将执行结果传递给下一个`function`.
```javascript
const demo = function(){
    let ar = arguments;
    return function() {
        return Array.from(ar).reduce( (t, f ) => {
            return f(t)
        }, arguments[0])
    }
}
```
- 示例：
```javascript
const a = demo( (t) => t * t, (b) => b+b, (c) => c*c*c)
console.log(a(3)) //5832
```