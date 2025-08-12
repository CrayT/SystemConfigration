### nginx 使用示例，托管静态网址

/etc/nginx/nginx.conf为nginx的默认配置，可以另外添加配置文件，或者直接修改该文件

监听端口
```conf
server {
            
    listen 8089; # 监听端口
    server_name 127.0.0.1; # 地址
    
    root /var/www; # 资源所在跟目录
    # 访问localhost:8089/test会定向到/var/www/里找test目录下的index.html
    # 前端打包时，需要指定PUBLIC_URL=/test，这样静态资源加载时才会路径正确
    location /test { 
        index index.html;
    }

    # 访问localhost:8089/path1/path2会定向到/var/www/里找/path1/path2目录下的index.html
    # 前端打包时，需要指定PUBLIC_URL=/path1/path2，这样静态资源加载时才会路径正确
    # react配置的路由，比如hashRouter，如果设置了二级路由，比如/route1/route2, 访问localhost:8089/path1/path2/route1/route2也能正常访问
    location /path1/path2 { 
        index index.html;
    }
}
```

修改配置后，重启nginx:
```bash
sudo systemctl reload nginx
```