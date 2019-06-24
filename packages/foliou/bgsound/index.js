/**
    @author:liupeng
    @email:liupeng@ztgame.com
    @blog:http://blog.focusbe.com
    @github:https://github.com/focusbe
**/
define(['jquery','prefix/v1','device/main'],function($,PREFIX,DEVICE){
    var BgSound = function(option,dom){
    	var audioElement = null;
    	var volumeclock = null;
    	var volume = 1;
        var self = this;
        var cursrc = '';
        var curstate;
        var shouldplay = false;
        var defaultOption = {
            file:'',
            loop:true,
            volume:1,
            autoplay:true,
            onplay:function(){

            },
            onpause:function(){

            }
        }
        option = $.extend(defaultOption,option);
        self.init = function(){
            var soundAudio = !!dom?dom.find(".SOUND_AUDIO"):$("#SOUND_AUDIO");
            var soundWrap = !!dom?dom:$('body')
            if(soundAudio.length==0)
            {
                var soundaudio_outer = $('<div id="SOUND_AUDIO_outer"></div>');
                soundaudio_outer.css({position:'absolute',width:100,height:100,top:'-500%'});
                soundWrap.append(soundaudio_outer);
                soundaudio_outer.append('<audio id="SOUND_AUDIO" class="SOUND_AUDIO"></audio>');
            }
            soundAudio = !!dom?dom.find(".SOUND_AUDIO"):$("#SOUND_AUDIO");
            self.audioElement = soundAudio[0];
            // else{
            //     self.audioElement = soundAudio[0];
            // }
            console.log(self.audioElement);
            self.setAudio();
            if (option.autoplay) {
                if (typeof WeixinJSBridgeReady === 'undefined') {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', function () {
                            self.play();
                            $('body').unbind('touchstart', touchPlayZhibo);
                        }, false);
                    }
                }
                $(function(){
                    try {
                        self.play();
                    } catch (error) {
                        
                    }
                });
                
                $('body').bind('touchstart', touchPlayZhibo);
                function touchPlayZhibo() {
                    self.play();
                    $('body').unbind('touchstart', touchPlayZhibo);
                }

            }
            self.bind();
        };
        self.bind = function(){
            if(!self.audioElement){
                return;
            }
            self.audioElement.addEventListener("playing", function(){
                if(typeof(option.onplay)=='function')
                {
                    option.onplay();
                }
            },false);
            self.audioElement.addEventListener("pause", function(){
                if(typeof(option.onpause)=='function')
                {
                    option.onpause();
                }
            },false);
            self.audioElement.addEventListener("ended", function(){
                if(typeof(option.onpause)=='function')
                {
                    option.onpause();
                }
            },false);
            self.bindBackRun();
        };
        self.setAudio = function(thisoption){
            if(typeof(thisoption)=='object')
            {
                option = $.extend(option,thisoption);
            }
            if(cursrc!=option.file)
            {
                SOUND_AUDIO.src = option.file;
                cursrc = option.file;
            }
    		if(!option.loop)
    		{
    			SOUND_AUDIO.removeAttribute('loop');
    		}
    		else
    		{
    			SOUND_AUDIO.loop = 'loop';
    		}
    		SOUND_AUDIO.volume = option.volume;
            volume = option.volume;
        };
    	self.play = function(thisoption){
            if(typeof(thisoption)=='object')
            {
                option = $.extend(option,thisoption);
                self.setAudio();
            }
            else if(typeof(thisoption)=='string')
            {
                option.file = thisoption;
                self.setAudio();
            }
    		self.resume();
            curstate = 'play';
    	};
    	self.pause = function(huanchun){
    		if(!self.audioElement)
                return;
            if(DEVICE.isiOS){
                huanchun = false;
            }
            if(typeof(huanchun)=='undefined')
            {
                huanchun = true;
            }
    		if(self.volumeclock)
    		{
    			clearInterval(self.volumeclock);
    			self.volumeclock = null;
    		}
    		//self.audioElement.pause();
            if(huanchun)
            {
                volume = self.audioElement.volume;
        		self.volumeclock = setInterval(function(){
                    volume-=0.2;
        			if(volume<=0)
        			{
                        volume = 0;
        				self.audioElement.volume = 0;
        				clearInterval(self.volumeclock);
        				self.volumeclock = null;
        				self.audioElement.pause();
        				return;
        			}
                    else{
                        self.audioElement.volume=volume;
                    }

        		},100);
            }
            else{
                self.audioElement.volume = 0;
                self.audioElement.pause();
            }
            curstate = 'pause';
    	};
    	self.stop = function(huanchun){
            self.pause(huanchun);
            self.audioElement.load();
    	};
    	self.resume = function(){
    		if(!self.audioElement)
    			return;
    		if(self.volumeclock)
    		{
    			clearInterval(self.volumeclock);
    			self.volumeclock = null;
    		}
    		volume = self.audioElement.volume;
    		self.audioElement.play();
    		self.volumeclock = setInterval(function(){
                volume+=0.2;
    			if(volume>=option.volume)
    			{
                    self.audioElement.volume = option.volume;
    				clearInterval(self.volumeclock);
    				self.volumeclock = null;
    				return;
    			}
                else{
                    self.audioElement.volume=volume;
                }

    		},100);
            curstate = 'play';
    	};
        self.bindBackRun = function(){
            // Get Browser Specific Hidden Property
            function hiddenProperty(prefix) {
              if (prefix) {
                return prefix + 'Hidden';
              } else {
                return 'hidden';
              }
            }

            // Get Browser Specific Visibility State
            function visibilityState(prefix) {
              if (prefix) {
                return prefix + 'VisibilityState';
              } else {
                return 'visibilityState';
              }
            }
            // Get Browser Specific Event
            function visibilityEvent(prefix) {
              if (prefix) {
                return prefix + 'visibilitychange';
              } else {
                return 'visibilitychange';
              }
            }

            var prefix = PREFIX.js;
            var hidden = hiddenProperty(prefix);
            var visibilityState = visibilityState(prefix);
            var visibilityEvent = visibilityEvent(prefix);
            document.addEventListener(visibilityEvent, function(event) {
                if (!document[hidden]) {
                    // The page is visible.
                    if(shouldplay)
                    {
                        self.resume();
                    }
                } else {
                    // The page is hidden.
                    if(curstate=='play')
                    {
                        shouldplay = true;
                        self.pause(false);
                    }
                    else{
                        shouldplay = false;
                    }
                }
            });

        }
        self.init();
    }
    return BgSound;
});
