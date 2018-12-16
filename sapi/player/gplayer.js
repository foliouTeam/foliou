define(['jquery'],function ($$) {
    function IsPC(){
    var userAgentInfo = navigator.userAgent;  
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
    var flag = true;  
      for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {flag = false;break;}  
    }
    return flag;
  }
  var isMobile = !IsPC();
  var curentUrl = getJSPath('gplayer.js');
  function gPlayer(container,videoindex,options)
  {
    "use strict";
    var ismicro = navigator.appName.indexOf("Microsoft") != -1;
    if (!container) return;
    var player;
    
    var defaultoption = {
      file:'',
      width:'100%',
      height:'auto',
      auto:false,
      image:'',
      volume:1,
      loop:false,
      ratio:0.6,//高宽比例
      swf:curentUrl+'gplayer.swf',
      onComplete:function(index){

      },
      onPlay:function(index){

      },
      mobile:{},
      pc:{}
    };
    if(isMobile)
    {
      options = $$.extend(options,options.mobile);
    }
    else
    {
      options = $$.extend(options,options.pc);
    }
    options = $$.extend(defaultoption,options);
    options.width = options.width.toString();
    options.height = options.height.toString();
    function setup()
    {
      if(isMobile)
      {
        player = new mobilePlayer();
      }
      else
      {
        player = new flashPlayer();
      }
    }
    this.play = function(){
      player.play();
    };
    this.pause = function(){
        player.pause();
    };
    this.stop = function(){
        player.stop();
    };
    this.setVolume = function(value)
    {
      player.setVolume(value);
    }
    this.setVideoUrl = function(url)
    {
      player.setVideoUrl(url);
    }
    var e = {mp4: "video/mp4",vorbis: "audio/ogg",ogg:a + "video/ogg",webm: "video/webm",aac: "audio/mp4",mp3: "audio/mpeg",hls: "application/vnd.apple.mpegurl"};
    var formats = {mp4: e.mp4,f4v: e.mp4,m4v: e.mp4,mov: e.mp4,m4a: e.aac,f4a: e.aac,aac: e.aac,mp3: e.mp3,ogv: e.ogg,ogg: e.vorbis,oga: e.vorbis,webm: e.webm,m3u8: e.hls,hls: e.hls}, a = "video", a = {flv: a,f4v: a,mov: a,m4a: a,m4v: a,mp4: a,aac: a,f4a: a,mp3: "sound",smil: "rtmp",m3u8: "hls",hls: "hls"};
    //html5视频播放器

    function mobilePlayer()
    {
      var self = this;
      var videoElement;
      function init()
      {
        videoElement = document.createElement("video");
        if(typeof(options.width)=='number ')
        {
          options.width=options.width+'px';
        }
        if(typeof(options.height)=='number ')
        {
          options.height=options.height+'px';
        }
        videoElement.style.width = options.width;
        videoElement.style.height = options.height;
        videoElement.style['vertical-align'] = 'top';
        videoElement.controls="controls";
        videoElement.autoplay=options.auto;
        videoElement.volume = options.volume;
        videoElement.loop = options.loop;
        if(options.image)
        {
          videoElement.poster = options.image;
        }
        videoElement.load();
        addEvent('play',options.onPlay);
        addEvent('ended',options.onComplete);
        addsources(videoElement,options.file);
        container.html('');
        container.css({width:options.width,height:options.height});
        container.append($$(videoElement));
      }
      function addEvent(event,callback)
      {
        videoElement.addEventListener(event,callback);
      }
      function addsources(videoElement,files)
      {
        if(typeof(files)=="string")
        {
          addsource(videoElement,files);
        }
        else if(typeof(files)=="object")
        {
          for(var i=0;i<files.length;i++)
          {
            addsource(videoElement,files[i]);
          }
        }
      }
      function addsource(videoElement,fileurl)
      {
        var sourceElement = document.createElement("source");
        sourceElement.src=fileurl;
        sourceElement.type=formats[getsuffix(options.file)];
        videoElement.appendChild(sourceElement);
      }
      this.play = function(){
        videoElement.play();
      };
      this.pause = function(){
        videoElement.pause();
      };
      this.stop = function(){
        videoElement.pause();
        videoElement.currentTime = 0;
      };
      this.setVolume = function(value)
      {
        if(value>1)
        {
          value = 1;
        }
        videoElement.volume = value;
      };
      this.setVideoUrl = function(fileurl,imageurl){
        var childNodes = videoElement.childNodes;
        for(var i=0;i<childNodes.length;i++)
        {
          videoElement.removeChild(childNodes[i]);
        }
        addsources(videoElement,fileurl);
        if(typeof(imageurl)=='undefined')
        {
          imageurl = "";
        }
        videoElement.poster = imageurl;
        videoElement.load();
      };
      init();
    }

    //flash播放器
    function flashPlayer()
    {
      var self = this;
      function init()
      {
        if(typeof(window.playerindex)=='undefined')
        {
          window.playerindex = 0;
        }
        else
        {
          window.playerindex++;
        }
        if(options.width.indexOf('px')>-1)
        {
          options.width=parseInt(options.width);
        }
        if(options.height.indexOf('px')>-1)
        {
          options.height=parseInt(options.height);
        }
        if(options.height == 'auto')
        {
          setHeight();
        }
        if(options.file.indexOf('http://')<0)
        {
          options.file = window.location.href+options.file
        }
        self.videoid = 'video'+playerindex;
        if(!ismicro)
        {
          var html = "<div class='video_wrap_inner'>"+'<embed id="'+self.videoid+'" flashvars="isDebugShow=false&setAutoPlay='+options.auto+'&isGetUserBand=true&getUserVideoKps=500&videoUrl='+options.file+'&getUserComplete=videoComplete'+window.playerindex+'" src="'+options.swf+'" quality="high" width="'+options.width+'" height="'+options.height+'" name="flashResize" align="middle" allowScriptAccess="sameDomain" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer_cn"  bgcolor="#000000" />'+'</div>';
        }
        else
        {
          var html = "<div class='video_wrap_inner'>"+'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+options.width+'" height="'+options.height+'" align="middle" id="'+self.videoid+'">'
            +'<param name="allowScriptAccess" value="sameDomain" />'
            +'<param name="allowFullScreen" value="true" />'
            +'<param name="movie" value="'+options.swf+'"/>'
            +'<param name="bgcolor" value="#000000" />'
            +'<param name="quality" value="high" />'
            +'<param name="FlashVars" value="isDebugShow=false&setAutoPlay='+options.auto+'&isGetUserBand=true&getUserVideoKps=500&videoUrl='+options.file+'&getUserComplete=videoComplete'+window.playerindex+'"/>'
          +'</object>'+'</div>';
        }
        window['videoComplete'+window.playerindex] = function(){
          if(options.loop)
          {
            player.play();
          }
          else
          {
            options.onComplete(videoindex);
          }
        }
        container.css({width:options.width,height:options.height});
        container.append(html);
        self.videoElement = getElement();
      }
      function setHeight(resizeRun)
      {
        var width,height;
        if(options.height == 'auto'||typeof(resizeRun)!='undefined')
        {
          if(options.width.indexOf('%')>-1)
          {
          	container.css({width:options.width});
            width = container.width();
            if(typeof(resizeRun)=='undefined')
            {
              $$(window).resize(function(){
                setHeight(true);
              });
            }
          }
          else
          {
            width = options.width;
          }
          height = width*options.ratio;
          container.height(height);
          options.height = height;
        }
      }
      function getElement(){
        var e=document.getElementById(self.videoid);
        if(e)
        {
          return e;
        }
        else
        {
          return false;
        }
      }
      this.play = function(){
        getElement().resumeVideo();
      };
      this.pause = function(){
        getElement().pauseVideo();
      };
      this.stop = function(){
        getElement().pauseVideo();
      };
      this.setVolume = function(){
        
      };
      this.setVideoUrl = function(url){
        getElement().setVideoUrl(url);
      };
      init();
    }
    function getsuffix(name)
    {
      var strs = name.split(".");
      return strs[strs.length-1];
    }
    setup();
  }

  if($$){
    (function($$) {
      $$.fn.gplayer = function(params) {
        var result = [];
        this.each(function(index){
          result.push(new gPlayer($$(this),index, params));
          // $(this).data('gplayer', new GPlayer($(this), params));
        });
        if(result.length<=1)
        {
          return result[0];
        }
        return result;
      }
    })($$)
    function GPLAYERSET(allset)
    {
      if(typeof(allset)!='undefined'&&allset)
      {
        $$(".GPLAYER-CONTAINER").each(function(){
          $$(this).html('');
          $$(this).removeClass('GPLAYER-SETTED');
        });
      }
      if($$(".GPLAYER-CONTAINER").not($$(".GPLAYER-SETTED")).length>0)
      {
        $$(".GPLAYER-CONTAINER").not($$(".GPLAYER-SETTED")).each(function(){
          var pcwidth = $$(this).data('pcwidth');
          if(!pcwidth)
          {
            pcwidth = '100%';
          }
          var mwidth = $$(this).data('mwidth');
          if(!mwidth)
          {
            mwidth = '100%';
          }
          var pcheight = $$(this).data('pcheight');
          if(!pcheight)
          {
            pcheight = 'auto';
          }
          var mheight = $$(this).data('mheight');
          if(!mheight)
          {
            mheight = 'auto';
          }
          var options = {
            mobile:{
              file:$$(this).data('file'),
              width:mwidth,
              height:mheight,
              auto:$$(this).data('auto'),
              image:$$(this).data('image'),
              volume:1,
              loop:$$(this).data('loop'),
              ratio:0.5625
            },
            pc:{
              file:$$(this).data('file'),
              width:pcwidth,
              height:pcheight,
              auto:$$(this).data('auto'),
              image:$$(this).data('image'),
              volume:1,
              loop:$$(this).data('loop'),
              ratio:0.5625,//高宽比例
              swf:curentUrl+'gplayer.swf'
            }
          }
          $$(this).gplayer(options);
          $$(this).addClass('GPLAYER-SETTED');
        });
      }
    }
    $$(function(){
      GPLAYERSET();
    });
  }

  function getJSPath(jsname)
  {
    var js=document.scripts;
    var jsPath;
    for(var i=js.length;i>0;i--){
     if(js[i-1].src.indexOf(jsname)>-1){
       jsPath=js[i-1].src.substring(0,js[i-1].src.lastIndexOf("/")+1);
     }
    }
    return jsPath;
  }

  function thisMovie(name)
  {
    var e=document.getElementById(name);
    if(e)
    {
      return e;
    }
    else
    {
      return false;
    }
  }
  return GPLAYERSET;
});
