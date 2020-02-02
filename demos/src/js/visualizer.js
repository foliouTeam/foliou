import Visualizer from "../../../packages/foliou/visualizer";
var $ = require("jquery");
var Animate = require("../../../packages/foliou/animate");
var voiceHeight;
var count = 600;
var yuandian = [];

function toSec(seconds) {
	var time = parseInt(seconds);
	var min = parseInt(time / 60);
	var sec = time % 60;
	return to2Wei(min) + ":" + to2Wei(sec);
}
function to2Wei(num) {
	if (num < 10) {
		return "0" + num;
	}
	return num;
}
$(function() {
	for (var i = 0; i < 90; i++) {
		var curjiaodu = $("<div><span></span></div>");
		$(".yinxiao").append(curjiaodu);
		yuandian.push(curjiaodu[0]);
		Animate.set(curjiaodu, {
			rotate: i * 4,
			origin: "50% 100%"
		});
	}
	var poster = $(".poster");
	// alert(1);
	var visualizer = new Visualizer({
		file: "./audios/bg.mp3",
		onReady: function() {
			$(".play_btn")
				.removeClass("loading")
				.addClass("pause");
			$(".play_btn").click(function() {
				if ($(this).hasClass("playing")) {
					visualizer.pause();
				} else {
					visualizer.resume();
				}
				//console.log(visualizer.context.state)
			});
		},
		onUpdate: function(arr, currenttime) {
			poster = $(".poster");
			voiceHeight = arr;
			var step = Math.round(voiceHeight.length / count);
			for (var i = 0; i < count; i++) {
				var audioHeight = voiceHeight[step * i];
				// console.log();
				var bili = 6;
				if (!!yuandian[i]) {
					if (!audioHeight || audioHeight < 4 * bili) {
						audioHeight = 4 * bili;
					}
					$(yuandian[i])
						.children("span")
						.css("height", audioHeight / bili);
				}
			}
			//console.log(visualizer.context);
			$("#music_time").html(toSec(currenttime) + "/" + toSec(visualizer.duration));
			//console.log(poster.hasClass("mrotate"));
			if (poster.hasClass("mrotate")) {
				var currotate = parseInt(Animate.getCss3(poster).rotate);
				if (!currotate) {
					currotate = 0;
				}
				currotate += 1;
				Animate.set(poster, {
					rotate: currotate
				});
			}
		},
		onPause: function() {
			$(".poster").removeClass("mrotate");
			$(".play_btn")
				.removeClass("loading")
				.addClass("pause")
				.removeClass("playing");
		},
		onPlay: function() {
			$(".poster").addClass("mrotate");
			$(".play_btn")
				.removeClass("loading")
				.removeClass("pause")
				.addClass("playing");
		}
	});
});
