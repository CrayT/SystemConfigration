> 以threejs里的OutlinPass为例

### 1，设置背景图层

```javascript
renderer.setClearColor( 0xffffff, 1 );
```

### 2，渲染未选中物体的深度图

1，代码临时隐藏选中物体，只保留未选中物体

```javascript
this._changeVisibilityOfSelectedObjects( false );
```

2, 用 MeshDepthMaterial 把其余场景渲染到 `renderTargetDepthBuffer`

```javascript
this.renderScene.overrideMaterial = this.depthMaterial;
renderer.setRenderTarget( this.renderTargetDepthBuffer );
```
3, `MeshDepthMaterial`把像素深度z转换为RGBA作为`gl_FragColor`。

```javascript
// 部分代码
gl_FragColor = packDepthToRGBA( fragCoordZ );
```

### 3，渲染选中对象的遮罩图

1，隐藏非选中对象，仅渲染选中对象

```javascript
this._changeVisibilityOfSelectedObjects( true );
this._changeVisibilityOfNonSelectedObjects( false );
```

2，用`prepareMaskMaterial`将选中物体与刚才的深度图比较

```C++
// 用projTexCoord坐标采样深度图depthTexture获取对应位置的颜色
// 然后再将该颜色解压为深度值(pack与unpack: 压缩与解压)
float depth = unpackRGBAToDepth(texture2DProj( depthTexture, projTexCoord ));

// 将深度值根据相机远近面转换到0~1范围
float viewZ = - DEPTH_TO_VIEW_Z( depth, cameraNearFar.x, cameraNearFar.y );

// 用二元值0或1表示选中与非选中物体在每个位置的前后关系，0表示在前可见，1表示在后不可见
float depthTest = (-vPosition.z > viewZ) ? 1.0 : 0.0;

// g值用来表示遮挡信息，所以对于选中物体，渲染图中的r值都为0，而背景图层的r值都为1，所以这里就有了边界
gl_FragColor = vec4(0.0, depthTest, 1.0, 1.0);
```

3，将场景渲染到`renderTargetMaskBuffer`

```javascript
renderer.setRenderTarget( this.renderTargetMaskBuffer );
```

4，经过以上步骤，输出渲染图包含信息：
    - 1，r=0表示选中物体区域，r=1表示没有选中物体的区域；
    - 2，g表示由深度比较得到的遮挡标记，用于区分可见边缘和隐藏边缘；

5，恢复非选中物体的可见性:

```javascript
this._changeVisibilityOfNonSelectedObjects( true );
```

### 4，降采样、边缘检

1, 通过downSampleRatio=2创建`renderTargetMaskDownSampleBuffer`, 将原始大小降采样到半屏，GPU在处理时默认会将输入纹理映射到输出网格上

2, 用EdgeDetectionMaterial做边缘检测

```C++
// 像素宽度
vec2 invSize = 1.0 / texSize;

// 计算右左上下四个像素的位置并采样像素值RGBA
vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);
vec4 c1 = texture2D( maskTexture, vUv + uvOffset.xy);
vec4 c2 = texture2D( maskTexture, vUv - uvOffset.xy);
vec4 c3 = texture2D( maskTexture, vUv + uvOffset.yw);
vec4 c4 = texture2D( maskTexture, vUv - uvOffset.yw);

// 计算像素边缘的突变强度用于表示边缘颜色深浅，(没有变化的区域突变为0)
float diff1 = (c1.r - c2.r)*0.5;
float diff2 = (c3.r - c4.r)*0.5;
float d = length( vec2(diff1, diff2) );

// 用g值判断遮挡信息，被遮挡的用hidden颜色，否则用visible颜色
float a1 = min(c1.g, c2.g);
float a2 = min(c3.g, c4.g);
float visibilityFactor = min(a1, a2);
vec3 edgeColor = 1.0 - visibilityFactor > 0.001 ? visibleEdgeColor : hiddenEdgeColor;

// 用d作为颜色强度相乘，最后输出gl_FragColor
gl_FragColor = vec4(edgeColor, 1.0) * vec4(d);
```

### 5，模糊处理

1，在横向、纵向应用高斯模

todo
### 6，加法混合回原画面
 
 todo