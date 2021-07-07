# Mac+VS Code编译C++

#### 于2020年1月6日2020年1月6日由[**crazyxt**](https://crazyxt.com/?author=1)发布

##### 写在文章开头：在Mac上编译C++真难(如果不用Xcode的话)，之前尝试过几次均以放弃告终。

> 在mac上编译C++用的是clang++，而不是gcc…具体啥关系，我也不是很懂。

##### 1，先在VScode上安装C++插件，包括`C/C++`、`C/C++ Clang Command Adapter`.

##### 2，按`shift+command+P`键打开输入，输入`C/C++`，选择`编辑UI`，进而打开C/C++ 配置页，配置名称填`Mac`，编译器路径填 `/usr/bin/clang`（这个好像无所谓?设置好后，后来又变了)，`IntelliSense`选择`clang-x64`，其他不动。

##### 3，创建`task.json`，内容如下：

```
{
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Build with Clang",
        "type": "shell",
        "command": "clang++",
        "args": [
          "-std=c++17",
          "-stdlib=libc++",
          "demo.cpp", #c++文件名称，只能是这个名称，否则报错
          "-o",
          "demo.out", #还有这里
          "--debug"
        ],
        "group": {
          "kind": "build",
          "isDefault": true
        }
      }
    ]
  }
```

##### 4，创建`launch.json`,内容如下：

```
{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "(lldb) Launch",
        "type": "cppdbg",
        "request": "launch",
        "program": "${workspaceFolder}/demo.out", #文件名称
        "args": [],
        "stopAtEntry": true,
        "cwd": "${workspaceFolder}",
        "environment": [],
        "externalConsole": true,
        "MIMode": "lldb",
        "logging": {
          "trace": true,
          "traceResponse": true,
          "engineLogging": true
        }
      }
    ]
  }
```

##### 5，至此，C++目录应该有一个`.vscode`文件夹，里面三个`json`文件，这三个文件就是配置文件，如果新建其他C++文件夹，直接将他们拷贝过去就行了(据官网说是这样，没试过)。

##### 6，在目录下，创建`demo.cpp`文件，按`shift+command+B`键编译，生成`demo.out`,然后输入`./demo.out`即可成功运行：

```
#编译如果没有错，显示如下：
> Executing task: clang++ -std=c++17 -stdlib=libc++ demo.cpp -o demo.out --debug <
终端将被任务重用，按任意键关闭。
#运行结果：
➜  C++ ./demo.out
101 78.5
101 80.5
```

##### 写在后面：看了这么多博客，今天又看了vscode的官方，终于可以在vscode里编译c++了！

PS：官方教程：https://code.visualstudio.com/docs/cpp/config-clang-mac

> 按下`shift+command+P`，输入`shell`，选择`Shell Command: Install 'code' command in PATH.`,即将`code`命令添加进系统环境，在终端时，在某个文件夹下输入`code`即可以`vscode`打开该文件夹。