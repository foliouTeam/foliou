# 开发组件的思考

## 需求是什么

我们工作的内容大部分是游戏相关的活动专题或者游戏的官网例如

[http://zt2m.ztgame.com/](http://zt2m.ztgame.com/)  
[http://jl2.ztgame.com/](http://jl2.ztgame.com/)

有很多类似的功能可以开发成组件的形式比如说 轮播图，视频播放器等等，我想要把这些功能开发完成后发布到npm上，这样以后使用的过程中就可以这样写了。

```javascript
//foliou 是我的组件集的名称，已经发布到了 npm
var player = require("foliou/player");
new player("video_wrap",{
    file:'......'
});
```

拿视频播放器组件来说，组件的逻辑无非就是在页面中插入一些html，这些html具有有默认的样式，而且还有一些按钮图片。

但是在开发的过程中我遇到了一些困惑。

### 1.用js插入HTML

最开始我是这样做的，直接在js中写html的字符串，然后把它插入到对应的容器中

![&#x63D2;&#x5165;html&#x7ED3;&#x6784;&#x7684;&#x5B9E;&#x4F8B;](.gitbook/assets/code.png)

在HTML代码量很少的时候这样做貌似没有什么问题，就是丑了点，我相信有些对代码要求干净的人，已经忍不下去了，

那有没有更好的办法呢，是否能HTML写在.html中，在js中直接引入呢，如下：

{% code-tabs %}
{% code-tabs-item title="tpl.html" %}
```markup
<div class="POPUP-Player">
    ......
</div>
```
{% endcode-tabs-item %}

{% code-tabs-item title="" %}
```

```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% code-tabs %}
{% code-tabs-item title="main.js" %}
```javascript
var html = require("./tpl.html");
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### 解决方案——Rollup

我相信很多人知道这工具，如果不知道也没有关系，它就是一个 打包js的工具，就像webpack，Browserify，当然他们有所不同。

 我选择Rollup 的原因：

1. 兼容性
2. 轻量但功能够用
3. 口碑还不错

Rollup的使用方法有两种

    使用之前需要安装rollup

```bash
npm install rollup -g
```

1. 命令行

```bash
rollup main.js --file bundle.js --format cjs
```

     2. Javascript Api

{% code-tabs %}
{% code-tabs-item title="build.js" %}
```javascript
const rollup = require('rollup');
const posthtml = require("rollup-plugin-posthtml-template");
// 导入导出的参数
const inputOptions = {
  input:"main.js",
  plugins: [
    posthtml({
      include: "./*.html"
    })
  ]
};
const outputOptions = {
  file:"bundle.js",
  format: "cjs"
};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}

build();
```
{% endcode-tabs-item %}
{% endcode-tabs %}

```bash
node ./build.js
```

有了上面这部分代码我们已经可以在 main.js中 直接require html文件了，然后我们就可以把打包后的js 发布到npm，大功告成 🍻





















