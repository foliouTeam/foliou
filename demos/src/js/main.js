var $ = require("jquery");
var Player = require("../../../packages/foliou/player/").plugin($);
$(function() {
    // $(".player_wrap").Player({
    //     file: "https://videogame.ztgame.com.cn/public/20190911/jielan2pv-156819138268.mp4"
    // });
    var popvideo = new Player.popup({
        file: "https://videogame.ztgame.com.cn/public/20190911/jielan2pv-156819138268.mp4",
        width:400,
        height:300,
        auto:true
    });
    popvideo.show();
});
