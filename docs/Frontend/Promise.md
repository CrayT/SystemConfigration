### 手写实现Promise
- 参考：[博文](https://juejin.cn/post/6850037281206566919)
- `github`: [`https://github.com/CrayT/newPromise`](https://github.com/CrayT/newPromise)
```js
const Pending = "Pending";
const Resolved = "Resolved";
const Reject = "Reject";

const resolvePromise = (promise2, x, resolve, reject) => {
    console.log(promise2)
    if(promise2 == x){
        throw new TypeError("Error")
    }
    let called; //防止resolve和reject同时调用，这里进行处理
    if(typeof x === "object" && x != null || typeof x === "function"){
        try{
            let then  = x.then;
            //判断x是否是一个promise，如果是，则then为function，需要递归；如果不是，则then为普通值，直接可resolve
            if(typeof then === "function"){
                console.log("x 为promise")
                then.call(x, y=>{
                    if(called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject)
                }, e => {
                    if(called) return;
                    called = true
                    reject(e);
                })
            } else {
                resolve(x)
            }
        }catch(e){
            if(called) return;
            called = true;
            reject(e)
        }

    }else {
        resolve(x)
    }
}
class NewPromise {
    constructor(fn){
        this.status = Pending;
        this.value = undefined;
        this.reason = undefined;

        this.onResolveCallBack = [];
        this.onRejectCallBack = [];

        const resolve = (value) => {
            if(this.status == Pending){
                this.status = Resolved;
                this.value = value;
                this.onResolveCallBack.forEach(f => {
                    f();
                })
            }
        }

        const reject = (reason) => {
            if(this.status == Pending){
                this.status = Reject;
                this.reason = reason;
                this.onRejectCallBack.forEach(f => {
                    f();
                })
            }
        }

        try{
            fn(resolve, reject)
        }catch(e){
            reject(e)
        }
        
    }
    //思路：将onFullfill和onReject加入到resolve和reject的回调中，在执行resolve或reject时，执行onFullFill或onReject
    then(onFullfile, onReject){
        onFullfile = typeof onFullfile === "function" ? onFullfile : v => v;
        onReject = typeof onReject === "function" ? onReject : err => {throw err}

        let pro = new NewPromise( (resolve, reject) => {
            if(this.status == Resolved){
                setTimeout(()=>{
                    try{
                        let x = onFullfile(this.value)
                        resolvePromise(pro, x, resolve, reject)
                    }catch(e){
                        reject(e)
                    }
                }, 0)

                
            }
            if(this.status == Reject){
                setTimeout(()=>{
                    try{
                        let x = onReject(this.reason)
                        resolvePromise(pro, x, resolve, reject)
                    }catch(e){
                        reject(e)
                    }
                },0)

            }
            if(this.status == Pending){
                this.onResolveCallBack.push( () =>{
                    //setTimeout(()=>{
                        try{
                            let x = onFullfile(this.value)
                            resolvePromise(pro, x, resolve, reject)
                        }catch(e){
                            reject(e)
                        }
                    //},0)

                })
                this.onRejectCallBack.push( () => {
                    //setTimeout(()=>{
                        try{
                            let x = onReject(this.reason)
                            resolvePromise(pro, x, resolve, reject)
                        }catch(e){
                            reject(e)
                        }
                    //},0)

                })
            }
        })
        return pro
    }
}

var a = new NewPromise((resolve, reject)=>{
    setTimeout(()=>{
        console.log("start")
        resolve("\nyes resolve!")
    }, 1000)
    
})
.then((value)=>{
    return new NewPromise((resolve, reject) => {
        resolve(value)
    })
})
.then( (value) => {
    console.log("hello", value, '\n')
}, (err) => {
    console.log("no", err, '\n')
})
```