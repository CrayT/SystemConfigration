### javascript原型链
> 1, `js`本身不提供`class`的实现，`ES6`的`class`只是语法糖，`js`仍然是基于`原型`的语言

> 2, `js`只有一种结构：对象，每个实例对象`object`都有一个私有属性: `__proto__`， 指向它的构造函数的原型对象（`prototype`）。该原型对象也有一个自己的原型对象（`__proto__`），层层向上直到一个对象的原型对象为 null。根据定义，null 没有原型，并作为这个原型链中的最后一个环节。

> 3, 几乎所有 `JavaScript` 中的对象都是位于原型链顶端的 `Object` 的实例。

- 继承属性
> `JavaScript` 对象是动态的属性“包”（指其自己的属性）。JavaScript 对象有一个指向一个原型对象的链。当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。

- 例子：
```JavaScript
let a = function(){
    this.name = 1
}
a.prototype.say = function(){
    console.log(this.name)
}

let b = new a()
```

> b 继承自 a，`new`函数调用`a`的构造函数，创建这个函数的`实例对象`，所以`name`属于`b`的属性，`b`也可以调用`say`函数，但是`say`并不属于`b`，`say`位于`b`的原型上，属于a的`prototype`属性。当调用`say`时，首先现在`b`自身找，`b`上只有`name`属性，然后找`b`的`__proto__`，`b.__proto__ == a.prototype`, 在`a.prototype`上找到`say`函数，即调用之。


- `a`的默认属性`prototype`:
```JavaScript
console.log(a.prototype):
{
    say: ƒ, constructor: ƒ
    say: ƒ ()
    constructor: ƒ ()
    [[Prototype]]: Object
        constructor: ƒ Object()
        hasOwnProperty: ƒ hasOwnProperty()
        isPrototypeOf: ƒ isPrototypeOf()
        propertyIsEnumerable: ƒ propertyIsEnumerable()
        toLocaleString: ƒ toLocaleString()
        toString: ƒ toString()
        valueOf: ƒ valueOf()
        __defineGetter__: ƒ __defineGetter__()
        __defineSetter__: ƒ __defineSetter__()
        __lookupGetter__: ƒ __lookupGetter__()
        __lookupSetter__: ƒ __lookupSetter__()
        get __proto__: ƒ __proto__()
}
```
- `b`:
```JavaScript
{
    name: 1
    [[Prototype]]: Object
        say: ƒ ()
        constructor: ƒ ()
        [[Prototype]]: Object
            constructor: ƒ Object()
            hasOwnProperty: ƒ hasOwnProperty()
            isPrototypeOf: ƒ isPrototypeOf()
            propertyIsEnumerable: ƒ propertyIsEnumerable()
            toLocaleString: ƒ toLocaleString()
            toString: ƒ toString()
            valueOf: ƒ valueOf()
            __defineGetter__: ƒ __defineGetter__()
            __defineSetter__: ƒ __defineSetter__()
            __lookupGetter__: ƒ __lookupGetter__()
            __lookupSetter__: ƒ __lookupSetter__()
            get __proto__: ƒ __proto__()
}
```
> 可见，`b` 的`__proto__`是 `a` 的`prototype`, 当访问 `b` 的一个属性，浏览器先查看`b`是否存在这个属性，如果不存在，再在`__proto__`中查看，即`a.prototype`, 如果`a.prototype`不存在，再在 `b.__proto__.__proto___` 中查找，直到找到为止，但是任何函数的原型属性`__proto__`都是`Object.prototype` (无论继承多少层), 所以 `b.__proto__.__proto__.__proto__` 其实不存在，所以再遍历完整个`原型链`后还没查找到，则会判断属性不存在。

- 