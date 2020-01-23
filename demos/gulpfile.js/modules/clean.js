const config = require("../config");
const fse = require("fs-extra");
async function Clean() {
	await fse.emptyDir(config.dist);
}
module.exports = Clean;
