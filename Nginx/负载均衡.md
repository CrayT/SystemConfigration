- windows和linux配置负载均衡没有不同;
- 配置nginx.conf文件，主要在http模块：
```
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    #gzip  on;
    #定义负载服务器地址，起名myserser
    upstream myserver{
        server 127.0.0.1:8000;
        server 127.0.0.1:8001;
    }
    server {
        listen       8888;
        server_name  127.0.0.1;
        location / {
            root   html;
            proxy_pass http://myserver;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}

```
> 需要确保端口8888是开启状态；
> 负载策略默认轮训方式，还有ip_hash、权重等方式，按需设置。

- windows启动nginx后窗口是一闪而过，需要查看log确认是否成功or失败；