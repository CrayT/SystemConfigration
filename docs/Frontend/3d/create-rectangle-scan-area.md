> 在自动驾驶可视化中，车辆沿轨迹行驶时，需要可视化车体外边框行驶的扫描区域，车模轨迹以后轴中心为中心，前轮为导向轮，在此规则下，车体边框扫描区域不太容易计算，尤其要求高实时性时，
在这种情况下，可以以离散化后的轨迹点为原点，分别渲染多个外框mesh，相互叠加后就是扫描区域，此方法可以有效提高渲染效率，不用计算扫描区域的多边形边界
但是缺点是无法透明化该区域，因为是叠加处理的。

```typescript
export type SweepType = {
  color: ColorType;
  width?: number;
  height?: number;
  z: number; // 线的垂直高度,默认在0附近
  polyline?: PointType[]; // 组成线的坐标点
};

export type ColorType = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type PointType = {
  x: number;
  y: number;
  theta: number;
};
interface ISweepData {
  data: SweepType[];
  topic: string;
  type: string;
}

function update(data: ISweepData) {

    try {

      data.data.forEach((data, i) => {
        if (!data.polyline?.length || data.polyline.length < 2) return;

        // 自车轨迹线 需要做特殊处理
        const path = data.polyline;
        const cleanPath = getFilterPath(path);
        if (cleanPath.length < 2) return;
        const params = CarRender.carConfig.vehicleParams.params();
        const bufferGeo = new THREE.PlaneBufferGeometry(
          params.vehicleLength,
          params.vehicleWidth,
        );
        const bufferMat = new THREE.MeshBasicMaterial({
          color: 0xffa500,
        });
        // InstancedMesh批量渲染
        const instanceMesh = new THREE.InstancedMesh(
          bufferGeo,
          bufferMat,
          cleanPath.length,
        );
        cleanPath.forEach((point, index) => {
          const m = new THREE.Matrix4();
          const result = getVehicleCenterXY(
            point.x,
            point.y,
            point.z,
          );
          m.makeRotationZ(point.z);
          m.setPosition(result.x, result.y, 0.0001 * index);
          instanceMesh.setMatrixAt(index, m);
        });
        // 放到地下，防止遮挡其他元素
        instanceMesh.position.setZ(-0.1);
        this.scene_.add(instanceMesh);
        this.obj_.push(instanceMesh);
        this.setUserData(instanceMesh);
      });
    } catch (e) {
      console.error("Render sweep polygon failed!", e);
    }
    return true;
  }

function getFilterPath(path: PointType[]) {
  if (path.length < 2) return [];
  const direction = new THREE.Vector2();
  const result: THREE.Vector3[] = [];
  const currentP = new THREE.Vector3(path[0].x, path[0].y, path[0].theta);
  const nextP = new THREE.Vector3(path[1].x, path[1].y, path[1].theta);
  // 跳过距离过近的点
  path.forEach((point) => {
    nextP.set(point.x, point.y, point.theta);
    direction.set(nextP.x - currentP.x, nextP.y - currentP.y);

    if (direction.length() < 0.05) return;

    result.push(currentP.clone());
    currentP.copy(nextP);
  });
  const last = path[path.length - 1];
  result.push(new THREE.Vector3(last.x, last.y, last.theta));

  return result;
}

const fixNum = (val: number, fixed = 3) => Number(val.toFixed(fixed));

class VehicleParams {
    /** 车长 */
    private vehicleLength: number,
    /** 车宽 */
    private vehicleWidth: number,
    /** 前悬 */
    private frontOverhang: number,
    /** 后悬 */
    private rearOverhang: number,
    getVehicleCenterXY(
        x: number,
        y: number,
        rad: number,
        scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
    ) {
        const { rearOverhang, vehicleLength } = this;
        const deltaVertical = fixNum(vehicleLength / 2 - rearOverhang) / scale.x;
        const coord_fixed = 15;

        const vehicleCenterX = fixNum(
        x + deltaVertical * Math.cos(rad),
        coord_fixed,
        );

        const vehicleCenterY = fixNum(
        y + deltaVertical * Math.sin(rad),
        coord_fixed,
        );

        return {
        x: vehicleCenterX,
        y: vehicleCenterY,
        };
    }
}

```