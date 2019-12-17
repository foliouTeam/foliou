//获取js，css3浏览器前缀
(function() {
	function Factory() {
		var Login = function(...params) {
			var self;
			requirejs(["login/index"], function(gLogin) {
                console.log(gLogin);
				self = new gLogin(...params);
			});
		};
		return Login;
	}
	if (typeof exports === "object") {
		// CommonJS
		module.exports = Factory();
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define(Factory);
	} else {
		// Global Variables
		if (!window.Foliou) {
			window.Foliou = {};
		}
		window.Foliou.Login = Factory();
	}
})();
