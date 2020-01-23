const gulpwatch = require("gulp").watch;
const config = require("../config");
const script = require("./script");
const css = require("./css");
const images = require("./images");
const html = require("./html");
async function watch() {
	gulpwatch(config.src + "**/*.{js,ts}", script);
	gulpwatch(config.src + "**/*.{shtml,html}", html);
	gulpwatch(config.src + "**/*.{css,scss,less}", css);
	gulpwatch(config.src + "**/*.{png,jpg,gif,ico,svg}", images);
}
module.exports = watch;
