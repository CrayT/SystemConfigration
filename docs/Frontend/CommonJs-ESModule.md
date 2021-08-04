- `CommonJs`: 输出值的拷贝，动态加载

- `ESModule`: 输出值的引用，静态加载，所以`import`必须放在顶部。由于编译时加载，所以在`webpack`中可做`tree shaking`.