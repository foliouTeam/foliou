
/**
    @author:pengzai
    @blog:http://foliou.focusbe.com
    @github:https://github.com/focusbe/foliou
**/
import Device from "../device/index";
function Visualizer(options) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	if (!window.AudioContext) {
		if (ztUtil.isdev) {
			alert("浏览器不支持audiocontext，插件visualizer无法使用");
		}
		return;
	}
	if (typeof options != "object") {
		return;
	}
	var defaultOptionis = {
		file: "",
		auto: true,
		fps: 60,
		onReady: function () { },
		onPlay: function () { },
		onPause: function () { },
		onUpdate: function () { }
	};
	options = Object.assign(defaultOptionis, options);
	if (!options.file) {
		return;
	}

	var self = this;
	this.audioEl = null;
	this.state = "loading";
	this.context = new window.AudioContext();
	this.duration = 0;
	var audioBufferSourceNode = this.context.createBufferSource();
	var gainNode = this.context.createGain();
	var analyser = this.context.createAnalyser();
	var bufferLength = analyser.frequencyBinCount; // 返回的是 analyser的fftsize的一半
	var dataArray = new Uint8Array(bufferLength);
	var offsetTime = -1;
	var soundBuff;

	var getFile = function (url, cb) {
		// alert(url);
		//url 线上音频地址
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = "arraybuffer";
		request.onload = function () {
			const audioData = request.response; // 请求回来的arraybuffer的音频文件
			//下面就是解码操作 buffer节点
			cb(audioData);
		};
		request.onerror = function () {
			aert("加载失败");
			c(false);
		};
		request.send();
	};
	var decodeAudioData = function (audioData) {
		self.context.decodeAudioData(audioData, function (buffer) {
			soundBuff = buffer;
			self.duration = buffer.duration;
			audioBufferSourceNode.buffer = buffer;
			audioBufferSourceNode.loop = true;
			if (!!self.audioEl) {
				gainNode.gain.value = 0;
			} else {
				gainNode.gain.value = 1;
			}
			gainNode.connect(self.context.destination);
			audioBufferSourceNode.connect(analyser);
			analyser.connect(gainNode);
			offsetTime = self.context.currentTime;
			self.state = "loaded";
			var starttime = !!self.audioEl ? self.audioEl.currentTime : 0;
			audioBufferSourceNode.start(0, starttime);
			options.onReady();
			if (!self.audioEl) {
				if (self.context.state == "running") {
					options.onPlay();
				} else {
					self.resume();
				}
			}
		});
	};
	function init() {
		if (Device.isiOS) {
			//ios 用audiocontext 在静音下没有声音。用audio播放音乐
			this.audioEl = document.createElement("audio");
			audioEl.src = options.file;
			audioEl.loop = true;
			audioEl.addEventListener(
				"play",
				function () {
					options.onPlay();
					self.context.resume();
				},
				false
			);
			audioEl.addEventListener(
				"pause",
				function () {
					options.onPause();
					self.context.suspend();
				},
				false
			);
			audioEl.addEventListener(
				"ended",
				function () {
					options.onPause();
					self.context.suspend();
				},
				false
			);
			var lasttime = 0,
				curtime;
			audioEl.addEventListener(
				"timeupdate",
				function () {
					curtime = new Date().getTime();
					if (!soundBuff || curtime - lasttime < 1000) {
						return;
					}
					lasttime = curtime;
					if (!!audioBufferSourceNode) {
						audioBufferSourceNode.stop();
						audioBufferSourceNode = null;
					}
					audioBufferSourceNode = self.context.createBufferSource();
					audioBufferSourceNode.buffer = soundBuff;
					audioBufferSourceNode.connect(analyser);
					analyser.connect(gainNode);
					audioBufferSourceNode.start(0, audioEl.currentTime);
					options.onUpdate(self.getFrequency(), self.getCurrentTime());
				},
				false
			);
		} else {
			self.context.onstatechange = function () {
				if (self.context.state == "running") {
					if (self.state == "loading") {
						return;
					}
					options.onPlay();
				} else {
					options.onPause();
				}
			};
			var draw = function () {
				// console.log(self.state);
				if (self.state == "running" || self.state == "loaded") {
					options.onUpdate(self.getFrequency(), self.getCurrentTime());
				}
				window.requestAnimationFrame(draw);
			};
			draw();
		}
	}

	this.getCurrentTime = function () {
		if (!!self.audioEl) {
			return audioEl.currentTime;
		}
		if (offsetTime < 0) {
			return 0;
		}
		return (this.context.currentTime - offsetTime) % self.duration;
	};
	this.pause = function () {
		if (!!self.audioEl) {
			audioEl.pause();
		} else {
		}
		self.context.suspend();
	};
	this.resume = function () {
		if (!!self.audioEl) {
			audioEl.play();
		} else {
		}
		self.context.resume();
	};
	this.getFrequency = function () {
		analyser.getByteFrequencyData(dataArray);
		return dataArray;
	};
	if (options.auto) {
		getFile(options.file, decodeAudioData);
		if (typeof WeixinJSBridgeReady === "undefined") {
			if (document.addEventListener) {
				document.addEventListener(
					"WeixinJSBridgeReady",
					function () {
						self.resume();
					},
					false
				);
			}
		}
		self.resume();
	}
	init();
}
export default Visualizer;