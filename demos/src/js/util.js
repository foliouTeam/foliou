var Util = {
    ajax:function(url,data,callback){
        var type='json';
        if(this.isDev()){
            url = '//zt2.ztgame.com/act/zb/'+url;
            type = 'jsonp'
        }
        $.ajax({
            url:url,
            dataType:type,
            jsonp:'cb',
            type:'GEt',
            data:data,
            success:function(result){
                if(typeof(callback)=='function'){
                    if(!!result&&!!result.status&&result.status>0){
                        callback(true,result);
                    }
                    else{
                        callback(false,result.msg||'未知错误');
                    }
                }
            },
            error:function(){
                callback(false,'请求失败');
            }
        });
    },
    isDev:function(){
        var host = window.location.hostname;
        if(host.indexOf('.web.')>-1||host.indexOf('localhost')>-1||host.indexOf('192.168.')>-1){
            return true;
        }
        return false;
    }
}
module.exports = Util;