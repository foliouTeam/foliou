var BGM = require("../../../packages/foliou/bgm");
var $ = require("jquery");
var bgm = new BGM({
	file: "http://www.ztgame.com/act/30th/sound/bg.mp3",
	onpause: function() {
		alert("pause");
	},
	onplay: function() {
		alert("play");
	}
});
$(function() {
	$(".pause_btn").click(function() {
		bgm.pause();
	});
	$(".resume_btn").click(function() {
		bgm.play();
    });
    
});
