var apiUrl = "http://gos.ztgame.com/cdn/action.php";
var request = require("request");
var config = require("../config");
async function clearCdn() {
	if (!config.game || !config.actname) {
		console.log("请配置config.json 中的game和actname");
		return;
	}
	let acturl;
	if (config.game == "balls") {
		acturl = `http://act.superpopgames.ztgame.com/${config.actname}`;
	} else {
		acturl = `http://${config.game}.ztgame.com/site/act/${config.actname}`;package
	}
	return await new Promise((resolve, reject) => {
		request.post({ url: apiUrl, formData: { type: 0, content: acturl } }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var res = JSON.parse(body);
				if (res.ret == 0) {
					
					console.log("清除CDN缓存成功");
					resolve(true);
				} else {
					console.log(res.msg);
					resolve(false);
				}
			}
			else{
				console.log("清除CDN缓存失败");
				resolve(false);
			}
		});
	});
}
module.exports = clearCdn;
