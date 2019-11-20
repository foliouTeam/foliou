var Animate = require("../../../packages/foliou/animate");
var BGM = require("../../../packages/foliou/bgm/");
// var VConsole = require("vconsole");
// var vConsole = new VConsole();
// requirejs(["jquery"], function($) {
// var bgm = new BGM({
// 	file: "http://www.ztgame.com/act/30th/sound/bg.mp3",
// 	onpause: function() {
// 		alert("pause");
// 	},
// 	onplay: function() {
// 		alert("play");
// 	}
// });
// var myembed = document.getElementById("myembed");
// console.log(myembed);
// myembed.attachEvent("onload", function(e) {
// 	alert("onplay");
// });
// var suportAudio = function() {
// 	return !!document.getElementById("audio");
// };

// myembed.attachEvent("onpause", function(e) {
// 	alert("onpause");
// });
var $ = require("jquery");
// $(function() {
// 	$(".pause_btn").click(function() {
// 		bgm.pause();
// 		//myembed.pause();
// 	});
// 	$(".resume_btn").click(function() {
// 		bgm.play();
// 		//myembed.play();
// 	});
// });
Animate.to(
	".div1",
	{
		width: "100%",
		x: 100
	},
	function() {
		Animate.set(".div1", {
			width: 100,
			x: 0
		});
		Animate.to(
			".div1",
			{
				height: "200px"
			},
			function() {
				Animate.keyframe.run(".div1", "move1", function() {
					alert("end");
				});
			}
		);
	}
);
