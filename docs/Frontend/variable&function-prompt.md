### JS中的变量提升 & 函数提升: `Hoisting`

> `JS` 只有全局作用域和函数作用域，但是 `let` 出现后，就有了块级作用域，`var` 关键字存在 `提升` 的问题。

#### 变量提升

- 考虑如下代码：
```javascript
    function demo(){
        if(true){
            var a = 1
        }
        console.log(a)
    }
    demo() //输出1, 如果是let定义，则会正常出现ReferenceError
```
- 如下：
```javascript
    console.log(a)
    var a = 1
    //输出undefined(已声明 但未定义)
```
- 解释：
> 这是一个 `变量提升` 现象，`var a = 2`其实被js处理成了两部分：`var a` 和 `a = 2` ，第一个定义声明是在编译阶段(`词法分析`)进行，第二个赋值声明是在`执行阶段`，所以上述代码相当于:

```javascript
    var a;
    console.log(a)
    a = 1
```
> 备注：无论作用域中的声明出现在什么地方，都将在代码在执行前进行处理，将所有的声明(变量和函数) `"移动"` 到作用域的顶部，这个过程称为 `变量(函数)提升`。

#### 函数提升
- 继续看例子:

```javascript
    var a = 10
    foo()
    function foo(){
        if(a){
            var a = 1
        }
        console.log(a) //输出undefined
    }
```
- 解释:
> 函数声明优先于变量声明，所以上面代码相当于：

```javascript
    function foo(){ //函数提升
        var a //变量提升
        if(a){
            a = 1
        }
        console.log(a) //undefined
    } 
    var a //变量提升
    a = 10
    foo()
```
> 备注，js中函数两种定义方式，一种是函数声明( `function` 定义)，一种是函数表达式(用 `var` 定义), 后者不会被提升

- 考虑如下代码：

```javascript
    var a = 10
    foo()
    var foo = function(){
        if(a){
        var a = 1
        }
        console.log(a)
    }
```
- 代码解析为:
  
```javascript
    var a
    var foo
    foo()
    a = 10
    foo = function(){
        var a
        if(a){
            a = 1
        }
        console.log(a)
    }
```
> `foo` 的调用在定义之前，`foo` 是 `undefined`, 所以会报 `ReferenceError`.

#### 优先级：
> 函数提升优于变量提升，这意味着函数会被提升到更靠前的位置。

#### 备注
- 1，实际上变量和函数声明在代码里的位置是不会动的，而是在编译阶段被放入内存中。
- 2，`JavaScript` 在执行任何代码段之前，将函数声明放入内存中的优点之一是，你可以在声明一个函数之前使用该函数
- 3，`JavaScript` 只会提升声明，不会提升其初始化。