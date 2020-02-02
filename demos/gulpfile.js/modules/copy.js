const config = require("../config");
const { src, dest } = require("gulp");
const reload = require("./server").reload;
async function copy() {
    return src(`${config.src}/libs/**/*.*`)
        .pipe(dest(`${config.dist}/libs`))
        .pipe(reload({ stream: true }));
}
module.exports = copy;