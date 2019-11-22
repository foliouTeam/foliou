---
description: foliou/bgm
---

# 背景音乐

## 功能

用于在网页中播放背景音乐

* 兼容ie、chrome等主流浏览器
* 支持微信端自动播放
* 支持音频淡入淡出
* 支持自动播放降级方案——触摸自动播放

## 演示

{% embed url="http://foliou.focusbe.com/bgm.html" %}

## 示例代码

```javascript
var BGM = require("foliou/bgm");
var bgm = new BGM({
	file: "http://www.ztgame.com/act/30th/sound/bg.mp3",
	onpause: function() {
		console.log("暂停了");
	},
	onplay: function() {
		console.log("开始播放了");
	}
});

//bgm.play() //播放背景音乐
//bgm.pause() //暂停背景音乐

```

{% hint style="info" %}
bgm的初始化代码不要放在页面onload 触发之后，**不要放在requirejs引入库的回调函数中，否则可能会引起微信下无法自动播放的问题。**
{% endhint %}

~~**错误的示范**~~

```javascript
//这样在ios微信下会偶发自动播放失败
requirejs(('jquery'),function(){
    var bgm = new BGM({
        file: "http://www.ztgame.com/act/30th/sound/bg.mp3"
    });
});
```

## API

### 初始化

#### **\# new BGM\(options\);**

 初始化音频播放

**参数：**

* options {Object} 
  * file {String} 音频的url
  * loop {Boolean} 是否循环
  * auto {Boolean} 是否自动播放
  * onpause {Function} 暂停的回调函数
  * onplay {Function} 开始播放的回调函数

### 方法（初始化返回的对象包含的函数）

**\# playe\(\[music\]\);** 

播放当前音频或者重新设置音频并播放。

参数

* music {String} ：
  * 可选参数
  * 需要播放的视频的视频地址，如果为空，继续播放上一次设置的音频
  * 如果传入的是Object，则会替换初始化的参数options，具体说明见初始化函数

**\# pause\(\);** 

暂停当前音频.。



