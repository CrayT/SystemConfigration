> 自动驾驶场景中，相机需要跟随自车位置角度自动更新，同时也要支持用户手动调整视角，这种情形下，需要创建一个控制相机，用于接收用户的操作
在render时将控制相机的数据和默认渲染相机的数据合并，从而实现自动跟随和手动调整的结合。
以下示例还支持在上述基础上3d透视相机和2d正交相机的切换

#### 功能：
- 自动pilot，包括多种视角
- 手动控制
- 3d视角、2d视角切换

```javascript

let frame_rate = 15;
const bvHeight = 35;
window.THREE = THREE;


class Render {
  constructor() {

    this.is_following_car = false;
    this.last_position = {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    };
    this.initialized = false;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.ctlCameraDirection = new THREE.Vector3();
    this.switchCameraMode = this.switchCameraMode.bind(this);
  }


  changeParkingPerspective = (event) => {

    bevStore.parkingPerspective = event.detail;

    if (event.detail === EnumParkingPerspective.Map) {


      this.switchCameraMode("followingCar");
      store.updateCamera({ ...store.camera, mode: "followingCar" });
    } else {
      // 自车坐标系，只保留感知topic，自车保持原点


      this.switchCameraMode("BV-vertical", {
        position: { x: -12, y: 0, z: 19 },
        target: { x: 0, y: 0, z: 0 },
        zoom: 1,
      });
      store.updateCamera({ ...store.camera, mode: "BV-vertical" });
    }
  };

  setCameraViewFollowingCar(isFollowing) {
    this.is_following_car = !!isFollowing;
    if (!isFollowing) {
      this.keepFollowingCar = false;
    }
    if (this.initialized) {
      const mode = isFollowing ? "followingCar" : "userControl";
      this.switchCameraMode(mode);
    }
  }

  resetCameraPosition = () => {
    // reset the controlCamera position and direction by copying from
    // the resetCamera. Reset the controls as well
    this.controlCamera.copy(this.resetCamera.clone());
    this.controls.reset();
  };

  updateCameraPosition = (clockWiseControl = true) => {
    if (this.initialized) {
      let direction = new THREE.Vector3();
      if (this.is_following_car) {
        // Start the following mode, will do the following step
        // 1. Disable Pan controls
        // 2. Reset the controlCamera position and the control at the first time,
        //    then keep following the egocar
        // 3. Compute the rotation theta and the relative distance between
        //    the camera and the egocar
        // 4. Compute the position of the world camera from the last step
        // 5. Save the last position of the egocar, so the world camera can
        //    look at the egocar will switch to the global mode.
        this.controls.enablePan = false;
        if (!this.keepFollowingCar) {
          this.resetCameraPosition();
          this.keepFollowingCar = true;
        }
        this.controlCamera.camera.getWorldDirection(direction);
        // overwrite this.camera.position.x and this.camera.position.y
        this.camera.copy(this.controlCamera);
        // compute the rotation-z of the control from controlCamera,
        // this value will be added to the vehicle heading
        let direction_theta = clockWiseControl
          ? Math.atan2(direction.y, direction.x)
          : -Math.atan2(direction.y, direction.x);
        // camera distance is the distance bewteen the camera and the vehicle
        let camera2carDistance = Math.sqrt(
          this.camera.position.x * this.camera.position.x +
            this.camera.position.y * this.camera.position.y,
        );
        // Move to the egocar position first, then move towards the rear of the
        // egocar, and look at the egocar
        this.camera.position.x =
          this.position.x -
          camera2carDistance * Math.cos(this.rotation.z + direction_theta);
        this.camera.position.y =
          this.position.y -
          camera2carDistance * Math.sin(this.rotation.z + direction_theta);
        this.camera.lookAt(this.position.x, this.position.y, this.position.z);
        // save the last position so the real world camera can look at the car
        // when switch to the global mode
        this.last_position.x = this.position.x;
        this.last_position.y = this.position.y;
        this.last_position.z = this.position.z;
      } else {
        // switch to the global mode
        // 1. reset the keep following flag
        // 2. enable the pan control
        // 3. move the camera to the (last positon + offset)
        this.keepFollowingCar = false;
        this.controls.enablePan = true;
        this.camera.copy(this.controlCamera.clone());

        let x = this.camera.position.x;
        let y = this.camera.position.y;
        let z = this.camera.position.z;
        if (this.last_position.x === 0.0) {
          this.last_position.x = this.position.x;
          this.last_position.y = this.position.y;
          this.last_position.z = this.position.z;
        }
        this.camera.position.x = this.last_position.x + x;
        this.camera.position.y = this.last_position.y + y;
        this.camera.position.z = this.last_position.z + z;
      }
    }
  };

  initialize(canvasId, width, height) {
    this.initialized && this.reset();

    this.initialized = true;

    const container = document.getElementById(canvasId);
    container.appendChild(this.renderer.renderer.domElement);

    this.perspectiveCamera = new PerspectiveCamera();
    this.perspectiveCamera.initialize(width, height);
    this.orthoCamera = new OrthoCamera();
    this.orthoCamera.initialize(width, height);

    this.camera = this.perspectiveCamera;
    this.renderer.setCamera(this.camera.camera);
    // 被控制的相机，用于接收交互事件
    this.controlCamera = this.camera.clone();

    // control
    this.controls = new Orbitcontrols(
      this.controlCamera.camera,
      this.renderer.renderer.domElement,
      this.center_offset,
    );
    if (this.camera.isPerspectiveCamera) {
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 300;
    } else {
      this.controls.maxPolarAngle = 0;
    }
    this.controls.enablePan = false;
    this.controls.saveState();
    this.controls.addEventListener("change", this.changeOrbitcontrols);

    // reserve the initial states of the controlCamera for resetting
    this.resetCamera = this.controlCamera.clone();
    this.resetOrthoCamera = this.orthoCamera.clone();
    this.resetPerspectiveCamera = this.perspectiveCamera.clone();

    this.position = this.position || {
      x: 10.0,
      y: 0.0,
      z: 0.0,
    };
    this.rotation = this.rotation || { x: 0.0, y: 0.0, z: 0.0 };
    this.updateDimension(width, height);
    this.animate();
    this.switchCameraMode();
  }

  getCurrentCamera = () => {
    return this.camera.camera;
  };

  reset = () => {
    this.removeAll();
    this.controls?.dispose();
  };



  render() {
    const start = performance.now();

    this.updateCameraAttributes();


    this.renderer.render();

  }

  reAnimate(cmd) {
    this.animate(cmd.detail);
  }

  animate(fps = frame_rate) {
    if (window.renderInterval) {
      clearInterval(window.renderInterval);
    }
    this.start = Date.now();
    window.renderInterval = setInterval(() => {
      this.render();
    }, 1000 / fps);
  }

  // 根据controlCamera同步camera的位置和旋转值，使camera响应交互事件（可缩放移动）
  syncCameraAttributes() {
    this.camera.syncCameraAttributes(this.controlCamera);
  }

  updateCameraFollowingCar() {
    // 获取controlCamera的方向，用于响应交互事件（鼠标滚轮，方向键移动等）
    this.controlCamera.camera.getWorldDirection(this.ctlCameraDirection);
    // 计算controlCamera的方向与X轴的夹角
    let direction_theta = Math.atan2(
      this.ctlCameraDirection.y,
      this.ctlCameraDirection.x,
    );
    // 计算controlCamera与原点的直线距离（俯视角度下）
    let camera2carDistance = Math.sqrt(
      this.controlCamera.position.x * this.controlCamera.position.x +
        this.controlCamera.position.y * this.controlCamera.position.y,
    );
    // 将controlCamera的属性同步给camera
    this.syncCameraAttributes();
    // 计算并更新camera的位置（结合自车位置与controlCamera交互的结果来计算）
    const position = {
      x:
        this.position.x -
        camera2carDistance * Math.cos(this.rotation.z + direction_theta),
      y:
        this.position.y -
        camera2carDistance * Math.sin(this.rotation.z + direction_theta),
    };
    this.camera.updateCameraPosition(position);
    // 更新camera的中心位置，camera看向自车
    this.camera.lookAt(this.position.x, this.position.y, this.position.z + 2);
    // 备份自车位置，用于切换视角
    this.last_position.x = this.position.x;
    this.last_position.y = this.position.y;
    this.last_position.z = this.position.z;
  }

  updateCameraUserControl() {
    const position = this.target ? this.target.position : this.position;
    // 将controlCamera的属性同步给camera
    this.syncCameraAttributes();
    // 基于备份的自车数据来计算
    if (this.last_position.x !== position.x) {
      this.last_position.x = position.x;
      this.last_position.y = position.y;
      this.last_position.z = position.z;
    }
    // 计算并更新camera的位置（结合备份的自车数据与controlCamera交互的结果来计算）
    this.camera.updateCameraPosition({
      x: this.last_position.x + this.controlCamera.position.x,
      y: this.last_position.y + this.controlCamera.position.y,
      z: this.last_position.z + this.controlCamera.position.z,
    });
  }

  changeOrbitcontrols = throttle(() => {
    this.refresh2dText();
  }, 100);

  /**
   * 切换相机类型: 透视或正交
   * @param {*} type 'perspective' | 'ortho'
   */
  switchCameraType(type) {
    const switchCamera = () => {
      this.controlCamera = this.camera.clone();
      this.resetCamera =
        type === EnumCameraMode.Ortho
          ? this.resetOrthoCamera
          : this.resetPerspectiveCamera;

      this.controls.dispose();
      this.controls = new Orbitcontrols(
        this.controlCamera.camera,
        this.renderer.renderer.domElement,
        this.center_offset,
      );
      this.position = { x: 0, y: 0, z: 0 };
      this.rotation = { x: 0, y: 0, z: 0 };
      this.controls.saveState();
      this.switchCameraMode(this.mode);
      this.controls.addEventListener("change", this.changeOrbitcontrols);
      this.renderer.setCamera(this.camera.camera);
    };

    switch (type) {
      case EnumCameraMode.Perspective:
        this.camera = this.resetPerspectiveCamera.clone();
        switchCamera();
        this.controls.maxPolarAngle = Math.PI / 2;
        break;
      case EnumCameraMode.Ortho:
        this.camera = this.resetOrthoCamera.clone();
        this.camera.camera.updateProjectionMatrix();
        switchCamera();
        this.controls.maxPolarAngle = 0;
        this.controls.update();
        break;
      default:
        break;
    }
  }

  switchCameraMode(mode = "BV-vertical", cameraData) {
    this.mode = mode;
    if (!this.initialized) return;
    this.target = null;
    // 判断是否带有相机视角数据，有则是用户自定义视角
    if (cameraData) {
      this.controls.enablePan = true;
      this.updateCameraAttributes = this.updateCameraUserControl;

      if (cameraData.cameraType) {
        bevStore.switchCamera(cameraData.cameraType);
      }
      // Mark: 不要直接设置相机的位置角度，通过control来控制相机, 否则在有平移时会发生跳跃
      this.controls.resumeState(cameraData);
      this.controls.update();

      return;
    }
    switch (mode) {
      case "followingCar": // 跟车视角，默认视角，跟随自车在后上方（类似一个无人机跟拍）
        this.controls.enablePan = false;
        this.resetCameraPosition();
        this.updateCameraAttributes = this.updateCameraFollowingCar;
        break;
      case "userControl": // 自由视角，不跟随自车，由用户使用键盘方向键来控制相机的位置
        this.controls.enablePan = true;
        this.updateCameraAttributes = this.updateCameraUserControl;
        break;
      case "BV-vertical": // 鸟瞰视角竖向，跟随自车，俯视角度，自车正前方向为竖直向上方向
        this.controls.enablePan = true;
        this.resetCameraPosition();
        if (this.controlCamera.isPerspectiveCamera) {
          this.controlCamera.position.z = bvHeight;
          this.controls.rotate(0);
        } else {
          this.controls.rotate(Math.PI / 2);
        }
        this.updateCameraAttributes = this.updateCameraUserControl;
        break;
      case "BV-horizontal": // 鸟瞰视角横向，跟随自车，俯视角度，自车正前方向为水平向右方向
        this.controls.enablePan = true;
        this.resetCameraPosition();
        if (this.controlCamera.isPerspectiveCamera) {
          this.controlCamera.position.z = bvHeight;
          this.controls.rotate(-Math.PI / 2);
        }
        this.updateCameraAttributes = this.updateCameraUserControl;
        break;
    }
  }

  // 获取控制器当前的状态数据，用于切换视角时的状态复原
  getCameraData() {
    const states = this.controls.exportState();
    // 因为恢复到指定位置时是用当前位置加差值，这里返回差值；
    const position = this.target ? this.target.position : this.position;
    const resPosition = this.camera.position.clone();
    resPosition.x = resPosition.x - position.x;
    resPosition.y = resPosition.y - position.y;
    resPosition.z = resPosition.z - position.z;
    return {
      position: states.position,
      target: states.target,
      zoom: states.zoom,
      cameraType: this.camera.type,
    };
  }

  // 设置自由视角的相机位置与旋转角度
  setCameraData(cameraData) {
    const { position, rotation } = cameraData;
    if (!this.last_position) this.last_position = {};
    for (let key in position) {
      this.controlCamera.position[key] = position[key];
    }

    for (let key in rotation) {
      this.controlCamera.rotation[key] = rotation[key];
    }
  }

  setCameraPosition(position, target) {
    this.resetCameraPosition();
    if (target) {
      this.target = target;
      this.camera.lookAt(
        target.position.x,
        target.position.y,
        target.position.z,
      );
    }
    this.controls.enablePan = false;
    const { x, y, z } = this.camera.position;
    this.camera.updateCameraPosition({
      x: position.x || x,
      y: position.y || y,
      z: position.z || z,
    });
    this.updateCameraAttributes = this.updateCameraUserControl;
  }

  setCameraPositionForMemoryDriving(position, target) {
    const { x, y, z } = this.camera.position;
    if (target) {
      this.target = target;
      this.camera.lookAt(
        target.position.x,
        target.position.y,
        target.position.z,
      );
    }
    this.controls.enablePan = true;
    this.camera.updateCameraPosition({
      x: position.x || x,
      y: position.y || y,
      z: position.z || z,
    });
    this.updateCameraAttributes = this.updateCameraUserControl;
  }


  // 创建相机到自车8个顶点的射线 --- 用于自车被遮挡时的处理
  createCameraToCarRay() {
    // 获取物体的边界框
    const boundingBox = new THREE.Box3().setFromObject(this.ego_car_render.car);
    // 可查看边界框辅助线
    // const helperBox3 = new THREE.Box3Helper(boundingBox);
    // this.scene.add(helperBox3);
    // 缩小边界框范围, 紧贴自车模型, 减小相交误差
    boundingBox.min.x += 0.3;
    boundingBox.min.y += 0.3;
    boundingBox.min.z += 0.3;
    boundingBox.max.x -= 0.3;
    boundingBox.max.y -= 0.3;
    boundingBox.max.z -= 0.3;
    // 获取边界框的最小和最大点
    const minPoint = boundingBox.min;
    const maxPoint = boundingBox.max;
    // 计算八个顶点的位置 --- 目前只需要自车后下方两个顶点坐标
    const vertices = [
      new THREE.Vector3(minPoint.x, minPoint.y, minPoint.z),
      // new THREE.Vector3(minPoint.x, minPoint.y, maxPoint.z),
      new THREE.Vector3(minPoint.x, maxPoint.y, minPoint.z),
      // new THREE.Vector3(minPoint.x, maxPoint.y, maxPoint.z),
      // new THREE.Vector3(maxPoint.x, minPoint.y, minPoint.z),
      // new THREE.Vector3(maxPoint.x, minPoint.y, maxPoint.z),
      // new THREE.Vector3(maxPoint.x, maxPoint.y, minPoint.z),
      // new THREE.Vector3(maxPoint.x, maxPoint.y, maxPoint.z),
    ];
    this.raycasters = [];
    // 输出顶点的位置
    vertices.forEach((vertex) => {
      const raycaster = new THREE.Raycaster();
      // 获取相机到顶点之间的距离
      const distanceToVertex = this.camera.position.distanceTo(vertex);
      // 设置射线的最大长度为相机到顶点的距离
      raycaster.far = distanceToVertex;
      this.raycasters.push([raycaster, vertex]);
    });
  }

  // HACK: 只处理有灯光且在自车后方同一车道的遮挡物 --- 后期可根据实际需求调整需要处理的遮挡物
  filterModels(models) {
    return models.filter(
      (model) =>
        model.uuid &&
        model.userData.lightData &&
        model.position.x < 0 &&
        model.position.y > -2 &&
        model.position.y < 2,
    );
  }

  // 更新自车遮挡处理函数
  updateEgoCarBlocked() {
    if (!this.intersectsModels) return;
    this.resetEgoCarBlocked();
    const models = this.filterModels(this.scene.children);
    // 遍历顶点数据 - 计算每个顶点的遮挡情况
    for (let i = 0; i < this.raycasters.length; i++) {
      const [raycaster, vertex] = this.raycasters[i];

      // 更新射线发射器的位置和方向
      raycaster.set(
        this.camera.position,
        vertex.clone().sub(this.camera.position).normalize(),
      );

      // 获取相机到顶点之间的距离
      const distanceToVertex = this.camera.position.distanceTo(vertex);
      // 设置射线的最大长度为相机到顶点的距离
      raycaster.far = distanceToVertex;
      const intersects = raycaster.intersectObjects(models, true);
      // 检查是否已经存在相同的交点
      if (intersects.length > 0) {
        const intersectModels = intersects.map((intersect) =>
          this.findObjParent(intersect.object),
        );
        const models = this.filterModels(intersectModels);
        this.intersectsModels.push(...models);
      }
    }

    // 过滤重复 model
    this.intersectsModels = Array.from(
      new Map(
        this.intersectsModels.map((model) => [model.uuid, model]),
      ).values(),
    );

    // 将遮挡物设为半透明
    this.intersectsModels.forEach((model) => {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = 0.5;
        }
      });
    });
  }
}


```