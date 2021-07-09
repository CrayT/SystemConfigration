## 文档中心搭建
### 目标
- 前端展示所有md文档
- 目录自定义
- 能够同git同步，自动发布
### 工具
- mkdocs
- GitHub
### 步骤
- pip安装mkdocs模块
- 初始化mkdocs项目
```
mkdocs new projectName
```
- 将所有md文件移至docs文件夹内，docs内有index.md和about.md, 分别是首页和关于的内容
- 配置根目录的mkdocs.yml，指定sitename和展示目录、主题等
- 配置Github的自动部署
    - 根目录添加.github/workflows/workflow.yml，此目录文件github会自动识别为自动部署配置
    > 需求：编辑文件后，推送到github，前端能浏览到更新内容，就需要推送后能自动触发mkdocs的打包机制，然后将打包文件部署到远程服务器，然后重新加载nginx；
    - 配置workflow
    > 1, 不同与gitlab的CICD流程，github需要指定action，配置一系列job与steps，各个step内可借助github的已发布的action脚本完成所需动作，如部署至服务器等：
    > 2, github如果没有特殊需求，可以使用官方机器跑脚本，速度也很快.
    ```
        name: build
        on: push #push代码触发workflow

        jobs:
        buildJob:
            runs-on: ubuntu-latest #官方系统，自己加的runner是self-hosted.
            steps:
                - name: Checkout
                  uses: actions/checkout@v2 #该action拉取代码
                  with:
                      persist-credentials: false

                - name: Install
                  run:
                    pip install -r requirement.txt #pip安装mkdocs及依赖包

                - name: Build
                    run: 
                    mkdocs build #打包命令
 
                - name: Deploy to Server 
                  uses: wlixcc/SFTP-Deploy-Action@v1.0 #该action可将文件部署至服务器，需要指定远程登录秘钥等
                  with:
                    ssh_private_key: ${{ secrets.VPSSSHKEY }} #远程服务器私钥，即id_rsa内容，需要完全不做处理的拷贝，否则会出现连接失败(失败了N次才搞定。。。)
                    local_path: ./site/*
                    server: ${{ secrets.VPSHOST }}
                    username: ${{ secrets.USERNAME }}
                    remote_path: ${{ secrets.VPSPATH }} #远程部署路径

                - name: Reload
                    uses: appleboy/ssh-action@master #登录远程服务器action
                    with:
                    host: ${{ secrets.VPSHOST }}
                    username: ${{ secrets.USERNAME}}
                    password: ${{secrets.VPSPW }}
                    port: ${{ secrets.VPSPORT }}
                    script: |
                        nginx -s reload #登录后执行命令
    ```
    > 其中，登录远程服务器私钥等信息可存在仓库的setting-> secrets 中
    - 尝试推送至仓库，即可自动触发workflow，部署至远程服务器。