> orbitcontrol的源码没有状态state的暂存、恢复概念，在有些场景下需要状态的存储及恢复，比如切换不同视角、位置的相机时

```javascript
    // 关键在一下几个处理函数

// 原始函数
  this.saveState = function () {
    scope.target0.copy(scope.target);
    scope.position0.copy(scope.object.position);
    scope.zoom0 = scope.object.zoom;
  };

  // 导出控制器当前状态数据 新增
  this.exportState = function () {
    return {
      target: scope.target.clone(),
      position: scope.object.position.clone(),
      zoom: scope.object.zoom,
    };
  };

  // 恢复控制器的某个状态数据 新增
  this.resumeState = function (states) {
    scope.target.copy(states.target);
    scope.object.position.copy(states.position);
    scope.object.zoom = states.zoom;

    scope.object.updateProjectionMatrix();

    scope.update();

    state = STATE.NONE;
  };

// 原始函数
  this.reset = function () {
    scope.target.copy(scope.target0);
    scope.object.position.copy(scope.position0);
    scope.object.zoom = scope.zoom0;

    scope.object.updateProjectionMatrix();
    scope.dispatchEvent(changeEvent);

    scope.update();

    state = STATE.NONE;
  };
```