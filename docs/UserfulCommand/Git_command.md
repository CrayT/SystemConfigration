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


- 修改本地commit信息

```shell
git commit --amend
```

- 合并commit，本地未push

```shell
git rebase -i HEAD~${合并数量} # 将后面的commit全部合并到第一个上，否则会报错，也就是从第二个开始将pick改为s
```

- 撤回commit 

```shell
# 撤回上一个提交到本地，--soft表示回退到某个版本
git reset --soft HEAD^ 
# 或者:
git reset --soft HEAD~1
```

- 撤销工作区中所有未提交的修改内容，将暂存区与工作区都回到上一次版本，并删除之前的所有信息提交

```shell
# 撤销当前工作区所有修改
git reset --hard HEAD

# 撤销到上一个版本
git reset --hard HEAD^
#或者 
git reset --hard HEAD~1
```

- cherry-pick其他的merge
- 直接pick会报错
```shell
git cherry-pick -m 1 ${commitId}
# -m表示采用哪个分支的变动，1表示原始merge到目标分支的变动
```

- 合并远程分支的某个文件

```shell
git checkout origin/branch filePath
```

- 检出某个commit的某个文件

```shell
git checkout commitId -- filePath
```

- 查看远程文件

```shell
git show origin/branchName:filePath

# 将远端文件导出到本地:
git show origin/branchName:filePath -> demo.ts
```

- rebase 步骤

```shell
# 1 切到目标分支
git checkout branch
git reset --hard origin/branch # 如果不是分支的话不必reset
git pull
# 2 切到目标提交
git checkout commit

git rebase branch

# 3 有冲突解决完冲突后：
git rebase --continue

# 4 push
git push origin HEAD:refs/for/branch
```

- 设定commit规范

```shell
# 设定规范
cat <<EOF > some_template.txt
[key1]:
[key2]:
EOF

git config commit.template ~/.some_template.txt

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

