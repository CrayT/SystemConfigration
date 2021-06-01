verticalCalibrate = {

    CalibrateLine : function(line){ //定义CalibrateLine。c#中是构造函数。
        let Point1 = new THREE.Vector3();
        let Point2 = new THREE.Vector3();
        let IsCalibrated = false;

        Point1 = line;//.Point1;  //Point1和Point2是line的属性，应该在画线的时候定义好。
        Point2 = line;//.Point2;

        let Theta = (Point1.x + Point2.x) / 2 *2 * 180;

        function GetPointIn3D(point){ //Vector3类型point
            let theta = point.x * 2 * 180 * THREE.Math.DEG2RAD;  //=point.x * 2 * 180 * Math.PI / 180
            let phi = point.y * 2 * 90 * THREE.Math.DEG2RAD;

            let p = new Vector3();
            let cosPhi = Math.cos(phi); //球坐标与直角坐标转换？？
            p.x = cosPhi * Math.sin(theta);
            p.y = Math.sin(phi);
            p.z = cosPhi * Math.cos(theta);

            return p; //返回Vector3类型的p点
        }

        function GetRotation(){ //Quaternion类型函数
            let point1In3D = this.getPointIn3D(Point1);
            let point2In3D = this.getPointIn3D(Point2);

            let theta =MathHelper.GetTheta(new THREE.Vector3,(point1In3D + point2In3D) / 2); //
            let forward = new THREE.Vector3(0,0,1);
            let axis = THREE.Quaternion.Euler(0, theta, 0) * forward;

            let p1 = THREE.Quaternion.Euler(0, -theta, 0) * point1In3D;
            let p2 =  THREE.Quaternion.Euler(0, -theta, 0)*point2In3D;
            let angle = - Math.GetTheta(p2, p1);

            let quaternion = new THREE.Quaternion();

            return quaternion.setFromAxisAngle(axis, angle);
        };

        function Rotate1(rotation){ //Quaternion类型rotation，无返回
            Rotate2();
            Rotate2();
            return true;
        };

        function Rotate2(point, rotation){ //Vector3 point, Quaternion rotation;

            return true;

        };

    },

    CalibrateVerticalLine : function(startEulerAngles, lines){ //外部调用函数，(原始全景图的旋转角，用户画的矫正线)。

        return true;
    },

    getPointIn3D : function(point){
        return true;
    },

    GetRotation : function(){
        return true;
    },


    hyperCalibrateVerticalLine: function(calibratorList, calibrator, startRotation){
        for ( let i = 0; i < 5; i++){
            calibratorList.forEach(c => c.IsCalibrated = false);
            startRotation = THREE.Quaternion.Euler(this.calibrateVerticalLine(calibratorList, calibrator, startRotation));
        };

        return startRotation;//.eulerAngles;
    },

    calibrateVerticalLine: function(calibrateVerticalLine, calibrator, startRotation){ //主函数调用该函数，三个参数：矫正列表、矫正线、角度，
        let rotation = new Vector3();
        let thisRotation = new THREE.Quaternion();
        rotation = (thisRotation * startRotation);//.eulerAngles;
        rotation.y = startRotation.y;

        calibrator.IsCalibrated = true;


        return rotation;
    }
};


