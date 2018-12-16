(function() {
    var definFun = function($, device, VCode,Styles,Config) {
        var apiurl = Config.serviceDomain+"/yuyue/";

        var isdev = false;
        var hostname = window.location.host;
        if(hostname.indexOf('ztgame.com')<0){
            console.log('在本地开发存在跨域问题，可在测试环境下调试');
        }
        if(hostname=='localhost'||hostname.indexOf('192.168')>-1||hostname.indexOf('.web.')>-1||hostname.indexOf('.dev.')>-1||hostname.indexOf('w1.')>-1||hostname.indexOf('w2.')>-1||hostname.indexOf('common.')>-1)
        {
            isdev = true;
        }
        if(isdev){
            apiurl = "http://sapi.dev.ztgame.com/yuyue/";
        }
        
        
        function GetQueryString(name) { 
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); 
            var r = window.location.search.substr(1).match(reg); 
            if (r!=null) return (r[2]); return null; 
        }
        var divselect = function(divselectid,inputselect,hideCallback) {
            divselectid.find("cite").click(function(){
                var ul = divselectid.find("ul");
                if(ul.css("display")=="none"){
                    divselectid.parents(".GYuYue_input_wrap").css({zIndex:300});
                    ul.stop().slideDown("fast");
                }else{
                    
                    ul.stop().slideUp("fast",function(){
                        divselectid.parents(".GYuYue_input_wrap").css({zIndex:0});
                        if(typeof(hideCallback)=='function'){
                            hideCallback(inputselect);
                        }
                    });
                    
                }
            });
            divselectid.find("ul li a").click(function(){
                var txt = $(this).text();
                divselectid.find("cite").html(txt);
                var value = $(this).attr("selectid");
                inputselect.val(value);
                divselectid.find("ul").hide();
                divselectid.parents(".GYuYue_input_wrap").css({zIndex:0});
            });
        };
        function YuYue(container, options) {
     
            if(typeof(container)=='object'&&typeof(container.html)=='undefined'&&typeof(container.cid)!='undefined'){
                options = container;
                container = null;
            }
            
            if(!console){
                console = {log:function(str){
                    //alert(str);
                },error:function(){
                    //alert(str);
                }}
            }
            if (!window.GYuyue_index) {
                window.GYuyue_index = 0;
            }
            if(isdev&&!!options.dev){
                options = $.extend(options,options.dev);
            }
            window.GYuyue_index++;
            var platformlist = [
                {
                    value: 2,
                    name: "Android"
                },
                {
                    value: 3,
                    name: "IOS"
                }
            ];
            var self = this;
            var defaultOptions = {
                cid: "",
                showsub: false,
                selectPlatform: true,
                lineHeight: 40,
                gap: 0,
                border: "",
                btnColor: "",
                from:"",
                onTip:function(){
                    return true;
                },
                onError:function(){
                    return true;
                },
                onInit: function() {
                    
                },
                onSubmit: function() {
                    return true;
                }
            };
            options = $.extend(defaultOptions, options);
            this.textcode = false;
            ///初始化函数
            this.init = function() {
                if(!options.cid){
                    console.error('预约：请传入参数cid');
                    return;
                }
                if(!options.from){
                    console.error('预约：请传入参数from，如：from:"xx2_act_fuli"');
                    return;
                }
                self.ajax("countAndConfig", { cid: options.cid }, function(
                    bool,
                    result
                ) {
                    if (bool) {
                        
                        self.config = result.config;
                        self.vcodeType = self.getVcode();
                        if(!!self.vcodeType&&self.vcodeType.type=='hide'&&self.vcodeType.set){
                            self.vcodeType.set(function(res){
                                
                                options.onInit(res);
                            });
                        }
                        else{
                            options.onInit(result);
                        }
                        if(container){
                            var html = createHtml(result.config);
                            container.html(html);
                            if(device.isMobile){
                                if(device.isiOS){
                                    container.find(".GYuYue_os select").val(3);
                                }
                                else{
                                    container.find(".GYuYue_os select").val(2);
                                }
                            }
                            self.telInput = container.find(".GYuYue_mobile input");
                            self.smsInput = container.find(
                                ".GYuYue_sms_code input"
                            );
                            self.imgInput = container.find(
                                ".GYuYue_img_code input"
                            );
                            var vcode = self.getVcode();
                            if(!!vcode&&!!vcode.type){
                                switch (vcode.type){
                                    case 'click':
                                    vcode.set($(".GYuYue_click_code"));
                                }
                            }
                            // if (result.config['switch']==3||result.config['switch']==4) {
                            //     //self.setClickVcode($(".GYuYue_click_code"));
                            //     self.setClickVcode($(".GYuYue_click_code"));
                            // }
                            self._bind();
                        }
                        
                    } else {
                        tip(result.msg,result.code);
                        options.onInit(result);
                    }
                });
            };
            this.getConfig = function(){
                return self.config;
            }
            this.getVcode = function(){
                if(self.config&&self.config['switch']){
                    var result = false;
                    switch (parseInt(self.config['switch'])){
                        case 1:
                        case 2:
                            //图片验证码
                            result = {
                                type:'img',
                                set:self.getImgCode
                            }
                        break;
                        case 3:
                        case 4:
                        //点选验证码
                        result = {
                                type:'click',
                                set:self.setClickVcode
                            };
                        break;
                        case 5:
                        case 6:
                            if(canvasSupport()){
                                result = {
                                    type:'hide',
                                    set:self.setHiddenVcode
                                }
                            }
                            else{
                                result = {
                                    type:'click',
                                    set:self.setClickVcode
                                }
                            }
                            
                        break;
                        case 0:
                            result = {
                                type:'nocode',
                                set:function(){

                                }
                            }
                            break;
                        default :
                        result = false;
                    }
                    result.sms = false;
                    switch (parseInt(self.config['switch'])){
                        case 2:
                        case 4:
                        case 6:
                            result.sms = true;
                    }
                    return result;
                }
                return false;
            }
            //设置无交互验证码
            this.setHiddenVcode = function(callback,callback2){
                if(typeof(callback2)=='function'){
                    callback = callback2;
                }
                requirejs(["secure/main"], function(secure,$) {
                    var obj = new secure();
                    self.hideCodeObj = obj;
                    obj.getTicket(function(result){
                        //console.log(result);
                        if(typeof(callback)=='function'){
                            callback(result);
                        }
                        if(!!result&&!!result.status&&!!result.cid){
                            self.textcode = result.cid;
                        }
                        else{
                            self.textcode = null;
                        }
                    }); //获取票据
                });
            }
            //设置点选验证码
            this.setClickVcode = function(element,callback){
                function handle(res) {
                    //console.log(res);
                    if(typeof(callback)=='function'){
                        callback(res);
                    }
                    if(!!res&&!!res.status&&!!res.ticket){
                        self.textcode = res.ticket;
                    }
                }
                self.ctx = new VCode(
                    {
                        element: element, //提示层id 或者 指定元素
                        //codeid:"vcode_img", //指定验证图片层id（可选）
                        //width:"350", //验证图片显示宽度 不设置默认按照指定元素宽度设置（可选）
                        mode: "float", //验证码显示方式  触发式、嵌入式、弹出式。 float embed popup 默认为触发式(float)
                        callback: handle //默认回调 验证码验证结束回调函数
                    },
                    function(instance) {
                        //instance.show();
                        self.clickVcodeInstance = instance;
                    },
                    function onload(success, instance) {
                        //self.textcode = true;
                        //alert('init');
                    },
                    function onerror(err, instance) {
                        
                        //self.textcode = false;
                    }
                );
            }
            //获取图片验证码
            this.getImgCode = function(element,callback) {
                //console.log(element.is('img'));
                if(!element||element.length==0){
                    return;
                }
                if(!element.is('img')){
                    
                    element.html('<img/>');
                    element = element.find('img');
                }
                element.attr(
                    "src",
                    apiurl+"vcimg?t=" +
                        new Date().getTime()
                );
                element.show();
                element
                    .click(function() {
                        element.attr(
                            "src",
                            apiurl+"vcimg?t=" +
                                new Date().getTime()
                        );
                    });
                if(typeof(callback)=='function'){
                    callback(true);
                }
                self.imgcodeElement = element;
            };
            ///绑定事件函数
            this._bind = function(){
                var input = container.find(
                    ".GYuYue_input_container input,.GYuYue_input_container select"
                );
                input.each(function() {
                    $(this).blur(function() {
                        self.validate($(this));
                    });
                });
                container.find(".GYuYue_sms_code a").click(function(){
                    self.bindGetSms();
                });
                container.find('.GYuYue_form')[0].onsubmit = function(){
                    self.bindsubmit();
                    return false;
                };
                jsplaceholder(input);
                if(!container.find(".GYuYue_os").hasClass('GYuYue_hidden')){
                    divselect(container.find(".platformselect"),container.find(".inputselect"),function(inputselect){
                        self.validate(inputselect);
                    });
                }
                
                self.getImgCode($(".GYuYue_img_code img"));
            }

            //获取当前预约人数
            this.getCount=function(callback){
                self.ajax('dataCount',{},function(bool,result){
                    if(typeof(callback)=='function'){
                        callback(result);
                    }
                });
            }

            //验证表单函数
            this.validate = function(input) {
                var result = true;
                container.find(".GYuYue_err_tip").hide();
                input.each(function() {
                    //$(this).blur(function() {});
                    var must = $(this).data("must");
                    var value = $.trim($(this).val());
                    var name = $(this).data("name");
                    var tagname = $(this)[0].tagName;
                    var action =
                        tagname && tagname == "SELECT" ? "选择" : "填写";
                    $(this).val(value);

                    if (!!must && !value) {
                        error($(this).parents(".GYuYue_input_container "), "请" + action + "" + name);
                        result = false;
                        return false;
                    }
                    if (!!value) {
                        var type = $(this).attr("type");
                        switch (type) {
                            case "tel":
                            case "phone":
                                var res = checkMobile(value);
                                if (res == -1) {
                                    erro($(this).parents(".GYuYue_input_container "),
                                        "请" + action + "正确的手机号"
                                    );
                                    result = false;
                                    return false;
                                }
                                break;
                            case "number":
                                if (!checkRate(value)) {
                                    error(
                                        $(this).parents(".GYuYue_input_container "),
                                        "请" + action + "数字"
                                    );
                                    result = false;
                                    return false;
                                }
                                break;
                            case "date":
                                if (!IsDate(value)) {
                                    error(
                                        $(this).parents(".GYuYue_input_container "),
                                        "请" + action + "正确的日期"
                                    );
                                    result = false;
                                    return false;
                                }
                                break;
                            case "email":
                                if (!checkEmail(value)) {
                                    error(
                                        $(this).parents(".GYuYue_input_container "),
                                        "请" + action + "正确的邮箱地址"
                                    );
                                    result = false;
                                    return false;
                                }
                        }
                    }
                });
                return result;
            };


            var error = function(ele, str) {
                if(options.onError(ele,str)){
                    var errEle = ele.find(".GYuYue_err_tip");
                    if (errEle.length == 0) {
                        errEle = $('<div class="GYuYue_err_tip">' + str + "</div>");
                        ele.append(errEle);
                        ele
                            .parents(".GYuYue_input_wrap ")
                            .addClass("GYuYue_input_wrap_error");
                        errEle.click(function() {
                            errEle.hide();
                            ele
                                .parents(".GYuYue_input_wrap ")
                                .removeClass("GYuYue_input_wrap_error");
                                setTimeout(function(){
                                    ele.find("input,select").focus();
                                },0);
                            
                        });
                    } else {
                        errEle.html(str);
                        errEle.show();
                    }
                }
            }
            function tip(str,code){
                if(options.onTip(str,code)){
                    alert(str);
                }
                
            }
            function IsDate(mystring) {
                //console.log(mystring);
                var reg = /^(\d{4})(-|\/)(\d{2})(-|\/)(\d{2})$/;
                var str = mystring;
                var arr = reg.exec(str);
                if (str == "") return true;
                if (!reg.test(str) && RegExp.$2 <= 12 && RegExp.$3 <= 31) {
                    return false;
                }
                return true;
            }
            function checkEmail(strm) {
                var regm = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; //验证Mail的正则表达式,^[a-zA-Z0-9_-]:开头必须为字母,下划线,数字,
                if (!strm.match(regm)) {
                    return false;
                }
                return true;
            }
            function checkMobile(tel) {
                tel = $.trim(tel);
                if (!tel) {
                    return -2;
                }
                var myreg = /^(1\d{10})$/;
                if (!myreg.test(tel)) {
                    return -1;
                }
                return 1;
            }
            function checkRate(nubmer) {
                var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
                if (!re.test(nubmer)) {
                    return false;
                }
                return true;
            }

            //生成html结果
            function createHtml(config) {
                var html =
                    '<form class="GYuYue_form '+(device.isMobile?'GYuYue_ismobile':'')+'" onsubmit="return false;" id="GYuYue_form_' +
                    window.GYuyue_index +
                    '">';
                html +=
                    '<div class="GYuYue_input_wrap GYuYue_mobile" > <label>手机号码</label><div class="GYuYue_input_container"><input name="phone_number" data-name="手机号" data-must="1" maxlength=11 placeholder="请输入手机号" id="mobile" name="mobile" value="" type="tel"></div></div>';
                if (options.selectPlatform) {
                    html +=
                        '<div class="GYuYue_input_wrap GYuYue_os '+(device.isMobile?'GYuYue_hidden':'')+'"> <label>手机系统</label><div class="GYuYue_input_container GYuYue_input_container_show">'+
                        '<div class="platformselect select">'+
                        '<cite>请选择系统</cite>'+
                        '<ul style="display:none">';
                        for (var i in platformlist) {
                            html +='<li><a href="javascript:;" selectid="'+platformlist[i]["value"]+'">'+platformlist[i]["name"]+'</a></li>';
                        }
                        html+='<input data-name="手机系统" data-must="1" name="platformFrom" type="hidden" value="'+(device.isAndroid?2:device.isiOS?3:'')+'" class="inputselect"/>';
                        //  <select data-name="手机系统" name="platformFrom" data-must="1" placeholder="请选择系统">';
                        // html += '<option value="">请选择手机系统</option>';
                        // for (var i in platformlist) {
                        //     html +=
                        //         '<option value="' +
                        //         platformlist[i]["value"] +
                        //         '">' +
                        //         platformlist[i]["name"] +
                        //         "</option>";
                        // }
                    html += "</ul></div></div></div>";
                }
                if (config['switch'] == 1 || config['switch'] == 2) {
                    html +=
                        '<div class="GYuYue_input_wrap GYuYue_img_code"> <label>图片验证码</label> <div class="GYuYue_input_container"> <input name="picode" data-name="图片验证码" placeholder="请输入图片验证码" data-must="1" type="text" maxlength=4/></div><img src="" title="点击切换验证码"/></div>';
                }
                if (config['switch'] == 3 || config['switch'] == 4 ||((config['switch'] == 5||config['switch'] == 6)&&!canvasSupport())) {
                    html +=
                        '<div class="GYuYue_input_wrap GYuYue_click_code"></div>';
                }
                if (!!self.vcodeType&&!!self.vcodeType.sms) {
                    html +=
                        '<div class="GYuYue_input_wrap GYuYue_sms_code"> <label>短信验证码</label><div class="GYuYue_input_container"><input data-name="短信验证码" name="smcd" placeholder="请输入短信验证码" type="text" data-must="1" maxlength=6/><a href="javascript:void(0)" class="">获取验证码</a></div></div>';
                }
                if (!!config.extra_data) {
                    config.extra_data = $.parseJSON(config.extra_data);
                }
                if (
                    !!config.extra_data &&
                    typeof config.extra_data == "object"
                ) {
                    for (var i in config.extra_data) {
                        html +=
                            '<div class="GYuYue_input_wrap GYuYue_extra_' +
                            i +
                            '"> <label>' +
                            config.extra_data[i]["name"] +
                            '</label> <div class="GYuYue_input_container"> <input data-name="' +
                            config.extra_data[i]["name"] +
                            '" name="extra_data.' +
                            i +
                            '" data-must="' +
                            config.extra_data[i]["must"] +
                            '" placeholder="请输入' +
                            config.extra_data[i]["name"] +
                            '" type="' +
                            config.extra_data[i]["type"] +
                            '"/></div></div>';
                    }
                }
                var mtag = GetQueryString('mtag');
                
                
                if(mtag){
                    html+='<input type="hidden" name="mediaFrom" value="'+mtag+'"/>';
                }
                html+='<input type="hidden" name="from" value="'+options.from+'"/>';
                //data['from'] = options.from;
                // data['fullurl'] = options.from;
                html+='<input type="hidden" name="fullurl" value="'+window.location.href+'"/>';
                html += '<input class="GYuYue_submit" type="submit"/>';
                html += "</form>";
                return html;
            }

            //ajax  
            this.ajax = function(action, data, callback) {
                if (!action) {
                    return false;
                }
                if (typeof data == "function") {
                    callback = data;
                    data = {};
                }
                data['cid'] = options.cid;
                $.ajax({
                    url: apiurl + action,
                    data: data,
                    dataType:'jsonp',
                    success: function(result) {
                        if (typeof callback == "function") {
                            if (
                                !!result &&
                                typeof result.ret != "undefined" &&
                                result.ret > 0
                            ) {
                                callback(true, result);
                            } else {
                                if(!result.msg){
                                    result.msg = '未知错误'
                                }
                                if(!result.code){
                                    result.code = '0000'
                                }
                               
                                callback(false, result);
                            }
                        }
                    },
                    error: function(res) {
                        if (typeof callback == "function") {
                            callback(false, {msg:'请求失败',code:'201'});
                        }
                    }
                });
            };
            function canvasSupport() {
                return !!document.createElement('canvas').getContext;
            }
            // alert('canvas:'+canvasSupport());
            var smsclock = null;
            var curtime = 59;
            function jsplaceholder(element){
                if(supportplaceholder()){
                    return;
                }
                element.each(function(){
                    $(this).focus(function(){
                        if(!!$(this).attr('placeholder')&&$(this).attr('placeholder')==$(this).val())
                        {
                            $(this).val('');
                            
                        }
                        $(this).css({opacity:1});
                    });
                    $(this).blur(function(){
                        setTip($(this));
                    });
                    setTip($(this));
                });
                function setTip(input){
                    if(!input){
                        return;
                    }
                    if(!input.val()){
                        input.val(input.attr('placeholder'));
                        if(!supportplaceholder()){
                            input.css({opacity:0.6});
                        }
                        
                    }
                    else{
                        input.css({opacity:1});
                    }
                }
            }
            function supportplaceholder(){
                var element = document.getElementsByTagName('input')[0];
                if('placeholder' in element.style)
                {
                    return true;
                }    
                else
                {
                    return false;
                };
            };
            this.refreshCode = function(callback){
                this.textcode = '';
                if(!!this.imgcodeElement){
                    this.imgcodeElement.attr(
                        "src",
                        apiurl+"vcimg?t=" +
                            new Date().getTime()
                    );
                    if(typeof(callback)=='function'){
                        callback(true);
                    }
                }
                if(!!self.clickVcodeInstance){
                    self.clickVcodeInstance.onRefresh();
                    self.clickVcodeInstance.hide();
                    if(typeof(callback)=='function'){
                        callback(true);
                    }
                }
                if(!!self.hideCodeObj){
                    self.hideCodeObj.getTicket(function(result){
                        if(typeof(callback)=='function'){
                            callback(result);
                        }
                        if(!!result&&!!result.status&&!!result.cid){
                            self.textcode = result.cid;
                        }
                        else{
                            self.textcode = null;
                        }
                    });
                }
            };
            this.getSmsCode = function(phone,vercode,callback){
                
                if(typeof(vercode)=='function'){
                    callback = vercode;
                    vercode = null;
                }
                if(!phone){
                    if(typeof(callback)=='function'){
                        callback({ret:-1,msg:'手机号不能为空'});
                    }
                    return false;
                }
               
                if(!self.config){
                    if(typeof(callback)=='function'){
                        callback({ret:-1,msg:'初始化未完成'});
                    }
                    return false;
                }
                
                var data = {phone_number:phone,picode:vercode,cid:options.cid};
                if(self.config['switch']==2)
                {
                    //图片验证码
                    if(!vercode){
                        if(typeof(callback)=='function'){
                            callback({ret:-1,msg:'缺少图片验证码'});
                        }
                        return false;
                    }
                }
                else {
                    data.picode = self.textcode;
                }
                data.isNoverify = canvasSupport()?1:0;
                self.ajax('smcd',data,function(bool,result){
                    if(typeof(callback)=='function'){
                        callback(result);
                    }
                    if(!bool){
                        self.refreshCode();
                    }
                });
            }

            //获取短信验证码
            this.bindGetSms = function() {
                if (smsclock) {
                    return false;
                }
                if (!self.validate(container.find(".GYuYue_mobile input"))) {
                    return false;
                }
                if (
                    self.config['switch'] == 2 &&
                    !self.validate(container.find(".GYuYue_img_code input"))
                ) {
                    return false;
                }
                if (self.config['switch'] == 4 && !self.textcode) {
                    self.ctx.show();
                    return false;
                }
                disableSms();
                var phone_number = container.find('.GYuYue_mobile  input').val();
                var imgcode = container.find('.GYuYue_img_code   input').val();
                var vercode = imgcode;
                if(!!self.textcode){
                    vercode = self.textcode;
                }
                self.getSmsCode(phone_number,vercode,function(result){
                    if(result&&result.ret){
                        if(isdev&&result.msg){
                            container.find(".GYuYue_sms_code input").val(result.msg);
                        }
                        tip('验证码发送成功','101');
                    }
                    else{
                        enableSms();
                        tip(result.msg,result.code);
                        self.getImgCode();
                    }
                });
            };


            this.submit = function(data,callback){
                if(!data){
                    if(typeof(callback)=='function'){
                        callback({ret:-1,msg:'缺少数据'});
                    }
                    return false;
                }
                if(!data.mediaFrom){
                    data.mediaFrom = GetQueryString('mtag');
                }
                if(!data.fullurl){
                    data.fullurl = window.location.href;
                }
                if(!data.from){
                    data.from = options.from;
                }
                if(!data.isNoverify){
                    data.isNoverify = canvasSupport()?1:0;
                }
                if(!!self.textcode&&!data.picode){
                    data.picode = self.textcode;
                }

                self.ajax('datasave',data,function(bool,result){
                    if(typeof(callback)=='function'){
                        callback(result);
                    }
                    if(!bool){
                        self.refreshCode();
                    }
                });
            }

            this.bindsubmit = function(){
                if(self.validate(container.find(".GYuYue_input_container input,.GYuYue_input_container select"))){
                    var dataArr = container.find(".GYuYue_form").serializeArray();
                    var data = {};
                    var name,value;
                    for(var i in dataArr){
                        name = dataArr[i]['name'];
                        value = dataArr[i]['value'];
                        setData(data,name,value);
                    }
                    if(!!self.textcode){
                        data['picode'] = self.textcode;
                    }
                    function setData(obj,key,value){
                        if(!key){
                            return;
                        }
                        if(key.indexOf('.')>-1){
                            var keyArr = key.split('.');
                            for(var i in keyArr){
                                if(!keyArr[i]){
                                    delete keyArr[i];
                                }
                            }

                            if(keyArr.length>1){
                                var first = keyArr.splice(0,1);
                                key = keyArr.join('.');
                                if(typeof(obj[first])=='undefined'){
                                    obj[first] = {};
                                }
                                if(key){
                                    setData(obj[first],key,value);
                                }
                                
                            }
                            else if(keyArr.length==1){
                                obj[keyArr[0]] = value;
                            }
                        }
                        else{
                            obj[key] = value;
                        }
                    }

                    data.cid = options.cid;
                    if(options.onSubmit(data)){
                        
                        self.ajax('datasave',data,function(bool,result){
                            if(bool){
                                tip('恭喜您提交成功','102');
                            }
                            else{
                                tip(result.msg,result.code);
                            }
                            if(!bool){
                                self.refreshCode();
                            }
                        });
                    }
                    
                }
            }
            function disableSms() {
                curtime = 59;
                container.find(".GYuYue_sms_code a").html(curtime+'S');
                container.find(".GYuYue_sms_code a").addClass('disable');
                smsclock = setInterval(function() {
                    curtime--;
                    if (curtime <= 0) {
                        enableSms();
                        return;
                    }
                    container.find(".GYuYue_sms_code a").html(curtime);
                }, 1000);
            }
            function enableSms() {
                self.getImgCode();
                container.find(".GYuYue_sms_code a").html("获取验证码");
                container.find(".GYuYue_sms_code a").removeClass('disable');
                clearInterval(smsclock);
                smsclock = null;
            }
            this.init();
        }
        return YuYue;
    };
    if (typeof exports === "object") {
        // CommonJS
        module.exports = definFun(
            require("jquery"),
            require("../device/main"),
            require("../vcode/main"),
            require('../plugins/css!./css/style'),
            require('../config/config')
        );
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery", "../device/main", "../vcode/main",'../plugins/css!./css/style','../config/config'], definFun);
    } else {
        // Global Variables
        window.YuYue = definFun($, device, VCode,Config);
    }
})();
