### 快速排序时间复杂度分析
- 快速排序属于递归方法，每轮需要指定一个`pivot` (一般默认当前的第一个)，且数组的原始特性直接影响快排的效率，最好情况是每轮`pivot`都能将数组分为55开的两组。

#### 分析
- 最优情况：
  > `pivot` 正好位于中间.
  
  - 1, 比较次数
  
    > 每次都55开，每次都比较n次，共比较`logn`轮，所以时间复杂度为`nlogn`

  - 2, 递归推导   
```
    T(n) = 2 T(n/2) + n    //n为每轮都需要比较n次
    (1/n) T(n) = (2/n) T(n/2) + 1
    (2/n) T(n/2) = (4/n) T(n/4) + 1
    ...
    (1/2) T(1) = 1 + T(1)
    累加：
    T(n) = O(nlogn)
```

- 最坏情况:

  > 数组已排序，则为最坏情况.
  
  - 1, 比较次数:
  
    > 每次都分为1、n-1两组，比较轮数：(n-1) + (n-2) + ... + 1 ~= pow(n,2), 时间复杂度为 \sqrt[n]{2}

  - 2, 推导：
```
    T(n) = T(n-1) + n //每轮比较剩余n个元素
    T(n-1) = T(n-2) + n-1
    ...
    T(2) = T(1) + n-2
    累加：
    T(n) ~= O(pow(n,2))
```

- 平均情况
  - 公式推导
```
    T(n) = T(i) + T(n-i-1)
    对于平均情况，T(i)应该去平均值，即所有情况的平均值，即：
    T(i) = (1/n)
```
  - 推导过程:
![](https://raw.githubusercontent.com/CrayT/picCabin/master/%E5%BF%AB%E6%8E%92%E5%B9%B3%E5%9D%87%E5%A4%8D%E6%9D%82%E5%BA%A6.jpg))

### 快排python代码
```python
def quick(arr, l, r):
    guard = arr[l]
    while l < r:
        while l < r and arr[r] >= guard:
            r -= 1
        if l < r:
            arr[l] = arr[r]
        while l < r and arr[l] <= guard:
            l += 1
        if l < r:
            arr[r] = arr[l]
    arr[l] = guard
    return l

def part(arr, l, r):
    if l < r:
        index = quick(arr, l, r)
        part(arr, l, index - 1)
        part(arr, index + 1, r)

num = [3,1,2,5,4,6,3]
l = 0
r = len(num) - 1
part(num, l, r)
print(num)
```