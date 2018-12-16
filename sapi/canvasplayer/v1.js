define(['jquery'], function($) {
    var canvasplayer = function(container, options) {
        "use strict";
        var defaultOption = {
            width: 'auto',
            height: 'auto',
            file: '',
            autoplay: false,
            preload: true,
            fps: 20,
            prefix: '',
            images: '',
            loop: true,
            audio: true,
            frames: 0,
            startframe:0,
            areadyloaded: false,
            oninit: function() {

            },
            onplay: function() {

            },
            onpause: function() {

            },
            onprogress: function() {

            },
            onseeking: function() {

            },
            ontimeupdate: function() {

            },
            onwaiting: function() {

            },
            onplaying: function() {

            },
            oncanplay: function() {

            },
            onloaded: function() {

            },
            onloading: function() {

            }
        };
        var framesArray = {};
        var loadqueue = [];
        options = $.extend(defaultOption, options);
        var self = this;
        var curframe = options.startframe;
        var ctx = null;
        var pauseFrame = -1;
        var pauseCallback = null;
        this.init = function() {
            self.canvas = document.createElement('canvas');
            // self.audio = null;
            // if(options.audio)
            // {
            // 	self.audio = document.createElement('audio');
            // 	self.audio.src=options.file+'/audio.mp3';
            // }
            self.canvas.width = options.width;
            self.canvas.height = options.height;
            if (container) {
                container.append(self.canvas);
            }
            self.ctx = self.canvas.getContext('2d');
            if (options.areadyloaded) {
                self.play();
            } else {
                var imgobj = [];
                for (var i = 1; i <= options.frames; i++) {
                    imgobj.push({
                        id: i,
                        src: options.file + '/' + options.prefix + i + '.jpg'
                    });
                }

                PreloadImage.loadImage(imgobj, function(percent) {
                    options.onloading(percent);
                    if (percent >= 100) {
                        self.play();
                    }
                });
            }

        };
        var clock = null;
        this.play = function(frame) {
            if (clock) {
                clearInterval(clock);
            }
            if(typeof(frame)!='undefined')
            {
            	curframe = frame;
            }
            clock = setInterval(function() {
                if (curframe > options.frames) {
                    if (!options.loop) {
                        clearInterval(clock);
                        return;
                    } else {
                        curframe = 1;
                    }
                }
                if(pauseFrame==curframe){
                	pauseFrame = -1;

                	clearInterval(clock);
                	if(typeof(pauseCallback)=='function')
                	{
                		pauseCallback();
                	}
                	pauseCallback = null;
                    return;
                }
                self.drawFrames(curframe);
                curframe++;
            }, 1000 / options.fps);
        }
        this.pause = function(frame,callback){
        	if(typeof(frame)=='undefined')
        	{
        		frame = curframe+1;
        		
        	}
        	if(typeof(callback)=='undefined')
        	{
        		callback = null;
        	}
        	pauseCallback = callback;
        	pauseFrame = frame;
        };
        this.stop = function(frame,callback){
        	curframe = frame-1;
        	if(curframe<=0)
        	{
        		curframe = options.frames;
        	}
        	self.pause(frame,callback);
        };
        this.drawFrames = function(frame) {
            if (typeof(PreloadImage.getImage(options.prefix + frame)) == 'undefined' || !PreloadImage.getImage(options.prefix + frame)) {
                return;
            }

            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
            self.ctx.drawImage(PreloadImage.getImage(options.prefix + frame), 0, 0);
        }
        this.init();

        function loadframes() {
            if (loadqueue.length > 0) {
                var curframeid = loadqueue[0];
                if (typeof(framesArray[curframeid]) == 'undefined' || !framesArray[curframeid]) {
                    var image = new Image();
                    image.onload = function() {
                        framesArray[curframeid] = image;
                        loadqueue.shift();
                        loadframes();
                    }
                    image.src = options.file + '/frames/' + curframeid + '.jpg';
                } else {
                    loadqueue.shift();
                    loadframes();
                }
            }
        }
    };
		return canvasplayer;
});
