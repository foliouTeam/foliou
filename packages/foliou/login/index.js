(function () {
    var definFun = function($){
        var Login = function (options) {
            var defaultOptions = {
                auto:true,
                type:'info',
                loginType:['wechat','qq','phone'],
                apiUrl:'',
                onSuccess:function(){
        
                },
                onFail:function(){
        
                }
            }
            options = $.extend(defaultOptions,options);
            var ua = window.navigator.userAgent.toLowerCase();
            //通过正则表达式匹配ua中是否含有MicroMessenger字符串
            var isWechat = ua.match(/MicroMessenger/i) == 'micromessenger';
            var isQQ = ua.match(/QQ/i) == "qq";
            this.init = function () {
                if(this._loginType('phone')){
                    
                }
            }
            this._loginType = function(type){
                for(var i in options.loginType){
                    if(options.loginType[i] == type){
                        return true;
                    }
                }
                return false;
            }
            this.login = function (cb) {
        
                if(!cb){
                    cb = function(){
        
                    }
                }
                
                if (isWechat&&this._loginType('wechat')) {
                    // console.log('微信登录');
                    var wxurl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2d8832785f125d5a&redirect_uri=' + encodeURI('http://fapi.focusbe.com/weixin/login.php?tarturl='+window.location.href) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
                    //var wxiframe = document.getElementById('wxiframe');
                    // alert(1);
                    // wxiframe.src = wxurl;
                    window.location.href = wxurl;
                } else if (isQQ&&this._loginType('qq')) {
                    
                } else if (this._loginType('phone')){
                    
                }
                else{
                    console.warn('请至少选择一种登录方式，wechat,qq,phone');
                    cb(false);
                }
            }
            this.showPhone = function(){
        
            }
        }
        return Login;
    }
    if (typeof exports === "object") {
        // CommonJS
        module.exports = definFun(require('jquery'));
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define(['jquery'],definFun);
    } else {
        // Global Variables
        window.Cookie = definFun(jQuery);
    }
})()


