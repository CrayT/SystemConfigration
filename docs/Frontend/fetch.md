### Fetch

１，指定字节范围下载

```javascript
  const options = {
    headers: {
      Range: `bytes=${start}-${end}`,
    },
  };
  const res = await fetch(url, option);
  const buffer = await res.arrayBuffer();
```

2, 手动分块下载

```javascript
// 分块下载
let chunks = (end - start) / ChunkSize;
if (chunks > 1) {
    // 大于1 分块下载
    let newStart = start;
    let currentEnd = end;

    while (chunks > 0) {
        if (chunks <= 1) {
            if (end === contentLength) {
                options.headers.Range = `bytes=${newStart}-`;
            } else {
                options.headers.Range = `bytes=${newStart}-${end}`;
            }
            currentEnd = end;
        } else {
            currentEnd = newStart + ChunkSize;
            options.headers.Range = `bytes=${newStart}-${currentEnd}`;
        }

        const key = `${url}-${newStart}-${currentEnd}`;
        // 防止重复下载一个范围的数据
        if (!downloadMap[key]) {
            downloadMap[key] = {
                downloading: true,
            };
        } else {
            if (downloadMap[key].downloading) {
                return;
            }
        }

        await fetch(url, options);

        downloadMap[key].downloading = false;

        chunks -= 1;
        newStart += ChunkSize;
    }
  } else {
    let currentEnd = end;

    options.headers.Range = `bytes=${start}-${currentEnd}`;

    const key = `${url}-${start}-${currentEnd}`;
    if (!downloadMap[key]) {
      downloadMap[key] = {
        downloading: true,
      };
    } else {
      if (downloadMap[key].downloading) {
        return;
      }
    }

    await fetch(url, options);
    downloadMap[key].downloading = false;
  }
```

3, 获取文件字节长度

```javascript
const controller = new AbortController();
const signal = controller.sinal;
try {
    const res = await retryFetch(bagUrl, {
    method: "GET",
    signal,
    });
    contentLength = res.headers.get("Content-Length");
    controller.abort();
    LengthMap.set(bagUrl, contentLength);
} catch (er) {
    console.log("err", er);
}
```

4, 开发模式请求本地文件

本地文件需要放在public文件夹下，fetch的url为｀http://localhost:3000/fileName｀;