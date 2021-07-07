```
docker run -p 9999:8888 -d jupyter/minimal-notebook
```

- 2,进入容器，拿到token：

  - ```
    jupyter notebook list
    ```

- 在登录界面，输入token，输入新密码，即可用密码登录
- 或者通过jupyter notebool --generate-config的配置方式也可以，手动可不用这个方法