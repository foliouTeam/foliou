var $ = require("jquery");
import player from "../../../packages/foliou/player";
// console.log(player);
$(function () {
	var mplayer = new player({
		file: "./videos/xinpv-157294526565.mp4",
		width: "100%",
		auto: true,
		height: "auto",
		pc: {},
		download: "xinpv.mp4",
		mobile: {}
	});
	$(".play_btn").click(function () {
		mplayer.play();
	});
	//
});
