---
description: foliou是一个前端常用组件集合
---

# 简介

Github：[https://github.com/focusbe/foliou](https://github.com/focusbe/foliou)

文档：[https://pengzai.gitbook.io/foliou/](https://pengzai.gitbook.io/foliou/)

包含了以下模块：

* **foliou/animate —— css3动画**
  * 组件实现了用js操作css属性实现过渡动画，类似于jquery的animate函数但是采用了css3特性实现，可以作为jquery animate的补充，但是性能会优于jquery；
* **foliou/device —— 设备判断**
  * 在开发时经常会需要判断设备的类型，这部分功能非常简单，即便每次写代码量并不多，但是为了在开发的过程中可以避免写重复的代码，让核心的代码显得更加简洁所以把这部分代码单独做成了一个组件。
* **foliou/popup —— 弹窗**
  * 弹窗也是一个常用的功能，这个弹窗组件有以下特性：
  * 弹出动画支持 “缩放“、“淡入“；
  * 动画采用css3特性实现，在移动端更流畅；
  * 当内容比较多时，支持出现滚动条；
* **foliou/player —— 视频播放器**
  * 兼容IE8+、chrome、firefox
  * 自代弹窗播放功能
* **foliou/touch —— 触摸事件组件**
  * 在开发的过程中有时会遇到，用鼠标拖动或者用手指滑动的需求，这个时候需要同时绑定mousedown 或和touchstart或者判断设备绑定相应的事件，为了简化代码，通过这个组件绑定事件，可以无需关心绑定mousedown还是touchstart，只需要关心事件的 start,mover,end;
* **foliou/swiper —— 轮播**
  * 同时支持移动端和PC端
* **foliou/utli —— 常用的一些函数集**
  * 从当前url中获取参数
  * 在低版本浏览器实现Json.pare 和 Json.stringify
* **foliou/bgm——背景音乐**
  * 兼容ie/移动端
  * 支持微信端自动播放
  * 添加音频淡入淡出
  * 添加自动播放降级方案——触摸自动播放

