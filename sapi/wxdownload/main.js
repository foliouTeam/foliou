define(['jquery','device/main'], function($,DEVICE) {
    function getJSPath(jsname) {
        var js = document.scripts;
        var jsPath;
        for (var i = js.length; i > 0; i--) {
            if (js[i - 1].src.indexOf(jsname) > -1) {
                jsPath = js[i - 1].src.substring(0, js[i - 1].src.lastIndexOf("/") + 1);
            }
        }
        return jsPath;
    }
    var weixinDownload = function(androidbtn, iosbtn, allshowonpc,showtype) {
        if(typeof(showtype)=='undefined')
        {
            showtype = 'block';
        }
        var curjsurl = getJSPath('wxdownload/main.js');
        var wxdownloadtip = $('<div style="display:none;width:100%;height:100%;position:fixed;top:0;left:0;z-index:999999;background:rgba(0,0,0,0.6);" class="wxdownload_tip wxdownload_android_tip"><img style="vertical-align:top;width:100%;" src="'+curjsurl+'tip_android.png"></div><div  style="display:none;width:100%;height:100%;position:fixed;top:0;left:0;z-index:999999;background:rgba(0,0,0,0.6);" class="wxdownload_tip wxdownload_iphone_tip"><img  style="vertical-align:top;width:100%;"  src="'+curjsurl+'tip_iphone.png"></div>');
        $("body").append(wxdownloadtip);
        var iphonetip = $(".wxdownload_iphone_tip");
        var androidtip = $(".wxdownload_android_tip");
        if(DEVICE.isiOS)
        {
            iosbtn.css({display:showtype});
            if(androidbtn)
            {
                androidbtn.hide();
            }
            
        }
        else if(DEVICE.isAndroid)
        {
            if(iosbtn)
            {
                iosbtn.hide();
            }
            androidbtn.css({display:showtype});
        }
        else{
            if(iosbtn)
            {
                iosbtn.css({display:showtype});
            }
            if(androidbtn)
            {
                androidbtn.css({display:showtype});
            }
            
        }
        if (DEVICE.isWeixin||(DEVICE.isQQ&&DEVICE.isiOS)) {
            if (DEVICE.isiOS) {
                if(iosbtn.attr('href').indexOf('javascript:')>-1)
                    return;
                iosbtn.attr('href','javascript:void(0);');
                iosbtn.removeAttr("target");
                iosbtn.click(function() {
                    iphonetip.css({display:showtype});
                });
                iphonetip.click(function() {
                    iphonetip.hide();
                });
            } else {
                if(androidbtn.attr('href').indexOf('javascript:')>-1)
                    return;
                androidbtn.attr('href','javascript:void(0);');
                androidbtn.removeAttr("target");
                androidbtn.click(function() {
                    androidtip.css({display:showtype});
                });
                androidtip.click(function() {
                    androidtip.hide();
                });
            }
        } else {
            if (!!allshowonpc) {
                if (DEVICE.isPc) {
                    if(androidbtn)
                    {
                        androidbtn.css({display:showtype});
                    }
                    if(iosbtn)
                    {
                        iosbtn.css({display:showtype});
                    }
                }
            }
        }
    };
    return weixinDownload;
});
