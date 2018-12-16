require(['jquery','device/main','downloadway/main'],function($,DEVICE,Download){
    var pathname =  window.location.pathname;
    // var isindexlink = pathname.indexOf('index.html')>-1;
    // var isandroidlink = pathname.indexOf('android.html')>-1;
    // var isioslink = pathname.indexOf('ios.html')>-1;
    var linktype = (pathname.indexOf('android.html')>-1)?'android':((pathname.indexOf('ios.html')>-1)?'ios':'url');
    //DEVICE.isWeixin = true;
    function appendWeixinTip(){
        // if (!DEVICE.isWeixin) {
        //     return;
        // }
        var imgurl = DEVICE.isiOS ? "ios" : "android";
        imgurl =
            "//sapi.dev.ztgame.com/sapi/shorturl/images/weixin_" +
            imgurl +
            ".jpg";
        var tiphtml =
            '<img id="downloadway_tip" style="display:block;position:fixed;width:100%;top:0;left:0;z-index:9999999" src="' +
            imgurl +
            '"/>';
        $("body").append(tiphtml);
    }
    
    if(DEVICE.isWeixin){
        appendWeixinTip();
    }
    
    var dowload = new Download({
        callback:function(info){
            //console.log(info);
            // alert(1);
            // return;
            // console.log(DEVICE);
            // DEVICE.isWeixin = true;
            
            if(!!info&&info[linktype]){
                //console.log(DEVICE);
                if(!(DEVICE.isWeixin&&DEVICE.isAndroid)){
                    // alert(info[linktype]);
                    // return;
                    window.location.href = info[linktype];
                }
                else{
                    
                }
            }
            else{
                alert('敬请期待');
            }
        }
    });
});