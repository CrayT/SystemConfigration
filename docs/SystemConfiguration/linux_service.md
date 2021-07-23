1, 编写服务
- 用户目录 `/usr/lib/systemd/system/`
- 创建 `***.service`

2, systemctl daemon-reload

3, 启用服务，创建一个指向配置文件`/lib/systemd/system/xxx.service`的符号链接，该操作会让服务开机启动

- systemctl enable simple-server
  
4，启动服务
- systemctl start ***.service

### 示例
```shell
[Unit]
Description=description.

[Service]
Type=forking
#启动命令中的命令、参数都必须是绝对路径
ExecStart=启动命令 
User=root
Restart=always

[Install]
WantedBy=multi-user.target
```