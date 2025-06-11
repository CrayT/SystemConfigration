### websocket

#### node创建server

```javascript
const socket = require('ws');
const server = new socket.Server({ port: 8080, path: '/demo/' }); // demo后面要加/, 否则连接会失败
server.on('connection', (socket) => {
    console.log('Client connected');
    // 处理收到的消息
    socket.on('message', (data, isBuffer) => {
      console.log(`Received:`,  data, isBuffer, );
      // 在此处添加处理消息的逻辑
      if(isBuffer) {
        const decoder = new TextDecoder();
        const origin = decoder.decode(new Uint8Array(data));
        console.log('--',origin)
      }
    });
    // 处理连接关闭
    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });


// client:
// ws非加密，wss加密
const ServerAddr = 'ws://127.0.0.1:8080/demo'
class Client{
    initialize() {
        if (this.websocket_?.readyState === window.WebSocket.OPEN) return;
        this.websocket_ = new window.WebSocket(ServerAddr);
        this.websocket_.binaryType = "arraybuffer";
        this.openTime = Date.now();
        this.websocket_.onerror = this.onError;
        this.websocket_.onmessage = this.onMessage;
        this.websocket_.onopen = this.onOpen.bind(this);
        this.websocket_.onclose = this.onClose;
    }
    onError(e){
        console.log('error', e)
    }
    onMessage(event){
        try{
            const data = JSON.parse(event.data);
        } catch(e) {
            console.error(e)
        }
        
    }
    onOpen(e){
        console.log('open', e)
        const a = new ArrayBuffer(10)
        this.websocket_.send(a) // binary那里会收到
    }
    onClose(e){
        console.log('close', e)
    }

    send(data){
        this.websocket_.send(data); // text那里会收到
    }
}
const client = new Client();
client.initialize();

```