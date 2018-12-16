define(['jquery','config/config'],function ($,config) {
	var jsService = config.serviceDomain+'/secure';
	var urlcss = "//cdn.sapi.ztgame.com/site/js/vcode/";

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
			smwz:"",
			moren:"请点击通过验证", /*默认提示文字*/
			tupian:"", /*存储首张图片*/
			position:"relative",/*展现方式*/
			sources:[],
			setInterva:"",
			xy:"",
			onload:"",
			onerror:"",
			move:null,
			backcall:"",
			tps :0,
			isMobile : navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|mobile)/),
			touch:("createTouch" in document),
			StartEvent : ("createTouch" in document) ? "touchstart":"mousedown",
			MoveEvent : ("createTouch" in document) ? "touchmove":"mousemove",
			EndEvent : ("createTouch" in document) ? "touchend":"mouseup",
			init:function(){
				this.lk = this.creatNode("link");
				this.setAttributeNode(this.lk,"href|rel|type",urlcss+"css/style14.css?v1|stylesheet|text/css");
				if($("#fristcss").length<1)
				{
					this.appendChildNode("head",this.lk);
					$(this.lk).attr("id","fristcss");	
				}
				
				this.h = document.documentElement.clientHeight || document.body.clientHeight;
				this.divbgid = 'divbg' + (new Date()).getTime();
				this.divid1 = 'ztvcode1' + (new Date()).getTime();
				this.divid2 = codeid ? codeid : 'ztvcode2' + (new Date()).getTime();
				this.divid3 = 'ztvcode3' + (new Date()).getTime();
				this.loading = 'loading' + (new Date()).getTime();
				
				this.divbg = document.createElement("div");
				this.div1 = document.createElement("div");
				this.div2 = document.createElement("div");
				this.div3 = document.createElement("div");
				this.div4 = document.createElement("div");
				
				this.refresh = document.createElement("div");
				
				$(this.divbg).attr({"id":this.divbgid,"class":"ztvcode_light"});
				$(this.div1).attr({"id":this.divid1,"class":"ztvcode_tips"});
				$(this.div2).attr({"id":this.divid2,"class":"ztvcode_panel"});
				$(this.div3).attr({"id":this.divid3});
				$(this.div4).attr({"id":"vcode_loadding"});
				
				$(this.refresh).attr({"class":"ztvcode_refresh"}).hide();
				
				$(this.div2).append($(this.refresh));
				$(this.div2).append($(this.div3));
				$(this.divbg).append($(this.div2));
				
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
			start:function(){
				VCode.have = 0;
				$(VCode.div1).text(VCode.moren).removeClass("on0");
			},
			set_hav : function(){  // 通过验证码后延时3秒 倒计时
				this.interval = setInterval((function(){
					$(VCode.div1).text("刷新倒计时"+VCode.haves+"秒"); 
					
					if(VCode.haves == 0){
						VCode.haves = 3;
						VCode.have = 0;
						clearInterval(VCode.interval);
						$(VCode.div1).removeClass("on");
						if(VCode.mode=="float"){
							$(VCode.div1).text(VCode.moren);
						}else{
							VCode.onRefresh();
						}
						//
						
						switch(VCode.mode){
							case "float":
								
							break;	
							case "embed":
								$(VCode.div2).show();
							break;	
							case "popup":
								
							break;	
						}	
						return false;
					}
					VCode.haves -= 1;
					
				}),1000);
			},
			over : function(){  //选择验证码上的文字结束后执行
				VCode.have += 1;
				var top = $(window).scrollTop();
				var left = $(window).scrollLeft();
				$(VCode.div3).append('<span class="ztvcode" style="left:'+(VCode.img_lst_left + left - 13)+'px;top:'+(VCode.img_lst_top + top - 16)+'px;">'+VCode.have+'</span>');
				//VCode.xy.push([VCode.img_lst_left,VCode.img_lst_top]);
				if(VCode.have == 1)
				var fk = (VCode.img_lst_left + left)*VCode.img_sacle2 +","+ (VCode.img_lst_top + top)*VCode.img_sacle2;
				else
				var fk = "-"+ (VCode.img_lst_left + left)*VCode.img_sacle2 +","+ (VCode.img_lst_top + top)*VCode.img_sacle2;
				
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
						 VCode.xy = "";
						 $(VCode.div3).html("");

						 if(msg.status == 1){
							$(VCode.div1).text('验证成功通过').addClass("on0");
							$(VCode.div2).hide();
							VCode.callback({"status":msg.status,"ticket":msg.cid});
							$(VCode.div1).removeClass("on2");
							/*setTimeout((function(){
								$(VCode.div1).removeClass("on0").text("刷新倒计时"+VCode.haves+"秒").addClass("on");
								VCode.set_hav();
							}),1000);*/
							
						 }else{
							 $(VCode.div1).text('验证错误').addClass("on1");
							 VCode.img_load();
						 }

					   }
					})	
				}
				
				
			},
			img_load: function(){  // 验证图片加载
				$(VCode.div2).find(".ztvcode_loadbox").show();
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
							$(VCode.div2).find(".ztvcode_loadbox").hide();
							$(VCode.div1).removeClass("on1");
							if($(VCode.div2).css("display")=="block")
							{
								$(VCode.div1).text('依次点击文字：'+msg.data.text[0]+"，"+msg.data.text[1]+"，"+msg.data.text[2]);
							}
							
						}),100);
						
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
			leftop: function(img,ids,width){  // 适配 验证码显示位置
				if(!VCode.mode){
					$(VCode.divbg).addClass("ztreg_float");
				}else{
					switch(VCode.mode){
						case "float":
							$(VCode.divbg).addClass("ztreg_float");
						break;	
						case "embed":
							$(VCode.divbg).addClass("ztreg_embed");
						break;	
						case "popup":
							$(VCode.divbg).addClass("ztreg_popup");
						break;	
					}	
				}
				
				var m_top = ids.offset().top-$(window).scrollTop();
				var m_left = ids.offset().left;
				var self = this;
				
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
					if(m_top <= VCode.img_h) {
						VCode.ids.find(".ztvcode_refresh").css({top:"5px"});
						VCode.ids.find(".ztvcode_loadbox").css({top:"auto",bottom:0});
					}
					if(VCode.parent == 1){
						if(m_top > VCode.img_h){
							$(VCode.div2).css({position: self.position,width:width,height:VCode.img_h + 5,left:m_left+"px",top:m_top - img.height - 5 +"px",paddingTop:0,overflow:"hidden",zIndex:99999});
						}else{
							$(VCode.div2).css({position: self.position,width:width,height:VCode.img_h + 5,left:m_left+"px",top:m_top + $(VCode.div1).height() +"px",paddingTop:5+"px",overflow:"hidden",zIndex:99999});
						}
						
					}else{
						
						if(!VCode.mode){
							if(m_top > VCode.img_h){
								$(VCode.div2).css({position: self.position,width:width,height:VCode.img_h + 5,left:0,top:- img.height - 5 +"px",paddingTop:0,overflow:"hidden",zIndex:9999999});
							}else{
								$(VCode.div2).css({position: self.position,width:width,height:VCode.img_h,left:0,top:$(VCode.div1).height() +"px",paddingTop:5+"px",overflow:"hidden",zIndex:9999999});
							}
							
							
						}else{
							switch(VCode.mode){
								case "float":
									if(m_top > VCode.img_h){
										VCode.ids.find(".ztvcode_loadbox").css({top:0,bottom:"auto"});
										$(VCode.div2).css({position: self.position,width:width,height:VCode.img_h + 5,left:0,top:- img.height - 5 +"px",paddingTop:0,overflow:"hidden",zIndex:9999999});
									}else{
										$(VCode.div2).css({position: self.position,width:width,height:VCode.img_h,left:0,top:$(VCode.div1).height() +"px",paddingTop:5+"px",overflow:"hidden",zIndex:9999999});
									}

								break;	
								case "embed":
									$(VCode.div2).css({position: self.position,width:width,height:VCode.img_h});
								break;	
								case "popup":
									$(VCode.div2).css({position: self.position,width:width,height:VCode.img_h});
								break;	
							}	
						}
						
						
					}
				}else{
					var m_left2 = $(window).width()-(m_left+img.width);
					VCode.img_w = img.width;		
					VCode.img_h = img.height;
					
					$(VCode.div3).css({height:VCode.img_h+"px"});
					if(m_top <= VCode.img_h) {
						VCode.ids.find(".ztvcode_refresh").css({top:"5px"});
						VCode.ids.find(".ztvcode_loadbox").css({top:"auto",bottom:0});
					}
					
					if(VCode.parent == 1){
						if(m_top > VCode.img_h){
							$(VCode.div2).css({position:self.position,width:VCode.img_w,height:VCode.img_h + 5,left:m_left+"px",top:m_top - img.height - 5 +"px",paddingTop:0,overflow:"hidden",zIndex:99999});
						}else{
							$(VCode.div2).css({position:self.position,width:VCode.img_w,height:VCode.img_h,left:m_left+"px",top:m_top + $(VCode.div1).height() +"px",paddingTop:5+"px",overflow:"hidden",zIndex:99999});
						}
						
						
						
		
					}else{
						if(!VCode.mode){
							if(m_top > VCode.img_h){
								$(VCode.div2).css({position:self.position,width:VCode.img_w,height:VCode.img_h + 5,left:0,top:- img.height - 5 +"px",paddingTop:0,overflow:"hidden",zIndex:9999999});
							}else{
								$(VCode.div2).css({position:self.position,width:VCode.img_w,height:VCode.img_h,left:0,top:$(VCode.div1).height() +"px",paddingTop:5+"px",overflow:"hidden",zIndex:9999999});
							}
							
						}else{
							switch(VCode.mode){
								case "float":
									if(m_top > VCode.img_h){
										$(VCode.div2).css({position:self.position,width:VCode.img_w,height:VCode.img_h + 5,left:0,top:- img.height - 5+"px",paddingTop:0,overflow:"hidden",zIndex:9999999});
									}else{
										$(VCode.div2).css({position:self.position,width:VCode.img_w,height:VCode.img_h,left:0,top:$(VCode.div1).height() +"px",paddingTop:5+"px",overflow:"hidden",zIndex:9999999});
									}
								break;	
								case "embed":
									$(VCode.div2).css({position: self.position,width:width,height:VCode.img_h});
								break;	
								case "popup":
									$(VCode.div2).css({position: self.position,width:width,height:VCode.img_h});
								break;	
							}	
						}	
					}
				}
				VCode.tps = $(VCode.div2).css("top");
				if(VCode.parent == 1 && m_left2 < 0){
					$(VCode.div2).css({left:m_left + m_left2 +"px"});
				}
				
			},
			onRefresh:function(){  // 刷新验证码
				var self = $(VCode.div1);
				var sef = this;
				var ids = VCode.ids;
				var width = obj.width ? parseInt(obj.width) : ids.width();
				
				var b_l = parseInt($(VCode.div1).css("border-left-width"));
				var b_r = parseInt($(VCode.div1).css("border-right-width"));
				
				if(!isNaN(b_l))
				{
					width += b_l;
				}
				
				if(!isNaN(b_r))
				{
					width += b_r;
				}
				
				var img = new Image();

				if($("#"+this.divid2).length == 0){
					
					if(VCode.parent == 1){
						$("body").append(VCode.divbg);	
					}else{
						ids.append(VCode.divbg);
					}
					//ids.append('<div class="loadings" id="'+VCode.loading+'" style="display:none;"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div> </div>');
					
					//$("#"+VCode.loading).css({width:ids.width()+"px",height:$(VCode.div1).height()+"px",left:ids.offset().left+1+"px",top:ids.offset().top+1+"px"}).show();
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
								$(VCode.divbg).append(VCode.div1);
								$(VCode.div2).append('<div class="ztvcode_loadbox"> <div class="loadbox_inner"> <div class="ztvcode_loadicon"></div> <span class="ztvcode_loadtext">加载中...</span> </div> </div>');
								VCode.leftop(img,ids,width);
								$(VCode.div3).html(img);
								VCode.tupian = img;
								setTimeout((function(){
									$(VCode.div2).find(".ztvcode_loadbox").height(Math.ceil(VCode.img_h)).hide();
									//$("#"+VCode.loading).hide();
									sef.smwz = '依次点击文字：'+msg.data.text[0]+"，"+msg.data.text[1]+"，"+msg.data.text[2];
									if(VCode.mode=="float"){
										$(VCode.div1).text(VCode.moren).removeClass("on1");
									}else{
										$(VCode.div1).text(sef.smwz).removeClass("on1");
									}
									
									//
									
									$(VCode.refresh).show();	
									img.onload = null;
								}),200);
								
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
					VCode.leftop(VCode.tupian,ids,width);	
					VCode.show();
				}
			},
			hide : function(){  // 隐藏验证码
				setTimeout((function(){
					$(VCode.div2).hide();	
					if(VCode.mode=="float"){
						$(VCode.div1).text(VCode.moren);	
					}
				}),100);
			},
			show : function(){ // 显示 验证码
				$(VCode.div2).css({top:0,opacity:0});
				setTimeout((function(){
					//$(VCode.div1).text(VCode.smwz).removeClass("on1");
					$(VCode.div2).show().animate({top:VCode.tps,opacity:1},300);	
				}),100);
			},
			codes : function(s,call,onload,onerror){  //初始化验证码加载
				var self = this;
				codeid = s.codeid ? s.codeid : "";
				this.init();
				var db = $("#"+this.vid1);
				this.ids = typeof(s.element) == "string" ? $(s.element) : s.element;
				//VCode.width = s.width ? parseInt(s.width) : VCode.ids.width();
				
				self.parent = s.parent;
				self.mode = s.mode;
				self.callback = s.callback;
				self.onload = onload;
				self.onerror = onerror;			
				
				if(s.text)
				self.moren=s.text;
				
				$(self.div1).text(self.moren);
				
				
				$(self.refresh).bind(self.EndEvent,function(e){
					var ee = e||event;	
					ee.preventDefault();
					ee.stopPropagation(); 
					self.img_load();
				}).bind(self.StartEvent,function(e){
					var ee = e||event;	
					ee.preventDefault();
					ee.stopPropagation(); 
				})
				
				if(self.isMobile && self.have < 3) {
					self.div3.addEventListener(self.StartEvent, function (e) {
						var ee = e||event;	
						ee.preventDefault();
						ee.stopPropagation(); 
							
						var touchs = e.targetTouches[0];
						
						self.img_left = $(self.div2).offset().left;
						self.img_top = $(self.div2).offset().top;
						self.img_lst_left = touchs.pageX - self.img_left;
						self.img_lst_top = touchs.pageY - self.img_top - $(window).scrollTop();
						
					});
					 
					self.div3.addEventListener(self.EndEvent, function (e) {
						var ee = e||event;	
						ee.preventDefault();
						ee.stopPropagation(); 

						self.over();
					});
				} else {
					$(self.div3).bind(self.EndEvent, function (e) {	
						var ee = e || event;
						ee.preventDefault();
						ee.stopPropagation(); 
								
						self.img_left = $(self.div2).offset().left;
						self.img_top = $(self.div2).offset().top;
						
						self.img_lst_left = ee.clientX - self.img_left;
						self.img_lst_top = ee.clientY - self.img_top;
						
						self.over();
					}).bind(self.StartEvent,function(e){
						var ee = e||event;	
						ee.preventDefault();
						ee.stopPropagation(); 
					})
				}
				function embedvc(){
					setTimeout((function(){
						//触发式、嵌入式、弹出式。
						if(!VCode.mode)VCode.mode = "float";

						switch(VCode.mode){
							case "float":
								self.position = "absolute";

								if(VCode.isMobile)
								{
									//VCode.ids
									$(window).bind(VCode.StartEvent,function(){
										if($(VCode.div2).css("display")=="block"){
											$(VCode.div2).hide();
											$(VCode.div1).text(self.moren);	
										}
									})	
									
									$(self.div1).bind(VCode.EndEvent,function(e){
										var ee = e||event;	
										ee.preventDefault();
										ee.stopPropagation(); 
										if(VCode.have != 0){return false;}

										VCode.show();
										VCode.onRefresh();
										//

									}).bind(VCode.StartEvent,function(e){
										var ee = e||event;	
										ee.preventDefault();
										ee.stopPropagation(); 

									})
								}else{
									VCode.ids.hover(function(){
										if(VCode.have != 0){return false;}
										
										VCode.show();
										VCode.onRefresh();

									},function(){
										if(VCode.have != 0){return false;}
										VCode.hide();
										$(VCode.div1).text(VCode.moren).removeClass("on1");
									})
								}


							break;	
							case "embed":
								self.position = "relative";
							break;	
							case "popup":
								self.position = "relative";
							break;	
						}	
						self.onRefresh();
						call(self);
					}),0);
				}
				if(!!proxy){
					embedvc();
				}
				else{
					// 跨域IFRAME 加载完毕
					$("#"+frm).load(function(){
						embedvc();
					})
				}
			}
		};	
		VCode.codes(obj,call,onload,onerror); //{}, 回调函数， 初始化完成回调，初始化失败回调
		return VCode;
	}
    return VCode;
});
