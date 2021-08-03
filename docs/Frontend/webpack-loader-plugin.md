### webpack的loader和plugin区别
- `loader` 是一个转换器，进行文件的转换，比如将 `*.less` 转换成 `*.css`.
- `plugin` 是一个扩展器，对 `webpack` 进行丰富优化。在 `webpack` 运行的生命周期中会广播出许多事件，`plugin` 可以监听这些事件。在打包编译过程中，通过hook到每一个编译（compiler）中，在对应的事件节点执行自定义操作，比如资源管理、定义环境变量等.
