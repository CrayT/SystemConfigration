# 网站安装SSL证书开启https加密访问

#### 于2019年12月18日2019年12月18日由[**crazyxt**](https://crazyxt.com/?author=1)发布

## 使用`letscrypt`为网站安装免费`ssl`证书开启https加密访问：

> 系统环境：Ubuntu 16.04

### 1，安装`acme.sh`,借助该工具安装证书：

```
wget -O - https://get.acme.sh | sh
```

> 该脚本完成以下：
> \1. 生成复制了`acme.sh` 到你的 `~/.acme.sh/`目录下 ，后面所有的证书都会在这个目录生成；
> \2. Create alias for: `acme.sh=~/.acme.sh/acme.sh`. 注意：安装完成后你需要关闭再打开终端才可以让 `alias` 生效。
> \3. 增加了一个定时任务，用于`SSL`证书更新.

### 2，为域名添加证书：这里根据`DNS API`自动验证域名：

前往`namesilo`域名网站获取`API`:
`https://www.namesilo.com/account_api.php`

### 3，导入域名`API`:

```
export Namesilo_Key=API Key`
`source /etc/profile
```

> 需要注意的是，`API Key`一旦`export`，`acme.sh`就会在配置文件`~/.acme.sh/account.conf`中导入该`key`，如果后期重新生成`API`，则需手动到该文件中修改。

### 4，为域名安装证书：

```
acme.sh --issue --dns dns_namesilo -d crazyxt.com -d *.crazyxt.com
```

> 证书安装次数有`ratelimit`限制，如果超过次数会报错，方法是等几个小时后再试。

### 5，配置`Nginx`：

`Nginx`配置文件：`/etc/nginx/nginx.conf` `http`段中加入以下设置:

```shell
ssl_session_cache   shared:SSL:10m;
ssl_session_timeout 10m;
ssl_certificate /root/.acme.sh/crazyxt.com/fullchain.cer;
ssl_certificate_key /root/.acme.sh/crazyxt.com/crazyxt.com.key;
```

### 6,配置`Nginx https`转发：

之前访问方式为`http`访问，配置好`SSL`证书之后需要将`http`转发为`https`访问，方式为修改`Nginx`配置文件：`/etc/nginx/sites-available/default`:

```shell
server {
    listen 80 default_server; #http默认80端口访问
    listen [::]:80 default_server;
    rewrite ^(.*)$ https://$host$1 permanent; #转发为https访问
}
server{
    # SSL configuration
     listen 443 ssl default_server; #https默认443端口访问
     listen [::]:443 ssl default_server; 

    root /var/www/html/wordpress/;
    index index.php index.html index.htm index.nginx-debian.html;

    server_name www.site.com site.com;
    location / {
        try_files $uri $uri/ =404;
    }
    location ~ \.php$ { #开启php支持
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php7.0-fpm.sock;
    }
    location ~ /\.ht {
        deny all;
    }
}
```

> 配置好之后，再通过`http://site.com`访问时，会自动转发到`https`访问。

### 7，重启`Nginx`：

```
nginx -s reload
```

### 8，修改`wordpress`全站为`https`访问

- 1，`wordpress` > 设置 > 常规,修改站点地址为`https`：
  ![img](https://crazyxt.com/wp-content/uploads/2019/12/%E6%88%AA%E5%B1%8F2019-12-19%E4%B8%8B%E5%8D%882.10.22.png)
- 2，下载插件`Velvet Blues Update URLs`，将所有`url`改为`https`访问：
  ![img](https://crazyxt.com/wp-content/uploads/2019/12/%E6%88%AA%E5%B1%8F2019-12-19%E4%B8%8B%E5%8D%882.12.55.png)
- 3，修改完之后，打开主页是不是已经出现安全加密小锁，如果没有，可以通过浏览器控制台工具查看哪个元素依旧为`http`连接，（这次发现主页的前景和背景图片链接依旧为`http`，所以将原始图片移除，然后重新上传，然后可以看到出现加密小锁）。