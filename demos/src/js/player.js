var $ = require("jquery");
var player = require("../../../packages/foliou/player");
// console.log(player);
$(function() {
	var mplayer = new player({
		file: "https://videogame.ztgame.com.cn/public/20191105/xinpv-157294526565.mp4",
		width: "100%",
		auto: true,
		height: "auto",
		pc: {},
		mobile: {}
	});
	$(".play_btn").click(function() {
		mplayer.play();
	});

	//
});
