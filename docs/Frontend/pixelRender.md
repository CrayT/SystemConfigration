### threejs贴图方式

方法一:
1，采样方式1: 最近邻采样，`NearestFilter` :
    其原理是根据片元的纹理坐标，选择最近的纹理像素值作为采样结果，产生像素化的效果，放大时可保持原始贴图的像素感，边缘比较锐利；
优点：
    - 计算简单，无需加权计算；
缺点:
    - 可能导致图像边缘出现锯齿状(片元可能覆盖多个像素点)；
主要应用场景：
    - 3D游戏中的材质贴图
    - 实时渲染的卡通风格渲染；

```javascript
texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;
```

2，采样方式2: 线性采样, `LinearFilter`, 为`magFilter`的默认值：
    采用周围四个像素的加权平均值，效果较平滑，但计算量大，放大时有平滑效果；

3,  `LinearMipmapLinearFilter`，为`minFilter`的默认值
    使用`mipmapping`技术，通过三次线性过滤平滑纹理，从而在缩小纹理时提供更清晰自然的显示效果, 在不同距离下都能提供最佳的纹理质量。
4，`LinearMipmapNearestFilter`: 使用`mipmapping`和线性插值, 提供比 `THREE.NearestMipmapLinearFilter` 更高的质量，但可能比 THREE.LinearMipmapLinearFilter 略微模糊
5，`NearestMipmapNearestFilter`：使用`mipmapping`和最近邻插值，适用于快速渲染且质量要求不高场景；
6，`NearestMipmapLinearFilter`: 使用`mipmapping`和线性插值，提供比 `THREE.NearestFilter` 更好的质量，但可能比 `THREE.LinearMipmapLinearFilter` 略微模糊;


另:
    `texture.minFilter`: 用于控制当纹理缩小时，即被映射到比其本身更小的区域时采用的过滤方式，默认为`LinearMipmapLinearFilter`；
    `texture.magFilter`: 用于控制当纹理放大时，如何对问题进行采样，决定了放大时入股哦计算像素颜色值；


方法二:
将图片逐像素渲染到3d mesh上, 每个像素映射为0.1*0.1的物理空间，逐个三角化,改方式虽然也能实现，但只是纯手工实现，不建议使用：  

```javascript

const start = performance.now();
// 51.2米表示512*512像素，一个像素表示0.1米*0.1米物理空间
const { id, width, height, data, position, rotation, opacity } = imageData;
let dataURL = "";
data.forEach((char) => (dataURL += String.fromCharCode(char)));
const base64image = "data:image/jpeg;base64," + btoa(dataURL);
let canvas = document.getElementById('testCanvas') as HTMLCanvasElement;
if(!canvas) {
    canvas =  document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = width * 10;
    canvas.height = height * 10;
    canvas.style.width = `${width * 10}px`;
    canvas.style.height = `${height * 10}px`;
    canvas.style.position = 'absolute';
    canvas.style.right = '10px';
    canvas.style.top = '10px';
    canvas.id = 'testCanvas';
}
function getImageData(imageData: Uint8ClampedArray, i: number, j: number, width: number, height: number) {
    return imageData.slice(i * width * 4 + j * 4, i * width * 4 + j * 4 + 5); // [r, g, b, a]
}

const image = new Image();
image.src = base64image;
image.onload = () => {
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0,0, 512, 512)
    ctx?.drawImage(image, 0, 0);
    
    const imageData = ctx?.getImageData(0, 0, 512,512);
    if(!imageData) return;
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
    vertexShader: `
    attribute vec4 color;
    varying vec4 vColor;

    void main() { 
        vColor = vec4(color.r, color.g, color.b, color.a);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: `
    varying vec4 vColor;
    void main() {
        gl_FragColor = vec4(vColor.xyz, 1);
    }
    `,
    });
    material.side = THREE.DoubleSide;
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array((512) * (512) * 4 * 4), 4));
    const colorArray = geometry.getAttribute('color');
    
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array((512) * (512) * 3 * 4), 3));
    const posArray = geometry.getAttribute('position');

    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(512 * 512 * 2 * 3), 1));
    const indexArray = geometry.getIndex()!;

    let posIndex = 0;
    let colorIndex = 0;
    let index = 0;
    for(let i = 0; i < 512; i++) {
    for(let j = 0; j < 512; j++) {
        // 构造4个顶点，对应每个角点的周边四个像素
        posArray.setXYZ(posIndex++, i * 0.1, j * 0.1, 0.01);
        posArray.setXYZ(posIndex++, i * 0.1 + 0.1, j * 0.1, 0.01);
        posArray.setXYZ(posIndex++, i * 0.1, j * 0.1 + 0.1, 0.01);
        posArray.setXYZ(posIndex++, i * 0.1 + 0.1, j * 0.1 + 0.1, 0.01);

        const rgba = getImageData(imageData.data, i, j, 512, 512);
        const r = rgba[0] / 255;
        const g = rgba[1] / 255;
        const b = rgba[2] / 255;
        const a = rgba[3] / 255;
        colorArray.setXYZW(colorIndex++, r, g, b, a);
        colorArray.setXYZW(colorIndex++, r, g, b, a);
        colorArray.setXYZW(colorIndex++, r, g, b, a);
        colorArray.setXYZW(colorIndex++, r, g, b, a);

        const start = (i * 512 + j) * 4;

        indexArray.setX(index++, start);
        indexArray.setX(index++, start + 3);
        indexArray.setX(index++, start + 1);

        indexArray.setX(index++, start);
        indexArray.setX(index++, start + 2);
        indexArray.setX(index++, start + 3);


    }
    }
    if(this.tmp) {
    this.tmp.geometry.dispose();
    (this.tmp.material as THREE.Material).dispose();
    this.scene_.remove(this.tmp);
    }
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.time = Date.now();
    this.tmp  = mesh;
    this.scene_.add(mesh);
    (window as any).tmp = this.tmp;
    console.log('time:', performance.now() - start);
}
```