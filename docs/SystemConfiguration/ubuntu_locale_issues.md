# ubuntu环境语言问题

#### 于2019年12月8日2019年12月8日由[**crazyxt**](https://crazyxt.com/?author=1)发布

问题：

```
locale: Cannot set LC_CTYPE to default locale: No such file or directory
locale: Cannot set LC_ALL to default locale: No such file or directory
```

解决：

```
echo "export LANGUAGE=en_US.UTF-8">>~/.bashrc
echo "export LC_ALL=en_US.UTF-8 ">>~/.bashrc
source ~/.bashrc
```