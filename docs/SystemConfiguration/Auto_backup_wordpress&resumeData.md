# 自动备份wordpress网站数据&恢复数据

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

1，数据包含网站文件数据和Mysql数据库，在VPS创建备份目录:

```
/root/xt/mysqlBackup/
```

2，编写数据库备份脚本：

```
#!/bin/sh
#This is a backup shell script of my mysql of wordpress.
hostname='localhost'
user='root'
password='myPasswd'

database='databaseName'
backpath='Path'
date=$(date +"%Y-%m-%d")
mysqldump -h$hostname -u$user -p$password $database > $backpath/$date-$database.sql
```

3，网站源文件备份命令：

```
tar -zcvf wordPress_backup.tar.gz /var/www/html/wordpress
```

4，将网站备份和数据库备份合并到一个脚本：

```
#!/bin/sh
#This is a backup shell script of my mysql of wordpress.
hostname='localhost'
user='root'
password='myPasswd'

database='databaseName'
backpath='Path'
date=$(date +"%Y-%m-%d")
mysqldump -h$hostname -u$user -p$password $database > $backpath/$date-$database.sql
tar -zcvf $backpath/$date-wordPress_backup.tar.gz /var/www/html/wordpress
```

5，创建定时任务，定时执行备份脚本：

```
crontab -e #开启系统定时任务，接下来选择编辑模式，选择3，vim编辑
```

6，在任务脚本中输入以下，表示每天的零点执行备份脚本：

```
0 0 * * * /root/xt/mysqlBackup/mysql_backup.sh
```

7，查看定时任务：

```
crontab -l #查看定时任务
crontab -e #编辑定时任务
service cron status #查看状态
service cron restart #重启服务
tail -f /var/log/cron.log #查看日志
```

8，将定时任务加入开机启动项

```
vim /etc/rc.local
service cron start #最后一行exit之前加入该命令。
```

Tips，脚本需要获取执行权限：

```
sudo chmod u+x ./mysqlBackup.sh
```

9，恢复数据：

wordpress数据直接解压到 目标目录，mysql数据库文件恢复命令：

```
mysql -uroot -ppassword database_name < database.sql
```

10，wordpress安装时，添加的有该用户，所以需要手动将该用户添加进mysql：

```
create user wordpress;
GRANT ALL ON wordpress.* TO 'wordpressuser'@'localhost' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
```

11，数据库恢复完毕。

- 12wordpress 的首页地址存在mysql中的wp_options字段，等于siteurl和home的记录，如果修改了nginx的配置等，需要同步修改：

```
update wp_options set option_value='http://107.174.240.90:8181' where option_name in ('siteurl','home');
```

