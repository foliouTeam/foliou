define(['jquery','config/config','./jquery.qrcode2'],function ($,config) {
	var jsService = config.serviceDomain+'/secure';

	function secure(){
		var _self = this;
		var regcode = 'regcode_' + (new Date()).getTime();
		var regcode_h = 'regcode_h' + (new Date()).getTime();
		
		//判断环境是否支持
		this.support = function() {
		    return !!document.createElement('canvas').getContext;
		};

		this.getTicket = function(callback){
			var qrcode = null;
			var data = {};

			if($("#"+regcode).length==0)
			$('<div style="display:none;"></div>').attr({id: regcode}).appendTo('body');
			
			if($("#"+regcode_h).length==0)
			$('<div style="display:none;"></div>').attr({id: regcode_h}).appendTo('body');
			$.ajax({
				type: 'POST',
				url: jsService+'/randcode',
				data: data,
				cache: false,
				dataType: 'json',
				success: function(result) {
					if (result.status != 1) {
						callback(result);
						return;
					}
					$("#"+regcode).qrcode({
						width: 100,
						height: 100,
						correctLevel: 1,
						text: result.data
					});
					$("#"+regcode_h).qrcode({
						width: 100,
						height: 100,
						correctLevel: 2,
						text: result.data
					});
					setTimeout((function(){
						$.ajax({
							type: 'POST',
							url: jsService+'/reccode',
							data: {sid:result.sid,content:$("#"+regcode).find("canvas")[0].toDataURL().replace(/^data:image\/\w+;base64,/, ""),content_h:$("#"+regcode_h).find("canvas")[0].toDataURL().replace(/^data:image\/\w+;base64,/, "")},
							cache: false,
							dataType: 'json',
							success: function(result) {
								callback(result);
								$("#"+regcode).remove();
								$("#"+regcode_h).remove();
							},
							error:function (result) {
								callback({'status':0, 'msg':'request reccode api fail!'})
							}
						});		
					}),100)
				},
				error:function (result) {
					callback({'status':0, 'msg':'request randcode api fail!'})
				}
			});
		}
	}
	
    return secure;
});