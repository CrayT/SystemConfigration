# python3 安装sqlite3

#### 于2020年1月11日由[**crazyxt**](https://crazyxt.com/?author=1)发布

##### 无法直接 pip 安装。

```shell
wget https://www.sqlite.org/2017/sqlite-autoconf-3170000.tar.gz --no-check-certificate
tar zxvf sqlite-autoconf-3170000.tar.gz
cd sqlite-autoconf-3170000/
./configure --prefix=/usr/local/sqlite3 --disable-static --enable-fts5 --enable-json1 CFLAGS="-g -O2 -DSQLITE_ENABLE_FTS3=1 -DSQLITE_ENABLE_FTS4=1 -DSQLITE_ENABLE_RTREE=1"
#进入python3.5文件夹，打开setup.py，找到 /sqlite_inc_paths，添加两行：
/usr/local/sqlite3/include
/usr/local/sqlite3/include/sqlite3
#然后：
./configure --enable-loadable-sqlite-extensions
make && sudo make install
```