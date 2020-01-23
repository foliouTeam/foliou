//打包 打包scss,less
const config = require("../config");
const { src, dest } = require("gulp");
const less = require("gulp-less");
const sass = require("gulp-sass");
const gulpif = require("gulp-if");
const stylus = require("gulp-stylus");
const autoprefixer = require("gulp-autoprefixer");
const merge = require("merge-stream");
const reload = require("./server").reload;
const replace = require("gulp-replace");
async function css() {
	let imgreplace = function() {
		return replace(/url\((\S+)\)/gi, function(...param) {
			// param.splice(param.length - 2, 2);
			// param.splice(0, 1);
			let version = new Date().getTime();
			if (!!param[1] && param[1].indexOf("?") == -1) {
				param[0] = param[0].replace(param[1], param[1] + "?v=" + version);
			}
			return param[0];
		});
	};
	var scssTask = src([`${config.src}**/*.{scss,sass,less}`, `!${config.src}lib/**/*.{scss,sass,less}`])
		.pipe(
			gulpif(
				function(file) {
					return file.extname == ".less";
				},
				less(),
				sass()
			)
		)
		.pipe(imgreplace())
		.pipe(
			autoprefixer({
				cascade: true
			})
		)
		.pipe(dest(config.dist))
		.pipe(reload({ stream: true }));
	var stylusTask = src([`${config.src}**/*.{styl,stylus}`, `!${config.src}lib/**/*.{styl,stylus}`])
		.pipe(stylus())
		.pipe(imgreplace())
		.pipe(
			autoprefixer({
				cascade: true
			})
		)
		.pipe(dest(config.dist))
		.pipe(reload({ stream: true }));
	return merge(scssTask, stylusTask);
}

module.exports = css;
