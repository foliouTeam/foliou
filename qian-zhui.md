---
description: 获取当前浏览器的特殊前缀
---

# 前缀

这个组件功能非常简单，但是在开发组件的时候会经常用到它，所以将这块功能单独作为了一个组件

它的主要功能是当你需要给一个dom设置css属性时候或者用js获取某一个属性时，某些浏览器下需要加浏览器前缀才能获取，这个时候你可能会用到它。



{% code title="main.js" %}
```javascript
var Prefix = require("foliou/prefix");

console.log(Prefix);
//结果如下：
/*{
    dom:"WebKit",
    lowercase:'webkit',
    css:'-webkit-',
    js:'Webkit'
}*/
```
{% endcode %}



