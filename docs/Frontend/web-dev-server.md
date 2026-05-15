> web-dev-server是node端的web server工具，可以支持brotli压缩，下面只是示例brotli压缩提升浏览器下载速度的例子

### 启动方式

> 工具：web-dev-server

- 安装

```javascript
    npm install -D @web/dev-server
```

- 配置文件
创建web-dev-server.config.mjs，写入以下配置
```javascript
    // 根目录下web-dev-server.config.mjs
    export default {
    port: 8000,
    nodeResolve: true, // 解决你之前提到的 node_modules 导入问题
    // 使用中间件拦截请求并修改 Header
    middlewares: [
      (context, next) => {
        // 检查请求的文件是否以 .br 结尾
        // 服务端带上Content-Encoding: br才会触发浏览器自动解压
        if (context.url.endsWith('.br')) {
          // 1. 设置压缩类型为 br
          context.set('Content-Encoding', 'br');
          
          // 2. 修正 Content-Type（否则浏览器可能将其识别为下载文件）
          // 如果是 JS 的压缩包
          if (context.url.endsWith('.js.br')) {
            context.set('Content-Type', 'application/javascript');
          } 
          // 如果是 JSON 的压缩包
          else if (context.url.endsWith('.json.br')) {
            context.set('Content-Type', 'application/json');
          }
        }
        return next();
      },
    ],
  };
```

- 启动

```javascript
    npx web-dev-server // 启用import语句的解析: --node-resolve --open
```

> 静态资源文件用相关工具压缩为.br格式，即可开启brotli压缩，浏览器下载速度明显加快