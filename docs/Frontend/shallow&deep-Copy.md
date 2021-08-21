### 浅拷贝与深拷贝
> 基本数据类型：直接存储在栈中的数据；
> 引用数据类型：存储的是对象在栈中的引用，真实数据存放在堆内存中。


#### 浅拷贝
- 只复制指向对象的指针，而不复制对象自身；如果属性是基本类型，就拷贝基本类型的值；如果属性是对象(引用类型)，拷贝的就是内存地址，其中一个对象改变就会影响到另一个对象；
![](https://raw.githubusercontent.com/CrayT/picCabin/master/1111.jpg)


- `Object.assign` 进行的是浅拷贝；


- `JSON.parse(JSON.stringfy())` 进行的深拷贝
  
- 参考如下
  
```javascript
var a = { 
    aa : 1, 
    bb : { 
        bbb : 2
    } 
}
var b = Object.assign({}, a);

b.aa = 2;
console.log(a)  //{ aa : 1, bb : { bb : 2 } }  //b改变的是基本数据aa，不影响a中的aa；
b.bb.bbb = 3
console.log(a) //{ aa : 1, bb : { bbb : 3 } } //b改变的数引用数据类型bb，会影响a中的bb；
```

- Array:
  - `Array.prototype.concat()` 、 `Array.prototype.slice()`
> 两者都会返回一个浅复制原数组的新数组，如果某个元素是引用，则修改一个，同步两个；