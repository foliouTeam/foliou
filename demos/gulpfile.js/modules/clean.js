const config = require("../config");
const fse = require("fs-extra");
async function Clean() {
	try {
		await fse.emptyDir(config.dist);
		console.log('清空目录成功');
		return true;
	} catch (error) {
		console.log('清空目录失败');
		return false;
	}
}
module.exports = Clean;
