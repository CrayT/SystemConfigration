### git操作：

- 查看当前分支：

```shell
git branch
```

- 查看所有分支：

```shell
git branch -a
```

- 切换分支：

```shell
git checkout branchName
```

- 查看git仓库地址：

```shell
git remote -v
```

- 查看文件修改

```shell
git diff file
```

- 查看变动

```shell
git status
```

- 查看用户名和邮箱地址

````shell
git config user.name
git config user.email
git config --global user.name "username" #修改
````

- 查看当前仓库配置信息

```shell
git config --local  --list
```

- 创建新标签：

```shell
git tag -a 标签名 -m "标签说明" //给最新commit打标签
```

- 给以往commit打标签：

```shell
git tag -a "标签名" commitID 
git push origin --tags //推送本地所有标签
```

- 推送标签：

```shell
git push origin "标签名"
```

- 跳转到指定标签：

```shell
git checkout "标签名"
```

- 删除指定标签：

```shell
git tag -d "标签名"
git push origin -d tag "标签名"
```

