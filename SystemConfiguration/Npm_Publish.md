- 1，`https://www.npmjs.com/`注册账号，然后在 `AccessToken` 中生成一个 `token` ，记录下来，因为只会`display `一次。

- 2，打开终端，打开`.npmrc`文件，添加一行, ` _authToken`后面就是刚才生成的`token`：

  ```shell
  //registry.npmjs.org/:_authToken=d06e5402-da77-46e1-aa0b-8492476fa450
  ```

> 注意registry要是：`https://registry.npmjs.org/`

- 配置`package.json`：其中 `name`, `version`, `author`, `main`, 都是必填项，`main`是打包后的文件。
- 终端输入 `npm login` ，登录。
- 执行 `npm publish` 发布。