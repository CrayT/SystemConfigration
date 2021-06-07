### 针对windows系统：
- 查看端口占用
``` 
netstat -ano | findstr 1112
```

- 查看占用端口的进程：
  ```
  tasklist | findstr 1112
  ```

- 关闭进程：
  ```
  taskkill /T /F /PID 1112
  ```
  > F：强制，T：包括子进程， PID：pid