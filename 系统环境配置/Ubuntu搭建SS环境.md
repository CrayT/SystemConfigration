# Ubuntu搭建SS环境

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

**1，传统安装shadowsocks：**

```
sudo apt-get update
sudo apt-get install python-pip
sudo pip install shadowsocks
```

**2，建立配置文件，如ss.json，配置如下：**

```
{
    "server":"my_server_ip",
    "server_port":"port",
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"mypassword",
    "timeout":300,
    "method":"aes-256-gcm"
}
```

**3，启动服务：**

```
ssserver -c ss.json -d start
#一般需要后台运行，可用nohup或screen工具:
nohup ssserver -c ss.json &
#或者借助screen：
screen -S VPN
screen -r VPN
```

**4，用ss-bash，流量管理:**

```
wget https://github.com/hellofwy/ss-bash/archive/master.zip
unzip master.zip
cd ss-bash-master/
./ssadmin.sh  add port  #密码 流量  #添加端口号 密码  流量限制
./ssadmin.sh start  #这一步用nohup或screen执行，使其后端运行。
```

**5，搭建中可能的问题：**

1）ss-bash可能会出现ssserver启动失败，可能原因有二：

1> 如果是libsodium的问题，安装即可：

```
wget https://download.libsodium.org/libsodium/releases/LATEST.tar.gz
tar xzvf LATEST.tar.gz
cd libsodium*
./configure
make -j8 && make install
echo /usr/local/lib > /etc/ld.so.conf.d/usr_local_lib.conf
ldconfig
```

2>查看当前ssserver版本，ssserver –version,如果是3.0以下版本，可能配置文件中的加密方式与当前版本不兼容，需要升级版本：

```
pip3 install https://github.com/shadowsocks/shadowsocks/archive/master.zip
```

**Tips：获取nohup启动进程的pid：**

```shell
ps -ax | grep 服务命令
kill pid
```





### 以上版本的shadowsocks已经几年不维护了，shadowsocks-libev一直在维护，下面是libev的搭建方式：

#### 源码编译：

```shell
sudo apt-get install --no-install-recommends build-essential autoconf libtool \
        libssl-dev gawk debhelper dh-systemd init-system-helpers pkg-config asciidoc \
        xmlto apg libpcre3-dev zlib1g-dev libev-dev libudns-dev libsodium-dev libmbedtls-dev libc-ares-dev automake
git clone https://github.com/shadowsocks/shadowsocks-libev.git
cd shadowsocks-libev
git submodule update --init
./autogen.sh && ./configure && make
sudo make install
```

> 在重装系统的ubuntu16.04上以上代码可正常执行。

#### 配置文件config.json：

```json
{
    "server": "0.0.0.0",
    "timeout": 60,
    "method": "chacha20-ietf-poly1305",
    "server_port":"2048",
    "password":"1234abcd,.",
}
```

#### 启动：

```shell
nohup ss-server -c config.json &
```

> shadowsocks-libev的git仓库：https://github.com/shadowsocks/shadowsocks-libev

- 查看端口是否开启:
-  ```
-  netstat -lnp | grep ss-server
-  ```