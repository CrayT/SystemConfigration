### 创建线条

#### Mesh

```javascript
/**
 * 绘制实线、虚线、双线，多段线段组成的一组线，交接处用index处理
 */
import inherits from "inherits";
import getNormals from "polyline-normals";
const VERTS_PER_POINT = 4;

export default function Line2D(THREE) {
  function LineMesh(path, lengthArray, opt) {
    if (!(this instanceof LineMesh)) {
      return new LineMesh(path, lengthArray, opt);
    }
    THREE.BufferGeometry.call(this);

    opt = opt || {};

    this.setAttribute("position", new THREE.BufferAttribute(undefined, 3));
    this.setAttribute("lineNormal", new THREE.BufferAttribute(undefined, 2));
    this.setAttribute("lineMiter", new THREE.BufferAttribute(undefined, 1));

    if (opt.ratio) {
      this.setAttribute("lineRatio", new THREE.BufferAttribute(undefined, 1));
    }
    if (opt.distances) {
      this.setAttribute(
        "lineDistance",
        new THREE.BufferAttribute(undefined, 1),
      );
    }
    if (typeof this.setIndex === "function") {
      this.setIndex(new THREE.BufferAttribute(undefined, 1));
    } else {
      this.setAttribute("index", new THREE.BufferAttribute(undefined, 1));
    }
    this.update(path, lengthArray);
  }

  inherits(LineMesh, THREE.BufferGeometry);

  function getPtDist(pt1, pt2) {
    return Math.sqrt(
      Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2),
    );
  }

  LineMesh.prototype.update = function (path, lengthArray) {
    path = path || [];

    let attrPosition = this.getAttribute("position");
    let attrNormal = this.getAttribute("lineNormal");
    let attrMiter = this.getAttribute("lineMiter");
    let attrDistance = this.getAttribute("lineDistance");
    let attrIndex =
      typeof this.getIndex === "function"
        ? this.getIndex()
        : this.getAttribute("index");

    let indexCount = Math.max(
      0,
      (path.length - 1) * 6 - (lengthArray.length - 1) * 6,
    );
    let count = path.length * VERTS_PER_POINT;
    if (
      !attrPosition.array ||
      path.length !== attrPosition.array.length / 3 / VERTS_PER_POINT
    ) {
      attrPosition.array = new Float32Array(count * 3);
      attrNormal.array = new Float32Array(count * 2);
      attrMiter.array = new Float32Array(count);
      attrIndex.array = new Uint16Array(indexCount);

      if (attrDistance) {
        attrDistance.array = new Float32Array(count);
      }
    }

    if (undefined !== attrPosition.count) {
      attrPosition.count = count;
    }
    attrPosition.needsUpdate = true;

    if (undefined !== attrNormal.count) {
      attrNormal.count = count;
    }
    attrNormal.needsUpdate = true;

    if (undefined !== attrMiter.count) {
      attrMiter.count = count;
    }
    attrMiter.needsUpdate = true;

    if (undefined !== attrIndex.count) {
      attrIndex.count = indexCount;
    }
    attrIndex.needsUpdate = true;

    if (attrDistance) {
      if (undefined !== attrDistance.count) {
        attrDistance.count = count;
      }
      attrDistance.needsUpdate = true;
    }

    let index = 0;
    let c = 0;
    let dIndex = 0;
    let indexArray = attrIndex.array;
    let cur_length = 0;
    let lengthIndex = 0;
    path.forEach(function (point, pointIndex, list) {
      let i = index;
      if (lengthArray.indexOf(i / 4 + 1) === -1) {
        indexArray[c++] = i + 2;
        indexArray[c++] = i + 3;
        indexArray[c++] = i + 4;
        indexArray[c++] = i + 4;
        indexArray[c++] = i + 3;
        indexArray[c++] = i + 5;
      }

      attrPosition.setXYZ(index++, point[0], point[1], 0);
      attrPosition.setXYZ(index++, point[0], point[1], 0);
      attrPosition.setXYZ(index++, point[0], point[1], 0);
      attrPosition.setXYZ(index++, point[0], point[1], 0);

      if (attrDistance) {
        let d = 0;
        if (pointIndex - lengthIndex > 0) {
          d = getPtDist(point, list[pointIndex - 1]);
        }
        cur_length += d;
        attrDistance.setX(dIndex++, cur_length);
        attrDistance.setX(dIndex++, cur_length);
        attrDistance.setX(dIndex++, cur_length);
        attrDistance.setX(dIndex++, cur_length);
        if (lengthArray.indexOf(pointIndex + 1) !== -1) {
          cur_length = 0;
          lengthIndex = pointIndex + 1;
        }
      }
    });

    let nIndex = 0;
    let mIndex = 0;

    const newNormals = [];
    lengthArray.forEach((len, index) => {
      const start = index === 0 ? 0 : lengthArray[index - 1];
      const tmpNormals = getNormals(path.slice(start, len), false); // false means not closed
      newNormals.push(...tmpNormals);
    });
    newNormals.forEach(function (n, index) {
      let norm_cur = n[0];
      let norm_last = norm_cur;
      if (index > 0) {
        norm_last = newNormals[index - 1][0];
      }
      let miter = 1;
      attrNormal.setXY(nIndex++, norm_last[0], norm_last[1]);
      attrNormal.setXY(nIndex++, norm_last[0], norm_last[1]);
      attrNormal.setXY(nIndex++, norm_cur[0], norm_cur[1]);
      attrNormal.setXY(nIndex++, norm_cur[0], norm_cur[1]);

      attrMiter.setX(mIndex++, -miter);
      attrMiter.setX(mIndex++, miter);
      attrMiter.setX(mIndex++, -miter);
      attrMiter.setX(mIndex++, miter);
    });
  };

  return LineMesh;
}

```

```javascript
/**
 * 颜色渐变线，多段线段组成的一组线，交接处用index处理
 */
import inherits from 'inherits';
import getNormals from 'polyline-normals';
const VERTS_PER_POINT = 2;

export default function VertexColorLine2D (THREE) {
  function LineMesh (path, lengthArray, opt) {
    if (!(this instanceof LineMesh)) {
      return new LineMesh(path, lengthArray, opt);
    }
    THREE.BufferGeometry.call(this);

    if (Array.isArray(path)) {
      opt = opt || {};
    } else if (typeof path === 'object') {
      opt = path;
      path = [];
    }

    opt = opt || {};

    this.setAttribute('position', new THREE.BufferAttribute(undefined, 3));
    this.setAttribute('lineNormal', new THREE.BufferAttribute(undefined, 2));
    this.setAttribute('customColor', new THREE.BufferAttribute(undefined, 4));

    if (typeof this.setIndex === 'function') {
      this.setIndex(new THREE.BufferAttribute(undefined, 1));
    } else {
      this.setAttribute('index', new THREE.BufferAttribute(undefined, 1));
    }
    this.update(path, lengthArray);
  }

  inherits(LineMesh, THREE.BufferGeometry);

  LineMesh.prototype.update = function (path, lengthArray) {
    path = path || [];
    let attrPosition = this.getAttribute('position');
    let attrNormal = this.getAttribute('lineNormal');
    let attrCustomColor = this.getAttribute('customColor');
    let attrIndex = typeof this.getIndex === 'function' ? this.getIndex() : this.getAttribute('index');

     // 去除交接点处的三角形数量
    let indexCount = Math.max(0, (path.length - 1 ) * 6 - (lengthArray.length - 1) * 6);
    let count = path.length * VERTS_PER_POINT;
    if (!attrPosition.array ||
      (path.length !== attrPosition.array.length / 3 / VERTS_PER_POINT)) {
      attrPosition.array = new Float32Array(count * 3);
      attrNormal.array = new Float32Array(count * 2);
      attrIndex.array = new Uint16Array(indexCount);
      attrCustomColor.array = new Float32Array(count * 4);
    }

    if (undefined !== attrPosition.count) {
      attrPosition.count = count;
    }
    attrPosition.needsUpdate = true;

    if (undefined !== attrCustomColor.count) {
      attrCustomColor.count = count;
    }
    attrCustomColor.count = count;

    if (undefined !== attrNormal.count) {
      attrNormal.count = count;
    }
    attrNormal.needsUpdate = true;

    if (undefined !== attrIndex.count) {
      attrIndex.count = indexCount;
    }
    attrIndex.needsUpdate = true;

    let index = 0;
    let c = 0;
    let indexArray = attrIndex.array;

    path.forEach(function (point) {
      let i = index;
      // ignore joint point
      if(lengthArray.indexOf(i / 2 + 1)  === -1) {
        indexArray[c++] = i;
        indexArray[c++] = i + 1;
        indexArray[c++] = i + 2;
        indexArray[c++] = i + 2;
        indexArray[c++] = i + 1;
        indexArray[c++] = i + 3; 
      }
      attrCustomColor.setXYZW(index, point[2], point[3], point[4], point[5]);
      attrPosition.setXYZ(index++, point[0], point[1], 0);
      attrCustomColor.setXYZW(index, point[2], point[3], point[4], point[5]);
      attrPosition.setXYZ(index++, point[0], point[1], 0);
    });

    let nIndex = 0;
    const newNormals = [];
    lengthArray.forEach((len, index) => {
      const start = index === 0 ? 0 : lengthArray[index - 1];
      const tmpNormals = getNormals(path.slice(start, len), false); // false means not closed
      newNormals.push(...tmpNormals); 
    });
    newNormals.forEach(function (n) {
      let norm = n[0];
      attrNormal.setXY(nIndex++, -norm[0], -norm[1]);
      attrNormal.setXY(nIndex++, norm[0], norm[1]);
    });
  };

  return LineMesh;
}
```

```javascript
// 上面function中的lengthArray的获取方法
function getArrayLength(array: number[][][]) {
  const tLengthArray: number[] = [];
  array.forEach((data) => tLengthArray.push(data.length));
  const lengthArray: number[] = [];
  tLengthArray.reduce((before, after) => {
    before += after;
    lengthArray.push(before);
    return before;
  }, 0);

  return lengthArray;
}
```

#### Material

- shader

```javascript
// 单色实线
function SolidShader(option: any = {}) {
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone({
      thickness: { value: asNumber(option.thickness, 0.1) },
      opacity: { value: asNumber(option.opacity, 1.0) },
      diffuse: { value: new THREE.Color(option.diffuse) },
    }),
    vertexShader: `
      uniform float thickness;
      attribute float lineMiter;
      attribute vec2 lineNormal;

      void main() { 
        vec3 pointPos = position.xyz + vec3(lineNormal * thickness / 2.0 * lineMiter, 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 diffuse;
      uniform float opacity;
      void main() {
        gl_FragColor = vec4(diffuse, opacity);
      }
    `,
  });
  material.side = THREE.BackSide;
  material.transparent = true;
  return material;
}
const mat = SolidShader({
    diffuse: defaultColor.clone().getHex(),
    thickness: width,
    opacity: 0.6,
});


// 单色虚线
function DashedShader(option: any = {}) {
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone({
      thickness: { value: asNumber(option.thickness, 0.1) },
      opacity: { value: asNumber(option.opacity, 1.0) },
      diffuse: { value: new THREE.Color(option.diffuse) },
      dashSteps: { value: asNumber(option.dashSteps, 4) },
      dashDistance: { value: asNumber(option.dashDistance, 2) },
    }),
    vertexShader: `
      uniform float thickness;
      attribute float lineMiter;
      attribute vec2 lineNormal;
      attribute float lineDistance;
      varying float lineU;

      void main() { 
        lineU = lineDistance;
        vec3 pointPos = position.xyz + vec3(lineNormal * thickness / 2.0 * lineMiter, 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);
      }
    `,
    fragmentShader: `
      varying float lineU;

      uniform vec3 diffuse;
      uniform float opacity;
      uniform float dashSteps;
      uniform float dashSmooth;
      uniform float dashDistance;

      void main() {
        float lineUMod = mod(lineU, dashSteps + dashDistance);
        float dash = 1.0 - step(dashDistance, lineUMod);
        gl_FragColor = vec4(diffuse * vec3(dash), opacity * dash);
      }
    `,
  });
  material.side = THREE.BackSide;
  material.transparent = true;
  return material;
}


// 纯色双线
export function DoubleShader(option: any = {}) {
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone({
      thickness: { value: asNumber(option.thickness * 3, 0.3) },
      opacity: { value: asNumber(option.opacity, 1.0) },
      diffuse: { value: new THREE.Color(option.diffuse) },
      dashSteps: { value: asNumber(option.dashSteps, 3) },
      dashDistance: { value: asNumber(option.dashDistance, 2) },
      leftDashed: { value: asNumber(option.leftDashed, 0) },
      rightDashed: { value: asNumber(option.rightDashed, 0) },
    }),
    vertexShader: `
      uniform float thickness;
      attribute float lineMiter;
      attribute vec2 lineNormal;
      attribute float lineDistance;
      varying float lineU;
      varying float lineV;

      void main() { 
        lineV = sign(lineMiter);
        lineU = lineDistance;
        vec3 pointPos = position.xyz + vec3(lineNormal * thickness / 2.0 * lineMiter, 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);
      }
    `,
    fragmentShader: `
      varying float lineV;
      varying float lineU;

      uniform vec3 diffuse;
      uniform float opacity;
      uniform float dashSteps;
      uniform float dashSmooth;
      uniform float dashDistance;
      uniform float leftDashed;
      uniform float rightDashed;

      void main() {
        float lineUMod = mod(lineU, dashSteps + dashDistance);
        float dash = 1.0 - step(dashDistance, lineUMod);
        float gap_ratio = step(0.33, abs(lineV));
        float center_mask = step(0.0, lineV);
        float side_mask = center_mask * leftDashed + (1.0 - center_mask) * rightDashed ;
        float final_dash = min(dash + side_mask, 1.0) * gap_ratio;
        gl_FragColor = vec4(diffuse * vec3(final_dash), opacity * final_dash);
      }
    `,
  });
  material.side = THREE.BackSide;
  material.transparent = true;
  return material;
}

// 单根渐变色
function newCustomizedShader(option: any = {}) {
  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone({
      thickness: { value: asNumber(option.thickness, 0.1) },
      opacity: { value: asNumber(option.opacity, 1.0) },
      diffuse: { value: new THREE.Color(option.diffuse) },
    }),
    vertexShader: `
      uniform float thickness;
      attribute vec2 lineNormal;
      attribute vec4 customColor;
      varying vec4 vColor;

      void main() { 
        vColor = vec4(customColor.r, customColor.g, customColor.b, customColor.a);
        vec3 pointPos = position.xyz + vec3(lineNormal * thickness / 2.0, 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pointPos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec4 vColor;
      void main() {
        gl_FragColor = vec4(vColor.xyz, vColor.a);
      }
    `,
  });
  material.side = THREE.DoubleSide;
  material.transparent = true;
  return material;
}


```

