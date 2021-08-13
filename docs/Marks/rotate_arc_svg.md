### 旋转圆环svg
```xml
<?xml version="1.0"?>

<svg width="500" height="400" viewBox="0 0 500 400" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<circle r="100" cx="150" cy="150" stroke-linecap="round"
          style="stroke: #00ff00; fill: none; stroke-width:10px;stroke-dasharray:400 628;stroke-dashoffset:0" >
		<animate
			repeatCount='indefinite'
			attributeName="stroke-dasharray" 
			dur="2s" 
			values="440 628; 300 628; 100 628" 
			keyTimes="0; .5; 1" 
			calcMode="spline"  
			keySplines=".5 0 .5 1; 0 0 1 1" 
		/>
		<animateTransform
			attributeName="transform"
            begin="0s"
            dur="2s"
            type="rotate"
            values="0 150 150; 360 150 150"
            repeatCount="indefinite"
		 ></animateTransform>
</circle>
<circle r="60" cx="150" cy="150" stroke-linecap="round"
          style="stroke: #00ff00; fill: none; stroke-width:10px;stroke-dasharray:263 377;stroke-dashoffset:10" >
		<animate
            repeatCount='indefinite'
            attributeName="stroke-dasharray" 
            dur="2s" 
            values="263 377; 180 377; 50 377" 
            keyTimes="0; .5; 1" 
            calcMode="spline"  
            keySplines=".5 0 .5 1; 0 0 1 1" 
		/>
		<animateTransform
			attributeName="transform"
            begin="0s"
            dur="2s"
            type="rotate"
            from="0 150 150"
            to="-360 150 150"
            repeatCount="indefinite"
		 ></animateTransform>
</circle>
</svg>
```
