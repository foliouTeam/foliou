var $ = require("jquery");
var Popup = require("../../../packages/foliou/popup");
var popup = new Popup(".popup");

$(".show_btn").click(function() {
	popup.show(".popup2");
});
