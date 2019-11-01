/**
    @author:pengzai
    @email:pengzai.dev@outlook.com
    @blog:https://pengzai.dev
    @github:https://github.com/focusbe/foliou
**/
("use strict");
(function() {
	var Factory = function(Prefix, $) {
		var PREFIX = Prefix();
		var support_css3 = (function() {
			var div = document.createElement("div"),
				vendors = "ms Ms O Moz Webkit".split(" "),
				len = vendors.length;
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
		})();
		// if (!support_css3("transform")) {
		// 	//console.error("当前浏览器不支持css3");
		// 	//return function() {};
		// }

		function upFirst(str) {
			// str = str.toLowerCase();
			var strarr = str.split(" ");
			var result = "";
			for (var i in strarr) {
				result += strarr[i].substring(0, 1).toUpperCase() + strarr[i].substring(1) + "";
			}
			return result;
		}
		var css3unit = {
			deg: ["rotate", "skew"],
			no: ["scale", "origin", "opacity", "zIndex", "z-index"]
		};
		//var transformStyle = ["scale", "rotate", "translate", "skew", "perspective"];
		// function istransformstyle(style) {
		//     if (style == "x" || style == "y" || style == "z") {
		//         style = "translate";
		//     }
		//     for (var i in transformStyle) {
		//         if (isSameStyle(style, transformStyle[i])) {
		//             return true;
		//         }
		//     }
		//     return false;
		// }
		function isSameStyle(str1, str2) {
			if (str1.toLowerCase() == str2.toLowerCase()) {
				return true;
			} else {
				return false;
			}
		}

		function getUnit(str) {
			var curArr;
			var returnUnit = "px";
			for (var i in css3unit) {
				curArr = css3unit[i];
				for (var j in curArr) {
					if (isSameStyle(curArr[j], str)) {
						if (i == "no") {
							returnUnit = "";
						} else {
							returnUnit = i;
						}
						return returnUnit;
					}
				}
			}
			return returnUnit;
		}

		function css3format(styles) {
			var transformstr = "";
			var originstr = "50% 50%";
			var curvalue;
			var css2style = {};
			for (var i in styles) {
				curvalue = styles[i];
				// console.log(i);
				var unit = getUnit(i);
				if (!isNaN(curvalue)) {
					curvalue += unit;
				}
				switch (i) {
					case "translate":
						transformstr += "translate(" + curvalue + "," + curvalue + ") ";
						break;
					case "x":
						transformstr += "translateX(" + curvalue + ") ";
						break;
					case "y":
						transformstr += "translateY(" + curvalue + ") ";
						break;
					case "z":
						transformstr += "translateZ(" + curvalue + ") ";
						break;
					case "scaleX":
						transformstr += "scaleX(" + curvalue + ") ";
						break;
					case "scaleY":
						transformstr += "scaleY(" + curvalue + ") ";
						break;
					case "scaleZ":
						transformstr += "scaleZ(" + curvalue + ") ";
						break;
					case "scale":
						transformstr += "scale(" + curvalue + ") ";
						break;
					case "rotate":
						transformstr += "rotate(" + curvalue + ") ";
						break;
					case "rotateX":
						transformstr += "rotateX(" + curvalue + ") ";
						break;
					case "rotateY":
						transformstr += "rotateY(" + curvalue + ") ";
						break;
					case "rotateZ":
						transformstr += "rotateZ(" + curvalue + ") ";
						break;
					case "skewX":
						transformstr += "skewX(" + curvalue + ") ";
						break;
					case "skewY":
						transformstr += "skewY(" + curvalue + ") ";
						break;
					case "skew":
						transformstr += "skew(" + curvalue + ") ";
						break;
					case "perspective":
						transformstr += "perspective(" + curvalue + ") ";
						break;
					case "origin":
						originstr = curvalue;
						break;
					default:
						css2style[i] = curvalue;
				}
			}
			return {
				origin: originstr,
				transform: transformstr,
				css2: css2style
			};
		}
		function queryEle(str) {
			if (typeof str == "string") {
				return $(str)[0];
			} else if (str instanceof $) {
				return str[0];
			}
			return str;
		}
		function getCss3(element) {
			var transformstr = element.style[PREFIX.js + "Transform"];
			if (!transformstr) {
				return {};
			}
			var temp = transformstr.split(" ");
			var key;
			var value;
			var temkeyvalue;
			var styleObj = {};
			for (var i in temp) {
				temkeyvalue = temp[i].split("(");
				if (temkeyvalue.length < 2) break;
				key = $.trim(temkeyvalue[0]);
				if (key == "translateX") key = "x";
				if (key == "translateY") key = "y";
				if (key == "translateZ") key = "z";
				value = $.trim(temkeyvalue[1].replace(")", "").replace("px", ""));
				styleObj[key] = value;
			}
			return styleObj;
		}

		function setcss3(element, style, value) {
			element.style[PREFIX.js + upFirst(style)] = value;
			element.style[style] = value;
		}

		function setStyle(element, styles, animate, justCss3) {
			element = queryEle(element);
			if (!element) {
				return;
			}
			if (typeof animate == "undefined") animate = false;
			else if (typeof animate == "function") {
				callback = animate;
				animate = false;
			}
			if (!animate && support_css3("transition")) {
				var transitionstr = "all 0s linear ";
				$(element).css("transition", transitionstr);
				$(element).css(PREFIX.css + "transition", transitionstr);
			}
			var curCss3 = getCss3(element);
			var cssobj = css3format($.extend(curCss3, styles));
			element.style[PREFIX.css + "transform"] = cssobj.transform;
			$(element).css(PREFIX.css + "transform-origin", cssobj.origin);
			if (!justCss3) {
				$(element).css(cssobj.css2);
			}
		}
		function pauseanimation(element) {
			element = queryEle(element);
			if (!element) {
				return;
			}
			setcss3(element, "animationPlayState", "paused");
		}
		function resumeanimation(element) {
			setcss3(element, "animationPlayState", "running");
		}
		function stopanimation(element) {
			element = queryEle(element);
			if (!element) {
				return;
			}
			setcss3(element, "animationPlayState", "paused");
			setcss3(element, "animationName", "none");
			setcss3(element, "animationDuration", 0);
			setcss3(element, "animationTimingFunction", "linear");
			setcss3(element, "animationDelay", 0);
			setcss3(element, "animationIterationCount", "none");
			setcss3(element, "animationDirection", "none");
			setcss3(element, "animationFillMode", "none");
		}

		function runanimation(element, keyframe, options, _callback) {
			element = queryEle(element);
			if (!element) {
				return;
			}
			if (typeof keyframe == "undefined" || !keyframe) {
				return;
			}
			if (typeof options == "undefined" || !options) {
				options = {};
			} else if (typeof options == "function") {
				_callback = options;
				options = {};
			}
			var defaultOption = {
				speed: 400,
				easing: "linear",
				count: 1,
				delay: 0,
				direction: "normal",
				fillmode: "both"
			};
			options = Object.assign(defaultOption, options);
			if (!isNaN(options.speed)) {
				options.speed += "ms";
			}
			if (!isNaN(options.delay)) {
				options.delay += "ms";
			}
			var thecallback = _callback;
			setcss3(element, "animationName", keyframe);
			setcss3(element, "animationDuration", options.speed);
			setcss3(element, "animationTimingFunction", options.easing);
			setcss3(element, "animationDelay", options.delay);
			setcss3(element, "animationIterationCount", options.count);
			setcss3(element, "animationDirection", options.direction);
			setcss3(element, "animationPlayState", "running");
			setcss3(element, "animationFillMode", options.fillmode);
			if (typeof _callback == "undefined") {
				_callback = function() {};
			} else {
				_callback = function() {
					element.removeEventListener(PREFIX.js + "AnimationEnd", _callback, false);
					element.removeEventListener("animationend", _callback, false);
					setTimeout(function() {
						if (typeof thecallback == "function") {
							thecallback();
						}
					});
				};
			}
			element.addEventListener(PREFIX.js + "AnimationEnd", _callback, false);
			element.addEventListener("animationend", _callback, false);
		}

		function nopx(val) {
			return val.toString().replace("px", "");
		}

		function hasSameStyle(element, styles) {
			if (typeof styles != "object" || !element) {
				return false;
			}
			var curCss3 = getCss3(element);
			var isSame = true;
			for (var i in styles) {
				if (styles[i] != curCss3[i] && nopx(styles[i]) != nopx($(element).css(i))) {
					isSame = false;
					break;
				}
			}
			return isSame;
		}

		function css3animate(element, styles, speed, easing, _callback2) {
			element = queryEle(element);
			if (!element) {
				return;
			}

			// var self = this;
			// var property = "all";
			// var k = 0;
			if (typeof speed == "undefined") {
				speed = 400;
				easing = "linear";
			} else if (typeof speed == "function") {
				_callback2 = speed;
				speed = 400;
				easing = "linear";
			}
			if (typeof easing == "undefined") {
				easing = "linear";
			}
			if (typeof easing == "function") {
				_callback2 = easing;
				easing = "linear";
			}

			if (!support_css3("transform")) {
				$(element).animate(styles, speed, easing, _callback2);
				return;
			} else if (!support_css3("transition")) {
				setStyle(element, styles, true, true);
				$(element).animate(styles, speed, easing, _callback2);
				return;
			}
			//判断是否已经是当前的属性
			if (hasSameStyle(element, styles)) {
				if (typeof _callback2 == "function") {
					_callback2();
				}
				return;
			}

			var thecallback = _callback2;
			if (typeof _callback2 == "undefined") {
				_callback2 = function callback() {};
			} else {
				_callback2 = function callback() {
					element.removeEventListener("transitionend", _callback2, false);
					setTimeout(function() {
						if (typeof thecallback == "function") {
							thecallback();
						}
					});
				};
			}
			//console.log(support_css3("transition"));

			var duration = speed / 1000 + "s";
			var transitionstr = "all " + duration + " " + easing;
			$(element).css("transition", transitionstr);
			$(element).css(PREFIX.css + "transition", transitionstr);
			setStyle(element, styles, true);
			element.addEventListener("transitionend", _callback2, false);
		}
		return {
			set: function(element, styleObj) {
				setStyle(element, styleObj, false);
			},
			to: css3animate,
			keyframe: {
				run: runanimation,
				pause: pauseanimation,
				resume: resumeanimation,
				stop: stopanimation
			}
			// plugin: function(flag) {
			// 	if (!!flag && !!flag.fn) {
			// 		flag.fn.css = function(styleObj) {
			// 			setStyle($(this), styleObj, false);
			// 		};
			// 		var jqtransform = function(styles, speed, easing, callback) {
			// 			var total = $(this).length;
			// 			if (total > 1) {
			// 				var i = 0;
			// 				$(this).each(function() {
			// 					i++;
			// 					var curcallback = i == total ? callback : null;
			// 					css3animate($(this), styles, speed, easing, curcallback);
			// 				});
			// 			} else {
			// 				css3animate($(this), styles, speed, easing, callback);
			// 			}
			// 			return $(this);
			// 		};
			// 		flag.fn.transition = jqtransform;
			// 		flag.fn.keyframe = function(keyframe, options, callback) {
			// 			var total = $(this).length;
			// 			if (total > 1) {
			// 				var i = 0;
			// 				$(this).each(function() {
			// 					i++;
			// 					var curcallback = i == total ? callback : null;
			// 					runanimation($(this), keyframe, options, curcallback);
			// 				});
			// 			} else {
			// 				runanimation($(this), keyframe, options, callback);
			// 			}
			// 			return $(this);
			// 		};
			// 		flag.fn.pauseKeyframe = function() {
			// 			pauseanimation($(this));
			// 			return $(this);
			// 		};
			// 		flag.fn.resumeKeyframe = function() {
			// 			resumeanimation($(this));
			// 			return $(this);
			// 		};
			// 		flag.fn.stopKeyframe = function() {
			// 			stopanimation($(this));
			// 			return $(this);
			// 		};
			// 	} else {
			// 		console.error("请传入 jquery或者zpeto的变量");
			// 	}
			// }
		};
	};

	if (typeof exports === "object") {
		// CommonJS
		module.exports = Factory(require("../prefix/"), require("jquery"));
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define(["../prefix/", "jquery"], Factory);
	} else {
		// Global Variables
		if (!window.Foliou) {
			window.Foliou = {};
		}
		Foliou.Css3Animate = Factory(window.Foliou.Prefix, $);
	}
})();
