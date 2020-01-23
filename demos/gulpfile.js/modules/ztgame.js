const os = require("os");
var host = os.platform == "win32" ? "C:/Windows/System32/drivers/etc/hosts" : "/etc/hosts";
const fse = require("fs-extra");
async function ztgame(cb) {
	console.log("为了方便测试,添加 host local.ztgame.com");
	var res = await fse.readFile(host, "utf8", (err, res) => {
		if (!err) {
			if (res.indexOf("local.ztgame.com") == -1) {
				res = res + "\n" + "127.0.0.1 local.ztgame.com ";
				fse.writeFile(host, res, "utf8", (err, res) => {
					if (!err) {
						console.log("写成功");
						cb();
					}
				});
			} else {
				console.log("已设置本地host");
				cb();
			}
		}
		else {
			console.log(err);
			console.log("设置失败");
			cb();
		}
	});
}

module.exports = ztgame;
