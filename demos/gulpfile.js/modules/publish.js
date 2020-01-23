const fse = require("fs-extra");
const config = require("../config");
const devpath = "\\\\192.168.21.27\\";
const serverList = ["common", "w1", "w2"];
const readlineSync = require("readline-sync");
const howLong = require("../libs/howlong");
async function PublishDev() {
	if (!config.game || !config.actname) {
		console.log("请配置config.json 中的game和actname");
		return;
	}
	let gameDevPath;
	let gamepathisexist;
	for (var i in serverList) {
		gameDevPath = devpath + serverList[i] + "\\" + config.game;

		gamepathisexist = fse.existsSync(gameDevPath);
		if (!!gamepathisexist) {
			break;
		}
	}
	if (!gamepathisexist) {
		console.log("测试服务器上没有对应游戏的目录,请查看config.json中");
		return;
	}
	var actDevPaths = [gameDevPath + "\\act\\", gameDevPath + "\\site\\act\\"];
	let actDevpath;
	for (var i in actDevPaths) {
		let actExist = fse.existsSync(actDevPaths[i]);
		if (!!actExist) {
			actDevpath = actDevPaths[i];
			break;
		}
	}
	if (!actDevpath) {
		console.log("act目录不存在，请检查测试服");
		return;
	}
	let actpath = actDevpath + config.actname;

	actExist = fse.existsSync(actpath);
	var copy = async function() {
		try {
			var res = await fse.copy(config.dist, actpath);

			if (!res) {
				console.log("复制成功");
				let open = require("open");
				let acturl;
				if (config.game != "balls") {
					acturl = `http://${config.game}.web.ztgame.com/site/act/${config.actname}`;
				} else {
					acturl = `http://act.${config.game}.web.ztgame.com/${config.actname}`;
				}
				open(acturl);
			}
		} catch (error) {
			console.log(error);
		}
	};
	if (!fse.existsSync(actpath)) {
		console.log("活动目录" + actpath + "不存在，是否创建");
		let answer = readlineSync.keyInYN();
		
		if (answer) {
			fse.mkdirSync(actpath);
			await copy();
			return true;
		} else {
			return false;
		}
	} else {
		let stat = await fse.stat(actpath);
		if (!!stat && !!stat.mtime) {
			let howlongtime = howLong(stat.mtime);
			console.log(howlongtime + "更新过，需要覆盖吗？");
			let answer = readlineSync.keyInYN();
			if (answer) {
				await copy();
				return true;
			} else {
				return false;
			}
		} else {
			console.log("无法获取服务器文件信息，请检查文件" + actpath);
			return false;
		}
	}
}

async function publishGit() {
	//检测当前git库
}
module.exports = PublishDev;
