define(['jquery','./jweixin-1.0.0','config/config'],function ($$,wx,config) {
	var jsSignService = config.serviceDomain+'/weixin/sign?jsoncallback=?';
	function weixin(appid,callback){
		var _self = this;
		this.appid = appid;
		this.callback = callback;
		
		$$.each(wx,function(k,v){
			weixin.prototype[k] = v;
		})
		
		if(this.callback){
			this.ready(this.callback);
		}
		
		$$.getJSON(jsSignService,{'appid':this.appid,'url':location.href.split('#')[0]},function(response){
			_self.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: response.data.appid, // 必填，公众号的唯一标识
			    timestamp: response.data.timestamp, // 必填，生成签名的时间戳
			    nonceStr: response.data.noncestr, // 必填，生成签名的随机串
			    signature: response.data.signature,// 必填，签名，见附录1
			    jsApiList: [
			    	'checkJsApi',
			        'onMenuShareTimeline',
			        'onMenuShareAppMessage',
			        'onMenuShareQQ',
			        'onMenuShareWeibo',
			        'hideMenuItems',
			        'showMenuItems',
			        'hideAllNonBaseMenuItem',
			        'showAllNonBaseMenuItem',
			        'translateVoice',
			        'startRecord',
			        'stopRecord',
			        'onRecordEnd',
			        'playVoice',
			        'pauseVoice',
			        'stopVoice',
			        'uploadVoice',
			        'downloadVoice',
			        'chooseImage',
			        'previewImage',
			        'uploadImage',
			        'downloadImage',
			        'getNetworkType',
			        'openLocation',
			        'getLocation',
			        'hideOptionMenu',
			        'showOptionMenu',
			        'closeWindow',
			        'scanQRCode',
			        'chooseWXPay',
			        'openProductSpecificView',
			        'addCard',
			        'chooseCard',
			        'openCard'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		});
	}
	
    return weixin;
});