"use strict";
(function() {
	var _typeof =
		typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
			? function(obj) {
					return typeof obj;
			  }
			: function(obj) {
					return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
			  };

	function _defineProperty(obj, key, value) {
		if (key in obj) {
			Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
		} else {
			obj[key] = value;
		}
		return obj;
	}
	var definFun = function definFun($, Popup, DEVICE, PREFIX, Assets) {
		//Do setup work here
		//获取前缀
		if (typeof $ == "undefined") {
			console.warn("请加载jquery");
			return;
		}
		if (typeof DEVICE == "undefined") {
			console.warn("请加载device");
			return;
		}
		if (typeof Popup == "undefined") {
			console.warn("请加载Popup");
			return;
		}
		if (typeof PREFIX == "undefined") {
			console.warn("请加载PREFIX");
			return;
		}
		//检测是否支持flash
		// var checkFlash = function checkFlash() {
		//     if (typeof window.ActiveXObject != "undefined") {
		//         return new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
		//     } else {
		//         return navigator.plugins["Shockwave Flash"];
		//     }
		// };
		//检测是否支持HTML5
		function checkVideo() {
			var ua = navigator.userAgent;
			var ualow = ua.toLowerCase();
			var isIE11 = ualow.toLowerCase().indexOf("trident") > -1 && ualow.indexOf("rv") > -1;
			if (DEVICE.isIe && !isIE11) {
				return false;
			}
			if (!!document.createElement("video").canPlayType) {
				var vidTest = document.createElement("video");
				var oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
				if (!oggTest) {
					var h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
					if (!h264Test) {
						return false;
					} else {
						if (h264Test == "probably") {
							return true;
						} else {
							return false;
						}
					}
				} else {
					if (oggTest == "probably") {
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		}

		var prefix = PREFIX;
		function Player(container, options, videoindex) {
			container = $(container);
			if (!container || container.length == 0) return;
			if (typeof videoindex == "undefined") {
				if (typeof window.PlayervideoIndex == "undefined") {
					window.PlayervideoIndex = 0;
				}
				videoindex = window.PlayervideoIndex++;
			}
			var ismicro = navigator.appName.indexOf("Microsoft") != -1;
			var self = this;
			var player;
			var defaultoption = {
				file: "",
				width: "100%",
				muted: false,
				height: "auto",
				auto: false,
				mode: "auto",
				debug: false,
				image: "",
				version: "v2",
				volume: 1,
				download: false,
				loop: false,
				toolbar: true,
				ratio: 0.6, //高宽比例
				swf: "//siteres.ztgame.com/site/js/gplayer/v3/gplayer.swf",
				color: "#FF9000",
				fillColor: "#fff",
				fullScreen: false,
				onComplete: function onComplete(index) {},
				onPlay: function onPlay(index) {},
				onPause: function onPause(index) {},
				onReplay: function onReplay(index) {},
				onInit: function onInit(index) {},
				onResize: function onResize(index) {},
				mobile: {},
				pc: {}
			};
			if (DEVICE.isMobile) {
				options = $.extend(options, options.mobile);
			} else {
				options = $.extend(options, options.pc);
			}
			options = $.extend(defaultoption, options);
			options.width = options.width.toString();
			options.height = options.height.toString();
			var curmode;
			function choosemode(curfile) {
				if (!curfile) {
					curfile = "";
				}
				if (options.mode == "auto") {
					if (checkVideo()) {
						return "html5";
					}
					return "flash";
				} else {
					return options.mode;
				}
			}

			function setup() {
				var mode = choosemode();
				if (!mode) {
					console.log("当前视频格式不支持");
					return;
				}
				if (curmode != mode) {
					player = null;
					if (mode == "html5") {
						player = new Html5Player();
						self.videoElement = player.videoElement;
					} else if ((mode = "flash")) {
						player = new flashPlayer();
					}
					bindPlayerFun();
				}
			}

			var e = {
				mp4: "video/mp4",
				vorbis: "audio/ogg",
				ogg: a + "video/ogg",
				webm: "video/webm",
				aac: "audio/mp4",
				mp3: "audio/mpeg",
				hls: "application/vnd.apple.mpegurl"
			};
			var formats = {
					mp4: e.mp4,
					f4v: e.mp4,
					m4v: e.mp4,
					mov: e.mp4,
					m4a: e.aac,
					f4a: e.aac,
					aac: e.aac,
					mp3: e.mp3,
					ogv: e.ogg,
					ogg: e.vorbis,
					oga: e.vorbis,
					webm: e.webm,
					m3u8: e.hls,
					hls: e.hls
				},
				a = "video",
				a = {
					flv: a,
					f4v: a,
					mov: a,
					m4a: a,
					m4v: a,
					mp4: a,
					aac: a,
					f4a: a,
					mp3: "sound",
					smil: "rtmp",
					m3u8: "hls",
					hls: "hls"
				};
			//html5视频播放器

			function Html5Player() {
				curmode = "html5";
				if (!isNaN(options.width)) {
					options.width = options.width + "px";
				}
				if (!isNaN(options.height)) {
					options.height = options.height + "px";
				}
				var self = this;
				var videoplayer, videoElement, changedtime, playbtn, Playervideowrap, timehander, controlbar, loading, Playercontainer, optiondiv, controlbarclock, playpausbtn, totaltimepanel, currenttimepanel, loadedbar, playedbar, totaltime, timerail, fullscreen_button, Playeroverlayposter, PlayerTimeTotal;
				var colorhex = hexToRGB(options.color);
				var dockcolor1 = options.color;
				var dockcolor2 = options.color;
				var dockcolor3 = options.color;
				if (colorhex) {
					dockcolor1 = "rgba(" + colorhex[0] + "," + colorhex[1] + "," + colorhex[2] + ",1)";
					dockcolor2 = "rgba(" + colorhex[0] + "," + colorhex[1] + "," + colorhex[2] + ",0.3)";
					dockcolor3 = "rgba(" + colorhex[0] + "," + colorhex[1] + "," + colorhex[2] + ",0.9)";
				}
				var controlhtml = "";

				if ($("#Player_template").length == 0) {
					var gaplyer_template = document.createElement("script");
					gaplyer_template.setAttribute("id", "Player_template");
					var body = document.getElementsByTagName("body")[0];
					body.appendChild(gaplyer_template);
					$(gaplyer_template).append($(Assets["html/html5.html"]));
					// $(".Player_download_btn")
				}
				var videocontainner = $("#Player_template .Player_container").prop("outerHTML");
				videocontainner = $(videocontainner);
				videocontainner.addClass("Player_container_" + videoindex);
				if (options.toolbar) {
					controlhtml = $("#Player_template .Player_option_wraper").prop("outerHTML");
					videocontainner.find(".Player_container_inner").append(controlhtml);
				}
				if (options.download) {
					var fileResponse = null;
					function downloadVideo(src, name, progress) {
						if (!!fileResponse) {
							startDownload();
							progress(1);
							return;
						}
						function startDownload() {
							var url = window.URL.createObjectURL(fileResponse);
							var a = document.createElement("a");
							a.href = url;
							a.download = name;
							a.click();
						}
						var x = new XMLHttpRequest(); //禁止浏览器缓存；否则会报跨域的错误
						x.open("GET", src + "?t=" + new Date().getTime(), true);
						x.responseType = "blob";
						x.onload = function(e) {
							fileResponse = x.response;
							startDownload();
						};
						x.onprogress = function(e) {
							//console.log(e);
							var percent = parseInt((e.loaded / e.total) * 100) / 100;
							progress(percent);
						};
						x.send();
					}

					var downloadBtn = videocontainner.find(".Player_download_btn");
					downloadBtn.append(Assets["icons/download.png"]);
					if (DEVICE.isWeixin) {
						downloadBtn.click(function() {
							alert("请使用手机自带浏览器打开");
						});
					} else {
						// try {
						// 	document.domain = "ztgame.com";
						// } catch (error) {

						// }
						// downloadBtn
						// 	.attr("download", typeof options.download == "string" ? options.download : "video.mp4")
						// 	.attr("target", "_blank")
						// 	.attr("href", options.file);
						var isDownloading = false;

						downloadBtn.click(function() {
							if (!!isDownloading) {
								return;
							}
							isDownloading = true;
							var progressBar = videocontainner.find(".Player_Download_Progress");
							if (progressBar.length == 0) {
								videocontainner.append("<div class='Player_Download_Progress'>" + $("#Player_loading").html() + "</div>");
								progressBar = videocontainner.find(".Player_Download_Progress");
								progressBar.append("<img src='" + Assets["icons/download.png"].src + "'/ >");
							}
							var svgPath = progressBar.find(".Play_Loading_Progress_path");

							downloadVideo(options.file, typeof options.download == "string" ? options.download : "", function(percent) {
								var dashoffset = 252.2 * (1 - percent);
								svgPath.css({
									strokeDashoffset: dashoffset
								});
								if (percent == 1) {
									progressBar.remove();
									isDownloading = false;
								}
							});
						});
					}
				} else {
					videocontainner.find(".Player_download_btn").hide();
				}
				videocontainner.css({
					width: options.width,
					height: options.height == "auto" ? "" : options.height
				});
				videocontainner.find(".Player_container_inner").hide();

				function addsvgwrap() {
					if ($("#Player_template #Player_svg").length > 0) {
						$("body").append($("#Player_template #Player_svg"));
					}
				}

				function init() {
					if (options.toolbar) {
						addsvgwrap();
					}
					container.html("");
					container.append(videocontainner);

					Playercontainer = videocontainner;
					Playercontainer.find(".Player_container_inner").show();
					Playervideowrap = Playercontainer.find(".Player_video");
					playbtn = Playercontainer.find(".Player_button_play");
					loading = Playercontainer.find(".Player_loading");
					controlbar = Playercontainer.find(".Player_controls");
					optiondiv = Playercontainer.find(".Player_overlay_option");
					playpausbtn = controlbar.find(".Player_play_button");
					currenttimepanel = controlbar.find(".Player_time_panel_current");
					totaltimepanel = controlbar.find(".Player_time_panel_total");
					loadedbar = controlbar.find(".Player_time_loaded");
					playedbar = controlbar.find(".Player_time_current");
					playedbar.css({
						background: options.color
					});
					if (!!options.toolbar) {
						playedbar.find("em")[0].style.cssText = "background:" + dockcolor3 + "; background:-webkit-radial-gradient(50% 50%,circle closest-side, " + dockcolor1 + " 31%," + dockcolor2 + " 100%)";
					}
					timehander = controlbar.find(".Player_time_handle");
					Playeroverlayposter = Playercontainer.find(".Player_poster_img");
					totaltime = 0;
					timerail = controlbar.find(".Player_time_rail");
					fullscreen_button = controlbar.find(".Player_fullscreen_button ");

					// videoElement.style.width = options.width;
					// videoElement.style.height = options.height;

					PlayerTimeTotal = controlbar.find(".Player_time_total");

					if (!!options.image) {
						self.setPoster(options.image);
					}
					// if (options.image) {
					// videoElement.load();
					// Playervideowrap.append(videoElement);
					videoElement = Playervideowrap.find("video")[0];

					var fullElement = DEVICE.isMobile ? videoElement : container.find(".Player_container_inner")[0];

					videoplayer = videoElement;
					self.videoplayer = videoElement;
					self.videoElement = videoElement;
					videoElement.style.background = "#000";
					videoElement.autoplay = options.auto;
					videoElement.volume = options.volume;
					videoElement.loop = options.loop;
					videoElement.style.display = "none";
					videoElement.muted = options.muted;
					self.setVideoUrl(options.file, options.image);
					setTimeout(function() {
						videoElement.style.display = "block";
						options.onInit(videoindex);
					}, 20);

					//videoElement = document.createElement("video");

					// addEvent('abort', function() {
					//     console.log('abort');
					// });
					addEvent("canplay", function() {
						//console.log('canplay');
						loading.hide();
					});
					addEvent("canplaythrough", function() {
						//console.log('canplaythrough');
						loading.hide();
					});
					// addEvent('durationchange', function() {
					//     console.log('durationchange');
					// });

					addEvent("ended", function() {
						options.onComplete(videoindex);
						Playeroverlayposter.fadeIn(100);
						playbtn.show();
						playpausbtn.removeClass("Player_pause");
						playpausbtn.addClass("Player_play");
					});
					addEvent("error", function() {
						//console.log('error');
					});
					addEvent("loadeddata", function() {
						totaltime = videoElement.duration;
						totaltimepanel.html(getformattime(videoElement.duration));
						// if (!!totaltimepanel && totaltimepanel.length > 0) {
						//     timerail.css({
						//         paddingRight: timerail.find('.Player_time_panel').width() + 10
						//     });
						// }
					});
					// addEvent('loadedmetadata', function() {
					//     console.log('loadedmetadata');

					// });
					// addEvent('loadstart', function() {
					//     console.log('loadstart');
					// });
					addEvent("pause", function() {
						playbtn.show();
						playpausbtn.removeClass("Player_pause");
						playpausbtn.addClass("Player_play");
						loading.hide();
						options.onPause(videoindex);
					});
					addEvent("play", function() {
						Playeroverlayposter.stop().fadeOut();
						playbtn.hide();
						options.onPlay(videoindex);
						loading.hide();
						playpausbtn.removeClass("Player_play");
						playpausbtn.addClass("Player_pause");

						if (options.fullScreen) {
							launchFullscreen(fullElement);
						}
					});

					addEvent("playing", function() {
						//console.log('playing');
						Playeroverlayposter.stop().fadeOut();
						playbtn.hide();
						options.onPlay(videoindex);
						loading.hide();
						playpausbtn.removeClass("Player_play");
						playpausbtn.addClass("Player_pause");
					});
					addEvent("progress", function() {
						//console.log('progress');
						var buffered = videoElement.buffered;
						var endtime = 0;
						if (buffered.length > 0) {
							endtime = buffered.end(buffered.length - 1);
						}
						//var percent = Math.floor(endtime/totaltime)*100+'%';
						//console.log(percent);
						//loadedbar.css({width:percent});
					});
					// addScreenChange(null, function(isFullscreen) {
					//     alert('document fullscreenchange');
					//     if (typeof(isFullscreen) == 'undefined') {
					//         isFullscreen = fullscreenElement();
					//     }
					//     if (isFullscreen) {
					//         $(".tvp_fullscreen").addClass('tvp_fullscreen_true');
					//     } else {
					//         $(".tvp_fullscreen").removeClass('tvp_fullscreen_true');
					//     }
					// });
					addScreenChange(fullElement, function(isFullscreen) {
						//alert('video fullscreenchange');
						if ((typeof isFullscreen === "undefined" ? "undefined" : _typeof(isFullscreen)) == "object") {
							isFullscreen = fullscreenElement();
						}
						if (isFullscreen) {
							$(".tvp_fullscreen").addClass("tvp_fullscreen_true");
						} else {
							$(".tvp_fullscreen").removeClass("tvp_fullscreen_true");
							if (!!options.fullScreen && !!options.Popup) {
								options.Popup.hide();
							}
						}
					});

					// addScreenChange(null, function(isFullscreen) {
					//     console.log(typeof(isFullscreen));
					//     //alert('video fullscreenchange');
					//     if (typeof(isFullscreen) == 'object') {
					//         isFullscreen = fullscreenElement();
					//     }
					//     if (isFullscreen) {
					//         $(".tvp_fullscreen").addClass('tvp_fullscreen_true');
					//     } else {
					//         $(".tvp_fullscreen").removeClass('tvp_fullscreen_true');
					//     }
					// });

					function fullscreenElement() {
						var fullscreenEle = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || document.oFullscreenElement;
						//注意：要在用户授权全屏后才能获取全屏的元素，否则 fullscreenEle为null
						return fullscreenEle;
					}

					// addEvent('ratechange', function() {
					//     console.log('ratechange');
					// });
					addEvent("seeked", function() {
						//console.log('seeked');
						loading.hide();
					});
					// addEvent('seeking', function() {
					//     console.log('seeking');
					// });
					// addEvent('stalled', function() {
					//     console.log('stalled');
					// });
					// addEvent('suspend', function() {
					//     console.log('suspend');
					// });
					addEvent("timeupdate", function() {
						var currenttime = getformattime(videoElement.currentTime);
						var percent = parseInt((videoElement.currentTime / totaltime) * 100) + "%";
						playedbar.css({
							width: percent
						});
						currenttimepanel.html(currenttime);
					});
					// addEvent('volumechange', function(){
					//     console.log('volumechange');
					// });

					addEvent("waiting", function() {
						//console.log('waiting');
						loading.show();
						playbtn.hide();
					});

					if (options.toolbar) {
						var startHandle = function startHandle(e) {
							handertouched = true;
							startx = e.originalEvent.pageX ? e.originalEvent.pageX : e.originalEvent.touches[0].clientX;
							if(!!window.isXuanzhuan){
								startx = e.originalEvent.pageY ? e.originalEvent.pageY : e.originalEvent.touches[0].clientY;
							}
							videoElement.pause();
							showcontrolbar();
						};

						var moveHandle = function moveHandle(e) {
							if (handertouched) {
								//console.log(e.originalEvent);
								curtouchx = e.originalEvent.pageX ? e.originalEvent.pageX : e.originalEvent.touches[0].clientX;
								if(!!window.isXuanzhuan){
									curtouchx = e.originalEvent.pageY ? e.originalEvent.pageY : e.originalEvent.touches[0].clientY;
								}
								movetoucx = curtouchx - startx;
								startx = curtouchx;

								settimebar(movetoucx);
								showcontrolbar();
							}
						};

						var endHandle = function endHandle(e) {
							if (handertouched) {
								//console.log(e.originalEvent);
								curtouchx = e.originalEvent.pageX ? e.originalEvent.pageX : e.originalEvent.changedTouches[0].clientX;
								if(!!window.isXuanzhuan){
									curtouchx = e.originalEvent.pageY ? e.originalEvent.pageY : e.originalEvent.changedTouches[0].clientY;
								}
								movetoucx = curtouchx - startx;
								startx = curtouchx;
								// console.log(movetoucx);
								settimebar(movetoucx, true);
								handertouched = false;
								showcontrolbar();
							}
						};

						var toggleFullScreen = function toggleFullScreen() {
							if (fullscreenElement()) {
								exitFullscreen(fullElement);
							} else {
								launchFullscreen(fullElement);
							}
							showcontrolbar();
						};

						playbtn.click(function(e) {
							e.stopPropagation();
							self.play();
							showcontrolbar();
						});
						var isdbclick = false;
						var isclicked = false;
						optiondiv.dblclick(function(e) {
							isdbclick = true;
							toggleFullScreen();
							e.stopPropagation();
						});
						optiondiv.click(function() {
							if (isclicked) {
								return;
							}
							isclicked = true;
							setTimeout(function() {
								if (!isdbclick) {
									//self.pause();
									showcontrolbar();
								}
								isdbclick = false;
								isclicked = false;
							}, 200);
						});
						if (DEVICE.isPc) {
							container.find(".Player_container").hover(
								function() {
									showcontrolbar();
								},
								function() {
									hidecontrolbar();
								}
							);
							container.addClass("Player_pc");
						} else {
							container.addClass("Player_mobile");
						}
						playpausbtn.click(function() {
							if (videoElement.paused || videoElement.ended) {
								self.play();
							} else {
								self.pause();
							}
							// console.log(videoElement.currentTime);
						});
						var startx, curtouchx, movetoucx;
						var handertouched = false;
						// timehander.click(function(){
						//     alert(1);
						// });
						timehander.bind("touchstart", function(e) {
							notouch();
							startHandle(e);
						});
						timehander.bind("mousedown", function(e) {
							startHandle(e);
							showcontrolbar();
						});
						PlayerTimeTotal.bind("click", function(e) {
							var offsetx = e.pageX - PlayerTimeTotal.offset().left;
							offsetx = offsetx - playedbar.width();
							if (isNaN(offsetx)) {
								offsetx = 0;
							}
							settimebar(offsetx, true);
							showcontrolbar();
						});

						timehander.bind("touchmove", function(e) {
							moveHandle(e);
						});
						$("body").bind("mousemove", function(e) {
							moveHandle(e);
						});

						timehander.bind("touchend", function(e) {
							endHandle(e);
							cantouch();
						});
						$("body").bind("mouseup", function(e) {
							endHandle(e);
						});

						fullscreen_button.click(function() {
							toggleFullScreen();
						});
					}
				}

				var curbarwidth, changperchent, seektime;

				function settimebar(changetime, seek) {
					if (!options.toolbar) {
						return;
					}
					if (typeof seek == "undefined") seek = false;
					curbarwidth = playedbar.width();

					changedtime = curbarwidth + changetime;

					if (changedtime < 0) {
						changedtime = 0;
					}
					if (changedtime > PlayerTimeTotal.width()) {
						changedtime = PlayerTimeTotal.width();
					}
					changperchent = changedtime / PlayerTimeTotal.width();
					if (seek) {
						seektime = changperchent * totaltime;
						videoElement.currentTime = seektime;
						self.play();
					}
					playedbar.css({
						width: changperchent * 100 + "%"
					});
				}

				function showcontrolbar() {
					if (!options.toolbar) {
						return;
					}
					if (!controlbarclock) {
						controlbar
							.stop()
							.removeClass("hidden")
							.animate({ opacity: 1 }, 300, function() {});
					} else {
						clearTimeout(controlbarclock);
						controlbarclock = null;
					}
					controlbarclock = setTimeout(function() {
						hidecontrolbar();
					}, 5000);
				}

				function hidecontrolbar() {
					if (!!controlbarclock) {
						clearTimeout(controlbarclock);
						controlbarclock = null;
					}
					controlbar.stop().animate({ opacity: 0 }, 300, function() {
						controlbar.addClass("hidden");
						controlbarclock = null;
					});
				}

				function launchFullscreen(element) {
					//此方法不可以在異步任務中執行，否則火狐無法全屏
					if (element.requestFullscreen) {
						element.requestFullscreen();
					} else if (element.webkitEnterFullScreen) {
						element.webkitEnterFullScreen();
					} else if (element.mozRequestFullScreen) {
						element.mozRequestFullScreen();
					} else if (element.msRequestFullscreen) {
						element.msRequestFullscreen();
					} else if (element.oRequestFullscreen) {
						element.oRequestFullscreen();
					} else if (element.webkitRequestFullscreen) {
						element.webkitRequestFullScreen();
					}
				}

				function fullscreen(elem) {
					var prefix = "webkit";
					if (elem[prefix + "EnterFullScreen"]) {
						return prefix + "EnterFullScreen";
					} else if (elem[prefix + "RequestFullScreen"]) {
						return prefix + "RequestFullScreen";
					}
					return false;
				}

				function exitFullscreen(element) {
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if (document.webkitExitFullscreen) {
						document.webkitExitFullscreen();
					} else if (element.msExitFullscreen) {
						document.msExitFullscreenn();
					} else if (element.oExitFullscreen) {
						document.oExitFullscreenn();
					}
				}

				function addEvent(event, callback) {
					videoElement.addEventListener(event, callback, false);
					videoElement.addEventListener("webkit" + ucfirst(event), callback, false);
					videoElement.addEventListener("ms" + ucfirst(event), callback, false);
					videoElement.addEventListener("moz" + ucfirst(event), callback, false);
					videoElement.addEventListener("o" + ucfirst(event), callback, false);
				}

				function ucfirst(str) {
					var str = str.toLowerCase();
					var strarr = str.split(" ");
					var result = "";
					for (var i in strarr) {
						result += strarr[i].substring(0, 1).toUpperCase() + strarr[i].substring(1) + " ";
					}
					return result;
				}

				function addScreenChange(element, callback) {
					element = !!element ? element : document;
					element.addEventListener("fullscreenchange", callback);
					element.addEventListener("webkitfullscreenchange", callback);
					element.addEventListener("mozfullscreenchange", callback);
					element.addEventListener("MSFullscreenChange", callback);
					element.addEventListener("oFullscreenChange", callback);
					element.addEventListener("webkitendfullscreen", function() {
						callback(false);
					});
					element.addEventListener("webkitbeginfullscreen", function() {
						callback(true);
					});
				}

				function addsources(videoElement, files) {
					if (typeof files == "string") {
						addsource(videoElement, files);
					} else if ((typeof files === "undefined" ? "undefined" : _typeof(files)) == "object") {
						for (var i = 0; i < files.length; i++) {
							addsource(videoElement, files[i]);
						}
					}
				}

				function addsource(videoElement, fileurl) {
					var sourceElement = document.createElement("source");
					sourceElement.src = fileurl;
					sourceElement.type = formats[getsuffix(fileurl)];
					videoElement.appendChild(sourceElement);
				}

				function getformattime(second) {
					second = parseInt(second);
					var result = "";
					var shengyu = second;
					var h = Math.floor(second / (60 * 60));
					second = second - h * (60 * 60);

					var m = Math.floor(second / 60);
					second = second - m * 60;

					if (h < 10) h = "0" + h;
					if (m < 10) m = "0" + m;
					if (second < 10) second = "0" + second;
					if (h != "00") {
						result += h + ":";
					}
					result += m + ":" + second;
					return result;
				}
				this.play = function() {
					//videoElement.load();
					videoElement.play();
				};
				this.pause = function() {
					videoElement.pause();
				};
				this.stop = function() {
					videoElement.pause();
					videoElement.currentTime = 0;
				};
				this.setVolume = function(value) {
					if (value > 1) {
						value = 1;
					}
					videoElement.volume = value;
				};
				this.setPoster = function(imageurl) {
					if (typeof imageurl == "undefined") {
						imageurl = "";
					}
					Playeroverlayposter.attr("data-pic", imageurl);

					Playeroverlayposter.css({
						backgroundImage: "url(" + imageurl + ")"
					});
				};
				this.setVideoUrl = function(fileurl, imageurl) {
					if (!fileurl) {
						return;
					}
					videoplayer.pause();
					var childNodes = videoElement.childNodes;
					for (var i = 0; i < childNodes.length; i++) {
						videoElement.removeChild(childNodes[i]);
					}
					addsources(videoElement, fileurl);
					this.setPoster(imageurl);
					// videoElement.poster = imageurl;
					Playeroverlayposter.stop().show();
					playbtn.show();
					loading.hide();
					videoplayer.load();
				};
				init();
			}
			//flash播放器
			function flashPlayer() {
				var self = this;
				var isflashloaded = false;
				var flashloadedCallbacks = [];

				function init() {
					if (typeof window.playerindex == "undefined") {
						window.playerindex = 0;
					} else {
						window.playerindex++;
					}
					if (!isNaN(options.width)) {
						options.width = options.width + "px";
					} else if (options.width.indexOf("%") < 0) {
						options.width = "100%";
					}
					if (!isNaN(options.height)) {
						options.height = options.height + "px";
					}
					options.file = getFilePath(options.file);
					self.videoid = "Player_video" + playerindex;
					self.currentvideo = options.file;
					var imghtml = "";
					var imgshowcss = "display:none;";
					if (options.image) {
						imgshowcss = "display:block;";
					}

					if (options.toolbar) {
						imghtml = '<div class="Player_video_popup_image" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:10;background:#000 url(' + options.image + ") no-repeat center;background-size:cover;" + imgshowcss + '"><a href="javascript:void(0)" class="Player_video_play_btn" style="outline:none;width:67px;height:67px;position:absolute;left:50%;top:50%;z-index:20;display:block;margin-left:-34px;margin-top:-34px;transition: all 0.3s;-moz-transition: all 0.3s;-webkit-transition: all 0.3s;-o-transition: all 0.3s;"></a><div class="Player_black_bg" style="width:100%;height:100%;position:absolute;background:#000;opacity:0.3;filter:alpha(opacity=30);z-index:15;"></div></div>';
					}
					var outterHeight = "";
					var innerTop = "";
					var objHeight = "100px";
					if (options.height == "auto") {
						if (DEVICE.isIe7 || DEVICE.isIe6) {
							outterHeight = "1px";
						} else {
							outterHeight = "0";
						}
						innerTop = "-120%";
					} else {
						outterHeight = options.height;
						innerTop = 0;
						objHeight = "100%";
					}
					var objectHtml = "";
					if (!ismicro) {
						objectHtml = '<embed style="vertical-align:top;" id="' + self.videoid + '" flashvars="setContainerSize=setContainerSize' + window.playerindex + "&toolbar=" + options.toolbar + "&videoUrl=" + options.file + "&getUserComplete=videoComplete" + window.playerindex + "&flashComplete=flashLoaded" + window.playerindex + '"src="' + options.swf + '" quality="high" width="100%" height="100%" name="flashResize" wmode="Opaque" align="middle" allowScriptAccess="always" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer_cn" bgcolor="#000000" />';
					} else {
						objectHtml =
							'<object style="vertical-align:top;" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="100%" height="100%" align="middle" id="' +
							self.videoid +
							'">' +
							'<param name="allowScriptAccess" value="always" />' +
							'<param name="allowFullScreen" value="true" />' +
							'<param name="movie" value="' +
							options.swf +
							'"/>' +
							'<param name="bgcolor" value="#000000" />' +
							'<param name="wmode" value="Opaque">' +
							'<param name="quality" value="high" />' +
							'<param name="FlashVars" value="setContainerSize=setContainerSize' +
							window.playerindex +
							"&toolbar=" +
							options.toolbar +
							"&videoUrl=" +
							options.file +
							"&getUserComplete=videoComplete" +
							window.playerindex +
							"&flashComplete=flashLoaded" +
							window.playerindex +
							'"/>' +
							"</object>";
					}
					var html = "<div class='video_wrap_outter' style='width:" + options.width + ";height:" + outterHeight + ";position:relative;overflow:hidden;'><div style='position:relative;top:" + innerTop + ";width:100%;height:" + objHeight + ";' class='video_wrap_inner' id=video_wrap_inner_" + self.videoid + ">" + imghtml + objectHtml + "</div></div>";

					container.html(html);
					window["videoComplete" + window.playerindex] = function() {
						if (options.loop) {
							player.play();
							options.onReplay(videoindex);
						} else {
							$(".Player_video_popup_image").fadeIn();
							options.onComplete(videoindex);
						}
					};
					var video_wrap_outter = container.find(".video_wrap_outter");
					var video_wrap_inner = container.find(".video_wrap_inner");

					window["setContainerSize" + window.playerindex] = function(array) {
						self.videosize = array;
						if (options.height == "auto") {
							setHeight();
						} else {
							video_wrap_outter.height(options.height);
							video_wrap_inner.css({
								top: 0,
								height: "100%"
							});
						}
					};
					if (options.version == "v1") {
						options.onInit(videoindex);
						if (options.auto) {
							setTimeout(function() {
								self.play();
							}, 1000);
						}
					} else {
						window["flashLoaded" + window.playerindex] = function() {
							isflashloaded = true;
							options.onInit(videoindex);
							if (options.auto) {
								setTimeout(function() {
									self.play();
								}, 500);
							}
							for (var i in flashloadedCallbacks) {
								if (_typeof(flashloadedCallbacks[i] == "function")) {
									flashloadedCallbacks[i]();
								}
							}
						};
					}
					container.find(".Player_video_popup_image").hover(
						function() {
							$(this)
								.find(".Player_black_bg")
								.stop()
								.animate(
									{
										opacity: 0.6
									},
									300
								);
							$(this)
								.find(".Player_video_play_btn")
								.css(prefix.css + "transform", "scale(1.1)");
						},
						function() {
							$(this)
								.find(".Player_black_bg")
								.stop()
								.animate(
									{
										opacity: 0.3
									},
									300
								);
							$(this)
								.find(".Player_video_play_btn")
								.css(prefix.css + "transform", "none");
						}
					);
					container.find(".Player_video_play_btn").click(function() {
						self.play();
					});

					function setHeight(resizeRun) {
						var width, height;
						if (options.height == "auto" || typeof resizeRun != "undefined") {
							if (options.width.indexOf("%") > -1) {
								width = video_wrap_outter.width();
								// if (typeof(resizeRun) == 'undefined') {
								//     $(window).resize(function() {
								//         setHeight(true);
								//     });
								// }
							} else {
								width = parseInt(options.width);
							}
							height = (width * self.videosize[1]) / self.videosize[0];
							// height = width * options.ratio;
							video_wrap_inner.css({
								top: 0,
								height: "100%"
							});
							if (options.resizeAnimate) {
								video_wrap_outter.animate(
									{
										height: height
									},
									300
								);
							} else {
								video_wrap_outter.height(height);
							}
							// options.height = "100%";
							options.onResize(videoindex, height);
						} else {
							video_wrap_outter.height("100%");
							video_wrap_inner.css({
								top: 0,
								height: "100%"
							});
						}
					}
				}

				function getElement() {
					var e = document.getElementById(self.videoid);
					if (e) {
						return e;
					} else {
						return false;
					}
				}
				this.play = function() {
					if (isflashloaded) {
						container.find(".Player_video_popup_image").fadeOut();
						setTimeout(function() {
							getElement().resumeVideo();
						}, 100);
						options.onPlay(videoindex);
					} else {
						flashloadedCallbacks.push(function() {
							container.find(".Player_video_popup_image").fadeOut();
							setTimeout(function() {
								getElement().resumeVideo();
							}, 100);
							options.onPlay(videoindex);
						});
					}
				};
				this.pause = function() {
					if (!!getElement()) {
						if (!!getElement().pauseVideo) {
							getElement().pauseVideo();
						}
					}
				};
				this.stop = function() {
					this.pause();
				};
				this.setVolume = function() {};
				this.setVideoUrl = function(url, image) {
					getElement().setVideoUrl(url);
					self.currentvideo = url;
					if (typeof image == "undefined") {
						image = null;
					}
					if (image) {
						container
							.find(".Player_video_popup_image")
							.css({
								backgroundImage: "url(" + image + ")"
							})
							.fadeIn(300);
					} else {
						container.find(".Player_video_popup_image").hide();
					}
					// }
				};
				init();
			}

			function getsuffix(name) {
				var strs = name.split(".");
				return strs[strs.length - 1];
			}

			function bindPlayerFun() {
				if (!!player) {
					for (var i in player) {
						if (typeof player[i] == "function") {
							self[i] = player[i];
						}
					}
				}
			}
			setup();
		}

		function getCurUrl() {
			var ur = window.location.protocol + "//" + window.location.host + window.location.pathname;
			var pathArr = window.location.pathname.split("/");
			var ur2 = ur;
			if (pathArr[pathArr.length - 1].indexOf(".") > -1) {
				ur2 = ur2.replace(pathArr[pathArr.length - 1], "");
			}
			return ur2;
		}

		function getFilePath(file) {
			if (file.indexOf("http://") < 0 && file.indexOf("https://") < 0) {
				file = getCurUrl() + file;
			}
			return file;
		}

		function pcPopupVideo(options) {
			var self = this;
			var popupobj;
			if (!!options.pc) {
				options = $.extend(options, options.pc);
			}
			var popupoptions = $.extend({}, options);
			var videooptions = $.extend({}, options);
			videooptions.auto = false;
			var resizeCall = videooptions.onResize;
			videooptions.onResize = function(videoindex, height) {
				self["popup"].resize(self.popupobj, {
					height: height,
					marginTop: -height / 2
				});
				if (typeof resizeCall == "function") {
					resizeCall();
				}
			};

			if ($(".POPUP-Player").length < 1) {
				var closebtnbg;
				closebtnbg = Assets["icons/close.jpg"].src;
				popupobj = '<div class="POPUP-Player" style="display:none;background:#000;"><a style="width:50px;height:50px;background:url(' + closebtnbg + ') no-repeat center;position:absolute;top:0;right:-50px;display:block;" class="POPUP-Player-CLOSE close" href="javascript:void(0)"></a><div id="POPUP-Player-CONTAINER"></div></div>';
				popupobj = $(popupobj);
				$("body").append(popupobj);
			} else {
				popupobj = $(".POPUP-Player");
			}
			popupoptions = $.extend(popupoptions, {
				animation: "fade",
				scrollObj: false
			});
			this["popup"] = new Popup(popupobj, popupoptions);
			videooptions.popup = {
				hide: function() {
					self["popup"].hide(popupobj);
				}
			};
			this["video"] = new Player(popupobj.find("#POPUP-Player-CONTAINER"), videooptions);
			this["popup"].setVideo(this["video"]);
			this.popupobj = $(".POPUP-Player");
			this.play = function(url, image) {
				popupobj = $(".POPUP-Player");
				if (typeof url != "undefined") {
					self["video"].setVideoUrl(url, image);
				}
				self["popup"].show(popupobj);
			};
			this.setVideoUrl = self["video"].setVideoUrl;
			this.pause = function() {
				popupobj = $(".POPUP-Player");
				self["popup"].hide(popupobj);
			};
		}

		function mobilePopupVideo(options) {
			// if (DEVICE.isMobile) {
			if (!!options.mobile) {
				options = $.extend(options, options.mobile);
			}

			var defaultOptions = {
				backText: "关闭"
			};
			options = $.extend(defaultOptions, options);
			var videooptions = $.extend({}, options);
			var self = this;
			videooptions.auto = false;
			if ($(".VIDEOBG").length == 0) {
				var videobg = $('<div class="VIDEOBG"></div>');
				$("body").append(videobg);
				videobg.css({
					width: "100%",
					height: "100%",
					background: "#000",
					position: "fixed",
					top: 0,
					left: 0,
					zIndex: 999999,
					display: "none",
					alignItems: "center"
				});
				// var topbar = $('<div class="VIDEOTOP"></div>');
				var finish = $('<a href="javascript:void(0)" class="VIDEO-FINISH"> </a>');
				videobg.append(finish);
				// topbar.append(finish);
				var videoWrap = $('<div id="VIDEOWRAP"></div>');
				videobg.append(videoWrap);
			} else {
				var videoWrap = $("#VIDEOWRAP");
			}
			videooptions.Popup = {
				hide: playEnd
			};
			this["video"] = new Player(videoWrap, videooptions);

			this.play = function(file, img) {
				notouch();
				$(".VIDEOBG").show();
				$(".VIDEOBG")[0].style.visibility = "visible";
				self["video"].setVideoUrl(file, img);
				self["video"].play();
				$(".VIDEO-FINISH")
					.unbind("click")
					.click(function() {
						playEnd();
					});
			};
			this.pause = function() {
				playEnd();
			};
			this.setVideoUrl = self["video"].setVideoUrl;
			function playEnd() {
				if (typeof options.endHide == "function") {
					options.endHide();
				}
				if (typeof options.endHide == "function") {
					options.endHide();
				}
				self["video"].pause();
				$(".VIDEOBG").hide();
				$(".VIDEOBG")[0].style.visibility = "hidden";
				cantouch();
			}
		}

		function notouch() {
			document.addEventListener("touchmove", bodyScroll, false);
		}

		function cantouch() {
			document.removeEventListener("touchmove", bodyScroll, false);
		}

		function bodyScroll(e) {
			e.preventDefault();
		}

		function setCss3(element, attr, value) {
			var obj = {};
			obj[prefix.lowercase + attr[0].toUpperCase() + attr.substr(1)] = value;
			obj[attr] = value;
			element.css(obj);
		}

		function popupVideo() {
			if (DEVICE.isMobile) {
				return mobilePopupVideo;
			} else {
				return pcPopupVideo;
			}
		}

		function PlayerSET(allset) {
			if (typeof allset != "undefined" && allset) {
				$(".Player-CONTAINER").each(function() {
					$(this).html("");
					$(this).removeClass("Player-SETTED");
				});
			}
			if ($(".Player-CONTAINER").not($(".Player-SETTED")).length > 0) {
				$(".Player-CONTAINER")
					.not($(".Player-SETTED"))
					.each(function() {
						var pcwidth = $(this).data("pcwidth");
						if (!pcwidth) {
							pcwidth = "100%";
						}
						var mwidth = $(this).data("mwidth");
						if (!mwidth) {
							mwidth = "100%";
						}
						var pcheight = $(this).data("pcheight");
						if (!pcheight) {
							pcheight = "auto";
						}
						var mheight = $(this).data("mheight");
						if (!mheight) {
							mheight = "auto";
						}
						var pcoptionHeight = "100%";
						var mobileoptionHeight = "100%";
						if (DEVICE.isMobile) {
							$(this).css({
								width: mwidth,
								height: mheight
							});
						} else {
							$(this).css({
								width: pcwidth,
								height: pcheight
							});
						}
						if (pcheight == "auto") {
							pcoptionHeight = "auto";
						}
						if (mheight == "auto") {
							mobileoptionHeight = "auto";
						}
						var options = {
							mobile: {
								file: $(this).data("file"),
								width: "100%",
								height: mobileoptionHeight,
								auto: $(this).data("auto"),
								image: $(this).data("image"),
								volume: 1,
								loop: $(this).data("loop")
							},
							pc: {
								file: $(this).data("file"),
								width: "100%",
								height: pcoptionHeight,
								auto: $(this).data("auto"),
								image: $(this).data("image"),
								volume: 1,
								loop: $(this).data("loop")
							}
						};
						$(this).Player(options);
						$(this).addClass("Player-SETTED");
					});
			}
		}

		// _defineProperty(Player, "popup", popupVideo());
		// _defineProperty(Player, "plugin", function(Flag) {
		//     if (Flag && Flag.fn) {
		//         (function(Flag) {
		//             Flag.fn.Player = function(params) {
		//                 var result = [];
		//                 if (typeof window.PlayervideoIndex == "undefined") {
		//                     window.PlayervideoIndex = 0;
		//                 }
		//                 this.each(function(index) {
		//                     result.push(new Player($(this), params, PlayervideoIndex));
		//                     PlayervideoIndex++;
		//                     // $(this).data('Player', new Player($(this), params));
		//                 });
		//                 if (result.length <= 1) {
		//                     return result[0];
		//                 }
		//                 return result;
		//             };
		//         })(Flag);
		//     }
		//     return Player;
		// });

		function myPlayer(container, options) {
			if (!container) {
				container = {};
			}
			if (!options) {
				options = container;
				popupVideo().call(this, options);
			} else {
				Player.call(this, container, options);
			}
		}
		$(function() {
			PlayerSET();
		});
		return myPlayer;
	};
	function cutHex(h) {
		return h.charAt(0) == "#" ? h.substring(1, 7) : h;
	}

	function hexToRGB(color) {
		var hex = "";
		if (color.indexOf("rgb") == 0) {
			hex = color
				.replace("rgb(", "")
				.replace("rgba(", "")
				.replace(")", "");
		} else if (color.indexOf("#") == 0) {
			color = color.replace("#", "");
			if (color.length == 3) {
				color = color.replace("#", "");
				color = color + color;
			}
			hex = parseInt(cutHex(color).substring(0, 2), 16) + "," + parseInt(cutHex(color).substring(2, 4), 16) + "," + parseInt(cutHex(color).substring(4, 6), 16);
		}
		if (hex) {
			hex = hex.split(",");
		}
		return hex;
	}

	if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
		// CommonJS
		module.exports = definFun(require("jquery"), require("../popup/"), require("../device/"), require("../prefix/"), require("./assets/"));
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define(["jquery", "../popup/", "../device/", "../prefix/", "./assets/"], definFun);
	} else {
		// Global Variables
		if (!window.Foliou) {
			window.Foliou = {};
		}
		window.Foliou.Player = definFun($, window.Foliou.Popup, window.Foliou.Device, window.Foliou.Prefix);
	}
})();
