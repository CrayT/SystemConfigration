# Nginx反向代理

#### 于2019年12月21日由[**crazyxt**](https://crazyxt.com/?author=1)发布

#### 用Nginx做反向代理：

> 用代理谷歌为例，将固定域名访问代理到谷歌。
> – 首先给域名添加了一个二级域名作为专门的域名，我的网站用的`cloudflare`做的CDN转发，所以也在`cloudflare`里添加了二级域名：`gl.crazyxt.com`.
> – 打开`nginx`的配置文件，因为单独用这个二级域名做反代，所以单独起一个`server`来实现：

```shell
server{ #反向代理谷歌
    listen 80 ; #监听80端口访问，没有用443端口。
    server_name gl.crazyxt.com; #监听这个域名来做反代。
    location / {
    proxy_redirect off;
    proxy_cookie_domain google.com <domain.name>;
    proxy_pass https://www.google.com; #Nginx的反向代理域名
    proxy_connect_timeout 60s;
    proxy_read_timeout 5400s;
    proxy_send_timeout 5400s;
    proxy_set_header Host "www.google.com";
    proxy_set_header User-Agent $http_user_agent;
    proxy_set_header Referer https://www.google.com;
    proxy_set_header Accept-Encoding "";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_set_header Accept-Language "zh-CN";
    proxy_set_header Cookie "PREF=ID=047808f19f6de346:U=0f62f33dd8549d11:FF=2:LD=en-US:NW=1:TM=1325338577:LM=1332142444:GM=1:SG=2:S=rE0SyJh2W1IQ-Maw";
    }
}
```

- 重启Nginx：

```
nginx -s reload
```

- 打开 `gl.crazyxt.com`，就会出现google的页面，也可以搜索，但是再点击被墙的链接时，依旧打不开、、、哈哈，这只是一个反代的例子吧。

- 通过配置不同的端口来访问不同的应用：

  - ```
    #访问一个应用实例：
    server {
            listen 7070 default_server;
            listen [::]:7070;
            root /var/www/html/mdresolver/;
            index index.php index.html index.htm index.nginx-debian.html;
            location  / {
                    try_files $uri $uri/ =404;
                    }
            location ~ \.php$ {
                    include snippets/fastcgi-php.conf;
                    fastcgi_pass unix:/run/php/php7.0-fpm.sock;
            }
    
    }
    ```

  - 注：一般的应用访问，貌似nginx默认用户是root，在/etc/nginx/nginx.conf中配置，字段为user，若改为非root，可能会出现404 not found。