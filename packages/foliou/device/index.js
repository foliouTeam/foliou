(function() {
	function definFun() {
		var DEVICE = (function() {
			var ua = navigator.userAgent;
			var ualow = ua.toLowerCase();
			var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
			var ispc = true;
			var ismobile = false;
			var ie6 = !-[1] && !window.XMLHttpRequest;
			var ie7 = ua.search(/MSIE 7/i) != -1;
			var ie8 = ua.search(/MSIE 8/i) != -1;
			for (var v = 0; v < Agents.length; v++) {
				if (ua.indexOf(Agents[v]) > 0) {
					ispc = false;
					ismobile = true;
					break;
				}
			}
			return {
				isAndroid: ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1,
				isiOS: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
				isWeixin: ualow.match(/MicroMessenger/i) == "micromessenger",
				isPc: ispc,
				isMobile: ismobile,
				isQQ: ualow.match(/QQ/i) == "qq" && ualow.match(/QQBrowser/i) != "qqbrowser",
				isQQBrowser: ualow.match(/QQBrowser/i) == "qqbrowser",
				isIe6: ie6,
				isIe: window.ActiveXObject ? true : false,
				isIe7: ie7,
				isIe8: ie8,
				support_css3: function() {
					var div = document.createElement("div"),
						vendors = "ms Ms O Moz Webkit".split(" ");
					return function(prop) {
						if (prop in div.style) return true;

						prop = prop.replace(/^[a-z]/, function(val) {
							return val.toUpperCase();
						});
						for (var i in vendors) {
							if (vendors[i] + prop in div.style) {
								return true;
							}
						}

						return false;
					};
				}
			};
		})();
		return DEVICE;
	}

	if (typeof exports === "object") {
		// CommonJS
		module.exports = definFun();
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define(definFun);
	}
})();
