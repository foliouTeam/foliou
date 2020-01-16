var rollup = require("rollup");
var json = require("rollup-plugin-json");
var postcss = require("rollup-plugin-postcss");
var postimage = require("@rollup/plugin-image");
var posthtml = require("rollup-plugin-posthtml-template");
import commonjs from "rollup-plugin-commonjs";
var fs = require("fs");
var path = require("path");
import Files from "./lib/files";
class Build {
	constructor() {
		this.packageDir = "packages";
		this.assetsType = ["css", "scss", "html", "json", "gif", "png", "jpg", "jpeg", "svg"];
	}
	watch(dirname, callback) {
		var _self = this;
		fs.watch(
			dirname,
			{
				recursive: true
			},
			function(eventType, filename) {
				// console.log("文件发生变化");
				// console.log(eventType);
				// console.log(filename);
				if (!filename || filename.indexOf("_temp") > -1 || filename == "index.js") {
					return;
				}
				_self.createTempFile(dirname);
			}
		);
	}
	createTempFile(assetsDir, cb) {
		var _self = this;
		Files.getFiles(assetsDir)
			.then(function(filelist) {
				var tempfileData = "var assets = {};\n";
				var extname;
				var relname;
				var valname;
				for (var fileIndex in filelist) {
					extname = path.extname(filelist[fileIndex]).replace(".", "");

					relname = path.relative(assetsDir, filelist[fileIndex]);
					valname = relname
						.replace(".", "_")
						.replace("\\", "_")
						.replace("/", "_");
					if (relname != "rullup_temp.js" && _self.assetsType.indexOf(extname) > -1) {
						tempfileData += "import " + valname + ' from "../' + relname.replace("\\", "/") + '";\nassets["' + relname.replace("\\", "/") + '"]=' + valname + ";\n";
					}
				}

				// tempfileData += "export default assets;";
				//console.log(tempfileData);
				try {
					fs.readFile(path.resolve(__dirname, "assetstmp.js"), "utf8", function(err, data) {
						if (err) {
							console.log(err);
							return;
						}
						if (!data) {
							console.error("获取模板文件失败");
							return;
						}
						tempfileData = data.replace("__Assets__", tempfileData);
						Files.exists(null, path.resolve(assetsDir, "./.temp/"), function(src, dtc) {
							var tempfile = path.resolve(assetsDir, "./.temp/rullup_temp.js");
							var outputfile = path.resolve(assetsDir, "./index.js");
							fs.writeFile(tempfile, tempfileData, function(err) {
								if (!!err) {
									console.log(err);
									if (typeof cb == "function") {
										cb(false);
									}
								} else {
									console.log("写入" + tempfile);
									_self.build(tempfile, outputfile, cb);
								}
							});
						});
					});
				} catch (error) {
					console.log(error);
					if (typeof cb == "function") {
						cb(false);
					}
				}
			})
			.catch(function(err) {
				console.log(err);
			});
	}
	async getAssets() {
		var _self = this;
		var packageFolder = path.resolve(__dirname, "../packages/");
		Files.getDirs(packageFolder, function(dirs) {
			dirs.forEach((element, i) => {
				Files.getDirs(element, function(items) {
					items.forEach((item, j) => {
						if (item.indexOf("node_modules") > -1) {
							return true;
						}
						let indexFile = path.resolve(item, "index.js");
						let outFile = path.resolve(__dirname, "../dist/", path.relative(packageFolder, item), "index.js");
						var assetsDir = path.resolve(item, "assets");
						fs.stat(assetsDir, function(err, st) {
							if (!err) {
								if (st.isDirectory()) {
									// console.log(assetsDir + "有资源");
									_self.watch(assetsDir);
									_self.createTempFile(assetsDir, function() {
										// console.log('临时资源');
										// _self.build(indexFile, outFile);
									});
								}
							} else {
								//console.log(err);
								//console.log('没有资源');
								//_self.build(, , cb);
								// _self.build(indexFile, outFile);
							}
						});
					});
				});
			});
		});
	}
	async build(input, output, cb) {
		const bundle = await rollup.rollup({
			input: input,
			plugins: [
				// commonjs({
				// 	exclude: "node_modules/**"
				// }),
				postimage(),
				json(),
				postcss({
					inject: false
				}),
				posthtml({
					include: "../**/*.{html,sgr}"
				})
			]
		});
		var format = input.indexOf(".temp") > -1 ? "cjs" : "umd";
		var outputOptions = {
			file: output,
			name: "index",
			format: format
		};
		const { code, map } = await bundle.generate(outputOptions);
		// or write the bundle to disk
		await bundle.write(outputOptions);
		if (typeof cb == "function") {
			await cb(true);
		}
	}
}
var build = new Build();
build.getAssets();
