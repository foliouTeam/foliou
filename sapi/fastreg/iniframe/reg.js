document.domain =  'ztgame.com';

var fastRegIframe = {
    formData:null,
    embeadStyleByLink:function(styles,callback){
        var self = this;
        if(this._checkIsZtgameUrl(styles,'css')>0){
            var head = document.getElementsByTagName('head')[0],
                linkTag = document.createElement('link');
            linkTag.setAttribute('rel','stylesheet');
            linkTag.setAttribute('media','all');
            linkTag.setAttribute('type','text/css');

            if(typeof(callback)=='function'){
                self.addLoadCallback(linkTag,callback);
            }
            linkTag.href = styles;
            head.appendChild(linkTag);
            return true;
        }
        else{
            return false;
        }
    },
    _checkIsZtgameUrl:function(url,format){
        if(!!format){
            if(url.indexOf('.'+format)<0){
                console.log('请传入正确的'+format+' url');
                return -1;

            }
            var urlarr = url.split('.'+format)
            if(urlarr.length>2){
                console.log('请传入正确的'+format+' url');
                return -1;

            }
        }
        if(url.indexOf('ztgame.com')>-1){
            var urlarr = url.replace('http://','').replace('https://','').replace('//','').split('ztgame.com');
            urlarr = urlarr[0].replace('.dev.','').replace('.web.','').replace('act.','').replace('w1.','').replace('sapi.','');
            urlarr = urlarr.split('.');
            var noempties=0;
            for(var i in urlarr){
                if(urlarr[i]!=''){
                    noempties++;
                }
                if(noempties>=2){
                    console.log('请传入正确的域名下'+format);
                    return -2;
                }
            }
            return 1;
        }
        console.log('请传入正确的域名下文件');
        return -3;
    },
    addLoadCallback:function(element,callback){
        if(!!element&&typeof(callback)=='function'){
            if(!!element.readyState){
                element.onreadystatechange = function() {
                    var r = element.readyState;
                    if (r === 'loaded' || r === 'complete') {
                        element.onreadystatechange = null;
                        callback();
                    }
                };
            }
            else{
                element.onload = callback;
            }
        }

    },
    clearGloabCss:function(justreplaceGlobal){
        if(!justreplaceGlobal)
        {
            justreplaceGlobal = false;
        }
        console.log(justreplaceGlobal);
        var head = document.getElementsByTagName('head')[0];
        var links = document.getElementsByTagName('link');
        for(var i=0;i<links.length;i++){
            if(this.checkIsGlobal(links[i].href,justreplaceGlobal)){
                head.removeChild(links[i]);
            }
        }
    },
    checkIsGlobal:function(url,justreplaceGlobal){
        if(justreplaceGlobal){
            return (url.indexOf('/css/fast/global.css')>-1);
        }
        else{
            return (url.indexOf('/css/fast/global.css')>-1||url.indexOf('/iniframe/reg.css')>-1);
        }
    },
    embeadStyleByString:function(styles){
        $('head').append('<style id="embeadstyle">'+styles+'</style>');
    },
    embeadJs:function(url,callback){
        var self = this;
        if(this._checkIsZtgameUrl(url,'js')>0){
            var head = document.getElementsByTagName('head')[0],
                srciptTag = document.createElement('script');

            if(typeof(callback)=='function'){
                self.addLoadCallback(srciptTag,callback);
            }
            srciptTag.src = url;
            head.appendChild(srciptTag);
            return true;
        }
        return false;
    },
    embeadScriptByString:function(scriptString){
        if(!!scriptString){
            scriptString = 'document.domain="ztgame.com"'+scriptString;
            $('head').append('<script type="text/javascript" id="embeadscript">'+scriptString+'</script>');
            return true;
        }
        return false;
    },
    runParent:function(method,params){
        if(!!window.parent&&typeof(window.parent[method])=='function'){
            window.parent[method](params);
        }
    },

    debug:function(){
        var self = this;
        var debug_btn = $('<a href="javascript:void(0)" class="debug_change">Next</a>');
        debug_btn.css({
            width:40,
            background:'#000',
            fontSize:12,
            textAlign:'center',
            height:40,
            color:'#fff',
            lineHeight:'40px',
            position:'fixed',
            bottom:10,
            right:10,
            borderRadius:5,
            zIndex:'100000',
            opacity:0.4
        });
        $('body').append(debug_btn);
        var box_outer = $("#fast,.box");
        var curindex = 0;
        debug_btn.click(function(){
            curindex++;
            if(curindex>=box_outer.length){
                curindex = 0;
            }
            box_outer.hide();
            box_outer.eq(curindex).show()
        });
        debug_btn.hover(function(){
            debug_btn.css({opacity:0.7});
        },function(){
            debug_btn.css({opacity:0.4});

        });
        $("#reg").unbind('click').click(function(){
            self.getFormdata();
            doCallBack();
        });
        $('.input_wrap input').blur(function(){

            $(this).parent().find(".err-tip").show();
        });
        $(".err-tip").click(function(){
            $(this).hide();
        });

        if($(".input-wrap").length==0){
            //更改旧版html结构
            /***添加 input_wrap***/
            $(".row").each(function(){
                if($(this).find('.sub').length==0){
                    return;
                }
                var html = $(this).html();
                var input_wrap = $("<div class='input_wrap'></div>");

                input_wrap.append($(html));
                $(this).html(input_wrap);
                input_wrap.find('.sub').prependTo($(this));
            });
            $(".data_collection").html('文字提示');
            //$(".box").show();
            $(".span-mpcode").html('验证码:');
            $(".box-captcha .captcha-refresh").appendTo($(".voice"));
            $(".reg").parent().removeClass('row').addClass('button_wrap');
            $(".box-footer").addClass('button_wrap');
            $(".box-ok,.reg").addClass('button_ok');
            $(".reg").addClass('btn-one');
            $(".box-cancel").addClass('button_cancle');
            $(':text,:password').addClass('input');
            $(".ag").attr('target','_blank');
            /**第一个和最后一个添加first 和 last**/
            $(".row-agree").removeClass('row');
        }
    },
    getFormdata:function(){
        var data = {
            account:$(".account").val(),
            phone:$(".phone").val()
        }
        this.formData = data;
    },
    init:function(index){
        var self = this;
        this.fastRegIndex = index;
        var body = document.getElementsByTagName('body')[0];
        $("#reg").click(function(){
            self.getFormdata();
        });
        this.runParent('fastiframeReady'+this.fastRegIndex);
        //清除input 自动填充样式
        $(".input-wrap input").css('background','none');
        $(".input-wrap input").attr('autocomplete','off');
        $("#reg_form").attr('autocomplete','off');
    }
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
$(function(){
    var regiframeid = GetQueryString('regiframeid');
    fastRegIframe.init(regiframeid);

})
function doCallBack(){
    fastRegIframe.runParent('fastRegSuccess'+fastRegIframe.fastRegIndex,fastRegIframe.formData);
}
