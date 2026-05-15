

#### 英伟达显卡设置
```shell
    sudo nvidia-settings
```

#### 安装驱动和工具
```shell
1, apt install mesa-utils
2, apt install nvidia-prime
3, glxinfo | grep "OpenGL renderer"
```

#### 查看当前显卡信息
```shell
    nvidia-smi
```