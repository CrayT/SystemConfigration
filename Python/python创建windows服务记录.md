# python创建windows服务记录

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

以下只是自己在用python创建widows服务的历程中，记录下所遇到的所有坑，以及对应的解决办法，不一定具有代表性，仅供参考：

- **1、python代码：**

```
#coding:utf8
import win32serviceutil   
import win32service   
import win32event  
import winerror
import servicemanage
import os,time,sys   
from subprocess import Popen, PIPE  
import json  
import signal  
    """
    #1.安装服务
    python WinPollManager.py install
    #2.让服务自动启动
    python WinPollManager.py --startup auto install
    #3.启动服务
    python WinPollManager.py start
     #4.重启服务
    python WinPollManager.py restart
    #5.停止服务
    python WinPollManager.py stop
    #6.删除/卸载服务
    python WinPollManager.py remove
    """
class Anaservice(win32serviceutil.ServiceFramework):   
    _svc_name_ = "ANAservice"  #服务名
    _svc_display_name_ = "ANAservice"   #在windows中显示的名

   _svc_description_ = "Ana service is writen by python"  #描述

    def __init__(self, args):   
        win32serviceutil.ServiceFramework.__init__(self, args)   
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)  
        self.isAlive=True 


    def SvcStop(self):           
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)   
        win32event.SetEvent(self.hWaitStop)   
        self.isAlive=False


    def SvcDoRun(self):  
        while self.isAlive:
            #do something here

if __name__=='__main__':  
    if len(sys.argv) == 1:
        try:
            evtsrc_dll = os.path.abspath(servicemanager.__file__)
            servicemanager.PrepareToHostSingle(Anaservice)
            servicemanager.Initialize('Anaservice', evtsrc_dll)
            servicemanager.StartServiceCtrlDispatcher()
        except win32service.error, details:
            if details[0] == winerror.ERROR_FAILED_SERVICE_CONTROLLER_CONNECT:
                win32serviceutil.usage()
    else:
        win32serviceutil.HandleCommandLine(Anaservice)
```

- **2，所用系统为win10，软件为VScode，安装服务需要系统权限，以管理员身份打开VScode，在code终端内操作命令：**
- 1.安装服务：

```
    python test.py install
```

- 2.让服务自动启动 :`python test.py --startup auto install`
- 3.启动服务

```
    python test.py start
```

即可在系统服务列表中看到名为Anaservice的服务进程。

- 4.重启服务

```
    python test.py restart
```

- 5.停止服务

```
    python test.py stop
```

- 6.删除/卸载服务

```
    python test.py remove

   #或者以管理员权限打开终端，输入：sc delete 服务名，也可以删除服务。
```

- **3,start服务时，提示：服务没有及时响应启动或控制请求，可以参考以下办法：**
- 1）确认代码没有问题，数据库的连接信息都没有问题。
- 2）查看服务属性，看到可执行文件的地址为：“C:\Python27\lib\site-packages\win32\PythonService.exe”到相应文件夹双击这个exe文件，若提示：由于找不到pywintypes27.dll，或pywintypes35.dll，则到上一级目录的pypiwin32_system32文件夹中将该dll文件复制到这个exe文件夹中即可。
- 3）若exe已经可以双击不会报错，还是报同样错误，确认打开的终端是不是用管理员打开的（权限）。
- 4）若管理员权限打开也不行，手动在服务的属性中添加登陆用户为Administrator。
  【ps：删除服务的方法为：1，以管理员身份运行cmd，然后sc delete 服务名，即可删除服务。或者在python中运行 stop再运行remove指令，命令删除服务时，注意将服务窗口关闭，不然会有‘服务已标记删除’的问题】
- 5 如果连接有数据库，提示相关服务无法启动，到事件查看器里看看是不是数据库连接失败，用户名 密码错误？
- 6 window中写入文件路径时，注意转义字符问题，’‘是转义字符，写入数据库时，’‘会消失，直接按字符串写入会出错，最好按linux格式’/’写入。
- 7 提示：

```

```

如果遇到这个问题，确认下python系统环境变量设置是否正确。这个问题我碰到过一次，发现是环境变量的问题，修改后就没问题了。