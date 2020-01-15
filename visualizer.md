# 音频可视化



## 演示

{% embed url="http://foliou.focusbe.com/visualizer.html" %}

```javascript
var Visualizer = require("foliou/visualizer");
var visualizer= new Visualizer ({
    file: "http://www.ztgame.com/act/30th/sound/bg.mp3",
    onReady:function(){
        console.log("音频加载完成");
    },
    onUpdate:function(arr){
        console.log(arr);
        //arr是当前音乐频率的数组，可将这个数组转化为可视化的效果
    },
    onPause:function(){
    },
    onPlay:function(){
    }
});

//visualizer.play() //播放背景音乐
//visualizer.pause() //暂停背景音乐
```

## API

### **\# new Visualizer\(options\);**

初始化音频播放

**参数：**

* option {Object} 初始化对象包含索引：
  * file {String} 音频的url
  * onPause{Function} 暂停的回调函数
  * onPlay{Function} 开始播放的回调函数
  * onReady{Function} 视频加载完成的回调
  * onUpdate{Function} 频率更新的回调 回调返回频率数组

