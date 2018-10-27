function fPack(options) {
    var defaultOptions = {
        versionc: "",
        enter: 'js/main.js',
        output: 'all.js',
        src: './src/',
        dist: './dist/',
        imagemin: true,
        spriteDir: 'images/icons',
        iconScale:1,
        server: {
            proxyTable: [{
                key:[],
                target:''
            }]
        },
        publish: {
            "svnpath": "",
            "actname": "",
            "codetools": "",
            "gametype": "",
            "devpath": "",
            "tortoiseSvn": ""
        }
    }
    var isdev = false;
    options = Object.assign(defaultOptions, options);
    var gulp = require('gulp');
    var self = this;
    var taskArray = [];

    this.addTask = function (name, fun) {
        taskArray.push(name);
        gulp.task(name, fun);
    }
    

    var through = require('through2');
    var browserSync = require('browser-sync').create();
    var reload = browserSync.reload;
    var gulpif = require('gulp-if');
    var autoprefixer = require('gulp-autoprefixer');
    var modifyCssUrls = require('gulp-modify-css-urls');
    var cssmin = require('gulp-clean-css');
    var rename = require("gulp-rename");
    var cache = require('gulp-cache');
    var imagemin = require('gulp-imagemin');
    var spritesmith = require('gulp.spritesmith');
    var htmlmin = require('gulp-htmlmin');
    var path = require('path');
    var clean = require('gulp-clean');
    var proxyMiddleware = require('http-proxy-middleware');
    function getFolder(){
        
    }
    //添加html压缩
    this.addTask('htmlmin', function () {
        var options = {
            removeComments: !isdev, //清除HTML注释
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: !isdev, //压缩页面JS
            minifyCSS: !isdev //压缩页面CSS
        };
        var filen = "";
        var task = gulp.src(options.src + '/**/*.{html,shtml}')
            .pipe(through.obj(function (file, enc, cb) {
                filen = file.relative.split(path.sep);
                filen.pop();
                filen = '/' + filen.join("/");
                cb(null, file);
            }));
        if (options.htmlmin) {
            task = task.pipe(htmlmin(options));
        }
        task = task.pipe(htmlmin(options))
            ///通过参数判断是否压缩，并修改html的minjs标记处的src
            // .pipe(htmlreplace({
            //     'minjs': 'js/all.js?ver=' + new Date().getTime(),
            //     'cssversions': 'css/index.css?ver=' + new Date().getTime()
            // }))
            .pipe(gulp.dest(options.dist + filen))
            .pipe(reload({
                stream: true
            }));
        return task;
    });

    this.addTask('cssmin', function () {
        let filen = "";
        let isless = false;

        //排除文件,排除lib，modules，node_modules,貌似暂时无效啊
        return gulp.src(options.src + '/!(lib|modules|node_modules)/**/*.{css,scss,sass,less}')
            .pipe(through.obj(function (file, enc, cb) {
                isless = false;
                let type = path.extname(file.relative);
                //是单纯的css也经过sass处理
                if (type == ".less") isless = true;
                filen = file.relative.split(path.sep);
                filen.pop();
                filen = '/' + filen.join("/");
                cb(null, file);
            }))
            .pipe(gulpif(isless, less(), sass().on('error', sass.logError)))
            //.pipe( gulpif(issass, sass().on('error', sass.logError)) )
            //.pipe( gulpif(isless, less()) )
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'Android >= 4.0'],
                cascade: true
            }))
            //给css文件里引用文件加版本号（文件MD5）
            .pipe(modifyCssUrls({
                modify: function (url, filePath) {
                    if ((url.indexOf('//') != -1) || (url.indexOf('images/') == -1)) return url;
                    let urls = url.split('images/');
                    return (options.versionc + urls[0] + 'images/' + version + urls[1] + '?' + (new Date()).getTime());
                }
            }))
            .pipe(gulpif(!isdev, cssmin({
                advanced: true,
                compatibility: 'ie7',
                keepBreaks: true,
                keepSpecialComments: '*'
            })))
            // .pipe(gulpif(!isdev, rename({
            //     suffix: '.min'
            // })))
            .pipe(gulp.dest(options.dist + filen))
            .pipe(reload({
                stream: true
            }));
    });

    this.addTask('imagemin', function () {
        var filen = "";
        return gulp.src([options.src + '/!(lib|modules|node_modules)/**/*.{png,jpg,gif,ico}', '!' + options.src + options.spriteDir + '/**'])
            .pipe(through.obj(function (file, enc, cb) {
                filen = file.relative.split(path.sep);
                filen.pop();
                filen = '/' + filen.join("/");
                cb(null, file);
            }))
            .pipe(cache(imagemin({
                //类型：Number  默认：3  取值范围：0-7（优化等级）
                optimizationLevel: 7,
                //类型：Boolean 默认：false 无损压缩jpg图片
                progressive: true,
                //类型：Boolean 默认：false 隔行扫描gif进行渲染
                interlaced: false,
                //类型：Boolean 默认：false 多次优化svg直到完全优化
                multipass: false,
                //深度压缩模式
                //use: [pngquant({ quality: 70 })]
            })))
            /*.pipe(cache(smushit({
                verbose: true
            })))*/
            .pipe(gulp.dest(options.dist + filen))
            .pipe(reload({
                stream: true
            }));
    });

    this.addTask('sprite', function () {
        var spriteData = gulp.src(options.src + options.spriteDir+'/*.png').pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            padding: 4,
            cssFormat: 'css',
            cssTemplate: function (data) {
                // Convert sprites from an array into an object
                var spriteObj = {};
                var styleString = '';
                var scale = options.iconScale;
                data.sprites.forEach(function (sprite) {
                    styleString += '.icon_' + sprite.name + '{display:inline-block;width:' + Math.round(sprite.width * scale) + 'px;height:' + Math.round(sprite.height * scale) + 'px;background:url(../images/icons/' + sprite.image + ') no-repeat ' + Math.round(sprite.offset_x * scale) + 'px ' + Math.round(sprite.offset_y * scale) + 'px/ ' + Math.round(sprite.total_width * scale) + 'px ' + Math.round(sprite.total_height * scale) + 'px;}\n';
                    // Grab the name and store the sprite under it
                    var name = sprite.name;
                    spriteObj[name] = sprite;

                    // Delete the name from the sprite
                    // delete sprite.name;
                });
                // console.log(yaml.safeDump(spriteObj));
                // Return stringified spriteObj
                return styleString;
            }
        }));
        // console.log(spriteData);
        var imgStream = spriteData.img
            .pipe(gulp.dest(options.dist + '/images/icons'));

        // // Pipe CSS stream through CSS optimizer and onto disk
        var cssStream = spriteData.css
            .pipe(gulp.dest(options.dist + '/css/'));
        return merge(imgStream, cssStream);
    })
    this.addTask('copy',function(){
        var filen = "";
            /////拷贝当前目录下的
            let task1 = gulp.src(src + "/*.!(html|shtml)")
                .pipe(gulp.dest(outpath));
            ///二级目录以上的
            let task2 = gulp.src(src + "/!(lib|modules|node_modules|js|css|images|icons)/**/*.*")
                .pipe(through.obj(function (file, enc, cb) {
                    filen = file.relative.split(path.sep);
                    filen.pop();
                    filen = '/' + filen.join("/");
                    cb(null, file);
                }))
                .pipe(gulp.dest(outpath + filen));

            return merge([task1, task2])
    })
    this.addTask('clean',function(done){
        var task1 = gulp.src(outpath, {
                    read: false
                })
                .pipe(clean());
        var task2 = cache.clearAll(done);
        return merge([task1, task2])
    });

    this.addTask('server',function(){

        var middlewares = [];
        var curproxyTable;
        for(var i in options.server.proxyTable){
            curproxyTable = options.server.proxyTable[i];
            middleware.push(proxyMiddleware(curproxyTable['keys'], {
                target: curproxyTable['target'],
                changeOrigin: true
            }));
        }
        // // 代理配置, 实现环境切换
        // var middleware = proxyMiddleware(proxyTargetKey, {
        //     target: proxyTarget,
        //     changeOrigin: true
        // });
        browserSync.init({
            server: {
                baseDir: outpath,
                index: "index.html",
                middleware: middlewares
            }
        });
    });
    this.addTask('watch',function(){
        //监听排除文件夹外的第一级目录，和二级以上的文件
        gulp.watch([src + '/*.!(html|shtml)', src + '/!(lib|modules|node_modules|js|css|images)/**'], ['copy']);
        //只监听html文件
        gulp.watch(src + '/**/*.{html,shtml}', ['htmlmin']);
        //监听二级目录下的样式文件,一级以上只执行copy
        gulp.watch(src + '/!(lib|modules|node_modules)/**/*.{css,scss,sass,less}', ['buildcss']);
        //监听二级目录下的js文件,执行打包（只会打包成一个文件）。一级以上只执行copy
        gulp.watch(src + '/!(lib|modules|node_modules)/**/*.js', ['modulepack']);
        //监听二级目录下的img文件,执行优化。一级以上只执行copy
        gulp.watch(src + '/!(lib|modules|node_modules)/**/*.{png,jpg,gif,ico}', ['imagemin']);
        gulp.watch(src + '/images/icons/*.png', ['sprite']);
    });


    gulp.task('default', taskArray);
}
module.exports = fPack;