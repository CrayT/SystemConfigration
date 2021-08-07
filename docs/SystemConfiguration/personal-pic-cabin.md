### 搭建个人图床
### 用到工具：
- `Github`
- `PicGo`
### 步骤：
- 1，下载 [PicGo](https://github.com/Molunerfinn/PicGo),并安装。
- 2，新建`Github`仓库 `picCabin` 
- 3, 生成新 `key`: `头像` -> `setting` -> `Developer settings` ->` Personal access tokens` -> `Generate new token`, 设置`expiration` ，勾选 `repo`，`Generate token`，并复制下来生成的`token`；
- 4，打开`PicGo`，設置 `Github图床`，填上仓库信息：
![](https://raw.githubusercontent.com/CrayT/picCabin/master/%7BAC613237-AA1E-4F29-8E2E-97A0D872EEBB%7D_20210807152512.jpg)
- 5, 尝试将图片拖入窗口就可以了，默认会自动复制图片地址。图片会被提交至仓库根目录内。