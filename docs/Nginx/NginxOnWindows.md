### windows下配置nginx比较简单，但也比较烦人
- 下载nginx安装包解压到本地，会有一个nginx.exe启动程序，配置文件在conf文件夹内，配置同linux；
- 双击nginx.exe即可启动nginx，窗口一闪而过，通过logs文件夹内的errorlog查看是否启动成功。
- 注意：
> windows下每启动一次nginx，都会在后台启动两个进程，在不杀掉旧进程的前提下，修改配置文件后再次启动nginx.exe会同时存在多个相同进程导致配置未生效，需要杀掉旧的nginx进程再启动. 貌似window无法像linux那样热更新，nginx -s reload提示无该命令。。