## 20210110

### 1, 拉镜像

​	```docker pull minio/minio```

### 2, 运行容器

```docker run -p 9000:9000 -e "MINIO_ACCESS_KEY=xutao" -e "MINIO_SECRET_KEY=wsXT1225" -v /root/xt/minioData:/data minio/minio server /data```

	> 指定key和ID，将minio的默认data目录挂载到建立的minioData目录，如果提示权限问题，需要修改权限

### 3, nginx 配置

- 本地挂载的文件，可通过`nginx`的文件服务而访问，但是通过`axios`直接访问会有跨域问题，`nginx`修改跨域配置：

  - nginx的文件服务配置：

  ```
  server {
  	listen 80 default_server;
  	listen [::]:80 default_server;
  	root /root/xt/;
  	location / {
  		add_header  Access-Control-Allow-Origin *;
  		add_header  Access-Control-Allow-Methods GET,POST;
  		add_header  Access-Control-Allow-Headers DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization;
  		autoindex on;
  		autoindex_exact_size on;
  		autoindex_localtime on;
  		try_files $uri $uri/ =404;
  		root /root/xt/;
  		}
  
  }
  ```

  ​		> 主要是`location`中的三个`add_header`配置

- 通过前端如`vue`即可操作`minio`中的文件：

  ```
  //创建minio对象
  this.minio = new Minio.Client({
              endPoint: Config.default.minio.EndPoint,
              port: Config.default.minio.Port,
              useSSL: false,
              accessKey: Config.default.minio.AccessKey,
              secretKey: Config.default.minio.AccessSecret
          });
  ```

  ```
  	/**
       * 上传内容至minio
       * @param content：字符流
       */
      upLoad(content){
          let client = this.minio;
          let buffer = content; //字符流
          return new Promise((resolve, reject) => {
              client.putObject(bucket, 文件名, buffer, function(err, etag) {
                  console.log(err, etag);
                  if(etag) resolve();
                  else reject();
              })
          })
      }
  ```

  

- 查看endpoint等信息：

  - ``` 
    docker logs 容器ID
    ```

  - 