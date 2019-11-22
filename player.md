---
description: foliou/player
---

# 视频播放

## 功能

用于网页中播放视频

* 兼容IE8+、chrome、firefox
* 自代弹窗播放功能

## 演示页面

{% embed url="http://foliou.focusbe.com/player.html?v=1" %}

## 示例代码

### 1、弹窗播放

```javascript
var Player = require("foliou/player");
var mplayer = new Player({
    file: "https://videogame.ztgame.com.cn/public/20191105/xinpv-157294526565.mp4",
    width: "100%",
    auto: true,
    height: "auto"
});
//mplayer.play();显示弹窗并播放
//mplayer.pause();隐藏播放并暂停
```

### 2、容器内播放

{% code title="index.html" %}
```markup
<div id="player-wrap"></div>
```
{% endcode %}

{% code title="main.js" %}
```javascript
var Player = require("foliou/player");
var mplayer = new Player("#player-wrap",{
    file: "https://videogame.ztgame.com.cn/public/20191105/xinpv-157294526565.mp4",
    width: "100%",
    auto: true,
    height: "100%"
});
```
{% endcode %}

## API

### 初始化

####  **\# new Player\(\[container\],options\);**

 初始化视频播放器

**参数：**

* container {Jquery\|String\|DomElement} 视频播放的容器，可选参数，如果参数为空，  
* option {Object} 初始化对象包含索引：
  * file {String} 
    * 视频的url
  * width {Number\|String}
    *  视频宽度。
    * 例：200\|”100% “,
    * 默认值 “100%”
  * height {Number\|String} 
    * 视频高度。
    * 例：200\|”100%”\|”auto”。
    * 默认值 “auto”
  * auto { Boolean}
    * 是否自动播放。
    * 例: true\|false 。
    * 默认值 false
  * image {String}
    * 封面图片。
    * 例: ‘cover.jpg’ 。
    * 默认值 null
  * loop：{Boolean}
    *  是否循环播放。
    * 例: true\|false 。
    * 默认值 false
  * toolbar {Boolean}
    * 是否显示 控制栏和工具栏
  * onInit {Function}
    *  视频播放器初始化完成回调函数
  * onPlay {Function}
    *  视频开始播放时回调函数，每一次开始播放都会调用
  * onPause {Function}
    * 视频开始播放时回调函数，每一次开始播放都会调用
  * onComplete{Function}
    * 视频播放结束时回调函数
  * pc {Object}
    * 接受Object，如果是pc端 这里的参数会覆盖全局参数
  * mobile {Object}
    * 接受json数组，如果是移动端，这里的参数会覆盖全局参数

### 方法 （初始化返回的对象包含的函数）

**\# playe\(\[video\],\[poster\]\);** 

播放视频/显示弹窗并播放视频

参数

* video {String} ：
  * 可选参数
  * 需要播放的视频的视频地址，如果为空，继续播放上一次设置的视频
* poster {String}:
  * 可选参数
  * 视频的封面，如果为空

**\# pause\(\);**

暂停当前播放的视频/暂停视频并隐藏视频弹窗

**\# setVideoUrl\(video,\[poster\]\);**

重新设置视频和封面

* video {String} ：
  * 必填参数
  * 需要播放的视频的视频地址，如果为空，继续播放上一次设置的视频
* poster {String}:
  * 可选参数
  * 视频的封面，如果为空





