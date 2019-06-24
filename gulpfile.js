var CONFIG = {
    iconScale: 1,
    src: 'demos/src',
    output: 'demos/_dist'
}

var gulp = require('gulp'),

    babelify = require('babelify'),
    co = require('co'),

    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    es3ify = require("gulp-es3ify");

var path = require('path'),
    fs = require('fs');
var tsify = require("tsify");
var through = require('through2');

//设置打包缓存
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var browserify = require('browserify');
var proxyMiddleware = require('http-proxy-middleware');
var source = require("vinyl-source-stream"),
    buffer = require('vinyl-buffer');
var htmlmin = require('gulp-htmlmin'),
    htmlreplace = require('gulp-html-replace');
var imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');
var smushit = require('gulp-smushit');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sass = require('gulp-sass'), //压缩css
    cssmin = require('gulp-clean-css'),
    less = require('gulp-less'),
    //修改css url
    modifyCssUrls = require('gulp-modify-css-urls'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require("gulp-rename");
glob = require('glob'),
    es = require('event-stream');
///合并任务
var merge = require('merge-stream');
//获取命令参数
var argv = require('yargs').argv;
//清除
var clean = require('gulp-clean');
var loadJsonFile = require('load-json-file');
var spritesmith = require('gulp.spritesmith');
//可以多级目录
var version = '';
///在有版本号时，当前的目录嵌套层次
var versionc = "";
for (var i = 0; i < version.split('/').length - 1; i++) {
    versionc += "../";
};
var evr = !!argv.p;
// console.log(argv);
const src = CONFIG.src; //当前路径下的文件夹名
const outpath = CONFIG.output;

var ztGulp = {
    tasks: {
        htmlmin: function () {
            var options = {
                removeComments: false, //清除HTML注释
                collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
                removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
                removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
                removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
                minifyJS: false, //压缩页面JS
                minifyCSS: false //压缩页面CSS
            };
            var filen = "";
            return gulp.src(src + '/**/*.{html,shtml}')
                .pipe(through.obj(function (file, enc, cb) {
                    filen = file.relative.split(path.sep);
                    filen.pop();
                    filen = '/' + filen.join("/");
                    cb(null, file);
                }))
                .pipe(gulp.dest(outpath + filen))
                .pipe(reload({
                    stream: true
                }));
        },
        modulepack: function (done) {
            glob(src+'/**/main.js', function (err, files) {
                if (err) done(err);
                var tasks = files.map(function (entry) {
                    //console.log(outpath+entry.replace(src,'').replace('main.js',''));
                    var curout = outpath+entry.replace(src,'').replace('main.js','');
                    return browserify({
                            entries: [entry]
                        })
                        .bundle()
                        .pipe(source('all.js'))
                        .pipe(buffer()) //将vinyl对象内容中的Stream转换为Buffer
                        .pipe(es3ify())
                        .pipe(gulp.dest(curout))
                        .pipe(reload({
                            stream: true
                        }));
                });
                es.merge(tasks).on('end', done);
            })
            // return browserify({
            //         entries: [src + '/js/main.js'], //指定打包入口文件
            //         debug: !!!argv.m && !!!argv.p, // 告知Browserify在运行同时生成内联sourcemap用于调试,只有在dev模式并且不压缩才有
            //     })
            //     .plugin(tsify)
            //     .transform(babelify, { //此处babel的各配置项格式与.babelrc文件相同
            //         presets: [
            //             'es2015', //转换es6代码
            //             'stage-0', //指定转换es7代码的语法提案阶段
            //         ],
            //         plugins: [
            //             "transform-runtime" //添加es5不支持的模块比如Object.assing()
            //         ]
            //     })
            //     .bundle() //合并打包
            //     .pipe(source(argv.m ? 'all.min.js' : 'all.js')) //将常规流转换为包含Stream的vinyl对象，并且重命名
            //     .pipe(buffer()) //将vinyl对象内容中的Stream转换为Buffer
            //     .pipe(es3ify())
            //     //////压缩不支持ie8以下
            //     //.pipe(gulpif(argv.m, uglify({ie8: true})))
            //     .pipe(gulp.dest(outpath + '/js/')) //输出打包后的文件
            //     .pipe(reload({
            //         stream: true
            //     }));
        },
        buildcss: function () {
            let filen = "",
                isless = false;
            //排除文件,排除lib，modules，node_modules,貌似暂时无效啊
            return gulp.src(src + '/!(lib|modules|node_modules)/**/*.{css,scss,sass,less}')
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
                        return (versionc + urls[0] + 'images/' + version + urls[1] + '?' + (new Date()).getTime());
                    }
                }))
                .pipe(gulpif(!!argv.m, cssmin({
                    //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
                    advanced: true,
                    //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
                    compatibility: 'ie7',
                    //类型：Boolean 默认：false [是否保留换行]
                    keepBreaks: true,
                    //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
                    keepSpecialComments: '*'
                })))
                .pipe(gulpif(!!argv.m, rename({
                    suffix: '.min'
                })))
                .pipe(gulp.dest(outpath + filen))
                .pipe(reload({
                    stream: true
                }));
        },
        imagemin: function () {
            var filen = "";
            return gulp.src([src + '/!(lib|modules|node_modules)/**/*.{png,jpg,gif,ico,svg}', '!' + src + '/images/icons/**'])
                .pipe(through.obj(function (file, enc, cb) {

                    filen = file.relative.split(path.sep);
                    filen.pop();
                    filen = '/' + filen.join("/");
                    cb(null, file);
                }))
                .pipe(cache(imagemin({
                    //类型：Number  默认：3  取值范围：0-7（优化等级）
                    optimizationLevel: 6,
                    //类型：Boolean 默认：false 无损压缩jpg图片
                    progressive: true,
                    //类型：Boolean 默认：false 隔行扫描gif进行渲染
                    interlaced: false,
                    //类型：Boolean 默认：false 多次优化svg直到完全优化
                    multipass: false,
                    //深度压缩模式
                    use: [pngquant({
                        quality: 70
                    })]
                })))
                /*.pipe(cache(smushit({
                    verbose: true
                })))*/
                .pipe(gulp.dest(outpath + filen))
                .pipe(reload({
                    stream: true
                }));
        },

        sprite: function () {
            var spriteData = gulp.src(src + '/images/icons/*.png').pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.scss',
                padding: 4,
                cssFormat: 'scss',
                cssTemplate: function (data) {
                    // Convert sprites from an array into an object
                    var spriteObj = {};
                    var styleString = '';
                    var scale = CONFIG.iconScale;
                    data.sprites.forEach(function (sprite) {
                        styleString += '.icon_' + sprite.name + '{display:inline-block;width:' + Math.round(sprite.width * scale) + 'px;height:' + Math.round(sprite.height * scale) + 'px;background:url(../images/icons/' + sprite.image + ') no-repeat ' + Math.round(sprite.offset_x * scale) + 'px ' + Math.round(sprite.offset_y * scale) + 'px ' + ';}\n';
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
                .pipe(gulp.dest(outpath + '/images/icons'));

            // // Pipe CSS stream through CSS optimizer and onto disk
            var cssStream = spriteData.css
                .pipe(gulp.dest(src + '/css/'));
            return merge(imgStream, cssStream);
            // return spriteData.pipe(gulp.dest(outpath+'/sprite/'));
        },

        copy: function () {

            var filen = "";
            /////拷贝当前目录下的
            let task1 = gulp.src(src + "/*.!(html|shtml)")
                .pipe(gulp.dest(outpath));
            ///二级目录以上的
            let task2 = gulp.src(src + "/**/!(lib|modules|node_modules|js|css|images|icons|api)/*.*")
                .pipe(through.obj(function (file, enc, cb) {
                    filen = file.relative.split(path.sep);
                    filen.pop();
                    filen = '/' + filen.join("/");
                    cb(null, file);
                }))
                .pipe(gulp.dest(outpath + filen));

            return merge([task1, task2])

        },
        clean: function () {
            return gulp.src(outpath, {
                read: false
            })
            .pipe(clean());
            //清空目录
        },
        clear: function (done) {
            return cache.clearAll(done);
        },
        server: function () {

            //port = parseInt(9999 * Math.random());
            var proxyTargetKey = 'api.php'; //默认为数组，参数为空则不使用
            var proxyTarget = "http://act.balls.web.ztgame.com/bgf2018/"; //使用代理
            // 代理配置, 实现环境切换
            var middleware = proxyMiddleware(proxyTargetKey, {
                target: proxyTarget,
                changeOrigin: true
            });
            browserSync.init({
                server: {
                    baseDir: outpath,
                    index: "index.html",
                    middleware: middleware
                }
            });
        }
    },

    watch: function () {
        //监听排除文件夹外的第一级目录，和二级以上的文件
        gulp.watch([src + '/**/*.!(html|shtml)', src + '/!(lib|modules|node_modules|js|css|images)/**'], ['copy']);
        //只监听html文件
        gulp.watch(src + '/**/*.{html,shtml}', ['htmlmin']);
        //监听二级目录下的样式文件,一级以上只执行copy
        gulp.watch(src + '/!(lib|modules|node_modules)/**/*.{css,scss,sass,less}', ['buildcss']);
        //监听二级目录下的js文件,执行打包（只会打包成一个文件）。一级以上只执行copy
        gulp.watch(src + '/!(lib|modules|node_modules)/**/*.{js,ts}', ['modulepack']);
        //监听二级目录下的img文件,执行优化。一级以上只执行copy
        gulp.watch(src + '/!(lib|modules|node_modules)/**/*.{png,jpg,gif,ico,svg}', ['imagemin']);
        gulp.watch(src + '/**/images/icons/*.png', ['sprite']);
    },
    setTasks: function () {
        for (var i in this.tasks) {
            gulp.task(i, this.tasks[i].bind(this));
        }
        gulp.task('compile', ['modulepack', 'buildcss']);
        //开发构建
        gulp.task('dev', function (done) {
            condition = false;
            runSequence(
                ['clean'], ['clear'], ['copy'], ['compile'], ['htmlmin'], ['imagemin'], ['sprite'], ['server'],
                done);
        });
        gulp.task('default', ['dev']); //定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务
    },
    init: function () {
        this.setTasks();
        this.watch();
    }
}
ztGulp.init();