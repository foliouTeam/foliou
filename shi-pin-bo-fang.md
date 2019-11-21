# 视频播放

## 演示

{% embed url="http://foliou.focusbe.com/player.html?v=1" %}

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

####  **\# new Player\(options\);**

 初始化视频播放器

**参数：**

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

#### 内嵌播放函数列表

* play： 播放视频，例：myplayer.play\(\)
* pause： 暂停视频，如果是弹窗形式，将会自动关闭弹窗；例：myplayer.pause\(\)
* setVideoUrl\(videourl,image\) ：重新设置视频和图片，例：myplayer.setVideoUrl\(videourl,image\)





