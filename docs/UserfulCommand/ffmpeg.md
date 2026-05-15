
#### ffmpeg录屏：
ffmpeg -video_size 1280x720 -framerate 30 -f avfoundation -i "1:0" out.mkv
【"1:0"中，1是video设备索引，0是audio设备索引】

#### 查看本地设备编号：
ffmpeg -f avfoundation -list_devices true -i ""

#### 视频转gif：
ffmpeg -i xxx.mov -r 15 xxx.gif