/**
    @author:roc
    @email:1134420693@qq.com
    @blog:http://blog.focusbe.com
**/

//全局字体rem
INIT = function(designSize,weborientation,tipEle,inItCallback)
{
    var html = document.getElementsByTagName('html')[0];
    var body = document.getElementsByTagName('body')[0];
    if(typeof(weborientation)=='undefined')
        weborientation = 'all';
    var designWidth,designHeight;
    if(typeof(designSize)=="object")
    {
        designWidth=designSize[0]<designSize[1]?designSize[0]:designSize[1];
        designHeight=designSize[0]>designSize[1]?designSize[0]:designSize[1];
    }
    else
    {
        designWidth = designSize;
    }
    function setCss(element,object)
    {
        for(var i in object)
        {
            element.style[i] = object[i];
        }
    }
    if(weborientation!='all')
    {
        var hengshuTip;
        if(!tipEle)
        {
            hengshuTip = document.createElement('div');
            hengshuTip.id = "hengshuTip";
            setCss(hengshuTip,{width:'100%',height:'100%',position:'fixed',top:0,left:0,zIndex:999999,background:'#000',transition:'all 0.1s',webkitTransition:'all 0.1s'});
            //hengshuTip.style.cssText = "width:100%;height:100%;position:fixed;top:0;left:0;z-index:999999;background:#000;transition:all 0.1s;-webkit-transition:all 0.1s;";
            var tip_text = document.createElement('p');
            tip_text.innerHTML = '为了更好的体验<br/>请旋转屏幕';
            setCss(tip_text,{color:'#fff',fontSize:'24px',textAlign:'center',position:'relative',top:'50%',marginTop:'-36px',lineHeight:1.5});
            //tip_text.style.cssText ="color:#fff;font-size:24px;text-align:center;position:relative;top:50%;margin-top:-36px;line-height:1.5;";
            body.appendChild(hengshuTip);
            hengshuTip.appendChild(tip_text);

        }
        else {
            hengshuTip = document.getElementById(tipEle);
        }

    }
    (function()
    {
        var inited = false;
        needsetOri = false;
        var originalSize = parseInt((window.getComputedStyle(document.documentElement,null)).fontSize);
        function setFontsize(size){
            var win_w = parseInt(document.documentElement.clientWidth);
            win_w = (win_w>size)?size:win_w;
            var win_h = parseInt(document.documentElement.clientHeight),
            html = document.getElementsByTagName('html')[0],
            zoom=(win_w / size) / (originalSize/16) * 100;
            html.style.fontSize = zoom + 'px';
        }
        //横竖屏检测
        function hengshuping(){
            var theOritation = 0;
            if(needsetOri||typeof(window.orientation)=='undefined')
            {

                needsetOri = true;
                var win_w = parseInt(document.documentElement.clientWidth);
                var win_h = parseInt(document.documentElement.clientHeight);
                if(win_w<win_h)
                {
                    theOritation = 0;
                }
                else
                {
                    theOritation = 90;
                }
            }
            else {
                theOritation = window.orientation;
            }
            if(theOritation==180||theOritation==0){
                if(weborientation=='h')
                {
                    runInit(false);
                }
                else if(weborientation=='s')
                {
                    runInit(true);
                    setFontsize(designWidth);
                }
                else if(weborientation=='all')
                {
                    runInit(true);
                    setFontsize(designWidth);
                }
            }
            else if(theOritation==90||theOritation==-90){
                if(weborientation=='h')
                {
                    runInit(true);
                    setFontsize(designHeight);
                }
                else if(weborientation=='s')
                {
                    runInit(false);
                }
                else if(weborientation=='all')
                {
                    runInit(true);
                    //console.log(designHeight);
                    setFontsize(designHeight);
                }
            }
            else
            {
                setFontsize(designWidth);
                runInit(true);
            }

        }
        function runInit(isSameOrien)
        {
            if(isSameOrien)
            {
                if(!!hengshuTip)
                {
                    hengshuTip.style.display = 'none';
                }
                if((document.readyState=='interactive'||document.readyState=='complete')&&!inited)
                {
                    inited = true;
                    if(typeof(inItCallback)=='function')
                    {
                        inItCallback();
                    }

                }

            }
            else
            {
                if(!!hengshuTip)
                {
                    hengshuTip.style.display = 'block';
                }
            }
        }
        hengshuping();
        window.addEventListener("orientationchange", hengshuping, false);
        window.addEventListener("resize", hengshuping, false);
        document.addEventListener("DOMContentLoaded", function(){
            hengshuping();
        }, false);
    })();
};
