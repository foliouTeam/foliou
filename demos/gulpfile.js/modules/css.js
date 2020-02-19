const config = require("../config");
const { src, dest } = require("gulp");
const less = require("gulp-less");
const stylus = require("gulp-stylus");
const autoprefixer = require("gulp-autoprefixer");
const merge = require("merge-stream");
const reload = require("./server").reload;
const replace = require("gulp-replace");
const path = require("path");
const fs = require("fs-extra");
const cleanCSS = require('gulp-clean-css');
const Utli = require("../libs/util");
function css(cb) {
	let imgreplace = function () {
		return replace(/url\((\S+?)\)/gi, function (...param) {
			let version = new Date().getTime();
			if (!!param[1] && param[1].indexOf("?") == -1) {
				param[0] = param[0].replace(param[1], param[1] + "?v=" + version);
			}
			return param[0];
		});
	};
	
	let cssTasks = [];
	for (var i in global.cssFiles) {
		let cssFile = `${config.src}${global.cssFiles[i]}`;
		try {
			fs.statSync(cssFile);
		} catch (error) {
			console.log("文件" + cssFile + "不存在");
			continue;
		}
		let dirname = path.dirname(global.cssFiles[i]);
		let extname = path.extname(global.cssFiles[i]);
		cssTasks[i] = src(cssFile)
			.pipe(
				extname != '.less' ?
					stylus() :
					less()
			)
			.pipe(imgreplace())
			.pipe(
				autoprefixer({
					cascade: true
				})
			)
			.pipe(cleanCSS({ compatibility: 'ie8' }))
			.pipe(dest(config.dist + Utli.toVersionUrl(dirname)))
			.pipe(reload({ stream: true }));
	}
	if (cssTasks.length == 0) {
		cb();
		return false;
	}
	return merge(...cssTasks);
}

module.exports = css;
