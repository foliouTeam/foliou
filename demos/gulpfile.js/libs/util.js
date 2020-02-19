const path = require("path");
const fs = require("fs-extra");
const config = require("../config");
var Util = {
    isRelativeUrl: function (url) {
        if (url.indexOf('//') > -1) {
            return false;
        }
        return true;
    },
    isEntrySync: function (file) {
        // console.log(file);
        try {
            let content = fs.readFileSync(file, 'utf8');
            // console.log(content);
            if (!!content) {
                let requireReg = new RegExp(/([^a-z0-9-_]?require\()|(import\s+(.+?)\s+from\s+(.+))/igs);
                let definReg = new RegExp(/[^a-z0-9-_]?define\(/);
                var hasDefine = content.search(definReg) > -1;
                var hasRequire = content.search(requireReg) > -1;
                // console.log(res);
                // console.log(hasRequire);
                return !hasDefine && hasRequire;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    getEntry: function (filePath) {
        var jsExts = global.pkgFiles['js'];
        let extname = path.extname(filePath);
        if (jsExts.indexOf(extname) == -1) {
            return filePath;
        }
        var allPath = config.src + filePath;

        global.entries.push(filePath);
        filePath = filePath.replace(extname, '.js');
        return filePath;
    },
    getStyles: function (filePath) {
        var cssExts = global.pkgFiles['css'];
        let extname = path.extname(filePath);
        if (cssExts.indexOf(extname) == -1) {
            return filePath;
        }
        //var allPath = config.src + filePath;
        global.cssFiles.push(filePath);
        filePath = filePath.replace(extname, ".css");
        return filePath;
    },
    addVersion(sourceUrl) {
        var extname = path.extname(sourceUrl);
        if (global.pkgFiles['js'].indexOf(extname) > -1) {
            sourceUrl = sourceUrl.replace(extname, '.js');
        }
        else if (global.pkgFiles['css'].indexOf(extname) > -1) {
            sourceUrl = sourceUrl.replace(extname, '.css');
        }
        let version = new Date().getTime();
        if (sourceUrl.indexOf("?") == -1) {
            sourceUrl = sourceUrl + "?v=" + version;
        }
        return sourceUrl;
    },
    toVersionUrl: function (url) {
        if (!config.version) {
            return url;
        }
        var urlArr = url.split('/');
        var dirname = '';
        if (urlArr[0].indexOf('.') > -1) {
            dirname = urlArr.splice(0, 1) + '/';

            url = urlArr.join('/');
        }
        var mobileDir;
        if (!!config.mobileDir) {
            mobileDir = config.mobileDir;
        }
        else {
            mobileDir = ['m', 'mobile'];
        }
        var mobileStr = mobileDir.join('|');
        var regStr = '^(?:(?:(?:' + mobileStr + ')\/)?(images|css|js))(\/\\S*)?$';
        var urlReg = new RegExp(regStr);
        var matchs = url.match(urlReg);
        if (!!matchs && !!matchs[1]) {
            url = url.replace(matchs[1], matchs[1] + '/' + config.version);
        }
        return dirname + url;
    }
}
module.exports = Util;
