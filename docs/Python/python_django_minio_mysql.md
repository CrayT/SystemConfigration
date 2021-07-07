# python django minio mysql部署的记录

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

1，因为数据量较大，不用django自带的sqlite，使用mysql：

1）修改settings.py:

DATABASES = {
  ‘default’: {
    ‘ENGINE’: ‘django.db.backends.mysql’,
    ‘NAME’: ‘mysql’, 
    ‘USER’: ‘root’,
    ‘PASSWORD’: ‘密码’, 
    ‘HOST’: ‘127.0.0.1’,
    ‘PORT’: ‘3306’,
  }
}

2)安装mysql：sudo apt-get install mysql-server mysql-client （过程中会提示输入密码，root）

​            sudo apt-get install libmysqld-dev

安装MySQL for Python：

wget https://pypi.python.org/packages/source/M/MySQL-python/MySQL-python-1.2.5.zip

解压：unzip MySQL-python-1.2.5.zip，

cd MySQL-python-1.2.5

安装：sudo python setup.py install

3） 检查是否安装成功：sudo netstat -tap | grep mysql

显示：tcp     0    0 localhost:mysql     *:*           LISTEN    28076/mysqld   证明已安装成功

2，进入mysql：mysql -u root -p然后提示输入密码root即可，退出命令为exit

1）创建数据库：create database mydata charset=utf8;  创建mydata。

2）查看所有数据库：show databases;

3）在django中测试：python manage.py check，如果没有报错，证明已经配置OK。

 4）迁移一下：

python manage.py makemigrations  disk  （disk是在setting.py中的INSTALLEDAPP中添加的：

INSTALLED_APPS = [
  ‘django.contrib.admin’,
  ‘django.contrib.auth’,
  ‘django.contrib.contenttypes’,
  ‘django.contrib.sessions’,
  ‘django.contrib.messages’,
  ‘django.contrib.staticfiles’,
  ‘disk’,
  \#’boootstrap’,
]

然后：python manage.py migrate即可，可到数据库中use mydata，然后show tables查看。

5）use mydata，使用这个数据库，不要加分号

3，安装minio，docker下安装

1）sudo docker  pull minio/minio

2）sudo docker run -p 9000:9000 minio/minio server /data

显示以下即OK：

Created minio configuration file successfully at /root/.minio
Drive Capacity: 591 GiB Free, 631 GiB Total


Endpoint:  http://172.17.0.2:9000  http://127.0.0.1:9000
AccessKey: CUE04GFVQOXSVMDDPRZR 
SecretKey: hb3LELWQcdyCxD3ZVLwRyTM1nnEBjrMbtATNrNoU 


Browser Access:
  http://172.17.0.2:9000  http://127.0.0.1:9000



3）打开http://172.17.0.2:9000输入AccessKey和SecretKey登录即可。

PS ：因为是在docker中运行，所以，ctrl+C后只要sudo docker start (minio的id)即可再次启动，AccessKey和SecretKey貌似只在创建时显示一次，创建之后无法找出，所以需要记下ｋｅｙ。

４、minio利用s3fs挂载到本地：

１）参照https://github.com/s3fs-fuse/s3fs-fuse安装s3fs.

2) 输入命令：s3fs buckettest /home/xxxx/Downloads/s3test -o passwd_file=/home/xxxx/Downloads/s3passwd -o url=http://172.17.0.2:9000/ -o use_cache=/home/xxxx/Downloads/s3cache -o use_path_request_style

【buckettest为minio中的bucket名字，后面跟需挂载的本地目录，每个选项之前跟-o，passwd_file为登录minio的两个key,用”:”分割，s3passwd需要chmod 600 s3passwd一下，url为minio的地址，后面的’/’不要忘记，use_cache为缓存目录。use_path_request_style，命令解释为:use legacy API calling style,反正不加这个时本地目录无法访问minio。】

如果没有报错，在s3test目录已经可以访问minio的文件了，两者类似同步效果，增加删除都会同步。