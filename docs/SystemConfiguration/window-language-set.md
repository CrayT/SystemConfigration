### window server上將系統默認英文环境改为中文
- 1，`settting` -> `Time and Language` -> `Region & language` ->, 修改 `Location` 为 `China`，添加语言 -> 选择中文并下载
  
  - `Window Server2012` 设置方法不太一样，`Control panel` -> `Clock Language and Region` -> `Change Location`, `Home location` 改为 `China`，`Administrative` 菜单下 `change system locale` 改为 `chinese`
  - 
- 2，重启，打开 `control panel` -> `Add a language`, 在弹出窗口中应该可以看到中文，点击后面option，看是否display language处于已启用状态，如果显示`Language pack isn't available`，说明字体并没有成功安装。参考[3]
- 
- 3, (此方法适用于系统无法自动下载安装)；下载[中文包](链接：https://pan.baidu.com/s/1WV8KXOIKyuOX_-kY-lwSpg 
提取码：1256),然后 `win+R` 调出运行工具，输入`lpksetup`, 点击 `install`，然后选择下载的安装包再安装即可，安装速度较长，安装完后重新启动就ok，如果没问题，系统应该已经是中文了。