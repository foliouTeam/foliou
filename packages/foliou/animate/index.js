/**
    @author:pengzai
    @blog:http://foliou.focusbe.com
    @github:https://github.com/focusbe/foliou
**/
import PREFIX from "../prefix/index";
import $ from "jquery";
import Device from "../device/index";
import Utli from "../utli/index";
var support_css3 = Device.support_css3;
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
	deg: ["rotate(.*)", "skew(.*)"],
	px: ["width", "height", "x", "y", "translate(.+)", "margin(.*)", "padding(.+)"]
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
// function isSameStyle(str1, str2) {
// 	if (str1.toLowerCase() == str2.toLowerCase()) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// }

function getUnit(str) {
	var curArr;
	var returnUnit = "";
	for (var i in css3unit) {
		curArr = css3unit[i];
		for (var j in curArr) {
			if (curArr[j].indexOf('(') > -1) {
				if (str.match(new RegExp(curArr[j], "ig"))) {
					if (i == "no") {
						returnUnit = "";
					} else {
						returnUnit = i;
					}
					return returnUnit;
				}
			}
			else {
				if (curArr[j] == str) {
					if (i == "no") {
						returnUnit = "";
					} else {
						returnUnit = i;
					}
					return returnUnit;
				}
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

function getCss3(element) {
	element = Utli.query(element);
	// console.log(element);
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
	element = Utli.query(element);
	if (!element) {
		return;
	}
	if (element instanceof Array) {
		for (var i in element) {
			setcss3(element[i], style, value);
		}
		return;
	}
	element.style[PREFIX.js + upFirst(style)] = value;
	element.style[style] = value;
}

function setStyle(element, styles, animate, justCss3) {
	element = Utli.query(element);
	if (!element) {
		return;
	}
	if (element instanceof Array) {
		for (var i in element) {
			setStyle(element[i], styles, animate, justCss3);
		}
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
	if (!support_css3("animation")) {
		return;
	}
	element = Utli.query(element);
	if (!element) {
		return;
	}
	setcss3(element, "animationPlayState", "paused");
}
function resumeanimation(element) {
	if (!support_css3("animation")) {
		return;
	}
	setcss3(element, "animationPlayState", "running");
}
function stopanimation(element) {
	if (!support_css3("animation")) {
		return;
	}
	element = Utli.query(element);
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
	element = Utli.query(element);
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
	if (!support_css3("animation")) {
		if (typeof _callback == "function") {
			_callback();
		}
		return;
	}

	if (element instanceof Array) {
		var newcallback = null;
		for (var i in element) {
			if (i == element.length - 1 && !!_callback) {
				newcallback = _callback;
			}
			runanimation(element[i], keyframe, options, newcallback);
		}
		return;
	}

	var defaultOption = {
		speed: 400,
		easing: "linear",
		count: 1,
		delay: 0,
		direction: "normal",
		fillmode: "both"
	};
	options = $.extend(defaultOption, options);
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
		_callback = function () { };
	} else {
		_callback = function () {
			element.removeEventListener(PREFIX.js + "AnimationEnd", _callback, false);
			element.removeEventListener("animationend", _callback, false);
			setTimeout(function () {
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
	if (!val) {
		return "";
	}
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
	element = Utli.query(element);

	if (!element || !styles) {
		return;
	}
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

	if (element instanceof Array) {
		var newcallback;
		for (var i in element) {
			if (i == element.length - 1 && !!_callback2) {
				newcallback = _callback2;
			}
			css3animate(element[i], styles, speed, easing, newcallback);
		}
		return;
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
			setTimeout(_callback2, speed);
		}
		return;
	}

	var thecallback = _callback2;
	if (typeof _callback2 == "undefined") {
		_callback2 = function callback() { };
	} else {
		_callback2 = function callback() {
			element.removeEventListener("transitionend", _callback2, false);
			setTimeout(function () {
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
var Animate = {
	set: function (element, styleObj) {
		setStyle(element, styleObj, false);
	},
	getCss3: getCss3,
	to: css3animate,
	keyframe: {
		run: runanimation,
		pause: pauseanimation,
		resume: resumeanimation,
		stop: stopanimation
	}
};
export default Animate;