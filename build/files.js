var fs = require('fs');
var stat = fs.stat;
var path = require("path");
class Files{
    static copy(src,dst){
        var _self = this;
        fs.readdir(src,function(err,paths){
            if(err){
                throw err;
            }
            paths.forEach(function(path){
                var _src=src+'/'+path;
                var _dst=dst+'/'+path;
                var readable;
                var writable;
                fs.stat(_src,function(err,st){
                    if(err){
                        throw err;
                    }
        
                    if(st.isFile()){
                        readable=fs.createReadStream(_src);//创建读取流
                        writable=fs.createWriteStream(_dst);//创建写入流
                        readable.pipe(writable);
                    }else if(st.isDirectory()){
                        Files.exists(_src,_dst,Files.copy);
                    }
                });
            });
        });
    }
    static getDirs(src,callback){
        fs.readdir(src,function(err,paths){
            var filestlist = new Array();
            paths.forEach(function(path){
                var _src=src+'/'+path;
                var readable;
                var writable;
                fs.stat(_src,function(err,st){
                    if(err){
                        throw err;
                    }
                    if(st.isDirectory()){
                        filestlist.push(_src);
                    }
                });
            });
            callback(filestlist);
        });
        // return filestlist;
    }
    
    static async getFiles(src){
        var pool = new Map();
        var files = [];
        async function travelSync(dir){
            
            await fs.readdir(dir,function(err,paths){
                paths.forEach(function(path){
                    var _src=dir+'/'+path;
                    var i = 0;
                    fs.stat(_src,function(err,st){
                        i++;
                        if(err){
                            throw err;
                        }
                        if(st.isFile()){
                            files.push(_src);
                        }else if(st.isDirectory()){
                            pool.set(_src,1);
                            travelSync(_src);
                        }
                        if(i>=paths.length){
                            pool.delete(dir);
                            console.log(pool);
                        }
                    });
                });
                console.log(paths.length);
                if(paths.length==0){
                    pool.delete(dir);
                }
            });
            //
            
        }
        await travelSync(src);
        await console.log(files);
    }
    static exists(src,dst,callback){
        fs.exists(dst,function(exists){
            if(exists){//不存在
                callback(src,dst);
            }else{//存在
                fs.mkdir(dst,function(){//创建目录
                    callback(src,dst)
                })
            }
        })
    }
}

export default Files;