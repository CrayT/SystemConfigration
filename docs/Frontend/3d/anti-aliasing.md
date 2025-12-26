### 抗锯齿

- 屏幕的像素是离散的，渲染时 边缘会出现锯齿状

### 创建WebglRenderer时传入参数antialias即可开启硬件多重采样抗锯齿

```javascript
const renderer = new THREE.WebGLRenderer({
  antialias: true  // 启用抗锯齿
});
```

### 使用后处理后出现锯齿

- threejs中使用后处理即effecComposer时，浏览器默认的硬件抗锯齿（MSAA）通常会失效，解决方法如下：

#### 1，使用 `SMAAPass` 进行抗锯齿

```javascript
const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
composer.addPass(smaaPass); // addPass需要在最后一步添加
```

- 实测该方法渲染效果一般, FXAA后处理更一般 会导致整体模糊


#### 2，使用原生多重采样，推荐

```javascript
// 创建多重采样渲染目标 (仅限 WebGL 2)
const renderTarget = new THREE.WebGLMultisampleRenderTarget(width, height, {
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    samples: 4 // 采样数，通常设置为 4 即可平衡画质与性能, 默认值即为4
});
// 新版本的threejs中，WebGLRenderTarget即可直接指定samples参数(默认为0)

// 将其传给 EffectComposer，覆盖默认renderTarget
const composer = new EffectComposer(renderer, renderTarget);
```

- 实测该方法在WebGL 2环境下，与无后处理时效果相当。
- `threejs` 中 `samples` 大于0时会处理采样
- 多重采样由 GPU 硬件层实现的 在光栅化阶段多点采样，对 OutlinePass 产生的边缘抗锯齿效果极佳，效率更高，显存占用较高，但计算由硬件加速
- 而SMAA由shader逐像素计算的后处理算法 效率和效果都不如多重采样。