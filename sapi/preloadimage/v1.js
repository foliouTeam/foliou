/**
    @author:focusbe
    @email:1134420693@qq.com
    @blog:http://blog.focusbe.com
    @github:https://github.com/focusbe
**/
define(['jquery'], function($) {
    var PreloadImage = function(imagepath) {
        var self = this;
        this.imageArr = {};
        this.loadImage = function(data, callback) {
            var imgLoaded = 0;
            var percent = 0;
            var path;
			if(typeof(data)=='function'){
				callback = data;
				data = null;
			}
			if(!data){
				data = 'images';
			}
			if(typeof(imagepath)=='undefined')
			{
				imagepath = data;
			}
			function runloadImage(){
				if(isString(data)){
					data = PRELOADIMAGE_RESOURCRE;
					if(imagepath!=path)
					{

						var pathstr = path.split("/");
						if(pathstr.length>1){
							for(var i=1;i<pathstr.length;i++){
								data = data[pathstr[i]];
							}
						}
					}
				}
				var imgLength = getLength(data);
				foreachImages(data,function(curimg){
					var imgobj = new Image();
	                imgobj.onload = function() {
	                    imgLoaded++;
	                    percent = parseInt(imgLoaded / imgLength * 100);
	                    callback(percent);
	                }
	                imgobj.src = curimg.src;
	                self.imageArr[curimg.id] = imgobj;
				});
			}
			if (isString(data)) {
                path = data;
				loadJs('js/images.js',runloadImage);
			    if (window.location.host.indexOf('dev.ztgame.com')) {
                    $.ajax({
                        url: './preloadImage_ignore.php?file='+imagepath,
                        error: function() {
                            console.log('js/images.js文件更新失败');
                        }
                    });
                }
            }
			else{
				runloadImage();
			}
        };
        this.getImage = function(id) {
            return self.imageArr[id];
        }
		function getLength(array){
			length = 0;
			foreachImages(array,function(){
				length++;
			});
			return length;
		}
		function foreachImages(array,callback){
			for(i in array)
			{
				if(typeof(array[i]['src'])!='undefined'&&typeof(array[i]['id'])!='undefined'){
					callback(array[i]);
				}
				else {
					foreachImages(array[i],callback);
				}
			}
		}
		function isString(str) {
            return (typeof str == 'string') && str.constructor == String;
        }
        function loadJs(loadUrl, callMyFun) {
            var loadScript = document.createElement('script');
            loadScript.setAttribute("type", "text/javascript");
            loadScript.setAttribute('src', loadUrl);
            document.getElementsByTagName("head")[0].appendChild(loadScript);
            if (navigator.userAgent.indexOf("IE") >= 0) {
                //IE下的事件
                loadScript.onreadystatechange = function() {
                    if (loadScript && (loadScript.readyState == "loaded" || loadScript.readyState == "complete")) {
                        //表示加载成功
                        loadScript.onreadystatechange = null;
                        callMyFun() //执行回调
                    }
                }
            } else {
                loadScript.onload = function() {
                    loadScript.onload = null;
                    callMyFun();
                }
            }
        }
    }
    return PreloadImage;
});
