# 进入docker容器的方式

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

1，attach方式：sudo docker attach c076737d8aa8(容器ID)，缺点：多个进入该容器的窗口会同步显示。

2，ssh方式：不建议使用

3，nsenter：太麻烦

4，exec：执行时确定容器已经start，然后：docker exec -i -t test1 /bin/bash（test1是已经启动的容器名，后面跟/bin/bash启动一个终端）

分类： [学习](https://crazyxt.com/?cat=16)