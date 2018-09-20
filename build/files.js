var fs = require('fs');
var stat = fs.stat;
var path = require("path");
class Files {
    static copy(src, dst) {
        var _self = this;
        fs.readdir(src, function (err, paths) {
            if (err) {
                throw err;
            }
            paths.forEach(function (path) {
                var _src = src + '/' + path;
                var _dst = dst + '/' + path;
                var readable;
                var writable;
                fs.stat(_src, function (err, st) {
                    if (err) {
                        throw err;
                    }

                    if (st.isFile()) {
                        readable = fs.createReadStream(_src);//创建读取流
                        writable = fs.createWriteStream(_dst);//创建写入流
                        readable.pipe(writable);
                    } else if (st.isDirectory()) {
                        Files.exists(_src, _dst, Files.copy);
                    }
                });
            });
        });
    }
    static getDirs(src, callback) {
        fs.readdir(src, function (err, paths) {
            var filestlist = new Array();
            var i = 0;
            paths.forEach(function (path,j) {
                var _src = src + '/' + path;
                var readable;
                var writable;
                fs.stat(_src, function (err, st) {
                    if (err) {
                        return;
                    }
                    if (st.isDirectory()) {

                        filestlist.push(_src);
                    }
                    if(j==paths.length-1){
                        callback(filestlist);
                    }
                });
            });
            if(paths.length==0){
                callback(filestlist);
            }
        });
        // return filestlist;
    }
    static travelSync(dir) {
        var pool = new Map();
        var files = [];
        function travel(dir, finish) {
            pool.set(dir, 1);
            try {
                fs.readdir(dir, function (err, paths) {
                    var i = 0;
                    paths.forEach(function (path) {
                        var _src = dir + '/' + path;
                        fs.stat(_src, function (err, st) {
                            i++;
                            if (err) {
                                //throw err;
                                return;
                            }
                            if (st.isFile()) {
                                files.push(_src);
                            } else if (st.isDirectory()) {
                                travel(_src, finish);
                            }
                            if (i >= paths.length) {
                                pool.delete(dir);
                                if (pool.size == 0) {
                                    finish(files);
                                }
                            }
                        });
                    });

                    if (paths.length == 0) {
                        pool.delete(dir);
                        if (pool.size == 0) {
                            console.log('finish2');
                            finish(files);
                        }
                        //resolve(files);
                    }
                });
            } catch (error) {
                pool.delete(dir);
                if (pool.size == 0) {
                    console.log('finish3');
                    finish(files);
                }
            }

        }
        return new Promise(function (resolve, reject) {
            try {
                travel(dir, function (files) {
                    resolve(files);
                })
            } catch (error) {
                reject(error);
            }
        });
    }
    static async getFiles(src) {
        var files = await this.travelSync(src);
        //console.log(files);
        return files;
        //return files;
    }
    static exists(src, dst, callback) {
        fs.exists(dst, function (exists) {
            if (exists) {//存在
                callback(src, dst);
            } else {//bu存在
                fs.mkdir(dst, function () {//创建目录
                    callback(src, dst)
                })
            }
        })
    }
}

export default Files;