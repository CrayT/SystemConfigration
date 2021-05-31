# kubernetes问题点

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

**1，`kubectl get node`，显示node状态为Not ready：**﻿

![这里写图片描述](https://img-blog.csdn.net/2018090814384565?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0NyYXp5VFRU/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

**执行`kubectl describe node vm15`：**﻿

![这里写图片描述](https://img-blog.csdn.net/20180908144036435?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0NyYXp5VFRU/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)





问题为：

```
runtime network not ready: NetworkReady=false reason:NetworkPluginNotReady message:docker: network plugin is not ready: cni config uninitialized

其实在执行sudo kubeadm init的时候就已经有提示：
```

![这里写图片描述](https://img-blog.csdn.net/20180908144240932?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0NyYXp5VFRU/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)



需要在添加node之前deploy一个network：

```
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/v0.9.1/Documentation/kube-flannel.yml

然后再执行kubectl get node查看：
```

![这里写图片描述](https://img-blog.csdn.net/20180908144503438?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0NyYXp5VFRU/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)


三个节点已经全为ready状态。

**2，使用`sudo kubeadm join`时出现错误如下：**
[ERROR DirAvailable–etc-kubernetes-manifests]: /etc/kubernetes/manifests is not empty
[ERROR FileAvailable–etc-kubernetes-pki-ca.crt]: /etc/kubernetes/pki/ca.crt already exists
[ERROR FileAvailable–etc-kubernetes-kubelet.conf]: /etc/kubernetes/kubelet.conf already exists
**解决办法：**
在每个节点上执行`sudo kubeadm reset`，然后再执行join命令。
再不行，就删除以上文件夹重新执行init。

**3，证书错误：**
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of “crypto/rsa: verification error” while trying to verify candidate authority certificate “kubernetes”)
解决办法：

```
mv  $HOME/.kube $HOME/.kube.bak
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

**4,如果在describe pod时候提示错误:**
Failed create pod sandbox: rpc error: code = Unknown desc = failed to set up sandbox container “8282b53b0d3c59f3b01a18517d1d201e69eb6ca9ce11bc008b90b57675123f10” network for pod “redis-master-wkktm”: NetworkPlugin cni failed to set up pod “redis-master-wkktm_default” network: open /run/flannel/subnet.env: no such file or directory
因为使用了cni,需要在`sudo kubeadmin reset`然后init时候指定:
`kubeadm init --pod-network-cidr=10.244.0.0/16`