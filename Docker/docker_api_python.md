# docker的api之python调用

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

python为3.5版本，2.7版本升级为3.5后将默认python改为3.5，再pip install docker。

### 初始化方法：

```
import docker

client=docker.from_env() #初始化一个docker客户端实例
print(client.containers.run("alpine",["echo","hello"])) 
for contariner in client.containers.list():

    print container.id

    container.stop()

container=client.containers.get("***")

print(container.logs())
```

### 拉取镜像

```
image=client.images.pull("alpine")
#相当于sudo docker pull alpine

print image.id

#如果detach=True，会立即返回一个container对象

container=client.containers.run("alpine",["touch","/hello"],detach=True])

container.wait()

image=container.commit("hello")

print(image.id)
```