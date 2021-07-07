### 针对windows系统：
- 查看端口占用
``` 
netstat -ano | findstr 1112
```

- 开启端口
nc -lp 23 &
- 查看端口
netstat -an | grep Port

- 关闭端口
netstat -anp |grep 端口
kil pid

- 查看占用端口的进程：
  ```
  tasklist | findstr 1112
  ```

- 关闭进程：
  ```
  taskkill /T /F /PID 1112
  ```
  > F：强制，T：包括子进程， PID：pid

  - 查看当前磁盘总体占用
   ```
  df -h
   ```
  - 查看当前目录总大小
  ```
    du -sh
  ```
  - 查看当前目录每个文件夹的情况
  ```
    du --max-depth=1 -h
  ```

  - 查看当前目录每个文件大小
  ```
  du -h 
  ```