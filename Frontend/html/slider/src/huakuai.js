{
    let barBox = document.getElementById("barBox");
    let barColor = document.getElementById("barColor"); // 色块
    let barBlock = document.getElementById("barBlock"); // 小方块

    let barBox2 = document.getElementById("barBox2");
    let barColor2 = document.getElementById("barColor2"); // 色块
    let barBlock2 = document.getElementById("barBlock2"); // 小方块

    let startWdith  = 100; // 初始的宽度
    let startX ; // 鼠标开始按下的位置
    barBlock.style.left = startWdith + 'px';
    let bar1=false, bar2=false; //设置标记，防止进入另一个滑块的mouseup状态。

    let testV  = {x:0, y:0, z:0};
    let mMove = function(event){
        console.log('进入第一个滑块move')

        event.preventDefault(); // 阻止默认事件
        let  mouseX = event.clientX;  // 鼠标实时位置
        let  dis = mouseX - startX ;  // 移动距离
        console.log('event.clientX',event.clientX,startX)
        let  disWidth = startWdith + dis ; //宽度:当前宽度+移动距离
        if( disWidth > 300 ){
            disWidth = 300;
        }
        if(disWidth < 0){
            disWidth = 0;
        }
        barBlock.style.left = disWidth + "px";
        console.log("disWidth: "+ disWidth, (disWidth-150)/30);
    };
    barBox.addEventListener("mousedown",function(event){
        bar1=true;
        //event.preventDefault(); // 阻止默认事件
        startX = event.clientX ; // 记录鼠标点下的开始x坐标（相对于窗口）
        let mx = event.offsetX;//
        console.log('offset: ',mx);
        barBlock.style.left = mx + "px";//更新小方块位置
        startWdith = mx;  //更新色块初始的宽度
        barBox.addEventListener("mousemove", mMove, false);
    });
    document.addEventListener("mouseup",function(event){

        if (bar1){
            testV.x += 1;
            console.log('第一个滑块up',testV);
            startWdith =  barColor.offsetWidth; //  松开鼠标后，记录当前色块的宽度。
            bar1=false;
        }
        // console.log('第一个滑块upup');
        barBox.removeEventListener("mousemove", mMove, false);
    });



    let barColor_startWdith2  = 0; // 色块初始的宽度
    let startX2 ; // 鼠标开始按下的位置
    let mMove2 = function(event){
        console.log('进入第2个滑块move');
        //event.preventDefault(); // 阻止默认事件
        let  mouseX2 = event.clientX;  // 鼠标的在窗口的位置
        let  dis2 = mouseX2 - startX2 ;  // 计算鼠标在窗口的移动距离
        let  disWidth2 = barColor_startWdith2 + dis2 ; // 色块跟随鼠标走的宽度:当前宽度+移动距离
        if( disWidth2 > 300 ){  // 如果色块的宽度大于了最大值 200
            disWidth2 = 300;
        }
        // 色块的宽度不能为负数
        if(disWidth2<0){
            disWidth2 = 0;
        }
        barBlock2.style.left = disWidth2 + "px";
        // 控制音量之类的，可以用 disWidth的值参与运算。此处略
        //console.info( "disWidth2:"+ disWidth2);
        //console.log((disWidth2-150)/30);
    };
    barBox2.addEventListener("mousedown",function(event){
        bar2=true;
        event.preventDefault(); // 阻止默认事件
        startX2 = event.clientX ; // 记录鼠标点下的开始x坐标（相对于窗口）
        // 鼠标滑动，写在页面上的。
        let mx2 = event.offsetX;//
        barBlock2.style.left = mx2 + "px";//更新小方块位置
        barColor_startWdith2 = mx2;//更新色块初始的宽度
        barBox2.addEventListener("mousemove", mMove2);

    });
    document.addEventListener("mouseup",function(event){

        if(bar2){
            testV.z += 1;
            console.log('第2个滑块up',testV);
            barColor_startWdith2 =  barColor2.offsetWidth; //  松开鼠标后，记录当前色块的宽度。
        }
        bar2=false;
        barBox2.removeEventListener("mousemove", mMove2);
    });
}
