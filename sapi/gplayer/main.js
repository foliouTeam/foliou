'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['gplayer/v3/index'], function (GPlayer) {
    return GPlayer;
    //Do setup work here
    //获取前缀
    var prefix = function () {
        if (typeof window.getComputedStyle == 'undefined') {
            return {
                dom: '',
                lowercase: '',
                css: '',
                js: ''
            };
        }
        var styles = window.getComputedStyle(document.documentElement, ''),
            pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && ['', 'o'])[1],
            dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1];
        return {
            dom: dom,
            lowercase: pre,
            css: '-' + pre + '-',
            js: pre[0].toUpperCase() + pre.substr(1)
        };
    }();

    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;break;
            }
        }
        return flag;
    }
    var isMobile = !IsPC();
    var curentUrl = getJSPath('gplayer/main.js');

    function gPlayer(container, videoindex, options) {
        "use strict";

        var ismicro = navigator.appName.indexOf("Microsoft") != -1;
        if (!container) return;
        var player;

        var defaultoption = {
            file: '',
            width: '100%',
            height: 'auto',
            auto: false,
            image: '',
            volume: 1,
            loop: false,
            ratio: 0.6, //高宽比例
            swf: curentUrl + 'gplayer.swf',
            onComplete: function onComplete(index) {},
            onPlay: function onPlay(index) {},
            onReplay: function onReplay(index) {},
            onInit: function onInit(index) {},
            mobile: {},
            pc: {}
        };
        if (isMobile) {
            options = $.extend(options, options.mobile);
        } else {
            options = $.extend(options, options.pc);
        }
        options = $.extend(defaultoption, options);
        options.width = options.width.toString();
        options.height = options.height.toString();

        function setup() {
            if (isMobile) {
                player = new mobilePlayer();
            } else {
                player = new flashPlayer();
            }
        }
        this.play = function () {
            player.play();
        };
        this.pause = function () {
            player.pause();
        };
        this.stop = function () {
            player.stop();
        };
        this.setVolume = function (value) {
            player.setVolume(value);
        };
        this.setVideoUrl = function (url, image) {
            player.setVideoUrl(url, image);
        };
        var e = { mp4: "video/mp4", vorbis: "audio/ogg", ogg: a + "video/ogg", webm: "video/webm", aac: "audio/mp4", mp3: "audio/mpeg", hls: "application/vnd.apple.mpegurl" };
        var formats = { mp4: e.mp4, f4v: e.mp4, m4v: e.mp4, mov: e.mp4, m4a: e.aac, f4a: e.aac, aac: e.aac, mp3: e.mp3, ogv: e.ogg, ogg: e.vorbis, oga: e.vorbis, webm: e.webm, m3u8: e.hls, hls: e.hls },
            a = "video",
            a = { flv: a, f4v: a, mov: a, m4a: a, m4v: a, mp4: a, aac: a, f4a: a, mp3: "sound", smil: "rtmp", m3u8: "hls", hls: "hls" };
        //html5视频播放器

        function mobilePlayer() {
            var self = this;
            var videoElement;

            function init() {
                videoElement = document.createElement("video");
                if (typeof options.width == 'number ') {
                    options.width = options.width + 'px';
                }
                if (typeof options.height == 'number ') {
                    options.height = options.height + 'px';
                }
                videoElement.style.width = options.width;
                videoElement.style.height = options.height;
                videoElement.controls = "controls";
                videoElement.autoplay = options.auto;
                videoElement.volume = options.volume;
                videoElement.loop = options.loop;
                if (options.image) {
                    videoElement.poster = options.image;
                }
                videoElement.load();
                addEvent('play', options.onPlay);
                addEvent('ended', options.onComplete);
                addsources(videoElement, options.file);
                container.html('');
                container.append($(videoElement));
            }

            function addEvent(event, callback) {
                videoElement.addEventListener(event, callback);
            }

            function addsources(videoElement, files) {
                if (typeof files == "string") {
                    addsource(videoElement, files);
                } else if ((typeof files === 'undefined' ? 'undefined' : _typeof(files)) == "object") {
                    for (var i = 0; i < files.length; i++) {
                        addsource(videoElement, files[i]);
                    }
                }
            }

            function addsource(videoElement, fileurl) {
                var sourceElement = document.createElement("source");
                sourceElement.src = fileurl;
                sourceElement.type = formats[getsuffix(options.file)];
                videoElement.appendChild(sourceElement);
            }
            this.play = function () {
                videoElement.play();
            };
            this.pause = function () {
                videoElement.pause();
            };
            this.stop = function () {
                videoElement.pause();
                videoElement.currentTime = 0;
            };
            this.setVolume = function (value) {
                if (value > 1) {
                    value = 1;
                }
                videoElement.volume = value;
            };
            this.setVideoUrl = function (fileurl, imageurl) {
                var childNodes = videoElement.childNodes;
                for (var i = 0; i < childNodes.length; i++) {
                    videoElement.removeChild(childNodes[i]);
                }
                addsources(videoElement, fileurl);
                if (typeof imageurl == 'undefined') {
                    imageurl = "";
                }
                videoElement.poster = imageurl;
                videoElement.load();
            };
            init();
        }

        //flash播放器
        function flashPlayer() {
            var self = this;

            function init() {
                if (typeof window.playerindex == 'undefined') {
                    window.playerindex = 0;
                } else {
                    window.playerindex++;
                }
                if (options.width.indexOf('px') > -1) {
                    options.width = parseInt(options.width);
                }
                if (options.height.indexOf('px') > -1) {
                    options.height = parseInt(options.height);
                }
                if (options.height == 'auto') {
                    setHeight();
                }
                options.file = getFilePath(options.file);
                self.videoid = 'GPLAYER_video' + playerindex;
                self.currentvideo = options.file;
                var imghtml = '';
                if (options.image) {
                    imghtml = '<div class="GPLAYER_video_popup_image" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:10;background:#000 url(' + options.image + ') no-repeat center;background-size:popup;"><a href="javascript:void(0)" class="GPLAYER_video_play_btn" style="width:67px;height:67px;background:url(' + curentUrl + 'play.png) no-repeat center;position:absolute;left:50%;top:50%;z-index:20;display:block;margin-left:-34px;margin-top:-34px;transition: all 0.3s;-moz-transition: all 0.3s;-webkit-transition: all 0.3s;-o-transition: all 0.3s;"></a><div class="GPLAYER_black_bg" style="width:100%;height:100%;position:absolute;background:#000;opacity:0.3;filter:alpha(opacity=30);z-index:15;"></div></div>';
                }
                var html = "<div style='width:" + options.width + "px;height:" + options.height + "px' class='GPLAYER_video_wrap_inner'>" + imghtml + '</div>';
                if (!ismicro) {
                    var html = "<div style='width:" + options.width + "px;height:" + options.height + "px' class='video_wrap_inner'>" + imghtml + '<embed style="vertical-align:top;" id="' + self.videoid + '" flashvars="isDebugShow=false&videoUrl=' + options.file + '&getUserComplete=videoComplete' + window.playerindex + '&flashComplete=flashLoaded' + window.playerindex + '" src="' + options.swf + '" quality="high" width="' + options.width + '" height="' + options.height + '" name="flashResize" wmode="Opaque" align="middle" allowScriptAccess="always" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer_cn" bgcolor="#000000" />' + '</div>';
                } else {
                    var html = "<div style='width:" + options.width + ";height:" + options.height + "' class='video_wrap_inner' id=video_wrap_inner_" + self.videoid + ">" + imghtml + '<object style="vertical-align:top;" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + options.width + '" height="' + options.height + '" align="middle" id="' + self.videoid + '">' + '<param name="allowScriptAccess" value="always" />' + '<param name="allowFullScreen" value="true" />' + '<param name="movie" value="' + options.swf + '"/>' + '<param name="bgcolor" value="#000000" />' + '<param name="wmode" value="Opaque">' + '<param name="quality" value="high" />' + '<param name="FlashVars" value="isDebugShow=false&videoUrl=' + options.file + '&getUserComplete=videoComplete' + window.playerindex + '&flashComplete=flashLoaded' + window.playerindex + '"/>' + '</object>' + '</div>';
                }
                container.html('');
                container.append(html);
                window['videoComplete' + window.playerindex] = function () {
                    if (options.loop) {
                        player.play();
                        options.onReplay(videoindex);
                    } else {
                        $(".GPLAYER_video_popup_image").fadeIn();
                        options.onComplete(videoindex);
                    }
                };

                window['flashLoaded' + window.playerindex] = function () {
                    options.onInit(videoindex);
                    if (options.auto) {
                        setTimeout(function () {
                            self.play();
                        }, 500);
                    }
                };
                container.find(".GPLAYER_video_popup_image").hover(function () {
                    $(this).find(".GPLAYER_black_bg").stop().animate({ opacity: 0.6 }, 300);
                    $(this).find(".GPLAYER_video_play_btn").css(prefix.css + 'transform', 'scale(1.1)');
                }, function () {
                    $(this).find(".GPLAYER_black_bg").stop().animate({ opacity: 0.3 }, 300);
                    $(this).find(".GPLAYER_video_play_btn").css(prefix.css + 'transform', 'none');
                });
                container.find(".GPLAYER_video_play_btn").click(function () {
                    self.play();
                });
            }

            function setHeight(resizeRun) {
                var width, height;
                if (options.height == 'auto' || typeof resizeRun != 'undefined') {
                    if (options.width.indexOf('%') > -1) {
                        width = container.width() * parseInt(options.width) / 100;
                        if (typeof resizeRun == 'undefined') {
                            $(window).resize(function () {
                                setHeight(true);
                            });
                        }
                    } else {
                        width = options.width;
                    }
                    height = width * options.ratio;
                    container.height(height);
                    options.height = "100%";
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
            this.play = function () {
                // var time = 0;
                // if(container.find(".GPLAYER_video_popup_image").css('display')!='none')
                // {
                //   time = 100;
                // }
                container.find(".GPLAYER_video_popup_image").fadeOut();
                setTimeout(function () {
                    getElement().resumeVideo();
                }, 100);
                options.onPlay(videoindex);
            };
            this.pause = function () {
                if (!!getElement()) {
                    if (!!getElement().pauseVideo) {
                        getElement().pauseVideo();
                    }
                }
            };
            this.stop = function () {
                this.pause();
            };
            this.setVolume = function () {};
            this.setVideoUrl = function (url, image) {
                // url = getFilePath(url);

                // if(url!=self.currentvideo)
                // {
                getElement().setVideoUrl(url);
                self.currentvideo = url;
                //self.play();
                if (typeof image == 'undefined') {
                    image = null;
                }
                if (image) {
                    container.find(".GPLAYER_video_popup_image").css({ backgroundImage: 'url(' + image + ')' }).fadeIn(300);
                } else {
                    container.find(".GPLAYER_video_popup_image").hide();
                }
                // }
            };
            init();
        }

        function getsuffix(name) {
            var strs = name.split(".");
            return strs[strs.length - 1];
        }
        setup();
    }

    function getJSPath(jsname) {
        var js = document.scripts;
        var jsPath;
        for (var i = js.length; i > 0; i--) {
            if (js[i - 1].src.indexOf(jsname) > -1) {
                jsPath = js[i - 1].src.substring(0, js[i - 1].src.lastIndexOf("/") + 1);
            }
        }
        return jsPath;
    }

    function getCurUrl() {
        var ur = window.location.protocol + '//' + window.location.host + window.location.pathname;
        var pathArr = window.location.pathname.split('/');
        var ur2 = ur;
        if (pathArr[pathArr.length - 1].indexOf('.') > -1) {
            ur2 = ur2.replace(pathArr[pathArr.length - 1], '');
        }
        return ur2;
    }

    function getFilePath(file) {
        if (file.indexOf('http://') < 0 && file.indexOf('https://') < 0) {
            file = getCurUrl() + file;
        }
        return file;
    }

    function thisMovie(name) {
        var e = document.getElementById(name);
        if (e) {
            return e;
        } else {
            return false;
        }
    }

    function popupVideo(options) {
        var popupoptions = $.extend({}, options);
        var videooptions = $.extend({}, options);
        videooptions.auto = false;

        var self = this;
        if ($(".POPUP-GPLAYER").length < 1) {
            var popupobj = '<div class="POPUP-GPLAYER"><a style="width:50px;height:50px;background:url(' + curentUrl + '/close.jpg) no-repeat center;position:absolute;top:0;right:-50px;display:block;" class="POPUP-GPLAYER-CLOSE close" href="javascript:void(0)"></a><div id="POPUP-GPLAYER-CONTAINER"></div></div>';
            popupobj = $(popupobj).css({ display: 'none' });
            $('body').append(popupobj);
            this['video'] = popupobj.find("#POPUP-GPLAYER-CONTAINER").gplayer(videooptions);
            popupoptions = $.extend(popupoptions, { video: self.video, animation: 'fade', scrollObj: false });
            this['popup'] = popupobj.gpopup(popupoptions);
            this.popupobj = $(".POPUP-GPLAYER");
        }
        this.show = function (url, image) {
            popupobj = $(".POPUP-GPLAYER");
            if (typeof url != 'undefined') {
                self['video'].setVideoUrl(url, image);
            }
            self['popup'].show(popupobj);
        };
        this.hide = function () {
            popupobj = $(".POPUP-GPLAYER");
            self['popup'].hide(popupobj);
        };
    }
    if ($) {
        (function ($) {
            $.fn.gplayer = function (params) {
                var result = [];
                this.each(function (index) {
                    result.push(new gPlayer($(this), index, params));
                    // $(this).data('gplayer', new GPlayer($(this), params));
                });
                if (result.length <= 1) {
                    return result[0];
                }
                return result;
            };
        })($);
    }
    return {
        gplayer: gPlayer,
        popupVideo: popupVideo
    };
});