# Docker 集群管理工具swarm的搭建

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

```
1、三台虚拟机(ubuntu)：192.168.110.126(作为管理节点)、192.168.110.127、192.168.110.128，

2、三台虚拟机分别安装docker：

sudo apt-get update

sudo apt-get install -y docker.io

sudo ln -sf /usr/bin/docker.io /usr/local/bin/docker

3、节点Docker配置，三个节点机均要配置：

vim /etc/default/docker

在最后添加：

DOCKER_OPTS="-H 0.0.0.0:2375 -H unix:///var/run/docker.sock"

4、各节点安装swarm：

sudo docker pull swarm

5、重启服务：

sudo service docker restart

6、生成集群token：

docker run --rm swarm create

*token* 记住这串字符！

7、添加节点到集群，分别在节点上运行：

sudo docker run -d swarm join --addr=本机节点IP:2375 token://*token*



8、查看集群节点：



docker run --rm swarm list token://*token*

9、开启管理节点开启管理：

docker run -d -p 2378:2375 swarm manage token:/*token*   注：2376也可以为其他端口，只要不和2375一样，且未被占用，否则会报错。

10、查看信息：

sudo docker -H 主节点IP:2378 info

显示以下：

Containers: 2
 Running: 2
 Paused: 0
 Stopped: 0
Images: 4
Server Version: swarm/1.2.8
Role: primary
Strategy: spread
Filters: health, port, containerslots, dependency, affinity, constraint, whitelist
Nodes: 2

....... 

11、设置主节点：

 sudo docker swarm init --advertise-addr 192.168.110.126，将126设置为管理节点





【或者】：

1、在主节点运行命令：



sudo docker swarm init --advertise-addr 192.168.110.126(主节点iP)

提示一下信息：



Swarm initialized: current node (pdlc1dhkb30pq6pv0ke70dw1n) is now a manager.



To add a worker to this swarm, run the following command:



    docker swarm join --token SWMTKN-1-4zvv180csbr6czbrt2u5vnivkq0cb2crswsbqvm2gyi4jixs78-bzwf564qc7z9p0l23o0fv9pto 192.168.110.126:2377



To add a manager to this swarm, run'docker swarm join-token manager' and follow the instructions.

按照上面的第一条命令分别在节点机运行加入swarm。

再在主节点运行第二条命令作为管理节点。

2、在主节点sudo docker node ls即可看到节点已成功加入集群。

备注：

使用：docker node rm -f [node ID]可删除一个节点。如果该node想重新加入，需要在该节点上先sudo docker swarm leave --force离开swarm，然后再运行第一条中的命令加入集群。



二、swarm集群创建服务：

1、在主节点pull 一个nginx镜像：docker pull nginx

2、创建两个service：sudo  docker service create --name nginx --replicas2-p 80:80/tcp nginx

3、查看运行状况：sudo docker service ps nginx,可以看到两个服务运行在两个节点上。

4、批量产生容器：

sudo docker service scale nginx=5,然后运行第三条命令，可以看到5个容器在三个节点上运行。由swarm进行分配。

5、指定节点创建服务：

docker service create nginx --constraint node.hostname=vm27 --detach=True #貌似没用，管理节点运行后，还是会分配到每个节点运行。

再vm27节点sudo docker ps -a即可看到相应的容器。

三、python(版本3.5)通过API管理swarm：

1、pull an image：

import docker

client=docker.from_env()

image=client.images.pull("镜像")

print(image.id)

2、commit a container:

import docker

client=docker.from_env()

container=client.containers.run("alpine",["touch","/hello"],detach=True) #指定容器运行于前台还是后台,为True，立即返回一个镜像。

container.wait()

image=container.commit("helloworld")

print image.id
```