### iterable可迭代对象

- 可迭代（Iterable） 对象是数组的泛化。这个概念是说任何对象都可以被定制为可在 for..of 循环中使用的对象。
数组是可迭代的。但不仅仅是数组。很多其他内建对象也都是可迭代的。例如字符串也是可迭代的。

### 实现可迭代对象

- 实现可迭代对象需要两个方法：Symbol.iterator()和next()。

- 同步生成器
```js
const myIter = {
    [Symbol.iterator]: function() {
        let count = 0;
        return {
            async next() {
                if(count < 5) {
                    return {value: count++, done: false};
                } else {
                    return {done: true};
                }
            }
        }
    }
}

for(const value of myIter) {
    console.log(aa) // 输出 0, 1, 2, 3, 4
}
```

- 异步生成器
```js
const myIter = {
    [Symbol.iterator]: function() {
        let count = 0;
        return {
            async next() {
                if(count < 5) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve({value: count++, done: false})
                        }, 1000)
                    })
                } else {
                    return {done: true}
                }
            }
        }
    }
}
const n = myIter[Symbol.iterator]();

async function run() {
    for(;;) {
        const aa = await n.next();
        if(aa.done) break;
        console.log(aa.value) // 间隔1s输出0,1,2,3,4
    }
}
run();
```