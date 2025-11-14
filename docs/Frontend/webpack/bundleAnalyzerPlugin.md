### 可视化打包产物

BundleAnalyzerPlugin插件，可以帮助我们可视化打包产物：

1, 安装
```
npm install webpack webpack-cli --save-dev
或
yarn add -D webpack-bundle-analyzer
```

2, 使用

配置webpack文件

```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'report.html',
      openAnalyzer: false, // 不自动打开浏览器, true在打包结束后自动打开浏览器 显示report.html
    }),
  ],
}
```

report.html为打包产物可视化，可分析每个bundle的大小及内部组成，针对性分析包的内部。