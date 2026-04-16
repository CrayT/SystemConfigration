
> serve是node端的serve工具，用于前端项目的文件服务器

### 安装

```javascript
    npm install --global serve
```

```javascript
    yarn global add serve
```

### 直接使用

在项目根目录下运行会自动寻找静态文件，比如dist或build目录：
```javascript
    serve
```

### 指定目录
```javascript
    // 以单页模式服务dist目录文件
    serve -s dist
```

### 修改端口
```javascript
    serve -p 9090
```

### 允许跨域
```javascript
    serve -C
    // 或
    serve --cors
```

### docker中使用

> 在容器内默认端口3000，可在启动容器时指定端口映射
```javascript
    docker run -d -p 8080:3000 ${image}
```

### 配置文件

```json
    {
    "port": 8080, // 指定服务运行的端口，默认是 5000。
    "host": "0.0.0.0", // 指定服务运行的主机地址，默认是 localhost。
    "cache": 0, // 指定缓存时间，单位是毫秒。设置为 0 可以禁用缓存。
    "cors": "*", // 指定跨域资源共享的设置，* 表示允许所有跨域请求。
    "single": true, // 指定是否开启单页应用模式。
    "fallback": "index.html", // 指定当请求的文件不存在时，返回的默认文件
    "history": true // 指定是否支持 HTML5 History API，这对于单页应用来说是有用的
    }
```