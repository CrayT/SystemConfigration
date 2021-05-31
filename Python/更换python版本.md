# 更换python版本

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

# 前提：电脑已经安装2.7和3.5版本

### 1，MAC：

- **终端输入：**

```
sudo vi ~/.bashrc
```

- **编辑输入：**

```
alias python2='/Library/Frameworks/Python.framework/Versions/2.7/bin/python2.7'
alias python3='/Library/Frameworks/Python.framework/Versions/3.5/bin/python3'
```

但这样做的效果是，每次需要输入python2才能调用python2的环境，3同样。
为了达到输入python即可使用python3，修改如下：

```
python='/Library/Frameworks/Python.framework/Versions/3.5/bin/python3'
```

这样输入python调用的即使python3.5环境，需要切换回2.7时同样方法修改。
PS:不知道python路径的，可以通过命令：where python3查询。

### 2，ubuntu：

终端输入：

```
 update-alternatives --install /usr/bin/python python /usr/bin/python3.5 1
  update-alternatives --install /usr/bin/python python /usr/bin/python2 2
 #将3.5设为1，2.7为2
 update-alternatives --list python #查看python版本list
 update-alternatives --config python #设置默认选项：
 
 #显示下面的选项，根据需要，输入1则默认设为3.5，输入2，则默认设为2.7
  Selection    Path                Priority   Status
------------------------------------------------------------
* 0            /usr/bin/python3.5   1         auto mode
  1            /usr/bin/python2     1         manual mode
  2            /usr/bin/python3.5   1         manual mode
```

### 3，批量更新pip包：

```
import pip
from subprocess import call
 
for dist in pip.get_installed_distributions():
    call("pip install --upgrade " + dist.project_name, shell=True)
```

### 4，更换python版本后，发现pip不可用，没有该命令，重新安装：

```
sudo apt install python3-pip #安装
sudo pip3 install --upgrade pip #更新
```