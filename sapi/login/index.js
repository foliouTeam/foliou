document.domain = "ztgame.com";
(function() {
    var definFun = function($, gpopup, DEVICE, Style) {
        var apiurl = "//sapi.ztgame.com/";
        var sapiURl = "https://cdnsapi.ztgame.com/site/js/login/"
        if (typeof console == "undefined") {
            window.console = {
                log: function(str) {
                    alert(str);
                },
                warn: function(str) {
                    alert(str);
                },
                error: function(str) {
                    alert(str);
                }
            };
        }
        if (typeof $ == "undefined") {
            console.warn("请加载jquery");
            return;
        }

        var isDev =
            window.location.host.indexOf("web.ztgame.com") > -1 ||
            window.location.host.indexOf("dev.ztgame.com") > -1 ||
            window.location.host == "localhost";
        function getiframeUrl(game, type) {
            if (!game) {
                return false;
            }
            if (!type) {
                return false;
            }

            var evn = "product";
            if (isDev) {
                evn = "dev";
            }
            if (game.indexOf("_site") < 0 && !iframeUrls[evn][game]) {
                game += "_site";
            }
            if (type.indexOf("pt_") < 0 && type.indexOf("yy_")) {
                type = "pt_" + type;
            }
            if (
                !!iframeUrls[evn] &&
                !!iframeUrls[evn][game] &&
                !!iframeUrls[evn][game][type]
            ) {
                return decodeURIComponent(iframeUrls[evn][game][type]);
            }
            return false;
        }
        function isAllNaN(str) {
            var reg = /^[\d]+$/;
            return reg.test(str);
        }
        function gLogin(container, options) {
            var self = this;
            if (!!container && !(container instanceof $)) {
                options = container;
                container = null;
            }
            var defaultOptions = {
                game: "",
                type: "page",
                width: "100%",
                height: "100%",
                return_url: window.location.href,
                zc: "",
                cssurl: "",
                jsurl: "",
                styleId: "",
                scriptId: "",
                loading: false,
                debug: false,
                onInit: function() {},
                onLogin: function(info) {},
                onLogout: function(result) {},
                onError: function(info) {}
            };
            options = $.extend(defaultOptions, options);
            if (DEVICE.isPc) {
                options.type = "popup";
            }
            if (isAllNaN(options.width)) {
                options.width = options.width + "px";
            }
            if (isAllNaN(options.height)) {
                options.height = options.height + "px";
            }
            //打开登录弹窗
            this.login = function(type, callback) {
                if (typeof type == "function") {
                    callback = type;
                    type = null;
                }
                if (!self.iframeurl) {
                    console.log("没有iframeurl");
                    return false;
                }

                if (!self.gLoginPopup) {
                    self.setPopup();
                }

                if (!type) {
                    type = options.type;
                }
                if (DEVICE.isPc) {
                    type = "popup";
                }

                switch (type) {
                    case "page":
                        window.open(
                            "//cdnsapi.ztgame.com/site/js/login/index.html?loginurl=" +
                                encodeURIComponent(self.iframeurl)
                        );
                        break;
                    case "popup":
                        self.gLoginPopup.show(self.gloginCOntainer);
                        if(!!callback){
                            window['gLogin_tem_callback'+gLoginIndex] = callback;
                        }
                        
                        break;
                }
            };

            //判断是否登录
            this.isLogin = function() {
                return !!self.getAccount();
            };

            this.logout = function(callback) {
                $.ajax({
                    url: apiurl + "/login/logout",
                    dataType: "jsonp",
                    success: function(result) {
                        if (typeof callback == "function") {
                            if (callback(result)) {
                                options.onLogout(result);
                            }
                        } else {
                            options.onLogout(result);
                        }
                    },
                    error: function() {
                        if (typeof callback == "function") {
                            if (callback({ status: -1, msg: "请求失败" })) {
                                options.onLogout({
                                    status: -1,
                                    msg: "请求失败"
                                });
                            }
                        } else {
                            options.onLogout({ status: -1, msg: "请求失败" });
                        }
                    }
                });
            };

            //获取登录用户名
            this.getAccount = function() {
                return getCookie("WEB_USER_ACCOUNT");
            };

            //设置popup
            this.setPopup = function() {
                if ($("#gLoginPopup_"+window.gLoginIndex).length > 0 || !!self.gLoginPopup) {
                    return;
                }
                //添加弹窗容器
                var devicetype = DEVICE.isPc ? "gLogin_pc" : "gLogin_mobile";
                var html =
                    '<div style="display:none;" class="gLoginPopup ' +
                    devicetype +
                    '" id="gLoginPopup_' +
                    window.gLoginIndex +
                    '"></div>';
                $("body").append(html);
                //初始化弹窗
                console.log(1);
                self.gLoginPopup = $("#gLoginPopup_"+window.gLoginIndex).gpopup({
                    scrollObj: false,
                    time: 300
                });
                $("#overlay").click(function() {
                    self.gLoginPopup.hide($("#gLoginPopup_"+window.gLoginIndex));
                });
                var gloginCOntainer = $("#gLoginPopup_"+window.gLoginIndex);
                self.gloginCOntainer = gloginCOntainer;
                self.setIframe(gloginCOntainer);
            };

            this.setIframe = function(contain) {
                if (!contain) {
                    contain = container;
                }
                //在容器中插入 注册iframe和 loading;
                var iframe =
                    '<div class="gPopupLogin_inner"> <iframe scrolling="0" frameborder="no" border="0" allowtransparency="true" style="border:none;background:none;width:100%;height:100%;"  src="' +
                    self.iframeurl +
                    '"></iframe></div>';

                // function checkLoaded() {
                //     loadedNum++;
                //     if (loadedNum >= 2) {
                //         if (typeof options.onInit == "function") {
                //             options.onInit();
                //         }
                //         if (!!loading) {
                //             loading.hide();
                //         }

                //         $(self.gLoginIframe).fadeIn(200);
                //     }
                // }
                // var iframeOnload = function() {
                //     self.gLoginIframeObj =
                //         self.gLoginIframe.contentWindow.gLoginIframe;
                //     if (!self.gLoginIframeObj) {
                //         return;
                //     }
                //     var embedstyle = ".fake-place-holder{text-intend:5px;}";

                //     if (
                //         !!options.styleId &&
                //         !!document.getElementById(options.styleId)
                //     ) {
                //         embedstyle += document.getElementById(options.styleId)
                //             .innerHTML;
                //     }

                //     if (embedstyle) {
                //         self.gLoginIframeObj.embeadStyleByString(embedstyle);
                //     }

                //     if (
                //         options.scriptId &&
                //         !!document.getElementById(options.scriptId)
                //     ) {
                //         self.gLoginIframeObj.embeadScriptByString(
                //             document.getElementById(options.scriptId).innerHTML
                //         );
                //     }

                //     if (options.cssurl) {
                //         self.gLoginIframeObj.embeadStyleByLink(
                //             getAbsoluteUrl(options.cssurl),
                //             function() {
                //                 checkLoaded();
                //             }
                //         );
                //     } else {
                //         checkLoaded();
                //     }
                //     if (options.jsurl) {
                //         self.gLoginIframeObj.embeadJs(
                //             getAbsoluteUrl(options.jsurl),
                //             function() {
                //                 checkLoaded();
                //             }
                //         );
                //     } else {
                //         checkLoaded();
                //     }

                //     window["gLoginSuccess" + self.gLoginIndex] = function(
                //         info
                //     ) {
                //         options.onSuccess(info);
                //     };
                //     // self.gLoginIframeObj.init(self.gLoginIndex);
                //     //self.gLoginIframe.style.display = 'block';
                //     if (options.debug && isDev) {
                //         self.gLoginIframeObj.debug();
                //     }
                // };
                // window["fastiframeReady" + self.gLoginIndex] = function(info) {
                //     iframeOnload();
                // };
                // self.gLoginIframe.src =
                //     self.curiframeurl + "&regiframeid=" + self.gLoginIndex;

                var gloginCOntainer = contain;
                gloginCOntainer.append(iframe);
                // if (!!options.loading) {
                //     if (gloginCOntainer.css("position") == "static") {
                //         gloginCOntainer.css({ position: "relative" });
                //     }
                //     var loading = $('<div class="gLogin_Loading"></div>');
                //     loading.css({
                //         width: 60,
                //         height: 60,
                //         background:
                //             "#000 url(" +
                //             getJSPath("login/index") +
                //             "iniframe/images/loading_small.gif) no-repeat center",
                //         position: "absolute",
                //         left: "50%",
                //         top: "50%",
                //         marginLeft: -40,
                //         marginTop: -40,
                //         borderRadius: 10,
                //         zIndex: 100,
                //         padding: 10,
                //         opacity: 0.3
                //     });
                //     gloginCOntainer.append(loading);
                // }
            };

            //在这里初始化
            function init() {
                var username = self.getAccount();
                if (!!username) {
                    options.onLogin({ account: username });
                }

                if (typeof window.gLoginIndex == "undefined") {
                    window.gLoginIndex = 0;
                }
                window.gLoginIndex++;
                self.gLoginIndex = window.gLoginIndex;
                var tpl = DEVICE.isPc
                    ? "pc"
                    : options.type == "page" ? "wap_page" : "wap_layer";
                self.iframeurl =
                    "//sapi.ztgame.com/login/url?return_url=" +
                    options.return_url +
                    "&zc=" +
                    options.zc +
                    "&tpl=" +
                    tpl +
                    "&js_callback_funtion=loginCallback_" +
                    self.gLoginIndex;
                window["loginCallback_" + self.gLoginIndex] = function(result) {
                    self.gLoginPopup.hide($(".gLoginPopup"));
                    $(".gLoginPopup iframe")[0].src = self.iframeurl;
                    if (!!result && !!result.status && result.status > 0) {
                        result.account = self.getAccount();
                        if(typeof(window['gLogin_tem_callback'+gLoginIndex])=='function'){
                            if(window['gLogin_tem_callback'+gLoginIndex](result)){
                                options.onLogin(result);
                            }
                        }
                        else{
                            options.onLogin(result);
                        }
                        

                    }
                };
                if (!DEVICE.isPc) {
                    self.iframeurl +=
                        "&css=" +
                        sapiURl +
                        "iniframe/login.css";
                }
                if (options.type == "popup") {
                    self.setPopup();
                }
            }
            init();
        }
        //一些公共函数放这里

        function getJSPath(jsname) {
            var js = document.scripts;
            var jsPath = "";
            for (var i = js.length; i > 0; i--) {
                if (js[i - 1].src.indexOf(jsname) > -1) {
                    jsPath = js[i - 1].src.substring(
                        0,
                        js[i - 1].src.lastIndexOf("/") + 1
                    );
                }
            }
            return jsPath;
        }
        function getCurUrl() {
            var ur =
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname;
            var pathArr = window.location.pathname.split("/");
            var ur2 = ur;
            if (pathArr[pathArr.length - 1].indexOf(".") > -1) {
                ur2 = ur2.replace(pathArr[pathArr.length - 1], "");
            }
            return ur2;
        }
        function getFilePath(file) {
            if (file.indexOf("http://") < 0 && file.indexOf("https://") < 0) {
                file = getCurUrl() + file;
            }
            return file;
        }

        function getCookie(c_name) {
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + "=");
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) c_end = document.cookie.length;
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return "";
        }
        function getAbsoluteUrl(url) {
            if (url.indexOf("//") > -1) {
                return url;
            }
            return getCurUrl() + url;
        }
        if ($) {
            (function($) {
                $.fn.gLogin = function(params) {
                    var result = [];
                    this.each(function(index) {
                        result.push(new gLogin($(this), params));
                        // $(this).data('gplayer', new GPlayer($(this), params));
                    });
                    if (result.length <= 1) {
                        return result[0];
                    }
                    return result;
                };
            })($);
        }
        return gLogin;
    };

    if (typeof exports === "object") {
        // CommonJS
        module.exports = definFun(
            require("jquery"),
            require("../gpopup/v3"),
            require("../device/main"),
            require("../plugins/css!./css/login")
        );
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define([
            "jquery",
            "../gpopup/v3",
            "../device/main",
            "../plugins/css!./css/login"
        ], definFun);
    } else {
        // Global Variables
        window.gLogin = definFun($, GPopup, DEVICE, Style);
    }
})();
