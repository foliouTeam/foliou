define(['jquery'], function ($) {
    var canvasframe = function (container, options) {
        "use strict";
        var defaultOption = {
            width: 'auto',
            height: 'auto',
            file: '',
            autoplay: false,
            preload: true,
            fps: 20,
            prefix: '',
            framesArray: '',
            loop: true,
            audio: true,
            frames: 1,
            startframe: 1,
            format: '.jpg',
            areadyloaded: false,
            playbyloaded: false,
            formName: true,
            oninit: function () {

            },
            onplay: function () {

            },
            onpause: function () {

            },
            onstop:function(){

            },
            onprogress: function () {

            },
            onseeking: function () {

            },
            ontimeupdate: function () {

            },
            onwaiting: function () {

            },
            onplaying: function () {

            },
            oncanplay: function () {

            },
            onloaded: function () {

            },
            onloading: function () {

            }
        };
        var framesArray = {};
        if (options.framesArray) {
            framesArray = options.framesArray;
        }
        var loadqueue = [];
        options = $.extend(defaultOption, options);
        var self = this;
        var curframe = options.startframe;
        var ctx = null;
        var pauseFrame = -1;
        var pauseCallback = null;
        var loadFrameCallback = {};
        var curstate = 'stop';
        var imgwidth;
        var imgheight;
        var clock = null;
        this.prefix = options.prefix;
        this.init = function () {
            if (options.width != 'auto' && options.height != 'auto') {
                self.createCanvas();
            } else {
                if (typeof (options.framesArray) == 'object') {

                    for (var i in framesArray) {
                        options.width = framesArray[i].width;
                        options.height = framesArray[i].height;
                        self.createCanvas();
                        break;
                    }
                } else {
                    loadFrameCallback['0setcanvas'] = function (frame) {
                        imgwidth = framesArray[frame].width;
                        imgheight = framesArray[frame].height;
                        if (options.width == 'auto' && options.height == 'auto') {
                            options.width = imgwidth;
                            options.height = imgheight;
                        } else if (options.width == 'auto') {
                            var scale = options.height / imgheight;
                            options.width = imgwidth * scale;
                        } else {
                            var scale = options.width / imgwidth;
                            options.height = imgheight * scale;
                        }
                        self.createCanvas();
                        loadFrameCallback['0setcanvas'] = null;
                    };
                }

            }
            if (options.areadyloaded) {

                if (options.autoplay) {
                    self.play();
                }

            } else {
                var imgobj = [];
                for (var i = 1; i <= options.frames; i++) {
                    // imgobj.push({
                    //     id: i,
                    //     src: options.file + '/' + options.prefix + i + '.jpg'
                    // });
                    loadqueue.push(i);
                }
                loadframes();
                if (options.playbyloaded) {
                    loadFrameCallback['preloading'] = function (frame) {
                        var percent = Math.floor(frame / options.frames * 100);
                        options.onloading(percent);
                        if (percent >= 100) {
                            options.onloaded();
                        }
                    }
                }
                if (options.autoplay) {
                    self.play();
                }
            }

        };
        this.createCanvas = function () {
            self.canvas = document.createElement('canvas');
            self.canvas.width = options.width;
            self.canvas.height = options.height;
            if (container) {
                container.append(self.canvas);
            }
            self.ctx = self.canvas.getContext('2d');
        };

        this.play = function (frame) {
            if (clock) {

                clearInterval(clock);
            }
            if (typeof (frame) != 'undefined') {
                curframe = frame;
            }
            clock = setInterval(function () {
                if (curframe > options.frames) {
                    if (!options.loop) {
                        clearInterval(clock);
                        options.onpause();
                        options.onstop();
                        return;
                    } else {
                        curframe = 1;
                    }
                }
                if (pauseFrame == curframe) {
                    pauseFrame = -1;
                    
                    clearInterval(clock);
                    options.onpause();
                    if (typeof (pauseCallback) == 'function') {
                        pauseCallback();
                    }
                    pauseCallback = null;
                    return;
                }

                if (self.frameIsLoaded(curframe)) {
                    self.drawFrames(curframe);
                    curframe++;
                } else {
                    
                    clearInterval(clock);
                    options.onpause();
                    loadFrameCallback[loadFrameCallback.length] = function (frame) {
                        if (frame == curframe) {
                            self.play(curframe);
                        }
                    };
                }
            }, 1000 / options.fps);
        };
        this.frameIsLoaded = function (frame) {
            if (typeof (framesArray[self.prefix + frame]) != 'undefined' && framesArray[self.prefix + frame]) {
                return true;
            } else {
                return false;
            }

        };
        this.threeNum = function (num) {
            if (num >= 0 && num < 10) {
                return "00" + num;
            } else if (num < 100) {
                return "0" + num;
            } else {
                return num;
            }
        };
        this.pause = function (frame, callback) {
            if (typeof (frame) == 'undefined') {
                frame = curframe + 1;

            }
            if (typeof (callback) == 'undefined') {
                callback = null;
            }
            pauseCallback = callback;
            pauseFrame = frame;
        };
        this.stop = function (frame, callback) {
            curframe = frame - 1;
            if (curframe <= 0) {
                curframe = options.frames;
            }
            self.pause(frame, callback);
        };
        this.drawFrames = function (frame) {

            if (frame <= 0) {
                frame += options.frames;
            }
            frame = (frame - 1) % (options.frames) + 1;
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            self.ctx.drawImage(framesArray[self.prefix + frame], 0, 0);
        }

        this.playTo = function (frame, time) {

            if (frame <= 0) {
                frame += options.frames;
            }
            frame = (frame - 1) % (options.frames) + 1;
            if (curframe == frame) {
                
                clearInterval(clock);
                self.drawFrames(curframe);
                options.onpause();
                return;
            }

            var direction = (frame - curframe) / Math.abs(frame - curframe);
            if (isNaN(direction)) {
                direction = 0;
                
                clearInterval(clock);
                options.onpause();
                return;
            }
            if (Math.abs(frame - curframe) >= (options.frames - 2)) {
                direction = -direction;
            }
            //   console.log(direction);
            var pertime;
            if (direction > 0) {
                if (frame > curframe) {
                    pertime = parseInt(time / Math.abs(frame - curframe));
                } else {
                    pertime = parseInt(time / Math.abs(frame - curframe + options.frames));
                }
            } else {
                if (frame < curframe) {
                    pertime = parseInt(time / Math.abs(frame - curframe));
                } else {
                    pertime = parseInt(time / Math.abs(frame - curframe - options.frames));
                }
            }
            if (isNaN(pertime)) {
                pertime = 0;
            }
            if (clock) {
                clearInterval(clock);
            }

            clock = setInterval(function () {
                if (parseInt(curframe) == parseInt(frame)) {
                    
                    clearInterval(clock);
                    options.onpause();
                    return;
                }

                if (self.frameIsLoaded(curframe)) {
                    //   console.log(curframe);
                    self.drawFrames(curframe);
                } else {}
                curframe += direction;
                if (curframe <= 0) {
                    curframe += options.frames;
                }
                curframe = (curframe - 1) % (options.frames) + 1;
            }, pertime);



        }

        function loadframes() {
            if (loadqueue.length > 0) {
                var curframeid = loadqueue[0];
                if (typeof (framesArray[curframeid]) == 'undefined' || !framesArray[curframeid]) {
                    var image = new Image();
                    image.onload = function () {
                        framesArray[curframeid] = image;
                        for (var i in loadFrameCallback) {
                            if (typeof (loadFrameCallback[i]) == 'function') {
                                loadFrameCallback[i](curframeid);
                            }
                        }
                        loadqueue.shift();
                        loadframes();
                    }
                    var curframeid2 = curframeid;

                    if (options.formName) {
                        if (curframeid < 10) {
                            curframeid2 = '00' + curframeid;
                        } else if (curframeid < 100) {
                            curframeid2 = '0' + curframeid;
                        }
                    }

                    image.src = options.file + curframeid2 + options.format;
                } else {
                    loadqueue.shift();
                    loadframes();
                }
            }
        }

        this.init();
    };

    var AUDIO = function (options) {

    };
    return canvasframe;
});