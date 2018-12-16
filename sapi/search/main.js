define(['jquery','config/config'],function ($$,config) {
	var jsService = config.serviceDomain+'/search/';
	function search(project){
		var _self = this;
		this.project = project;
		//weixin.prototype[k] = v;
		
		this.getList = function(para,callback){
			$$.getJSON(jsService+"search?jsoncallback=?",{'project':project,'keyword':para.keyword,game_type:para.game_type,'type':para.type,'start':para.start,'limit':para.limit},function(response){
				callback(response);
			});
		}
		
		this.getExpanded = function(para,callback){
			$$.getJSON(jsService+"expanded?jsoncallback=?",{'project':project,'keyword':para.keyword},function(response){
				callback(response);
			});
		}

		this.getHotWords = function(limit,callback){
			$$.getJSON(jsService+'hotWords?jsoncallback=?',{'project':project,'limit':limit},function(response){
				callback(response);
			});
		}
	}
	
    return search;
});