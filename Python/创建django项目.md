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