### js Worker的使用心得

- 可利用worker线程处理数据，避免阻塞js线程，数据处理完毕再发给主线程使用

示例:
```javascript
const decoder = new TextDecoder(); // 从arrayBuffer解析文本字符
self.onmessage = (event) => {
  const originData = event.data;
  if (originData) {
    try {
        const str = decoder.decode(new Uint8Array(originData));
        postMessage({ data: JSON.parse(str), type: DataType.JSON });

        // 解析字符的方法2, 这个方式可能会因数据大小问题Max callstack error的问题
        // String.fromCharCode.apply(null, new Uint8Array(originData)),

    } catch (e) {
        console.error(e);
    }
  }
};

```

1, worker内不要间接引入第三方库，可能会报错，最好直接引入，比如解析protobuf数据类型

```javascript
import protobuf from "protobufjs";
import ProtobufSchema from "./schema.json";  // 数据结构定义
const ElementStr = "protobuf.Element"; // 数据名称
const root = protobuf.Root.fromJSON(ProtobufSchema);
const ProtobufElementSchema = root.lookupType(ElementStr);
self.onmessage = (event) => {
  const originData = event.data;
  if (originData) {
    try {
      const uint8buffer = new Uint8Array(originData);
      const res = ProtobufElementSchema.decode(uint8buffer);
      postMessage({ data: res });
    } catch (e) {
      console.error(e);
    }
  }
};
```

2，向worker传输数据时，可利用transferObject加快传输速度，但数据类型有限制，一般为arrayBuffer、图像数据等:

```javascript
const uint8Array = new Uint8Array();
const obj = {
    data: uint8Array,
    type,
}
this.worker.postMessage(obj, [uint8Array.buffer]);
```

arraybuffer一旦转移，后面便无法再次访问其数据，如length等

3，js线程接收worker数据

```javascript
// @ts-ignore
import dataWorker from "./worker.js";

class Demo {
    constructor() {
        this._worker = new dataWorker();
        this._worker.onmessage = this.onMessage;
    }

    onMessage(event: MessageEvent) {
        if (event.data.data) {
        // todo
        }
    }
}
```