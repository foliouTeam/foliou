// var $ = require("jquery");
var Animate = require("../../../packages/foliou/animate");

var Visualizer = require("visualizer").default;
console.log(Visualizer);
let v = new Visualizer({
	canvasElement: document.getElementById("myCanvas"),
	musicElement: document.getElementById("myMusic")
});
v.draw();


Animate.to(
	".div1",
	{
		width: "100%",
		x: 100,
		marginTop: 100
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
				// Animate.keyframe.run(".div1", "move1", function() {
				// 	alert("end");
				// });
			}
		);
	}
);
