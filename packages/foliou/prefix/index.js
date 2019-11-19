//获取js，css3浏览器前缀
(function() {
	function Factory() {
		var prefix = function() {
			if (typeof window.getComputedStyle == "undefined") {
				return {
					dom: "",
					lowercase: "",
					css: "",
					js: ""
				};
			}
			var styles = window.getComputedStyle(document.documentElement, ""),
				pre = (Array.prototype.slice
					.call(styles)
					.join("")
					.match(/-(moz|webkit|ms)-/) ||
					(styles.OLink === "" && ["", "o"]))[1],
                dom = "WebKit|Moz|MS|O".match(new RegExp("(" + pre + ")", "i"))[1];
			return {
				dom: dom,
				lowercase: pre,
				css: "-" + pre + "-",
				js: pre == "ms" ? "ms" : pre[0].toUpperCase() + pre.substr(1)
			};
		};
		return prefix();
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
		window.Foliou.prefix = Factory();
	}
})();
