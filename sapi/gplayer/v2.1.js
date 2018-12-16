'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
    @author:liupeng
    @email:1049047649@qq.com
    @blog:http://blog.focusbe.com
    @github:https://github.com/focusbe
**/
define(['gplayer/v3/index'], function (GPlayer) {
    return GPlayer;
    //Do setup work here
    //获取前缀
    var prefix = PREFIX();
    var curentUrl = getJSPath('gplayer/v2.1.js');
    function gPlayer(container, videoindex, options) {
        "use strict";

        var ismicro = navigator.appName.indexOf("Microsoft") != -1;
        if (!container) return;
        var self = this;
        var player;
        var defaultoption = {
            file: '',
            width: '100%',
            height: 'auto',
            auto: false,
            image: '',
            version: 'v2',
            volume: 1,
            loop: false,
            toolbar: true,
            ratio: 0.6, //高宽比例
            swf: curentUrl + 'gplayer.swf',
            onComplete: function onComplete(index) {},
            onPlay: function onPlay(index) {},
            onReplay: function onReplay(index) {},
            onInit: function onInit(index) {},
            onResize: function onResize(index) {},
            mobile: {},
            pc: {}
        };
        if (!!options.version && options.version == 'v1') {
            defaultoption.swf = curentUrl + 'gplayer_v1.swf';
        }
        if (DEVICE.isMobile) {
            options = $.extend(options, options.mobile);
        } else {
            options = $.extend(options, options.pc);
        }
        options = $.extend(defaultoption, options);
        options.width = options.width.toString();
        options.height = options.height.toString();

        function setup() {
            if (DEVICE.isMobile) {
                player = new mobilePlayer();
                self.videoElement = player.videoElement;
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
        function loadCss(path) {
            if (!document.getElementById('gplayer_css')) {
                if (!path || path.length === 0) {
                    throw new Error('argument "path" is required !');
                }
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement('link');
                link.href = path;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                head.appendChild(link);
            }
        }

        function mobilePlayer() {
            if (!isNaN(options.width)) {
                options.width = options.width + 'px';
            }
            if (!isNaN(options.height)) {
                options.height = options.height + 'px';
            }
            loadCss(curentUrl + 'css/mobile_style.css');
            var self = this;
            var controlcss = "display:block;";
            if (!options.toolbar) {
                controlcss = "display:none;";
            }
            var videoElement, changedtime, playbtn, gplayervideowrap, timehander, controlbar, loading, gplayercontainer, optiondiv, controlbarclock, playpausbtn, totaltimepanel, currenttimepanel, loadedbar, playedbar, totaltime, timerail, fullscreen_button, gplayeroverlayposter;
            // var videocontainner = '<div class="GPLAYER-CONTAINER"><div class="GPLAYER_VIDEO"><video id="gplayer_video_player_'+videoindex+'" width="100%" height="100%" x-webkit-airplay="true" webkit-playsinline="true" preload="none" poster="'+options.image+'" tvp_loadingad_ended="1"></video></div><div class="GPLAYER_VIDEO"></div><div class="GPLAYER_CONTROLS"></div><div class="GPLAYER_EXTERNAL_INNER external_inner"></div></div>';
            var videocontainner = '<div class="gplayer_container gplayer_container_' + videoindex + '" style="width:' + options.width + ';height:' + options.height + '">' + '<div class="gplayer_video">'
            // +'<video id="gplayer_video_player_'+videoindex+'" width="100%" height="100%" x-webkit-airplay="true" webkit-playsinline="true" preload="none" poster="icons/black.png" gplayer_loadingad_ended="1"></video>'
            + '</div>' + '<div class="gplayer_overlay_poster" style="' + controlcss + '">' + '<div class="gplayer_poster_img" data-pic="" style=""></div>' + '</div>' + '<div class="gplayer_overlay_option" style="' + controlcss + '">' + '<span class="gplayer_button_play"></span>' + '<span class="gplayer_loading gplayer_none"></span>' + '</div>' + '<div class="gplayer_controls">' + '<div class="gplayer_button gplayer_play_button">' + '<button type="button" title="播放/暂停"><span class="gplayer_btn_value">播放</span></button>' + '</div>' + '<div class="gplayer_time_rail">' + '<span class="gplayer_time_total">' + '<span class="gplayer_time_loaded" style="width: 1%;"></span>' + '<span class="gplayer_time_current" style="width: 0.532144px;"><span class="gplayer_time_handle"></span></span>' + '</span>' + '<span class="gplayer_time_panel"><span class="gplayer_time_panel_current">00:00</span>            <span class="gplayer_time_panel_split">/</span>' + '<span class="gplayer_time_panel_total">00:00</span></span>' + '</div>' + '<div class="tvp_button gplayer_fullscreen_button tvp_fullscreen">' + '<button type="button" title="切换全屏"><span class="gplayer_btn_value">全屏</span></button>' + '</div>' + '</div>' + '<div class="gplayer_external_inner"></div>' + '</div>';
            function init() {
                videoElement = document.createElement("video");
                self.videoElement = videoElement;
                container.html(videocontainner);
                gplayercontainer = $(".gplayer_container_" + videoindex);
                gplayervideowrap = gplayercontainer.find(".gplayer_video");
                playbtn = gplayercontainer.find(".gplayer_button_play");
                loading = gplayercontainer.find(".gplayer_loading");
                controlbar = gplayercontainer.find(".gplayer_controls");
                optiondiv = gplayercontainer.find(".gplayer_overlay_option");
                playpausbtn = controlbar.find(".gplayer_play_button");
                currenttimepanel = controlbar.find('.gplayer_time_panel_current');
                totaltimepanel = controlbar.find('.gplayer_time_panel_total');
                loadedbar = controlbar.find('.gplayer_time_loaded');
                playedbar = controlbar.find('.gplayer_time_current');
                timehander = controlbar.find('.gplayer_time_handle');
                gplayeroverlayposter = gplayercontainer.find(".gplayer_poster_img");
                totaltime = 0;
                timerail = controlbar.find('.gplayer_time_rail');
                fullscreen_button = controlbar.find(".gplayer_fullscreen_button ");
                videoElement.style.width = options.width;
                videoElement.style.height = options.height;
                videoElement.style.background = '#000';
                videoElement.autoplay = options.auto;
                videoElement.volume = options.volume;
                videoElement.loop = options.loop;
                videoElement.style.display = 'none';
                self.setVideoUrl(options.file, options.image);
                // if (options.image) {
                //   self.setPoster(options.image);
                // }
                //
                // videoElement.load();
                gplayervideowrap.append(videoElement);
                setTimeout(function () {
                    videoElement.style.display = 'block';
                    options.onInit(videoindex);
                }, 20);

                // addEvent('abort', function(){
                //     console.log('abort');
                // });
                // addEvent('canplay', function(){
                //     console.log('canplay');
                // });
                // addEvent('canplaythrough', function(){
                //     console.log('canplaythrough');
                // });
                // addEvent('durationchange', function(){
                //     console.log('durationchange');
                // });
                addEvent('ended', function () {
                    options.onComplete(videoindex);
                    gplayeroverlayposter.fadeIn(100);
                });
                // addEvent('error', function(){
                //     console.log('error');
                // });
                addEvent('loadeddata', function () {
                    totaltime = videoElement.duration;
                    totaltimepanel.html(getformattime(videoElement.duration));
                });
                // addEvent('loadedmetadata', function(){
                //     console.log('loadedmetadata');

                // });
                // addEvent('loadstart', function(){
                //     console.log('loadstart');
                // });
                addEvent('pause', function () {
                    if (options.toolbar) {
                        playbtn.show();
                        playpausbtn.removeClass('gplayer_pause');
                        playpausbtn.addClass('gplayer_play');
                    }
                });
                addEvent('play', function () {
                    if (options.toolbar) {
                        gplayeroverlayposter.fadeOut();
                        playbtn.hide();
                        loading.hide();
                        playpausbtn.removeClass('gplayer_play');
                        playpausbtn.addClass('gplayer_pause');
                    }
                    options.onPlay(videoindex);
                });
                if (options.toolbar) {
                    addEvent('playing', function () {
                        loading.hide();
                        playpausbtn.removeClass('gplayer_play');
                        playpausbtn.addClass('gplayer_pause');
                    });
                    addEvent('progress', function () {
                        var buffered = videoElement.buffered;
                        var endtime = 0;
                        if (buffered.length > 0) {
                            endtime = buffered.end(buffered.length - 1);
                        }
                        //var percent = Math.floor(endtime/totaltime)*100+'%';
                        //console.log(percent);
                        //loadedbar.css({width:percent});
                    });
                    addEvent('timeupdate', function () {
                        var currenttime = getformattime(videoElement.currentTime);
                        var percent = parseInt(videoElement.currentTime / totaltime * 100) + '%';
                        playedbar.css({
                            width: percent
                        });
                        currenttimepanel.html(currenttime);
                    });
                    addEvent('waiting', function () {
                        loading.show();
                    });
                    playbtn.click(function (e) {
                        event.stopPropagation();
                        self.play();
                    });
                    optiondiv.click(function () {
                        showcontrolbar();
                    });
                    playpausbtn.click(function () {
                        if (videoElement.paused) {
                            self.play();
                        } else {
                            self.pause();
                        }
                        // console.log(videoElement.currentTime);
                    });
                    var startx, curtouchx, movetoucx;
                    var handertouched = false;
                    timehander.bind('touchstart', function (e) {
                        handertouched = true;
                        startx = e.originalEvent.touches[0].clientX;

                        videoElement.pause();
                        showcontrolbar();
                    });
                    timehander.bind('touchmove', function (e) {
                        if (handertouched) {
                            curtouchx = e.originalEvent.touches[0].clientX;
                            movetoucx = curtouchx - startx;
                            startx = curtouchx;
                            settimebar(movetoucx);
                        }
                        showcontrolbar();
                    });
                    timehander.bind('touchend', function (e) {
                        if (handertouched) {
                            curtouchx = e.originalEvent.changedTouches[0].clientX;
                            movetoucx = curtouchx - startx;
                            startx = curtouchx;
                            // console.log(movetoucx);
                            settimebar(movetoucx, true);
                            handertouched = false;
                        }
                        showcontrolbar();
                    });
                    fullscreen_button.click(function () {
                        launchFullscreen(videoElement);
                        showcontrolbar();
                    });
                }

                // addEvent('ratechange', function(){
                //     console.log('ratechange');

                // });
                // addEvent('seeked', function(){
                //     console.log('seeked');
                // });
                // addEvent('seeking', function(){
                //     console.log('seeking');
                // });
                // addEvent('stalled', function(){
                //     console.log('stalled');
                // });
                // addEvent('suspend', function(){
                //     console.log('suspend');
                // });

                // addEvent('volumechange', function(){
                //     console.log('volumechange');
                // });
            }
            var curbarwidth, changperchent, seektime;

            function settimebar(changetime, seek) {
                if (typeof seek == 'undefined') seek = false;
                curbarwidth = playedbar.width();
                changedtime = curbarwidth + changetime;
                if (changedtime < 0) {
                    changedtime = 0;
                }
                if (changedtime > timerail.width()) {
                    changedtime = timerail.width();
                }
                changperchent = changedtime / timerail.width();
                if (seek) {
                    seektime = changperchent * totaltime;
                    videoElement.currentTime = seektime;
                    self.play();
                }
                playedbar.css({
                    width: changperchent * 100 + '%'
                });
            }

            function showcontrolbar() {
                if (!controlbarclock) {
                    controlbar.css({
                        bottom: '0'
                    });
                } else {
                    clearTimeout(controlbarclock);
                }
                controlbarclock = setTimeout(function () {
                    controlbar.css({
                        bottom: -40
                    });
                    controlbarclock = null;
                }, 1500);
            }

            function launchFullscreen(element) {
                //此方法不可以在異步任務中執行，否則火狐無法全屏
                if (element.requestFullscreen) {
                    element.requestFullscreen();
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
                sourceElement.type = formats[getsuffix(fileurl)];
                videoElement.appendChild(sourceElement);
            }

            function getformattime(second) {
                second = parseInt(second);
                var result = '';
                var shengyu = second;
                var h = Math.floor(second / (60 * 60));
                second = second - h * (60 * 60);
                var m = Math.floor(second / 60);
                second = second - h * 60;
                if (h < 10) h = '0' + h;
                if (m < 10) m = '0' + m;
                if (second < 10) second = '0' + second;
                if (h != '00') {
                    result += h + ':';
                }
                result += m + ':' + second;
                return result;
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
            this.setPoster = function (imageurl) {
                if (typeof imageurl == 'undefined') {
                    imageurl = "";
                }
                gplayeroverlayposter.attr('data-pic', imageurl);
                gplayeroverlayposter.css({
                    backgroundImage: 'url(' + imageurl + ')'
                });
            };
            this.setVideoUrl = function (fileurl, imageurl) {
                videoElement.pause();
                var childNodes = videoElement.childNodes;
                for (var i = 0; i < childNodes.length; i++) {
                    videoElement.removeChild(childNodes[i]);
                }
                addsources(videoElement, fileurl);
                this.setPoster(imageurl);
                // videoElement.poster = imageurl;
                gplayeroverlayposter.stop().show();
                playbtn.show();
                loading.hide();
                videoElement.load();
            };
            init();
        }
        //flash播放器
        function flashPlayer() {
            var self = this;
            var isflashloaded = false;
            var flashloadedCallbacks = [];

            function init() {
                if (typeof window.playerindex == 'undefined') {
                    window.playerindex = 0;
                } else {
                    window.playerindex++;
                }
                if (!isNaN(options.width)) {
                    options.width = options.width + 'px';
                } else if (options.width.indexOf('%') < 0) {
                    options.width = '100%';
                }
                if (!isNaN(options.height)) {
                    options.height = options.height + 'px';
                }
                options.file = getFilePath(options.file);
                self.videoid = 'GPLAYER_video' + playerindex;
                self.currentvideo = options.file;
                var imghtml = '';
                var imgshowcss = 'display:none;';
                if (options.image) {
                    imgshowcss = 'display:block;';
                }
                if (options.toolbar) {
                    imghtml = '<div class="GPLAYER_video_popup_image" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:10;background:#000 url(' + options.image + ') no-repeat center;background-size:cover;' + imgshowcss + '"><a href="javascript:void(0)" class="GPLAYER_video_play_btn" style="outline:none;width:67px;height:67px;background:url(' + curentUrl + 'play.png) no-repeat center;position:absolute;left:50%;top:50%;z-index:20;display:block;margin-left:-34px;margin-top:-34px;transition: all 0.3s;-moz-transition: all 0.3s;-webkit-transition: all 0.3s;-o-transition: all 0.3s;"></a><div class="GPLAYER_black_bg" style="width:100%;height:100%;position:absolute;background:#000;opacity:0.3;filter:alpha(opacity=30);z-index:15;"></div></div>';
                }
                var outterHeight = '';
                var innerTop = '';
                var objHeight = '100px';
                var extrecss = "";
                if (options.height == 'auto') {
                    if (DEVICE.isIe7 || DEVICE.isIe6) {
                        outterHeight = '1px';
                    } else {
                        outterHeight = '0';
                    }
                    innerTop = "-120%";
                } else {
                    outterHeight = options.height;
                    innerTop = 0;
                    objHeight = "100%";
                }
                var objectHtml = '';
                if (!ismicro) {
                    objectHtml = '<embed style="vertical-align:top;" id="' + self.videoid + '" flashvars="setContainerSize=setContainerSize' + window.playerindex + '&toolbar=' + options.toolbar + '&videoUrl=' + options.file + '&getUserComplete=videoComplete' + window.playerindex + '&flashComplete=flashLoaded' + window.playerindex + '"src="' + options.swf + '" quality="high" width="100%" height="100%" name="flashResize" wmode="Opaque" align="middle" allowScriptAccess="always" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer_cn" bgcolor="#000000" />';
                } else {
                    objectHtml = '<object style="vertical-align:top;" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="100%" height="100%" align="middle" id="' + self.videoid + '">' + '<param name="allowScriptAccess" value="always" />' + '<param name="allowFullScreen" value="true" />' + '<param name="movie" value="' + options.swf + '"/>' + '<param name="bgcolor" value="#000000" />' + '<param name="wmode" value="Opaque">' + '<param name="quality" value="high" />' + '<param name="FlashVars" value="setContainerSize=setContainerSize' + window.playerindex + '&toolbar=' + options.toolbar + '&videoUrl=' + options.file + '&getUserComplete=videoComplete' + window.playerindex + '&flashComplete=flashLoaded' + window.playerindex + '"/>' + '</object>';
                }
                var html = "<div class='video_wrap_outter' style='width:" + options.width + ";height:" + outterHeight + ";position:relative;overflow:hidden;'><div style='position:relative;top:" + innerTop + ";width:100%;height:" + objHeight + ";' class='video_wrap_inner' id=video_wrap_inner_" + self.videoid + ">" + imghtml + objectHtml + "</div></div>";
                container.html(html);
                window['videoComplete' + window.playerindex] = function () {
                    if (options.loop) {
                        player.play();
                        options.onReplay(videoindex);
                    } else {
                        $(".GPLAYER_video_popup_image").fadeIn();
                        options.onComplete(videoindex);
                    }
                };
                var video_wrap_outter = container.find(".video_wrap_outter");
                var video_wrap_inner = container.find(".video_wrap_inner");

                window['setContainerSize' + window.playerindex] = function (array) {
                    self.videosize = array;
                    if (options.height == 'auto') {
                        setHeight();
                    } else {
                        video_wrap_outter.height(options.height);
                        video_wrap_inner.css({ top: 0, height: '100%' });
                    }
                };
                if (options.version == 'v1') {
                    options.onInit(videoindex);
                    if (options.auto) {
                        setTimeout(function () {
                            self.play();
                        }, 1000);
                    }
                } else {
                    window['flashLoaded' + window.playerindex] = function () {
                        isflashloaded = true;
                        options.onInit(videoindex);
                        if (options.auto) {
                            setTimeout(function () {
                                self.play();
                            }, 500);
                        }
                        for (var i in flashloadedCallbacks) {
                            if (_typeof(flashloadedCallbacks[i] == 'function')) {
                                flashloadedCallbacks[i]();
                            }
                        }
                    };
                }
                container.find(".GPLAYER_video_popup_image").hover(function () {
                    $(this).find(".GPLAYER_black_bg").stop().animate({
                        opacity: 0.6
                    }, 300);
                    $(this).find(".GPLAYER_video_play_btn").css(prefix.css + 'transform', 'scale(1.1)');
                }, function () {
                    $(this).find(".GPLAYER_black_bg").stop().animate({
                        opacity: 0.3
                    }, 300);
                    $(this).find(".GPLAYER_video_play_btn").css(prefix.css + 'transform', 'none');
                });
                container.find(".GPLAYER_video_play_btn").click(function () {
                    self.play();
                });
                function setHeight(resizeRun) {
                    var width, height;
                    if (options.height == 'auto' || typeof resizeRun != 'undefined') {
                        if (options.width.indexOf('%') > -1) {
                            width = video_wrap_outter.width();
                            // if (typeof(resizeRun) == 'undefined') {
                            //     $(window).resize(function() {
                            //         setHeight(true);
                            //     });
                            // }
                        } else {
                            width = parseInt(options.width);
                        }
                        height = width * self.videosize[1] / self.videosize[0];
                        // height = width * options.ratio;
                        video_wrap_inner.css({ top: 0, height: '100%' });
                        if (options.resizeAnimate) {
                            video_wrap_outter.animate({ height: height }, 300);
                        } else {
                            video_wrap_outter.height(height);
                        }
                        // options.height = "100%";
                        options.onResize(videoindex, height);
                    } else {
                        video_wrap_outter.height('100%');
                        video_wrap_inner.css({ top: 0, height: '100%' });
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
            this.play = function () {
                // var time = 0;
                // if(container.find(".GPLAYER_video_popup_image").css('display')!='none')
                // {
                //   time = 100;
                // }
                if (isflashloaded) {
                    container.find(".GPLAYER_video_popup_image").fadeOut();
                    setTimeout(function () {
                        getElement().resumeVideo();
                    }, 100);
                    options.onPlay(videoindex);
                } else {
                    flashloadedCallbacks.push(function () {
                        container.find(".GPLAYER_video_popup_image").fadeOut();
                        setTimeout(function () {
                            getElement().resumeVideo();
                        }, 100);
                        options.onPlay(videoindex);
                    });
                }
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
                    container.find(".GPLAYER_video_popup_image").css({
                        backgroundImage: 'url(' + image + ')'
                    }).fadeIn(300);
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

    function pcPopupVideo(options) {
        var popupoptions = $.extend({}, options);
        var videooptions = $.extend({}, options);
        videooptions.auto = false;
        resizeCall = videooptions.onResize;
        videooptions.onResize = function (videoindex, height) {
            self['popup'].resize(self.popupobj, { height: height, marginTop: -height / 2 });

            if (typeof resizeCall == 'function') {
                resizeCall();
            }
        };
        var self = this;
        if ($(".POPUP-GPLAYER").length < 1) {
            var popupobj = '<div class="POPUP-GPLAYER" style="display:none;background:#000;"><a style="width:50px;height:50px;background:url(' + curentUrl + '/close.jpg) no-repeat center;position:absolute;top:0;right:-50px;display:block;" class="POPUP-GPLAYER-CLOSE close" href="javascript:void(0)"></a><div id="POPUP-GPLAYER-CONTAINER"></div></div>';
            popupobj = $(popupobj);
            $('body').append(popupobj);
            popupoptions = $.extend(popupoptions, {
                animation: 'fade'
            });
            this['popup'] = popupobj.gpopup(popupoptions);
            this['video'] = popupobj.find("#POPUP-GPLAYER-CONTAINER").gplayer(videooptions);
            this['popup'].setVideo(this['video']);
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

    function mobilePopupVideo(options) {
        var popupoptions = $.extend({}, options);
        var videooptions = $.extend({}, options);
        var self = this;
        videooptions.auto = false;
        if ($(".VIDEOBG").length == 0) {
            var videobg = $('<div class="VIDEOBG"></div>');
            $('body').append(videobg);
            videobg.css(_defineProperty({
                width: '100%',
                height: '100%',
                background: '#000',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center'
            }, 'display', 'none'));
            var topbar = $('<div class="VIDEOTOP"></div>');
            var finish = $('<a href="javascript:void(0)" class="VIDEO-FINISH">完成</a>');
            videobg.append(topbar);
            topbar.append(finish);
            var videoWrap = $('<div id="VIDEOWRAP"></div>');
            videobg.append(videoWrap);
            topbar.css({
                width: '100%',
                height: '40px',
                background: 'rgba(200, 200, 200,0.6)',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: '9999999'
            });
            finish.css({
                display: 'inline-block',
                lineHeight: '30px',
                padding: '0 10px',
                color: '#020202',
                borderRadius: '5px',
                position: 'relative',
                left: 0,
                top: 5,
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: '微软雅黑'
            });
            videoWrap.css({
                width: '100%',
                position: 'absolute',
                zIndex: '100',
                top: '50%'
            });
            setCss3(videoWrap, 'transform', 'translate(0,-50%)');
        } else {
            var videoWrap = $("#VIDEOWRAP");
        }
        this['video'] = videoWrap.gplayer(videooptions);
        // this['video'].videoElement.addEventListener('fullscreenchange',function(e){
        //   if (self['video'].videoElement.webkitIsFullScreen || self['video'].videoElement.mozFullScreen || self['video'].videoElement.msFullscreenElement !== null)
        //   {
        //       /* Run code on exit */
        //   }

        // });
        // this['video'].videoElement.addEventListener('webkitfullscreenchange',function(e){

        // });
        this.show = function (file, img) {
            notouch();
            $(".VIDEOBG").show();
            $(".VIDEOBG")[0].style.visibility = 'visible';
            self['video'].setVideoUrl(file, img);
            self['video'].play();
            $(".VIDEO-FINISH").unbind('click').click(function () {
                playEnd();
            });
        };
        this.hide = function () {
            playEnd();
        };
        function isfullscreen(obj) {
            return obj.fullscreen || obj.webkitIsFullScreen || obj.mozFullScreen;
        }
        function playEnd() {
            self['video'].pause();
            $(".VIDEOBG").hide();
            $(".VIDEOBG")[0].style.visibility = 'hidden';
            cantouch();
        }
    }

    function notouch() {
        document.addEventListener('touchmove', bodyScroll, false);
    }

    function cantouch() {
        document.removeEventListener('touchmove', bodyScroll, false);
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

    function GPLAYERSET(allset) {
        if (typeof allset != 'undefined' && allset) {
            $(".GPLAYER-CONTAINER").each(function () {
                $(this).html('');
                $(this).removeClass('GPLAYER-SETTED');
            });
        }
        if ($(".GPLAYER-CONTAINER").not($(".GPLAYER-SETTED")).length > 0) {
            $(".GPLAYER-CONTAINER").not($(".GPLAYER-SETTED")).each(function () {
                var pcwidth = $(this).data('pcwidth');
                if (!pcwidth) {
                    pcwidth = '100%';
                }
                var mwidth = $(this).data('mwidth');
                if (!mwidth) {
                    mwidth = '100%';
                }
                var pcheight = $(this).data('pcheight');
                if (!pcheight) {
                    pcheight = 'auto';
                }
                var mheight = $(this).data('mheight');
                if (!mheight) {
                    mheight = 'auto';
                }
                var pcoptionHeight = "100%";
                var mobileoptionHeight = "100%";
                if (DEVICE.isMobile) {
                    $(this).css({ width: mwidth, height: mheight });
                } else {
                    $(this).css({ width: pcwidth, height: pcheight });
                }
                if (pcheight == 'auto') {
                    pcoptionHeight = 'auto';
                }
                if (mheight == 'auto') {
                    mobileoptionHeight = 'auto';
                }
                var options = {
                    mobile: {
                        file: $(this).data('file'),
                        width: "100%",
                        height: mobileoptionHeight,
                        auto: $(this).data('auto'),
                        image: $(this).data('image'),
                        volume: 1,
                        loop: $(this).data('loop')
                    },
                    pc: {
                        file: $(this).data('file'),
                        width: "100%",
                        height: pcoptionHeight,
                        auto: $(this).data('auto'),
                        image: $(this).data('image'),
                        volume: 1,
                        loop: $(this).data('loop')
                    }
                };
                $(this).gplayer(options);
                $(this).addClass('GPLAYER-SETTED');
            });
        }
    }
    if ($) {
        (function ($) {
            $.fn.gplayer = function (params) {
                var result = [];
                if (typeof window.gplayervideoIndex == 'undefined') {
                    window.gplayervideoIndex = 0;
                }
                this.each(function (index) {
                    result.push(new gPlayer($(this), gplayervideoIndex, params));
                    gplayervideoIndex++;
                    // $(this).data('gplayer', new GPlayer($(this), params));
                });
                if (result.length <= 1) {
                    return result[0];
                }
                return result;
            };
        })($);
        $(function () {
            GPLAYERSET();
        });
    }
    return {
        gplayer: gPlayer,
        popupVideo: popupVideo()
    };
});