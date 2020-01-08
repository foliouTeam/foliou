var assets = {};
__Assets__;
function relativeDir(dir1, dir2) {
	var dir1Arr = dir1.split("/");
	var dir2Arr = dir2.split("/");
	if (dir1Arr[dir1Arr.length - 1].indexOf(".") > -1) {
		dir1Arr.pop();
	}
	for (var i in dir2Arr) {
		if (dir2Arr[i] == ".") {
			continue;
		} else if (dir2Arr[i] == "..") {
			dir1Arr.pop();
		} else {
			dir1Arr.push(dir2Arr[i]);
		}
	}
	return dir1Arr.join("/");
}
for (var i in assets) {
	let format = i.split(".")[1];
	if (!format) {
		continue;
	}
	if (format == "scss" || format == "css" || format == "html") {
		let reg = /url\((.+)\)/gi;
		let urlArr = assets[i].match(reg);
		for (var j in urlArr) {
			let imgurl = urlArr[j].replace("url(", "").replace(")", "");
			if (imgurl.indexOf("//") > -1) {
				continue;
			}
			let relativedir = relativeDir(i, imgurl);
			if (!!assets[relativedir]) {
				assets[i] = assets[i].replace(urlArr[j], "url(" + assets[relativedir] + ")");
			}
		}
		if (format == "html") {
			reg = /src=(\'|\")([^="']+)(\'|\")/gi;
			urlArr = assets[i].match(reg);
			for (var j in urlArr) {
				var yinhao = urlArr[j].indexOf("'") > -1 ? "'" : '"';
				let imgurl = urlArr[j].replace("src=", "").replace(/"|'/g, "");
				if (imgurl.indexOf("//") > -1) {
					continue;
				}
				let relativedir = relativeDir(i, imgurl);
				if (!!assets[relativedir]) {
					assets[i] = assets[i].replace(urlArr[j], "src=" + yinhao + assets[relativedir] + yinhao);
				}
			}
		} else {
			styleInject(assets[i]);
		}
	}
}

function styleInject(css, insertAt) {
	if (!css || typeof document === "undefined") return;

	const head = document.head || document.getElementsByTagName("head")[0];
	const style = document.createElement("style");
	style.type = "text/css";

	if (insertAt === "top") {
		if (head.firstChild) {
			head.insertBefore(style, head.firstChild);
		} else {
			head.appendChild(style);
		}
	} else {
		head.appendChild(style);
	}

	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
}

export default assets;
