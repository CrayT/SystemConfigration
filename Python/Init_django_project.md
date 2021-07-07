### 创建django项目步骤：

- 1，创建项目：
    ```
    django-admin startproject django_demo
    ```
- 2,创建数据库
  > mysql中创建数据库(用不到数据库可忽略该步骤)

- 3，settings.py中定义database信息，突然models.py中定义数据表信息(用不到数据库可忽略该步骤)
- 
- 4，进入目录，执行migration
    ```
    python manage.py migrate
    ```
- 5，启动server：
    ```
    python manage.py runserver 0.0.0.0:8000（默认8000端口）
    ```

### 问题点
- 如果runserver时遇到api_view相关问题，可以先把djangorestframework全部uninstall然后再安装，问题可能是 版本问题导致。


### 负载均衡：
> 如果需要用`nginx`配置负载均衡，需要在`setting.py`文件中指定`ALLOWED_HOSTS`，将nginx配置中的`upstream`的server名称添加进来，否则请求时会提示`Invalid HTTP_HOST header: 'myserver'. You may need to add 'myserver' to ALLOWED_HOSTS.`
    ```
    ALLOWED_HOSTS = ["myserver"]
    ```