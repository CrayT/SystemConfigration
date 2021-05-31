# 关于CDN和域名备案

#### 于2019年12月20日2019年12月20日由[**crazyxt**](https://crazyxt.com/?author=1)发布

##### 这两天意识到国内访问网站的时候速度很慢，因为`VPS`在美国，所以想到使用某些免费的`CDN`(内容分发)服务，但是大多数的免费提供商只提供`http`访问，不提供`https`。所以使用了`cloudflare`和`又拍云`：

- 一开始用了`cloudflare`，但是使用之后发现它的服务器是在美国，设置好之后，ping的速度有时快(150ms)，有时慢(200ms左右)，但是显示国内的确有它的CDN服务器：
  ![img](https://crazyxt.com/wp-content/uploads/2019/12/7c06dc334e71a34e4e33ddd017f5aee1.png)
  ![img](https://crazyxt.com/wp-content/uploads/2019/12/8c65303bf68d8e751a52914aec158208.png)
- 注册了`又拍云`，分配了`CNAME`，但是直接根据`CNAME`访问的时候提示域名未备案。。。查询之后发现国内想要做CDN，需要域名备案才可以，但是问题是国内的VPS可以备案，国外的域名无法备案了，想要备案，只有迁到国内？重新买VPS和域名？？？一通操作下来，放弃又拍云的CDN吧、、、
  ![img](https://crazyxt.com/wp-content/uploads/2019/12/a78dda867e92102b3f9a1c2e5f6d2b63.png)

分类： [学习](https://crazyxt.com/?cat=16)