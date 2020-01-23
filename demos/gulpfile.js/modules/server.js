const config = require("../config");
const browserSync = require("browser-sync");
const proxy = require("http-proxy-middleware");
var bs;
try {
	bs = browserSync.get("main");
} catch (error) {}
if (!bs) {
	bs = browserSync.create("main");
}
module.exports = {
	reload: bs.reload,
	start: async function() {
		var proxyArr = [];
		if (!!config.actname && !!config.game) {
			var devLink = "http://" + config.game + ".web.ztgame.com/act/" + config.actname;
			var proxyOptions = {
				target: devLink,
				changeOrigin: true
			};
			proxyArr.push(proxy(["*.php", "api/**"], proxyOptions));
		}
		bs.init({
			server: "./dist",
			middleware: proxyArr,
			host: "local.ztgame.com",
			open: "external"
		});
	}
};
