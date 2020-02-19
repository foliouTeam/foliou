const gulpwatch = require("gulp").watch;
const config = require("../config");
const script = require("./script");
const css = require("./css");
const images = require("./images");
const html = require("./html");
const copy = require("./copy");
const { series, task } = require("gulp");
async function watch() {
	
	gulpwatch(config.src + "**/*.{js,ts}", script);
	gulpwatch(config.src + "**/*.{shtml,html}", series(html, css, script));
	gulpwatch(config.src + "**/*.{less, styl, stylus}", css);
	gulpwatch(config.src + "**/*.{png,jpg,gif,ico,svg}", images);
	gulpwatch(config.src + "**/*.*", copy)
}
module.exports = watch;
