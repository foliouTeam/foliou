define(['weixin/main'],function(weixin){
    function setWeixin(weixinConfig)
    {
        var ur = window.location.protocol + '//' + window.location.host + window.location.pathname;
        var ur2 = ur;
        var pathArr = window.location.pathname.split('/');
        if (pathArr[pathArr.length - 1].indexOf('.') > -1) {
            ur2 = ur2.replace(pathArr[pathArr.length - 1], '');
        }
        if(!!weixinConfig.imgUrl&&weixinConfig.imgUrl.indexOf('http://')<0&&weixinConfig.imgUrl.indexOf('https://')<0)
        {
            weixinConfig.imgUrl = ur2 + weixinConfig.imgUrl;
        }
        if(!weixinConfig.link)
        {
            weixinConfig.link = ur;
        }
        if(typeof(wx)!='undefined')
        {
            wx.onMenuShareTimeline(weixinConfig);
            //朋友
            wx.onMenuShareAppMessage(weixinConfig);
            //分享到QQ
            wx.onMenuShareQQ(weixinConfig);
            //分享到QQ空间
            wx.onMenuShareQZone(weixinConfig);
        }
        else
        {
            wx = new weixin(weixinConfig.appid, function() {
                setWeixin(weixinConfig);
            });
        }

    }
    return setWeixin;
});
