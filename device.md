---
description: 设备与浏览器环境判断库
---

# 设备



## 演示

{% embed url="http://foliou.focusbe.com/device.html" %}



## 功能

1. 判断当前设备类型；
2. 判断当前浏览器是否支持某一个标签；
3. 判断当前浏览器是否支持某一个标签的某个属性；
4. 判断当前浏览器是否支持某个Css3属性。

## 使用示例

{% code title="main.js" %}
```javascript
var Device = require("foliou/device");

Device.isiOS; //是否iOS
Device.isAndroid;//是否Adnroid
Device.isPc;//是否PC
Device.isWeixin;//是否微信
Device.isMobile;//是否移动端
Device.isQQ;//是否QQ
Device.isQQBrouwser;//是否QQ浏览器
Device.ieVersion;//IE浏览器版本
Device.isIe;//是Ie
Device.supportCss('transition');//是否支持 transitioin css属性
Device.supportTag('canvas');//是否支持canvas;
```
{% endcode %}



