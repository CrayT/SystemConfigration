### 一般命令
```
docker run -d -p ****:**** imageName
```
### 限制可申请资源
```
    -m,--memory

    内存限制，格式是数字加单位，单位可以为 b,k,m,g。最小为 4M

    --memory-swap

    内存+交换分区大小总限制。格式同上。必须必-m设置的大

    --memory-reservation

    内存的软性限制。格式同上

    --oom-kill-disable

    是否阻止 OOM killer 杀死容器，默认没设置

    --oom-score-adj

    容器被 OOM killer 杀死的优先级，范围是[-1000, 1000]，默认为 0

    --memory-swappiness

    用于设置容器的虚拟内存控制行为。值为 0~100 之间的整数

    --kernel-memory

    核心内存限制。格式同上，最小为 4M
```

### 用户内存限制

> 用户内存限制就是对容器能使用的内存和交换分区的大小作出限制。使用时要遵循两条直观的规则：-m，--memory选项的参数最小为 4 M。--memory-swap不是交换分区，而是内存加交换分区的总大小，所以--memory-swap必须比-m,--memory大。在这两条规则下，一般有四种设置方式。
你可能在进行内存限制的实验时发现docker run命令报错：WARNING: Your kernel does not support swap limit capabilities, memory limited without swap.
这是因为宿主机内核的相关功能没有打开。按照下面的设置就行:
step 1：编辑/etc/default/grub文件，将GRUB_CMDLINE_LINUX一行改为GRUB_CMDLINE_LINUX="cgroup_enable=memory swapaccount=1"
step 2：更新 GRUB，即执行$ sudo update-grub
step 3: 重启系统。

#### 设置规则：
> 如果在容器中运行一个一直不停申请内存的程序，你会观察到该程序最终能占用的内存大小为 2a。
比如$ docker run -m 1G ubuntu:16.04，该容器能使用的内存大小为 1G，能使用的 swap 分区大小也为 1G。容器内的进程能申请到的总内存大小为 2G。

    - 1, 不设置 -m,--memory和--memory-swap
    
> 如果不设置-m,--memory和--memory-swap，容器默认可以用完宿舍机的所有内存和 swap 分区。不过注意，如果容器占用宿主机的所有内存和 swap 分区超过一段时间后，会被宿主机系统杀死（如果没有设置--00m-kill-disable=true的话）。

    - 2, 设置 -m,--memory，不设置--memory-swap
> 给-m或--memory设置一个不小于 4M 的值，假设为 a，不设置--memory-swap，或将--memory-swap设置为 0。这种情况下，容器能使用的内存大小为 a，能使用的交换分区大小也为 a。因为 Docker 默认容器交换分区的大小和内存相同。

    - 3, 设置-m,--memory=a，--memory-swap=b，且b > a
> 给-m设置一个参数 a，给--memory-swap设置一个参数 b。a 时容器能使用的内存大小，b是容器能使用的 内存大小 + swap 分区大小。所以 b 必须大于 a。b -a 即为容器能使用的 swap 分区大小。
比如$ docker run -m 1G --memory-swap 3G ubuntu:16.04，该容器能使用的内存大小为 1G，能使用的 swap 分区大小为 2G。容器内的进程能申请到的总内存大小为 3G。

    - 4, 设置-m,--memory=a，--memory-swap=-1
> 给-m参数设置一个正常值，而给--memory-swap设置成 -1。这种情况表示限制容器能使用的内存大小为 a，而不限制容器能使用的 swap 分区大小。
这时候，容器内进程能申请到的内存大小为 a + 宿主机的 swap 大小。


### OOM-killer
>默认情况下，在出现 out-of-memory(OOM) 错误时，系统会杀死容器内的进程来获取更多空闲内存。这个杀死进程来节省内存的进程，我们姑且叫它 OOM killer。我们可以通过设置--oom-kill-disable选项来禁止 OOM killer 杀死容器内进程。但请确保只有在使用了-m/--memory选项时才使用--oom-kill-disable禁用 OOM killer。如果没有设置-m选项，却禁用了 OOM-killer，可能会造成出现 out-of-memory 错误时，系统通过杀死宿主机进程或获取更改内存。
```shell
    docker run -it -m 100M --oom-kill-disable ubuntu:16.04 /bin/bash
```