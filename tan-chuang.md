---
description: foliou/popup
---

# 弹窗

## 演示

{% embed url="http://foliou.focusbe.com/popup.html" caption="" %}

## 用法

{% tabs %}
{% tab title="Html" %}
```markup
<div class="popup popup1">
    <a class="close" href="javascript:void(0)">close</a>
</div>
<div class="popup popup2">
    <a class="confirm" href="javascript:void(0)">confirm</a>
</div>
<a class="show_btn" href="javascript:void(0)">显示</a>
```
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="JavaScript" %}
```javascript
var Popup = require("foliou/popup");
var popup = new Popup(".popup");
//显示弹层
popup.show(".popup1");
//隐藏弹层
popup.hide(".popup1");
```
{% endtab %}
{% endtabs %}

## API

### **\# new Player\(popupElement,options\);**

初始化弹窗组件

**参数：**

* **popupElement：** {Jquery\|String\|DomElement} 想要设置成弹窗的容器，可填 jquery对象或者jquery选择器或dom元素
* **option：** {Object} 初始化对象包含索引：
  * animation：动画模式。例: 'fade'\|'fadeup'\|'fadedown' 。默认值：fade
  * time：执行动画时间。例:400。默认值：300
  * replace:：打开新窗口时候是否关闭上一个窗口。例：true\|false。默认值：true
  * scrollObj：是否容许出现滚动条，如果需要出现请直接传入弹窗中要出现滚动条的元素或者传入'this'，当参数为”this“表示以弹窗的根节点作为出现滚动条的元素。默认值：”this“
  * startShow：开始显示的回调函数,返回正在操作的对象。例: function\(obj\){}。默认值 function\(obj\){}。
  * endShow：完成显示的回调函数,返回正在操作的对象。例: function\(obj\){}。默认值 function\(obj\){}。
  * startHide：开始隐藏的回调函数,返回正在操作的对象。例: function\(obj\){}。默认值 function\(obj\){}。
  * endHide：完成隐藏的回调函数,返回正在操作的对象。例: function\(obj\){}。默认值 function\(obj\){}。

