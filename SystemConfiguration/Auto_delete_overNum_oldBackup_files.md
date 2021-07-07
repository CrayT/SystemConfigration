# 自动删除超出数量的旧备份文件

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

1，因为数据库文件自动每天备份，连日下来，必定占用大量空间，所以想到当数量超出一定数目后，自动删除旧文件，新建脚本文件:`delte_old_backup_file.sh`

```
#!/bin/sh
#This is a shell script to delete the old backup files.
path='/root/xt/mysqlBackup/'
cd $path || exit
num=`ls -l | grep '^-' | wc -l` #列举出当前目录文件数量
if [ $num -gt 8 ] #超过8个
then
 num=`expr $num - 8`
 clean=`ls -tr | head -$num | xargs` #获取文件
 st="delete file ${clean}" #记录写入日志的字符串
 echo $st >> /root/xt/log/wordpressDeleteLog.log #写入日志。
 ls -tr | head -$num | xargs -i -n1 rm -rf {}  #删除命令
fi
```

2，将该文件加入定时任务后：

```
0 0 * * * /root/xt/delte_old_backup_file.sh  #每天凌晨执行删除任务
5 0 * * * /root/xt/wordpress_mysql_site_back.sh  #每天凌晨5点执行备份
```

3，重启服务：

```
service cron restart
```

4，增加脚本执行权限：

```
chmod u+x ./delte_old_backup_file.sh
```