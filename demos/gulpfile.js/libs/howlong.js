function howLong(time) {
	let milliseconds = new Date().getTime() - time;
	let timeSpanStr;
	var dateTime = new Date(time);
	var year = dateTime.getFullYear();
	var month = dateTime.getMonth() + 1;
	var day = dateTime.getDate();
	var hour = dateTime.getHours();
	var minute = dateTime.getMinutes();
	var second = dateTime.getSeconds();
	var now = new Date();
	if (milliseconds <= 1000 * 60 * 1) {
		timeSpanStr = "刚刚";
	} else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
		timeSpanStr = Math.round(milliseconds / (1000 * 60)) + "分钟前";
	} else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
		timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + "小时前";
	} else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
		timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + "天前";
	} else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
		timeSpanStr = month + "-" + day + " " + hour + ":" + minute;
	} else {
		timeSpanStr = year + "-" + month + "-" + day + " " + hour + ":" + minute;
	}
	return timeSpanStr;
}
module.exports = howLong;
