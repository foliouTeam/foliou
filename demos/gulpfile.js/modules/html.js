const config = require("../config");
const { src, dest, watch } = require("gulp");
const htmlmin = require("gulp-htmlmin");

const replace = require("gulp-replace");
const reload = require("./server").reload;
async function html() {
	return src(`${config.src}**/*.{html,shtml}`)
		.pipe(
			htmlmin({
				collapseWhitespace: true
			})
		)
		.pipe(
			replace(/(src|href)=('|")(\S+)('|")/gi, function (...param) {
				if (param[1] == "href" && param[3].indexOf(".") == -1) {

					return param[0];
				}
				let realurl = param[3];
				let version = new Date().getTime();
				if (realurl == "./js/main.js" || realurl == "./js/main.ts") {
					realurl = "./js/bundle.js";
				}
				else {
					let cssfiles = ['.sass', '.scss', '.less', '.styl', '.stylus', '.sass']
					for (var i in cssfiles) {

						if (realurl.indexOf(cssfiles[i]) > -1) {
							realurl = realurl.replace(cssfiles[i], '.css');
							break;
						}
					}
				}

				let imgurl = param[0];
				if (param[3].indexOf("?") == -1) {
					imgurl = imgurl.replace(param[3], realurl + "?v=" + version);
				}

				return imgurl;
			})
		)
		.pipe(dest(config.dist))
		.pipe(reload({ stream: true }));
}
module.exports = html;
