### electron开发中一些记录

- Node: 16.16.0 + Electrron: 21.4.4 + React

- 1, package.json增加main入口文件，指向electron的主进程文件：

```javascript
main: 'electron/main.js',
description: "",
name: ""
```

- 2, 主进程

    创建window或view的时候，可指定预加载脚本，在预加载脚本内可通过`exposeInMainWorld` 暴露api给渲染进程,
使用次api的前提是需要开启进程隔离，即在webPreferences的contextIsolation为true；

- 通过该方式暴露的api在渲染进程调用时，不要传入某些多层嵌套的对象，实际只有一层可用，如：

```javascript
const demo = {
  fun1: () => {
    console.log('fun1')
  }
}
contextBridge.exposeInMainWorld("api", {

  sdk: demo,

});

// 渲染进程
window.api.sdk.fun1() // 会报错，提示找不到fun1


// 需要将每个调用的func都暴露出去，而不是整个对象暴露:
contextBridge.exposeInMainWorld("api", {

  sdk: {
    fun1: () => demo.fun1,
  },

});

```


如果需要在渲染进程中使用node的api如require，需要设置如下，并在渲染进程中通过window.require调用。否则会报错。

```javascript
webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
}
```

- 3，进程间通信

多页面可使用MessageChannelMain来通信，使用方式为在主进程创建页面时，将成对的port分别传给需要通信的页面，并在每个页面内接受port后通信。

```javascript
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

```javascript
// 双向通信用invoke - handle
ipcMain.handle('check-access', checkAccess);


// 单向通信用send - on
  ipcMain.on('messageName', handleMessage);

```

- 4, 多页面
在webpack配置中配置多页面, 示例为customize-cra已简化配置

```javascript
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

```javascript
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

```javascript
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

打包产物的配置为:

```javascript
  makers: [

    {
      name: '@electron-forge/maker-deb', // 输出linux的deb,下面两个正常可删除
      config: {},
    },    
    {
      name: '@electron-forge/maker-zip', // 输出linux的deb
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-rpm', // 输出linux的rpm,
      config: {},
    },
  ],
  outDir: 'build/'　// 输出目录
```


- 6，electron开发模式启动方式为

```javascript
// 这个方式可能会报错
dotenv -e .env.electron.dev electron-forge start

dotenv -e .env.electron.dev electron .

```


- 7, 崩溃监控

```javascript
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

---

#### 下面为实际开发时遇到的问题及解决办法

```javascript
electron:
yarn config set electron_mirror https://npmmirror.com/mirrors/electron/
yarn config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/

环境变量PUBLIC_URL 优先级比 package.json的homepage高
减小打包体积：
1，删除node_modules
2, 安装electron：
yarn add electron-packager --dev-save

electron相关：
set   index.html  electron
PUBLICPATH=./build/  : 本地build绝对路径 白屏
    index.html 改为./build 也白屏
        改为 ./static/js/... 能加载js，但是静态资源无法加载

不设置：
    index.html内js 为./static/.. 不白屏
    但svg无法加载，路径为file:///static

设置PUBLIC_URL=./
    与不设置相同

设置PUBLIC_URL=/
    index.html内js 为/static/.  白屏

打包出的gltf和png路径设置一致，但是png等图片无法加载到，gltf可以(assr的路径)，图片是static的绝对路径
用http-server本地起server，却是正常的。


用electron-builder打包：
    1，yarn add electron-builder --save-dev
    2，electron.js移动到build目录下，内容和main.js一样


node切换成15.16.1，electron21.4.14 能在容器中启动打开
高版本无法打开，报错


0508
1，在main中引入node_modules中的hmisdk，打包后提示找不到
2，手动放到同级目录下，打包后提示没有libad_visualizer.so。。。。
3，直接将代码copy进容器，可以跑起来：
    1，目前只能在主进程中加载sdk，渲染进程，浏览器环境无法加载，即使开启了nodeIntegration
    2，在preload中加载sdk，将接口暴露给渲染进程，不能整个sdk暴露，只能暴露一层对象属性，所以sdk内的function都需要逐个暴露；
    3，sdk需要后端改造的visualizer配合，
    4，晚上：用朱亮给的node包和sdk包重新跑，重新下载他提供的数据包，和播包流程，播包成功了，但是貌似visualizer没有启动，setVisCallback也没数据

0509
1，将hmisdk的.index.js的require改为hmisdk.node能打包，否则会报Module not found的错，但是打包后libad的so文件丢失
    make之后找不到hmisdk
    渲染进程中要使用require，需要webPreferences: nodeIntegration: true, contextIsolation: false;
    上面contextIsolation为false之后，就无法使用preload的exposeApi了
    不设置false，将require通过api暴露给渲染进程使用；

Final：
已经跑通打包、数据接收：
    1，src同级创建hmisdk目录，将sdk相关文件放进去；
    2，hmisdk/index.js的require要表明hmisdk.node, 否则可能会报错Module not found；
    3，preload脚本中通过index.js加载sdk，路径通过process.resourcePath + app.asar.unpackDir拼接，不直接引用当前目录的hmisdk；引用打包后的路径；以内不在容器内，开发模式会报capnp的包的错误，所以无法调试，直接指定最终打包路径
    4，配置文件json，由于是addon，在asar内有问题，不能打包在asar内，通过forge.config.json配置的app.asar.unpackDir指定hmisdk不打包进asar内：`unpackDir: "**/hmisdk" `, (注意：前面要加**，否则最终打包的app.asar.unpack/hmisdk内只包含那个node文件)
        - ignore中不能将hmisdk目录加上去，否则会导致unpackDir为空；
        这种方式会导致hmisdk的文件在asar和app.asar.unpackDir中各存一份；
    5，在4基础上拼接配置文件路径，调用sdk的setConfig传入配置文件的当前绝对路径，
    6，通过暴露api方式，将sdk的start、setVisCallBack等方法逐一暴露，渲染进程中再调用，不能将整个sdk暴露，因为exportInMainWorld好像只能暴露一层对象；
    7，打开app后，先执行hmi.app.setVisCallBack(), 再执行hmi.app.start()，才能收到数据


0514
1, 渲染进程中通过require('electron')，然后ipcRender.on等进行进程间通信，会报错，大概是contextBridge 循环递归深度超了导致404页面异常了。


0515
1，去掉昨天加的新窗口，将数据解析放到hmi页面的worker线程中，topic数据直接post给topic和chart页面；数据流已跑通；
2，开始处理切分，单纯的切分没啥难度，主要是每个切分出的组件都有上下依赖关系，需要记录处理这种依赖，比如删除中间一个面板后，其余相关的面板都要更新；已实现单纯的切分，依赖关系待处理，参考了foxGlove的切分配置(通过打断点，看到它有一个layout记录每个panel的切分记录，first为当前panel，second为切分出的panel，另有一个config记录每个panel的信息)。todo

0519
搞定了切分整体逻辑，主要是删除：
    layout记录切分过程，一个树状结构，
    删除一个面板时，根据layout重新计算config，由于是二分，所以难度降低；

0520
1，渲染进程要完整使用require，需要将contextIsolation设为false，如果通过preload暴露require给渲染进程，那require出来的对象也会被重新序列化一次导致不是原始对象；
2，直接写require无法成功定位到node，webpack将其编译为了process.dlopen，后来改为window.require就正常了，包括页面js中require('electron')也是一样；
    同时在config中加一个rule，用node-loader处理.node文件，将其处理到static文件夹中，再用copywebpackplugin将hmisdk中的文件copy到static中，解决配置文件加载问题
    make后的deb加载sdk会有问题，因为打包后，node_modules被忽略，直接require会not found，需要在加载sdk的地方判断当下环境，生产环境需要将路径定位到sdk目录，即asar.unpack的目录：
        - unpack目录通过make时forge.config.json配置：packagerConfig.asar.unpackDir: '**/hmisdk', 配置。
        webpack配置文件中可用node-loader处理node文件，输出到build/app/modules/dist目录，用copyWebpackPlugin将node_modules/hmisdk拷贝到/build/app/modules/hmisdk目录下，
            好像因为直接copy了，不再需要node-loader处理了。
经多次测试，开发模式、生产模式均可跑通；


容器内编译hmisdk
1，需要拉取node_visualizer源码到容器内，或将代码copy到容器内
2，安装cnop_dlp的ci包；
3，按照addon里的readme安装，如果提示permission denied，将build及addon目录赋权限: sudo chmod -R 777 ./build


                  
asar用 asar extract 解压
```