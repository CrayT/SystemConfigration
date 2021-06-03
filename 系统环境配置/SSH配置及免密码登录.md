# SSH配置及免密码登录

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

### 系统：ubuntu

### 步骤：

#### 1、在本机和需要ssh登录的机器上安装openssh-server:

```
sudo apt-get install openssh-server -y
service ssh start
```

#### 2、在本机和需要ssh登录的机器上生成rsa秘钥：

```
ssh-keygen
#中间提示按enter确认即可
```

#### 3、拷贝本机公钥：

- cd ~/.ssh
- cp id_rsa.pub authorized_keys
- 把本机的id_rsa.pub一字不差的拷贝到需要登录主机的authorized_keys中
- 启动ssh服务

```
service ssh start
```

#### 4、远程无密码登录：

```
ssh root@IP
```

#### 5、免输入IP登录：

```
 cd ~/.ssh
 touch config
 vim config
```

在config中编辑：

```
Host name
   HostName  IP
   Port  port
   User user
```

然后就可以：

```
ssh name
```

Tips:修改ssh登陆欢迎信息：

进入目录 /etc/update-motd.d，里面几个文件，分别设置不同的登陆信息，可根据需要修改。


### 启动问题：
   - service sshd restart 可能报错，查看报错信息可能提示 /var/run/ssh不存在，只要mkdir个该文件，即可启动ssh。