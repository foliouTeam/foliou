// var $ = require("jquery");
var player = require("../../../packages/foliou/player/");
var popup = require("../../../packages/foliou/popup/");
var animate = require("../../../packages/foliou/animate/");
// console.log(require);
requirejs(["jquery", "gplayer/main"], function($, gPlayer) {
    // player.plugin($);
    // var popvideo = new player.popup({
    //     file: "https://videogame.ztgame.com.cn/public/20190911/jielan2pv-156819138268.mp4",
    //     width:400,
    //     height:300,
    //     auto:true
    // });
    // popvideo.show();
    animate.plugin($);
    $(".block").keyframe('move1',{},function(){
        alert(2);
    });
});
