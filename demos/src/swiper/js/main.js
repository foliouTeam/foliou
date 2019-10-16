var $ = require("jquery");
var Swiper = require("../../../../packages/foliou/swiper");

$('body').test();
$(function(){
    new Swiper($(".swiper-container"),{
        dock_wrap:$(".dock_wrap"),
        mode:'classname'
    });
    
});