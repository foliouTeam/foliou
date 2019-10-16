var $ = require("jquery");

var animate = require("../../../../packages/foliou/animate");

$(function(){
    animate.plugin($);
    $(".swiper-slide").transform({
        width:100
    },1000,'ease-in-out',function(){
        alert('end');
    });
});