const { series, task } = require("gulp");
const script = require("./modules/script");
const css = require("./modules/css");
const images = require("./modules/images");
const html = require("./modules/html");
const clean = require("./modules/clean");
const publish = require("./modules/publish");
const Watch = require("./modules/watch");
const server = require("./modules/server").start;
const ztgame = require("./modules/ztgame");
const clearcdn = require("./modules/clearcdn");
// console.log(Config.game);
function setTasks() {
	task("pubdev", publish);
	task("cdn",clearcdn)
	task("build", series(clean, html, css, images, script));
	task("dev", series(ztgame, clean, html, css, images, script, Watch, server));
}
setTasks();
exports.default = function () { };
