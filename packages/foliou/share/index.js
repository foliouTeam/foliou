/**
    @author:liupeng
    @email:1049047649@qq.com
    @blog:http://blog.focusbe.com
    @github:https://github.com/focusbe
**/
define(["weixin/main"], function(weixin) {
    var qqapi = "weixin/qqapi",
        qzapi = "weixin/qzone";
    function setQQ(data) {
        var info = {
            title: data.title,
            desc: data.desc,
            share_url: data.link,
            image_url: data.imgUrl
        };

        function doQQShare() {
            try {
                if (data.callback) {
                    window.mqq.ui.setOnShareHandler(function(type) {
                        if (type == 3 && (data.swapTitle || (data.WXconfig && data.WXconfig.swapTitleInWX))) {
                            info.title = data.desc;
                        } else {
                            info.title = data.title;
                        }
                        info.share_type = type;
                        info.back = true;
                        window.mqq.ui.shareMessage(info, function(result) {
                            if (result.retCode === 0) {
                                data.callback && data.callback.call(this, result);
                            }
                        });
                    });
                } else {
                    window.mqq.data.setShareInfo(info);
                }
            } catch (e) {}
        }
        if (window.mqq) {
            doQQShare();
        } else {
            requirejs([qqapi], function() {
                doQQShare();
            });
        }
    }

    function setQZ(data) {
        function doQZShare() {
            if (QZAppExternal && QZAppExternal.setShare) {
                var imageArr = [],
                    titleArr = [],
                    summaryArr = [],
                    shareURLArr = [];
                for (var i = 0; i < 5; i++) {
                    imageArr.push(data.imgUrl);
                    shareURLArr.push(data.link);
                    if (i === 4 && (data.swapTitle || (data.WXconfig && data.WXconfig.swapTitleInWX))) {
                        titleArr.push(data.desc);
                        summaryArr.push(data.title);
                    } else {
                        titleArr.push(data.title);
                        summaryArr.push(data.desc);
                    }
                }
                QZAppExternal.setShare(function(data) {}, {
                    type: "share",
                    image: imageArr,
                    title: titleArr,
                    summary: summaryArr,
                    shareURL: shareURLArr
                });
            }
        }
        if (window.QZAppExternal) {
            doQZShare();
        } else {
            requirejs([qzapi], function() {
                doQZShare();
            });
        }
    }

    function setWeixin(weixinConfig) {
        if (typeof wx != "undefined" && !!wx) {
            wx.onMenuShareTimeline(weixinConfig);
            //朋友
            wx.onMenuShareAppMessage(weixinConfig);
            //分享到QQ
            wx.onMenuShareQQ(weixinConfig);
            //分享到QQ空间
            wx.onMenuShareQZone(weixinConfig);
        } else {
            wx = new weixin(weixinConfig.appid, function() {
                setWeixin(weixinConfig);
            });
        }
    }

    function init(shareconfig) {
        if (!shareconfig) {
            shareconfig = {};
        }

        if (!shareconfig.appid || window.location.host.indexOf(".web.") > -1 || window.location.host.indexOf(".dev.") > -1) {
            shareconfig.appid = "wx0fcf7f47419c8171";
        }
        if (!shareconfig.title) {
            shareconfig.title = document.title;
        }
        if (!shareconfig.desc) {
            var meta = document.getElementsByTagName("meta");
            var share_desc = "";
            for (i in meta) {
                if (typeof meta[i].name != "undefined" && meta[i].name.toLowerCase() == "description") {
                    share_desc = meta[i].content;
                }
            }
            shareconfig.desc = share_desc;
        }
        if (!!shareconfig.imgurl && !shareconfig.imgUrl) {
            shareconfig.imgUrl = shareconfig.imgurl;
        }
        if (!shareconfig.imgUrl) {
            var imgs = document.getElementsByTagName("img");
            if (!!imgs && imgs.length > 0) {
                shareconfig.imgUrl = imgs[0].src;
            }
        }
        var ur = window.location.protocol + "//" + window.location.host + window.location.pathname;
        var ur2 = ur;
        var pathArr = window.location.pathname.split("/");
        if (pathArr[pathArr.length - 1].indexOf(".") > -1) {
            ur2 = ur2.replace(pathArr[pathArr.length - 1], "");
        }
        if(shareconfig.imgUrl.indexOf("//")==0){
            shareconfig.imgUrl = window.location.protocol+shareconfig.imgUrl;
        }
        if (!!shareconfig.imgUrl && shareconfig.imgUrl.indexOf("http://") < 0 && shareconfig.imgUrl.indexOf("https://") < 0 && shareconfig.imgUrl.indexOf("//") != 0) {
            shareconfig.imgUrl = ur2 + shareconfig.imgUrl;
        }
        if (!shareconfig.link) {
            shareconfig.link = ur;
        }

        var ua = navigator.userAgent;
        var isWX = ua.match(/MicroMessenger\/([\d\.]+)/),
            isQQ = ua.match(/QQ\/([\d\.]+)/),
            isQZ = ua.indexOf("Qzone/") !== -1;
        if (isWX) {
            setWeixin(shareconfig);
        }
        if (isQQ) {
            setQQ(shareconfig);
        } else if (isQZ) {
            setQZ(shareconfig);
        }
    }

    return init;
});
