- 开启端口
nc -lp 23 &
- 查看端口
netstat -an | grep Port

- 关闭端口
netstat -anp |grep 端口
kil pid