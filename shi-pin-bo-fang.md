---
description: foliou/player
---

# 视频播放

## 演示

{% embed url="http://foliou.focusbe.com/player.html?v=1" caption="" %}

## 用法

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

#### **\# new Player\(\[container\],options\);**

初始化视频播放器

**参数：**

* container {Jquery\|String\|DomElement} 视频播放的容器，可选参数，如果参数为空，表示视频弹窗显示；  
* option {Object} 初始化对象包含索引：
  * file {String} 视频的url
  * width {Number\|String} 视频宽度,例：200\|”100% “,默认值 “100%”
  * height {Number\|String} 视频高度,例：200\|”100%”\|”auto”,默认值 “auto”
  * auto： 是否自动播放,例: true\|false ,默认值 false
  * image： 封面图片,例: ‘cover.jpg’ ,默认值 null
  * loop： 是否循环播放,例: true\|false ,默认值 false
  * toolbar： 是否显示 控制栏和工具栏
  * onInit： 视频播放器初始化完成回调函数
  * onPlay： 视频开始播放时回调函数，每一次开始播放都会调用
  * onPause： 视频开始播放时回调函数，每一次开始播放都会调用
  * onComplete： 视频播放结束时回调函数
  * pc： 接受json数组，如果是pc端 这里的参数会覆盖全局参数
  * mobile： 接受json数组，如果是移动端，这里的参数会覆盖全局参数

### 方法：

#### **\#  player.play\(\);**

开始/继续播放视频，如果是弹窗形式会显示弹窗并播放视频。

#### **\#  player.pause\(\);**

暂停播放视频，如果是弹窗形式会暂停并隐藏弹窗。

#### **\#  player.setVideo\(video,image\);**

**参数：**

* video {url}  视频的地址
* image {url} 封面图片的地址

