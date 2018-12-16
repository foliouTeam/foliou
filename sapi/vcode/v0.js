define(['jquery','config/config'],function ($,config) {
	var jsService = config.serviceDomain+'/secure';
    jsService = "https://sapi.ztgame.com/secure";
	var urlcss = "https://sapi.ztgame.com/site/js/vcode/";

	var proxy = null;
	var frm = 'secure_proxy_' + (new Date()).getTime();
	(function() {
        document.domain = "ztgame.com";
		var iframe = document.createElement("iframe");
		iframe.id = frm;
		iframe.src = jsService + '/proxy?t='+Math.random();
		iframe.style.width = '0px';
		iframe.style.height = '0px';
		iframe.style.display = 'none';

		if (iframe.attachEvent) {
			iframe.attachEvent("onload", function() {
				proxy = document.getElementById(frm).contentWindow;
			});
		} else {
			iframe.onload = function() {
				proxy = document.getElementById(frm).contentWindow;
			};
		}
		document.body.appendChild(iframe);
	})();

	function VCode(obj,call,onload,onerror){
		var codeid = null;
		var VCode = {
			src:"",
			ch:"",
			have:0,
			haves:3,
			url:jsService+"/randvcode",
			post_url:jsService+"/checkvcode",
			interval:null,
			callback:"",
			parent:"",
			sid:"",
			mode:"",
			imgs:"",
			img_left:0,
			img_top:0,
			img_lst_left:0,
			img_lst_top:0,
			img_w:0,
			img_h:0,
			img_start_w:0,
			img_start_h:0,
			img_sacle:1,
			img_sacle2:1,
			img_sacle3:1,
			c_width:0,
			width:0,
			ids:"",
			sources:[],
			setInterva:"",
			xy:"",
			onload:"",
			onerror:"",
			move:null,
			backcall:"",
			isMobile : navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|mobile)/),
			touch : ("createTouch" in document),
			StartEvent : this.touch ? "touchstart" : "mousedown",
			MoveEvent : this.touch ? "touchmove" : "mousemove",
			EndEvent : this.touch ? "touchend" : "mouseup",
			init:function(){
				this.lk = this.creatNode("link");
				this.setAttributeNode(this.lk,"href|rel|type",urlcss+"css/style14.css?v1|stylesheet|text/css");
				if($("#fristcss").length<1)
				{
					this.appendChildNode("head",this.lk);
					$(this.lk).attr("id","fristcss");	
				}
				
				this.h = document.documentElement.clientHeight || document.body.clientHeight;
				this.divid1 = 'ztrist1' + (new Date()).getTime();
				this.divid2 = codeid ? codeid : 'ztrist2' + (new Date()).getTime();
				this.divid3 = 'ztrist3' + (new Date()).getTime();
				this.loading = 'loading' + (new Date()).getTime();
				
				this.div1 = document.createElement("div");
				this.div2 = document.createElement("div");
				this.div3 = document.createElement("div");
				this.div4 = document.createElement("div");
				
				this.refresh = document.createElement("div");
				
				$(this.div1).attr({"id":this.divid1,"class":"ztrst_tips"});
				$(this.div2).attr({"id":this.divid2,"class":"ztrst_panel"});
				$(this.div3).attr({"id":this.divid3});
				$(this.div4).attr({"id":"vcode_loadding"});
				
				$(this.refresh).attr({"class":"ztrst_refresh"}).hide();
				
				$(this.div2).append($(this.refresh));
				$(this.div2).append($(this.div3));
				
				
				this.thread = 3;// 容差值
				
				
				
			},creatNode:function(elm){
				return document.createElement(elm);
			},
			setAttributeNode:function(ttribute,name,co){
				if(name.indexOf("|") != -1){
				var name1=name.split("|");var co1=co.split("|");for(var i=0;i<name.split("|").length;i++){ttribute.setAttribute(name1[i],co1[i]);}}else{ttribute.setAttribute(name,co);}
			},
			appendChildNode:function(tagname,tag){
				document.getElementsByTagName(tagname)[0].appendChild(tag);
			},
			appNode:function(tagname,tag){
				tagname.appendChild(tag);
			},
			insertChildNode:function(tagname1,tagname2,tag1){
				document.getElementsByTagName(tagname1)[0].insertBefore(tag1,tagname2);
			},
			styles:function(ele,css){
				var cs = css || {};
				
				
			},
			creatImg:function(src) {
				if (typeof this.sources[src] != "undefined") {
					return this.sources[src];
				}
				this.sources[src] = new Image();
				this.sources[src].src = src;
				return this.sources[src];
			},
			hasClassName : function(d,a) {
				return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(d.className);
			},
			addClassName : function(d,a) {
				if (!this.hasClassName(d,a)) {
					d.className = [d.className, a].join(" ");
				}
			},
			removeClassName : function(obj, cls) {
				if(this.hasClassName(obj, cls)) {
					var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
					obj.className = obj.className.replace(reg, ' ');
				}
			},
			whichTransitionEvent:function (){
			   var t;
			   var el = document.createElement('fakeelement');
			   var transitions = {
				 'transition':'transitionend',
				 'OTransition':'oTransitionEnd',
				 'MozTransition':'transitionend',
				 'WebkitTransition':'webkitTransitionEnd'
			   }
			   for(t in transitions){
				   if( el.style[t] !== undefined ){
					   return transitions[t];
				   }
			   }
			},
			transitionEvent : this.whichTransitionEvent,
			set_hav : function(){
				this.interval = setInterval((function(){
					if(VCode.haves == 0){
						$(VCode.div1).text('点击通过验证').removeClass("on"); 	
						clearInterval(VCode.interval);
						VCode.haves = 3;
						return false;
					}
					$(VCode.div1).text("刷新倒计时"+VCode.haves+"秒"); 
					VCode.haves -= 1;
				}),1000);
			},
			over : function(){
				VCode.have += 1;
				$(VCode.div3).append('<span class="ztrson" style="left:'+(VCode.img_lst_left - 13)+'px;top:'+(VCode.img_lst_top - 16)+'px;">'+VCode.have+'</span>');
				//VCode.xy.push([VCode.img_lst_left,VCode.img_lst_top]);
				if(VCode.have == 1)
				var fk = VCode.img_lst_left*VCode.img_sacle2 +","+ VCode.img_lst_top*VCode.img_sacle2;
				else
				var fk = "-"+ VCode.img_lst_left*VCode.img_sacle2 +","+ VCode.img_lst_top*VCode.img_sacle2;
				
				VCode.xy += fk;
				if(VCode.have == 3)
				{
					//console.log(VCode.xy+";"+ VCode.img_w+";"+ VCode.img_h);
					proxy.$.ajax({
					   type: "POST",
					   dataType:'json',
					   data:{"sid":VCode.sid,"content":VCode.xy+";"+ VCode.img_start_w+";"+ VCode.img_start_h,"img":VCode.imgs},
					   url:VCode.post_url+"?t="+Math.random(),
					   success: function(msg){
						 VCode.have = 0;
						 VCode.xy = "";
						 $(VCode.div3).html("");

						 if(msg.status == 1){
							$(VCode.div1).text('验证成功通过').addClass("on0");
							$(VCode.div2).hide();
							VCode.callback({"status":msg.status,"ticket":msg.cid});
							$(VCode.div1).removeClass("on2");
							setTimeout((function(){
								$(VCode.div1).removeClass("on0").text("刷新倒计时"+VCode.haves+"秒").addClass("on");
								VCode.set_hav();
							}),1000);
							
						 }else{
							 $(VCode.div1).text('验证错误').addClass("on1");
							 VCode.img_load();
						 }

					   }
					})	
				}
				
				
			},
			img_load: function(){
				$(VCode.div2).find(".vcode_loadbox").show();
				$(VCode.div3).html("");
				proxy.$.ajax({
				   type: "get",
				   dataType:'json',
				   url:VCode.url+"?t="+Math.random(),
				   success: function(msg){
					 VCode.imgs = msg.data.img;
					 VCode.sid = msg.data.sid;
					 var img = new Image();
					 img.onload = function(){
						img.width = VCode.img_w;
						img.height = VCode.img_h;
						
						VCode.have = 0;
						VCode.xy = "";
						$(VCode.div3).html(img);
						
						setTimeout((function(){
							$(VCode.div2).find(".vcode_loadbox").hide();
							$(VCode.div1).text('依次点击文字：'+msg.data.text[0]+"，"+msg.data.text[1]+"，"+msg.data.text[2]).removeClass("on1");	
							
						}),1000);
						
					 }
					   if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<9){
							img.src = config.serviceDomain + "/secure/previewvcode?sid="+VCode.sid;
						}else{
							img.src = msg.data.img;	
						}
					 //
					 
				   }
				})
			},
			leftop: function(img,ids,width){
				var m_top = ids.offset().top;
				var m_left = ids.offset().left;
				
				VCode.img_start_w = img.width;
				VCode.img_start_h = img.height;
				
				if(width)
				{
					VCode.img_sacle = img.height/img.width;
					VCode.img_sacle2 = img.width/width;
					
					var m_left2 = $(window).width()-(m_left+width);
					img.width = width;
					VCode.img_w = width;	
					VCode.img_h = width*VCode.img_sacle;
					img.height = VCode.img_h;
					
					$(VCode.div3).css({height:VCode.img_h+"px"});
					if(VCode.parent == 1){
						if(m_top > VCode.img_h)
						$(VCode.div2).css({position: "absolute",width:width,height:VCode.img_h,left:m_left+"px",top:m_top - img.height - 5+"px",overflow:"hidden",zIndex:99999});
						else
						$(VCode.div2).css({position: "absolute",width:width,height:VCode.img_h,left:m_left+"px",top:m_top + ids.height() + 5 +"px",overflow:"hidden",zIndex:99999});
					}else{
						if(m_top > VCode.img_h)
						$(VCode.div2).css({position: "absolute",width:width,height:VCode.img_h,left:0,top:- img.height - 5 +"px",overflow:"hidden",zIndex:9999999});
						else
						$(VCode.div2).css({position: "absolute",width:width,height:VCode.img_h,left:0,top:ids.height() + 5 +"px",overflow:"hidden",zIndex:9999999});
						
					}
					
				}else{
					var m_left2 = $(window).width()-(m_left+img.width);
					VCode.img_w = img.width;		
					VCode.img_h = img.height;
					
					$(VCode.div3).css({height:VCode.img_h+"px"});
					if(VCode.parent == 1){
						if(m_top > VCode.img_h)
						$(VCode.div2).css({position:"absolute",width:VCode.img_w,height:VCode.img_h,left:m_left+"px",top:m_top - img.height - 5+"px",overflow:"hidden",zIndex:99999});
						else
						$(VCode.div2).css({position:"absolute",width:VCode.img_w,height:VCode.img_h,left:m_left+"px",top:m_top + ids.height() + 5 +"px",overflow:"hidden",zIndex:99999});
		
					}else{
						if(m_top > VCode.img_h)
						$(VCode.div2).css({position:"absolute",width:VCode.img_w,height:VCode.img_h,left:0,top:- img.height - 5+"px",overflow:"hidden",zIndex:9999999});
						else
						$(VCode.div2).css({position:"absolute",width:VCode.img_w,height:VCode.img_h,left:0,top:ids.height() + 5 +"px",overflow:"hidden",zIndex:9999999});	
					}
				}
				
				if(VCode.parent == 1 && m_left2 < 0){
					$(VCode.div2).css({left:m_left + m_left2 +"px"});
				}
				
			},
			onRefresh:function(){
				var self = $(VCode.div1);
				var ids = VCode.ids;
				var width = VCode.width;
				
				var img = new Image();
				$(VCode.div2).show();
				if($("#"+this.divid2).length == 0){
					
					if(VCode.parent == 1){
						$("body").append(VCode.div2);	
					}else{
						ids.append(VCode.div2);
					}
					
					//ids.append('<div class="loadings" id="'+VCode.loading+'" style="display:none;"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div>');
					
					//$("#"+VCode.loading).css({width:ids.width()+"px",height:ids.height()+"px",left:ids.offset().left+1+"px",top:ids.offset().top+1+"px"}).show();
					proxy.$.ajax({
					   type: "get",
					   dataType:'json',
					   cache: false,
					   url:VCode.url+"?t="+Math.random(),
					   success: function(msg){
						    if(msg.status != 1){
							   VCode.onerror(msg.msg,VCode);
							   return false;
						    }
						    VCode.onload(msg.msg,VCode);
							
							VCode.imgs = msg.data.img;
							VCode.sid = msg.data.sid;
							img.onload = function(){
								img.onload = null;
								VCode.leftop(img,ids,width);
								$(VCode.div3).html(img);
								$(VCode.div2).append('<div class="vcode_loadbox"> <div class="loadbox_inner"> <div class="vcode_loadicon"></div> <span class="vcode_loadtext">加载中...</span> </div> </div>');
								setTimeout((function(){
									$(VCode.div2).find(".vcode_loadbox").hide();
									//$("#"+VCode.loading).hide();
									VCode.ids.append(VCode.div1);
									$(VCode.div1).text('依次点击文字：'+msg.data.text[0]+"，"+msg.data.text[1]+"，"+msg.data.text[2]).removeClass("on1");
									$(VCode.refresh).show();	
								}),600);
								
							}
							if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<9){
								img.src = config.serviceDomain + "/secure/previewvcode?sid="+VCode.sid;
							}else{
								img.src = msg.data.img;	
							}
					   }
					});	
				}else{
					VCode.img_load();
					//VCode.leftop(img,ids,width);	
				}
			},
			instance_hide : function(){
				$(this.div2).hide();
			},
			codes : function(s,call,onload,onerror){
				codeid = s.codeid ? s.codeid : "";
				VCode.init();
				var db = $("#"+this.vid1);
				VCode.ids = typeof(s.element) == "string" ? $(s.element) : s.element;
				VCode.width = s.width ? parseInt(s.width) : VCode.ids.width();
				VCode.parent = s.parent;
				VCode.mode = s.mode;
				this.callback = s.callback;
				VCode.onload = onload;
				VCode.onerror = onerror;
				
				//触发式、嵌入式、弹出式。
				alert(!VCode.mode)
				switch(VCode.mode){
					case "float":
						$(VCode.div1).text('请点击通过验证').height(VCode.ids.height());
					break;	
					case "embed":
						$(VCode.div1).text('请点击通过验证').height(VCode.ids.height());
					break;	
					case "popup":
						$(VCode.div1).text('请点击通过验证').height(VCode.ids.height());
					break;	
				}			
				
				
				$(VCode.refresh).bind(VCode.EndEvent,function(){
					VCode.img_load();
				})
				
				if(VCode.isMobile && VCode.have < 3) {
					VCode.div3.addEventListener("touchstart", function (e) {
						e.preventDefault();
						var touchs = e.targetTouches[0];
						
						VCode.img_left = $(VCode.div2).offset().left;
						VCode.img_top = $(VCode.div2).offset().top;
						
						VCode.img_lst_left = touchs.pageX - VCode.img_left;
						VCode.img_lst_top = touchs.pageY - VCode.img_top;
						
						//VCode.img_lst_left = VCode.img_left;
						//VCode.img_lst_top = VCode.img_top;
					});
					 
					VCode.div3.addEventListener("touchend", function (e) {
						VCode.over();
					});
				} else {
					$(VCode.div3).bind("mouseup", function (e) {	
						var ee = e || event;
						VCode.img_left = $(VCode.div2).offset().left;
						VCode.img_top = $(VCode.div2).offset().top;
						
						VCode.img_lst_left = ee.clientX - VCode.img_left;
						VCode.img_lst_top = ee.clientY - VCode.img_top;
						
						//VCode.img_lst_left = VCode.img_left;
						//VCode.img_lst_top = VCode.img_top;
						
						VCode.over();
					})
				}
				
				$(VCode.div1).bind(VCode.EndEvent,function(){
					VCode.onRefresh();
				})

				$("#"+frm).load(function(){
					setTimeout((function(){
						call(VCode);
					}),0);
				})
				
			}
		};	
		VCode.codes(obj,call,onload,onerror);
		return VCode;
	}
    return VCode;
});
