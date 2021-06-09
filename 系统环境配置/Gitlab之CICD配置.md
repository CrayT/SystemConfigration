GitLab-CICD

### 前提：必须是仓库管理员才可以配置！

- 首先配置一个`Runner`：进入仓库，从Settings`中进入`CI/CD`, 找到`Runners`打开，选择`runner`方式，比如手动自己设置的话就选`specific runner`。按照教程，在一台联网的机器上安装：

  - 例如选择一台VPS，以`ubuntu`系统为例，以`Docker`方式运行

  - `pull gitlabrunner`：

    - ``` docker pull gitlab/gitlab-runner:latest ```

  - 起一个`docker`实例：

    - ```  docker run -d --name gitlab-runner-lineDrawer --restart always gitlab/gitlab-runner``` register
    - 至于volume挂载，根据需要要不要挂载到vps或其他地方。

  - 注册`gitlabrunner`：

    - 两种方式，直接通过gitlab-runner命令：
      - ``` gitlab-runner register ```
    - 第二种是在run一个实例的时候直接创建，应该是简化等效为上面一条命令；
    - 根据接下来的提示输入在CI/CD页提示的`URL`和`token`，再输入其他相关信息即可，一个runner即成功创建

  - 配置文件：

    - 在仓库根目录创建 `.gitlab-ci.yml` 文件，格式要求较高，可通过`CI-lint`检测，主要是指定`stage`以及各`stage`的`job`，例如：

      - ```yml
        image: "node:latest"
        
        stages:
          - install
          - build
        
        cache:
          paths:
            - node_modules
        
        install:
          stage: install
          script:
            #- npm config set registry https://registry.npm.taobao.org
            - npm install --force
          only:
            - master
          rules: #rules与only不能共存，rule下的if可设置条件，&&或||，正则匹配等
              - if: '$CI_MERGE_REQUEST_TARGET_BRANCH_NAME =~ /^master/ || $CI_MERGE_REQUEST_TARGET_BRANCH_NAME =~ /^release/'
                when: manual #when可设置何时触发，on_success自动触发，manual是手动触发，需要在gitlab页面手动点击执行，点击之前不可执行merge 
        build:
          stage: build
          script:
            - - echo "开始打包"
            - npm run build
            - echo "开始执行build.sh"
            - chmod a+x ./build.sh
            - ./build.sh
          only:
            - master
        after_script:
          - echo "Stage：${CI_JOB_STAGE}, Job：${CI_JOB_NAME}, Branch:${CI_COMMIT_BRANCH},CommitMessage:${CI_COMMIT_MESSAGE}, complete！,"
        ```

        - 在不同的stage执行job时也可调用外部脚本，比如本例中的`shell`脚本：

          - ```shell
            #!/bin/sh
            wget http://gosspublic.alicdn.com/ossutil/1.6.18/ossutil64
            chmod 755 ossutil64
            echo "endPoint:"${endPoint}
            ./ossutil64 config -e ${endPoint} -i ${accessKeyID} -k ${accessKeySecret} -L CH --loglevel debug -c ~/.ossutilconfig
            ./ossutil64 -c ~/.ossutilconfig cp -r ./dist/ oss://vrhouse-web/31test-403/drawLines/v2/ --meta x-oss-object-acl:public-read-write -f
            ```

        - `shell`中的变量可以在CI/CD页面的`variable`中指定，这样在运行脚本的时候是可以获取到设置的变量的。

      - 把配置文件和脚本推送的仓库，如果有符合规则的`commit`或`merge`推送到仓库，则会自动运行CI/CD

- 通过设定规则，可满足达到规则的提交才触发CICD,比如merge到master的提交才有效：

- ```yaml
  install_job:
    stage: install
    script:
      - npm install --force
    rules:
      - if: '$CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "master"'   //通过设定rules
        when: always
        allow_failure: true //即使该job失败，也不影响其他job
  ```

- 如果通过`gitlab-runner stop`停止了服务，需要重启：

  - ```
    gitlab-runner install --user=gitlab-runner
    gitlab-runner start
    ```

  - 然后`gitlab-runner status`即可以看到服务已经起来了。

- `gitlab-runner`的配置文件为`config.toml`，地址为：`/etc/gitlab-runner/config.toml`

  - 里面定义了注册的所有`runner`信息

- 查看所有runner：
  - ```
    gitlab-runner list
    ```

- 

## 自动执行npm install时进程被kill：

- 如果配置没问题，进程却被kill，有可能是服务器内存不足导致，可通过top命令和iostat -5查看执行pipeline时的状态，cpu和内存达到100%即可确定是资源不足被kill了

- 通过创建swap分区来解决：

  - swapon --show和free -h命令可查看当前swap交换

  - ```
    //创建1GB的交换区：
    sudo dd if=/dev/zero of=/swapfile bs=1024 count=1048576
    
    //设置root用户读写权限
    chmod 600 /swapfile
    
    //设置linux交换区
    mkswap /swapfile
    
    //启用交换
    swapon /swapfile
    
    //追加/etc/fstab
    /swapfile swap swap defaults 0 0 
    
    //验证状态
    free -h
     swapon --show
    ```

  - 删除交换文件

    ```
    swapoff -v /swapfile
    
    删除/etc/fstab中加的条目
    
    rm /swapfile
    ```

    