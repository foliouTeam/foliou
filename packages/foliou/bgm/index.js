(function () {
	function definFun($, DEVICE, PREFIX) {
		var BgSound = function (option) {
			var supportaudio = !!document.createElement("audio");
			var volume = 1;
			var self = this;
			var cursrc = "";
			var curstate;
			var shouldplay = false;
			var defaultOption = {
				file: "",
				loop: true,
				volume: 1,
				autoplay: true,
				onplay: function () { },
				onpause: function () { }
			};
			option = $.extend(defaultOption, option);
			self.init = function () {
				var soundAudio = $("#SOUND_AUDIO");
				var soundWrap = $("body");
				if (soundWrap.length == 0) {
					$(function () {
						self.init();
					});
					return;
				}
				if (soundAudio.length == 0) {
					var soundaudio_outer = $('<div id="SOUND_AUDIO_outer"></div>');
					soundaudio_outer.css({ position: "absolute", width: 100, height: 100, top: "-500%" });
					soundWrap.append(soundaudio_outer);
					var audiostr;
					if (supportaudio) {
						audiostr = '<audio preload="auto" id="SOUND_AUDIO" class="SOUND_AUDIO"></audio>';
					} else {
						audiostr = '<embed id="SOUND_AUDIO"></embed>';
					}
					soundaudio_outer.append(audiostr);
				}
				soundAudio = $("#SOUND_AUDIO");
				self.audioElement = soundAudio[0];
				self.setAudio();
				if (option.autoplay) {
					if (DEVICE.isWeixin && typeof WeixinJSBridge != "object") {
						if (typeof WeixinJSBridgeReady === "undefined") {
							if (document.addEventListener) {
								document.addEventListener(
									"WeixinJSBridgeReady",
									function () {
										self.play();
									},
									false
								);
							} else {
								$(document).bind("touchstart", touchPlayZhibo);
								$(document).bind("mousedown", touchPlayZhibo);
							}
						}
					} else {
						try {
							if (self.audioElement.paused) {
								self.audioElement.load();

								self.audioElement.oncanplay = function () {
									self.play();
								};
								$(document).bind("touchstart", touchPlayZhibo);
								$(document).bind("mousedown", touchPlayZhibo);
							}
						} catch (error) { }
					}

					function touchPlayZhibo() {
						// alert("touchplayer");
						self.play();
						$(document).unbind("touchstart", touchPlayZhibo);
						$(document).unbind("mousedown", touchPlayZhibo);
					}
					//
				}
				self.bind();
			};
			self.bind = function () {
				if (!self.audioElement) {
					return;
				}
				if (supportaudio) {
					self.audioElement.addEventListener(
						"playing",
						function () {
							if (typeof option.onplay == "function") {
								option.onplay();
							}
						},
						false
					);
					self.audioElement.addEventListener(
						"pause",
						function () {
							if (typeof option.onpause == "function") {
								option.onpause();
							}
						},
						false
					);
					self.audioElement.addEventListener(
						"ended",
						function () {
							if (typeof option.onpause == "function") {
								option.onpause();
							}
						},
						false
					);
					//self.bindBackRun();
				}
			};
			self.setAudio = function (thisoption) {
				if (typeof thisoption == "object") {
					option = $.extend(option, thisoption);
				}
				if (cursrc != option.file) {
					SOUND_AUDIO.src = option.file;
					cursrc = option.file;
				}

				if (supportaudio) {
					if (!option.loop) {
						SOUND_AUDIO.removeAttribute("loop");
					} else {
						SOUND_AUDIO.loop = "loop";
					}
					if (!option.autoplay) {
						SOUND_AUDIO.removeAttribute("autoplay");
					} else {
						SOUND_AUDIO.autoplay = "autoplay";
					}
					SOUND_AUDIO.volume = option.volume;
					volume = option.volume;
				} else {
					if (!option.loop) {
						SOUND_AUDIO.removeAttribute("loop");
					} else {
						SOUND_AUDIO.loop = true;
					}
					if (!option.autoplay) {
						SOUND_AUDIO.removeAttribute("autostart");
					} else {
						SOUND_AUDIO.autoplay = true;
					}
				}
			};
			self.play = function (thisoption) {
				if (typeof thisoption == "object") {
					option = $.extend(option, thisoption);
					self.setAudio();
				} else if (typeof thisoption == "string") {
					option.file = thisoption;
					self.setAudio();
				}
				self.resume();
				if (!supportaudio) {
					if (typeof option.onplay == "function") {
						option.onplay();
					}
				}
				curstate = "play";
			};
			self.pause = function (huanchun) {
				if (!self.audioElement) return;
				if (DEVICE.isiOS || !supportaudio) {
					huanchun = false;
				}
				if (typeof huanchun == "undefined") {
					huanchun = true;
				}

				if (self.volumeclock) {
					clearInterval(self.volumeclock);
					self.volumeclock = null;
				}
				//self.audioElement.pause();
				if (huanchun) {
					volume = self.audioElement.volume;
					self.volumeclock = setInterval(function () {
						volume -= 0.2;
						if (volume <= 0) {
							volume = 0;
							self.audioElement.volume = 0;
							clearInterval(self.volumeclock);
							self.volumeclock = null;
							self.audioElement.pause();
							return;
						} else {
							self.audioElement.volume = volume;
						}
					}, 100);
				} else {
					//self.audioElement.volume = 0;
					self.audioElement.pause();
				}
				if (!supportaudio) {
					if (typeof option.onpause == "function") {
						option.onpause();
					}
				}
				curstate = "pause";
			};
			self.stop = function (huanchun) {
				self.pause(huanchun);
				self.audioElement.load();
			};
			self.resume = function () {
				if (!self.audioElement) return;
				if (!DEVICE.isiOS) {
					if (self.volumeclock) {
						clearInterval(self.volumeclock);
						self.volumeclock = null;
					}
					volume = self.audioElement.volume;
					try {
						self.audioElement.play();
					} catch (error) {
						// console.log(error);
					}

					self.volumeclock = setInterval(function () {
						volume += 0.2;
						if (volume >= option.volume) {
							self.audioElement.volume = option.volume;
							clearInterval(self.volumeclock);
							self.volumeclock = null;
							return;
						} else {
							self.audioElement.volume = volume;
						}
					}, 100);
				} else {
					//self.audioElement.load();
					self.audioElement.play();
				}
				curstate = "play";
			};
			self.bindBackRun = function () {
				if (option.backrun) {
					return;
				}
				// if (DEVICE.isWeixin) {
				// 	return;
				// }
				// Get Browser Specific Hidden Property
				function hiddenProperty(prefix) {
					if (typeof document["hidden"] != "undefined") {
						return "hidden";
					}
					if (prefix) {
						return prefix + "Hidden";
					} else {
						return "hidden";
					}
				}

				// Get Browser Specific Visibility State
				function visibilityState(prefix) {
					if (prefix) {
						return prefix + "VisibilityState";
					} else {
						return "visibilityState";
					}
				}
				// Get Browser Specific Event
				function visibilityEvent(prefix) {
					if (prefix) {
						return prefix + "visibilitychange";
					} else {
						return "visibilitychange";
					}
				}

				var prefix = PREFIX.js;
				// console.log(PREFIX);
				var hidden = hiddenProperty(prefix);
				var visibilityState = visibilityState(prefix);
				var visibilityEvent = visibilityEvent(prefix);
				//console.log(visibilityEvent);
				document.addEventListener(visibilityEvent, visibleChange, false);
				document.addEventListener("visibilitychange", visibleChange, false);
				function visibleChange(event) {
					// console.log(event);
					// console.log(document[hidden]);
					if (!document[hidden]) {
						// The page is visible.
						//console.log("show");
						if (shouldplay) {
							console.log("重新播放");
							self.resume(true);
						}
					} else {
						// console.log("hide");
						// console.log("暂停播放");
						// The page is hidden.
						// console.log(curstate);
						if (curstate == "play") {
							shouldplay = true;
							self.pause(true);
						} else {
							shouldplay = false;
						}
					}
				}
			};

			self.init();
		};
		return BgSound;
	}
	if (typeof exports === "object") {
		// CommonJS
		module.exports = definFun(require("jquery"), require("../device/"), require("../prefix/"));
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define(["jquery", "../device/", "../prefix/"], definFun);
	}
})();
