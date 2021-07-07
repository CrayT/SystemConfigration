# Python 打包执行文件

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

1、py2app

1）查找命令py2app:  sudo find / -name “py2applet” -type f,找到该命令的目录2）“目录”命令 –make-setup python文件名.py，生成setup.py文件3）rm -rf build dist4)python setup.py py2app

2、pyinstaller

pyinstaller -F -w python文件名.py 

\#-F单独一个执行文件，-w无终端，有窗口在win10上打包图形界面时，虽然可以打包出exe，但是运行时提示Fatal error to execute ***，将python2.7升到3.5，不行，降回2.7，还是打不开，将打包参数中的-w去掉，可以打包出命令端的exe，但是打开时一闪而过，用手机连拍功能捕捉到了一闪而过的界面，是Import error, C extension,具体这样：

![img](https://img-blog.csdn.net/20180110210352398?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvQ3JhenlUVFQ=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![img](https://crazyxt.com/wp-content/uploads/2019/12/image.gif)

是说pandas包中的什么东西不对，找到对应的包，把那个try-except注释掉，然后再打包，又出现一串 DateTime错误，最后是no module named timedeltas,找了半天找不到解决办法，突然想到是不是pyinstaller版本低不支持？升级pyinstaller，用命令:

pip install –upgrade pyinstaller,

虽然pyinstaller版本没有升级，但是它的setuptools却升级了，然后打包生成exe，成功运行！！

三天时间，才终于在windows上成功打包运行图形界面。。。