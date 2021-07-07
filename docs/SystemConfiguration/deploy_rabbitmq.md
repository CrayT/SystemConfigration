# rabbitmq部署记录

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

1，系统win10，64位，先到erlang官网下载安装包安装，再到rabbitmq官网下载安装包安装。

2，cd到rabbitmq安装目录：C:\Program Files\RabbitMQ Server\rabbitmq_server-3.7.2\sbin，里面有bat文件，输入rabbitmqctl status，即可查看状态，不过有可能提示： TCP connection succeeded but Erlang distribution failed，好像是因为erlang的cookies文件不一致导致，解决办法：将C:\WINDOWS\System32\config\systemprofile\.erlang.cookie复制到C:\Users\username\.erlang.cookie下即可，再次输入rabbitmqctl status命令即可看到没有错误。