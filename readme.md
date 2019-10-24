
# 介绍  
1. 开发组件时，把图片，html，css 打包成js 方便直接在js中调用。
2. 集成了基于gulp的demos框架，方便开发组件时测试。  
3. 开发完成后发布到npm，方便开发者使用。


# 使用方法

2. 安装依赖  
``` 
npm install foliou
```   

## Animate

### 1. 原生js使用方法
``` javascript
var Animate = require("foliou/animate");
var dom = document.getElementByid("id");
var cssObject = {
    width:'100px',
    height:'100px'
}
var callback = function(){
    alert(1);
}
Animate.css3(dom,cssObject,callback);
//参数说明
//dom: js原生 dom元素
//cssObject: css属性为索引的对象，例如{width:"100px"}，
    //可使用css3属性，包含x,y,scale,scaleX,scaleY,scaleZ,opacity,
    //以及其他可以在jquery中使用的css属性
//callback 设置完成的回调函数；
``` 

-------
持续更新中。。。

