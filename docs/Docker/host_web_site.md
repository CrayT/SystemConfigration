### 容器托管静态网站

将静态网站部署至容器内，通过端口映射，即可外部访问.

#### 以react为例

1, 设置PUBLIC_URL
```
PUBLIC_URL=/path1/path2/
REACT_APP_BASEURL=/path1/path2/
```

2, 创建Dockerfile

```Dockerfile
FROM node:16.20.2-alpine3.18 as nn

WORKDIR /build 

# 将react编译产物build目录的内容copy至/build/path1/path2/
COPY build /build/path1/path2/

# 安装serve包，将编译的index.html复制一份到/build/下，
RUN npm install -g serve && mv path1/path2/index.html .

# 在build目录下启动服务，访问http://url/path1/path2时会定向到该网站
CMD [\"sh\", \"-c\", \"serve -s .\"]
```

3，编译docker
```
docker build -t test:tag
```

4, 创建容器
```bash
docker run -d -p 8080:3000 test:tag
```

5, 访问localhost:8080/path1/path2/即可访问该网站