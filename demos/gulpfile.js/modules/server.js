const config = require("../config");
const browserSync = require("browser-sync");
const proxy = require("http-proxy-middleware");
var bs;
try {
	bs = browserSync.get("main");
} catch (error) { }
if (!bs) {
	bs = browserSync.create("main");
}
const os = require("os");
const fse = require("fs-extra");
async function setHost() {
	//console.log("为了方便测试,添加 host local.ztgame.com");
	var host = os.platform == "win32" ? "C:/Windows/System32/drivers/etc/hosts" : "/etc/hosts";
	var res = await fse.readFile(host, "utf8");
	if (!!res) {
		if (res.indexOf("local.ztgame.com") == -1) {
			res = res + "\n" + "127.0.0.1 local.ztgame.com ";
			try {
				var res2 = await fse.writeFile(host, res, "utf8");
				return true;

			} catch (error) {
				console.log("建议添加host \n127.0.0.1 local.ztgame.com \n 可在本地测试登录注册等功能，建议手动设置");
				return false;
			}
		} else {
			return false;
		}
	}
	else {
		console.log("127.0.0.1 local.ztgame.com 可在本地测试登录注册等功能，建议手动设置");
		return false;
	}
}


module.exports = {
	reload: bs.reload,
	start: async function () {
		var issetHost = await setHost();
		var proxyArr = [];
		var actGames = ["balls"];
		if (!!config.actname && !!config.game) {
			var devLink;
			// console.log(actGames.indexOf(config.game));
			if (actGames.indexOf(config.game) == -1) {
				devLink = "http://" + config.game + ".web.ztgame.com/act/" + config.actname;
			}
			else {
				devLink = "http://act." + config.game + ".web.ztgame.com/" + config.actname;
			}
			var proxyOptions = {
				target: devLink,
				changeOrigin: true
			};
			proxyArr.push(proxy(["/*.php", "/api/**"], proxyOptions));
			for (var i in config.proxy) {
				if (!config.proxy[i]['path'] || config.proxy[i]['target']) {
					continue;
				}
				proxyArr.push(proxy(config.proxy[i]['path'], {
					target: config.proxy[i]['target']
				}));
			}
		}
		bs.init({
			server: "./dist",
			middleware: proxyArr,
			host: issetHost ? "local.ztgame.com" : "localhost",
			open: "external"
		});
	}
};
