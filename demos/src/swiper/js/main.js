var $ = require("jquery");
var Swiper = require("../../../../packages/foliou/swiper");
$(function(){
    new Swiper($(".swiper-container"),{
        dock_wrap:$(".dock_wrap")
    });
});