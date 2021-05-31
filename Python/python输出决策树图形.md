# python输出决策树图形

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

windows10：
1，先要pip安装pydotplus和graphviz：

```
pip install pydotplus
pip install graphviz
```

2，www.graphviz.org下载msi文件并安装。
3，系统环境变量path中增加两项：

```
C:\Program Files (x86)\Graphviz2.38\bin
C:\Program Files (x86)\Graphviz2.38
#确认graphviz是安装在上面路径当中。
```

4，python中使用方法：

```
from sklearn.externals.six import StringIO  
import pydotplus

#drt是DecisionTreeClassifier()，在之前要fit训练之后才能在这里输出图形。
dot_data = StringIO()  
tree.export_graphviz(drt, out_file=dot_data)   
graph = pydotplus.graph_from_dot_data(dot_data.getvalue())   
graph.write_png("out.png")  #当前文件夹生成out.png

#这三行代码可以生成pdf：
dot_data = tree.export_graphviz(drt, out_file=None) 
graph = graphviz.Source(dot_data) 
graph.render() 
```