### 屏幕坐标到世界坐标

```javascript
const = new THREE.Vector3();
position.x = event.clientX;
position.y = event.clientY;
const _world = new THREE.Vector3();
// 转为ndc坐标
_world.x = (event.clientX / dom.offsetWidth) * 2 - 1;
_world.y = -(event.clientY / dom.offsetHeight) * 2 + 1;
_world.z = 0.5;
// 转到世界坐标(可能不是想要的世界坐标，毕竟z强制赋值了0.5)
_world.unproject(camera);

// 下面修正坐标，求在z=0平面上的世界坐标
// 1，投射的世界坐标与相机坐标之间的向量
_world.sub(camera.position);

// 2, 相机与上述向量的距离比值，注意z=0平面需要用0去减相机z坐标
// 如果要得到其他平面上的坐标，需要修改计算公式
const dis = ( 0 - camera.position.z) / _world.z;

// 3, 相机当前位置，加上 第一步的向量乘以第二步的比值，记得到在z=0平面上的世界坐标
_world.copy(camera.position.clone().add(_world.multiplyScalar(dis)));

_world.z = 0;

```

### 世界坐标到屏幕坐标

```javascript
const worldPosition = new THREE.Vector3(x, y, z);

// 2. 将世界坐标投射到屏幕(NDC)
worldPosition.project(camera);

// 3. 将NDC坐标(-1~1)转换成像素坐标
const container = document.getElementById('canvas-container'); // 容器
const widthHalf = container.offsetWidth / 2;
const heightHalf = container.offsetHeight / 2;

// 转换到屏幕空间
const screenX = 0.5 * (worldPosition.x * container.offsetWidth) + container.offsetWidth;
const screenY = -0.5 * (worldPosition.y * container.offsetHeight) + container.offsetHeight;

```