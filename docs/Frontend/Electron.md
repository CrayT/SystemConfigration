### electron开发中一些记录

- Node: 16.16.0 + Electrron: 21.4.4 + React

- 1, package.json增加main入口文件，指向electron的主进程文件：

```
main: 'electron/main.js',
description: "",
name: ""
```

- 2, 主进程

    创建window或view的时候，可指定预加载脚本，在预加载脚本内可通过`exposeInMainWorld` 暴露api给渲染进程,
使用次api的前提是需要开启进程隔离，即在webPreferences的contextIsolation为true；

如果需要在渲染进程中使用node的api如require，需要设置如下，并在渲染进程中通过window.require调用。否则会报错。

```
webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
}
```

- 3，进程间通信

多页面可使用MessageChannelMain来通信，使用方式为在主进程创建页面时，将成对的port分别传给需要通信的页面，并在每个页面内接受port后通信。

```
// 主进程
const { port1, port2 } = new MessageChannelMain();

mainWindow.once('ready-to-show', () => {
    // 需要延时一下　有时候页面不能及时收到
  setTimeout(() => {
        mainWindow.webContents.postMessage('port', {channel: 'pageA'}, [port1]);
  })
});

viewPage2.webContents.once('ready-to-show', () => {
viewPage2.webContents.postMessage('port', null, [port2]);
});



// 渲染进程
const { ipcRenderer } = window.require("electron");

/**
 * 配对port: hmi进程
 */
export const messagePort = (() => {
  let port;
  return {
    setPort: (p) => {
      port = p;
    },
    getPort: () => {
      return port;
    },
  };
})();

ipcRenderer.on("port", (e) => {

  const electronMessagePort = e.ports[0];
  messagePort.setPort(e.ports[0]);

  electronMessagePort.onmessage = (messageEvent) => {
    // todo
  };
});

// 通信
messagePort.getPort().postMessage({});
```

主进程监听渲染进程消息

```
// 双向通信用invoke - handle
ipcMain.handle('check-access', checkAccess);


// 单向通信用send - on
  ipcMain.on('messageName', handleMessage);

```

- 4, 多页面
在webpack配置中配置多页面, 示例为customize-cra已简化配置

```
const multipleEntry = require('react-app-rewire-multiple-entry')([
  {
    entry: path.join(__dirname, './src/electron/tab1/index.tsx'),
    template: path.join(__dirname, "./public/index.html"),
    outPath: './tab1.html',
    omitHash: false,
  },
  {
    entry: path.join(__dirname, './src/electron/tab2/index.tsx'),
    template: path.join(__dirname, "./public/index.html"),
    outPath: './tab2.html',
    omitHash: false,
  },
]);

module.exports = {
  webpack: override(
    setOutputForQiankun(),
    multipleEntry.addMultiEntry,
)}
```

- 5, 处理node sdk的打包问题
    addon的编译产为为node文件，前端需要通过require引入，不做其他处理时前端webpack打包会报错。
    思路为将node文件copy到build目录：

```
addWebpackPlugin((config) => {
    config.options.plugins.push(
    new copyPlugin({
        patterns: [{
        from: 'src/nodesdk', 
        to: path.resolve(__dirname, './build/app/modules/nodesdk'),
        toType: 'dir'
        },
    ]
    })
    );
}),
```

copy之后，需要对require的地方做处理，开发模式path为实际路径，打包后的生产模式，指向build里的路径

electron在make时有两种方式，electron-builder和electron-forge
此处用electron-forge make打包，配置文件为根目录的forge.config.js
打包时需要忽略node_modules,否则app会将其全部打包进去，但是实际加载的是build的产物，如果需要，可指定某个目录不要打包进asar压缩文件内，配置为

```
module.exports = {
  packagerConfig: {
    ignore: [
      /^\/node_modules/,
      /\.zip$/,
      /^\/src/,
    ],
    asar: {
      unpackDir: '**/hmisdk'
    }
  }
}
// 上面会将hmisdk目录放在app.asar.unpacked目录下，而不是app.asar文件内，默认安装的应用资源路径为/usr/lib/{appName}/resources/
```

- 6，electron开发模式启动方式为

```
// 这个方式可能会报错
dotenv -e .env.electron.dev electron-forge start

dotenv -e .env.electron.dev electron .

```


- 7, 崩溃监控

```
// 主进程
const {crashReporter} = require('electron');

crashReporter.start({submitURL: '', uploadToServer: false});
console.log('last crash:',crashReporter.getLastCrashReport())
console.log('getAppPath', app.getAppPath())

app.on('render-process-gone', (e, w, d) => {
  if(d.reason == "crashed") {
    console.log('crashed', d)
  w.reload()
  } else {
    console.log('render-process-gone')
  fs.appendFileSync('./log.txt', `${new Date()}渲染进程被杀死${d.reason}\n`)
  }
});
```

electron crashReport地址默认在:~/.config/appName/Crashpad/pending/下，会有多个崩溃日志

electron-minidump为npm安装的解析命令，可通过npm安装

用其解析dmp崩溃日志文件:
electron-minidump -f ./dmp.dmp -v 21.4.4
21.4.4为electron的版本，因为要下载对应版本的解析文件


8, 静态资源的加载
由于electron是file协议加载页面，可能会出现静态资源如某些json、gltf资源请求不到的情况，解决：
将app的BrowerRoute用HashRouter即可。
差异对比见`react/route.md`