// import {test11 as test1, test12 as test22, test13 as test133} from "./cls.js"
import {sss} from "./index.js"
export class test2{
    ttt(){
        console.log('hello 1')
        // let t = new test1()
        // t.test()
        console.log('hello3',) //console直接输出；

            this.f();

        console.log('hello6') //hello11之后输出hello6

    }
    async f(){
        let ft1 = this.f2('1')
        let ft2 = this.f2('2')

        console.log('hello11') //直接跟着之前的hello3输出

        const f1 = await ft1 //await会暂停之后的代码执行，当前命令进入微服务队列等待执行
        const f2 = await ft2

        console.log(f1)
        console.log(f2)
        console.log('hello12') //最后执行。
    }

    async f2(id){
        return await id
    }

}
