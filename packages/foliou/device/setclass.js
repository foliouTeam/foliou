//判断环境
'use strict';
(function () {
    var Factory = function ($,DEVICE) {
        function isMobile(){
            return /iPhone|iPod|iPad|micromessenger|Android|ios|SymbianOS/i.test(navigator.userAgent);
        }
        function getDeviceString(){
            var str = '';
            if(!isMobile()){
                str = 'pc';
            }
            else{
                str = 'mobile';
                if(typeof(window.orientation)!='undefined'){
                    if (window.orientation == 180 || window.orientation == 0) {
                        str+='_portrait';
                    }
                    if (window.orientation == 90 || window.orientation == -90) {
                        str+='_landscape';
                    }
                }
                else{
                    str+='_portrait';
                }
            }
            return 'device_'+str;
        }
        
        function set(){
            $("body").addClass(getDeviceString());
            $(window).resize(function(){
                var bodyclass = document.body.className;
                bodyclass = bodyclass.split(' ');
                if(!!bodyclass){
                    for(var i in bodyclass){
                        if(!!bodyclass[i]&&bodyclass[i].indexOf('device_')>-1){
                            $("body").removeClass(bodyclass[i]);
                        }
                    }
                }
                $("body").addClass(getDeviceString());
            });
        }
        return set;
    }

    if (typeof exports === 'object') {
        // CommonJS
        module.exports = Factory(require('jquery'),require('./main'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery','./main'],Factory);
    } else {
        // Global Variables
        window.ztUtli = Factory($,DEVICE);
    }
})()