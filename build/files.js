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
                stat(_src,function(err,st){
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
                stat(_src,function(err,st){
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
        fs.readdir(src,function(err,paths){
            var filestlist = new Array();
            paths.forEach(function(path){
                var _src=src+'/'+path;
                var readable;
                var writable;
                stat(_src,function(err,st){
                    if(err){
                        throw err;
                    }
                    if(st.isFile()){
                        
                        readable.pipe(writable);
                    }else if(st.isDirectory()){
                        Files.exists(_src,_dst,Files.copy);
                    }
                });
            });
            callback(filestlist);
        });
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