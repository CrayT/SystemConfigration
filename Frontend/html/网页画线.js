RoomConnector2DWeb = function () {
    RoomConnector2D.call(this);
};
RoomConnector2DWeb.prototype = new RoomConnector2D();
RoomConnector2DWeb.prototype.onInit = function () {
    var _this = this;
    // this.serverManger = new ServerManger();
    // this.serverManger.triggerServerGetImg();

    var lastSaveTime = DateUtil.getLocalTime(_this.stereoHouse.lastSaveTime);
    if (!_this.stereoHouse.lastSaveTime) lastSaveTime = "";
    $(DomElements.lastSaveTime).text(lastSaveTime);
};

RoomConnector2DWeb.prototype.changeMouseCursor = function (curser) {
    var domElement = this.renderer.domElement;
    if (typeof curser === 'string') {
        if (curser.indexOf(".cur") > 0) {
            $(domElement).css('cursor', 'url(textures/' + curser + '), default');
        } else {
            $(domElement).css('cursor', curser);
        }
    } else {
        $(this.renderer.domElement).css('cursor', 'default');
    }
};

RoomConnector2DWeb.prototype.onInitUI = function () {
    var _this = this;

    DomElements.closeCalibrate.onclick = function(){
        document.getElementById("verticalBarBox").style.display = 'none';
        document.getElementById("verticalBarBox2").style.display = 'none';
        DomElements.closeCalibrate.style.display = 'none';
        let button = document.getElementById('verticalCalibrateDisplay');
        button.style.background = 'rgba(255,255,255,1)';
        button.style.color = 'rgba(0,0,0,1)';
    };
    DomElements.verticalCalibrateDisplay.onclick = function(){
        if (document.getElementById('closeCalibrate').style.display === 'block'){
            DomElements.verticalCalibrateDisplay.style.outline = 'none';
            DomElements.verticalCalibrateDisplay.style.background = 'rgba(255,255,255,1)';
            DomElements.verticalCalibrateDisplay.style.color = 'rgba(0,0,0,1)';
            document.getElementById("verticalBarBox").style.display = 'none';
            document.getElementById("verticalBarBox2").style.display = 'none';
            document.getElementById('closeCalibrate').style.display = 'none';
        }
        else{
            document.getElementById("verticalBarBox").style.display = 'block';
            document.getElementById("verticalBarBox2").style.display = 'block';
            document.getElementById('closeCalibrate').style.display = 'block';
            DomElements.verticalCalibrateDisplay.style.background = 'rgba(60,179,113,1)';
            DomElements.verticalCalibrateDisplay.style.color = 'rgba(255,255,255,1)';
            DomElements.verticalCalibrate.click();
        }
    };
    //关闭垂直矫正;
    DomElements.verticalCalibrateClose.onclick = function (){
        DomElements.verticalCalibrateClose.style.outline = 'none';
        document.getElementById("verticalBarBox").style.display = 'none';
        document.getElementById("verticalBarBox2").style.display = 'none';
        document.getElementById('closeCalibrate').style.display = 'none';
        DomElements.verticalCalibrateClose.style.display = 'none';
        DomElements.verticalCalibrateDisplay.style.display = 'none';
        DomElements.halfScreen.click();
        //_this.closeVerticalCalibrate();
    };
    //垂直矫正。
    DomElements.verticalCalibrate.onclick = function () {
        console.log('调整前gyRoInfo：', _this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo);
        let originGyRoInfo = _this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo;
        let originX = originGyRoInfo.x;
        let originZ = originGyRoInfo.z;
        DomElements.panoToFull.click();
        DomElements.halfScreen.style.display= 'none';
        DomElements.verticalCalibrateClose.style.display = 'table';
        DomElements.verticalCalibrateDisplay.style.display = 'table';
        DomElements.verticalCalibrateDisplay.style.background = 'rgba(60,179,113,1)';
        DomElements.verticalCalibrateDisplay.style.color = 'rgba(255,255,255,1)';
        DomElements.closeCalibrate.style.display = 'block';

        let barBox = document.getElementById("verticalBarBox");
        let barColor = document.getElementById("verticalBarColor"); //
        let barBlock = document.getElementById("verticalBarBlock"); //

        let barBox2 = document.getElementById("verticalBarBox2");
        let barColor2 = document.getElementById("verticalBarColor2"); //
        let barBlock2 = document.getElementById("verticalBarBlock2"); //

        barBox.style.display = 'block';
        barBox2.style.display = 'block';
        document.getElementById('closeCalibrate').style.display = 'block';
        let startWidth  = 140; //
        barBlock.style.left = startWidth + 'px';

        let startX; // 开始按下的位置
        let  disWidth = 0, disWidth2 = 0; //拖动宽度
        let rotationX, rotationZ;
        let block1 = false, block2 = false; //标记两个滑块状态。
        let degreeOfDrag1, degreeOfDrag2;
        let finalRotation = {};
        //每次进入，将cube根据hostSpotData的rotation放置。
        _this.activeGroup.stereoRoom.hotSpots[0].FrameRotation = 0;
        _this.activeGroup.stereoRoom.PanoramaImages[0].FrameRotation = 0;
        app.panoramaManager.setCubeRotation(app.panoramaManager.panoramaCube, _this.activeGroup.stereoRoom.hotSpots[0]);
        let mMove = function(event){
            event.preventDefault();
            let  mouseX = event.clientX;  // 鼠标的在窗口的位置
            let  dis = mouseX - startX ;  // 计算鼠标在窗口的移动距离
            disWidth = startWidth + dis ;
            if( disWidth > 280 ){
                disWidth = 280;
            }
            if(disWidth < 0){
                disWidth = 0;
            }
            barBlock.style.left = disWidth + "px";
            degreeOfDrag1 = (disWidth - startWidth) / 30;
            rotationX = _this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo.z;
            if (disWidth != 0 && disWidth != 280){
                finalRotation.Rotation = new THREE.Vector3(degreeOfDrag1 + originX, 0, originZ);
                app.panoramaManager.setCubeRotation(app.panoramaManager.panoramaCube, finalRotation);
            }
        };
        barBox.addEventListener("mousedown",function(event){
            block1 = true;
            //console.log('第一个调整前gyroInfo：',_this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo, _this.activeGroup.stereoRoom.hotSpots[0].Rotation)
            event.preventDefault(); // 阻止默认事件
            startX = event.clientX;
            let mx = event.offsetX;
            barBlock.style.left = mx + "px";
            startWidth = mx;
            barBox.addEventListener("mousemove", mMove);
        });
        document.addEventListener("mouseup",function(event){
            if (block1){
                startWidth =  barColor.offsetWidth;
                let ro = finalRotation.Rotation;
                _this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo = ro;
                _this.activeGroup.stereoRoom.hotSpots[0].Rotation = ro;
                app.panoramaManager.setCubeRotation(app.panoramaManager.panoramaCube, _this.activeGroup.stereoRoom.hotSpots[0]);
                originX = _this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo.x; //更新
                //console.log('第一个调整后gyroInfo：',_this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo, _this.activeGroup.stereoRoom.hotSpots[0].Rotation);
                //console.log('activeGroup',_this.activeGroup.stereoRoom.hotSpots[0]);
                //console.log('pano:',_this.activeGroup.stereoRoom.PanoramaImages[0])
                //console.log('app.panoramaManager.panoramaCube',app.panoramaManager.panoramaCube.rotation);
            }
            block1 = false;
            barBox.removeEventListener("mousemove", mMove);
        });

        let startWidth2  = 140; // 色块初始的宽度
        barBlock2.style.left = startWidth2 + 'px';
        //console.log('第二个滑块');
        let startX2 ; // 鼠标开始按下的位置
        let mMove2 = function(event){
            event.preventDefault(); // 阻止默认事件
            let  mouseX2 = event.clientX;  // 鼠标的在窗口的位置
            let  dis2 = mouseX2 - startX2 ;  // 计算鼠标在窗口的移动距离
            disWidth2 = startWidth2 + dis2 ;
            if( disWidth2 > 280 ){
                disWidth2 = 280;
            }
            if(disWidth2 < 0){
                disWidth2 = 0;
            }
            barBlock2.style.left = disWidth2 + "px";
            degreeOfDrag2 = (disWidth2 - startWidth2) / 30;
            rotationZ = _this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo.x;
            if (disWidth2 != 0 && disWidth2 != 280){
                finalRotation.Rotation = new THREE.Vector3(originX, 0, degreeOfDrag2 + originZ);
                app.panoramaManager.setCubeRotation(app.panoramaManager.panoramaCube, finalRotation);
            }
        };
        barBox2.addEventListener("mousedown",function(event){
            block2 = true;
            event.preventDefault(); // 阻止默认事件
            startX2 = event.clientX ; // 记录鼠标点下的开始x坐标（相对于窗口）
            let mx2 = event.offsetX;//
            barBlock2.style.left = mx2 + "px";//更新小方块位置
            startWidth2 = mx2;//更新色块初始的宽度
            barBox2.addEventListener("mousemove", mMove2);
        });
        document.addEventListener("mouseup",function(event){
            if (block2){
                //console.log('第二个滑块调整');
                startWidth2 =  barColor2.offsetWidth; //松开鼠标后，记录当前色块的宽度。
                let ro = finalRotation.Rotation;
                _this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo = ro;
                _this.activeGroup.stereoRoom.hotSpots[0].Rotation = ro;
                app.panoramaManager.setCubeRotation(app.panoramaManager.panoramaCube, _this.activeGroup.stereoRoom.hotSpots[0]);
                originZ = _this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo.z; //更新

                //console.log('第二个调整后gyroInfo：', _this.activeGroup.stereoRoom.PanoramaImages[0].GyroInfo, _this.activeGroup.stereoRoom.hotSpots[0].Rotation);
            }
            block2 = false;
            barBox2.removeEventListener("mousemove", mMove2);
        });
        //_this.verticalCalibration();
    };
};

RoomConnector2DWeb.prototype.drawPanoImagAndButton = function(){
    let _this = this;
    let activePanoramaImages = _this.activeGroup.stereoRoom.PanoramaImages //当前选中房间的全景图
    let activeRoomPanoramaImageName = [activePanoramaImages[0].ImagePath]; //当前选中房间的全景图名称。
    let PanoramaRotation = activePanoramaImages[0].Rotation;
    let PanoImagePath = 'http://vrhouse.oss-cn-shanghai.aliyuncs.com/' + _this.activeGroup.stereoRoom.House.ID + "/PanoramaImages/" + activeRoomPanoramaImageName;
    //console.log('url:' + PanoImagePath);
    //console.log(window.innerWidth, window.innerHeight);

    let canvas = document.getElementById("canvas");
    canvas.style.display='block';
    let widthScreen = document.documentElement.clientWidth; //屏幕可见区域宽高
    let heightScreen = document.documentElement.clientHeight;
    let canvasWidth = widthScreen - 100; //canvas居中。
    let canvasHeight = heightScreen - 120;
    canvas.width = canvasWidth; //设置canvas宽高，不能用style设置；
    canvas.height = canvasHeight;

    let img = new Image();
    let ctx = canvas.getContext('2d');
    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let closeButton = DomElements.verticalCalibrateClose;
        closeButton.style.display = "block"; //显示关闭按钮。
        let buttonPositionLeft = canvasWidth - 60 + "px";
        let buttonPositionTop = 60 + "px";
        closeButton.style.marginLeft = buttonPositionLeft;
        closeButton.style.marginTop = buttonPositionTop;

        let verticalHint = DomElements.verticalHint;
        let hintX = 50 + 5 + canvasWidth / 2 + "px";
        let hintY = canvasHeight - 5 + "px";
        verticalHint.style.display = 'table-cell'; //显示提示框，类型为table，否则div标签内文字无法垂直居中，同时inline-height设置与height相等。
        verticalHint.style.marginLeft = hintX;
        verticalHint.style.marginTop = hintY;

        let proceedButton = DomElements.verticalCalibrateProceed;
        proceedButton.style.display = "block"; //显示确认矫正按钮。
        let proceedButtonPositionLeft = 50 + canvasWidth / 2 + 320 + "px";
        let proceedButtonPositionTop = canvasHeight + 3 + "px";
        proceedButton.style.marginLeft = proceedButtonPositionLeft;
        proceedButton.style.marginTop = proceedButtonPositionTop;

        let lineAllDeleteHint = DomElements.lineAllDeleteHint;
        let lineAllDeleteHintX = canvasWidth / 2 - 300 + 50 - 5 + "px"; //canvas宽/2 - 提示框宽 - 边距。
        let lineAllDeleteHintY = canvasHeight - 5 + "px";
        lineAllDeleteHint.style.display = 'table-cell'; //显示提示框，类型为table，否则div标签内文字无法垂直居中，同时inline-height设置与height相等。
        lineAllDeleteHint.style.marginLeft = lineAllDeleteHintX;
        lineAllDeleteHint.style.marginTop = lineAllDeleteHintY;

        let lineAllDelete = DomElements.lineAllDelete;
        let lineAllDeleteX = canvasWidth / 2 - 300 + 50 - 5 + 20 + "px"; //canvas宽/2 - 提示框宽 + 边距 - 适当gap + 图标宽度。
        let lineAllDeleteY = canvasHeight + 5 + "px";
        lineAllDelete.style.display = 'table-cell'; //显示提示框，类型为table，否则div标签内文字无法垂直居中，同时inline-height设置与height相等。
        lineAllDelete.style.marginLeft = lineAllDeleteX;
        lineAllDelete.style.marginTop = lineAllDeleteY;

        let AIButton = DomElements.AICalibrate;
        AIButton.style.display = "block"; //显示AI矫正按钮。
        let AIButtonLeft =  canvasWidth / 2 - 120 +20 + "px"; //canvas - 按钮宽度 + 适当gap。
        let AIButtonTop = canvasHeight + 3 + "px";
        AIButton.style.marginLeft = AIButtonLeft;
        AIButton.style.marginTop = AIButtonTop;
    };
    img.src = PanoImagePath;
    return activePanoramaImages[0];
};


RoomConnector2DWeb.prototype.drawVerticalLines = function(){
    let _this = this;
    let line = {}; //存储一条线的两个端点Point1和Point2
    let lines = []; //存储所有线。
    let circles = []; //所有的端点集合；
    let flagPoint = true; //判断是点击一条线的第一个点还是第二个点；
    let canDrag = false; //控制是否选中点；
    let circleIndex = 0; //选中端点的索引值；
    let canvas = document.getElementById("canvasLine"); //在新画布上绘制垂线。
    canvas.style.display='block';
    let widthScreen = document.documentElement.clientWidth;
    let heightScreen = document.documentElement.clientHeight;
    let normalColor = '#00F5FF'; //端点和线段显示颜色，非选中颜色。
    let selectColor = '#FFFF00'; //选中后的激活颜色；
    let canvasWidth = widthScreen - 100; //canvas居中。
    let canvasHeight = heightScreen - 200;
    canvas.width = canvasWidth; //设置canvas宽高，不能用style设置；
    canvas.height = canvasHeight;
    let ctx = canvas.getContext('2d');

    function Point(x, y){ //定义点对象
        this.x = x;
        this.y = y;
    }
    function Circle(x, y){ //定义端点对象
        this.x = x;
        this.y = y;
        this.radius = 6;
        this.color = normalColor;
    }

    //获取鼠标点击的像素坐标
    canvas.onmousedown = function(e) {
        e = e || event;
        let clickX = e.clientX - canvas.offsetLeft;
        let clickY = e.clientY - canvas.offsetTop;
        //判断是不是点击到了端点:
        for (let i = 0; i < circles.length; i++) {
            let circle = circles[i];
            let distance = Math.sqrt(Math.pow(circle.x - clickX, 2) + Math.pow(circle.y - clickY, 2));
            if (distance <= circle.radius) { //鼠标点击点在当前端点内，点到端点，可拖动设置true。
                circleIndex = i;
                canDrag = true;
                return; //选中端点，返回,不在进行下面的绘制新点。
            }
        }
        //判断是不是点到了线:
        let gap = 10; //设置误差阈值。
        let lineSelectIndex; //选中线的下标。
        let flag = false; //控制是否选中线。
        for (let i = 0; i < lines.length; i++){
            let point1 = lines[i].Point1;
            let point2 = lines[i].Point2;
            let minX = Math.min(point1.x, point2.x);
            let maxX = Math.max(point1.x, point2.x);
            let minY = Math.min(point1.y, point2.y);
            let maxY = Math.max(point1.y, point2.y);

            if (point1.y === point2.y) { //水平线
                if ((clickX >= minX && clickX <= maxX) && (clickY >= minY - gap && clickY <= maxY + gap)) { //点击点在当前线段允许阈值范围内
                    flag = true; //打标记
                    lineSelectIndex = i;
                }
            }
            else if (point1.x === point2.x) { // 垂直线
                if ((clickY >= minY && clickY <= maxY) && (clickX >= minX - gap && clickX <= maxX + gap)) {
                    flag = true;
                    lineSelectIndex = i;
                }
            }
            else {
                if ((clickX >= minX && clickX <= maxX) && (clickY >= minY && clickY <= maxY)) {
                    let k = (point1.y - point2.y)/(point1.x - point2.x);
                    let distanceClick = Math.abs(k * clickX - clickY + point1.y - k*point1.x)/(Math.sqrt(1 + Math.pow(k, 2)));
                    if (distanceClick < gap){
                        flag = true;
                        lineSelectIndex = i;
                    }
                }
            }
            if (flag === true) {
                break; //选到线，跳出
            }
        }
        if (flag === true){ //根据选中的线重绘。
            //调用重新绘制方法；
            lineSelectAndDrawAgain(ctx, lines, circles, lineSelectIndex);
            lineSelectAndToDelete(ctx, lines, circles, lineSelectIndex);//选中线 高亮显示，显示删除按钮，删除线段。
            return;
        }
        //需要重绘canvas，恢复到正常状态。
        drawAgain(ctx, circles, lines);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (let i = 0; i < circles.length; i++){
            drawCircle(ctx, circles[i], circles[i].color);
        }
        for (let i = 0; i < lines.length; i++){ //重绘线条
            drawLine(ctx, lines[i], normalColor)
        }
        DomElements.singleLineDelete.style.display = "none"; //隐藏可能显示的删除按钮。

        //没有点到端点或线，根据坐标绘制端点和新线：
        let circleNow = new Circle(clickX, clickY); //生成点对象
        circles.push(circleNow); //记录当前点击点
        //绘制当前点击点圆圈：
        drawCircle(ctx, circleNow, circleNow.color)
        //连线：
        let pointNow = new Point(clickX, clickY); //创建新点
        if (Object.keys(line).length === 0 && flagPoint) {
            line.Point1 = new THREE.Vector2(pointNow.x, pointNow.y);
            flagPoint = false;
        }
        if (Object.keys(line).length === 1 && flagPoint) {
            line.Point2 = new THREE.Vector2(pointNow.x, pointNow.y);
            lines.push(line);
            line = {};
            flagPoint = false;
        }
        if (Object.keys(line).length === 0) {
            let lineThisTime = lines[lines.length - 1]; //当前画的线；
            drawLine(ctx, lineThisTime, normalColor);
        }
        flagPoint = true;
    };
    //判断鼠标是否开始拖动：然后开始实时重绘画布。
    canvas.onmousemove = function(e){
        if (canDrag === true){ //可以拖动
            DomElements.singleLineDelete.style.display = "none"; //隐藏可能显示的删除按钮。
            ctx.clearRect(0,0,canvas.width,canvas.height);
            let xPosition = e.clientX - canvas.offsetLeft; //获取鼠标位置
            let yPosition = e.clientY - canvas.offsetTop;

            circles[circleIndex].x = xPosition; //更新当前端点的坐标
            circles[circleIndex].y = yPosition;

            let lineIndex = parseInt(circleIndex/2); //取整，计算第几条线。
            if (circleIndex %2 === 0){ //拖动的是线的起点
                lines[lineIndex].Point1.x = xPosition; //更新当前起点的坐标
                lines[lineIndex].Point1.y = yPosition;
            }
            else{ //拖动的是线的终点
                lines[lineIndex].Point2.x = xPosition; //更新当前终点的坐标
                lines[lineIndex].Point2.y = yPosition;
            }
            for (let i = 0; i < circles.length; i++){ //重画端点
                if (circleIndex %2 === 0){ //更改端点颜色，一条线的两个端点，根据标号判断。
                    if (i === circleIndex || i === circleIndex + 1){
                        drawCircle(ctx, circles[i], selectColor);
                    }
                    else{
                        drawCircle(ctx, circles[i], circles[i].color);
                    }
                }
                else{
                    if (i === circleIndex || i === circleIndex - 1){
                        drawCircle(ctx, circles[i], selectColor);
                    }
                    else{
                        drawCircle(ctx, circles[i], circles[i].color);
                    }
                }
            }
            for (let i = 0; i < lines.length; i++){ //重绘线条
                if (i === lineIndex){
                    drawLine(ctx, lines[i], selectColor);
                }
                else{
                    drawLine(ctx, lines[i], normalColor);
                }
            }
        } //结束；
    };
    canvas.onmouseup=function(){
        canDrag=false; //禁止拖动。
    };
    canvas.onmouseout=function(){
        canDrag=false;
    };
    function lineSelectAndDrawAgain(ctx, lines, circles, lineSelectIndex){ //根据选中的直线，重绘线和端点。
        ctx.clearRect(0,0,canvas.width,canvas.height);
        let circleOnLineIndex = [lineSelectIndex*2, lineSelectIndex*2 + 1]; //线上的两个端点下标
        for (let i = 0; i < circles.length; i++){
            if (circleOnLineIndex.indexOf(i) != -1){ //更改端点颜色，一条线的两个端点，根据标号判断。
                drawCircle(ctx, circles[i], selectColor)
            }
            else{
                drawCircle(ctx, circles[i], circles[i].color)
            }
        }
        for (let i = 0; i < lines.length; i++){ //重绘线条
            if (i === lineSelectIndex){
                drawLine(ctx, lines[i], selectColor)
            }
            else{
                drawLine(ctx, lines[i], normalColor)
            }
        }
        return;
    }
    function lineSelectAndToDelete(ctx, lines, circles, lineSelectIndex){ //点击选中的线段，显示删除按钮。
        let line = lines[lineSelectIndex];
        let pointLow = [line.Point1,line.Point2].filter(c => c.y === Math.max(line.Point1.y, line.Point2.y));
        let pointX = pointLow[0].x;
        let pointY = pointLow[0].y; //下端点坐标；

        DomElements.singleLineDelete.style.display = "block"; //显示删除按钮。
        let deleteX = pointX + 50 - 12 + "px"; //点的X坐标 + 左边距 - 点的直径。
        let deleteY = pointY + 60 + 10 + "px"; //点的Y坐标 + 上边距 + 10的间隔。
        DomElements.singleLineDelete.style.left = deleteX; //根据下面的一个端点设置按钮位置。
        DomElements.singleLineDelete.style.top = deleteY;
        DomElements.singleLineDelete.onclick = function (){
            singleLineDelete(ctx, lines, circles, lineSelectIndex); //删除当前选中线段。
            DomElements.singleLineDelete.style.display = "none";
        };
    }
    function singleLineDelete(ctx, lines, circles, lineSelectIndex){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        circles.splice(lineSelectIndex*2,2); //删除两个端点；
        for (let i = 0; i < circles.length; i++){
            drawCircle(ctx, circles[i], circles[i].color);
        }
        lines.splice(lineSelectIndex,1);
        for (let i = 0; i < lines.length; i++){ //重绘线条
            drawLine(ctx, lines[i], normalColor)
        }
    }
    function drawAgain(ctx, circles, lines){ //重绘画布
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for (let i = 0; i < circles.length; i++){
            drawCircle(ctx, circles[i], circles[i].color);
        }
        for (let i = 0; i < lines.length; i++){ //重绘线条
            drawLine(ctx, lines[i], normalColor)
        }
        DomElements.singleLineDelete.style.display = "none";
    }
    function drawCircle(ctx, circle,color){
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.fill();
        ctx.stroke();
    }
    function drawLine(ctx, line, color){
        ctx.beginPath(); //开始一条新路径。
        ctx.moveTo(line.Point1.x, line.Point1.y);
        ctx.lineTo(line.Point2.x, line.Point2.y);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    DomElements.lineAllDelete.onclick = function(){ //点击全部删除按钮清空画布，线、端点清空。
        ctx.clearRect(0,0,canvas.width,canvas.height);
        DomElements.singleLineDelete.style.display = "none"; //隐藏可能显示的删除按钮。
        circles.length=0;
        lines.length=0;
    };
    /*
    window.onresize = function(){ //监听窗口变化并重绘全景图，之前已经画上去的线段将会全部清空。
        _this.verticalCalibration();
    };

     */
    return lines;
};

//关闭垂直矫正页面；
RoomConnector2DWeb.prototype.closeVerticalCalibrate = function(){
    document.getElementById("canvas").width = 0; //设置canvas宽高，重置canvas，即清空；
    document.getElementById("canvasLine").width = 0;
    document.getElementById("canvasLine").style.display='none';
    document.getElementById("canvas").style.display='none';
    DomElements.verticalCalibrateClose.style.display = "none"; //隐藏按钮。
    DomElements.verticalCalibrateProceed.style.display = "none"; //隐藏按钮。
    DomElements.verticalHint.style.display = "none"; //隐藏按钮。
    DomElements.lineAllDeleteHint.style.display = "none";
    DomElements.lineAllDelete.style.display = "none";
    DomElements.AICalibrate.style.display = "none";
};
