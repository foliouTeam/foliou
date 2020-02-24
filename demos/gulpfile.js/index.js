const config = require("./config");
global.pkgFiles = {
	'js': [".js", ".ts"],
	'css': ['.less', '.styl', '.stylus'],
	'img': ['.png', '.jpg', '.gif', '.ico', '.svg'],
	'html': ['.html', '.shtml']
}

var copyglob = [`${config.src}**/*.*`];
var pkgglob = `!${config.src}**/*.{`;
for (var i in global.pkgFiles) {
	for (var j in global.pkgFiles[i]) {
		if (global.pkgFiles[i][j] == '.js') {
			continue;
		}
		pkgglob += global.pkgFiles[i][j].replace('.', '') + ',';
	}
}
pkgglob += '}';
copyglob.push(pkgglob);

global.copyglob = copyglob;
const { series, task } = require("gulp");
const script = require("./modules/script");
const css = require("./modules/css");
const images = require("./modules/images");
const html = require("./modules/html");
const clean = require("./modules/clean");
const publish = require("./modules/publish");
const Watch = require("./modules/watch");
const server = require("./modules/server").start;
const clearcdn = require("./modules/clearcdn");
const copy = require("./modules/copy");
const cleanCache = require("./modules/clean-cache");
function setTasks() {
	task("clean", cleanCache);
	task("pubdev", publish);
	task("cdn", clearcdn)
	task("build", series(clean, html, css, script, images, copy));
	task("dev", series(clean, html, css, script, images, copy, Watch, server));
}
setTasks();
exports.default = function () { };
