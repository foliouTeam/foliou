(function () {
    var definFun = function(){
        function setCookie(name, value,hours,path,domain) {
            if(typeof(Days)=='undefined'){
                Days = 30;
            }
            var exp = new Date();
            exp.setTime(exp.getTime() + hours * 60 * 60 * 1000);
            var cookieStr = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            
            if(!!path){
                cookieStr+=';path='+path;
            }
            if(!!domain){
                cookieStr+=';domain='+domain;
            }
            document.cookie = cookieStr;
        }
        
        //读取cookies 
        function getCookie(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }
        
        //删除cookies 
        function delCookie(name,path,domain) {
            // var exp = new Date();
            // exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if(!path){
                path = null;
            }
            if(!domain){
                domain = null;
            }
            if (cval != null)
                setCookie(name,'',-1,path,domain)
        }
        return {
            setCookie:setCookie,
            getCookie:getCookie,
            delCookie:delCookie
        }
    }
    if (typeof exports === "object") {
        // CommonJS
        module.exports = definFun();
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define(definFun);
    } else {
        // Global Variables
        window.Cookie = definFun();
    }
})()

