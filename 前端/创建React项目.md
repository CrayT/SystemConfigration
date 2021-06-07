### 安装了node，且版本大于10.14.0（目前要求）
```
npm install -g create-react-app

create-react-app projectName
```

- 修改默认的3000端口：
  - 方法1：
    > 修改 `/node_modules/react-scripts/scripts/start.js ` 中的 `DEFAULT_PORT`
  - 方法2：
   > 在`package.json`的`script`命令前加： `set PORT=端口号`即可