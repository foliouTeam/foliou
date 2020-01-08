---
description: 获取当前浏览器的特殊前缀
---

# 浏览器前缀

这个组件的功能非常简单，它的功能是当你需要给一个dom设置css属性或者获取某一个属性时，某些浏览器下需要加浏览器前缀才能获取，这个时候你可能会用到它。

## 使用示例

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



