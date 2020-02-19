//打包 打包images
const config = require("../config");
const fse = require("fs-extra");
const tinypng = require("tinypngjs");
const { src } = require("gulp");
const through = require("through2");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const cachePath = path.resolve(__dirname, "../cache");
const Utli = require("../libs/util");
if (!fse.existsSync(cachePath)) {
	fse.mkdirSync(cachePath);
}
const adapter = new FileSync(path.resolve(__dirname, "../cache/db.json"));
const db = low(adapter);
db.defaults({ images: [] }).write();
const reload = require("./server").reload;
// const readline = require("readline");
const ProgressBar = require("../libs/progress");
var progressBar = new ProgressBar();
function images(cb2) {
	let total = 0;
	let loaded = 0;
	src(`${config.src}**/*.{png,jpg,gif,ico,svg}`).pipe(
		through.obj(function (file, enc, cb) {
			cb();
			total++;
			let outPath = path.resolve(file.base, "../", config.dist, path.dirname(Utli.toVersionUrl(file.relative)), path.basename(file.relative));
			function checkLoaded() {
				function isEnd() {
					loaded++;
					progressBar.render({
						description: "图片压缩",
						completed: loaded,
						total: total
					});
					// console.log(parseInt(loaded / total * 100));
					if (loaded >= total) {
						reload();
						cb2();
					}
				}
				fse.copy(file.path, outPath)
					.then(res => {
						isEnd();
					})
					.catch(() => {
						isEnd();
					});
			}
			var stat = fse.statSync(file.path);
			var compressed = db
				.get("images")
				.find({ file: file.path })
				.value();
			if (!stat || !stat.mtimeMs || !compressed || compressed.mtimeMs != stat.mtimeMs) {
				tinypng
					.compressImg(file.path, file.path)
					.then(res => {
						if (!!res) {
							stat = fse.statSync(file.path);
							if (!compressed) {
								db.get("images")
									.push({ file: file.path, mtimeMs: stat.mtimeMs || "" })
									.write();
							} else {
								db.get("images")
									.find({ file: file.path })
									.assign({ mtimeMs: stat.mtimeMs || "" })
									.write();
							}
						}
						checkLoaded();
					})
					.catch(err => {
						checkLoaded();
					});
			} else {
				checkLoaded();
			}
		})
	);
	setTimeout(function () {
		if (total == 0) {
			cb2();
		}
	}, 1000);
}
module.exports = images;
