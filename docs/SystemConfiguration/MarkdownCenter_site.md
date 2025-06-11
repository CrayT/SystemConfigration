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

- 将所有`md`文件移至`docs`文件夹内，`docs`内有`index.md`和`about.md`, 分别是首页和关于的内容
- 配置根目录的`mkdocs.yml`，指定`sitename`和展示目录、主题等
- 配置Github的自动部署
    - 根目录添加`.github/workflows/workflow.yml`，此目录文件`github`会自动识别为自动部署配置
    > 需求：编辑文件后，推送到`github`，前端能浏览到更新内容，就需要推送后能自动触发`mkdocs的打包机制，然后将打包文件部署到远程服务器，然后重新加载nginx；
    - 配置`workflow`
    > 1, 不同与gitlab的`CICD`流程，github需要指定`action`，配置一系列`job`与`steps`，各个`step`内可借助github的已发布的`action`脚本完成所需动作，如部署至服务器等：
    > 2, github如果没有特殊需求，可以使用官方机器跑脚本，速度也很快.

```yml
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

    > 其中，登录远程服务器私钥等信息可存在仓库的`setting-> secrets` 中
    - 尝试推送至仓库，即可自动触发`workflow`，部署至远程服务器。

#### 如果只借助github的个人page，则更简单：
    1，在master分支创建md文档；
    2，在仓库的settings -> Pages -> Build and deployment -> Branch中选择gh-pages, 文件夹选择/root，然后保存；
    3，在.github/workflow下创建ci.yml文件，写入一下内容, 不用修改，直接copy：

```yml
name: ci 
on:
  push:
    branches:
      - master 
      - main
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure Git Credentials
        run: |
          git config user.name github-actions[bot]
          git config user.email 41898282+github-actions[bot]@users.noreply.github.com
      - uses: actions/setup-python@v5
        with:
          python-version: 3.x
      - run: echo "cache_id=$(date --utc '+%V')" >> $GITHUB_ENV 
      - uses: actions/cache@v4
        with:
          key: mkdocs-material-${{ env.cache_id }}
          path: .cache 
          restore-keys: |
            mkdocs-material-
      - run: pip install mkdocs-material 
      - run: mkdocs gh-deploy --force
```

然后推送后会自动触发action部署致gh-pages分支，过几分钟即可在个人主页看到效果；