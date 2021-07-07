# MAC终端shell命令简化

#### 于2020年1月2日2020年1月2日由[**crazyxt**](https://crazyxt.com/?author=1)发布

##### `linux`系统可通过`alias`设置命令的简称，设置方式为:

```shell
alias 新命令='原命令执行方式'
```

> 设置后，可通过`alias`查看，且在当前登录时可使用。但是这种方式的缺点是，当终端重启后，命令失效，网上的说法是修改`/etc/.bash_profile`文件，将`alias`命令添加进去，然后执行`source`命令，但是每次终端重启还是失效，需要重新执行`source`命令。

##### MAC终端我使用的是`zsh`，具体安装方式可通过官网下载，然后修改为zsh：`chsh -s /bin/zsh`. 然后将`~/etc/.bash_profile`中的修改添加进`zsh`的配置文件`~/.zshrc`中，这样每次重启终端，都会自动执行zshrc文件，命令也就永久生效了。