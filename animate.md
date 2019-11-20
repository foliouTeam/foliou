---
description: 用Js控制Dom的Css3属性，可以提升动画的执行效率
---

# Animate

## 功能

1. 设置css属性（包含css3属性）；
2. 控制css属性的过度动画；
3. 控制keyframe 运行，暂停，继续，停止。

## 使用示例

{% code title="index.html" %}
```markup
<div id="div1"></div>
```
{% endcode %}

{% code title="main.scss" %}
```css
@keyframes slidein {
  from {
    margin-left: 100%;
    width: 300%;
  }

  to {
    margin-left: 0%;
    width: 100%;
  }
}
```
{% endcode %}

{% code title="main.js" %}
```javascript
var Animate = require("foliou/animate");

Animate.set("#div",{
    width:100,
    x:100,
    scale:0.5
});

Animate.to("#div",{
    height:200,
    opacity:0
},300,'ease-in-out',function(){
    
})

//运行keyframe
Animate.keyframe.run("#div","slidein",{
    speed:3000,//动画时间
    count:10,//执行次数
},function(){
    
});
//控制keyframe
Animate.keyframe.pause("#div");
Animate.keyframe.resume("#div");
Animate.keyframe.stop("#div");
```
{% endcode %}

## API

####  **\# Animate.set\(element,styles\);**

 设置元素的css属性

**参数：**

* element {String \| $}  jquery选择器，或者jquery对象
* styles {Object} 样式对象,**索引可以是css3 中 transform的属性，**如： **x,y,scale,rotate**等

{% hint style="info" %}
在IE8以及IE9中 css3特有的属性不会生效，但是css2属性可以正常设置，效果等同于Jquery的css方法
{% endhint %}

#### \*\*\*\*

#### **\# Animate.to\(element,styles,\[speed\],\[**easing**\],\[callback\]\);**

 控制元素渐变到某一个特定的css属性

**其他调用形式**

* Animate.to\(element,styles,\[speed\],\[callback\]\);
* Animate.to\(element,styles,\[callback\]\);

**参数：**

* element {String \| $}  jquery选择器，或者jquery对象；
* styles {Object} 样式对象,**索引可以是css3 中 transform的属性，**如： **x,y,scale,rotate**等；
* speed {Number} 默认值：300 动画执行的时间；
* easing{String} 默认值：'linear' 动画曲线如：'linear'，'ease-in'等
* callback{Function} 动画完成的回调。

{% hint style="info" %}
在IE8和IE9中css3特有的属性不会执行，但是css2属性可以照常执行，效果等同于Jquery的animate方法
{% endhint %}

#### 

#### \# Animate.keyframe.run\(element,keyframe,\[options\],\[callback\]\)

 让元素执行预定义的keyframe

**其他调用形式**

* Animate.keyframe.run\(element,keyframe ****,\[callback\]\);

**参数：**

* element {String \| $}  jquery选择器，或者jquery对象；
* keyframe {String} 在css中定义好的keyframe名称
* options {Object} keyframe 相关的属性包含：
  * speed 
  * easing
  * count
  * delay
  * direction
  * fillmod
* 具体值可查询 Animate [文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)

{% hint style="info" %}
 浏览器需支持keyframe
{% endhint %}

#### 

#### \# Animate.keyframe.pause\(element\)

暂停正在执行的keyframe

**参数：**

* element {String \| $}  jquery选择器，或者jquery对象；



#### \# Animate.keyframe.resume\(element\)

继续执行的keyframe

**参数：**

* element {String \| $}  jquery选择器，或者jquery对象；



#### \# Animate.keyframe.stop\(element\)

停止执行的keyframe

**参数：**

* element {String \| $}  jquery选择器，或者jquery对象；

