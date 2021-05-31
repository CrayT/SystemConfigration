# php管理工具Composer在Dockerfile中的安装与使用

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

**1,安装:**
curl安装方式出错,这里使用直接下载方式:
浏览器访问https://getcomposer.org/installer,将会下载文件composer.phar.
**2,使用:**
在当前下载目录下,composer.phar是可执行程序:
php composer.phar 命令,即可使用(当然也只能在当前目录使用);

全局使用:

```
sudo mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer
```

执行:

```
composer --version即可查看版本.
```

**3,在项目目录下,执行命令:**

```
 composer create-project --prefer-dist laravel/laravel blog  5.3.*
```

即可download下来laravel的blog项目.
再执行:

```
composer config repo.packagist composer https://packagist.phpcomposer.com
```

即可将国内镜像加速源添加进json配置文件中.
**4,Apache2配置laravel:**
开发时,可先在blog根目录下生成key:

```
php artisan key:generate
```

然后直接在blog下的public文件夹下启动命令:

```
php -S localhost:100
```

即可浏览器打开laravel项目.
生产环境参考下面第5条:
**5,Dockerfile中配置:**
在Dockerfile中安装好Composer后,在start.sh中启动laravel项目:

```
usermod -s /bin/bash www-data #www-data为Apache2的用户,composer要用非root用户启动.
git clone $GIT code #clone项目代码.
chmod 777 -R code/
cp env-example code/blog/.env 
#下面这条命令是从root用户切换到www-data用户执行cd和composer install命令,然后自动再切换回root用户,这样composer在install的时候就不会提示不能以root用户运行的错误了.
su -c "cd code/blog/ && composer install" www-data 
#生成key,这时是用root用户执行的,否则报错.
php artisan key:generate
php artisan up 
```

**6,配置数据库:**
laravel5.5的数据库配置文件有两个,.env和config文件夹下的database.php,需要事先配置好其中的数据库部分,然后在laravel根目录,执行php artisan make:auth,即可登录: http://localhost:90/index.php/register页面进行用户注册,显示登录成功即成功.