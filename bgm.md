---
description: 背景音乐
---

# Bgm

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

####  **\# new BGM\(options\);**

 初始化音频播放

**参数：**

* option {Object} 初始化对象包含索引：
  * file {String} 音频的url
  * onpause {Function} 暂停的回调函数
  * onplay {Function} 开始播放的回调函数

