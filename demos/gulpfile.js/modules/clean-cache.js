const config = require("../config");
const fse = require("fs-extra");
const path = require("path");
async function CleanCache() {
    try {
        await fse.emptyDir(path.resolve(__dirname, '../cache'));
        console.log('清空缓存成功');
        return true;
    } catch (error) {
        console.log(error);
        console.log('清空缓存失败');
        return false;
    }
}
module.exports = CleanCache;