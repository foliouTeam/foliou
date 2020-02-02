var css = ".swiper-slide {\n  position: relative;\n  width: 100%;\n  top: 0;\n  left: 0;\n  overflow: hidden;\n  width: 100%;\n  height: 100%; }\n\n.swiper-wrapper {\n  position: relative;\n  overflow: visible;\n  width: 100%;\n  height: 100%; }\n\n.swiper-container {\n  position: relative;\n  overflow: hidden; }\n\n.swiper-pagination {\n  position: absolute;\n  width: 100%;\n  bottom: 10px;\n  text-align: center;\n  z-index: 100; }\n\n.swiper-pagination span {\n  display: inline-block;\n  width: 12px;\n  height: 12px;\n  border-radius: 6px;\n  background: #000;\n  opacity: 0.5;\n  margin: 0 5px; }\n\n.swiper-pagination span.active {\n  background: #4390ee;\n  opacity: 1; }\n";

var assets = {};
var assets = {};
assets["main.scss"]=css;
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
	var format = i.split(".")[1];
	if (!format) {
		continue;
	}
	if (format == "scss" || format == "css" || format == "html") {
		var reg = /url\((.+)\)/gi;
		var urlArr = assets[i].match(reg);
		for (var j in urlArr) {
			var imgurl = urlArr[j].replace("url(", "").replace(")", "");
			if (imgurl.indexOf("//") > -1) {
				continue;
			}
			var relativedir = relativeDir(i, imgurl);
			if (!!assets[relativedir]) {
				assets[i] = assets[i].replace(urlArr[j], "url(" + assets[relativedir] + ")");
			}
		}
		if (format == "html") {
			reg = /src=(\'|\")([^="']+)(\'|\")/gi;
			urlArr = assets[i].match(reg);
			for (var j in urlArr) {
				var yinhao = urlArr[j].indexOf("'") > -1 ? "'" : '"';
				var imgurl = urlArr[j].replace("src=", "").replace(/"|'/g, "");
				if (imgurl.indexOf("//") > -1) {
					continue;
				}
				var relativedir = relativeDir(i, imgurl);
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

var assets$1 = assets;

export default assets$1;
