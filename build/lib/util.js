const { exec } = require("child_process");
const iconv = require("iconv-lite");
const path = require("path");
var platform = process.platform;
if (platform == "win32") {
    platform = "win";
}
if (platform == "darwin") {
    platform = "mac";
}

function runSh(sh, callback) {
    const child = exec(sh, {
        cwd: process.cwd(),
        windowsHide: false,
        encoding: "buffer"
    });

    child.stdout.on("data", data => {
        data = iconv.decode(data, "utf8");
        callback("data", data);
    });
    child.stderr.on("data", data => {
        data = iconv.decode(data, "utf8");
        callback("data", data);
    });
    child.stdout.on("error", data => {
        data = iconv.decode(data, "utf8");
        callback("data", data);
    });
    child.stderr.on("error", data => {
        data = iconv.decode(data, "utf8");
        callback("data", data);
    });
    return child;
}

const canshu = {};
var argvs = process.argv.splice(2);
var lastindex;
for (var i = 0; i < argvs.length; i++) {
    var res = {};
    if (argvs[i].indexOf("-") == 0) {
        lastindex = clearH(argvs[i]);
        canshu[lastindex] = true;
    } else {
        canshu[lastindex] = argvs[i];
    }
}
function clearH(str) {
    if (str.indexOf("-") == 0) {
        str = str.replace("-", "");
        if (str.indexOf("-") == 0) {
            str = clearH(str);
        }
    }
    return str;
}

module.exports = {
    runSh,
    platform,
    canshu
};
