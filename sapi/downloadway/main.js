/**
    @author:liupeng
    @email:liupeng@ztgame.com
    @blog:http://blog.focusbe.com
    @github:https://github.com/focusbe
**/
(function() {
    var definFun = function($, DEVICE) {
        //替换全部函数
        String.prototype.replaceAll = function(s1, s2) {
            return this.replace(new RegExp(s1, "gm"), s2);
        };

        function DownloadWay(options) {
            if (typeof options == "function") {
                options = {
                    callback: options
                };
            }
            /*默认参数*/
            var defaultOptions = {
                url: "",
                flag: "",
                callback: null,
                downloadBtn: null,
                androidBtn: null,
                iosBtn: null,
                qrcode: null,
                showtip: true,
                tip: "敬请期待",
                iostip: "",
                androidtip: "",
                auto: true,
                display: "inline-block"
            };

            /**合并自定义参数**/
            options = $.extend(defaultOptions, options);

            if (!!options.iostip && DEVICE.isiOS) {
                options.tip = options.iostip;
            } else if (!!options.androidtip && DEVICE.isAndroid) {
                options.tip = options.androidtip;
            }


            var apiurl;
            var hosturl =
                    window.location.protocol + "//" + window.location.host;
            var ztmtag;
            var self = this;
            var callbackPool = [];
            if (typeof options.callback == "function") {
                callbackPool.push(options.callback);
            }

            //通过当前设备判断当前需要显示的按钮
            this.showBtnByDevice = function() {
                if (DEVICE.isiOS) {
                    if (options.iosBtn) {
                        options.iosBtn.css({
                            display: options.display
                        });
                    }
                    if (options.androidBtn) {
                        options.androidBtn.hide();
                    }
                } else if (DEVICE.isAndroid) {
                    if (options.iosBtn) {
                        options.iosBtn.hide();
                    }
                    if (options.androidBtn) {
                        options.androidBtn.css({
                            display: options.display
                        });
                    }
                } else {
                    if (options.iosBtn) {
                        options.iosBtn.css({
                            display: options.display
                        });
                    }
                    if (options.androidBtn) {
                        options.androidBtn.css({
                            display: options.display
                        });
                    }
                }
            };

            //设置按钮的href
            this.setBtnHref = function(btn, link, isfunction, tip,btnType) {
              if(!btnType){
                btnType = 'index';
              }
                if (!tip) {
                    tip = options.tip;
                }
                if (!!btn) {
                    if (!!link) {
                        
                        if (!!isfunction) {
                            btn.attr("target", "_self");
                        }
                        else{
                          btn.attr("href", hosturl+'/download/'+btnType+'.html?ztmtag='+ztmtag);
                        }
                    } else if (options.showtip) {
                        btn.attr("href", 'javascript:alert("' + tip + '")');
                        btn.attr("target", "_self");
                    }
                }
            };

            //设置所有按钮的href
            this.setAllBtn = function(link, isfunction) {
                self.setBtnHref(
                    options.downloadBtn,
                    link,
                    isfunction,
                    options.tip,
                    'index'
                );
                self.setBtnHref(
                    options.iosBtn,
                    link,
                    isfunction,
                    options.iostip,
                    'ios'
                );
                self.setBtnHref(
                    options.androidBtn,
                    link,
                    isfunction,
                    options.androidtip,
                    'android'
                );
            };

            //绑定所有按钮
            this.bindAllBtn = function(event, callback) {
                if (!!options.downloadBtn) {
                    options.downloadBtn.bind("click", callback);
                }
                if (!!options.iosBtn) {
                    options.iosBtn.bind("click", callback);
                }
                if (!!options.androidBtn) {
                    options.androidBtn.bind("click", callback);
                }
                //options.androidBtn.bind('click',callback)
            };

            //初始化函数
            this.init = function() {
                /**显示下载按钮**/
                self.showBtnByDevice();
                /***添加微信提示**/

                //DEVICE.isWeixin = true;

                // if (DEVICE.isWeixin && DEVICE.isAndroid) {
                //     callbackPool.push(function(info) {
                //         self.info = info;
                //         if (options.qrcode && info.qrcode) {
                //             options.qrcode.attr(
                //                 "src",
                //                 "//" +
                //                     window.location.host.replace("act.", "") +
                //                     info.qrcode
                //             );
                //         }
                //     });
                //     self.setAllBtn("javascript:void(0)", true);
                // } else {
                    callbackPool.push(function(info) {
                      if(!info){
                        info = {
                          url:'',
                          ios:'',
                          android:'',
                          qrcode:''
                        }
                      }
                        self.setBtnHref(
                            options.downloadBtn,
                            info.url,
                            info.url.indexOf("javascript:") > -1,
                            options.tip,
                            'index'
                        );
                        self.setBtnHref(
                            options.iosBtn,
                            info.ios,
                            info.ios.indexOf("javascript:") > -1,
                            options.iostip,
                            'ios'
                        );
                        self.setBtnHref(
                            options.androidBtn,
                            info.android,
                            info.android.indexOf("javascript:") > -1,
                            options.androidtip,
                            'android'
                        );

                        if (!!options.qrcode && !!info.qrcode) {
                            options.qrcode.attr(
                                "src",
                                "//" +
                                    window.location.host.replace("act.", "") +
                                    info.qrcode
                            );
                        }
                    });
                // }

                /**获取多渠道下载地址***/
                
                if (hosturl.indexOf("act.") > -1) {
                    hosturl = hosturl.replace("act.", "");
                } else {
                    hosturl = "";
                }
                apiurl = hosturl + "/download/downloadway.json";
                $.ajax({
                    url: apiurl,
                    dataType: "jsonp",
                    jsonpCallback: "download_jsonp_callback",
                    success: function(data) {
                        if (!!data) {
                            self.data = data;
                            for (var i in callbackPool) {
                                if (typeof callbackPool[i] == "function") {
                                    self.getdownloadUrl(callbackPool[i]);
                                }
                            }
                        } else {
                            for (var i in callbackPool) {
                                if (typeof callbackPool[i] == "function") {
                                    callbackPool[i](false);
                                }
                            }
                            console.error("获取多渠道信息失败");
                        }
                    },
                    error:function(){
                      for (var i in callbackPool) {
                          if (typeof callbackPool[i] == "function") {
                            callbackPool[i](false);
                          }
                      }
                    },
                    complete: function(data) {}
                });
            };

            //获取下载地址信息
            this.getdownloadUrl = function(callback) {
                var from = this.getQueryString("ztmtag");
                ztmtag = from;
                if (!from) {
                    from = "giant";
                }
                var data = self.data[from];
                if (!data) {
                    // throw new Error('未能找到该渠道');
                    // callback({status:-1,msg:'未能找到该渠道'});
                    // return false;
                    data = {
                        ios: '',
                        android: '',
                        img: ''
                    };
                }
                var default_data = self.data["giant"];
                if (!!default_data) {
                    if (!data["ios"] && !!default_data["ios"]) {
                        data["ios"] = default_data["ios"];
                    }
                    if (!data["android"] && !!default_data["android"]) {
                        data["android"] = default_data["android"];
                    }
                    if (!data["img"] && !!default_data["img"]) {
                      data["img"] = default_data["img"];
                  }
                }
                var downloadurl = DEVICE.isiOS ? data["ios"] : data["android"];
                var info = {
                    url: downloadurl,
                    qrcode: data["img"],
                    android: data["android"],
                    ios: data["ios"],
                    isWeixin: DEVICE.isWeixin
                };

                if (typeof callback == "function") {
                    callback(info);
                }
                self.info = info;
                return info;
            };
            this.getQueryString = function(name, locationStr) {
                if (!locationStr) {
                    locationStr = "search";
                }
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location[locationStr].substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return '';
            };
            this.init();
        }
        return DownloadWay;
    };
    if (typeof exports === "object") {
        // CommonJS
        module.exports = definFun(require("jquery", "../device/main"));
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery", "../device/main"], definFun);
    } else {
        // Global Variables
        window.DownloadWay = definFun($, DEVICE);
    }
})();
