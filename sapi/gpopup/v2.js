"use strict";

/**
    @author:liupeng
    @email:1049047649@qq.com
    @blog:http://blog.focusbe.com
    @github:https://github.com/focusbe
**/
define(['jquery', "device/main"], function ($, DEVICE) {
	//弹窗
	var wh;
	var gPopup = function gPopup(coverEle, options) {
		"use strict";

		var defaultOption = {
			animation: 'fade',
			time: 300,
			video: null, //内嵌的视频对象
			auto: true,
			padding: 100, //弹窗距离上下的距离
			replace: true, //窗口模式 replaceF 表示当已经有一个窗口打开时，将会替换当前窗口
			zIndex: 3000,
			scrollObj: 'this',
			startShow: function startShow(obj) {},
			endShow: function endShow(obj) {},
			startHide: function startHide(obj) {},
			endHide: function endHide(obj) {}
		};
		options = $.extend(defaultOption, options);
		var self = this;
		this.animation = options.animation;
		this.curCover = [];
		this.curZindex = options.zIndex;
		this.time = options.time;
		this.scrollArray = {};
		if (typeof window.gpopupcoverid == 'undefined') {
			window.gpopupcoverid = 0;
		}
		this.init = function () {
			// if(options.scrollObj&&DEVICE.isMobile)
			// {
			// 	if(!hasIscroll())
			// 	{
			// 		return;
			// 	}
			// }
			if ($("#overlay").length < 1) {
				$('body').append("<div style='position: fixed!important;_position:fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: " + self.curZindex + "; background: rgb(0, 0, 0);display:none;' id='overlay'><div style='position: fixed!important;_position:fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 0;display:block;overflow-y:scroll' id='lock'></div></div>");
				// var cssStr="<style>.GPOPUP_ELEMENT::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); -webkit-border-radius: 10px;border-radius: 10px;}/* Handle */.GPOPUP_ELEMENT::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background:rgba(144,24,53,0.7); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }.GPOPUP_ELEMENT::-webkit-scrollbar-thumb:window-inactive {background: rgba(144,24,53,0.4);}</style>";
				// $('body').append(cssStr);
			}
			self.setCoverInit();
			self.bind();
		};
		this.setCoverInit = function () {
			coverEle.each(function () {
				$(this).css({ display: 'block', opacity: 0, top: '1000%' });
				$(this).css({ zIndex: self.curZindex, left: "50%", marginTop: -$(this).outerWidth() / 2 + "px", marginLeft: -$(this).outerWidth() / 2 + "px" });
				$(this).attr('data-state', 'hide');
				$(this).attr('data-gcoverid', window.gpopupcoverid++);
			});
			if (DEVICE.isIe6) {
				coverEle.css({ position: 'absolute' });
			} else {
				coverEle.css({ position: 'fixed' });
			}
		};
		this.setVideo = function (video) {
			options.video = video;
		};
		this.bind = function () {
			if (DEVICE.isIe6) {
				$("#overlay").height($('body').height());
			}
			$(window).bind("resize", function () {
				for (var i in self.curCover) {
					self.setCover(self.curCover[i]);
				}
			});
			coverEle.each(function () {
				var $this = $(this);
				$(this).find(".close,.confirm").unbind('click').bind('click', function () {
					self.hide($this);
				});
			});
		};
		this.setScroll = function (obj, scrollobj) {
			wh = document.body.clientHeight;
			scrollobj.addClass('GPOPUP_SCROLLER');
			scrollobj.css('height', 'auto');
			if (scrollobj.outerHeight() > wh - options.padding * 2) {
				scrollobj.height(wh - options.padding * 2);
				scrollobj.css({ 'overflow': 'auto' });
			}
			if (typeof scrollobj.data('gpopupcoverid') == 'undefined' && scrollobj.outerHeight() > obj.height()) {
				scrollobj.height(obj.height());
			}
			if (DEVICE.isPc) {} else {
				scrollobj.css({ '-webkit-overflow-scrolling': 'touch' });
				var startPoint, endPoint;
				if (DEVICE.isMobile && typeof scrollobj.data('bindEvent') == 'undefined') {
					scrollobj[0].addEventListener('touchstart', function (event) {
						startPoint = event.changedTouches[0].pageY;
					});
					scrollobj[0].addEventListener('touchmove', function (event) {
						endPoint = event.changedTouches[0].pageY;
						// console.log(endPoint-startPoint);
						// console.log(scrollobj.scrollTop()+scrollobj.height());
						// console.log(scrollobj.scrollTop());
						if (endPoint - startPoint > 0) {
							if (scrollobj.scrollTop() > 0) {
								event.stopPropagation();
							} else {
								// console.log('不能滚动了');
							}
						} else if (scrollobj.scrollTop() + scrollobj.height() < scrollobj[0].scrollHeight) {
							event.stopPropagation();
						} else {
							// console.log('不能滚动了');
						}
						startPoint = endPoint;
					});
					scrollobj.attr('data-bindEvent', true);
				}
			}
		};
		this.setCover = function (obj) {
			//窗口变化是改变当前弹窗的样式
			if (typeof obj == 'undefined' || !obj || obj.attr('data-state') == 'hide') {
				return;
			}
			var coverHeight, coverTop, index;
			wh = document.body.clientHeight;
			obj.each(function () {
				if (options.scrollObj) //容许出滚动条
					{
						if (options.scrollObj == 'this') {
							var coverScroll = $(this).find(".scroller");
							if (coverScroll.length == 0) {
								coverScroll = $(this);
							}
							self.setScroll($(this), coverScroll);
						} else {
							self.setScroll($(this), $(this).find(options.scrollObj));
						}
						$(this).css({ top: '50%', marginTop: -$(this).outerHeight() / 2 });
					} else {
					$(this).css({ overflow: 'visible' });
				}
				coverHeight = $(this).outerHeight();
				if (DEVICE.isIe6) {
					var scrollTop = $(window).scrollTop();
					$(this).css({ "top": $(window).height() / 2 + scrollTop + "px", marginTop: -coverHeight / 2 });
				} else {
					$(this).css({ top: '50%', marginTop: -coverHeight / 2 });
				}
			});
		};
		this.resize = function (obj, cssobj) {
			obj.css(cssobj);
		}, this.show = function (obj, animation, time, callbFn) {
			if (typeof obj == 'undefined' || !obj || obj.attr('data-state') == 'show' || obj.attr('data-state') == 'showing') {
				return;
			}
			if (typeof animation == 'function') {
				callbFn = animation;
				animation = self.animation;
			} else if (typeof animation == 'undefined' || !animation) {
				animation = self.animation;
			}
			if (typeof time == 'function') {
				callbFn = time;
				time = self.time;
			} else if (typeof time == 'undefined' || !time) {
				time = self.time;
			}
			var callback = function callback() {
				obj.attr('data-state', 'show');
				options.endShow(obj);
				if (typeof callbFn == 'function') {
					callbFn();
				}
			};
			options.startShow(obj);
			if (options.auto && options.video) {
				options.video.play();
			}
			obj.attr('data-state', 'showing');
			obj.attr('data-animation', animation);
			self.setCover(obj);
			//判断窗口模式 是否需要关闭原来的窗口
			self.curCover.push(obj);
			self.showoverlay(time);
			if (self.curCover.length > 1 && options.replace) {
				self.hide(self.curCover[self.curCover.length - 2], animation);
			}
			self.curZindex++;
			if (DEVICE.isIe7) {
				obj.stop().css({ zIndex: self.curZindex, opacity: 1, display: 'block', marginLeft: -obj.outerWidth() / 2 + "px", marginTop: -obj.outerHeight() / 2 + 'px' });
				callback();
			} else if (animation == 'fade') {
				obj.stop().css({ zIndex: self.curZindex, opacity: 0, display: 'block', marginLeft: -obj.outerWidth() / 2 + "px", marginTop: -obj.outerHeight() / 2 + 'px' }).animate({ opacity: 1, display: 'block' }, time, 'swing', function () {
					callback();
				});
			} else if (animation == 'fadedown') {
				obj.css({ zIndex: self.curZindex, marginTop: -obj.outerHeight() / 2 - 150 + 'px', marginLeft: -obj.outerWidth() / 2 + "px", opacity: 0, display: 'block' }).stop().animate({ marginTop: -obj.outerHeight() / 2 + 'px', opacity: 1 }, time, 'swing', function () {
					callback();
				});
			} else if (animation == 'fadeup') {
				obj.css({ zIndex: self.curZindex, marginTop: -obj.outerHeight() / 2 + 150 + 'px', marginLeft: -obj.outerWidth() / 2 + "px", opacity: 0, display: 'block' }).stop().animate({ marginTop: -obj.outerHeight() / 2 + 'px', opacity: 1 }, time, 'swing', function () {
					callback();
				});
			}
		};
		this.hide = function (obj, animation, time, callbFn) {
			if (typeof obj == 'undefined' || !obj || obj.attr('data-state') == 'hide' || obj.attr('data-state') == 'hiding') {
				return;
			}
			if (typeof animation == 'function') {
				callbFn = animation;
				animation = undefined;
			}
			if (typeof animation == 'undefined' || !animation) {
				if (typeof obj.data('animation') != 'undefined') {
					animation = obj.data('animation');
				} else {
					animation = self.animation;
				}
			}
			if (typeof time == 'function') {
				callbFn = time;
				time = self.time;
			} else if (typeof time == 'undefined' || !time) {
				time = self.time;
			}

			obj.attr('data-state', 'hiding');

			var callback = function callback() {
				if (self.curCover == 0) {
					$('body,html').css({ overflow: 'auto' });
					$('html').css({ marginRight: 0 });
				}
				obj.attr('data-state', 'hide');
				if (typeof callbFn == 'function') {
					callbFn();
				}
				if (options.video) {
					options.video.stop();
				}
				options.endHide(obj);
			};
			options.startHide(obj);
			self.curZindex--;
			if (DEVICE.isIe7) {
				obj.stop().hide();
				callback();
			} else if (animation == 'fade') {
				obj.stop().animate({ opacity: 0 }, time * 0.6, 'swing', function () {
					obj.css({ top: '1000%' });
					callback();
				});
			} else if (animation == 'fadedown') {
				obj.each(function () {
					var $this = $(this);
					$(this).stop().animate({ marginTop: -$(this).outerHeight() / 2 - 150 + 'px', opacity: 0 }, time, 'swing', function () {
						$this.css({ 'top': '1000%' });
						callback();
					});
				});
			} else if (animation == 'fadeup') {
				obj.each(function () {
					var $this = $(this);
					$(this).stop().animate({ marginTop: -$(this).outerHeight() / 2 + 150 + 'px', opacity: 0 }, time, 'swing', function () {
						$this.css({ 'top': '1000%' });
						callback();
					});
				});
			}
			self.hideoverlay(time);
			for (var i in self.curCover) {
				if (obj.data('gpopupcoverid') == self.curCover[i].data('gpopupcoverid')) {
					self.curCover.splice(i, 1);
					break;
				}
			}
		};
		this.init();
		this.showoverlay = function (time) {
			self.curZindex++;
			if (self.curCover.length > 1) {
				$("#overlay").css({ zIndex: self.curZindex });
			} else {
				if ($("#overlay").css('display') == 'none') {
					$("#overlay").css({ opacity: '0', display: 'block' });
				}
				$("#overlay").css({ zIndex: self.curZindex });
				$("#overlay").stop().animate({ opacity: 0.6 }, time, function () {});
				$("#lock").show();
				var scrollbar = getScrollBarWidth();
				if (!scrollbar.hasscroll) {
					$("#lock").css({ overflowY: 'hidden', zIndex: self.curZindex });
					$('body,html').css({ overflow: 'hidden' });
				} else {
					$("#lock").css({ overflowY: 'scroll' });
					$('body,html').css({ overflow: 'hidden' });
					$('html').css({ marginRight: scrollbar.vertical });
				}
				canttouch();
			}
		};
		this.hideoverlay = function (time) {
			self.curZindex--;

			if (self.curCover.length > 1) {
				$("#overlay").css({ zIndex: self.curZindex - 1 });
			} else {
				$("#overlay").stop().animate({ 'opacity': 0 }, time, function () {
					$("#overlay").css({ display: 'none', zIndex: self.curZindex - 1 });
					cantouch();
				});
				$("#lock").css({ overflowY: 'hidden' });
				$("#lock").fadeOut(time);
			}
		};
	};
	function canttouch() {
		if (!DEVICE.isMobile) {
			return;
		}
		document.addEventListener('touchmove', touchmovePrevent, false);
		$("body,html").css({ overflow: 'hidden' });
	}
	function cantouch() {
		if (!DEVICE.isMobile) {
			return;
		}
		document.removeEventListener('touchmove', touchmovePrevent);
		$("body,html").css({ overflow: 'auto' });
	}
	function touchmovePrevent(e) {
		e.preventDefault();
	}
	if ($) {
		(function ($) {
			$.fn.gpopup = function (params) {
				return new gPopup($(this), params);
			};
		})($);
	}
	var __scrollBarWidth = 0;
	function getScrollBarWidth() {
		var wh = $(window).height();

		if (DEVICE.isMobile || !(document.body.style.overflow != "hidden" && document.body.scroll != "no" && document.body.scrollHeight > wh)) {

			return { vertical: 0, hasscroll: false };
		}
		if (__scrollBarWidth) return __scrollBarWidth;
		var scrollBarHelper = document.createElement("div");
		// if MSIE
		// 如此设置的话，scroll bar的最大宽度不能大于100px（通常不会）。
		scrollBarHelper.style.cssText = "overflow:scroll;width:100px;height:100px;";
		// else OTHER Browsers:
		// scrollBarHelper.style.cssText = "overflow:scroll;";
		document.body.appendChild(scrollBarHelper);
		if (scrollBarHelper) {
			__scrollBarWidth = {
				horizontal: scrollBarHelper.offsetHeight - scrollBarHelper.clientHeight,
				vertical: scrollBarHelper.offsetWidth - scrollBarHelper.clientHeight,
				hasscroll: true
			};
		}
		document.body.removeChild(scrollBarHelper);
		return __scrollBarWidth;
	}
	return gPopup;
});