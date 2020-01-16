"use strict";
/**
    @author:pengzai
    @blog:http://foliou.focusbe.com
    @github:https://github.com/focusbe/foliou
**/
(function() {
	var definFun = function definFun($, DEVICE, Touch, Utli, Animate, Assets) {
		console.log(Animate);
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
			container = $(container);
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
				dock: true,
				direction: "horizontal",
				dock_trigger: "click",
				index_trigger: "click",
				time: 400,
				onClass: "active",
				autoPlay: true,
				autoDelayTime: 5000,
				loop: true,
				onStart: function onStart() {},
				onEnd: function onEnd() {}
			};
			var options = $.extend({}, defaultoption, options);
			var current = 0;
			var total = 0;
			var perDitance = 0;
			var canslide = true;
			var clock = null;
			var docks;
			var areaWdith;
			var isVer = isVer;
			var _init = function() {
				total = options.item.length;
				if (total <= 1) {
					return;
				}
				if (isVer) {
					imgLoaded(options.item.eq(0), function() {});
				} else {
					options.item.css({
						display: "inline-block"
					});
					options.item_list.css({
						whiteSpace: "nowrap",
						fontSize: 0
					});
				}
				//添加dock
				_addDock();
				addLoop();
				resize();
				bind();
				setAuto();
				// autoPlay();
				// self.goto(options.start);
				// judgeBtn(options.start);
			};
			var _imgLoaded = function(parent, cb) {
				if (!cb) {
					return;
				}
				var imgs = parent.find("img");
				if (imgs.length == 0) {
					cb(true);
				}
				var total = imgs.length;
				var loaded = 0;
				var checkisLoaded = function() {
					if (loaded >= total) {
						cb();
					}
				};
				imgs.each(function() {
					if (this.complete) {
						loaded++;
						checkisLoaded();
					} else {
						this.onload = function() {
							loaded++;
							checkisLoaded();
						};
						this.onerror = function() {
							loaded++;
							checkisLoaded();
						};
					}
				});
			};

			var addLoop = function() {
				//添加循环的时候 两边的元素
				var clonelast = options.item.eq(total - 1).clone();
				var clonefirst = options.item.eq(0).clone();
				if (isVer) {
					clonelast.css({
						marginTop: "-100%"
					});
				} else {
					clonelast.css({
						marginLeft: "-100%"
					});
				}
				options.item_list.prepend(clonelast);
				options.item_list.append(clonefirst);
			};
			var _addDock = function() {
				if (!!options.dock) {
					if (!options.dock_wrap) {
						options.dock_wrap = $("<div class='swiper-pagination'></div>");
						container.append(options.dock_wrap);
					}
				}
				if (options.dock_wrap) {
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
			};
			var setAuto = function(){
				if(!options.autoPlay){
					return;
				}
				if(!!clock){
					clearInterval(clock);
					clock = null;
				}
				clock = setInterval(function(){
					self.goto(current+1);
				}, options.autoDelayTime );
			}
			var resize = function() {
				if (isVer) {
					perDitance = options.item.outerHeight();
					areaWdith = options.item.outerWidth();
					container.css({
						height: perDitance
					});
				} else {
					perDitance = options.item.outerWidth();
					areaWdith = options.item.outerHeight();
					options.item_list.css({
						width: perDitance
					});
				}
			};

			this.goToNext = function() {
				self.goto(current + 1);
			};
			this.goto = function(index, auto) {
				// console.log(index);
				var offset = index - current;
				Animate.to(
					options.item_list,
					{
						x: -offset * perDitance
					},
					200,
					function() {
						//console.log(-index * 100 + "%");
						current = index % total;
						if (current < 0) {
							current += total;
						}
						//console.log(index);
						Animate.set(options.item_list, {
							x: 0,
							left: -current * 100 + "%"
						});
						judgeBtn(current);
					}
				);
			};
			var judgeBtn = function(index) {
				options.dock_wrap.find("span").removeClass(options.onClass);
				options.dock_wrap
					.find("span")
					.eq(index)
					.addClass(options.onClass);
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
			var bind = function() {
				container.find("img").on("mousedown", function(e) {
					e.preventDefault();
				});
				// if (options.next_btn) {
				// 	options.next_btn.bind("click", function() {
				// 		self.goto(current + 1, false, -1);
				// 	});
				// }
				// if (options.prev_btn) {
				// 	options.prev_btn.bind("click", function() {
				// 		self.goto(current - 1, false, 1);
				// 	});
				// }
				// if (options.index_btn) {
				// 	options.index_btn.bind(options.index_trigger, function() {
				// 		var index = $(this).index();
				// 		self.goto(index);
				// 	});
				// }
				// if (docks) {
				// 	docks.unbind(options.dock_trigger).bind(options.dock_trigger, function() {
				// 		var index = $(this).index();
				// 		self.goto(index);
				// 	});
				// }
				var isstart = false;
				var lastdelay;
				//var oldVal = parseInt(options.item_list.css("left"));
				var offset = 0;
				self.touch = new Touch(container[0], {
					start: function start(point) {
						isstart = true;
						// lastdelay = {
						// 	x: 0,
						// 	y: 0
						// };
						//oldVal = parseInt(options.item_list.css("left"));
						setAuto();
					},
					move: function move(delta) {
						if (!isstart) {
							return;
						}
						if (options.loop) {
							offset = isVer ? delta.y : delta.x;
						} else {
							var max = perDitance;
							var x = delta.x < max ? delta.x : max;
							var y = (x - (x * x) / (2 * max)) / 6;
							offset = y;
						}
						// setAuto();
						// console.log(x, y);
						// if(current==0){

						// }
						if (isVer) {
							Animate.set(options.item_list, {
								y: offset
							});
						} else {
							Animate.set(options.item_list, {
								x: offset
							});
						}
					},
					end: function end(point) {
						setAuto();
						// curY = point.y + curY;
						// curX = point.x + curX;
						// Animate.to(
						// 	options.item_list,
						// 	{
						// 		x: 0
						// 	},
						// 	100
						// );
						var bili = offset / perDitance;
						// console.log(bili);
						if (Math.abs(bili) > 0.2) {
							var direc = bili / Math.abs(bili);
							self.goto(current - direc);
						} else {
							self.goto(current);
						}
					}
				});
			};
			var autoPlay = function() {
				if (!options.autoPlay) {
					return;
				}
				clock = setInterval(function() {
					self.goto(current + 1, true);
				}, options.autoDelayTime);
			};
			_init();
		};
		return Swiper;
	};

	if (typeof exports === "object") {
		// CommonJS
		module.exports = definFun(require("jquery"), require("../device/index"), require("../touch/index"), require("../utli/index"), require("../animate/index"), require("./assets/index"));
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define(["jquery", "../device/index", "../touch/index", "../utli/index", "../animate/index", "./assets/index"], definFun);
	}
})();
