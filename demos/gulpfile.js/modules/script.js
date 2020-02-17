//打包 main.js /main.ts文件
const config = require("../config");
const { dest } = require("gulp");
const browserify = require("browserify");
const fse = require("fs-extra");
const argv = require("yargs").argv;
const babelify = require("babelify");
const tsify = require("tsify");
const rename = require("gulp-rename");
const reload = require("./server").reload;
//console.log(browserSync);
// browserSync.reload();
var DEBUG = argv._ == "dev";
function script() {
	//以 js/main.js 或 js/main.ts为入口打包 js文件
	let entry = config.src + "/js/main.ts";
	let stat = fse.existsSync(entry);
	if (!stat) {
		entry = config.src + "/js/main.js";
	}
	return browserify({
		entries: [entry],
		debug: DEBUG
	})
		.plugin(tsify) //添加对typescript的支持
		.transform(babelify, {
			//此处babel的各配置项格式与.babelrc文件相同
			presets: [
				"@babel/preset-env" //转换es6代码
			],
			plugins: [
				[
					"@babel/plugin-transform-runtime",
					{
						corejs: 2
					}
				]
			]
		})
		.bundle() //合并打包
		.pipe(rename({ extname: '.js' }))
		.pipe(dest(config.dist + "js/"))
		.pipe(reload({ stream: true }));
}

module.exports = script;
