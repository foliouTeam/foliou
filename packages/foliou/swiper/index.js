"use strict";
/**
    @author:pengzai
    @blog:http://foliou.focusbe.com
    @github:https://github.com/focusbe/foliou
**/
(function() {
	var definFun = function definFun($, DEVICE, Touch) {
		if (typeof $ == "undefined") {
			console.warn("请加载jquery");
			return;
		}
		if (typeof DEVICE == "undefined") {
			console.warn("请加载device");
			return;
		}
		var Swiper = function Swiper(container, options) {
			var self = this;
			var defaultoption = {
				mode: "auto",
				className: {
					next: "next",
					prev: "prev"
				},
				animation: "slide",
				start: 0,
				item_list: container.children(".swiper-wrapper"),
				item: container.children(".swiper-wrapper").children(".swiper-slide"),
				next_btn: null,
				prev_btn: null,
				index_btn: null,
				dock_wrap: null,
				direction: "horizontal",
				dock_trigger: "click",
				index_trigger: "click",
				time: 400,
				onClass: "cur",
				autoPlay: true,
				autoDelayTime: 5000,
				loop: true,
				onStart: function onStart() {},
				onEnd: function onEnd() {}
			};
			var options = $.extend({}, defaultoption, options);
			var current = -1;
			var total = 0;
			var perwidth = 0;
			var canslide = true;
			var clock = null;
			var docks;
			var perHeight;
			this.init = function() {
				total = options.item.length;
				if (total <= 1) {
					return;
				}
				if (options.mode == "auto") {
					if (options.direction == "vertical") {
						perHeight = container.height();
						options.item.css({
							height: perHeight
						});
					} else {
						perwidth = options.item.outerWidth();
						options.item.not(options.item.eq(0)).css({
							position: "absolute",
							left: "-100%"
						});
					}
				}

				if (options.dock_wrap) {
					options.dock_wrap.css({
						zIndex: 200
					});
					var dock_wrap_html = "";
					for (var i = 0; i < total; i++) {
						if (i == 0) {
							dock_wrap_html += "<span class='" + options.onClass + "'></span>";
						} else {
							dock_wrap_html += "<span></span>";
						}
					}
					options.dock_wrap.html(dock_wrap_html);
					docks = options.dock_wrap.find("span");
				}
				self.bind();
				self.autoPlay();
				self.goto(options.start);
				self.judgeBtn(options.start);
			};
			this.resize = function() {
				if (options.direction == "vertical") {
					perHeight = container.height();
				} else {
					// options.item.css({ height: 'auto' });
					perwidth = options.item.outerWidth();
					perHeight = options.item.outerHeight();
					options.item_list.css({
						height: perHeight
					});
				}
				options.item.css({
					height: perHeight
				});
				// options.item.not(options.item.eq(current)).css({left:'-100%'})
			};
			this.goToNext = function() {
				self.goto(current + 1);
			};
			this.goto = function(index, auto, direction) {
				if (!canslide) {
					return;
				}
				if (current == index) {
					return;
				}
				canslide = false;
				if (index >= total) {
					if (options.loop) {
						index = 0;
					} else {
						canslide = true;
						return;
					}
				} else if (index < 0) {
					if (!options.loop) {
						canslide = true;
						return;
					}

					index = total - 1;
				}
				if (auto == undefined || (!auto && options.autoPlay)) {
					clearInterval(clock);
					clock = null;
				}
				options.onStart(current, index);
				var callback = function callback() {
					canslide = true;
					current = index;
					if (auto == undefined || (!auto && options.autoPlay)) {
						self.autoPlay();
					}
					if (typeof slideEnd == "function") {
						slideEnd();
					}
					self.judgeBtn(index);
				};
				if (options.mode == "auto") {
					if ((options.animation = "slide")) {
						if (typeof direction == "undefined") {
							var direction;
							if (auto) {
								direction = -1;
							} else {
								if (index > current) {
									direction = -1;
								} else {
									direction = 1;
								}
							}
						}

						if (direction < 0) {
							options.item.eq(index).css({
								left: perwidth
							});
							var nextLeft = -perwidth;
							var finishLeft = perwidth;
						} else {
							options.item.eq(index).css({
								left: -perwidth
							});
							var nextLeft = perwidth;
							var finishLeft = -perwidth;
						}

						options.item.eq(index).animate(
							{
								left: 0
							},
							options.time
						);
						options.item.eq(current).animate(
							{
								left: nextLeft
							},
							options.time,
							function() {
								$(this).css({
									left: finishLeft
								});
								callback();
							}
						);
					} else if (options.animation == "fade") {
						options.item.eq(index).css({
							zIndex: 10,
							opacity: 1
						});
						options.item.eq(current).css({
							zIndex: 20
						});
						options.item.eq(current).animate(
							{
								opacity: 0
							},
							options.time,
							function() {
								options.item.eq(current).css({
									zIndex: 0
								});
								callback();
							}
						);
					}
				} else {
					options.item
						.removeClass(options.onClass)
						.removeClass(options.className.next)
						.removeClass(options.className.prev);
					options.item.eq(index).addClass(options.onClass);
					var next = (index + 1) % total;
					var prev = (index - 1) % total;
					if (prev < 0) {
						prev += total;
					}
					options.item.eq(next).addClass(options.className.next);
					options.item.eq(prev).addClass(options.className.prev);
					callback();
				}
				if (options.index_btn) {
					options.index_btn.removeClass(options.onClass);
					options.index_btn.eq(index).addClass(options.onClass);
				}
				if (docks) {
					docks.removeClass(options.onClass);
					docks.eq(index).addClass(options.onClass);
				}
			};
			this.judgeBtn = function(index) {
				if (options.loop) {
					return;
				}
				if (options.next_btn && options.prev_btn) {
					if (index == total - 1) {
						options.prev_btn
							.css({
								opacity: 1,
								cursor: "pointer"
							})
							.show();
						options.next_btn
							.css({
								opacity: 0.8,
								cursor: "default"
							})
							.hide();
					} else if (index == 0) {
						options.prev_btn
							.css({
								opacity: 0.8,
								cursor: "default"
							})
							.hide();
						options.next_btn
							.css({
								opacity: 1,
								cursor: "pointer"
							})
							.show();
					} else {
						options.next_btn
							.css({
								opacity: 1,
								cursor: "pointer"
							})
							.show();
						options.prev_btn
							.css({
								opacity: 1,
								cursor: "pointer"
							})
							.show();
					}
				}
			};
			this.bind = function() {
				if (options.next_btn) {
					options.next_btn.bind("click", function() {
						self.goto(current + 1, false, -1);
					});
				}
				if (options.prev_btn) {
					options.prev_btn.bind("click", function() {
						self.goto(current - 1, false, 1);
					});
				}
				if (options.index_btn) {
					options.index_btn.bind(options.index_trigger, function() {
						var index = $(this).index();
						self.goto(index);
					});
				}
				if (docks) {
					docks.unbind(options.dock_trigger).bind(options.dock_trigger, function() {
						var index = $(this).index();
						self.goto(index);
					});
				}
				var isstart = false;
				self.touch = new Touch(container[0], {
					start: function start(point) {
						isstart = true;
						var lastdelay = {
							x: 0,
							y: 0
						};
					},
					move: function move(delta) {
						if (!isstart) {
							return;
						}
						if (options.direction != "vertical") {
							if (Math.abs(delta.x) > 20 && Math.abs(delta.y) < 5) {
								self.goto(current - delta.x / Math.abs(delta.x));
								isstart = false;
							}
						} else {
							if (Math.abs(delta.y) > 20 && Math.abs(delta.x) < 5) {
								self.goto(current + delta.y / Math.abs(delta.y));
								isstart = false;
							}
						}
						// var offset = {
						//     x: delta.x - lastdelay.x,
						//     y: delta.y - lastdelay.y
						// };
						// console.log(offset);
						// if (options.direction == 'vertical') {
						//     var willY = delta.y + curY;
						//     var bili = 1 - willY / 300;
						//     options.item_list.css3animate({
						//         y: willY
						//     }, 100, false);
						// }
						// else{
						//     var willX = delta.x + curX;
						//     options.item_list.css({
						//         x: willX
						//     }, 100, false);
						// }
						//lastdelay = delta;
					},
					end: function end(point) {
						// curY = point.y + curY;
						// curX = point.x + curX;
					}
				});
				// $(window).resize(function() {
				//     self.resize();
				// });
			};
			this.autoPlay = function() {
				if (!options.autoPlay) {
					return;
				}
				clock = setInterval(function() {
					self.goto(current + 1, true);
				}, options.autoDelayTime);
			};
			this.init();
		};
		return Swiper;
	};

	if (typeof exports === "object") {
		// CommonJS
		module.exports = definFun(require("jquery"), require("../device/index"), require("../touch/index"), require("./assets"));
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define(["jquery", "../device/index", "../touch/index"], definFun);
	}
})();
