'use strict';

/**
    @author:liupeng
    @email:1049047649@qq.com
    @blog:http://blog.focusbe.com
    @github:https://github.com/focusbe
**/
define(['jquery'], function ($) {
    //获取前缀
    var support_css3 = (function () {
        var div = document.createElement('div'),
            vendors = 'Ms O Moz Webkit'.split(' '),
            len = vendors.length;

        return function (prop) {
            if (prop in div.style) return true;

            prop = prop.replace(/^[a-z]/, function (val) {
                return val.toUpperCase();
            });

            while (len--) {
                if (vendors[len] + prop in div.style) {
                    return true;
                }
            }
            return false;
        };
    })();


    if (!support_css3('transform')) {
        return function () {};
    }
    var PREFIX = function () {
        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1],
            dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
        return {
            dom: dom,
            lowercase: pre,
            css: '-' + pre + '-',
            js: pre
        };
    }();

    (function ($) {
        var upFirst = function upFirst(str) {
            // str = str.toLowerCase();
            var strarr = str.split(' ');
            var result = '';
            for (var i in strarr) {
                result += strarr[i].substring(0, 1).toUpperCase() + strarr[i].substring(1) + '';
            }
            return result;
        };
        var css3unit = {
            'deg': ['rotate', 'skew'],
            'no': ['scale', 'origin', 'opacity', 'zIndex', 'z-index']
        };
        var transformStyle = ['scale', 'rotate', 'translate', 'skew', 'perspective'];

        function istransformstyle(style) {
            if (style == 'x' || style == 'y' || style == 'z') {
                style = 'translate';
            }
            for (var i in transformStyle) {
                if (isSameStyle(style, transformStyle[i])) {
                    return true;
                }
            }
            return false;
        }

        function getUnit(str) {
            var curUnit;
            var curArr;
            var returnUnit = 'px';
            for (var i in css3unit) {
                curArr = css3unit[i];
                for (var j in curArr) {
                    if (isSameStyle(curArr[j], str)) {
                        if (i == 'no') {
                            returnUnit = '';
                        } else {
                            returnUnit = i;
                        }
                        return returnUnit;
                    }
                }
            }
            return returnUnit;
        }

        function isSameStyle(str1, str2) {
            if (str1.toLowerCase() == str2.toLowerCase()) {
                return true;
            } else {
                return false;
            }
        }
        $.fn.getCss3 = function () {
            var transformstr = $(this)[0].style[PREFIX.js + 'Transform'];
            var temp = transformstr.split(' ');
            var key;
            var value;
            var temkeyvalue;
            var styleObj = {};
            for (var i in temp) {
                temkeyvalue = temp[i].split('(');
                if (temkeyvalue.length < 2) break;
                key = $.trim(temkeyvalue[0]);
                if (key == 'translateX') key = 'x';
                if (key == 'translateY') key = 'y';
                if (key == 'translateZ') key = 'z';
                value = $.trim(temkeyvalue[1].replace(')', '').replace('px', ''));
                styleObj[key] = value;
            }
            return styleObj;
        };

        $.fn.setcss3 = function (style, value) {
            $(this)[0].style[PREFIX.js + upFirst(style)] = value;
            $(this)[0].style[style] = value;
        };

        $.fn.css3 = function (styles, animate, callback) {
            // console.log(styles);
            var styleObj = {};
            var temp;
            if (typeof styles == 'string') {
                if (styles == 'x' || styles == 'y' || styles == 'z') {
                    styles = 'translate' + styles;
                }
                if (istransformstyle(styles)) {
                    var transformstr = $(this)[0].style.transform;
                    var temp = transformstr.split(' ');
                    var key;
                    var value;
                    var temkeyvalue;
                    for (var i in temp) {
                        temkeyvalue = temp[i].split('(');
                        key = $.trim(temkeyvalue[0]);
                        value = $.trim(temkeyvalue[1].replace(')', '').replace('px', ''));
                        styleObj[key] = value;
                    }
                    return styleObj[styles];
                    //transformstr = window.getComputedStyle($(this)[0]);
                } else {
                    return $(this).css('styles');
                }
                return;
            }
            if (typeof animate == 'undefined') animate = false;
            else if (typeof animate == 'function') {
                callback = animate;
                animate = false;
            }
            if (!animate) {
                var transitionstr = 'all 0s linear';
                $(this).css('transition', transitionstr);
                $(this).css(PREFIX.css + 'transition', transitionstr);
            }
            var cssobj = css3format($.extend($(this).getCss3(), styles));
            // console.log(cssobj);
            //$(this).css('transform',cssobj.transform);
            //$(this).css(PREFIX.css+'transform',cssobj.transform);
            $(this)[0].style[PREFIX.css + 'transform'] = cssobj.transform;
            //$(this).css('transform-origin',cssobj.origin);
            $(this).css(PREFIX.css + 'transform-origin', cssobj.origin);
            $(this).css(cssobj.css2);
            setTimeout(function () {
                if (typeof callback == 'function') {
                    callback();
                }
            });
            return $(this);
        };
        $.fn.pauseanimation = function () {
            $(this).setcss3('animationPlayState', 'paused');
        };
        $.fn.resumeanimation = function () {
            $(this).setcss3('animationPlayState', 'running');
        };
        $.fn.stopanimation = function () {
            $(this).setcss3('animationPlayState', 'paused');
            $(this).setcss3('animationName', 'none');
            $(this).setcss3('animationDuration', 0);
            $(this).setcss3('animationTimingFunction', 'linear');
            $(this).setcss3('animationDelay', 0);
            $(this).setcss3('animationIterationCount', 'none');
            $(this).setcss3('animationDirection', 'none');
            $(this).setcss3('animationFillMode', 'none');
        };
        $.fn.stopcss2 = $.fn.stop;
        $.fn.stop = function () {
            $(this).stopanimation();
            $(this).pausetranstion();
            $(this).stopcss2();
            return $(this);
        };
        $.fn.pausetranstion = function () {
            var computedStyle = window.getComputedStyle($(this)[0], null);

            $(this).attr('paused_style', $(this)[0].style);
        };
        $.fn.runanimation = function (keyframe, options, _callback) {

            if (typeof keyframe == 'undefined' || !keyframe) {
                return;
            }
            if (typeof options == 'undefined' || !options) {
                options = {};
            } else if (typeof options == 'function') {
                _callback = options;
                options = {};
            }
            var defaultOption = {
                speed: 400,
                easing: 'linear',
                count: 1,
                delay: 0,
                direction: 'normal',
                fillmode: 'both'
            };
            options = $.extend(defaultOption, options);
            if (!isNaN(options.speed)) {
                options.speed += 'ms';
            }
            if (!isNaN(options.delay)) {
                options.delay += 'ms';
            }
            var thecallback = _callback;
            $(this).setcss3('animationName', keyframe);
            $(this).setcss3('animationDuration', options.speed);
            $(this).setcss3('animationTimingFunction', options.easing);
            $(this).setcss3('animationDelay', options.delay);
            $(this).setcss3('animationIterationCount', options.count);
            $(this).setcss3('animationDirection', options.direction);
            $(this).setcss3('animationPlayState', 'running');
            $(this).setcss3('animationFillMode', options.fillmode);
            if (typeof _callback == 'undefined') {
                _callback = function callback() {};
            } else {
                _callback = function callback() {
                    $(self)[0].removeEventListener(PREFIX.js + 'AnimationEnd', _callback, false);
                    setTimeout(function () {
                        if (typeof thecallback == 'function') {
                            thecallback();
                        }
                    });
                };
            }
            $(this)[0].addEventListener(PREFIX.js + 'AnimationEnd', _callback, false);
            return $(this);
        };
        $.fn.css3animate = function (styles, speed, easing, _callback2) {
            var self = this;
            var property = 'all';
            var k = 0;
            if (typeof speed == 'undefined') {
                speed = 400;
                easing = 'linear';
            } else if (typeof speed == 'function') {
                _callback2 = speed;
                speed = 400;
                easing = 'linear';
            }
            if (typeof easing == 'undefined') {
                easing = 'linear';
            }
            if (typeof easing == 'function') {
                _callback2 = easing;
                easing = 'linear';
            }
            var thecallback = _callback2;
            if (typeof _callback2 == 'undefined') {
                _callback2 = function callback() {};
            } else {
                _callback2 = function callback() {
                    $(self)[0].removeEventListener("transitionend", _callback2, false);
                    setTimeout(function () {
                        if (typeof thecallback == 'function') {
                            thecallback();
                        }
                    });
                };
            }
            var duration = speed / 1000 + 's';
            var transitionstr = 'all ' + duration + ' ' + easing;
            $(this).css('transition', transitionstr);
            $(this).css(PREFIX.css + 'transition', transitionstr);
            $(this).css3(styles, true);
            $(this)[0].addEventListener("transitionend", _callback2, false);
            return $(this);
        };

        function css3format(styles) {
            var transformstr = '';
            var originstr = '50% 50%';
            var curvalue;
            var css2style = {};
            for (var i in styles) {
                curvalue = styles[i];
                // console.log(i);
                var unit = getUnit(i);
                if (!isNaN(curvalue)) {
                    curvalue = curvalue + unit;
                    // console.log(curvalue);
                    // console.log(unit);
                }
                switch (i) {
                    case 'translate':
                        transformstr += 'translate(' + curvalue + ',' + curvalue + ') ';
                        break;
                    case 'x':
                        transformstr += 'translateX(' + curvalue + ') ';
                        break;
                    case 'y':
                        transformstr += 'translateY(' + curvalue + ') ';
                        break;
                    case 'z':
                        transformstr += 'translateZ(' + curvalue + ') ';
                        break;
                    case 'scaleX':
                        transformstr += 'scaleX(' + curvalue + ') ';
                        break;
                    case 'scaleY':
                        transformstr += 'scaleY(' + curvalue + ') ';
                        break;
                    case 'scaleZ':
                        transformstr += 'scaleZ(' + curvalue + ') ';
                        break;
                    case 'scale':
                        transformstr += 'scale(' + curvalue + ') ';
                        break;
                    case 'rotate':
                        transformstr += 'rotate(' + curvalue + ') ';
                        break;
                    case 'rotateX':
                        transformstr += 'rotateX(' + curvalue + ') ';
                        break;
                    case 'rotateY':
                        transformstr += 'rotateY(' + curvalue + ') ';
                        break;
                    case 'rotateZ':
                        transformstr += 'rotateZ(' + curvalue + ') ';
                        break;
                    case 'skewX':
                        transformstr += 'skewX(' + curvalue + ') ';
                        break;
                    case 'skewY':
                        transformstr += 'skewY(' + curvalue + ') ';
                        break;
                    case 'skew':
                        transformstr += 'skew(' + curvalue + ') ';
                        break;
                    case 'perspective':
                        transformstr += 'perspective(' + curvalue + ') ';
                        break;
                    case 'origin':
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
    })($);
});