# PCA

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

```
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from sklearn.decomposition import PCA
estimator=PCA(n_components=4) #将高维压缩
data=pd.read_csv('/Users/xutao/Desktop/2.csv',header=None)
meanVals=np.mean(data,axis=0)
meanRemove=meanVals-data #去中心化
print "\nZero-centered:"
print meanRemove #去中心化矩阵
covMat=np.cov(meanRemove,rowvar=0)
print "\nCovariance Matrix:"
print covMat #协方差矩阵
eigVals,eigVects=np.linalg.eig(np.mat(covMat)) #特征值，特征向量
print "\neigenvalue :"
print eigVals
print "\neigenvector :"
print eigVects
eigValInd=np.argsort(-eigVals) #加负号表示降序，否则升序
print '\neigenvalue after sorted'
print eigValInd #输出降序后的下标
redEigVects=eigVects[:,eigValInd] #按照降序后的特征值对应的特征向量
print "\neigenvector"
print redEigVects
print "\nfinalData:"
print np.dot(meanRemove,redEigVects) #去中心化后的矩阵和特征向量相乘，作为最终的转换后的样本
```