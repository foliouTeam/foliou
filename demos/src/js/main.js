var Animate = require("../../../packages/foliou/animate");
requirejs(["jquery"], function($) {
	Animate.to(
		"#div1",
		{
			width: "100%",
			x: 100
		},
		function() {
			// alert('结束');
			Animate.set("#div1", {
				width: 100,
                x: 0
			});
			Animate.to(
				"#div1",
				{
					height: "200px"
				},
				function() {
					
				}
			);
		}
	);
});
