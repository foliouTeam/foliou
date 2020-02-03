var rollup = require("rollup");
var json = require("rollup-plugin-json");
var postcss = require("rollup-plugin-postcss");
var postimage = require("@rollup/plugin-image");
var posthtml = require("rollup-plugin-posthtml-template");

import minify from 'rollup-plugin-babel-minify';
var fs = require("fs-extra");
var path = require("path");
import Files from "./lib/files";
class Build {
	constructor() {
		this.packageDir = "packages";
		this.external = ['jquery'];
		this.globals = { "jquery": '$' }
		this.assetsType = ["css", "scss", "html", "json", "gif", "png", "jpg", "jpeg", "svg"];
		this.clock = [];
		this.start();
	}
	async clear() {
		var distDidr = path.resolve(__dirname, '../dist');
		await fs.emptyDir(distDidr);
		console.log("清理完成");
	}
	async start() {
		await this.clear();
		let pluginsList = await this.getPlugins();
		for (var i in pluginsList) {
			let name = this.getPluginName(pluginsList[i]);
			let pluginPath = "../" + name + "index.js";
			this.external.push(pluginPath);
			this.globals[pluginPath] = name;
		}
		for (var i in pluginsList) {
			await this.buildPlugin(pluginsList[i]);
			await this.watchPlugin(pluginsList[i]);
		}
		console.log("---打包成功---");
	}
	getPluginName(pluginDir) {
		let arr = pluginDir.split(path.sep);
		let name = arr[arr.length - 1];
		return name;
	}
	watch(dirname, callback) {
		//监听目录变化
		// var _self = this;
		// console.log('watch', dirname);

		fs.watch(
			dirname,
			{
				recursive: true
			},
			(eventType, filename) => {
				// console.log(eventType, filename);

				if (!!callback) {
					if (!!this.clock[filename]) {
						clearTimeout(this.clock[filename]);
						this.clock[filename] = null;
					}
					this.clock[filename] = setTimeout(() => {
						callback(filename);
					}, 200);
				}
			}
		);

	}
	async createAssetsFile(pluginDir) {
		//生成资源文件js
		var assetsDir = path.resolve(pluginDir, './assets/');
		let stat = await fs.stat(pluginDir);
		if (!stat.isDirectory()) {
			console.error("组件" + pluginDir + "不存在");
			return false;
		}
		try {
			let assetStat = await fs.stat(assetsDir);
		}
		catch (err) {
			return true;
		}
		let filelist = await Files.getFiles(assetsDir);
		var tempfileData = "var assets = {};\n";
		for (var fileIndex in filelist) {
			let extname = path.extname(filelist[fileIndex]).replace(".", "");
			let relname = path.relative(assetsDir, filelist[fileIndex]);
			let valname = relname
				.replace(".", "_")
				.replace("\\", "_")
				.replace("/", "_");
			if (relname != "rullup_temp.js" && this.assetsType.indexOf(extname) > -1) {
				tempfileData += "import " + valname + ' from "../' + relname.replace("\\", "/") + '";\nassets["' + relname.replace("\\", "/") + '"]=' + valname + ";\n";
			}
		}
		try {
			var tplContent = await fs.readFile(path.resolve(__dirname, "assetstpl.js"), "utf8");
			if (!!tplContent) {
				tempfileData = tplContent.replace("__Assets__", tempfileData);

				var tempfile = path.resolve(assetsDir, "./.temp/rullup_temp.js");
				await Files.createDir(tempfile);
				var err = await fs.writeFile(tempfile, tempfileData);
				if (!err) {
					var outputfile = path.resolve(assetsDir, "./index.js");
					var res = await this.build(tempfile, outputfile, "assets", 'esm');
					console.log("组件" + pluginDir + "资源打包成功");
					return res;
				}
				else {
					console.error("写入文件" + tempfile + "失败");
					return false;
				}
			}
			else {
				console.error("获取资源文件模板内容为空");
				return false;
			}

		} catch (error) {
			//console.log(error);
			console.error('获取资源文件模板失败');
			return false;
		}
	}
	async getPlugins() {
		var packageFolder = path.resolve(__dirname, "../packages/");
		var packageList = await Files.getDirs(packageFolder);
		var pluginsList = [];
		for (var i in packageList) {
			if (packageList[i].indexOf('node_modules') > -1) {
				continue;
			}
			let plugins = await Files.getDirs(packageList[i]);
			for (var j in plugins) {
				let pluginPath = path.resolve(packageList[i], plugins[j]);
				if (pluginPath.indexOf('node_modules') > -1) {
					continue;
				}
				pluginsList.push(pluginPath);
			}
		}
		return pluginsList;
	}
	async buildPlugin(pluginDir) {
		var res = await this.createAssetsFile(pluginDir);
		if (!!res) {
			let packageFolder = path.resolve(__dirname, "../packages/");
			let mainFile = path.resolve(pluginDir, './index.js');
			let arr = pluginDir.split(path.sep);
			let name = arr[arr.length - 1];
			let outFile = path.resolve(__dirname, "../dist/", path.relative(packageFolder, pluginDir), "index.js");
			res = await this.build(mainFile, outFile, name, "umd");
			let demosDist = path.resolve(__dirname, "../demos/src/libs/", path.relative(packageFolder, pluginDir), "index.js");
			await fs.copy(outFile, demosDist);
			console.log("组件" + pluginDir + '打包成功');
		}
		return res;
	}
	watchPlugin(pluginDir) {
		//console.log('watchplugins' + pluginDir);
		this.watch(pluginDir, (filename) => {
			//console.log(filename);
			if (!filename || filename.indexOf("_temp") > -1 || filename == "assets" + path.sep + "index.js") {
				return;
			}
			this.buildPlugin(pluginDir);
		})
	}

	async build(input, output, name, format) {
		try {
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
					}),
					minify()
				],
				external: this.external
			});
			if (!format) {
				format = input.indexOf(".temp") > -1 ? "esm" : "umd";
			}
			var outputOptions = {
				file: output,
				name: name,
				globals: this.globals,
				format: format
			};
			var res = await bundle.write(outputOptions);
			if (!res) {
				console.log("写入文件" + output + "失败");
				//console.error(err);
			}
			return !!res;
		}
		catch (err) {
			console.error("构建文件" + input + "失败");
			//console.error(err)
			return false;
		}
	}
}
var build = new Build();
// build.getAssets();
