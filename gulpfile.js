var gulp = require('gulp');
var path = require('path'),
    const babel = require('gulp-babel');
var proxyMiddleware = require('http-proxy-middleware');
var source = require("vinyl-source-stream");
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var config = {
    proxyTable: [{
        url: [],
        target: ''
    }],
    version: '',
    rootDir: ['demos'],
    igroneHtml: false
}
if (config.version) {
    config.version = config.version + '/';
}
var compileArray = [];
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}

function addTask(name, fun) {
    compileArray.push(name);
    gulp.task(name, fun);
}

config.rootDir.map(function (curfile) {
    //js 压缩
    if (curfile) {
        curfile = curfile + '/';
    }
    var cursrc = './src/' + curfile;
    var curdist = './dist/' + curfile;
    var curfilename = curfile.replace('.', '').replace('/', '');
    addTask("requirejs_" + curfilename, function () {
        return browserify({
                entries: [src + '/*/js/main.js'], //指定打包入口文件
                debug: !!!argv.m && !!!argv.p, // 告知Browserify在运行同时生成内联sourcemap用于调试,只有在dev模式并且不压缩才有
            })

            .transform(babelify, { //此处babel的各配置项格式与.babelrc文件相同
                presets: [
                    'es2015', //转换es6代码
                    'stage-0', //指定转换es7代码的语法提案阶段
                ],
                plugins: [
                    "transform-runtime" //添加es5不支持的模块比如Object.assing()
                ]
            })
            .bundle() //合并打包
            .pipe(source(argv.m ? 'all.min.js' : 'all.js')) //将常规流转换为包含Stream的vinyl对象，并且重命名
            .pipe(buffer()) //将vinyl对象内容中的Stream转换为Buffer
            .pipe(es3ify())
            //////压缩不支持ie8以下
            //.pipe(gulpif(argv.m, uglify({ie8: true})))
            .pipe(gulp.dest(curdist)) //输出打包后的文件
            .pipe(reload({
                stream: true
            }));

        // return gulp.src(cursrc + '**/*.js')
        //     .pipe(babel({
        //         presets: ['es2015']
        //     }))
        //     .pipe(gulp.dest(curdist))
    });
    //图片压缩
    addTask("imagemin_" + curfilename, function () {
        gulp.src(cursrc + '**/*.{png,jpg,gif,ico}')

            .pipe(gulp.dest(curdist))
            .pipe(reload({
                stream: true
            }));
    });
    //媒体文件拷贝
    addTask("media_" + curfilename, function () {
        gulp.src(cursrc + '**/*.{swf,flv,mp4,mp3}')
            .pipe(gulp.dest(curdist))
            .pipe(reload({
                stream: true
            }));
    });
    //sass编译
    addTask("sass_" + curfilename, function () {
        return gulp.src(cursrc + '/!(lib|modules|node_modules)/**/*.{css,scss,sass,less}')
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
    });
    //复制css文件
    addTask("css_" + curfilename, function () {
        return gulp.src(cursrc + '**/*.css')
            .pipe(gulp.dest(curdist))
            .pipe(reload({
                stream: true
            }));
    });
    if (!config.igroneHtml) {
        // 复制html文件
        addTask("htmlmin_" + curfilename, function () {
            var options = {
                removeComments: false, //清除HTML注释
                collapseWhitespace: false, //压缩HTML
                collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
                removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
                removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
                removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"
                minifyJS: false, //压缩页面JS
                minifyCSS: false //压缩页面CSS
            };
            gulp.src(cursrc + '**/*.html')
                .pipe(gulp.dest(curdist))
                .pipe(reload({
                    stream: true
                }));
        });
    }
    //监听文件变化
    addTask("watch_" + curfilename, function () {
        if (!config.igroneHtml) {
            gulp.watch(cursrc + '*/**.html', ['htmlmin_' + curfilename]);
        }
        gulp.watch(cursrc + '**/*.scss', ['sass_' + curfilename]);
        gulp.watch(cursrc + '**/*.css', ['css_' + curfilename]);
        gulp.watch(cursrc + '**/*.js', ['requirejs_' + curfilename]);
        gulp.watch(cursrc + '**/*.{png,jpg,gif,ico}', ['imagemin_' + curfilename]);
        gulp.watch(cursrc + '**/*.tpl', ["htmltojs_" + curfilename]);
    });
});

gulp.task('server', function () {
    var middleware = [];
    for (var i in config.proxyTable) {
        middleware.push(proxyMiddleware(config.proxyTable[i]['url'], {
            target: config.proxyTable[i]['target'],
            changeOrigin: true
        }));
    }
    browserSync.init({
        server: {
            baseDir: './dist',
            middleware: middleware
        }
    });
});

gulp.task('compile', compileArray);
gulp.task('default', ['compile', 'server']); //定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务