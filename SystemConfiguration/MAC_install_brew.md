### 1，brew安装需要安装`xcode-select`，如果没有安装`xcode`，则只需安装`xcode-select`：

```shell
xcode-select --install
```

### 2，官方安装`Homebrew`方式：

```shell
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
## 需要翻墙，并且是全局代理，否则可能无法连接到github
```

### 3，可能会出现以下报错信息：

> curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused

### 4，打开代理软件设置，找到`http`代理信息：

<img src="/Users/xutao/Library/Application Support/typora-user-images/image-20200216154822641.png" alt="image-20200216154822641" style="zoom:50%;" />

### 5，在`curl`中加入`socks`代理地址：

```shell
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install -x 127.0.0.1:1087)"
```

> 没有报错即安装成功。