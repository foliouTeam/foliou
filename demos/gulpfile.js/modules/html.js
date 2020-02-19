const config = require("../config");
const { src, dest } = require("gulp");
const htmlmin = require("gulp-htmlmin");
const path = require("path");
const replace = require("gulp-replace");
const reload = require("./server").reload;
const Util = require("../libs/util.js");
const css = require("./css");
const script = require("./script");
const Cache = require("../libs/cache");
const { series, task } = require("gulp");
const merge = require("merge-stream");
function html() {
	global.entries = [];
	global.cssFiles = [];
	var tasks = [];
	let htmltask = src(`${config.src}**/*.{html,shtml}`)
		.pipe(
			htmlmin({
				collapseWhitespace: true
			})
		)
		.pipe(
			replace(/<([^\s'"<>\/a]+)[^<>]*?(src|href)=['|"]([^'"]+)['|"][^<>]*?>/gi, function (...param) {
				let sourceUrl = param[3];
				if (!Util.isRelativeUrl(sourceUrl)) {
					return param[0];
				}
				let curHtmlDir = path.dirname(this.file.relative);
				let filePath = path.join(curHtmlDir, sourceUrl).replace(/\\/g, "/");
				filePath = Util.getEntry(filePath);
				filePath = Util.getStyles(filePath);
				sourceUrl = Util.toVersionUrl(sourceUrl);
				sourceUrl = Util.addVersion(sourceUrl);
				return param[0].replace(param[3], sourceUrl);
			})
		)
		.pipe(dest(config.dist))
		.pipe(reload({ stream: true }));
	return htmltask;
}
module.exports = html;
