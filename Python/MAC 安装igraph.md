# MAC 安装igraph

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

MAC python安装igraph:

- **要求：python版本>2.6**
- **依赖：**
- **cairo>1.10.0**
- **pixman**
- **xcode command line tool**
- **py2cairo**
- **opencv**

**过程：**

1 **安装cairo时无法安装，提示cann’t find C compiler.**
2 **安装cairocffi替代cairo，命令：brew install cairocffi。**
3 **安装Xcode command line tool，但是最后还是安装了Xcode才没报错。**
4 **安装pixman。**
5 **安装opencv，否则无法出图，命令：pip install opencv-python。**
**编写代码成功出图：**

![这里写图片描述](https://imgconvert.csdnimg.cn/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTgwMjA0MDkzMzMxOTkz?x-oss-process=image/format,png)