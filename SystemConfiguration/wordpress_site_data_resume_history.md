- 之前在其他的服务器上搭建了wordpress，使用`nginx + php7.0 + mysql`，后来换服务器后，不想从头搭建，想直接把之前的网站和数据库数据迁移过来，但是一直弄了很久才搞定，走了好多冤枉路，这里记录下

- 恢复数据库

  - 网站的数据用户名为`wordpress`，在新服务器上安装`mysql-server`， 然后启动`mysql`服务，按照数据库恢复操作将备份的数据库恢复出来即可
  - 更换域名或IP后，需要将数据库中记录的域名也换掉，参照恢复数据中的操作即可。(不确定这一步有没有影响)

- 恢复网站

  - 将打包的网站数据恢复到`/var/www/html/`下，将`wordpress`文件夹访问权限改为`www-data`:

    - ```
      chown -R www-data:www-data /var/www/html/wordpress
      ```

    - 修改`wp-config.php`中的数据库参数和`Authentication`中的key

- 修改php7.0中的user和group为www-data，参照`配置php7.0`中的记录

- 修改nginx配置：

  ```
  server {
          listen 80;
          listen [::]:80;
          root /var/www/html/wordpress;
          server_name crazyxt.top;
          index index.html index.php;
          location  / {
                  add_header  Access-Control-Allow-Origin *;
                  add_header  Access-Control-Allow-Methods GET,POST;
                  add_header  Access-Control-Allow-Headers DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization;
                  try_files $uri $uri/ =404;
                  }
          location ~ \.php$ {
                  fastcgi_index index.php;
                  fastcgi_pass unix:/run/php/php7.0-fpm.sock;
                  fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; //document_root及上面的root地址
                  include fastcgi_params;
                  autoindex on;
          }
          location ~ /fpm_status$ {
                  allow 127.0.0.1;
                  #deny all;
                  fastcgi_param SCRIPT_FILENAME $fastcgi_script_name;
                  include fastcgi_params;
                  fastcgi_pass unix:/run/php/php7.0-fpm.sock;
          }
  }
  ```

- 此时为了测试nginx配置是否正确及php是否能正确解析，可在wordpress目录下新建个info.php, 然后访问 域名/info.php，如果出现php配置页，说明php能正确解析
- 这是如果直接访问域名会出现空白页面，应该先进入admin页，即：域名/wp-admin,然后输入邮箱登录，做好界面配置后即可域名登录网页了【之前一直没做这一步，因为以前初次安装wordpress时会进入配置，后来就忘记这一步了，一直以为是nginx或php配置的问题导致空白页面或file not found等问题，后来在一个博客里看到说换域名后要进入admin更新配置才意识到这一点，真是疏忽了！！一顿操作后网站又回来了，虽然以前喜欢的主题现在已经找不到了，不过没关系，再找更喜欢的吧。】

